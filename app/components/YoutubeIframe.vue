<template>
   <div id="player" />
</template>

<script lang="ts" setup>
import type { VideoState } from '~/plugins/05.peer.client'

type Props = {
   videoState: VideoState
}

type Emits = {
   seek: [number]
   play: [number]
   pause: [number]
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()

const player = ref<any>(null)
const playerReady = ref<boolean>(false)
const playerSyncing = ref<boolean>(false)

watch(
   () => props.videoState,
   (video) => {
      if (!playerReady.value || !player.value) return
      playerSyncing.value = true
      switch (video.lastCommand) {
         case 'seek':
            player.value.seekTo(video.currentTime)
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
      }
      playerSyncing.value = false
   },
   { deep: true, immediate: true }
)

const initializePlayer = () => {
   player.value = new YT.Player('player', {
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
         origin: window.location.origin,
         enablejsapi: 1,
         modestbranding: 1,
         rel: 0,
      },
      videoId: props.videoState.id,
      events: {
         onReady: () => {
            playerReady.value = true
         },
         onStateChange: (event: any) => {
            if (!playerReady.value || playerSyncing.value) return
            switch (event.data) {
               case 1: // play
                  emit('play', player.value.getCurrentTime())
                  break
               case 2: // pause
                  emit('pause', player.value.getCurrentTime())
                  break
               case 3: // seek
                  emit('seek', player.value.getCurrentTime())
                  break
            }
         },
      },
   })
}

onMounted(() => {
   if (!player.value) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
         if (!player.value) initializePlayer()
      }
   } else {
      playerReady.value = true // If already initialized, mark it as ready
   }
})
</script>
