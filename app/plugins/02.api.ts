import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
   const vueQueryState = useState<DehydratedState | null>('vue-query')
   const nuxtApp = useNuxtApp()
   const runtimeConfig = nuxtApp.$config
   const { t } = nuxtApp.$i18n
   const notification = nuxtApp.$notification
   const loadingIndicator = useLoadingIndicator()

   const queryClient = new QueryClient({
      defaultOptions: {
         queries: {
            staleTime: Number(runtimeConfig.public.queryStaleTime || 1000 * 60 * 5),
            gcTime: Number(runtimeConfig.public.queryQcTime || Infinity),
            networkMode: 'offlineFirst',
            retry: false,
         },
         mutations: {
            onMutate: () => {
               notification.clear()
               loadingIndicator.start()
            },
            onError: (e) => {
               if (runtimeConfig.public.mode === 'development') {
                  console.log(e)
               }

               notification.add({
                  type: 'error',
                  text: t(
                     e.message,
                     {},
                     {
                        default: t('api_error.generic'),
                     }
                  ),
               })
            },
            onSettled: () => {
               loadingIndicator.finish()
            },
         },
      },
   })
   const options: VueQueryPluginOptions = { queryClient }

   nuxt.vueApp.use(VueQueryPlugin, options)

   if (import.meta.server) {
      nuxt.hooks.hook('app:rendered', () => {
         vueQueryState.value = dehydrate(queryClient)
      })
   }

   if (import.meta.client) {
      hydrate(queryClient, vueQueryState.value)
   }
})
