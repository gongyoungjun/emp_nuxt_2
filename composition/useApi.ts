export default async (method:  "post" | "put" | "get" | "delete", url: string, req: {}) => {
    //토큰여부에따라 api 키사용여부 결정
    // let user = JSON.parse(localStorage.getItem('user')!);
    //
    let apiKey, auth;
    // if(user == undefined){
    //     auth = 'a'
    //     apiKey = 'a'
    // }else{
    //     auth = 'Authorization'
    //     apiKey = 'Bearer ' + user.jwtTokens.accessToken
    // }

    auth = 'Authorization'
    apiKey = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2OTA4NTQ1MjcsInN1YiI6IjEzIiwiZXhwIjoxNzIyMzkwNTI3fQ.mgjSswGzcRrJKKb8tte1rxRn2oRZy7dFejxVxDRS_EY'

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