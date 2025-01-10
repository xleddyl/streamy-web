<template>
   <button
      class="__clickable rounded-3xl font-title font-medium text-white"
      :class="{
         'bg-candy-apple-red px-5 py-2 md:px-8 md:py-3': primary,
      }"
   >
      <slot />
   </button>
</template>

<script lang="ts" setup>
type Props = {
   primary?: boolean
   search?: boolean
}
const props = withDefaults(defineProps<Props>(), {
   primary: true,
})
</script>
