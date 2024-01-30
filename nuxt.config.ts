// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // environment variables
    runtimeConfig: {
        public: {
            apiBaseUrl1: process.env.NUXT_API_BASE_URL1,
            appName: 'Jesse',
            appUrl: process.env.APP_URL
        }
    },
    devtools: { enabled: true },
    modules: [
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxt/ui',
        'nuxt-vitest'
    ]
})
