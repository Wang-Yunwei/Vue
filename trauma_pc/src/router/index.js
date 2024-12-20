import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    authSign: 'trauma-first-page',
    children: [
      {
        name: 'Home',
        path: 'home',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: '首页',
          icon: 'el-icon-s-home',
          affix: true,
          permission: ['admin']
        }
      }
    ]
  },
  {
    path: '/patient-management',
    component: Layout,
    authSign: 'trauma-mr-patient',
    children: [
      {
        name: 'List',
        path: '', // 当 /patient-management 匹配成功 index.vue 将被渲染到 Layout 的 <router-view> 内部
        component: () => import('@/views/patient-management/index.vue'),
        meta: {
          title: '患者管理',
          icon: 'el-icon-edit'
        }
      },
      {
        name: 'Edit',
        path: 'edit',
        hidden: true,
        component: () => import('@/views/patient-management/Edit.vue'),
        meta: {
          title: '患者编辑',
          activeMenu: '/patient-management'
        }
      }
    ]
  },
  {
    path: '/qc',
    component: Layout,
    authSign: 'trauma-qc',
    children: [
      {
        path: '',
        component: () => import('@/views/qc/index'),
        name: 'QC',
        meta: {
          title: '质控统计',
          icon: 'el-icon-s-data'
        }
      },
      {
        name: 'Detailed',
        path: 'details',
        component: () => import('@/views/qc/details.vue'),
        hidden: true,
        meta: {
          title: '质控统计明细',
          activeMenu: '/qc'
        }
      }
    ]
  },
  {
    path: '/meetings',
    component: Layout,
    authSign: 'trauma-regular-meeting',
    children: [
      {
        name: 'Meetings',
        path: '',
        component: () => import('@/views/meetings/index'),
        meta: {
          title: '例会管理',
          icon: 'iconfont icon-huiyi-112',
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    authSign: 'trauma-system-setting',
    children: [
      {
        path: '',
        component: () => import('@/views/settings/index'),
        name: 'Settings',
        meta: {
          title: '系统设置',
          icon: 'el-icon-setting'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
