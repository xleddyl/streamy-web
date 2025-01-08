import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

type Props = {
   time: number
   duration: 'seconds' | 'minutes' | 'hours'
   format: string
   immediate?: boolean
   onEnded?: () => void
}

export const useCustomTimer = (props: Props) => {
   const timer = ref<Dayjs>()
   const elapsedTime = ref<number>(0)
   const isEnded = ref<boolean>(false)
   const isActive = ref<boolean>(false)
   const intervalF = ref<any>()

   onMounted(() => {
      if (props.immediate) {
         resetTimer(true)
      }
   })

   watch(timer, (curr, old) => {
      if (curr?.format('HH:mm:ss') === '00:00:00') {
         clearInterval(intervalF.value)
         isEnded.value = true
         isActive.value = false
         props.onEnded?.()
      }
   })

   watch(
      () => props.time,
      (curr, old) => {
         if (curr !== old) {
            resetTimer()
         }
      }
   )

   const startTimer = () => {
      const interval = setInterval(() => {
         elapsedTime.value = elapsedTime.value + 1
         timer.value = dayjs(timer.value?.subtract(1, 's'))
      }, 1000)
      clearInterval(intervalF.value)
      intervalF.value = interval
      isActive.value = true
   }

   const stopTimer = () => {
      clearInterval(intervalF.value)
      isActive.value = false
   }

   const resetTimer = (restart?: boolean) => {
      const date = dayjs(dayjs.duration(props.time, props.duration).format('2024-01-01 HH:mm:ss'))
      timer.value = date
      elapsedTime.value = 0
      isEnded.value = false
      clearInterval(intervalF.value)
      isActive.value = false

      if (restart) {
         startTimer()
      }
   }

   return {
      timer: computed(() => timer.value?.format(props.format)),
      elapsedTime,
      isEnded,
      isActive,
      startTimer,
      stopTimer,
      resetTimer,
   }
}
