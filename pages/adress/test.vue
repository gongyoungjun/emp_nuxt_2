<template>
  <div>
    <p>위도: {{ latitude }}</p>
    <p>경도: {{ longitude }}</p>
    <p>주소: {{ address }}</p>
  </div>
</template>

<script>
import { useRoute } from 'nuxt/app';

export default {
  setup() {
    const route = useRoute();

    const latitude = route.query.latitude;
    const longitude = route.query.longitude;
    const address = route.query.address;

    return {
      latitude,
      longitude,
      address
    };
  }
}
</script>
