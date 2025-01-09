import { PeeringAttachment } from '@pulumi/aws/ec2transitgateway'
import { Peer } from 'peerjs'
import type { DataConnection } from 'peerjs'

type ConnectionMap = Map<string, DataConnection>

type Message = {
   type: 'seek' | 'play' | 'pause' | 'video'
   data: any
}

export type VideoState = {
   id: string
   currentTime: number
   isPlaying: boolean
   lastCommand: Message['type']
}

export default defineNuxtPlugin(() => {
   const peerInstance = useState<Peer | undefined>('peer-instance', () => undefined)

   const isHost = useState<boolean>('peer-is-host', () => false)
   const roomId = useState<string>('peer-room-id', () => '')
   const connections = useState<ConnectionMap>('peer-room-connections', () => new Map())
   const selfId = useState<string>('peer-self-id', () => '')
   const video = useState<VideoState>('peer-room-video', () => ({
      id: '',
      currentTime: 0,
      isPlaying: false,
      lastCommand: 'video',
   }))

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
      roomId.value = ''
      selfId.value = ''
   }

   const createRoom = () => {
      const peer = create()

      peer.value?.on('open', (id: string) => {
         isHost.value = true
         roomId.value = id
         selfId.value = id

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
         roomId.value = hostId
         selfId.value = id
         const connection = peer.value?.connect(hostId, {
            reliable: true,
         })

         handleConnection(connection)
      })
   }

   const handleConnection = (connection: DataConnection | undefined) => {
      connection?.on('open', () => {
         connections.value.set(connection.peer, connection)
         if (isHost.value) {
            connection.send(video.value)
         }
      })

      connection?.on('data', (data: unknown) => {
         video.value = data as VideoState
      })

      connection?.on('close', () => {
         connections.value.delete(connection.peer)
      })
   }

   const sendMessage = (message: Message) => {
      video.value = transformMessage(message)
      if (isHost.value) {
         connections.value.forEach((connection) => {
            connection.send(video.value)
         })
         return
      }

      const connection = connections.value.values().next().value
      connection?.send(video.value)
   }

   const transformMessage = (data: Message) => {
      video.value.lastCommand = data.type

      switch (data.type) {
         case 'seek': {
            video.value.currentTime = data.data
            break
         }
         case 'play': {
            video.value.isPlaying = true
            video.value.currentTime = data.data
            break
         }
         case 'pause': {
            video.value.isPlaying = false
            video.value.currentTime = data.data
            break
         }
         case 'video': {
            const regex = /[?&]v=([^&]+)/
            const match = data.data.match(regex)
            video.value.id = match?.[1] || ''
            video.value.currentTime = 0
            break
         }
      }

      return video.value
   }

   return {
      provide: {
         peer: {
            createRoom,
            joinRoom,
            sendMessage,
            data: {
               isHost,
               roomId,
               connections,
               selfId,
               video,
            },
         },
      },
   }
})
