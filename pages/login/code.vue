<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'nuxt/app';
import { useAuthStore } from '@/store/login';
import { useEmpStore } from "~/store/emp";

const empStore = useEmpStore();
const router = useRouter();
const store = useAuthStore();

const employee = ref({
  snsKey: '',
});

onMounted(async () => {
  const code = new URL(window.location.href).searchParams.get("code");
  console.log('인가 코드 확인:', code);
  if (code) {
    try {
      const response = await store.kakaoLogin(code);

      if (response && response.data.value.access_token) {
        console.log('토큰 받기 성공:', response);

        const accessToken = response.data.value.access_token;

        // 세션 스토리지에 idToken과 KAKAO_TOKEN을 저장
        const idToken = response.data.value.id_token;
        sessionStorage.setItem('idToken', idToken);
        sessionStorage.setItem('KAKAO_TOKEN', accessToken);

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);

          // 프로필 정보 가져오기
          const profile = await getKakaoProfile(accessToken);
          console.log('카카오 프로필 정보:', profile);

          // 프로필 정보에서 id 값을 확인하여 라우팅 결정
          const empSnskey = await checkSnsKey(profile.id);

          if (empSnskey) {
            if (profile.id === employee.value.snsKey) {
              await router.push({ path: '/main' });
            } else {
              await router.push({ path: '/login/kakaoSign' });
            }
          } else {
            console.error('카카오 프로필에 id 값이 없습니다.');
            await router.push({ path: '/login/kakaoSign' });
          }
        } else {
          console.error('토큰이 없습니다.');
          await router.push({ path: '/login/kakaoSign' });
        }
      }
    } catch (error) {
      console.error('토큰 받기 중 에러:', error);
      await router.push({ path: '/login/kakaoSign' });
    }
  }
});

// 카카오 프로필 정보 가져오는 함수
async function getKakaoProfile(accessToken) {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data;
}

async function checkSnsKey(id) {
  const response = await empStore.empSnsKey({snskey: id});

  const data = response.data.value;

  console.log("코드 - id:", data);

  return Array.isArray(data.value) && data.value.length > 0;
}

</script>
