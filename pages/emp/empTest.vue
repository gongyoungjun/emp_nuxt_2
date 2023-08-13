<template>
  <div class="container">
    <div class="info">
      <p class="info-item"><strong>위도:</strong> {{ latitude }}</p>
      <p class="info-item"><strong>경도:</strong> {{ longitude }}</p>
      <p class="info-item"><strong>주소:</strong> {{ address }}</p>
      <p class="info-item"><strong>출퇴근:</strong> {{ status }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'nuxt/app';

const route = useRoute();

const latitude = route.query.latitude;
const longitude = route.query.longitude;
const address = route.query.address;
const status = route.query.status || '미정'; // 출퇴근 상태를 나타내는 변수, 기본값 '미정'
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}

.info {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.info-item {
  margin: 0;
  padding: 5px 0;
}
</style>
