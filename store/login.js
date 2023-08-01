import {defineStore} from 'pinia'
import useApi from '/composition/useApi'
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    let layoutStr = ref('user')
    const login = async (param) => {
        const res = await useApi("post", "/login", param);
// store user details and jwt in local storage to keep user logged in between page refreshes
        if (res.data.value != undefined && res.data.value.code == '0000') {
            localStorage.setItem('user', JSON.stringify(res.data.value.data));
        } else {
            localStorage.removeItem('user');
        }
        return res;
    }
    return {
        join, login, logout, layoutStr
    }

});