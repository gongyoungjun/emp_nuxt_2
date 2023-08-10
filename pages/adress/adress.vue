<template>
  <div class="daummap">
    <h1>우편번호: <span>{{ zip }}</span></h1>
    <h1>기본주소: <span>{{ addr1 }}</span></h1>
    <h1>상세주소: <input v-model="addr2" placeholder="상세주소 입력"></h1>
    <button @click="showApi">주소API 호출</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const zip = ref('');
const addr1 = ref('');
const addr2 = ref('');

const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
};

const showApi = () => {
  if (window.daum && window.daum.Postcode) {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullRoadAddr = data.roadAddress;
        let extraRoadAddr = '';

        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }

        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }

        if (extraRoadAddr !== '') {
          extraRoadAddr = ' (' + extraRoadAddr + ')';
        }

        if (fullRoadAddr !== '') {
          fullRoadAddr += extraRoadAddr;
        }

        zip.value = data.zonecode;
        addr1.value = fullRoadAddr;
      }
    }).open();
  }
};

onMounted(() => {
  if (!window.daum) {
    loadScript("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", showApi);
  } else {
    showApi();
  }
});
</script>

<style scoped>
.daummap {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 16px;
  margin-bottom: 12px;
}

span {
  color: #007BFF;
}

input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 4px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>