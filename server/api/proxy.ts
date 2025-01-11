export default defineEventHandler(async (event) => {
   const query = getQuery(event)
   const targetUrl = query.url

   if (!targetUrl || typeof targetUrl !== 'string') {
      return createError({
         status: 400,
         statusMessage: 'URL parameter is required',
      })
   }

   try {
      const response = await $fetch(targetUrl)

      return response
   } catch (error) {
      return createError({
         status: 500,
         statusMessage: 'Failed to fetch the target URL',
      })
   }
})
