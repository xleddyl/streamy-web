<template>
   <header class="__center mb-2 flex items-center justify-between py-5">
      <NuxtLink class="__clickable" to="/">
         <Icon name="logotype" class="h-8 w-32" />
      </NuxtLink>
      <div />
      <Button v-if="$route.fullPath === '/'" @click="handleCreateRoom">
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

const handleShareRoom = async () => {
   await copy(window.location.href)
   $notification.add({
      title: t('common_info.share_title'),
      description: t('common_info.share_description'),
   })
}
</script>
