// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    "@types": "./types",
    "@utils": "./utils",
    "@components": "./components",
  },
  devtools: { enabled: true },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about', '/heroku-logs']
    }
  },
  css: ['~/assets/styles/main.scss'],
  // Plugins root folder is auto-scanned
  // plugins: ['~/plugins/subdir']
})
