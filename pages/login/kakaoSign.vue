<template>
  <div>
    <h1>카카오 추가 정보 입력</h1>
    <form @submit.prevent="handleSubmit">
      <label>사원번호:</label>
      <input v-model="employee.empNo" type="text" readOnly><br>
      <label>사원이름:</label>
      <input v-model="employee.empNm" type="text" readOnly><br>
      <label>비밀번호:</label>
      <input v-model="employee.empPwd" type="password" required><br>
      <label>전화번호:</label>
      <input v-model="employee.empPhn" type="text" required><br>
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
import {useEmpStore} from '~/store/emp';
import {useRouter, useRoute} from 'nuxt/app';
import {useAuthStore} from "~/store/login";

const loginStroe = useAuthStore();
const router = useRouter();
const route = useRoute();
const empStore = useEmpStore();

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
  console.log('Received query params:', route.query);
  if (route.query.snsKey) {
    try {
      employee.value.snsKey = route.query.snsKey;

      console.log('Requesting profile for snsKey:', employee.value.snsKey);

      const profileResponse = await empStore.kakaoInfoUser({
        snsKey: route.query.snsKey,
      });

      console.log('Profile response:', profileResponse);

      if (profileResponse.data && profileResponse.data.value && profileResponse.data.value.list && profileResponse.data.value.list.length > 0) {
        const profileData = profileResponse.data.value.list[0];
        console.log('Received profile data:', profileData);

        // 프로필 데이터에서 필요한 필드들을 가져와 변수에 저장
        employee.value.empNm = profileData.empNm;
        employee.value.empEml = profileData.empEml;
        employee.value.empNo = profileData.empNo;
        employee.value.empPhn = profileData.empPhn;

      } else {
        console.error('프로필 불러오기 실패:', profileResponse.error);
        // 실패 시 사용자에게 알림 메시지 표시
      }
    } catch (error) {
      console.error('프로필 불러오기 실패:',  error.message ? error.message : error);
      // 실패 시 사용자에게 알림 메시지 표시
    }
  }
});






const handleSubmit = async () => {

  const kakaoUserId = employee.value.snsKey;

  employee.value.empAuthCd = '03';
  employee.value.snsCd = '01';
  employee.value.snsKey = kakaoUserId;

  // employee.value.snsKey = sessionStorage.getItem('KAKAO_ID_TOKEN');
  // employee.value.snsKey = sessionStorage.getItem('KAKAO_REFRESH_TOKEN');

  try {
    const response = await loginStroe.kakaoUpdate(employee.value);

    // 백엔드 응답에서 JWT 토큰 추출
    const token = response.data.value.token;

    // JWT 토큰을 로컬 스토리지에 저장
    localStorage.setItem('token', token);
    console.log('로그인 후 토큰:', localStorage.getItem('token'));


    alert('회원가입이 완료되었습니다.');
    await router.push({path: '/main'});
  } catch (error) {
    alert('회원가입에 실패했습니다.');
    console.error(error);
  }
};
</script>