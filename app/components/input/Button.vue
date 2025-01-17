<template>
   <button
      class="__clickable relative h-fit overflow-hidden rounded-3xl font-title font-medium text-white"
      :class="{
         'bg-candy-apple-red px-5 py-2 md:px-8': type === 'primary',
         'rounded-xl bg-charleston-green px-4 py-2': type === 'icon',
         'pointer-events-none opacity-20': disabled,
      }"
      :disabled
   >
      <slot />
      <div
         class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-charleston-green/90 opacity-0 transition-opacity"
         :class="{ 'pointer-events-auto opacity-100': loading }"
      >
         <Icon name="spinner" class="size-6 animate-spin" />
      </div>
   </button>
</template>

<script lang="ts" setup>
type Props = {
   type?: 'primary' | 'search' | 'icon'
   disabled?: boolean
   loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
   type: 'primary',
})
</script>
