export default async (method: "post" | "put" | "get" | "delete", url: string, req: {} = {}) => {
    const token = localStorage.getItem('token');
    const auth = 'Authorization';
    let apiKey = token || 'a'; // 토큰이 없으면 'a'를 기본값으로 사용

    const isGetMethod = method.toLowerCase() === "get";
    const paramType = isGetMethod ? 'params' : 'body';

    const options = {
        baseURL: '/api',
        method: method,
        [paramType]: req,
        headers: {
            [auth]: apiKey,
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
        }
    };

    return useFetch(url, options);
}
