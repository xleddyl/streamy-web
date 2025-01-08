<template>
   <Html class="bg-black/90">
      <Body>
         <div id="app-layout">
            <NuxtLoadingIndicator :height="5" color="#FFBD00" />
            <UNotifications />
            <UModals />
            <Analytics/>

            <div class="relative flex min-h-screen flex-col items-center justify-center px-5 py-10">
               <Header />
               <div id="content">
                  <slot />
               </div>
               <Footer class="absolute bottom-5" />
            </div>
         </div>
      </Body>
   </Html>
</template>

<script lang="ts" setup>
import { Analytics } from '@vercel/analytics/nuxt';

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
