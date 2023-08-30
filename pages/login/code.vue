<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'nuxt/app';
import {useAuthStore} from '@/store/login';
import {useEmpStore} from "~/store/emp";

const empStore = useEmpStore();
const router = useRouter();
const store = useAuthStore();

const employee = ref({

  empNo: '',
  empNm: '',
  empPwd: '',
  empPhn: '',
  empEml: '',
  empStCd: '',
  empRnkCd: '',
  empHrDt: '',
  empSlr: null,
  empBrtDt: '',
  snsCd: '',
  snsKey: '',
});

onMounted(async () => {
  const code = new URL(window.location.href).searchParams.get("code");
  if (code) {
    try {
      const response = await store.kakaoLogin(code);

      if (response && response.data.value.access_token) {
        const accessToken = response.data.value.access_token;

        // 세션 스토리지에 저장
        sessionStorage.setItem('idToken', response.data.value.id_token);
        sessionStorage.setItem('KAKAO_TOKEN', accessToken);

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          //console.log('Access token:', accessToken); // 토큰 로깅
          const profile = await getKakaoProfile(accessToken);
          console.log('Kakao profile:', profile);  // 프로필 로깅
          const empSnskeyExists = await checkSnsKey(profile.id);
          console.log('중복 여부?', empSnskeyExists);  // 중복 검사 결과 로깅


          if (empSnskeyExists) {
            await router.push({path: '/main'});
          } else {
            const signupSuccess = await performSignup(profile.id, profile);

            if (signupSuccess) {
              await router.push({path: '/login'});
            } else {
              console.log("Employee data before redirect:", employee.value);
              await router.push({
                path: '/login/kakaoSign',
                query: {
                  snsKey: employee.value.snsKey,
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('토큰 받기 중 에러:', error);
      await router.push({path: '/login/login'});
    }
  }
});

// 회원 가입 처리 함수
async function performSignup(id, profile) {
  const signupData = {
    snsKey: id,
    snsCd : '01',
    empNm: profile.properties.nickname,
    empEml: profile.kakao_account.email,
  };

  // employee ref 업데이트
  employee.value.snsKey = id;
  employee.value.snsCd = '01';
  employee.value.empNm = profile.properties.nickname;
  employee.value.empEml = profile.kakao_account.email;

  const response = await store.kakaoJoin(signupData);
  return response.success;
}

// 백엔드로 snsKey를 보내는 별도의 함수
async function sendSnsKeyToBackend(snsKey) {
  const response = await fetch("http://localhost:3000/api/kakao/detail", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ snsKey: snsKey })
  });

  return await response.json();
}

// 카카오 프로필 정보 가져오는 함수
async function getKakaoProfile(accessToken) {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await response.json();
}

/**
 * snsKey 확인
 * @param id
 * @returns {Promise<""|boolean>}
 */
async function checkSnsKey(id) {
  const requestData = {snsKey: id.toString()}; // 숫자를 문자열로 변환
  console.log("Sending request data to server:", requestData); // 요청 데이터 로깅

  const response = await empStore.empSnsKey(requestData);
  const data = response.data.value;
  console.log("Extracted data:", data);

  // 토큰을 받아서 로컬 스토리지나 세션 스토리지에 저장
  if (response.data.value.token) {
    localStorage.setItem('token', response.data.value.token);
  }

  return data.list && data.list.length > 0;
}



</script>
