<template>
  <v-card>
    <v-container class="main-container" style="font-size: 14px;">
      <v-row class="header">
        <v-form class="custom-form" @submit.prevent="getCmList">
          <v-card-text class="search-box" style="height: 200px;">
            <v-row justify="start" style="margin-left: 110px">
              <p class="text-center" style="margin-right: 40px; margin-top: 30px">
                사원 번호
              </p>
              <v-col cols="3" md="3" style="margin-top: -6px">
                <v-text-field v-model="model.empNo" variant="underlined" class="text-box" clearable
                              @keyup.enter="getCmList"></v-text-field>
              </v-col>
              <p class="text-center" style="margin-right: 80px; margin-top: 30px">
                이름
              </p>
              <v-col cols="3" md="3" style="margin-left: -39px; margin-top: -6px">
                <v-text-field v-model="model.empNm" variant="underlined" class="text-box" clearable
                              @keyup.enter="getCmList"></v-text-field>
              </v-col>
              <v-btn variant="text" class="me-4" @click="getCmList" append-icon="mdi-magnify">
                검색
              </v-btn>
          </v-row>
        </v-card-text>
      </v-form>
      </v-row>
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
            <tr v-if="!model.loading">
              <td> {{ item.columns.empNo }}</td>
              <td> {{ item.columns.empNm }}</td>
              <td> {{ item.columns.time }}</td>
              <td> {{ item.columns.address }}</td>
              <td> {{ item.columns.workCd === '01' ? '출근' : '퇴근' }}</td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
    </v-container>
  </v-card>
</template>


<script setup>
import {useEmpStore} from "~/store/emp";
import {VDataTableServer} from 'vuetify/labs/VDataTable'
import {ref, watch} from "vue";
import {useRouter} from "nuxt/app";

const router = useRouter()
const empStore = useEmpStore();


let options = ref()
let list = ref([])

let model = ref({
  totalList: 0,
  loading: true,
  headers: [
    {title: '사원번호', key: 'empNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '시간', key: 'time'},
    {title: '주소', key: 'address'},
    /*  {title: '위치(위도,경도)', key: 'geoLoc'},*/
    {title: '상태', key: 'workCd'}
  ],
  empNo: '',
  empNm: '',
  start: 0,
  listSize: 10,
  indexPage: 0,
  indexPerPage: 0,
})

watch(
    () => options,
    () => {
      getCmList();

    },
    {deep: true}
)

/**
 * API 호출
 * 출퇴근 목록 가져옴
 */
function getCmList() {
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
      empNo: model.value.empNo,
      empNm: model.value.empNm,
      page: pageData.page,
      listSize: listSize,
    }

    const {data} = await empStore.empCommuteList(searchParam)
    console.log("API 응답:", data);
    if (data.value.empCommuteDTO === null) {
      list.value = []
    } else {
      list.value = data.value.empCommuteDTO
    }


    model.value.totalList = data.value.total
    model.value.loading = false

    console.log("페이징 데이터:", model.value);

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

.me-4 {
  margin-top: 9px;
  margin-left: 363px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px;
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
