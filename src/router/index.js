import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Wellcome from '../components/Wellcome.vue'
import Users from '../components/Users/Users.vue'
import Roles from '../components/Rights/Roles.vue'
import Rights from '../components/Rights/Rights.vue'

import Goods from '../components/Goods/Goods.vue'
import ClassParams from '../components/Goods/ClassParams.vue'
import Categorie from '../components/Goods/Categorie.vue'
import Orders from '../components/Orders/Orders.vue'
import Chart from '../components/Chart/Chart.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/wellcome',
    children: [
      { path: '/wellcome', component: Wellcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/classparams', component: ClassParams },
      { path: '/categorie', component: Categorie },
      { path: '/orders', component: Orders },
      { path: '/chart', component: Chart }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将访问的路径
  // from 代表从那个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('./login) 强行跳转
  // console.log(to, from)
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('accessToken')

  if (!tokenStr) return next('/login')
  next()
})

export default router
