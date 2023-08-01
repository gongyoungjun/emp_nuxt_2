<template>
  <v-form ref="form">
    <v-responsive
        class="mx-auto"
        max-width="640"
        style="margin-top: 15px;"
    >
      <v-row>
        <v-col>
          <v-card-text>
            <v-text-field
                v-model="emp.empNo"
                label="사원번호"
                variant="plain"
                readonly
                style="margin-bottom: -33px"
            ></v-text-field>

            <v-text-field
                v-model="emp.empNm"
                :rules="nameRules"
                variant="outlined"
                label="이름"
                required
                clearable
                validate-on="blur"
            ></v-text-field>

            <v-text-field
                v-model="emp.empPhn"
                :rules="phnRules"
                variant="outlined"
                label="전화번호"
                required
                clearable
                validate-on="blur"
                hint="ex)010-1234-1234"
            ></v-text-field>

            <v-text-field
                v-model="emp.empEml"
                :rules="emlRules"
                variant="outlined"
                label="이메일"
                required
                clearable
                validate-on="blur"
                hint="ex)abc123@naver.com"
            ></v-text-field>

            <v-text-field
                v-model="emp.empSlr"
                variant="outlined"
                label="연봉"
                clearable
            ></v-text-field>

            <v-row>
              <v-col>
                <v-text-field
                    v-model="emp.empVctnTtl"
                    variant="outlined"
                    label="총 휴가 개수"
                    clearable
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                    v-model="emp.vctnRsdCnt"
                    variant="outlined"
                    label="잔여 휴가 개수"
                    clearable
                ></v-text-field>
              </v-col>
            </v-row>

            <v-select
                v-model="emp.empRnkCd"
                :items="rank"
                :rules="RnkRules"
                variant="outlined"
                item-title="name"
                item-value="value"
                label="직급"
                required
                hide-selected
                validate-on="blur"
                return-object
            ></v-select>

            <v-row>
              <v-col
                  cols="6"
                  sm="3"
                  md="3"
                  align-self="center"
                  style="margin-left: 15px"
              >
                생년월일
              </v-col>
              <v-col
                  md="4"
                  style="margin-left: -70px"
              >
                <Datepicker
                    v-model="emp.empBrtDt"
                    :enable-time-picker="false"
                    week-start="0"
                    autoApply
                >
                  <template #calendar-header="{ index, day }">
                    <div :class="index === 0 ? 'red-color' : index === 6 ? 'blue-color' : '' ">
                      {{ day }}
                    </div>
                  </template>
                </Datepicker>
              </v-col>

              <v-col
                  md="5"
                  align-self="center"
                  style="margin-left: 15px"
              >
                입사일
              </v-col>
              <v-col
                  md="4"
                  style="margin-left: -200px"
              >
                <Datepicker
                    v-model="emp.empHrDt"
                    :enable-time-picker="false"
                    week-start="0"
                    autoApply
                >
                  <template #calendar-header="{ index, day }">
                    <div :class="index === 0 ? 'red-color' : index === 6 ? 'blue-color' : '' ">
                      {{ day }}
                    </div>
                  </template>
                </Datepicker>
              </v-col>
            </v-row>

            <v-divider class="mt-12"></v-divider>

            <v-card-actions>
              <v-btn
                  variant="text"
                  @click="empList"
              >
                목록
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  color="deep-purple-lighten-1"
                  @click="validForm()"
              >
                수정
              </v-btn>
              <v-dialog
                  v-model="dialog"
                  width="auto"
                  persistent
              >
                <v-card>
                  <v-card-title>
                    알림
                  </v-card-title>
                  <v-card-text>회원 정보를 수정하시겠습니까?</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="deep-purple-lighten-1"
                        variant="text"
                        @click="[dialog = false, snackbar = true, timeoutSet()]"
                    >
                      네
                    </v-btn>
                    <v-btn
                        color="gray"
                        variant="text"
                        @click="dialog = false"
                    >
                      아니요
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-snackbar
                  color="deep-purple-lighten-2"
                  v-model="snackbar"
                  width="auto"
              >
                <template v-slot:actions>
                  <v-btn
                      variant="text"
                      @click="[snackbar = false, submit()]"
                  >
                    닫기
                  </v-btn>
                </template>
                수정이 완료되었습니다.
              </v-snackbar>
            </v-card-actions>
          </v-card-text>
        </v-col>
      </v-row>
    </v-responsive>
  </v-form>
