type NotificationProps = {
   text: string
   type?: 'error' | 'success'
}

export default defineNuxtPlugin((nuxt) => {
   const nuxtApp = useNuxtApp()
   const { t } = nuxtApp.$i18n
   const toast = useToast()

   return {
      provide: {
         notification: {
            ...toast,
            add: ({ text, type }: NotificationProps) => {
               switch (type) {
                  case 'error': {
                     toast.add({
                        title: t('common.error'),
                        description: text,
                        color: 'red' as any,
                        ui: {
                           rounded: 'rounded-small',
                           container: 'border-red-500/80 border-2',
                           ring: 'ring-0',
                        },
                     })
                     break
                  }
                  case 'success': {
                     toast.add({
                        title: t('common.success'),
                        description: text,
                        color: 'green' as any,
                        ui: {
                           rounded: 'rounded-small',
                           container: 'border-green-400/80 border-2',
                           ring: 'ring-0',
                        },
                     })
                     break
                  }
                  default: {
                     toast.add({
                        description: text,
                        color: 'yellow' as any,
                        ui: {
                           rounded: 'rounded-small',
                           container: 'border-yellow-500/80 border-2',
                           ring: 'ring-0',
                        },
                     })
                     break
                  }
               }
            },
         },
      },
   }
})
