import {defineStore} from 'pinia'
import useApi from '/composition/useApi'
import {ref} from "vue";

/**
 * 회원가입
 */
export const useAuthStore = defineStore('auth', () => {
    let layoutStr = ref('user')

    const join = async (param) => {
        console.log("회원가입", param)
        return await useApi("POST", "/login/join", param);
    }

    /**
     * 로그인
     */
    const login = async (param) => {
        const res = await useApi("post", "/login", param);
        if (res.data.value != undefined && res.data.value.code == '0000') {
            localStorage.setItem('user', JSON.stringify(res.data.value.data));
        } else {
            localStorage.removeItem('user');
        }
        return res;
    }
    /**
     * 로그아웃
     */
    /*    const logout = async () => {
            console.log("ccc")
            localStorage.removeItem('user');
        }*/

    return {
        join, login, layoutStr
    }

});