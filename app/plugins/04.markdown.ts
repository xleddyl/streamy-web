import MarkdownIt from 'markdown-it'

function multiSymbolPlugin(md, symbolConfigs) {
   symbolConfigs.forEach(({ symbol, wrapperTag = 'span', wrapperClass = 'custom-highlight' }) => {
      function customSymbolRule(state, silent) {
         const start = state.pos
         const max = state.posMax

         if (start + symbol.length * 2 > max) {
            return false
         }

         if (state.src.slice(start, start + symbol.length) !== symbol) {
            return false
         }

         const closingIndex = state.src.indexOf(symbol, start + symbol.length)
         if (closingIndex === -1) {
            return false
         }

         if (silent) {
            return true
         }

         const content = state.src.slice(start + symbol.length, closingIndex)

         const token = state.push(`custom_symbol_${wrapperClass}`, wrapperTag, 1)
         token.markup = symbol
         token.content = content
         token.attrs = [['class', wrapperClass]]

         state.pos = closingIndex + symbol.length

         return true
      }

      function customSymbolRender(tokens, idx, _options, _env, slf) {
         const token = tokens[idx]
         return `<${token.tag} class="${token.attrs[0][1]}">${md.utils.escapeHtml(token.content)}</${token.tag}>`
      }

      md.inline.ruler.push(`custom_symbol_${wrapperClass}`, customSymbolRule)
      md.renderer.rules[`custom_symbol_${wrapperClass}`] = customSymbolRender
   })
}

export default defineNuxtPlugin(() => {
   const md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
   })

   md.use(multiSymbolPlugin, [
      {
         symbol: '-hi-',
         wrapperTag: 'span',
         wrapperClass: '__title-highlight',
      },
      {
         symbol: '-bg-',
         wrapperTag: 'span',
         wrapperClass: '__title-background',
      },
   ])

   return {
      provide: {
         md: (text) => (text ? md.render(text).replace(/<p>/g, '').replace(/<\/p>/g, '') : text),
      },
   }
})
