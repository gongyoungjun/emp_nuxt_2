<template>
  <NuxtLayout>
    <div class="vacation-form">
      NO:
      <input v-model="vctn.vctnNo" placeholder="No" disabled/><br/>
      사번:
      <input v-model="vctn.empNo" placeholder="사번" disabled/><br/>
      이름:
      <input v-model="vctn.empNm" placeholder="이름" disabled/><br/>
      휴가 종류:
      <input v-model="vctn.vctnKndCd" placeholder="휴가 종류" disabled/><br/>
      휴가 시작일:
      <input v-model="vctn.vctnStrDt" placeholder="휴가 시작일" disabled/><br/>
      휴가 마지막일:
      <input v-model="vctn.vctnEndDt" placeholder="휴가 마지막일" disabled/><br/>
      연차 신청 일수:
      <input v-model="vctn.vctnDayCnt" placeholder="휴가 마지막일" disabled/><br/>
      휴가 신청일:
      <input v-model="vctn.vctnAplDtm" placeholder="휴가 신청일" disabled/><br/>
      휴가 사유:
      <input v-model="vctn.vctnRsn" placeholder="휴가 사유" disabled/><br/>
      휴가:
      <select v-model="vctn.vctnStCd">
        <option v-for="item in state" :key="item.value" :value="item.value">{{ item.name }}</option>
      </select>

      <br/><br/><br/>
      <button @click="saveVctn">승인 및 저장</button>
      <br>
      <button @click="vctnList">목록</button>
    </div>
  </NuxtLayout>
</template>

<script setup>
import {ref, toRaw, computed} from "vue";
import {useVctnStore} from "../../store/vctn";
import {useRouter} from "nuxt/app";

const store = useVctnStore();
const router = useRouter();
const vctn = ref({
  vctnNo: "",
  empNo: "",
  empNm: "",
  vctnKndCd: "",
  vctnRsdCnt: "",
  vctnStrDt: "",
  vctnEndDt: "",
  vctnAplDtm: "",
  vctnRsn: "",
  vctnStCd: "",
});
const state = ref([
  {name: "신청", value: "01"},
  {name: "승인", value: "02"},
  {name: "반려", value: "03"},
]);
const isEditing = ref(false);

async function getVctnInfo() {
  const vctnNo = router.currentRoute.value.query.vctnNo;
  if (vctnNo) {
    const response = await store.vctnDetail({vctnNo: vctnNo});

    if (response && response.data && response.data.value) {
      vctn.value = response.data.value.data; // 휴가 정보
    } else {
      console.error("오류: 휴가 정보를 가져올 수 없습니다.");
    }
  }
}

getVctnInfo();

async function saveVctn() {
  const response = await store.vctnSt(toRaw(vctn.value));

  if (response && response.data && response.data.value) {
    vctn.value = response.data.value.data;
    await router.push({path: '/vc/vcList'});
  } else {
    console.error("오류: 휴가 정보를 업데이트하는데 실패했습니다.");
  }
}

function vctnList() {
  router.replace({path: "/vc/vcList"});
}

/*const getStateName = (stateCode) => {
  const foundState = state.value.find((item) => item.value === stateCode);
  return foundState ? foundState.name : "";
};*/

</script>


<style scoped>


.vacation-form {
  max-width: 400px;
  margin: auto;
  margin-top: 45px;
  margin-bottom: 45px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  display: block;
  margin: auto;
  margin-top: 15px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:last-child {
  margin: auto;
}

button:hover {
  background-color: #0056b3;
}
</style>