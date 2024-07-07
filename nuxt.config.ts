// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    "@components": "./components",
    "@types": "./types",
    "@utils": "./utils",
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
  // Add individual subdirectories below
  // plugins: ['~/plugins/subdir']
})
