<template>
   <Html class="bg-neutral-900">
      <Body>
         <div id="app-layout">
            <NuxtLoadingIndicator :height="5" color="#FF0808" />
            <UNotifications />
            <UModals />
            <Analytics />

            <div class="flex min-h-screen flex-col justify-between">
               <Header />
               <slot />
               <Footer />
            </div>
         </div>
      </Body>
   </Html>
</template>

<script lang="ts" setup>
import { Analytics } from '@vercel/analytics/nuxt'

const { t } = useI18n()

useLocaleHead({
   addDirAttribute: true,
   identifierAttribute: 'id',
   addSeoAttributes: true,
})

useSeoMeta(
   reactive({
      description: t('screen.layout.default.meta.description'),
      ogTitle: t('screen.layout.default.meta.title'),
      ogDescription: t('screen.layout.default.meta.description'),
   })
)
</script>
