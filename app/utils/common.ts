export const isBrowser = () => import.meta.client

export const getTimezone = () => {
   const dayjs = useDayjs()
   return dayjs.tz.guess()
}
