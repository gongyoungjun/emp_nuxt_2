<template>
  <NuxtLayout>
    <div class="employee-form">
      <h2>사원 정보 수정</h2>
      <div class="form-group">
        <label>사원번호</label>
        <input v-model="empData.empNo" placeholder="사원 번호" disabled/>
      </div>
      <div class="form-group">
        <label>이름</label>
        <input v-model="empData.empNm" placeholder="이름"/>
      </div>
      <div class="form-group">
        <label>직급</label>
        <select v-model="empData.empRnkCd" @change="updateRnkNm">
          <option v-for="item in rnkCd" :key="item.value" :value="item.value">{{ item.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>이메일</label>
        <input v-model="empData.empEml" placeholder="이메일"/>
      </div>
      <div class="form-group">
        <label>생년월일</label>
        <input v-model="empData.empBrtDt" placeholder="생년월일"/>
      </div>
      <div class="form-group">
        <label>입사일</label>
        <input v-model="empData.empHrDt" placeholder="입사일"/>
      </div>
      <div class="form-group">
        <label>재직상태</label>
        <select v-model="empData.empStCd" @change="updateStNm">
          <option v-for="item in stCd" :key="item.value" :value="item.value">{{ item.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>총 휴가 일수</label>
        <input v-model="empData.empVctnTtl" placeholder="총 휴가 일수" disabled/>
      </div>
      <button @click="editEmp">수정 및 확인</button>
    </div>
  </NuxtLayout>
</template>

<script setup>
import {ref, toRaw, onMounted} from 'vue';
import {useRouter} from 'nuxt/app';
import {useEmpStore} from '~/store/emp';


const router = useRouter();
const store = useEmpStore();


const empData = ref({
  empNo: '',
  empNm: '',
  empPhn: '',
  empRnkCd: '',
  empEml: '',
  empBrtDt: '',
  empHrDt: '',
  empStCd: '',
  empVctnTtl: '',
});


const CdData = ref({
  empNo: '',
  empNm: '',
  empPhn: '',
  empRnkCd: '',
  empEml: '',
  empBrtDt: '',
  empHrDt: '',
  empStCd: '',
  empVctnTtl: '',
});


const rnkCd = ref([

  {name: "사원", value: "01"},
  {name: "대리", value: "02"},
  {name: "과장", value: "03"},
  {name: "차장", value: "04"},
  {name: "부장", value: "05"},
  {name: "이사", value: "06"},
  {name: "대표", value: "07"},
]);


const stCd = ref([
  {name: "재직", value: "01"},
  {name: "퇴사", value: "02"},
  {name: "휴직", value: "03"},
]);

fetchEmpData();

async function fetchEmpData() {
  const empNo = router.currentRoute.value.query.empNo;
  if (empNo) {
    const response = await store.empInfoUser({empNo: empNo});

    if (response && response.data && response.data.value) {
      empData.value = response.data.value.data;
    } else {
      console.error("Error: 사원 정보를 가져올 수 없습니다.");
    }
  }
}

fetchEmpData(); // 컴포넌트가 생성되고 화면에 렌더링된 후에 데이터를 받아오도록 변경

async function editEmp() {
  const response = await store.empUpdate(toRaw(empData.value));
  console.log("응답 결과:", response); // 응답 데이터를 출력하여 확인

  if (response && response.data && response.data.value) {
    empData.value = response.data.value.data; // 업데이트된 데이터를 다시 할당합니다.

    console.log("사원 정보가 수정되었습니다.");
    await router.push({ path: '/emp/empList' });
  } else {
    console.error("Error: 사원 정보를 수정하는데 실패했습니다.");
  }
}

/**
 * empData 선택된 코드 값
 * rnkCd 배열에서 해당 코드 찾고
 * CdData의 empRnkNm 저장
 */
/*function updateRnkNm() {
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
}*/

</script>


<style scoped>

.employee-form {
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

button:hover {
  background-color: #0056b3;
}
</style>