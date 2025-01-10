<template>
   <div class="flex h-96 w-full flex-col gap-2 md:h-[45rem]">
      <div class="size-full overflow-hidden rounded-xl">
         <div class="size-full" id="player" />
      </div>
      <p class="ml-2 font-title text-lg font-semibold text-white md:ml-5 md:text-xl">{{ title }}</p>
   </div>
</template>

<script lang="ts" setup>
import type { VideoState } from '~/plugins/05.peer.client'

type Props = {
   videoState: VideoState
}

type Emits = {
   seek: [number]
   playPause: [number, 'play' | 'pause']
   rate: [number]
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()
const { $loadYouTubeIframeAPI } = useNuxtApp()

const player = ref<YT.Player>()
const playerReady = ref<boolean>(false)
const playerSyncing = ref<boolean>(false)
const title = ref<string>('')

watch(
   [() => props.videoState, () => playerReady.value],
   ([video, ready]) => {
      if (!ready || !player.value) return
      playerSyncing.value = true

      if (video.isReconnection) {
         player.value.loadVideoById(video.id)
         playerSyncing.value = false
         return
      }

      switch (video.lastCommand) {
         case 'seek':
            player.value.seekTo(video.currentTime, true)
            break
         case 'play':
            player.value.playVideo()
            break
         case 'pause':
            player.value.pauseVideo()
            break
         case 'video':
            player.value.loadVideoById(video.id)
            break
         case 'rate':
            player.value.setPlaybackRate(video.rate)
            break
      }
      playerSyncing.value = false
   },
   { deep: true, immediate: true }
)

onMounted(async () => {
   if (!player.value) {
      const YT = await $loadYouTubeIframeAPI()
      player.value = new YT.Player('player', {
         host: 'https://www.youtube-nocookie.com',
         playerVars: {
            origin: window.location.origin,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            autoplay: 1,
            hl: 'en',
         },
         videoId: props.videoState.id,
         events: {
            onReady: () => {
               playerReady.value = true
            },
            onPlaybackRateChange: ({ data }) => {
               if (!playerReady.value || playerSyncing.value || !player.value) return
               emit('rate', data)
            },
            onStateChange: (event: any) => {
               if (!playerReady.value || playerSyncing.value || !player.value) return
               title.value = player.value?.getIframe().title
               switch (event.data) {
                  case 1:
                  case 2:
                     emit(
                        'playPause',
                        player.value?.getCurrentTime() || 0,
                        event.data === 1 ? 'play' : 'pause'
                     )
                     break
                  case 3:
                     emit('seek', player.value?.getCurrentTime() || 0)
                     break
               }
            },
         },
      })
   }
})
</script>
