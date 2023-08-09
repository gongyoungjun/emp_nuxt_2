<template>
  <div class="main-container">
    <h1>메인 페이지</h1>
    <ul>
      <nav>
        <nuxt-link to="/emp/empList">직원 목록</nuxt-link>
      </nav>
      <nav>
        <nuxt-link to="/vc/vcList">휴가 목록</nuxt-link>
      </nav>
      <nav>
<!--        <nuxt-link to="/vc/vcCreate">휴가 신청</nuxt-link>-->
      </nav>
    </ul>
    <button @click="logout">로그아웃</button>
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
      //기본 주소
      window.location.href = 'http://localhost:3000';
      // 로그인 페이지
      /*router.push('/login');*/
    }

    return {
      logout
    };
  }
}
</script>

<style scoped>
.main-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

</style>
