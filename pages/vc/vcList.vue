<template>
  <v-card class="pa-14">
    <v-container class="main-container" style="font-size: 14px; width: 100%">
      <v-form @submit.prevent="getVctnFromApi">
        <v-card-text class="search-box">


          <v-row justify="start" style="margin-left: 110px">
            <!-- 휴가 번호 -->
            <p class="text-center" style="margin-right: 40px; margin-top: 30px">
              휴가 번호
            </p>
            <v-col cols="3" md="3" style="margin-top: -6px">
              <v-text-field v-model="model.vctnNo" variant="underlined" class="text-box" clearable
                            @keyup.enter="getVctnFromApi"></v-text-field>
            </v-col>
            <!-- 이름 -->
            <p class="text-center" style="margin-right: 40px; margin-top: 30px">
              이름
            </p>
            <v-col cols="3" md="3" style=" margin-top: -6px">
              <v-text-field v-model="model.empNm" variant="underlined" class="text-box" clearable
                            @keyup.enter="getVctnFromApi"></v-text-field>
            </v-col>
            <v-btn variant="text" class="me-4" @click="getVctnFromApi" append-icon="mdi-magnify">
              검색
            </v-btn>
          </v-row>

            <v-row justify="start" style="margin-left: 110px">
              <p class="text-center" style="margin-right: 10px; margin-top: 30px">
                시작일
              </p>
              <v-col cols="3" md="3" style="margin-right: 30px; margin-top: 18px">
                <input type="date" v-model="model.strDt" @keyup.enter="getVctnFromApi">
              </v-col>

              <p class="text-center" style="margin-right: -5px; margin-top: 30px">
                종료일
              </p>
              <v-col cols="3" md="3" style="margin-top: 18px; margin-right: 32px">
                <input type="date" v-model="model.endDt" @keyup.enter="getVctnFromApi">
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
            :items-per-page="model.listSize"
            :loading="model.loading"
            class="my-table-style"
            @update:options="options = $event"
        >
          <template #item="{ item, index }">
            <tr @click="showVctn(item.columns.vctnNo)" v-if="!model.loading">
              <td></td>
              <td> {{ item.columns.vctnNo }}</td>
              <td> {{ item.columns.empNm }}</td>
              <td> {{ item.columns.empVctnTtl }}</td>
              <td> {{ item.columns.vctnRsdCnt }}</td>
              <td> {{ item.columns.vctnKndNm }}</td>
              <td> {{ item.columns.vctnStrDt }}</td>
              <td> {{ item.columns.vctnEndDt }}</td>
              <td> {{ item.columns.vctnDayCnt }} 일</td>
              <td> {{ item.columns.vctnAplDtm }}</td>
              <td> {{ item.columns.vctnStNm }}</td>
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
import {ref, watch, onMounted} from "vue";
import {useRouter} from "nuxt/app";


const router = useRouter()
const store = useVctnStore()

let options = ref()
let list = ref([])

let model = ref({
  totalList: 0,
  loading: true,
  headers: [{
    sortable: false,
  },
    {title: 'No', key: 'vctnNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '총 휴가 일수', key: 'empVctnTtl'},
    {title: '잔여 휴가', key: 'vctnRsdCnt'},
    {title: '휴가 종류', key: 'vctnKndNm'},
    {title: '휴가 시작일', key: 'vctnStrDt'},
    {title: '휴가 마지막일', key: 'vctnEndDt'},
    {title: '신청 휴가 일수', key: 'vctnDayCnt'},
    {title: '휴가 신청일', key: 'vctnAplDtm'},
    {title: '신청 상태', key: 'vctnStNm'},
  ],
  vctnNo: '',
  empNm: '',
  vctnStrDt: '',
  vctnEndDt: '',

  strDt: '',
  endDt: '',
  start: 0,
  listSize: 10,
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

/**
 * API 호출
 * 휴가 목록 가져옴
 */
function getVctnFromApi() {
  model.value.loading = true
  pagingSet().then(async pageData => {
    let listSize
    if (pageData.itemsPerPage === -1) {
      listSize = model.value.totalList
    } else {
      listSize = pageData.itemsPerPage
    }

    //검색
    let searchParam = {
      vctnNo: model.value.vctnNo,
      empNm: model.value.empNm,
      strDt: model.value.strDt,
      endDt: model.value.endDt,
      page: pageData.page,
      listSize: listSize,
    }

    //getAction
    const {data} = await store.vctnList(searchParam)
    if (data.value.vacationList === null) {
      list = []
    } else {
      list = data.value.vacationList
    }

    model.value.totalList = data.value.total
    model.value.loading = false

  })
}

/**
 * 페이징 옵션 설정
 */
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

/**
 * 휴가번호로 상세페이지
 * @param vctnNo
 */
function showVctn(vctnNo) {
  router.push({
    path: "/vc/vcDetail",
    query: {vctnNo: vctnNo}
  })
}

</script>


<style scoped>

.text-center {
  margin-top: 28px;
}

.my-table-style {
  border: 1px solid #ccc;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  margin: 20px 0; /* 상하 간격 추가 */
}

.me-4 {
  margin-top: 25px;
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
  padding: 20px 0; /* 위 아래 간격 추가 */
}

.red-color {
  color: red;
}

.blue-color {
  color: blue;
}
</style>

