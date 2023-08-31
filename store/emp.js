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

    /**
     * pinia
     * 상태 관리 도구 사용
     * 스토어 확정
     * 다른 page, 컴포넌트 데이터 전달
     */
/*    const empAuthCd = ref(null);
    const setEmpAuthCd = (value) => {
        empAuthCd.value = value;
    }
    const getEmpAuthCd = () => empAuthCd.value;


    const empNo = ref(null);
    const setEmpNo = (value) => {
        empNo.value = value;
    }
    const getEmpNo = () => empNo.value;*/


    return {
        empList
        , empUpdate
        , empInfoUser
        , empCommute
        , empEmail
        , empSnsKey
        , kakaoInfoUser
        , empCommuteList
/*        , empAuthCd
        , setEmpAuthCd
        , getEmpAuthCd
        , empNo
        , setEmpNo
        , getEmpNo*/


    }
});