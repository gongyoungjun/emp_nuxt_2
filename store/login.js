import {defineStore} from 'pinia'
import useApi from '/composition/useApi'
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    let layoutStr = ref('user')
    const login = async (param) => {
        const res = await useApi("post", "/login", param);
        return res;
    }
    return {
        login
    }

});