// https://nuxt.com/docs/api/configuration/nuxt-config
let wsPath = ''
if (process.env.APP_ENV === 'production') {
  wsPath = ((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/ws'
} else {
  wsPath = `${process.env.VUE_APP_SOCKET_PATH}`
}

export default defineNuxtConfig({
  // environment variables
  runtimeConfig: {
    ssr: false,
    public: {
      apiBaseUrl: process.env.APP_ENV === 'production' ? '/' : process.env.NUXT_API_BASE_URL1,
      appName: 'Jesse',
      appUrl: process.env.APP_URL,
      wsUrl: wsPath,
    },
  },
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/ui',
    'nuxt-vitest',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
  ],
  css: [
    '@/assets/css/main.css',
  ],
  router: {
    options: {
      hashMode: true,
    },
  },
  eslint: {
    config: {
      stylistic: true
    }
  }
})
