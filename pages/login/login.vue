<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">사용자 이름:</label>
        <input type="text" id="username" v-model="username"/>
      </div>
      <div class="form-group">
        <label for="password">비밀번호:</label>
        <input type="password" id="password" v-model="password"/>
      </div>
      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app';
import { useAuthStore } from '../../store/auth';
import { ref } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');

let errorMessage = ref("")

async function login() {
  errorMessage.value = ''

  try {
    const {data, error} = await authStore.login({
      empNm: username.value,
      empPwd: password.value,
    });
    if (error.value != null) {
      errorMessage.value = '전화번호 또는 비밀번호를 잘못 입력하셨습니다.'
    } else {
      if (data.value.code != '0000') {
        errorMessage.value = data.value.message;
      } else {
        await router.push({path: '/main'})
      }
    }
  } catch (error) {
    // API 호출 중 오류 발생
    alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}
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
