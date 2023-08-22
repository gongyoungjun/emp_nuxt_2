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

    const kakaoInfoUser = async (param) => {
        console.log("Sending snsKey:", param);
        return await useApi("post", "/kakao/detail", param);
    }

    const empUpdate = async (param) => {
        console.log("사원수정정보", param);
        return await useApi("put", "/emp/update", param);
    }


    const empCommute = async (param) => {
        console.log("사원출퇴근", param);
        return await useApi("post", "/emp/commute", param);
    }
    const empCommuteList = async (param) => {
        console.log("사원출퇴근 리스트", param);
        return await useApi("post", "/emp/commuteList", param);
    }


    const empEmail = async (param) => {
        console.log("email - 회원가입여부", param);
        return await useApi("post", "/emp/emailCheck", param);
    }

    const empSnsKey = async (param) => {
        console.log("snskey - 회원가입여부", param);
        return await useApi("post", "/kakao/snsKey", param);
    }

    return {
        empList
        , empUpdate
        , empInfoUser
        , empCommute
        , empEmail
        , empSnsKey
        , kakaoInfoUser
        , empCommuteList
    }
});