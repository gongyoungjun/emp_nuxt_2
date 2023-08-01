<template>
    <div>
    <v-app-bar><h1>공통 head</h1></v-app-bar>
    <v-main class="w-100">
        <slot/>
    </v-main>

    <v-footer
        app
        style="background: transparent"
    >
      <h1>footer</h1>
        <slot name="footer"/>
    </v-footer>
    </div>
</template>

<script setup>
console.log("mj layout....")
import {useDisplay} from 'vuetify'

const {lgAndUp, mdAndDown} = useDisplay()

</script>

<style lang="scss">
.layout-vertical-nav {
    top: 0 !important;
    height: 100% !important;

    .v-navigation-drawer__content {
        display: flex;
        flex-direction: column;

        > ul {
            flex-grow: 1;
        }
    }
}

.v-toolbar__prepend {
    margin-inline-start: 0 !important;
}

.v-footer {
    padding-left: 24px !important;
    padding-right: 24px !important;
}
</style>

