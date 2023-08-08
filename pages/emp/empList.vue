<template>
  <v-card>
    <v-container
        class="container-style"
        style="font-size: 14px; width: 100%"
    >
      <v-form
          @submit.prevent="getEmpFromApi"
      >
        <v-card-text
            class="search-box"
        >
          <v-row justify="start" style="margin-left: 110px">
            <p class="text-center" style="margin-right: 40px; margin-top: 30px">
              사원 번호
            </p>
            <v-col cols="3" md="3" style="margin-top: -6px">
              <v-text-field
                  v-model="model.empNo"
                  variant="underlined"
                  class="text-box"
                  clearable
                  @keyup.enter="getEmpFromApi"
              ></v-text-field>
            </v-col>
            <p class="text-center" style="margin-right: 40px; margin-top: 30px">
              이름
            </p>
            <v-col cols="3" md="3" style="margin-top: -6px">
              <v-text-field
                  v-model="model.empNm"
                  variant="underlined"
                  class="text-box"
                  clearable
                  @keyup.enter="getEmpFromApi"
              ></v-text-field>
            </v-col>
          </v-row>


            <p class="text-center">
              -
            </p>
            <v-col
                md="2"
                style="margin-top: 8px; margin-right: 22px;"
            >
            </v-col>

            <v-col
                md="2"
                style="margin-left: 10px; margin-top: -86px"
            >
              <v-btn
                  variant="text"
                  class="me-4"
                  @click="getEmpFromApi"
                  append-icon="mdi-magnify"
              >
                검색
              </v-btn>
            </v-col>
        </v-card-text>
      </v-form>
      <v-spacer></v-spacer>
      <div>
        <v-data-table-server
            :headers="model.headers"
            :items="list"
            :items-length="model.totalList"
            :items-per-page="model.listSize"
            :loading="model.loading"
            class="my-table-style"
            @update:options="options = $event"
        >
          <template #item="{ item }">
            <tr @click="showEmp(item.columns.empNo)" v-if="!model.loading">
              <td></td>
              <td> {{ item.columns.empNo }}</td>
              <td> {{ item.columns.empNm }}</td>
              <td> {{ item.columns.rnkNm }}</td>
              <td> {{ item.columns.empEml }}</td>
              <td> {{ item.columns.empBrtDt }}</td>
              <td> {{ item.columns.empHrDt }}</td>
            </tr>
          </template>

        </v-data-table-server>
      </div>
    </v-container>
  </v-card>

</template>

<script setup>
import {useEmpStore} from "~/store/emp";

definePageMeta({
  layout: "admin"
})

import {VDataTableServer} from 'vuetify/labs/VDataTable';
import '@vuepic/vue-datepicker/dist/main.css';
import {ref, watch} from "vue";
import { useRouter } from 'nuxt/app';

const router = useRouter()
const store = useEmpStore()

let options = ref()
let list = ref([])

let model = ref({
  totalList: 0,
  loading: true,
  startDt: '',
  endDt: '',
  headers: [{
    sortable: false,
  },
    {title: '사원번호', key: 'empNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '직급', key: 'rnkNm'},
    {title: '이메일', key: 'empEml'},
    {title: '생년월일', key: 'empBrtDt'},
    {title: '입사일', key: 'empHrDt'},
    {title: '재직상태', key: 'stNm'},
  ],
  empNo: '',
  empNm: '',
  rnkKeyword: '',
  start: 0,
  listSize: 4,
  indexPage: 0,
  indexPerPage: 0,
})

watch(
    () => options,
    () => {
      getEmpFromApi()
    },
    {deep: true}
)

function getEmpFromApi() {
  model.value.loading = true
  pagingSet().then(async pageData => {
    let cntPerPage
    if (pageData.itemsPerPage === -1) {
      cntPerPage = model.value.totalList
    } else {
      cntPerPage = pageData.itemsPerPage
    }
    let searchParam = {
      empNo: model.value.empNo,
      empNm: model.value.empNm,
      page: pageData.page,
      cntPerPage: cntPerPage
    }
    //getAction
    const {data} = await store.empList(searchParam)

    if (data.value.list === null) {
      list = []
    } else {
      list = data.value.list
    }
    model.value.totalList = data.value.listCnt
    model.value.loading = false
  })
}



function pagingSet() {
  return new Promise((resolve) => {
    const {page, itemsPerPage} = options.value

    const start = (page - 1) * itemsPerPage
    model.value.indexPage = page
    model.value.indexPerPage = itemsPerPage

    resolve({
      start,
      itemsPerPage,
      page
    })
  })
}
/*
function showEmp(empNo) {
  router.push({ name: '/emp/empDetail', params: { empNo } });
}
*/

function showEmp(empNo) {
  router.push({
    path: "/emp/empDetail",
    query: {empNo: empNo}
  })
}


/*let empDetailData = ref({});
function showEmp(empNo) {
  console.log("@@@@@@@@ ", empNo)
  store.empInfoUser(empNo) // 여기에서 호출
      .then(data => {
        empDetailData.value = data; // empDetailData에 할당
      })
      .catch(error => {
        console.error(error)
      });

  router.push({
    path: "/emp/empDetail",
    query: {empNo: empNo}
  })
}*/
</script>

<style scoped>
.container-style {
  margin-top: 15px
}

.text-center {
  margin-top: 28px;
}

.my-table-style {
  border: 1px solid #ccc;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
}

.me-4 {
  margin-top: 9px;
  margin-left: 25px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px;
}

.select-box {
  margin-left: 18px;
  width: 100px;
}

.text-box {
  margin-left: -40px;
  margin-right: 100px;
}

.search-box {
  width: 100%;
  height: 145px;
  border-radius: 30px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
}

.red-color {
  color: red;
}

.blue-color {
  color: blue;
}

</style>