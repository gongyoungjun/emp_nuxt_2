<template>
  <NuxtLayout>
    <v-card class="pa-14">
      <v-container class="main-container" style="font-size: 14px;width: 100%">
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
                <td>{{ item.columns.empNo }}</td>
                <td>{{ item.columns.empNm }}</td>
                <td>{{ item.columns.time }}</td>
                <td>{{ item.columns.address }}</td>
                <td>{{ item.columns.workCd === '01' ? '출근' : '퇴근' }}</td>
              </tr>
            </template>
          </v-data-table-server>
        </div>
      </v-container>
    </v-card>
  </NuxtLayout>
</template>

<script setup>
import {useEmpStore} from "~/store/emp";
import {VDataTableServer} from 'vuetify/labs/VDataTable';
import {ref, watch, computed} from "vue";
import {useRouter} from "nuxt/app";

const router = useRouter();
const empStore = useEmpStore();
const empNo = empStore.getEmpNo();

let options = ref();
let list = ref([]);

let model = ref({
  totalList: 0,
  loading: true,
  headers: [
    {title: '사원번호', key: 'empNo'},
    {title: '사원이름', key: 'empNm'},
    {title: '시간', key: 'time'},
    {title: '주소', key: 'address'},
    {title: '상태', key: 'workCd'}
  ],
  empNo: '',
  empNm: '',
  start: 0,
  listSize: 10,
  indexPage: 0,
  indexPerPage: 0
});

watch(
    () => options,
    () => {
      getCmList();
    },
    {deep: true}
);

async function getCmList() {
  model.value.loading = true;
  const pageData = await pagingSet();
  let listSize = pageData.itemsPerPage === -1 ? model.value.totalList : pageData.itemsPerPage;

  const searchParam = {
    empNo: empNo,
    empNm: model.value.empNm,
    page: pageData.page,
    listSize: listSize
  };

  const {data} = await empStore.empCommuteList(searchParam);

  if (data.value.empCommuteDTO === null) {
    list.value = [];
  } else {
    list.value = data.value.empCommuteDTO;
  }

  model.value.totalList = data.value.total;
  model.value.loading = false;
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
