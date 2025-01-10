<template>
   <main class="__center flex flex-col gap-2 md:gap-4">
      <TextInput
         v-model="url"
         @submit="handleNewUrl"
         :placeholder="$t('screen.index.home.add_link_placeholder')"
         :buttonText="$t('common.play')"
      />
      <Player
         :videoState="peer.data.video.value"
         @seek="handleSeek"
         @play-pause="handlePlayPause"
         @rate="handleRate"
      />
   </main>
</template>

<script lang="ts" setup>
const route = useRoute()
const peer = usePeer()

const url = ref<string>('')

const handleNewUrl = () => {
   peer.sendMessage({
      type: 'video',
      url: url.value,
   })
   url.value = ''
}

const handlePlayPause = (t: number, type: 'play' | 'pause') => {
   peer.sendMessage({
      type,
      timestamp: t,
   })
}

const handleRate = (rate: number) => {
   peer.sendMessage({
      type: 'rate',
      rate,
   })
}

const handleSeek = (t: number) => {
   peer.sendMessage({
      type: 'seek',
      timestamp: t,
   })
}

onMounted(() => {
   if (peer.data.isHost.value) return
   peer.joinRoom(route.params.id as string)
})
</script>
