import Vue from 'vue';
import router from '@/router/index.js'
Vue.directive('permission', {
    inserted(el,binding) {
        const action = binding.value.action
        const effect=binding.value.effect
        // 判断当前路由对应的组件中，如何判断用户是否具备action的权限
        console.log(router.currentRoute.meta)
        if (router.currentRoute.meta.indexOf(action) == -1) {
            if (effect === "disabled") {
                el.disabled=true
            } else {
                el.parentNode.removeChild(el)
            }
            
        }
    }
})