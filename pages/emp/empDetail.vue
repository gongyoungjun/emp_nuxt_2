<template>
  <div>
    사원번호
    <input v-model="empData.empNo" placeholder="사원 번호" disabled/> <br>
    이름
    <input v-model="empData.empNm" placeholder="이름"/> <br>
    직급
    <select v-model="empData.empRnkCd"  @change="updateRnkNm">
      <option v-for="item in rnkCd" :key="item.value" :value="item.value">{{ item.name }}</option>
    </select><br>
    이메일
    <input v-model="empData.empEml" placeholder="이메일"/> <br>
    생년월일
    <input v-model="empData.empBrtDt" placeholder="생년월일" /> <br>
    입사일
    <input v-model="empData.empHrDt" placeholder="입사일" /> <br>
    재직상태

    <select v-model="empData.empStCd" @change="updateStNm">
      <option v-for="item in stCd" :key="item.value" :value="item.value">{{ item.name }}</option>
    </select>

    <br>
    총 휴가 일수
    <input v-model="empData.empVctnTtl" placeholder="총휴가일수" disabled/> <br>

    <button @click="editEmp">수정 및 확인</button>
  </div>
</template>

<script setup>
import {ref, toRaw,onMounted} from 'vue';
import {useRouter} from 'nuxt/app';
import {useEmpStore} from '~/store/emp';


const router = useRouter();
const store = useEmpStore();


const empData = ref({
  empNo: '',
  empNm: '',
  empPhn:'',
  empRnkCd: '',
  empEml: '',
  empBrtDt: '',
  empHrDt: '',
  empStCd:'',
  empVctnTtl: '',
});


const CdData = ref({
  empNo: '',
  empNm: '',
  empPhn:'',
  empEml: '',
  empBrtDt: '',
  empHrDt: '',
  empVctnTtl: '',
  empRnkNm: '',
  empStNm: '',
});


const rnkCd = ref([

  { name: "사원", value: "01" },
  { name: "대리", value: "02" },
  { name: "과장", value: "03" },
  { name: "차장", value: "04" },
  { name: "부장", value: "05" },
  { name: "이사", value: "06" },
  { name: "대표", value: "07" },
]);


const stCd = ref([
  { name: "재직", value: "01" },
  { name: "퇴사", value: "02" },
  { name: "휴직", value: "03" },
]);

onMounted(() => {
  fetchEmpData();
});
async function fetchEmpData() {
  const empNo = router.currentRoute.value.query.empNo;
  if (empNo) {
    const response = await store.empInfoUser({empNo: empNo});
    if (response && response.data && response.data.value) {
      empData.value = response.data.value.data;
      updateRnkNm();
      updateStNm();
    } else {
      console.error("Error: 사원 정보를 가져올 수 없습니다.");
    }
  }
}

/**
 * empData 선택된 코드 값
 * rnkCd 배열에서 해당 코드 찾고
 * CdData의 empRnkNm 저장
 */
function updateRnkNm() {
  const foundRnk = rnkCd.value.find(item => item.value === empData.value.empRnkCd);
  if (foundRnk) {
    CdData.value.empRnkNm = foundRnk.name;
  }
}
function updateStNm() {
  const foundSt = stCd.value.find(item => item.value === empData.value.empStCd);
  if (foundSt) {
    CdData.value.empStNm = foundSt.name;
  }
}

fetchEmpData(); // 컴포넌트가 생성되고 화면에 렌더링된 후에 데이터를 받아오도록 변경

async function editEmp() {
  const response = await store.empUpdate(toRaw(empData.value));
        console.log("응답 결과:", response); // 응답 데이터를 출력하여 확인
  if (response && response.data && response.data.value) {
    empData.value = response.data.value.data; // 업데이트된 데이터를 다시 할당합니다.

    console.log("사원 정보가 수정되었습니다.");
    await router.push({path: '/emp/empList'});
  } else {
    console.error("Error: 사원 정보를 수정하는데 실패했습니다.");
  }
}

</script>

