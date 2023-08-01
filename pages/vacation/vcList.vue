<template>
  <v-card>
    <v-container
        class="container-style"
        style="font-size: 14px;"
    >
      <v-form
          @submit.prevent="getVctnFromApi"
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
                  @keyup.enter="getVctnFromApi"
              ></v-text-field>
            </v-col>
            <p class="text-center" style="margin-right: 80px; margin-top: 30px">
              이름
            </p>
            <v-col cols="3" md="3" style="margin-left: -39px; margin-top: -6px">
              <v-text-field
                  v-model="model.nmKeyword"
                  variant="underlined"
                  class="text-box"
                  clearable
                  @keyup.enter="getVctnFromApi"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
              justify="end"
              style="margin-top: -30px; margin-left: 19px"
          >
            <p class="text-center" style="margin-left: 88px;">
              신청 상태
            </p>
            <v-col>
              <v-select
                  v-model="model.stKeyword"
                  :items="state"
                  item-title="name"
                  item-value="value"
                  variant="underlined"
                  class="select-box"
                  hide-selected
                  style="margin-left: 3px; margin-top: -8px;"
              ></v-select>
            </v-col>
            <v-row style="margin-top: 1px; margin-left: 50px">
              <p class="text-center" style="margin-right: 10px">
                신청일
              </p>
              <Datepicker v-model="model.aplDt"
                          :enable-time-picker="false"
                          class="date-box"
                          autoApply
                          format="yyyy-MM-dd"
                          week-start="0">
                <template #calendar-header="{ index, day }">
                  <div :class="index === 0 ? 'red-color' : index === 6 ? 'blue-color' : '' ">
                    {{ day }}
                  </div>
                </template>
              </Datepicker>
              <p class="text-center" style="margin-right: 10px; margin-left: -6px">
                시작일
              </p>
              <Datepicker v-model="model.strDt"
                          :enable-time-picker="false"
                          class="date-box"
                          autoApply
                          format="yyyy-MM-dd"
                          week-start="0">
                <template #calendar-header="{ index, day }">
                  <div :class="index === 0 ? 'red-color' : index === 6 ? 'blue-color' : '' ">
                    {{ day }}
                  </div>
                </template>
              </Datepicker>
            </v-row>
          </v-row>
          <v-row
              justify="end"
              style="margin-top: -86px; margin-left: 10px"
          >
            <v-col
                md="6"
            >
              <v-btn
                  variant="text"
                  class="me-4"
                  @click="getVctnFromApi"
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
        <v-data-table-server
            :headers="model.headers"
            :items="list"
            :items-length="model.totalList"
            :items-per-page="model.viewCount"
            :loading="model.loading"
            class="my-table-style"
            @click:row="showVctn"
            @update:options="options = $event"
        >
          <template #no-data>
            <tr>
              <td colspan="8" align="center">
                결과가 없습니다 :(
              </td>
            </tr>
          </template>
          <template #loading>
            <tr>
              <td colspan="8" align="center">
                로딩중...
              </td>
            </tr>
          </template>
          <template #item="{ item, index }">
            <tr @click="showVctn(item.columns.vctnNo)" v-if="!model.loading">
              <td></td>
              <td> {{ model.totalList - index - ((model.indexPage - 1) * model.indexPerPage) }}</td>
              <td> {{ item.columns.empNm }}</td>
              <td> {{ item.columns.vctnDayCnt }}</td>
              <td> {{ item.columns.vctnRsn }}</td>
              <td> {{ item.columns.vctnRsdCnt }}</td>
              <td> {{ item.columns.vctnStNm }}</td>
              <td>
                <v-chip :color="getColor(item.columns.vctnStNm)">
                  {{ item.columns.vctnStNm }}
                </v-chip>
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
    </v-container>
  </v-card>
</template>

<script setup>
definePageMeta({
  layout: "admin"
})

import {VDataTableServer} from 'vuetify/labs/VDataTable'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ref, watch} from "vue";
import {useRouter} from "nuxt/app";

