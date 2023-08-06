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
                  v-model="model.vctnNo"
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
                  v-model="model.empNm"
                  variant="underlined"
                  class="text-box"
                  clearable
                  @keyup.enter="getVctnFromApi"
              ></v-text-field>
            </v-col>
          </v-row>
              <v-btn
                  variant="text"
                  class="me-4"
                  @click="getVctnFromApi"
                  append-icon="mdi-magnify"
              >
                검색
              </v-btn>
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
            @update:options="options = $event"
        >

          <template #item="{ item, index }">
            <tr @click="showVctn(item.columns.vctnNo)" v-if="!model.loading">
              <td></td>
              <td> {{ item.columns.vctnNo }}</td>
              <td> {{ item.columns.empNm }}</td>
              <td> {{ item.columns.vctnKndNm }}</td>
              <td> {{ item.columns.vctnStrDt }}</td>
              <td> {{ item.columns.vctnEndDt }}</td>
              <td> {{ item.columns.vctnAplDtm }}</td>
              <td> {{ item.columns.vctnStCd }}</td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
    </v-container>
  </v-card>
</template>

<script setup>

import {useVctnStore} from "~/store/vctn";
import {VDataTableServer} from 'vuetify/labs/VDataTable'
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
  viewCount: 4,
  totalList: 0,
  loading: true,
  headers: [{
    sortable: false,
  },
    {title: 'No', key: 'vctnNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '휴가 종류', key: 'vctnKndNm'},
    {title: '휴가 시작일', key: 'vctnStrDt'},
    {title: '휴가 마지막일', key: 'vctnEndDt'},
    {title: '휴가 신청일', key: 'vctnAplDtm'},
    {title: '신청 상태', key: 'vctnStCd'},

  ],
  vctnNo:'',
  empNm: '',
  aplDt:'',
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
//검색
    let searchParam = {
      empNo: model.value.vctnNo,
      empNm: model.value.empNm,
      aplDt: model.value.aplDt,
      page: pageData.page,
      cntPerPage: cntPerPage,
    }
    //getAction
    const {data} = await store.vctnList(searchParam)

    if (data.value.vacationList === null) {
      list = []
    } else {
      list = data.value.vacationList
    }
    model.value.totalList = data.value.total
    model.value.viewCount = cntPerPage
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


function showVctn(vctnNo) {
  router.push({
    path: "/vc/vcDetail",
    query: {vctnNo: vctnNo}
  })
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
  margin-right: 30px;
  margin-top: 20px;
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