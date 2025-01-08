import Dialog from '~/components/global/Dialog.vue'

type AlertProps = {
   title?: string
   description?: string
   confirmText?: string
   discardText?: string
   confirmCallback?: () => void
   discardCallback?: () => void
}

export default defineNuxtPlugin((nuxt) => {
   const nuxtApp = useNuxtApp()
   const { t } = nuxtApp.$i18n
   const modal = useModal()

   // const alert = (props: AlertProps) => {
   //    alertStatus.value = {
   //       ...props,
   //       open: true,
   //       confirmCallback: () => {
   //          setStatus(false)
   //          props.confirmCallback?.()
   //       },
   //       discardCallback: () => {
   //          setStatus(false)
   //          props.discardCallback?.()
   //       },
   //    }
   // }

   // const setStatus = (status: boolean) => {
   //    alertStatus.value = { ...alertStatus.value, open: status }
   // }

   return {
      provide: {
         alert: {
            ...modal,
            open: (props: AlertProps) => {
               modal.open(Dialog, {
                  ui: {
                     container: 'items-center justify-center px-3',
                     background: 'p-5',
                     width: 'max-w-[600px] w-full',
                     height: 'max-h-[500px] min-h-[300px]',
                     overlay: {
                        background: 'bg-black/40 backdrop-blur-sm',
                     },
                  },
               })
            },
         },
      },
   }
})
