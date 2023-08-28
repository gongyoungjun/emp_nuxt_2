<template>
  <div>
    <h1>휴가 신청 정보 입력</h1>
    <v-form>
      <label>사원번호:</label>
      <input v-model="vctn.empNo" type="text" readOnly><br>
      <label>사원이름:</label>
      <input v-model="vctn.empNm" type="text" readOnly><br>
      <label>남은 휴가:</label>
      <input v-model="vctn.vctnRsdCnt" type="text" readOnly><br>
      <label>연차 분류:</label>
      <select v-model="vctn.vctnKndCd">
        <option v-for="s in state" :key="s.value" :value="s.value">
          {{ s.name }}
        </option>
      </select>
      <br><label>휴가 사유:</label>
      <input v-model="vctn.vctnRsn" type="text"><br>
      <label>휴가 시작 날짜:</label>
      <input v-model="vctn.vctnStrDt" type="date"><br>
      <label>휴가 마지막 날짜:</label>
      <input v-model="vctn.vctnEndDt" type="date"><br>
      <label>휴가 일수:</label>
      <input v-model="totalVacationDays" type="text" readOnly><br>
      <v-btn variant="text" className="me-4" @click="handleSubmit">
        휴가신청
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
import {onMounted, ref, watch } from 'vue';
import {useVctnStore} from '~/store/vctn';
import {useEmpStore} from '~/store/emp';
import jwtDecode from 'jwt-decode';
import {useRouter} from 'nuxt/app';

const router = useRouter();
const empStore = useEmpStore();
const store = useVctnStore();

const totalVacationDays = ref(0);

const vctn = ref({
  empNo: '',
  empNm: '',
  vctnRsn: '',
  vctnStrDt: '',
  vctnEndDt: '',
  empVctnTtl: '',
  vctnHalfCnt: '',
  vctnDayCnt: '',
  vctnRsdCnt: '',
  vctnAplDtm: '',
  vctnKndCd: '',
  vctnStCd: '',
});

const empData = ref({
  empNo: '',
  empNm: '',
  empVctnTtl: '',
});
const state = ref([
  {name: "연차", value: "01"},
  {name: "오전반차", value: "02"},
  {name: "오후반차", value: "03"},
  {name: "휴가", value: "04"},
  {name: "병가", value: "05"},
]);

onMounted(fetchEmpData);

watch([vctn.value.vctnStrDt, vctn.value.vctnEndDt], () => {
  console.log("Start Date:", vctn.value.vctnStrDt);
  console.log("End Date:", vctn.value.vctnEndDt);
  if (vctn.value.vctnStrDt && vctn.value.vctnEndDt) {
    totalVacationDays.value = getWorkdaysBetween(new Date(vctn.value.vctnStrDt), new Date(vctn.vctnEndDt.value));
    console.log("Total Days:", totalVacationDays.value);
  }
});

async function fetchEmpData() {
  let empNo = null;
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    empNo = decodedToken.empNo;
  }

  if (!empNo) {
    empNo = router.currentRoute.value.query.empNo;
  }

  if (empNo) {
    const response = await empStore.empInfoUser({empNo: empNo});
    if (response && response.data && response.data.value) {
      empData.value = response.data.value.data;
      vctn.value.empNo = empData.value.empNo;
      vctn.value.empNm = empData.value.empNm;
      vctn.value.vctnRsdCnt = empData.value.vctnRsdCnt;
      vctn.value.empVctnTtl = empData.value.empVctnTtl;
    } else {
      console.error("Error: 사원 정보를 가져올 수 없습니다.");
    }
  }
}

async function handleSubmit() {
  const response = await store.vctnInsert(vctn.value);
  if (response && response.data && response.data.value) {
    vctn.value = response.data.value.data;
    await router.push({path: '/vc/vcList'});
  } else {
    console.error("Error: 휴가 신청에 실패했습니다.");
  }
}

function isWeekend(date) {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0은 일요일, 6은 토요일
}

function getWorkdaysBetween(startDate, endDate) {
  let totalDays = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      totalDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalDays;
}


</script>

<style>

</style>
