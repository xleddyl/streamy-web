<template>
   <button
      class="__clickable rounded-3xl bg-candy-apple-red px-8 py-3 font-title font-semibold text-white"
   >
      <slot />
   </button>
</template>

<script lang="ts" setup>
type Props = {}
const props = withDefaults(defineProps<Props>(), {})
</script>
