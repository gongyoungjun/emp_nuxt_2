<template>
    <div>
    <v-app-bar>

<!--      <div class="menu-btn"><nuxt-link to="/main"><h1>목록</h1></nuxt-link></div>-->
      <div ><h1>목록</h1></div>
    </v-app-bar>
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
console.log("layout....")
import {useDisplay} from 'vuetify'

const {lgAndUp, mdAndDown} = useDisplay()

</script>

<style lang="scss">

.menu-btn {
  padding: 10px 20px;
  font-size: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

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

