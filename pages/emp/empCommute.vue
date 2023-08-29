<template>
  <v-container class="map-container">
    <div class="map-buttons">
      <v-btn @click="getCommute" class="commute-btn" :color="isCommute ? 'red' : 'green'" outlined>
        {{ isCommute ? "퇴근" : "출근" }}
      </v-btn>
      <div id="map"></div>
      <v-btn @click="sendData" class="send-btn" color="blue" outlined>정보 전송하기</v-btn>
    </div>
  </v-container>


  <!-- 카카오로 로그인 버튼 -->
  <!--    <button @click="kakaoLogin" class="kakao-login-btn">카카오로 로그인</button>-->
  <!-- 현재 위치 가져오기 버튼 -->
  <!--    <button @click="getCurrentPosition" class="location-btn">현재 위치 가져오기</button>
      <p v-if="coords.latitude && coords.longitude" class="coords-text">좌표: {{ coords.latitude }}, {{ coords.longitude }}</p>
      <p v-if="address" class="address-text">주소: {{ address }}</p>-->

</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import {useRouter} from 'nuxt/app';
import {useEmpStore} from "~/store/emp";

const router = useRouter();
const store = useEmpStore();

let list = ref([]);

const coords = reactive({
  latitude: null,
  longitude: null
});

const address = ref('');
const isCommute = ref(false); // 출퇴근 상태를 나타내는 변수


//출퇴근 버튼
const getCommute = () => {
  isCommute.value = !isCommute.value;
};

/**
 * 지도 SDK 로드 및 친구 목록 불러오기 함수 호출
 * 컴포넌트가 마운트
 * 호툴될 콜백 등록
 */
onMounted(() => {

  getCurrentPosition();

  // 지도 SDK 로드 및 친구 목록 불러오기 함수 호출
  if (!window.kakao || !window.kakao.maps) {
    const script = document.createElement('script'); // 문서의 요소 만듬
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7ab35a2ef3b2ad6d27aa8a80bfc99a3a&libraries=drawing&autoload=false";
    script.addEventListener('load', () => {  // 이벤트 리스너
      kakao.maps.load(() => {
        initMap();
        // loadFriendsList(); // 친구 목록 불러오기 함수 호출
      });
    });
    document.head.appendChild(script);  // 노드 추가
  }

  // 카카오 로그인 SDK 로드
  if (!window.Kakao) {
    const kakaoLoginScript = document.createElement('script');
    kakaoLoginScript.src = "//developers.kakao.com/sdk/js/kakao.js";
    kakaoLoginScript.addEventListener('load', () => {
      Kakao.init('7ab35a2ef3b2ad6d27aa8a80bfc99a3a');  // 카카오 앱 키
    });
    document.head.appendChild(kakaoLoginScript);
  }
});


/**
 * 위도 경도
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
 */
const getAddress = async (lat, lng) => {
  const apiKey = 'f560cc539bb67250f4abca77cee2a9ec';
  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`, {
      headers: {
        'Authorization': `KakaoAK ${apiKey}`
      }
    });
    ``
    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      address.value = data.documents[0].address.address_name;
    }
  } catch (error) {
    console.error("주소 에러:", error);
  }
};

/**
 * 지도 초기화 함수
 */
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
    const map = new kakao.maps.Map(document.getElementById('map'), mapOptions); // getElementById : ID 값을 지정하는 문자열
    // 좌표로 주소를 받아왔으므로 바로 마커 추가
    const marker = new kakao.maps.Marker({
      position: centerLatLng,
      map: map,
    });
  } catch (error) {
    console.error('에러:', error);
  }
};

async function sendData() {
  const pointFormat = `POINT(${coords.longitude} ${coords.latitude})`;

  const requestBody = {
    geoLoc: pointFormat,
    address: address.value,
    workCd: isCommute.value ? "02" : "01"
  };
  try {
    const response = await store.empCommute(requestBody);

    console.log("API 응답:", response);

    const responseData = response.data._rawValue; // 또는 response.data._value

    if (response.status._rawValue === 'success') {
      // API 호출이 성공적으로 처리된 경우
      console.log("출퇴근 정보가 업데이트되었습니다.");
      const message = isCommute.value ? "퇴근하셨습니다." : "출근하셨습니다.";
      alert(message);
      await router.push({path: '/main'});
/*      const message = `영준님이 ${isCommute.value ? "퇴근" : "출근"}하셨습니다. 위치: ${address.value}`;
      sendKakaoMessage(message);*/
    } else {
      // API 호출이 실패한 경우
      console.error("API 호출 실패:", response.status._rawValue);
    }
  } catch (error) {
    console.error("API 호출 에러:", error);
  }
}

/**
 * 카카오 메세지
 * 전송
 */

const sendKakaoMessage = async (messageText) => {
  const KAKAO_TOKEN = sessionStorage.getItem('KAKAO_TOKEN');

  if (!KAKAO_TOKEN) {
    alert('카카오 로그인이 필요합니다.');
    return;
  }

  const KAKAO_API_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

  const templateObject = {
    object_type: "text",
    text: messageText,
    link: {
      web_url: "https://developers.kakao.com",
      mobile_web_url: "https://developers.kakao.com"
    },
    button_title: "바로 확인"
  };

  const formData = new URLSearchParams();
  formData.append('template_object', JSON.stringify(templateObject));  //json 객체를 string으로

  try {
    const response = await fetch(KAKAO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KAKAO_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const data = await response.json();
    console.log('카카오 메시지 전송 응답:', data);

    if (response.ok) {
      alert('메시지를 성공적으로 보냈습니다.');
    } else {
      alert('메시지 전송에 실패하였습니다.');
    }
  } catch (error) {
    console.error('카카오 메시지 전송 에러:', error);
    alert('메시지 전송에 실패하였습니다.');
  }
};

/**
 * 카카오 로그인 함수 정의
 */
const kakaoLogin = () => {
  if (window.Kakao) {
    Kakao.Auth.login({
      success: async (authObj) => {
        // 액세스 토큰 저장
        sessionStorage.setItem('KAKAO_TOKEN', authObj.access_token);
        console.log('로그인 성공! Access Token:', authObj.access_token);
        alert('로그인 성공!');
      },
      fail: (error) => {
        console.error('카카오 로그인 실패:', error);
      }
    });
  } else {
    console.error('Kakao SDK가 로드되지 않았습니다.');
  }
};

</script>

<style scoped>
/*css는 //사용X */

.map-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 (수평 방향) */
  justify-content: center; /* 중앙 정렬 (수직 방향) */
  height: 90vh; /* 높이 설정 */
}

.send-btn {
  display: block; /* 블록 요소로 설정 */
  margin-left: auto; /* 왼쪽 마진을 auto로 설정 */
  margin-right: auto; /* 오른쪽 마진을 auto로 설정 */
  padding: 10px 20px;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: blue;
  cursor: pointer;
  margin-bottom: 20px; /* 하단 여백 */
  transition: background-color 0.3s;
}

#map {
  width: 600px;
  height: 600px;
  border: 1px solid #e0e0e0;
  margin-top: 20px;
  margin-bottom: 20px;
}


</style>
