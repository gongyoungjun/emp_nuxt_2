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
  </div>
</template>

<script>

</script>

<style scoped>
.main-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

</style>
