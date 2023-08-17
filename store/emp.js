import {defineStore} from 'pinia'
import useApi from '/composition/useApi'

export const useEmpStore = defineStore('emp', () => {
    const empList = async (param) => {
        console.log("사원검색", param)
        return await useApi("post", "/emp/list", param);
    }
    const empInfoUser = async (param) => {
        console.log("사원상세정보", param);
        return await useApi("post", "/emp/detail", param);
    }

    const empUpdate = async (param) => {
        console.log("사원수정정보", param);
        return await useApi("put", "/emp/update", param);
    }


    const empCommute = async (param) => {
        console.log("사원출퇴근", param);
        return await useApi("post", "/emp/commute", param);
    }

    const empEmail = async (param) => {
        console.log("회원가입여부", param);
        return await useApi("post", "/emp/emailCheck", param);
    }


    return {
        empList, empUpdate, empInfoUser,empCommute,empEmail
    }
});