<template>
  <NuxtLayout>
    <div class="employee-form">
      <h2>사원 정보 수정</h2>
      <form @submit.prevent="editEmp">
      <!-- 사원 번호 -->
      <div class="form-group">
        <label for="empNo">사원번호</label>
        <input id="empNo" name="empNo" v-model="empData.empNo" placeholder="사원 번호" disabled />
      </div>

      <!-- 이름 -->
      <div class="form-group">
        <label for="empNm">이름</label>
        <input id="empNm" name="empNm" v-model="empData.empNm" placeholder="이름" />
      </div>

      <!-- 직급 -->
      <div class="form-group">
        <label for="empRnkCd">직급</label>
        <select id="empRnkCd" name="empRnkCd" v-model="empData.empRnkCd">
          <option v-for="item in rnkCd" :key="item.value" :value="item.value">{{ item.name }}</option>
        </select>
      </div>

      <!-- 이메일 -->
      <div class="form-group">
        <label for="empEml">이메일</label>
        <input id="empEml" name="empEml" v-model="empData.empEml" placeholder="이메일" />
      </div>

      <!-- 생년월일 -->
      <div class="form-group">
        <label for="empBrtDt">생년월일</label>
        <input id="empBrtDt" name="empBrtDt" v-model="empData.empBrtDt" placeholder="생년월일" />
      </div>

      <!-- 입사일 -->
      <div class="form-group">
        <label for="empHrDt">입사일</label>
        <input id="empHrDt" name="empHrDt" v-model="empData.empHrDt" placeholder="입사일" />
      </div>

      <!-- 재직상태 -->
      <div class="form-group">
        <label for="empStCd">재직상태</label>
        <select id="empStCd" name="empStCd" v-model="empData.empStCd">
          <option v-for="item in stCd" :key="item.value" :value="item.value">{{ item.name }}</option>
        </select>
      </div>

      <!-- 총 휴가 일수 -->
      <div class="form-group">
        <label for="empVctnTtl">총 휴가 일수</label>
        <input id="empVctnTtl" name="empVctnTtl" v-model="empData.empVctnTtl" placeholder="총 휴가 일수"  />
      </div>

      <!-- 수정 버튼 -->
      <button type="submit">수정 및 확인</button>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup>
import {ref, toRaw, onMounted} from 'vue';
import {useRouter} from 'nuxt/app';
import {useEmpStore} from '../../store/emp';


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

onMounted(async () => {
  await fetchEmpData();
  updateRnkNm();
});


async function fetchEmpData() {
  const empNo = router.currentRoute.value.query.empNo;
  console.log("Fetching empData for empNo:", empNo); // empNo 출력

  if (empNo) {
    const response = await store.empInfoUser({empNo: empNo});

    console.log("Fetched empData:", response.data); // 응답받은 데이터 출력

    if (response && response.data && response.data.value) {
      empData.value = response.data.value.data;
    } else {
      console.error("Error: 사원 정보를 가져올 수 없습니다.");
    }
  }
}
async function editEmp() {
  console.log("Updating empData:", toRaw(empData.value)); // 수정 전 empData 출력

  const response = await store.empUpdate(toRaw(empData.value));
  console.log("Update response:", response.data); // API 응답 데이터 출력

  if (response && response.data && response.data.value) {
    empData.value = response.data.value.data;
    console.log("Updated empData:", empData.value); // 수정된 empData 출력
    alert('수정되었습니다');
    await router.push({path: '/emp/empList'});
  } else {
    console.error("Error: 사원 정보를 수정하는데 실패했습니다.");
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
    empData.value.empRnkCd = foundRnk.value; // 일치하는 value 값을 empData에 할당
  }
}

/*
// 필요하면 이 부분도 추가
function updateStNm() {
  const foundSt = stCd.value.find(item => item.value === empData.value.empStCd);
  if (foundSt) {
    empData.value.empStCd = foundSt.value;
  }
}
*/

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