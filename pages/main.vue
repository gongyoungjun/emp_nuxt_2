<template>
  <div class="main-container">
    <div class="header">
      <h1 class="title">메인 페이지</h1>
      <button class="logout-button" @click="logout">로그아웃</button>
    </div>
    <ul class="menu-list">
      <li><nuxt-link to="/emp/empList">직원 목록</nuxt-link></li>
      <li><nuxt-link to="/vc/vcList">휴가 목록</nuxt-link></li>
      <li><nuxt-link to="/emp/empCommute">출퇴근</nuxt-link></li>
<!--      <li><nuxt-link to="/address/address">주소 가져오기</nuxt-link></li>-->
      <li><nuxt-link to="/address/locationAddress">위치기반 주소 가져오기</nuxt-link></li>
    </ul>
  </div>
</template>

<script>
import { useRouter } from 'nuxt/app';

export default {
  setup() {
    const router = useRouter();

    function logout() {
      // 토큰 제거
      localStorage.removeItem('token');
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
    }

    return {
      logout
    };
  },
  mounted() {
    // 카카오 SDK 로드 확인
    if (!window.Kakao) {
      const kakaoLoginScript = document.createElement('script');
      kakaoLoginScript.src = "//developers.kakao.com/sdk/js/kakao.js";
      kakaoLoginScript.addEventListener('load', () => {
        Kakao.init('7ab35a2ef3b2ad6d27aa8a80bfc99a3a');  // 카카오 앱 키
      });
      document.head.appendChild(kakaoLoginScript);
    }
  }
}
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
