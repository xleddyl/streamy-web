<template>
   <button
      class="__clickable h-fit rounded-3xl font-title font-medium text-white"
      :class="{
         'bg-candy-apple-red px-5 py-2 md:px-8': type === 'primary',
         'rounded-xl bg-charleston-green px-4 py-2': type === 'icon',
         'pointer-events-none opacity-20': disabled,
      }"
      :disabled
   >
      <slot />
   </button>
</template>

<script lang="ts" setup>
type Props = {
   type?: 'primary' | 'search' | 'icon'
   disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
   type: 'primary',
})
</script>
