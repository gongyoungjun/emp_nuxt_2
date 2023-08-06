<template>
  <v-form @submit.prevent="submitForm">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="vctn.empNo" label="사번" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="vctn.empNm" label="이름" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-select v-model="vctn.vctnKndNm" :items="vacationTypes" label="휴가 종류" required></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="vctn.vctnRsn" label="휴가 사유" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-date-picker v-model="vctn.vctnStrDt" label="휴가 시작일" required></v-date-picker>
        </v-col>
        <v-col cols="12" md="6">
          <v-date-picker v-model="vctn.vctnEndDt" label="휴가 마지막일" required></v-date-picker>
        </v-col>
      </v-row>
      <v-btn type="submit" color="primary">휴가 신청</v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';

const vctn = ref({
  empNo: '',
  empNm: '',
  vctnKndNm: '',
  vctnRsn: '',
  vctnStrDt: '',
  vctnEndDt: '',
});

const vacationTypes = [
  '연차',
  '병가',
  '경조사',
];

function submitForm() {
  console.log(vctn.value);

}
</script>

<style>
</style>
