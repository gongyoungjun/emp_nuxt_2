<template>
  <div>
    사원번호
    <input v-model="empData.empNo" placeholder="사원 번호" disabled/> <br>
    이름
    <input v-model="empData.empNm" placeholder="이름"/> <br>
    직급
    <input v-model="empData.empRnkCd" placeholder="직급"/> <br>
    이메일
    <input v-model="empData.empEml" placeholder="이메일"/> <br>
    생년월일
    <input v-model="empData.empBrtDt" placeholder="생년월일"/> <br>
    입사일
    <input v-model="empData.empHrDt" placeholder="입사일"/> <br>
    재직상태
    <input v-model="empData.empStCd" placeholder="재직상태"/> <br>
    비밀번호
    <input v-model="empData.empPwd" type="password" placeholder="비밀번호"/><br>
    총 휴가 일수
    <input v-model="empData.empVctnTtl" placeholder="총휴가일수"/> <br>

    <button @click="editEmp">수정 및 확인</button>
  </div>
</template>

<script setup>
import {ref, toRaw} from 'vue';
import {useRouter} from 'nuxt/app';
import {useEmpStore} from '~/store/emp';


const router = useRouter();
const store = useEmpStore();
const empData = ref({
  empNo: '',
  empNm: '',
  empPwd: '',
  empRnkCd: '',
  empEml: '',
  empBrtDt: '',
  empHrDt: '',
  empStCd: '',
  empVctnTtl: '',
  valid: true,
});

async function fetchEmpData() {
  const empNo = router.currentRoute.value.query.empNo;
  if (empNo) {

    const response = await store.empInfoUser({empNo: empNo});
    if (response && response.data && response.data.value && response.data.value.list) {
      empData.value = response.data.value.list[0]; // 사원 정보
    } else {
      console.error("Error: 사원 정보를 가져올 수 없습니다.");
    }
  }
}

fetchEmpData(); // 컴포넌트가 생성되고 화면에 렌더링된 후에 데이터를 받아오도록 변경

async function editEmp() {
  const response = await store.empUpdate(toRaw(empData.value));
  /*      console.log("응답 결과:", response); // 응답 데이터를 출력하여 확인*/
  if (response && response.data && response.data.value) {
    empData.value = response.data.value.list; // 업데이트된 데이터를 다시 할당합니다.
    console.log("사원 정보가 수정되었습니다.");
    await router.push({path: '/emp/empList'});
  } else {
    console.error("Error: 사원 정보를 수정하는데 실패했습니다.");
  }
}


</script>

