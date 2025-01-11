export type SearchResult = {
   title: string
   thumbnail: string
}

export const scrapeLink = async (url: string) => {
   const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`

   try {
      const response = await fetch(proxyUrl)
      const html = await response.text()

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const title = doc.querySelector('meta[name="title"]')?.getAttribute('content') || ''
      const thumbnail = doc.querySelector('link[rel="image_src"]')?.getAttribute('href') || ''

      return {
         title,
         thumbnail,
      }
   } catch (error) {
      console.error('Error fetching video info:', error)
      return
   }
}
