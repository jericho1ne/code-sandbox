// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  alias: {
    "@components": "./components",
    "@types": "./types",
    "@utils": "./utils",
  },

  css: ['~/assets/styles/main.scss'],

  devtools: { enabled: true },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/heroku-logs',
        'stories',
      ]
    }
  },

  // Plugins root folder is auto-scanned
  // Add individual subdirectories below
  // plugins: ['~/plugins/subdir']

  app: {
    cdnURL: '/',
    head: {
      script: [
        // {
        //   hid: 'gtmHead',
        //   innerHTML: `
        //     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        //     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        //     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        //     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        //     })(window,document,'script','dataLayer','${process.env.GTM_CONTAINER_ID}');`,
        // },
      ],
    },
  }
})
