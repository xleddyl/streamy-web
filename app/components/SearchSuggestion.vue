<template>
   <div class="flex justify-between gap-5 text-white">
      <template v-if="valid && !!search">
         <div
            class="__clickable flex gap-3 max-md:flex-col max-md:justify-center md:gap-5"
            @click="$emit('add')"
         >
            <div class="max-w-none overflow-hidden rounded-xl md:max-w-[10rem]">
               <Image :src="search.thumbnail" alt="cover" />
            </div>
            <p class="max-w-none font-title text-sm font-medium md:max-w-[20rem] md:text-lg">
               {{ search.title }}
            </p>
         </div>

         <Icon
            name="x-mark"
            class="__clickable size-6 opacity-50 max-md:hidden"
            @click="$emit('delete')"
         />
      </template>
      <p v-else class="opacity-20">{{ $t('common_error.video_not_found') }}</p>
   </div>
</template>

<script lang="ts" setup>
type Props = {
   valid: boolean
   search?: SearchResult
}
type Emits = {
   delete: []
   add: []
}
const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<Emits>()
</script>
