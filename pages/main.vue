<template>
  <NuxtLayout>
  <v-container class="main-container">
    <v-row class="header">
      <v-col>
        <h1 class="title">Main page</h1>
      </v-col>

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
  </NuxtLayout>
</template>

<script setup>
import {useRouter } from 'nuxt/app'
import {onMounted} from 'vue';

const links = [
/*  {text: '직원 목록', path: '/emp/empList'},*/
  {text: '휴가 신청', path: '/vc/vcCreate'},
/*  {text: '휴가 목록', path: '/vc/vcList'},*/
  {text: '출퇴근', path: '/emp/empCommute'},
/*  {text: '출퇴근 목록', path: '/emp/empCommuteList'},*/
];

const router = useRouter();

onMounted(async () => {

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
  padding: 15px 16px;
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
