<template>
  <div>
    <p>위도: {{ latitude }}</p>
    <p>경도: {{ longitude }}</p>
    <p>주소: {{ address }}</p>
  </div>
</template>

<script setup>
import {useRoute} from 'nuxt/app';


const route = useRoute();

const latitude = route.query.latitude;
const longitude = route.query.longitude;
const address = route.query.address;

</script>
