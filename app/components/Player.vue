<template>
   <div class="flex w-full flex-col gap-3">
      <div class="h-[30rem] select-none overflow-hidden rounded-3xl md:h-[40rem]">
         <div class="size-full">
            <div class="size-full" id="player" />
         </div>
      </div>
      <div class="mx-2 flex justify-between gap-4 max-md:flex-col md:mx-5 md:gap-10">
         <p class="font-title text-lg font-semibold text-white md:text-xl">
            {{ title }}
         </p>
         <div class="flex flex-col justify-between gap-1">
            <div class="flex gap-2">
               <Button :disabled="!currentVideoId" type="icon" @click="emit('prev')">
                  <Icon name="backward" class="size-6" />
               </Button>
               <Button
                  :disabled="!currentVideoId"
                  type="icon"
                  @click="
                     emit(
                        'playPause',
                        player?.getCurrentTime() || 0,
                        videoState.isPlaying ? 'pause' : 'play'
                     )
                  "
               >
                  <Icon v-show="videoState.isPlaying" name="pause" class="size-6" />
                  <Icon v-show="!videoState.isPlaying" name="play" class="size-6" />
               </Button>

               <Button :disabled="!currentVideoId" type="icon" @click="emit('next')">
                  <Icon name="forward" class="size-6" />
               </Button>
            </div>
            <p class="select-none text-white opacity-20 md:ml-auto">
               {{
                  $t('screen.index.home.queued_videos', {
                     index: props.videoState.queueIdx === -1 ? 0 : props.videoState.queueIdx + 1,
                     count: props.videoState.queue.length,
                  })
               }}
            </p>
         </div>
      </div>
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
   next: []
   prev: []
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emits>()
const { $loadYouTubeIframeAPI } = useNuxtApp()

const player = ref<YT.Player>()
const playerReady = ref<boolean>(false)
const playerSyncing = ref<boolean>(false)
const title = ref<string>('')
const currentVideoId = ref<string>('')

watch(
   [() => props.videoState, () => playerReady.value],
   ([videoState, ready]) => {
      if (!ready || !player.value) return

      playerSyncing.value = true

      if (
         videoState.isReconnection ||
         currentVideoId.value !== videoState.queue[videoState.queueIdx]
      ) {
         currentVideoId.value = videoState.queue[videoState.queueIdx] || ''
         player.value.loadVideoById(currentVideoId.value)
      } else {
         switch (videoState.lastCommand) {
            case 'seek': {
               player.value.seekTo(videoState.currentTime, true)
               break
            }
            case 'play': {
               player.value.playVideo()
               break
            }
            case 'pause': {
               player.value.pauseVideo()
               break
            }
            case 'rate': {
               player.value.setPlaybackRate(videoState.rate)
               break
            }
         }
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
            autoplay: 1,
            hl: 'en',
         },
         videoId: props.videoState.queue[props.videoState.queueIdx],
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
                  case -1: {
                     player.value.playVideo()
                     break
                  }
                  case 0: {
                     emit('next')
                     break
                  }
                  case 1:
                  case 2: {
                     emit(
                        'playPause',
                        player.value?.getCurrentTime() || 0,
                        event.data === 1 ? 'play' : 'pause'
                     )
                     break
                  }
                  case 3: {
                     emit('seek', player.value?.getCurrentTime() || 0)
                     break
                  }
               }
            },
         },
      })
   }
})
</script>
