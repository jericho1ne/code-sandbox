// Import the Kongponents Vue plugin
import Kongponents from '@kong/kongponents'
// Import Kongponents styles
import '@kong/kongponents/dist/style.css'
// In some NodeJS environments, the `crypto` module is not available by default, so import it and make it available on the server
import crypto from 'node:crypto'

export default defineNuxtPlugin({
  name: 'kongponents',
  setup(nuxtApp) {
    // Inject the crypto module into the global scope if it is not already available
    if (import.meta.server && typeof globalThis?.crypto === 'undefined') {
      globalThis.crypto = globalThis.crypto || crypto
    }
    // Initialize the Kongponents Vue plugin
    nuxtApp.vueApp.use(Kongponents)
  },
})
