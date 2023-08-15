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

    // 카카오 로그인 함수
    const kakaoFriend = async () => {
        try {
            const authObj = await window.Kakao.Auth.login({
                success: async (authObj) => {
                    const newKakaoToken = authObj.access_token;
                    setKakaoToken(newKakaoToken); // 액세스 토큰 저장

                    // 카카오 액세스 토큰을 백엔드로 전송
                    try {
                        const response = await sendKakaoTokenToBackend(newKakaoToken);

                        // 필요한 로직 추가
                        return response;
                    } catch (error) {
                        console.error('백엔드 통신 에러:', error);
                    }
                },
                fail: (err) => {
                    console.error(err);
                },
            });

            return authObj;
        } catch (error) {
            console.error('카카오 로그인 에러:', error);
        }
    };

    // 카카오 액세스 토큰을 백엔드로 전송하는 함수
    const sendKakaoTokenToBackend = async (accessToken) => {
        try {
            console.log('sendKakaoTokenToBackend 함수 호출'); // 추가된 부분

            const response = await useApi('post', '/api/kakao/friends', {
                accessToken: accessToken,
            });

            return response;
        } catch (error) {
            console.error('백엔드 통신 에러:', error);
        }
    };


    return {
        getKakaoToken,
        kakaoFriend,
    };
});
