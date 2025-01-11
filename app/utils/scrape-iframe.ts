export type IframeResults = {
   title: string
   thumbnail: string
}

const YT_READY_CALLBACKS: Array<() => void> = []

const generateUniqueId = () => `yt-${Math.random().toString(36).slice(2, 11)}`

export const scrapeIframe = async (url: string): Promise<IframeResults | undefined> => {
   try {
      const videoId = extractYouTubeId(url)
      if (!videoId) throw new Error('Invalid YouTube URL')

      return await new Promise<IframeResults>((resolve, reject) => {
         const uniqueId = generateUniqueId()
         const container = document.createElement('div')
         Object.assign(container.style, {
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
         })
         document.body.appendChild(container)

         const iframe = document.createElement('iframe')
         Object.assign(iframe, {
            id: uniqueId,
            src: `https://www.youtube.com/embed/${videoId}?enablejsapi=1`,
            width: '640',
            height: '360',
         })
         container.appendChild(iframe)

         const initializePlayer = () => {
            new window.YT.Player(uniqueId, {
               events: {
                  onReady: ({ target }) => {
                     const { title } = target.getVideoData()
                     document.body.removeChild(container)
                     resolve({
                        title,
                        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                     })
                  },
                  onError: () => {
                     document.body.removeChild(container)
                     reject(new Error('Failed to load video'))
                  },
               },
            })
         }

         if (!window.YT) {
            YT_READY_CALLBACKS.push(initializePlayer)
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
               const tag = document.createElement('script')
               tag.src = 'https://www.youtube.com/iframe_api'
               document
                  .getElementsByTagName('script')[0]
                  ?.parentNode?.insertBefore(tag, document.getElementsByTagName('script')[0])
               window.onYouTubeIframeAPIReady = () => {
                  YT_READY_CALLBACKS.forEach((cb) => cb())
                  YT_READY_CALLBACKS.length = 0
               }
            }
         } else {
            initializePlayer()
         }

         setTimeout(() => {
            if (container.parentNode) document.body.removeChild(container)
            const index = YT_READY_CALLBACKS.indexOf(initializePlayer)
            if (index > -1) YT_READY_CALLBACKS.splice(index, 1)
            reject(new Error('Timeout waiting for video data'))
         }, 5000)
      })
   } catch (error) {
      console.error('Error fetching video info:', error)
      return undefined
   }
}

const extractYouTubeId = (url: string): string | null => {
   const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
   return match && match[2]?.length === 11 ? match[2] : null
}

declare global {
   interface Window {
      YT: any
      onYouTubeIframeAPIReady: () => void
   }
}
