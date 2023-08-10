<template>
  <div class="main-container">
    <div class="header">
      <h1 class="title">메인 페이지</h1>
      <button class="logout-button" @click="logout">로그아웃</button>
    </div>
    <ul class="menu-list">
      <li><nuxt-link to="/emp/empList">직원 목록</nuxt-link></li>
      <li><nuxt-link to="/vc/vcList">휴가 목록</nuxt-link></li>
      <li><nuxt-link to="/adress/adress">주소 가져오기</nuxt-link></li>
      <li><nuxt-link to="/adress/locationAdress">위치기반 주소 가져오기</nuxt-link></li>
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
      // 기본 주소
      window.location.href = 'http://localhost:3000';
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
