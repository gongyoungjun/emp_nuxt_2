import {defineStore} from 'pinia'
import useApi from '/composition/useApi'
import {ref} from "vue";


export const useAuthStore = defineStore('auth', () => {
    let layoutStr = ref('user')

    /**
     * 회원가입
     */
    const join = async (param) => {
        console.log("회원가입", param)
        return await useApi("post", "/signup", param);
    }

    /**
     * 로그인
     */
/*    const login = async (param) => {
        const res = await useApi("post", "/login", param);
        return res;
    }*/
    /**`
     * 로그아웃
     */
    /*    const logout = async () => {
            console.log("ccc")
            localStorage.removeItem('user');
        }*/

    return {
        join
    }

});