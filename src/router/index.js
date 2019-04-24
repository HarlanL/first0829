import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import User from '@/components/users.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/login', component: Login},
    {path:
    '/home',
    component: Home,
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: User}
    ]
    }
  ]
})

// 设置路由首位
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
