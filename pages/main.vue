<template>
  <div class="main-container">
    <h1>메인 페이지</h1>
    <ul>
      <li><a @click="goToEmpList">직원 목록</a></li>
      <li><a @click="goToVCList">휴가 목록</a></li>
      <li><a @click="goToCreateVC">휴가 신청</a></li>
    </ul>
  </div>
</template>

<script>
import {useRouter} from "nuxt/app";

const router = useRouter()

router.push({path: '/emp/emplist'})

router.push({path: '/vacation/vclist'})

router.push({path: '/vacation/createvc'})




</script>

<style scoped>
.main-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

a {
  display: block;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

a:hover {
  background-color: #0056b3;
}
</style>
