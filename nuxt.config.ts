// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },

  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:2345/web',
    public: {
      apiProxyBase: '/api',
    },
  },

  nitro: {
    routeRules: {
      '/api/**': {
        proxy: `${process.env.API_BASE_URL || 'http://localhost:2345/web'}/**`,
      },
    },
  },

  devServer: {
    port: Number(process.env.PORT) || 3001,
  },

  app: {
    head: {
      titleTemplate: '%s | Arafah Hijab',
      htmlAttrs: { lang: 'id' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Belanja hijab premium online - Arafah Hijab' },
        { name: 'theme-color', content: '#FAF7F2' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },
})
