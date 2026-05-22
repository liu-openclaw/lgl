import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Todo',
    component: () => import('../views/Todo.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta?.public) {
    // 公开页面
    if (token && to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      next('/')
    } else {
      next()
    }
  } else {
    // 需要认证的页面
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
