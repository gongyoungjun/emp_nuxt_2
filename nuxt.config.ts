export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {},
    css: [
        'vuetify/lib/styles/main.sass'
        , '@mdi/font/css/materialdesignicons.min.css'
    ],
    build: {
        transpile: ['vuetify'],
    },
    vite: {
        config: {
            productionTip: false,
            devtools: true
        },
        ssr: {
            noExternal: ["vuetify"],
        },
        define: {
            'process.env.DEBUG': true,
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
    },

    modules: [
        [
            '@pinia/nuxt',
            {
                autoImports: [
                    ['defineStore', 'definePiniaStore'],
                ],
            },

        ],
    ],

})
