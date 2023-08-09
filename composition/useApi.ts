export default async (method:  "post" | "put" | "get" | "delete", url: string, req: {}) => {
    //토큰여부에따라 api 키사용여부 결정
    let token = localStorage.getItem('token')!
    //
    let apiKey, auth;
    if(token == undefined){
        auth = 'a'
        apiKey = 'a'
    }else{
        auth = 'Authorization'
        apiKey = token
    }

    auth = 'Authorization'
    // apiKey = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2OTA4NTQ1MjcsInN1YiI6IjEzIiwiZXhwIjoxNzIyMzkwNTI3fQ.mgjSswGzcRrJKKb8tte1rxRn2oRZy7dFejxVxDRS_EY'
    // apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMiIsImlhdCI6MTY5MTQ3OTY5MiwiZXhwIjoxNjkxNDgzMjkyfQ.fO2OvsGSF_wYqFTcoiuvGM9bnXWFxl0juqmtPnABvq4'

    //파라미터 타입 결정
    let parmaType;
    if(method.toLowerCase() == "get"){
        parmaType = 'params'
    }else{
        parmaType = 'body'
    }

    let options = {
        baseURL: '/api',
        method: method,
        [parmaType]: req,
        headers :{
            [auth]: apiKey,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    }

    return await useFetch(url, options)
}