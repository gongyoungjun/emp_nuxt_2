<template>
  <div>
    <p>위도: {{ latitude }}</p>
    <p>경도: {{ longitude }}</p>
    <p>주소: {{ address }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const latitude = computed(() => store.state.latitude);
    const longitude = computed(() => store.state.longitude);
    const address = computed(() => store.state.address);

    return {
      latitude,
      longitude,
      address
    };
  }
}
</script>
