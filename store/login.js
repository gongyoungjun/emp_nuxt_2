import { defineStore } from 'pinia';
import useApi from '/composition/useApi';
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const token = ref(''); // 토큰을 저장하는 ref 변수
    let layoutStr = ref('user');

    const setToken = (newToken) => {
        token.value = newToken;
        localStorage.setItem('token', newToken); // 토큰을 localStorage에 저장
    }

    const getToken = () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            token.value = storedToken;
        }
        return token.value;
    }
    /**
     * 로그인
     */
    const login = async (param) => {
        const res = await useApi("post", "/login", param);

        // 응답 헤더에서 토큰 추출 (이 부분이 수정된 부분입니다)
        if (res && res.headers && res.headers.Authorization) {
            const tokenFromHeader = res.headers.Authorization.replace("Bearer ", ""); // "Bearer" 접두사 제거
            setToken(tokenFromHeader);
        } else if (res && res.data && res.data.value.token) {
            // 만약 백엔드가 응답 본문에도 토큰을 포함시킬 경우를 대비하여 이 부분도 남겨둡니다.
            setToken(res.data.value.token);
        }

        return res;
    }
    /**`
     * 로그아웃
     */
    const logout = () => {
        token.value = '';
        localStorage.removeItem('token'); // localStorage에서 토큰 제거
    }

    return {
        getToken, // 현재 토큰 가져오기
        login,   // 로그인 함수
        logout   // 로그아웃 함수
    }
});
