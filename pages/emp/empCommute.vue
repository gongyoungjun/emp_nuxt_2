<template>
  <div class="container">
    <!-- 카카오로 로그인 버튼 -->
    <button @click="kakaoLogin" class="kakao-login-btn">카카오로 로그인</button>

    <!-- 친구 목록 권한 요청 버튼 -->
    <button @click="requestFriendsPermission" class="request-permission-btn">친구 목록 권한 요청</button>

    <!-- 친구 목록 불러오기 버튼 -->
    <button @click="openFriends" class="open-friends--btn">친구 목록 불러오기</button>

    <!-- 출근/퇴근 버튼 -->
    <button @click="getCommute" class="commute-btn" :class="{'checked-in': isCommute}">
      {{ isCommute ? "퇴근" : "출근" }}
    </button>
    <br>

    <!-- 현재 위치 가져오기 버튼 -->
    <button @click="getCurrentPosition" class="location-btn">현재 위치 가져오기</button>
    <p v-if="coords.latitude && coords.longitude" class="coords-text">좌표: {{ coords.latitude }}, {{ coords.longitude }}</p>
    <p v-if="address" class="address-text">주소: {{ address }}</p>

    <!-- 정보 전송하기 버튼 -->
    <button @click="sendData" class="send-btn">정보 전송하기</button>
  </div>
  <div id="map"></div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import {useRouter} from 'nuxt/app';
import {useEmpStore} from "~/store/emp";
import {useKakaoAuthStore} from "~/store/kakao";

const router = useRouter();
const store = useEmpStore();
const storeKakao = useKakaoAuthStore();

const coords = reactive({
  latitude: null,
  longitude: null
});

const address = ref('');
const isCommute = ref(false); // 출퇴근 상태를 나타내는 변수

const friendsList = ref([]); // 친구 목록 저장
const selectedFriend = ref(''); // 친구 고유 아이디(uuid)
//출퇴근 버튼
const getCommute = () => {
  isCommute.value = !isCommute.value;
};

