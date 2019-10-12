import Vue from 'vue';
import axios from 'axios';
import queryString from 'querystring';

const urlStr = 'http://test.yuiservice.tech:8010/';
// 创建实例
var instance = axios.create({
    baseURL: urlStr,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    // `transformRequest` 允许在向服务器发送前，修改请求数据
    // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    transformRequest: [function(data) {
        // 对 data 进行任意转换处理
        return queryString.stringify(data);
    }],
});

// 在请求或响应被 then 或 catch 处理前拦截它们。
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    const AUTH_TOKEN = window.sessionStorage.getItem('token');
    const AUTH_TOKENKEY = window.sessionStorage.getItem('tokenKey');
    if (AUTH_TOKEN) {
        config.headers.common['token'] = AUTH_TOKEN;
    }
    if (AUTH_TOKENKEY) {
        config.headers.common['token-key'] = AUTH_TOKENKEY;
    }

    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
        console.log(response)
        if (response.data.code == 10205) {
            if (window.location.pathname == '/login') return false;
            alert('登录失效，请重新登录！')
            window.location.href = "/login"
        }
        // 在此拿到token-key
        const tokenKey = response.headers['token-key'];
        // console.log(tokenKey);
        // 判断tokenKey是否存在， 存在就存储起来
        if (tokenKey) {
            window.sessionStorage.setItem("tokenKey", tokenKey);
        }

        // 对响应数据做点什么
        return response;
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });

Vue.prototype.axios = instance;
Vue.prototype.axiosUrl = urlStr;

export default instance;