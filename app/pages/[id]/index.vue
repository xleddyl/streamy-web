<template>
   <main class="__center flex flex-col gap-4">
      <TextInput
         v-model="url"
         @submit="handleAddToQueue"
         class="ml-auto w-full max-w-none md:max-w-[40rem]"
         :placeholder="$t('screen.index.home.add_link_placeholder')"
         :buttonText="$t('common.add_queue')"
         :showSuggestion="!!url && !searchLoading"
         :buttonDisabled="!validUrl"
         :buttonLoading="searchLoading"
      >
         <template #suggestion>
            <SearchSuggestion
               :search="searchResult"
               :valid="validUrl"
               @delete="handleDeleteSearch"
               @add="handleAddToQueue"
            />
         </template>
      </TextInput>
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
import { type SearchResult, scrapeLink } from '~/utils/scrape-link'

const route = useRoute()
const peer = usePeer()
const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/

const url = ref<string>('')
const searchLoading = ref<boolean>(false)

const searchResult = ref<SearchResult>()
const validUrl = computed(
   () => !!searchResult.value && !!searchResult.value.thumbnail && !!searchResult.value.title
)

watch(url, async (curr) => {
   searchResult.value = undefined
   if (curr === '' || !(curr && youtubeRegex.test(curr))) {
      return
   }
   searchLoading.value = true
   searchResult.value = await debouncedUrl(curr)
})

const debouncedUrl = useDebounceFn(async (url: string) => {
   try {
      return await scrapeLink(url)
   } catch (e) {
      return
   } finally {
      searchLoading.value = false
   }
}, 1000)

const handleDeleteSearch = () => {
   url.value = ''
   searchResult.value = undefined
}

const handleAddToQueue = () => {
   if (!(url.value && youtubeRegex.test(url.value)) || !validUrl.value) return
   peer.sendMessage({
      type: 'queue',
      command: {
         type: 'add',
         url: url.value,
      },
   })
   url.value = ''
   searchResult.value = undefined
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
