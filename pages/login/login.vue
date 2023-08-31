<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="userPhn">사용자 전화번호:</label>
        <input type="text" id="userPhn" v-model="userPhn"/>
      </div>
      <div class="form-group">
        <label for="password">비밀번호:</label>
        <input type="password" id="password" v-model="password"/>
      </div>
      <button type="submit">로그인</button>
    </form>
    <!--    <button @click="kakaoLogin" class="kakaoLogin">카카오톡으로 로그인</button>-->
    <br>
    <a v-if="shouldShowKakaoLink" :href="KAKAO_AUTH_URL" class="kakaoAuthUrl">카카오톡으로 로그인</a>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>


<script setup>
import {useRouter} from 'nuxt/app';
import {useAuthStore} from '~/store/login';
import {ref, defineProps} from 'vue';
import {onMounted} from 'vue';
import {useEmpStore} from '~/store/emp';

/**
 * 레이아웃 지움
 */
const props = defineProps();
props.layout = 'empty';

const router = useRouter();
const empStore = useEmpStore();
const {login: authLogin} = useAuthStore();

const userPhn = ref('');
const password = ref('');
const errorMessage = ref('');
const empAuthCd = ref('');
async function login() {
  errorMessage.value = '';

  try {
    const response = await authLogin({
      empPhn: userPhn.value,
      empPwd: password.value,
    });
    const {data} = response;

    if (data && data.value.code != '0000') {
      errorMessage.value = data.value.message;
    } else if (data && data.value.code == '0000') {
      //권한 체크
      empAuthCd.value = data.value.data.empAuthCd;

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', data.value.token);

      // 토큰 확인
      console.log('로그인 후 토큰:', localStorage.getItem('token'));

      console.log('로그인 후 empAuthCd:', empAuthCd.value);


      // 권한 별로 창
      if (empAuthCd.value === '01') {
        alert('관리자로 로그인했습니다.');
        console.log('empAuthCd:', empAuthCd.value);
        await router.push({path: '/main'});
      } else if (empAuthCd.value === '03') {
        alert('일반 사용자로 로그인했습니다.');
      }
      await router.push({path: '/main'});
    }
  } catch (error) {
    errorMessage.value = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    console.error(error);
  }
}

onMounted(() => {
  // logLocalStorageKeys();
  // 기존 토큰 확인 로직
  const tokenInLocalStorage = localStorage.getItem('token');
  console.log('토큰 확인:', tokenInLocalStorage);

  if (tokenInLocalStorage) {
    router.push({path: '/main'});
  }
  // 카카오 SDK 로딩 로직
  if (!window.Kakao) {
    const kakaoLoginScript = document.createElement('script');
    kakaoLoginScript.src = "//developers.kakao.com/sdk/js/kakao.js";
    kakaoLoginScript.addEventListener('load', () => {
      Kakao.init('7ab35a2ef3b2ad6d27aa8a80bfc99a3a');  // 카카오 앱 키
    });
    document.head.appendChild(kakaoLoginScript);
  }
});

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize?client_id=7ab35a2ef3b2ad6d27aa8a80bfc99a3a&redirect_uri=http://localhost:3000/login/code&response_type=code";

const shouldShowKakaoLink = computed(() => {
  return !(userPhn.value && password.value); // 이메일과 전화번호 없으면 카카오 링크 숨김
});

const handleKakaoAuth = async () => {
  try {
    const response = await fetch(KAKAO_AUTH_URL);
    const {access_token, id_token} = await response.json();

    sessionStorage.setItem('idToken', id_token);
    sessionStorage.setItem('KAKAO_TOKEN', access_token);

    const profile = await getKakaoProfile();
    const emailExists = await checkEmpEmail(profile.email);

    if (emailExists) {

      await router.push({path: '/main'});
    } else {
      await router.push({path: '/login/kakaoSign'});
    }
  } catch (error) {
    console.error('카카오 인가 에러:', error);
  }
};

const kakaoLogin = () => {
  if (window.Kakao) {
    Kakao.Auth.login({
      success: async (authObj) => {
        console.log('Kakao login success:', authObj);
        const code = new URL(window.location.href).searchParams.get("code");  // 인가 코드 가져오기

        // 백엔드로 인가 코드 보내기
        const backendResponse = await sendCodeToBackend(code);
        if (backendResponse && backendResponse.accessToken) {
          // 백엔드에서 받은 액세스 토큰 처리 로직 (예: 저장 등)
        }

        const idToken = authObj.id_token;
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('KAKAO_TOKEN', authObj.access_token);

        const profile = await getKakaoProfile();
        const emailExists = await checkEmpEmail(profile.email);

        if (emailExists) {
          await router.push({path: '/main'});
        } else {
          await router.push({path: '/login/kakaoSign'});
        }
      },
      fail: (error) => {
        errorMessage.value = '카카오 로그인 실패. 다시 시도해주세요.';
        console.error('카카오 로그인 실패:', error);
      }
    });
  } else {
    errorMessage.value = '카카오 SDK가 로드되지 않았습니다.';
  }
};

const getKakaoProfile = () => {
  return new Promise((resolve, reject) => {
    Kakao.API.request({
      url: '/v2/user/me',
      success: (response) => {
        const profile = {
          id: response.id, // 카카오 사용자 고유 ID를 추가
          nickname: response.properties.nickname,
          email: response.kakao_account.email,
        };
        resolve(profile);
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

async function sendCodeToBackend(code) {
  try {
    const response = await fetch("/api/kakao/token", {  // 백엔드의 엔드포인트
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({code})
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending code to backend:", error);
    return null;
  }
}

async function checkEmpEmail(email) {
  const response = await empStore.empEmail({empEml: email});
  const data = response.data.value;

  console.log("Extracted data:", data);

  return data.list && data.list.length > 0;
}

</script>

<style scoped>


.kakaoLogin {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  margin: 100px auto;
  border-radius: 5px;
  color: white;
  background-color: #ffcd00;
  transition: background-color 0.3s;
}


.login-container {
  max-width: 300px;
  margin: auto;
  margin-top: 150px;
  margin-bottom: 45px;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
