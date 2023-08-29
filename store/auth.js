import { defineStore } from 'pinia';
import useApi from '/composition/useApi';

export const useAuthStore = defineStore('auth', () => {

    /**
     * 회원가입
     */
    const join = async (param) => {
        console.log("회원가입", param)
        return await useApi("post", "/signup", param);
    }


    return {
        join,

    }

});