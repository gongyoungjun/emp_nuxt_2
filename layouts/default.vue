<template>
  <div>
    <v-app-bar color="gray" dense dark>
      <v-row style="">
        <nuxt-link to="/main" style="margin-left: 300px">
          <v-btn outlined color="black">
            목록
          </v-btn>
        </nuxt-link>

        <nuxt-link to="/emp/empList" style="margin-left: 100px">
          <v-btn outlined color="black">
            직원 목록
          </v-btn>
        </nuxt-link>

        <nuxt-link to="/vc/vcList" style="margin-left: 100px">
          <v-btn outlined color="black">
            휴가 목록
          </v-btn>
        </nuxt-link>

        <nuxt-link to="/emp/empCommuteList" style="margin-left: 100px">
          <v-btn outlined color="black">
            출퇴근 목록
          </v-btn>
        </nuxt-link>

<!--        <nuxt-link to="/emp/CommuteUser" style="margin-left: 100px">
          <v-btn outlined color="black">
            출퇴근 목록
          </v-btn>
        </nuxt-link>-->


        <v-btn color="gray" @click="logout" style="margin-left: 700px">
          <v-icon color="black">mdi-logout</v-icon>
          로그아웃
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-main class="w-100 pa-lg-10">
      <slot/>
    </v-main>

    <v-footer app color="black" dark>
      <h1>footer</h1>
      <slot name="footer"/>
    </v-footer>
  </div>
</template>

<script setup>
import {useRouter} from 'nuxt/app';

const router = useRouter();

/*onBeforeMount(() => {
  if (empAuthCd === '03') {
    showUser.value = true;
  } else if (empAuthCd === '01') {
    showAdmin.value = true;
  }
});
const showUser = computed(() => {
  return empAuthCd === '03';
});

const showAdmin = computed(() => {
  return empAuthCd === '01';
});*/


// 로그아웃 함수
function logout() {
  // 토큰 제거
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('KAKAO_TOKEN'); // 카카오 토큰도 제거
  sessionStorage.removeItem('KAKAO_REFRESH_TOKEN');
  sessionStorage.removeItem('KAKAO_ID_TOKEN');
  sessionStorage.removeItem('idToken');

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
