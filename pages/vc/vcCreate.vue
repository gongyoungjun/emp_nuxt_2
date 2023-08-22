<template>
  <div>
    <h1>휴가 신청 정보 입력</h1>

    <v-form>
      <label>사원번호:</label>
      <input v-model="vctn.empNo" type="text" readOnly><br>
      <label>사원이름:</label>
      <input v-model="vctn.empNm" type="text" readOnly><br>
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
      <!--      <label>총 휴가일 수:</label>
            <input v-model="vctn.empVctnTtl" type="text" readOnly><br>-->

      <!--      <label>잔여휴가:</label>
            <input v-model="vctn.vctnRsdCnt" type="text" readOnly><br>-->
      <v-btn variant="text" class="me-4" @click="handleSubmit" >
        휴가신청
      </v-btn>
    </v-form>
  </div>
</template>


<script setup>
import {onMounted, ref, toRaw, watchEffect} from 'vue';
import {useVctnStore} from '~/store/vctn';
import {useEmpStore} from '~/store/emp';
import jwtDecode from 'jwt-decode';
import {useRouter} from 'nuxt/app';

const router = useRouter();
const empStore = useEmpStore();
const store = useVctnStore();

/**
 * jwt 토큰
 * empNo 받아오기
 */
const token = localStorage.getItem('token');
const decodedToken = jwtDecode(token);

console.log(decodedToken.empNo);


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

/*watchEffect(() => {
  if (vctn.value.vctnKndCd === "02" || vctn.value.vctnKndCd === "03") {
    // 오전반차나 오후반차를 선택한 경우, 시작 날짜와 종료 날짜를 동기화
    vctn.value.vctnEndDt = vctn.value.vctnStrDt;
  }
});*/


/*onMounted(async () => {
  await fetchEmpData();
});*/

fetchEmpData();

/**
 * 데이터 가져오기
 * @returns {Promise<void>}
 */
async function fetchEmpData() {
  let empNo = null;
  // JWT 가져오기
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    // 디코드된 토큰에서 empNo 가져오기
    empNo = decodedToken.empNo;
  }
  if (!empNo) {
    // router 객체를 사용하여 empNo 가져오기
    empNo = router.currentRoute.value.query.empNo;
  }
  if (empNo) {
    const response = await empStore.empInfoUser({empNo: empNo});
    if (response && response.data && response.data.value && response.data.value.list) {
      empData.value = response.data.value.list[0]; // 사원 정보
      vctn.value.empNo = empData.value.empNo;   // 사원 번호
      vctn.value.empNm = empData.value.empNm;   // 사원 이름
      vctn.value.empVctnTtl = empData.value.empVctnTtl
    } else {
      console.error("Error: 사원 정보를 가져올 수 없습니다.");
    }
  }
}

/**
 * 휴가 데이터 업로드
 * toRaw 원복 객체 반환
 * @returns {Promise<void>}
 */
async function handleSubmit() {
  const response = await store.vctnInsert(vctn.value);
  //vctn.value.vctnStCd = '01';

  if (response && response.data && response.data.value) {
    vctn.value.vacationList = response.data.value.vacationList; // 업데이트된 데이터를 다시 할당합니다.
    //console.log("콘솔이다", response.data.value.vacationList);

    console.log("휴가 신청 성공.");

    await router.push({path: '/vc/vcList'});
  } else {
    console.error("Error: 휴가 신청에 실패했습니다.");
  }
}

</script>

<style>

</style>
