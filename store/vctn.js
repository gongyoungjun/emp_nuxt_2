import {defineStore} from 'pinia'
import useApi from '/composition/useApi'

export const useVctnStore = defineStore('vctn', () => {
    const vctnList = async (param) => {
        console.log('휴가검색', param)
        return await useApi("post", "/vacation/list", param);
    }
    /**
     * 휴가신청
     */
    const vctnApply = async (param) => {
        console.log('신청',param)
        return await useApi("post", "/vctn/insert", param);
    }
    /**
     * 상세화면
     */
    const vctnDetail = async (param) => {
        console.log('상세',param)
        return await useApi("post", "/vctn/detail", param);
    }
    /**
     * 휴가 승인/취소
     */
    const vctnSt = async (param) => {
        return await useApi("put", "/approve", param);
    }


    return {
        vctnList, vctnApply, vctnDetail, vctnSt
    }
});