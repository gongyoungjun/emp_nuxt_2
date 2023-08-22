<template>
  <div>
    <v-app-bar color="gray" dense dark>
      <nuxt-link to="/main">
        <v-btn outlined color="black">
          목록
        </v-btn>
      </nuxt-link>

      <v-spacer></v-spacer>

      <v-btn color="gray" @click="logout">
        로그아웃
        <v-icon color="white">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="w-100 pa-lg-10">
      <slot />
    </v-main>

    <v-footer app color="black" dark>
      <h1>footer</h1>
      <slot name="footer" />
    </v-footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

console.log("layout....");

const router = useRouter();

// 로그아웃 함수
function logout() {
  // 토큰 제거
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');

  // 기본 주소로 리다이렉트
  router.push('/');
}

// 토큰이 없으면 /main 페이지로 이동하지 못하게 설정
watchEffect(() => {
  if (router.currentRoute.value.path === "/main" && !localStorage.getItem('token')) {
    router.push('/');
  }
});

</script>

<style lang="scss">

.menu-btn {
  padding: 10px 20px;
  font-size: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: gray;
  color: white;
  &:hover {
    background-color: darkgray;
  }
}

.v-toolbar__prepend {
  margin-inline-start: 0 !important;
}

.v-footer {
  padding-left: 24px !important;
  padding-right: 24px !important;
}
</style>
