import axios from 'axios'
import router from '../router/index'
import { Loading, Message } from 'element-ui'

import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

const http = axios.create({
    baseURL: 'http://192.168.2.37:8080',
    withCredentials: true,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
})

let loading
let loadingCount = 0

http.interceptors.request.use(config => {
    NProgress.start() // 设置加载进度条(开始..)
    loadingCount++
    loading = Loading.service({
    target: 'body',
    background: 'transparent',
    text: '载入中',
    })

    config.headers.Authorization = window.sessionStorage.getItem('token');
    // config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8'
    // 在最后必须return config
    return config
}, err => {
    return Promise.reject(err)
})

http.interceptors.response.use(config => {
    if (config.data && config.data.code == 401) {
        Message.error('登录信息已过期,请重新登录!')
        // 清楚sessionStorage数据
        window.sessionStorage.clear()
        // 删除vuex中的数据，让当前页面刷新
        window.location.reload()
        router.push('/login')
    }
    NProgress.done() // 设置加载进度条(结束..)
    loadingCount--
    if (loadingCount<=0) {
        loading.close()
    } else {
       
    }
    return config
}, err => {
    // if (err.response.status === 404) {
    //     Message.error('连接失败,请检查网络!!!404')
    // } else if (err.response.status === 500) {
    //      Message.error('连接失败,请检查网络!!!500')
    // } else {
    //      Message.error('连接失败,请检查网络!!!')
    // }
    Message.error('连接失败,请检查网络!!!')
    NProgress.done() // 设置加载进度条(结束..)
    loadingCount--
    if (loadingCount<=0) {
        loading.close()
    } else {
       
    }

    return Promise.reject(err)
})

export default http