const router = useRouter()
const store = useVctnStore()

const state = ref([
  {name: '전체', value: ''},
  {name: '신청', value: '01'},
  {name: '승인', value: '02'},
  {name: '반려', value: '03'},
])

let options = ref()
let list = ref([])

let model = ref({
  viewCount: 10,
  totalList: 0,
  loading: true,
  headers: [{
    sortable: false,
  },
    {title: 'No', key: 'vctnNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '휴가 시작일', key: 'vctnDayCnt'},
    {title: '휴가 마지막일', key: 'vctnRsn'},
    {title: '휴가 신청일', key: 'vctnRsdCnt'},
    {title: '신청 상태', key: 'vctnStNm'},
  ],
  noKeyword: '',
  nmKeyword: '',
  stKeyword: '',
  aplDt: '',
  strDt: '',
  start: 0,
  cntPerPage: 0,
  indexPage: 0,
  indexPerPage: 0,
})

watch(
    () => options,
    () => {
      getVctnFromApi();
    },
    {deep: true}
)

function getVctnFromApi() {
  model.value.loading = true
  pagingSet().then(async pageData => {
    let cntPerPage
    if (pageData.itemsPerPage === -1) {
      cntPerPage = model.value.totalList
    } else {
      cntPerPage = pageData.itemsPerPage
    }

    //신청 날자 검색 시 aplDt를 yyyy-mm-dd로 구성
    if (model.value.aplDt != '' && model.value.aplDt != null) {
      let date = model.value.aplDt
      const result = formattedDate(date)

      model.value.aplDt = result
    }

    //시작 날자 검색 시 strDt를 yyyy-mm-dd로 구성
    if (model.value.strDt != '' && model.value.strDt != null) {
      let date = model.value.strDt
      const result = formattedDate(date)

      model.value.strDt = result
    }

    //캘린더에서 넘긴 시작일 받아오기
    const dateParam = router.currentRoute._rawValue.query.strDt

    let startDate
    let stParam
    if (dateParam != null) {
      model.value.strDt = dateParam
      startDate = dateParam
      stParam = '02'
    } else {
      startDate = model.value.strDt
      stParam = model.value.stKeyword
    }

    let searchParam = {
      noKeyword: model.value.noKeyword,
      nmKeyword: model.value.nmKeyword,
      stKeyword: stParam,
      aplDt: model.value.aplDt,
      strDt: startDate,
      page: pageData.page,
      cntPerPage: cntPerPage,
    }
    //getAction
    const {data} = await store.vctnList(searchParam)
    router.currentRoute._rawValue.query.strDt = null

    if (data.value.data.vacationList === null) {
      list = []
    } else {
      list = data.value.data.vacationList
    }
    model.value.totalList = data.value.data.total
    model.value.viewCount = cntPerPage
    model.value.loading = false

  })
}

function pagingSet() {
  return new Promise((resolve, reject) => {
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

function getColor(vctnStNm) {
  if (vctnStNm === '반려') return 'red'
  else if (vctnStNm === '신청') return 'orange'
  else return 'green'
}

function showVctn(id) {
  router.push({
    path: "/vcDetail",
    query: {vctnNo: id}
  })
}

function formattedDate(date) {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = (dateObj.getDate()).toString().padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`

  return formattedDate
}

</script>

<style scoped>
.container-style {
  margin-top: 15px
}

.my-table-style {
  border: 1px solid #ccc;
  border-radius: 30px;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
}

.me-4 {
  margin-top: 9px;
  margin-left: 363px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px;
}

.search-box {
  width: 100%;
  height: 145px;
  border-radius: 30px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
}

.select-box {
  margin-left: 18px;
  width: 100px;
}

.date-box {
  width: 25%;
  margin-right:30px;
  margin-top:20px;
}

.text-center {
  margin-top: 28px;
}

.text-box {
  margin-left: -40px;
  margin-right: 100px;
}

.red-color {
  color: red;
}

.blue-color {
  color: blue;
}
</style>