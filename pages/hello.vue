<template>
  <h1 @click="test">hello world</h1>
</template>


<script setup>
import {useLessonStore} from "~/store/lesson"

const router = useRouter()
const lessonStore = useLessonStore()
let param = {
  thisMonth: "",
}
const {data} = await lessonStore.lessonMonth(param)
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