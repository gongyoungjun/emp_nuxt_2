<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
        class="auth-card pa-4 pt-7"
        width="400"
    >
      <VCardText class="pt-2">
        <h5 class="text-h5 font-weight-semibold mb-1">
          로그인 페이지 입니다
        </h5>
      </VCardText>

      <VCardText>
        <VForm v-model="form"
               @submit.prevent="onSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                  v-model="model.empNm"
                  :type="number"
                  :rules="[requiredId]"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                  v-model="model.empPwd"
                  label="비밀번호"
                  :rules="[requiredPw]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <div
                  class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4"
                  style="color: #af0020; margin-bottom: 13px; margin-top: -18px; font-size: 14px" >
                {{ errorMessage }}
              </div>

              <VBtn
                  block
                  type="submit"
                  :click="onSubmit"
              >
                Login
              </VBtn>
            </VCol>

            <!-- create account -->

          </VRow>
        </VForm>
      </VCardText>
    </VCard>

  </div>
</template>

<script setup>

import {useRouter} from "nuxt/app";
import {ref} from "vue";
import {useAuthStore} from "../../store/auth";

definePageMeta({
  layout: "none"
})

const router = useRouter()
const authStore = useAuthStore()

let model = ref({
  empNo:null,
  empNm: null,
  empPhn: null,
  empPwd: null,
  dialog: false,
  snackbar: false
})
let form = ref(false)
let errorMessage = ref("")
let loading = ref(false)
const isPasswordVisible = ref(false)

async function onSubmit() {
  if (!form.value) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  //로그인 api 호출
  let param = {
    empNm: model.value.empNm,
    empPwd: model.value.empPwd,
  }

  try {
    const {data, error} = await authStore.login(param)

    if (error.value != null) {
      errorMessage.value = '이름 또는 비밀번호를 잘못 입력하셨습니다.'
    } else {
      if (data.value.code != '0000') {
        errorMessage.value = data.value.message;
      } else {
        await router.push({path: '/main'})
      }
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false
  }

}

function requiredId(v) {
  return !!v || '이름을 입력하세요'
}

function requiredPw(v) {
  return !!v || '비밀번호를 입력하세요'
}

</script>

<!--
<script>
export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        // 로그인 요청을 보내고 empNo를 받아옴
        const response = await this.$axios.post("/api/login", {
          empNm: this.username,
          empPwd: this.password,
        });

        // empNo 받아오기
        const { code, data } = response.data || { code: "", data: null, total: 0 };
        if (code === "0000") {
          if (data === null || data.total === 0) {
            alert("로그인 실패. 사용자 이름과 비밀번호를 확인하세요.");
          } else {
            // 로그인 성공: empNo를 저장
            localStorage.setItem("empNo", data.empNo);

            // 로그인 성공 후 메인 페이지로 이동
            this.$router.push({ name: "main" });
          }
        }
      } catch (error) {
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    },
  },
};
</script>
-->
