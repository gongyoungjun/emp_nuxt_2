<template>
  <v-form ref="form">
    <v-responsive
        class="mx-auto"
        max-width="740"
    >
      <v-row>
        <v-col>
          <v-card>
            <v-card-text>
              <v-text-field
                  v-model="vctn.vctnNo"
                  label="No"
                  variant="filled"
                  readonly
                  style="margin-top: 25px; margin-bottom: -22px"
              ></v-text-field>
              <v-row
                  style="margin-left: 1px; margin-right: 1px; margin-bottom: -32px"
              >
                <v-text-field
                    ref="empNo"
                    v-model="vctn.empNo"
                    label="사번"
                    variant="filled"
                    readonly
                ></v-text-field>

                <v-text-field
                    ref="empNm"
                    v-model="vctn.empNm"
                    label="이름"
                    variant="filled"
                    readonly
                ></v-text-field>
              </v-row>

              <v-row
                  style="margin-left: 1px; margin-right: 1px; margin-bottom: -32px"
              >
                <v-text-field
                    v-model="vctn.vctnKndNm"
                    label="휴가 종류"
                    variant="filled"
                    readonly
                ></v-text-field>

                <v-text-field
                    v-model="vctn.vctnRsdCnt"
                    label="잔여 휴가"
                    variant="filled"
                    readonly
                ></v-text-field>
              </v-row>

              <v-row
                  style="margin-left: 1px; margin-right: 1px; margin-bottom: -20px"
              >
                <v-text-field
                    v-model="vctn.vctnStrDt"
                    label="휴가 시작일"
                    variant="filled"
                    readonly
                ></v-text-field>

                <v-text-field
                    v-model="vctn.vctnEndDt"
                    label="휴가 마지막일"
                    variant="filled"
                    readonly
                ></v-text-field>
              </v-row>

              <v-text-field
                  v-model="vctn.vctnAplDtm"
                  label="휴가 신청일"
                  variant="filled"
                  readonly
              ></v-text-field>

              <p style="color: #767676; font-size: 13px"> 휴가 사유 </p>
              <ckeditor :editor="this.editor" v-model="vctn.vctnRsn" :config="this.editorConfig" :disabled="editDisabled"></ckeditor>

              <v-select
                  v-model="vctn.vctnStCd"
                  :items="state"
                  item-title="name"
                  item-value="value"
                  label="신청상태"
                  variant="outlined"
                  hide-selected
                  return-object
                  style="margin-top: 22px"
              ></v-select>
            </v-card-text>
            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
              <v-btn
                  variant="text"
                  @click="vctnList"
              >
                목록
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  color="deep-purple-lighten-1"
                  @click="dialog = true"
              >
                승인
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
                  <v-card-text>신청 상태를 승인하시겠습니까?</v-card-text>
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
                      @click="[snackbar = false, update()]"
                  >
                    닫기
                  </v-btn>
                </template>
                승인이 완료되었습니다.
              </v-snackbar>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-form>
</template>

<script>

definePageMeta({
  layout: "admin"
})

import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import {ref} from 'vue';
import {useVctnStore} from "../../store/vctn";
import {VDataTableServer} from 'vuetify/labs/VDataTable'
import '@vuepic/vue-datepicker/dist/main.css';
import {useRouter} from "nuxt/app";

const router = useRouter()
export default {
  components: {VDataTableServer},
  setup() {
    const store = useVctnStore()

    const state = ref([
      {name: '신청', value: '01'},
      {name: '승인', value: '02'},
      {name: '반려', value: '03'},
    ])

    return {state, getVctn: store.vctnDetail, setVctn: store.vctnSt}
  },
  data: () => ({
    editor: ClassicEditor,
    editorData: '',
    editorConfig: {
      toolbar: {
        items: []
      },
    },
    dialog: false,
    snackbar: false,
    loading: true,
    valid: true,
    vctn: [],
    vctnNo: 0,
    vctnStrDt: '',
    vctnEndDt: '',
    vctnRsn: '',
    vctnAplDtm: '',
    empNm: '',
    empNo: '',
    empVctnTtl: '',
    vctnKndNm: '',
    vctnStNm: '',
    vctnStCd: '',
    vctnRsdCnt: ''
  }),
  mounted() {
    this.getVctnInfo()
  },
  methods: {
    timeoutSet() {
      setTimeout(this.update, 2000)
    },
    async getVctnInfo() {
      const no = parseInt(this.$route.query.vctnNo)

      const vctnParam = {
        vctnNo: no,
        empNo: 0
      }
      const {data} = await this.getVctn(vctnParam)
      this.vctn = data.value.data
      this.vctn.vctnStCd = {name: this.vctn.vctnStNm, value: this.vctn.vctnStCd}
      // this.vctn.vctnStCd = this.state.find( item => item.value == this.vctn.vctnStCd )
    },
    async update() {
      console.log('수정버튼')
      const no = parseInt(this.$route.query.vctnNo)
      const stParam = {
        vctnNo: no,
        vctnStCd: this.vctn.vctnStCd.value
      }
      const {data} = await this.setVctn(stParam)

      await router.replace({
        path: "/vacation"
      })
    },
    vctnList() {
      router.replace({
        path: "/vacation"
      })
    },
    editDisabled() {
    }
  },
}
</script>