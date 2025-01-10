<template>
   <header class="__center mb-2 flex items-center justify-between py-5">
      <div class="flex gap-0 max-md:flex-col md:items-center md:gap-4">
         <NuxtLink class="__clickable" to="/">
            <Icon name="logotype" class="h-8 w-32" />
         </NuxtLink>
         <p v-if="$route.fullPath !== '/'" class="font-title text-white/20">
            {{ title }}
         </p>
      </div>
      <Button
         v-if="$route.fullPath === '/' || peer.data.connectionStatus.value === 'not-connected'"
         @click="handleCreateRoom"
      >
         {{ $t('common.create_room') }}
      </Button>
      <Button v-else @click="handleShareRoom">
         {{ $t('common.share_room') }}
      </Button>
   </header>
</template>

<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'

const peer = usePeer()
const { $notification } = useNuxtApp()
const { t } = useI18n()
const { copy } = useClipboard()

const handleCreateRoom = () => {
   peer.createRoom()
}

const title = computed(() => {
   if (peer.data.isHost.value) {
      return t('component.header.host')
   }
   if (peer.data.connectionStatus.value === 'connected') {
      return t('component.header.connected')
   }
   return t('component.header.not_connected')
})

const handleShareRoom = async () => {
   await copy(window.location.href)
   $notification.add({
      title: t('common_info.share_title'),
      description: t('common_info.share_description'),
   })
}
</script>
