<template>
  <div>
    NO:
    <input v-model="vctn.vctnNo" placeholder="No" disabled /><br />
    사번:
    <input v-model="vctn.empNo" placeholder="사번" disabled /><br />
    이름:
    <input v-model="vctn.empNm" placeholder="이름" disabled /><br />
    휴가 종류:
    <input v-model="vctn.vctnKndCd" placeholder="휴가 종류" disabled /><br />
    휴가 시작일:
    <input v-model="vctn.vctnStrDt" placeholder="휴가 시작일" disabled /><br />
    휴가 마지막일:
    <input v-model="vctn.vctnEndDt" placeholder="휴가 마지막일" disabled /><br />
    연차 신청 일수:
    <input v-model="vctn.vctnDayCnt" placeholder="휴가 마지막일" disabled /><br />
    휴가 신청일:
    <input v-model="vctn.vctnAplDtm" placeholder="휴가 신청일" disabled /><br />
    휴가 사유:
    <input v-model="vctn.vctnRsn" placeholder="휴가 사유" disabled /><br />
    휴가:
    <select v-model="vctn.vctnStCd" v-if="isEditing">
      <option v-for="item in state" :key="item.value" :value="item.value">{{ item.name }}</option>
    </select>
    <span v-else>{{ getStateName(vctn.vctnStCd) }}</span>

    <br /><br /><br />
    <button @click="toggleEdit">{{ isEditing ? '취소' : '편집' }}</button>
    <br>
    <button @click="saveVctn" v-if="isEditing">승인 및 저장</button>
    <br>
    <button @click="vctnList">목록</button>
  </div>
</template>

<script setup>
import { ref, toRaw, computed } from "vue";
import { useVctnStore } from "../../store/vctn";
import { useRouter } from "nuxt/app";

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
  { name: "신청", value: "01" },
  { name: "승인", value: "02" },
  { name: "반려", value: "03" },
]);
const isEditing = ref(false);

async function getVctnInfo() {
  const vctnNo = router.currentRoute.value.query.vctnNo;
  if (vctnNo) {
    const response = await store.vctnDetail({ vctnNo: vctnNo });
    if (response && response.data && response.data.value && response.data.value.vacationList) {
      vctn.value = response.data.value.vacationList[0]; // 휴가 정보
    } else {
      console.error("오류: 휴가 정보를 가져올 수 없습니다.");
    }
  }
}

getVctnInfo();

async function saveVctn() {
  const response = await store.vctnSt(toRaw(vctn.value));
  if (response && response.data && response.data.value) {
    vctn.value = response.data.value.vacationList;
    await router.push({ path: "/vc/vcList" });
  } else {
    console.error("오류: 휴가 정보를 업데이트하는데 실패했습니다.");
  }
}

function toggleEdit() {
  isEditing.value = !isEditing.value;
}

function vctnList() {
  router.replace({ path: "/vc/vcList" });
}

const getStateName = (stateCode) => {
  const foundState = state.value.find((item) => item.value === stateCode);
  return foundState ? foundState.name : "";
};

</script>
