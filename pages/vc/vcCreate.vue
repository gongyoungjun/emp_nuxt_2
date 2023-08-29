<template>
  <NuxtLayout>
  <div class="vacation-form">
    <h2 class="form-title">휴가 신청 정보 입력</h2>
    <v-form>
      <div class="form-field">
        <label class="form-label">사원번호:</label>
        <input class="form-input" v-model="vctn.empNo" type="text" readOnly>
      </div>
      <div class="form-field">
        <label class="form-label">사원이름:</label>
        <input class="form-input" v-model="vctn.empNm" type="text" readOnly>
      </div>
      <div class="form-field">
        <label class="form-label">남은 휴가:</label>
        <input class="form-input" v-model="vctn.vctnRsdCnt" type="text" readOnly>
      </div>
      <div class="form-field">
        <label class="form-label">연차 분류:</label>
        <select class="form-select" v-model="vctn.vctnKndCd">
          <option v-for="s in state" :key="s.value" :value="s.value">{{ s.name }}</option>
        </select>
      </div>
      <div class="form-field">
        <label class="form-label">휴가 사유:</label>
        <input class="form-input" v-model="vctn.vctnRsn" type="text">
      </div>
      <div class="form-field">
        <label class="form-label">휴가 시작 날짜:</label>
        <input class="form-input" v-model="vctn.vctnStrDt" type="date">
      </div>
      <div class="form-field">
        <label class="form-label">휴가 마지막 날짜:</label>
        <input class="form-input" v-model="vctn.vctnEndDt" type="date">
      </div>
<!--      <div class="form-field">
        <label class="form-label">휴가 일수:</label>
        <input class="form-input" v-model="totalVacationDays" type="text" readOnly>
      </div>-->
      <div class="form-actions">
        <v-btn variant="contained" color="primary" @click="handleSubmit">휴가신청</v-btn>
      </div>
    </v-form>
  </div>
  </NuxtLayout>
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

.form-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-weight: bold;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-actions {
  margin-top: 20px;
  text-align: right;
}
</style>
