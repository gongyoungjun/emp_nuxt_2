<template>
  <div>
    <h1>카카오 추가 정보 입력</h1>
    <form @submit.prevent="handleSubmit">
      <label>사원번호:</label>
      <input v-model="employee.empNo" type="text" readOnly><br>
      <label>사원이름:</label>
      <input v-model="employee.empNm" type="text" required><br>
      <label>비밀번호:</label>
      <input v-model="employee.empPwd" type="password" required><br>
      <label>전화번호:</label>
      <input v-model="employee.empPhn" type="text"><br>
      <label>이메일:</label>
      <input v-model="employee.empEml" type="email" readOnly><br> <!-- 이메일 수정 불가능 -->
      <label>사원상태 코드:</label>
      <input v-model="employee.empStCd" type="text"><br>
      <label>직급 코드:</label>
      <input v-model="employee.empRnkCd" type="text"><br>
      <label>입사일:</label>
      <input v-model="employee.empHrDt" type="date"><br>
      <label>연봉:</label>
      <input v-model="employee.empSlr" type="number"><br>
      <label>생년월일:</label>
      <input v-model="employee.empBrtDt" type="date"><br>

      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useAuthStore} from '~/store/login';
import {useRouter} from 'nuxt/app';


const router = useRouter();
const loginStore = useAuthStore();
const employee = ref({
  empNo: null,
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
  // 카카오 프로필 로드
  try {
    const kakaoProfile = await getKakaoProfile();
    employee.value.empEml = kakaoProfile.email;
  } catch (error) {
    console.error('카카오 프로필을 불러오는데 실패했습니다:', error);
  }
  /**
   * 세션 스토리지에서 id_token 가져오기
   * jSON.parse = JSON 문자열의 구문을 분석
   * atob = 인코딩된 문자열 데이터를 디코딩 (https://developer.mozilla.org/ko/docs/Web/API/atob)
   * https://velopert.com/2389
   */
  const storedIdToken = sessionStorage.getItem('idToken');
  if (storedIdToken) {
    const idTokenPayload = JSON.parse(atob(storedIdToken.split('.')[1]));
    // const idTokenPayload = JSON.parse((storedIdToken.split('.')[1]));
    // const kakaoUserId = idTokenPayload.aud;
    const kakaoUserId = idTokenPayload.sub;
    employee.value.snsKey = kakaoUserId;
  }
// URL에서 카카오 인증 코드 가져오기
  /*  const authCode = router.currentRoute.value.query.code;
    if (authCode) {
      employee.value.snsKey = authCode;
    }*/
  // 세션 스토리지에서 카카오 리프레쉬 토큰 불러오기
  /*  const kakaoRefreshToken = sessionStorage.getItem('KAKAO_REFRESH_TOKEN');
    if (kakaoRefreshToken) {
      employee.value.snsKey = kakaoRefreshToken;
    }*/
});

const getKakaoProfile = () => {
  return new Promise((resolve, reject) => {
    Kakao.API.request({
      url: '/v2/user/me',
      success: (response) => {
        const profile = {
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

const handleSubmit = async () => {

  const kakaoUserId = employee.value.snsKey;

  employee.value.empAuthCd = '03';
  employee.value.snsCd = '01';
  employee.value.snsKey = kakaoUserId;

  // employee.value.snsKey = sessionStorage.getItem('KAKAO_ID_TOKEN');
  // employee.value.snsKey = sessionStorage.getItem('KAKAO_REFRESH_TOKEN');

  try {
    const response = await loginStore.kakaoJoin(employee.value);
    alert('회원가입이 완료되었습니다.');
    await router.push({path: '/main'});
  } catch (error) {
    alert('회원가입에 실패했습니다.');
    console.error(error);
  }
};
</script>