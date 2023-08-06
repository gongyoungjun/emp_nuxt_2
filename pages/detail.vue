<script setup>
const route = useRoute()

console.log("@@@@@@@@@@", route.query.mbrNo)

</script>

<template>
  <h1>detail</h1>
</template>

<style scoped lang="scss">

</style>

<!--
<script>
export default {
  data() {
    return {
      searchKeyword: '',     // 검색어
      employees: [],         // 직원 목록 데이터
      errorMessage: '',      // 오류 메시지
      currentPage: 1,        // 현재 페이지 번호
      pageSize: 4,           // 한 페이지에 표시되는 데이터 개수
      totalCnt: 0,           // 총 데이터 개수
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCnt / this.pageSize); // 전체 페이지 수 계산
    },
    paginatedEmployees() {
      const startIndex = (this.currentPage - 1) * this.pageSize; // 현재 페이지의 시작 인덱스
      const endIndex = startIndex + this.pageSize;              // 현재 페이지의 끝 인덱스
      return this.employees.slice(startIndex, endIndex);        // 현재 페이지의 데이터만 반환
    },
  },
  mounted() {
    this.getEmployeeList(); // 페이지 로드 시 직원 목록 요청
  },
  methods: {
    getEmployeeList() {
      axios
          .post('/api/empList/search', {
            page: this.currentPage,
            listSize: this.pageSize,
            keyword: this.searchKeyword, // 검색어도 함께 전송
          })
          .then(response => {
            this.employees = response.data.list; // 서버에서 받은 직원 목록 데이터 설정
            this.totalCnt = response.data.listCnt; // 총 데이터 개수 설정
            this.errorMessage = ''; // 에러 메시지 초기화
          })
          .catch(error => {
            this.errorMessage = '직원목록 오류.'; // 에러 발생 시 에러 메시지 설정
            console.error(error);
          });
    },

    searchEmployee() {
      this.currentPage = 1; // 검색 시 현재 페이지를 1로 초기화하여 첫 페이지부터 결과를 보여줌
      this.getEmployeeList(); // 검색어에 따른 직원 목록 요청
    },

    /* 이전 페이지로 이동하는 메서드 */
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage&#45;&#45;;
        this.getEmployeeList(); // 이전 페이지로 이동할 때 데이터를 다시 요청
      }
    },

    /* 다음 페이지로 이동하는 메서드 */
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.getEmployeeList(); // 다음 페이지로 이동할 때 데이터를 다시 요청
      }
    },
  },
};
</script>-->
