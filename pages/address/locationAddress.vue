<template>
  <div class="container">
    <button @click="getCurrentPosition" class="location-btn">현재 위치 가져오기</button>

    <p v-if="coords.latitude && coords.longitude" class="coords-text">좌표: {{ coords.latitude }},
      {{ coords.longitude }}</p>

    <p v-if="address" class="address-text">주소: {{ address }}</p>
    <button @click="sendData" class="send-btn">정보 전송하기</button>
  </div>

  <div id="map"></div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'nuxt/app';

const router = useRouter();
const coords = reactive({
  latitude: null,
  longitude: null
});

const address = ref('');

/**
 * geolocation API
 * getCurrentPosition -> 위치 정보
 */
const getCurrentPosition = () => {
  if (process.client && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      coords.latitude = position.coords.latitude;
      coords.longitude = position.coords.longitude;
      getAddress(coords.latitude, coords.longitude);
      initMap();
    }, error => {
      console.error("Error:", error);
      alert("위치 정보를 가져오는데 실패");
    });
  } else {
    alert("API 지원X");
  }
};

/**
 * 주소 호출
 * https://apis.map.kakao.com/web/guide/
 * https://developers.kakao.com/console/app/952724
 */
const getAddress = async (lat, lng) => {
  const apiKey = 'f560cc539bb67250f4abca77cee2a9ec';
  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`, {
      headers: {
        'Authorization': `KakaoAK ${apiKey}`
      }
    });
    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      address.value = data.documents[0].address.address_name;
    }
  } catch (error) {
    console.error("주소 에러:", error);
  }
};

onMounted(() => {
  if (!window.kakao || !window.kakao.maps) {
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7ab35a2ef3b2ad6d27aa8a80bfc99a3a&libraries=drawing&autoload=false";
    script.addEventListener('load', () => {
      kakao.maps.load(initMap);
    });
    document.head.appendChild(script);
  } else {
    initMap();
  }
});

const initMap = async () => {
  if (!coords.latitude || !coords.longitude) {
    console.error("좌표 정보가 없습니다.");
    return;
  }

  try {
    const centerLatLng = new kakao.maps.LatLng(coords.latitude, coords.longitude);
    const mapOptions = {
      center: centerLatLng,
      level: 5,
    };
    const map = new kakao.maps.Map(document.getElementById('map'), mapOptions);

    // 좌표로 주소를 받아왔으므로 바로 마커 추가
    const marker = new kakao.maps.Marker({
      position: centerLatLng,
      map: map,
    });

  } catch (error) {
    console.error('에러:', error);
  }
};

const sendData = () => {
  router.replace({
    path: "/address/test",
    query: {
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      address: address.value
    }
  });
};
</script>



<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 50px auto;
  background-color: #f9f9f9;
}

.location-btn {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #4CAF50;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.send-btn {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: blue;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}


.location-btn:hover {
  background-color: #45a049;
}

.coords-text, .address-text {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
}

#map {
  width: 400px;
  align-items: center;
  justify-content: center;
  height: 500px;
  border: 1px #a8a8a8 solid;
  margin: 50px auto;
}


</style>