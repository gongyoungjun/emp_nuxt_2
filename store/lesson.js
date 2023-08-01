import {defineStore} from 'pinia'
import useApi from '/composition/useApi'

export const useLessonStore = defineStore('lesson', () => {
    const lessonList = async (param) => {
        console.log('레슨 조회 검색', param)
        return await useApi("post", "/lesson/list", param);
    }

    const lessonApply = async (param) => {
        console.log('레슨 신청',param)
        return await useApi("post", "/lesson/insert", param);
    }

    const lessonDetail = async (param) => {
        return await useApi("get", "/lesson/detail", param);
    }

    const lessonUpdate = async (param) => {
        return await useApi("put", "/lesson/update", param);
    }

    const lessonMonth = async (param) => {
        return await useApi("post", "/lesson/monthly", param);
    }

    //admin

    const adminMemberList = async (param) => {
        console.log("admin 회원목록 조회 ", param);
        return await useApi("post", "/admin/memberList", param);
    }
    const memberLessonInfo = async (param) => {
        console.log("회원목록 상세 조회 ", param);
        return await useApi("get", "/admin/memberLessonInfo", param);
    }
    const lessonMemberJoin = async (param) => {
        return await useApi("post", "/admin/member/join", param);
    }
    const lessonMemberupdate = async (param) => {
        return await useApi("post", "/admin/member/update", param);
    }
    const lessonAddRegCnt = async (param) => {
        return await useApi("post", "/admin/member/addRegCnt", param);
    }
    const lessonRegHist = async (param) => {
        return await useApi("get", "/admin/member/lsnRegHist", param);
    }

    return {
        lessonList, lessonApply, lessonDetail, lessonUpdate, lessonMonth, adminMemberList, memberLessonInfo, lessonMemberJoin
        , lessonMemberupdate, lessonAddRegCnt, lessonRegHist
    }
});