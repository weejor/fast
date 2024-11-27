import { message } from "antd";
require('isomorphic-fetch');
const API_URL=process.env.REACT_APP_API_URL;
const request = (url: string, config: any) => {
    url=API_URL+url;
    return fetch(url, config)
        .then((res: any) => {
            if (!res.ok) {
                // 服务器异常返回  
                throw Error('接口请求异常');
            }
            const contentType = res.headers.get('Content-Type');
            console.log(contentType)
            if(contentType=="application/octet-stream")
            {
                res.headers.get('Content-Disposition');
                return res.blob();
            }
            return res.json();

        })
        .then((data: any) => {
            if (data.code === 999) {
                if (localStorage.getItem('token')) {
                    localStorage.removeItem('token')
                }
                message.error(data.msg, 1, () => {
                    window.location.href = ''
                })
                return data;
            }
            if(data.code==888)
            {
                message.error(data.msg);
            }
            return data;
        })
        .catch((error: any) => {
            console.log(error)
            return Promise.reject(error);
        });
};

// GET请求
export const get = (url: string) => {
    return request(url, { method: 'GET' });
};

// POST请求
export const post = (url: string, data: any) => {
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;',
            "Accept": "application/json",
            'token': localStorage.getItem('token') || ""
        },
        body: JSON.stringify(data),
    });
};