export default defineEventHandler(async (event) => {
   const query = getQuery(event)
   const targetUrl = query.url
   console.log('olla')
   if (!targetUrl || typeof targetUrl !== 'string') {
      return createError({
         status: 400,
         statusMessage: 'URL parameter is required',
      })
   }
   console.log('ciao')
   try {
      const response = await $fetch(targetUrl)
      console.log('bella', response)
      return response
   } catch (error) {
      console.log('sss')
      return createError({
         status: 500,
         statusMessage: 'Failed to fetch the target URL',
      })
   }
})
