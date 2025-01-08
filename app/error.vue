<template>
   <main class="flex min-h-screen flex-col items-center justify-center gap-10">
      <div
         class="flex flex-col items-center justify-center gap-1 text-center font-title text-3xl font-bold"
      >
         <p class="w-fit rotate-90">{{ ':(' }}</p>
         <h1 class="error-message">{{ message }}</h1>
      </div>
      <NuxtLink title="home" :to="localePath('/')">
         <p class="__clickable underline">{{ $t('common.back') }}</p>
      </NuxtLink>
   </main>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps({
   error: Object as () => NuxtError,
})

const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()

const message = computed(() => {
   switch (props.error?.statusCode) {
      case 404: {
         return t('common_error.404')
      }
      case 500: {
         if (runtimeConfig.public.mode === 'development') {
            console.log(props.error)
         }
         return t('common_error.500')
      }
      case 410: {
         return t('common_error.410')
      }
      default: {
         return t('common_error.generic')
      }
   }
})
</script>
