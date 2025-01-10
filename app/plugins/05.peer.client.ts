import { PeeringAttachment } from '@pulumi/aws/ec2transitgateway'
import { Peer } from 'peerjs'
import type { DataConnection } from 'peerjs'

type ConnectionMap = Map<string, DataConnection>
type Commands = 'seek' | 'play' | 'pause' | 'video' | 'rate' | 'add' | 'next' | 'prev'
type Message =
   | {
        type: 'player'
        command:
           | {
                type: 'seek'
                timestamp: number
             }
           | {
                type: 'play'
                timestamp: number
             }
           | {
                type: 'pause'
                timestamp: number
             }
           | {
                type: 'rate'
                rate: number
             }
     }
   | {
        type: 'queue'
        command:
           | {
                type: 'add'
                url: string
             }
           | {
                type: 'next'
             }
           | {
                type: 'prev'
             }
     }

export type VideoState = {
   currentTime: number
   isPlaying: boolean
   lastCommand: Commands
   isReconnection: boolean
   rate: number

   queueIdx: number
   queue: string[]
}

const DEFAULT_VIDEO_STATE: VideoState = {
   currentTime: 0,
   isPlaying: false,
   lastCommand: 'add',
   isReconnection: false,
   rate: 1,

   queueIdx: -1,
   queue: [],
}

export default defineNuxtPlugin(() => {
   const peerInstance = useState<Peer | undefined>('peer-instance', () => undefined)
   const connections = useState<ConnectionMap>('connections', () => new Map())
   const isHost = useState<boolean>('is-host', () => false)
   const videoState = useState<VideoState>('video-state', () => DEFAULT_VIDEO_STATE)
   const connectionStatus = useState<'connected' | 'not-connected'>(
      'connection-status',
      () => 'not-connected'
   )

   const create = () => {
      destroy()
      peerInstance.value = new Peer()
      return peerInstance
   }

   const destroy = () => {
      connections.value.forEach((conn) => {
         conn.close()
      })
      connections.value.clear()

      if (peerInstance.value) {
         peerInstance.value.disconnect()
         peerInstance.value.destroy()
         peerInstance.value = undefined
      }

      isHost.value = false
      connectionStatus.value = 'not-connected'
      videoState.value = DEFAULT_VIDEO_STATE
   }

   const createRoom = () => {
      const peer = create()

      peer.value?.on('open', (id: string) => {
         isHost.value = true
         connectionStatus.value = 'connected'
         peer.value?.on('connection', (connection: DataConnection) => {
            handleConnection(connection)
         })
         navigateTo(`/${id}`)
      })
   }

   const joinRoom = (hostId: string) => {
      const peer = create()

      peer.value?.on('open', (id: string) => {
         isHost.value = false
         const connection = peer.value?.connect(hostId, {
            reliable: true,
         })
         handleConnection(connection)
      })
   }

   const handleConnection = (connection: DataConnection | undefined) => {
      connection?.on('open', () => {
         if (isHost.value) {
            connection.send({ ...videoState.value, isReconnection: true })
         }
         connectionStatus.value = 'connected'
         connections.value.set(connection.peer, connection)
      })

      connection?.on('data', (data: unknown) => {
         videoState.value = data as VideoState
         if (isHost.value) {
            propagateData(videoState.value)
         }
      })

      connection?.on('close', () => {
         connectionStatus.value = 'not-connected'
         connections.value.delete(connection.peer)
      })
   }

   const sendMessage = (message: Message) => {
      videoState.value = transformMessage(message)
      if (isHost.value) {
         connections.value.forEach((connection) => {
            connection.send(videoState.value)
         })
         return
      }

      const connection = connections.value.values().next().value
      connection?.send(videoState.value)
   }

   const propagateData = (video: VideoState) => {
      connections.value.forEach((connection) => {
         connection.send(video)
      })
      return
   }

   const transformMessage = (data: Message) => {
      videoState.value.lastCommand = data.command.type
      videoState.value.isReconnection = false

      switch (data.type) {
         case 'player': {
            switch (data.command.type) {
               case 'seek': {
                  videoState.value.currentTime = data.command.timestamp
                  break
               }
               case 'play': {
                  videoState.value.isPlaying = true
                  videoState.value.currentTime = data.command.timestamp
                  break
               }
               case 'pause': {
                  videoState.value.isPlaying = false
                  videoState.value.currentTime = data.command.timestamp
                  break
               }
               case 'rate': {
                  videoState.value.rate = data.command.rate
                  break
               }
            }
            break
         }
         case 'queue': {
            switch (data.command.type) {
               case 'add': {
                  const regex = /(?:youtu\.be\/|[?&]v=)([^?&]+)/
                  const id = data.command.url.match(regex)?.[1] || ''
                  videoState.value.queue.push(id)

                  if (videoState.value.queueIdx === -1) {
                     videoState.value.queueIdx = 0
                  }
                  break
               }
               case 'next': {
                  if (videoState.value.queueIdx >= videoState.value.queue.length - 1) {
                     videoState.value.queueIdx = 0
                  } else {
                     videoState.value.queueIdx += 1
                  }
                  videoState.value.currentTime = 0
                  videoState.value.rate = 1
                  break
               }
               case 'prev': {
                  if (videoState.value.queueIdx <= 0) {
                     videoState.value.queueIdx = videoState.value.queue.length - 1
                  } else {
                     videoState.value.queueIdx -= 1
                  }
                  videoState.value.currentTime = 0
                  videoState.value.rate = 1
                  break
               }
            }
         }
      }

      return videoState.value
   }

   return {
      provide: {
         peer: {
            createRoom,
            joinRoom,
            sendMessage,
            data: {
               isHost,
               connections,
               videoState,
               connectionStatus,
            },
         },
      },
   }
})
