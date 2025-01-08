import { MotionValue, motionValue } from 'motion'

type MotionValueParams<T> = Parameters<typeof motionValue<T>>

export const useMotionValue = <T>(...args: MotionValueParams<T>) => {
   const value_motion = motionValue<T>(...args)
   const value_vue = ref<T>(args[0])

   value_motion.on('change', (latest) => {
      value_vue.value = latest
   })

   return [value_motion, value_vue] as [MotionValue<T>, Ref<T>]
}

export const useMotionRef = () => {
   const ref_vue = ref<HTMLElement>({} as HTMLElement)
   return ref_vue
}
