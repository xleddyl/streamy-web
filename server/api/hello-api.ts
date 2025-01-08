export default defineEventHandler(async (event) => {
   const body = await readBody<ContactUsPostBody>(event)
   const authorized = true

   if (!body) {
      return createError({ status: 400 })
   } else if (!authorized) {
      return sendRedirect(event, '/')
   }

   return {
      message: 'hello from a route',
   }
})
