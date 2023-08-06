<template>
  <div id="app">
    <div v-if="isLoggedIn">
      <!-- 로그인 성공 시 보여질 컨텐츠 -->
      <nuxt />
    </div>
    <div v-else>
      <!-- 로그인 폼을 가져와서 보여줍니다 -->
      <LoginForm @loginSuccess="loginSuccess" @loginFailed="loginFailed" />
      <nuxt-link to="/login/sign">회원가입</nuxt-link>
    </div>
  </div>
</template>

<script>
import LoginForm from "/pages/login/login.vue"; // 로그인 폼 컴포넌트를 가져옵니다.

export default {
  name: "App",
  components: {
    LoginForm, // 로그인 폼을 등록합니다.
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    loginSuccess() {
      this.isLoggedIn = true;
      alert("로그인 성공!");
    },
    loginFailed() {
      alert("로그인 실패. 사용자 이름과 비밀번호를 확인하세요.");
    },
    logout() {
      this.isLoggedIn = false;
    },
  },
};
</script>

