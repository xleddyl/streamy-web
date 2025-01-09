<template>
   <main class="__center flex items-center justify-center">
      <div class="flex flex-col gap-2">
         <KeepAlive>
            <YoutubeIframe
               :videoState="peer.data.video.value"
               @seek="
                  (t) =>
                     peer.sendMessage({
                        type: 'seek',
                        data: t,
                     })
               "
               @play="
                  (t) =>
                     peer.sendMessage({
                        type: 'play',
                        data: t,
                     })
               "
               @pause="
                  (t) =>
                     peer.sendMessage({
                        type: 'pause',
                        data: t,
                     })
               "
            />
         </KeepAlive>
         <input type="text" class="rounded-2xl border-2" v-model="video" />
         <Button @click="handleSendMessage">set video</Button>
      </div>
   </main>
</template>

<script lang="ts" setup>
const route = useRoute()
const peer = usePeer()

const video = ref<string>('')

const handleSendMessage = () => {
   peer.sendMessage({
      type: 'video',
      data: video.value,
   })
}

onMounted(() => {
   if (peer.data.isHost.value) return
   peer.joinRoom(route.params.id as string)
})
</script>
