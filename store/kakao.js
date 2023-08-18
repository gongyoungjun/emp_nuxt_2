import useApi from '/composition/useApi';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKakaoAuthStore = defineStore('kakaoAuth', () => {
    const kakaoToken = ref('');

    // 액세스 토큰 저장 함수
    const setKakaoToken = (newToken) => {
        kakaoToken.value = newToken;
        localStorage.setItem('kakaoToken', newToken);
    };

    // 액세스 토큰 가져오는 함수
    const getKakaoToken = () => {
        const storedToken = localStorage.getItem('kakaoToken');
        if (storedToken) {
            kakaoToken.value = storedToken;
        }
        return kakaoToken.value;
    };




    return {
        getKakaoToken,
        kakaoFriend,
    };
});
