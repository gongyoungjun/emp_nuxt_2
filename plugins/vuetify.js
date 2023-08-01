import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {defineNuxtPlugin} from "nuxt/app";
import {VDataTableServer} from 'vuetify/labs/VDataTable'
// import * as components from 'vuetify/labs/components'

import defaults from './vuetify/defaults'
import { icons } from './vuetify/icons'
import theme from './vuetify/theme'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components,
        directives,
        ssr: true,
        // theme:{
        //     defaultTheme : 'dark'
        // }
        defaults,
        icons,
        theme
    })

    nuxtApp.vueApp.use(vuetify)
})