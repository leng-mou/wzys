import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

const Login = () => import('../views/Login.vue')
const Home = () => import('../views/Home.vue')
const Welcome = () => import('../views/Welcome.vue')
const Detail = () => import('../views/Detail.vue')

const PassTask = () => import('../views/acceptance/PassTask.vue')
const CancelTask = () => import('../views/acceptance/CancelTask.vue')
const RefuseTask = () => import('../views/acceptance/RefuseTask.vue')
// 验收管理
const Execute = () => import('../views/acceptance/Execute.vue')
const Record = () => import('../views/acceptance/Record.vue')
const Sign = () => import('../views/acceptance/Sign.vue')
// 单据管理
const Input = () => import('../views/bill/Input.vue')
const Search = () => import('../views/bill/Search.vue')
// 系统管理
const User = () => import('../views/system/User.vue')
const Signature = () => import('../views/system/Signature.vue')
const Setting = () => import('../views/system/Setting.vue')

Vue.use(VueRouter)

const executeRule = { path: '/execute', component: Execute }
const recordRule={ path: '/record', component: Record }
const inputRule={ path: '/input', component: Input }
const searchRule={ path: '/search', component: Search }
const userRule={ path: '/user', component: User }
const signatureRule = { path: '/signature', component: Signature }
const settingRule={ path: '/setting', component: Setting }

// 映射关系
const ruleMap = {
  "execute": executeRule,
  "record":recordRule,
  "input": inputRule,
  "search": searchRule,
  "user": userRule,
  "signature": signatureRule,
  "setting":settingRule
}

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      { path: '/welcome', component: Welcome },
      { path: '/passTask/:id', component: PassTask },
      { path: '/cancelTask/:id', component: CancelTask },
      { path: '/refuseTask/:id', component: RefuseTask },
      { path: '/sign/:id', component: Sign },
      { path: '/detail/:id', component: Detail },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 重复点击路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
    next();
})

export function initDynamicRoutes() {
  // 根据二级权限，对路由规则动态添加
  const currentRouters = router.options.routes
  
  const rightsList = store.state.rightsList
  
  rightsList.forEach(item => {
    item.children.forEach(item => {
      // 二级权限
      const temp = ruleMap[item.path]
      currentRouters[2].children.push(temp)
    })
  })

  router.addRoutes(currentRouters)
}

export default router
