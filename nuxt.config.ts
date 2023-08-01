export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
    },
    css: [
        'vuetify/lib/styles/main.sass'
        , '@mdi/font/css/materialdesignicons.min.css'
    ],
    build: {
        transpile: ['vuetify'],
    },
    vite: {
        ssr: {
            noExternal: ["vuetify"],
        },
        define: {
            'process.env.DEBUG': false,
        },
        server: {
            proxy: {
                '/api': {
                    //target: 'http://mjgolf.myqnapcloud.com',
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/api/, ''),
                    ws: true
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
