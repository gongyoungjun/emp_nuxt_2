<template>

</template>


<script setup>
import {onMounted} from 'vue';
import {useRouter} from "#app";

const router = useRouter();
onMounted(async () => {

  let code = new URL(window.location.href).searchParams.get("code")
  console.log('인가 코드 확인:', code);

  await router.push({path: '/login/login'});
});


</script>
