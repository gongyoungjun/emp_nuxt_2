<template>
  <div>
    <h1>회원가입</h1>
    <form @submit.prevent="handleSubmit">
      <label>사번:</label>
      <input v-model="employee.empNo" type="number" required><br>
      <label>사원이름:</label>
      <input v-model="employee.empNm" type="text" required><br>
      <label>비밀번호:</label>
      <input v-model="employee.empPwd" type="password" required><br>
      <label>전화번호:</label>
      <input v-model="employee.empPhn" type="text"><br>
      <label>이메일:</label>
      <input v-model="employee.empEml" type="email"><br>
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

<script>
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';

const authStore = useAuthStore();
export default {
  setup() {
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
    });


    const handleSubmit = async () => {
      try {
        const response = await authStore.join(employee.value);
        alert('회원가입이 완료되었습니다.')
        // 회원가입이 성공했을 때, 처리할 내용을 추가하세요.
      } catch (error) {
        alert('회원가입에 실패했습니다.');
        console.error(error);
      }
    };

    return {
      employee,
      handleSubmit,
    };
  },
};
</script>
