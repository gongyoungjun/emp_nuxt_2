<template>
  <v-card>
    <v-container class="container-style" style="font-size: 14px;">
      <v-form @submit.prevent="getCmList">
        <v-card-text class="search-box" style="height: 200px;">
          <v-row justify="start" style="margin-left: 110px">
            <!-- 휴가 번호 -->
            <p class="text-center" style="margin-right: 40px; margin-top: 30px">휴가 번호</p>
            <v-col cols="3" md="3" style="margin-top: -6px">
              <v-text-field v-model="commute.atndnNo" variant="underlined" class="text-box" clearable @keyup.enter="getCmList"></v-text-field>
            </v-col>
            <!-- 이름 -->
            <p class="text-center" style="margin-right: 80px; margin-top: 30px">이름</p>
            <v-col cols="3" md="3" style="margin-left: -39px; margin-top: -6px">
              <v-text-field v-model="commute.empNm" variant="underlined" class="text-box" clearable @keyup.enter="getCmList"></v-text-field>
            </v-col>
            <v-btn variant="text" class="me-4" @click="getCmList" append-icon="mdi-magnify">검색</v-btn>
          </v-row>
        </v-card-text>
      </v-form>

      <v-data-table-server
          :headers="commute.headers"
          :items="list"
          :items-length="commute.totalList"
          :items-per-page="commute.listSize"
          :loading="commute.loading"
          class="my-table-style"
          @update:options="options = $event"
      >
        <template v-slot:item="props">
          <tr>
            <td></td>
            <td>{{ props.item.atndnNo }}</td>
            <td>{{ props.item.empNo }}</td>
            <td>{{ props.item.empNm }}</td>
            <td>{{ props.item.address }}</td>
            <td>{{ props.item.time }}</td>
          </tr>
        </template>
      </v-data-table-server>
    </v-container>
  </v-card>
</template>


<script setup>
import {useEmpStore} from "~/store/emp";
import {VDataTableServer} from 'vuetify/labs/VDataTable'
import {ref, watch} from "vue";
import {useRouter} from "nuxt/app";

const router = useRouter();
const empStore = useEmpStore();


let options = ref()
let list = ref([])

let commute = ref({
  totalList: 0,
  loading: true,
  headers: [{
    sortable: false,
  },
    {title: 'No', key: 'atndnNo'},
    {title: '사원 번호', key: 'empNo'},
    {title: '사원 이름', key: 'empNm'},
    {title: '현재 위치', key: 'address'},
    {title: '출퇴근 시간', key: 'time'},
    {title: '출퇴근', key: 'workcd'},
  ],
  atndnNo: '',
  empNo: '',
  empNm: '',
  address: '',
  geoLoc: '',

  strDt: '',
  endDt: '',
  start: 0,
  listSize: 4,
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
  commute.value.loading = true
  pagingSet().then(async pageData => {
    let listSize
    if (pageData.itemsPerPage === -1) {
      listSize = commute.value.totalList
    } else {
      listSize = pageData.itemsPerPage
    }

    //검색
    let searchParam = {
      workcd: commute.value.workcd,
      empNm: commute.value.empNm,
      strDt: commute.value.strDt,
      endDt: commute.value.endDt,
      page: pageData.page,
      listSize: listSize,
    }

    const {data} = await empStore.empCommuteList(searchParam)
    console.log("ㅇㅇ", data.value.empCommuteDTO);
    if (data.value.empCommuteDTO === null) {
      list = []
    } else {
      list = data.value.empCommuteDTO
    }


    commute.value.totalList = data.value.total
    commute.value.viewCount = listSize
    commute.value.loading = false

  })
}

/**
 * 페이징 옵션 설정
 */
function pagingSet() {
  return new Promise((resolve) => {
    const {page, itemsPerPage} = options.value

    const start = (page - 1) * itemsPerPage
    commute.value.indexPage = page
    commute.value.indexPerPage = itemsPerPage

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
