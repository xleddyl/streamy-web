<template>
   <main class="__center flex flex-col gap-4">
      <TextInput
         v-model="url"
         @submit="handleAddToQueue"
         :placeholder="$t('screen.index.home.add_link_placeholder')"
         :buttonText="$t('common.add_queue')"
      />
      <Player
         :videoState="peer.data.videoState.value"
         @seek="handleSeek"
         @play-pause="handlePlayPause"
         @rate="handleRate"
         @next="handleNext"
         @prev="handlePrev"
      />
   </main>
</template>

<script lang="ts" setup>
const route = useRoute()
const peer = usePeer()

const url = ref<string>('')

const handleAddToQueue = () => {
   if (url.value) {
      peer.sendMessage({
         type: 'queue',
         command: {
            type: 'add',
            url: url.value,
         },
      })
   }
   url.value = ''
}

const handlePlayPause = (timestamp: number, type: 'play' | 'pause') => {
   peer.sendMessage({
      type: 'player',
      command: {
         type,
         timestamp,
      },
   })
}

const handleRate = (rate: number) => {
   peer.sendMessage({
      type: 'player',
      command: {
         type: 'rate',
         rate,
      },
   })
}

const handleSeek = (timestamp: number) => {
   peer.sendMessage({
      type: 'player',
      command: {
         type: 'seek',
         timestamp,
      },
   })
}

const handleNext = () => {
   peer.sendMessage({
      type: 'queue',
      command: {
         type: 'next',
      },
   })
}

const handlePrev = () => {
   peer.sendMessage({
      type: 'queue',
      command: {
         type: 'prev',
      },
   })
}

onMounted(() => {
   if (peer.data.isHost.value) return
   peer.joinRoom(route.params.id as string)
})
</script>
