import { defineStore } from 'pinia';
import useApi from '/composition/useApi';
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const token = ref(''); // 토큰을 저장하는 ref 변수


    /**
     * 회원가입
     */
    const join = async (param) => {
        console.log("회원가입", param)
        return await useApi("post", "/signup", param);
    }


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

        if (res && res.headers && res.headers.Authorization) {
            const tokenFromHeader = res.headers.Authorization.replace("Bearer ", ""); // "Bearer" 접두사 제거
            setToken(tokenFromHeader);
        } else if (res && res.data && res.data.value.token) {
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
    /**
     * 카카오톡 로그인
     */
    const kakaoLogin = async (code) => {
        if (!code) {
            Error("인가 코드가 전달되지 않았습니다.");
        }

        try {
            const response = await useApi("post", `/api/kakao/token?code=${code}`);

            if (response && response.status.value !== 'success') {
                console.error("서버 응답:", response);
                console.error("오류 내용:", response.error.value); // 에러 내용을 출력합니다.
            }

            return response;
        } catch (error) {
           Error("카카오 로그인 중 에러 발생: " + error.message);
        }
    }

    /**
     * 카카오 업데이트
     */
    const kakaoUpdate = async (param) => {
        console.log("카카오 프로필 업데이트", param)
        return await useApi("put", "/kakao/update", param);
    }

    /**
     * 카카오 회원가입
     */
    const kakaoJoin = async (param) => {
        console.log("카카오 회원가입", param)
        return await useApi("post", "/kakao/signup", param);
    }
    return {
        join,
        getToken, // 현재 토큰 가져오기
        login,   // 로그인 함수
        logout,   // 로그아웃 함수
        kakaoLogin,
        kakaoUpdate,
        kakaoJoin


    }
});
