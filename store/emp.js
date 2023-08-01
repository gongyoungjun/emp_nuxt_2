import {defineStore} from 'pinia'
import useApi from '/composition/useApi'

export const useEmpStore = defineStore('emp', () => {
    const empList = async (param) => {
        // const { data : data } = await useApi("POST", "/emp/list", param);
        // console.log("2data" , data.value)

        console.log("사원검색", param)
        return await useApi("POST", "/emp/list", param);
        // watch(count, (newCount) => {
        //     // Because count starts out null, you won't have access
        //     // to its contents immediately, but you can watch it.
        // })
    }

/*    const empInfo = async (param) => {
        return await useApi("POST", "/emp/detail", param);
    }*/

    const empInfoUser = async (param) => {
        console.log("사원상세정보", param);
        return await useApi("GET", "/emp/detailUser", param);
    }

    const empUpdate = async (param) => {
        console.log("사원수정정보", param);
        return await useApi("PUT", "/emp/update", param);
    }

    return {
        empList, empUpdate, empInfoUser
    }
});