onMounted(() => {
  // 지도 SDK 로드 및 친구 목록 불러오기 함수 호출
  if (!window.kakao || !window.kakao.maps) {
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7ab35a2ef3b2ad6d27aa8a80bfc99a3a&libraries=drawing&autoload=false";
    script.addEventListener('load', () => {
      kakao.maps.load(() => {
        initMap();
        // loadFriendsList(); // 친구 목록 불러오기 함수 호출
      });
    });
    document.head.appendChild(script);
  }

  // 카카오 로그인 SDK 로드
  if (!window.Kakao) {
    const kakaoLoginScript = document.createElement('script');
    kakaoLoginScript.src = "//developers.kakao.com/sdk/js/kakao.js";
    kakaoLoginScript.addEventListener('load', () => {
      Kakao.init('7ab35a2ef3b2ad6d27aa8a80bfc99a3a');  // 카카오 앱 키
      loadFriendsList(); // 친구 목록 불러오기 함수 호출
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

async function sendData() {
  const pointFormat = `POINT(${coords.longitude} ${coords.latitude})`;

  const requestBody = {
    geoLoc: pointFormat,
    address: address.value,
    workType: isCommute.value ? "02" : "01"
  };
  try {
    const response = await store.empCommute(requestBody);

    console.log("API 응답:", response);

    const responseData = response.data._rawValue; // 또는 response.data._value

    if (response.status._rawValue === 'success') {
      // API 호출이 성공적으로 처리된 경우
      console.log("출퇴근 정보가 업데이트되었습니다.");

      const message = `영준님이 ${isCommute.value ? "퇴근" : "출근"}하셨습니다. 위치: ${address.value}`;
      sendKakaoMessage(message);
    } else {
      // API 호출이 실패한 경우
      console.error("API 호출 실패:", response.status._rawValue);
    }
  } catch (error) {
    console.error("API 호출 에러:", error);
  }
}


/**
 * 사전 설정
 * 플랫폼 등록 o
 * 카카오 로그인 활성화 o
 * 동의항목 o
 * 카카오 로그인 o
 * 사용자 동의 o
 */


/**
 * 카카오 메세지
 * 전송
 */
/*const sendKakaoMessage = (messageText) => {
  const KAKAO_TOKEN = sessionStorage.getItem('KAKAO_TOKEN');
  if (!KAKAO_TOKEN) {
    alert('카카오 로그인이 필요합니다.');
    return;
  }
  // Kakao 객체 존재 여부 체크

  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }
  //나에게 보내기
  const KAKAO_API_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

  const templateObject = {
    object_type: "text",
    text: messageText,
    link: {
      web_url: "http://localhost:3000",
    }
  };

  const formData = new URLSearchParams();
  formData.append('template_object', JSON.stringify(templateObject));

  fetch(KAKAO_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KAKAO_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}*/

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
  formData.append('template_object', JSON.stringify(templateObject));

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



let friends = null; // friends 변수 정의

/**
 * 친구 목록
 * 팝업으로 열기
 */
const openFriends = () => {
  const Width = 600;
  const Height = 400;
  const left = (window.innerWidth - Width) / 2;
  const top = (window.innerHeight - Height) / 2;

  friends = window.open(
      'about:blank',
      '친구 목록',
      `width=${Width},height=${Height},left=${left},top=${top}`
  );

  friends.document.write('<h1>친구 목록 불러오는 중...</h1>');
  import('vue').then(({nextTick}) => {
    nextTick(() => {
      loadFriendsListIn(friends);
    });
  });
};

/**
 * 친구 목록
 * 팝업으로 불러오기
 */
const loadFriendsListIn = async (Window) => {
  try {
    const response = await fetch('https://kapi.kakao.com/v1/api/talk/friends?limit=100', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('KAKAO_TOKEN')}`
      },
      mode: 'cors'
    });
    const data = await response.json();
    console.log('친구 목록 API 응답:', data); // 추가된 부분

    Window.document.write('<h1>친구 목록</h1>');

    if (data && data.elements && data.elements.length > 0) {
      data.elements.forEach((friend) => {
        Window.document.write(`<p>${friend.nickname} <button onclick="selectFriend('${friend.uuid}')">선택</button></p>`);
      });
    } else {
      Window.document.write('<p>친구 목록이 없습니다.</p>');
    }
  } catch (error) {
    console.error('친구 목록 불러오기 에러:', error);
    Window.document.write('<h1>친구 목록 불러오기 에러</h1>');
  }
};

/**
 * 선택한 친구
 * 처리 함수
 */
const loadFriendsList = async () => {
  console.log("Fetching friends list...");

  try {
    const response = await fetch('https://kapi.kakao.com/v1/api/talk/friends?limit=100', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('KAKAO_TOKEN')}`
      },
      mode: 'cors'
    });
    const data = await response.json();

    if (data && data.elements && data.elements.length > 0) {
      friendsList.value = data.elements;
      console.log("Friends list fetched:", friendsList.value);
    }
  } catch (error) {
    console.error('친구 목록 불러오기 에러:', error);
  }
};

/**
 * 친구목록 선택
 */
const selectFriend = (uuid) => {
  friends.value.close();
  selectedFriend.value = uuid;
};

/**
 * 친구목록 접근권한
 * 처리 함수
 */
const requestFriendsPermission = () => {
  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }

  Kakao.Auth.login({
    scope: 'friends',
    success: () => {
      alert('친구 목록 권한을 획득하였습니다.');
    },
    fail: (error) => {
      console.error('친구 목록 권한 요청 실패:', error);
    }
  });
};

const sendToSpecificFriend = (friendId, message) => {
  if (!window.Kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return;
  }

  Kakao.API.request({
    url: '/v1/api/talk/friends/message/default/send',
    data: {
      receiver_uuids: [friendId],
      template_object: {
        object_type: 'text',
        text: message,
      },
    },
    success: (response) => {
      console.log('카카오 메시지 전송 성공:', response);
      alert('메시지를 성공적으로 보냈습니다.');
    },
    fail: (error) => {
      console.error('카카오 메시지 전송 실패:', error);
      alert('메시지 전송에 실패하였습니다.');
    },
  });
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

/* 카카오 로그인 버튼 스타일 */
.kakao-login-btn {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #ffcd00;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.kakao-login-btn:hover {
  background-color: #ffab00;
}

/* 친구 목록 권한 요청 버튼 스타일 */
.request-permission-btn {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #ff6b00;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.request-permission-btn:hover {
  background-color: #ff5300;
}

/* 친구 목록 불러오기 버튼 스타일 */
.open-friends--btn {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #3c1e1e;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.open-friends--btn:hover {
  background-color: #271414;
}



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
  background-color: #a8a8a8;
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

.commute-btn:not(.checked-in) {
  background-color: #4CAF50;
  color: white;
}

.commute-btn:not(.checked-in):hover {
  background-color: #45a049;
}

.commute-btn.checked-in {
  background-color: #f44336;
  color: white;
}

.commute-btn.checked-in:hover {
  background-color: #d32f2f;
}

</style>