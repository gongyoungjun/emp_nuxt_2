<template>
  <h1 @click="test">hello world</h1>
</template>


<script setup>
import {useAuthStore} from "~/store/auth";

const router = useRouter()
const authStore = useAuthStore();
let param = {
  thisMonth: "",
}
const {data} = await authStore(param)
console.log("data", data.value.data)

function test(){
  router.push({
    path: "/detail",
    query: {mbrNo: 2}
  })
}

</script>



<style scoped lang="scss">

</style>
