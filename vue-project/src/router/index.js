import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuth: 'home',// 访问权限
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue')
    },
    {
      name: 'business',
      path: '/business',
      component: HomeView,
      children: [
        {
          name: 'TestA',
          path: '',// 二级目录不需要添加 / 斜杠
          component: () => import('../views/business/TestA.vue'),
          meta: { // 路由元信息
            requireAuth: 'TetsA',// 访问权限
          }
        },
        {
          name: 'TestB',
          path: 'TestB',// 二级目录不需要添加 / 斜杠
          component: () => import('../views/business/TestB.vue'),
          meta: { // 路由元信息
            requireAuth: 'TestB',// 访问权限
          }
        },
        {
          name: 'TestC',
          path: 'TestC',// 二级目录不需要添加 / 斜杠
          component: () => import('../views/business/TestC.vue'),
          meta: { // 路由元信息
            requireAuth: 'TestC',// 访问权限
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from) => {
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  // if (to.meta.requiresAuth && !auth.isLoggedIn()) {
  //   // 此路由需要授权，请检查是否已登录
  //   // 如果没有，则重定向到登录页面
  //   return {
  //     path: '/login',
  //     // 保存我们所在的位置，以便以后再来
  //     query: { redirect: to.fullPath },
  //   }
  // }
  console.log('beforeEach: ', to.meta.requireAuth);
})

export default router
