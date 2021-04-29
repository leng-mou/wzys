import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index.js'
// 导入全局样式
import './assets/css/global.css'
// 引入阿里图标
import './assets/fonts/iconfont.css'
// 导入element-ui样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 兼容ie11
import promise from 'es6-promise' 
import 'babel-polyfill'
promise.polyfill() // 兼容 Promise

// 缩略图插件
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'


Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})

// import './util/permission.js'


import http from './request/http.js'
Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
