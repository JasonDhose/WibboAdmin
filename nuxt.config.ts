// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devServer: {
        port: 3002,
    },
    ssr: false,
    router: {
        options: {
            hashMode: true,
        },
    },
    srcDir: 'src/',

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE,
            urlAssets: process.env.NUXT_PUBLIC_URL_ASSETS || '',
            urlCdn: process.env.NUXT_PUBLIC_URL_CDN || '',
            tinymceApi: process.env.NUXT_PUBLIC_TINYMCE_API || '',
        },
    },

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
    },

    typescript: {
        shim: false,
        strict: true,
    },

    modules: ['@nuxtjs/tailwindcss'],
})
