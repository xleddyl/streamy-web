<template>
   <header class="__center flex justify-between py-5">
      <NuxtLink class="__clickable" to="/">
         <Icon name="logotype" class="h-10 w-40" />
      </NuxtLink>
      <div />
      <Button v-if="$route.fullPath === '/'" @click="handleCreateRoom">
         {{ $t('common.create_room') }}
      </Button>
   </header>
</template>

<script lang="ts" setup>
const peer = usePeer()

const handleCreateRoom = () => {
   peer.createRoom()
}
</script>
