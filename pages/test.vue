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
                  v-model="model.noKeyword"
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
                  v-model="model.nmKeyword"
                  variant="underlined"
                  class="text-box"
                  clearable
                  @keyup.enter="getEmpFromApi"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
              justify="end"
              style="margin-top: -30px"
          >
            <p class="text-center" style="margin-left: 151px;">
              직급
            </p>
            <v-col>
              <v-select
                  v-model="model.rnkKeyword"
                  :items="types"
                  item-title="name"
                  item-value="value"
                  variant="underlined"
                  class="select-box"
                  hide-selected
                  style="margin-left: 4px; margin-top: -8px;"
              ></v-select>
            </v-col>
            <p class="text-center" style="margin-left: 12px">
              입사일
            </p>
            <v-col
                md="2"
                style="margin-top: 8px; margin-right: 1px;"
            >
              <Datepicker
                  v-model="model.startDt"
                  :enable-time-picker="false"
                  autoApply
                  format="yyyy-MM-dd"
                  week-start="0"
              >
                <template #calendar-header="{ index, day }">
                  <div :class="index === 0 ? 'red-color' : index === 6 ? 'blue-color' : '' ">
                    {{ day }}
                  </div>
                </template>
              </Datepicker>
            </v-col>
            <p class="text-center">
              -
            </p>
            <v-col
                md="2"
                style="margin-top: 8px; margin-right: 22px;"
            >
              <Datepicker v-model="model.endDt"
                          :enable-time-picker="false"
                          autoApply
                          format="yyyy-MM-dd"
                          week-start="0">
                <template #calendar-header="{ index, day }">
                  <div :class="index === 0 ? 'red-color' : index === 6 ? 'blue-color' : '' ">
                    {{ day }}
                  </div>
                </template>
              </Datepicker>
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
          </v-row>
        </v-card-text>
      </v-form>
      <v-spacer></v-spacer>
      <div>
        <tr @click="showEmp(item.columns.empNo)" v-if="!model.loading">
          <td></td>
          <td> {{ model.totalList - index - ((model.indexPage - 1) * model.indexPerPage) }}</td>
          <td> {{ item.columns.empNo }}</td>
          <td> {{ item.columns.empNm }}</td>
          <td> {{ item.columns.rnkNm }}</td>`
          <td> {{ item.columns.empEml }}</td>
          <td> {{ item.columns.empBrtDt }}</td>
          <td> {{ item.columns.empHrDt }}</td>
          <td>
            <v-chip :color="getColor(item.columns.stNm)">
              {{ item.columns.stNm }}
            </v-chip>
          </td>
        </tr>

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
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ref, watch} from "vue";

const router = useRouter()
const store = useEmpStore()



const types = ref([
  {name: '전체', value: ''},
  {name: '사원', value: '01'},
  {name: '대리', value: '02'},
  {name: '과장', value: '03'},
  {name: '차장', value: '04'},
  {name: '부장', value: '05'},
  {name: '이사', value: '06'},
  {name: '대표', value: '07'},
])

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
    {title: 'No', key: 'index'},
    {title: '사원번호', key: 'empNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '직급', key: 'rnkNm'},
    {title: '이메일', key: 'empEml'},
    {title: '생년월일', key: 'empBrtDt'},
    {title: '입사일', key: 'empHrDt'},
    {title: '재직상태', key: 'stNm'},
  ],
  noKeyword: '',
  nmKeyword: '',
  rnkKeyword: '',
  start: 0,
  cntPerPage: 4,
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
      noKeyword: model.value.noKeyword,
      nmKeyword: model.value.nmKeyword,
      rnkKeyword: model.value.rnkKeyword,
      startDt: model.value.startDt,
      endDt: model.value.endDt,
      page: pageData.page,
      cntPerPage: cntPerPage
    }
    //getAction
    const {data} = await store.empList(searchParam)
    console.log("@@@@@@@@@@", data.value)

    if (data.value.list === null) {
      list = []
    } else {
      list = data.value.list
    }
    model.value.totalList = data.value.listCnt
    model.value.loading = false
  })
}

function getColor(stNm) {
  if (stNm === '퇴사') return 'red'
  else return 'green'
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

function showEmp(empNo){
  console.log("@@@@@@@@ ", empNo)
  router.push({
    path: "/emp/empDetail",
    query: {empNo: empNo}
  })
}


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


</style>