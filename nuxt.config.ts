// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // environment variables
  runtimeConfig: {
    ssr: false,
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL1,
      appName: 'Jesse',
      appUrl: process.env.APP_URL,
      wsUrl: process.env.VUE_APP_SOCKET_PATH,
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
  }
})