</template>

<script>
definePageMeta({
  layout: "admin"
})

import {ref} from 'vue'
import {useEmpStore} from "../../store/emp";
import {VDataTableServer} from 'vuetify/labs/VDataTable'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from "axios";
import {required} from "@vuelidate/validators";
import {useRouter} from "nuxt/app";

const router = useRouter()
export default {
  components: {Datepicker, VDataTableServer, required},
  setup() {
    const store = useEmpStore()

    const rank = ref([
      {name: '사원', value: '01'},
      {name: '대리', value: '02'},
      {name: '과장', value: '03'},
      {name: '차장', value: '04'},
      {name: '부장', value: '05'},
      {name: '이사', value: '06'},
      {name: '대표', value: '07'},
    ])

    const show = ref(false)
    const show2 = ref(false)

    return {rank, show, show2, getEmp: store.empInfo, putEmp: store.empUpdate}
  },
  mounted() {
    this.getEmpInfo()
  },
  data: () => ({
    alert: false,
    dialog: false,
    snackbar: false,
    timeout: 2000,
    file: null,
    emp: [],
    valid: true,
    empNo: 0,
    empPht: '',
    empPhtUrl: null,
    empSlr: 0,
    empAcnNmb: '',
    empVctnTtl: 0,
    empNm: '',
    nameRules: [
      v => !!v || '이름을 입력하세요.',
      v => (v && 2 <= v.length && v.length <= 18) || '2~18자로 입력하세요.',
    ],
    empPhn: '',
    phnRules: [
      v => !!v || '전화번호를 입력하세요. ex)010-1234-1234',
      v => /-.+-/.test(v) || 'ex)010-1234-1234'
    ],
    empRnkCd: '',
    rnkNm: '',
    RnkRules: [
      v => !!v || '직급을 선택하세요.'
    ],
    empBrtDt: new Date('yyyy-MM-dd'),
    empEml: '',
    emlRules: [
      v => !!v || '이메일을 입력하세요. ex)abc123@naver.com',
      v => /.+@.+\..+/.test(v) || 'ex)abc123@naver.com',
    ],
    empHrDt: new Date('yyyy-MM-dd'),
  }),
  methods: {
    async validForm() {
      const {valid} = await this.$refs.form.validate()
      if (valid) {
        this.dialog = true
      }
    },
    selectImage(image) {
      this.file = image.target.files[0]
      // 이미지 미리보기
      const reader = new FileReader()
      reader.readAsDataURL(image.target.files[0])
      reader.onload = e => {
        this.empPhtUrl = e.target.result
      }
    },
    replaceByDefault(image) {
      console.log(33)
      if (image && image.target) {
        image.target.src = "~/assets/img/nuxt.png";
        console.log(11, image)
        console.log(22, image.target)
      }
    },
    timeoutSet() {
      setTimeout(this.submit, 2000)
    },
    async getEmpInfo() {
      const no = parseInt(this.$route.query.empNo)
      const empNoParam = {
        empNo: no
      }
      //getAction
      const {data} = await this.getEmp(empNoParam)
      this.emp = data.value.data
      // this.emp.empRnkCd = { name: this.emp.rnkNm, value: this.emp.empRnkCd }
      this.emp.empRnkCd = this.rank.find(item => item.value == this.emp.empRnkCd)
    },
    async submit() {
      const no = parseInt(this.$route.query.empNo)
      let emp = {
        empNo: no,
        empNm: this.emp.empNm,
        empPwd: this.emp.empPwd,
        empPhn: this.emp.empPhn,
        empEml: this.emp.empEml,
        empHrDt: this.emp.empHrDt,
        empBrtDt: this.emp.empBrtDt,
        empRnkCd: this.emp.empRnkCd.value,
        empSlr: this.emp.empSlr,
        empVctnTtl: this.emp.empVctnTtl
      }

      let img = this.file

      const formData = new FormData()
      formData.append('file', img)
      formData.append('key', new Blob([JSON.stringify(emp)], {type: "application/json"}))

      await axios.put('api/emp/update', formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
      await router.replace({
        path: "/empList",
      })
    },
    empList() {
      router.push({
        path: "/empList"
      })
    },
  },

}
</script>

<style scoped>
.red-color {
  color: red;
}

.blue-color {
  color: blue;
}
</style>