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
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app';
import { useAuthStore } from '../../store/login';
import { ref } from 'vue';

const router = useRouter();
const { login: authLogin } = useAuthStore();

const userPhn = ref('');
const password = ref('');
const errorMessage = ref("");

// 로그인 페이지에 접속했을 때 이미 로그인된 상태인지 확인
if (localStorage.getItem('token')) {
  router.push({ path: '/main' });
}


async function login() {
  errorMessage.value = '';

  try {
    const response = await authLogin({
      empPhn: userPhn.value,
      empPwd: password.value,
    });
    const { data } = response;

    if (data && data.value.code != '0000') {
      errorMessage.value = data.value.message;
    } else if (data && data.value.code == '0000') {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', data.value.token);
      await router.push({ path: '/main' });
    }
  } catch (error) {
    errorMessage.value = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}


console.log(localStorage.getItem('Authorization'));  // "Authorization" 항목 조회
console.log(localStorage.getItem('token'));         // "token" 항목 조회
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
