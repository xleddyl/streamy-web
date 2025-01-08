export default defineNuxtRouteMiddleware(async (to, from) => {
   const localePath = useLocalePath()

   try {
      console.log(to)
   } catch (e) {
      return navigateTo(localePath('/'), { redirectCode: 301 })
   }
})
