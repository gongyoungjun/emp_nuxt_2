import {defineStore} from 'pinia'
import useApi from '/composition/useApi'

export const useVctnStore = defineStore('vctn', () => {
    const vctnList = async (param) => {
        console.log('휴가검색', param)
        return await useApi("POST", "/vacation/list", param);
    }

    const vctnApply = async (param) => {
        console.log('신청',param)
        return await useApi("POST", "/vctn/insert", param);
    }

    const vctnDetail = async (param) => {
        return await useApi("GET", "/vctn/detail", param);
    }

    const vctnSt = async (param) => {
        return await useApi("PUT", "/vctn/update", param);
    }


    return {
        vctnList, vctnApply, vctnDetail, vctnSt
    }
});