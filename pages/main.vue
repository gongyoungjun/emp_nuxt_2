<template>
  <v-container class="main-container">
    <v-row class="header">
      <v-col>
        <h1 class="title">메인 페이지</h1>
      </v-col>
<!--      <v-col class="d-flex justify-end">
        <v-btn color="error" @click="logout">로그아웃</v-btn>
      </v-col>-->
    </v-row>

    <v-list class="menu-list">
      <v-list-item-group>
        <v-list-item v-for="link in links" :key="link.text" :to="link.path">
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script setup>
import {useRouter } from 'nuxt/app'
import {onMounted} from 'vue';

const links = [
  {text: '직원 목록', path: '/emp/empList'},
  {text: '휴가 신청', path: '/vc/vcCreate'},
  {text: '휴가 목록', path: '/vc/vcList'},
  {text: '출퇴근', path: '/emp/empCommute'},
  {text: '출퇴근 목록', path: '/emp/empCommuteList'},
];

const router = useRouter();

/*function logout() {
  // 토큰 제거
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('KAKAO_TOKEN'); // 카카오 토큰도 제거
  sessionStorage.removeItem('KAKAO_REFRESH_TOKEN');
  sessionStorage.removeItem('KAKAO_ID_TOKEN');
  sessionStorage.removeItem('idToken');
  // 카카오 로그아웃 처리
  if (window.Kakao && Kakao.Auth.getAccessToken()) {
    Kakao.Auth.logout(() => {
      console.log('카카오 로그아웃 완료');
    });
  }

  // 기본 주소
  router.push('/');
}*/

onMounted(async () => {
  // 카카오 SDK 로드 확인
  if (!window.Kakao) {
    const kakaoLoginScript = document.createElement('script');
    kakaoLoginScript.src = "//developers.kakao.com/sdk/js/kakao.js";
    kakaoLoginScript.addEventListener('load', () => {
      Kakao.init('7ab35a2ef3b2ad6d27aa8a80bfc99a3a');  // 카카오 앱 키
    });
    document.head.appendChild(kakaoLoginScript);
  }
})
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 100px auto;
  padding: 20px;
  background: #f7f9fc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  margin: 0;
}

.menu-list {
  list-style: none;
  padding: 0;
}

.menu-list li {
  margin-bottom: 10px;
}

.menu-list li a {
  text-decoration: none;
  padding: 8px 16px;
  display: inline-block;
  border-radius: 4px;
  background: #007BFF;
  color: #fff;
  transition: background 0.3s;
}

.menu-list li a:hover {
  background: #0056b3;
}

.logout-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #b02a37;
}

</style>
