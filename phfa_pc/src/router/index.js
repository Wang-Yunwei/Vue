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
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [
  //     {
  //       path: 'home',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Home',
  //       meta: {
  //         title: '首页',
  //         icon: 'el-icon-s-home',
  //         affix: true,
  //         permission: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/view-patient',
    component: () => import('@/views/patient/view'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/patient',
    component: Layout,
    children: [
      {
        path: '/patient',
        component: () => import('@/views/patient/index'),
        name: 'Patient',
        meta: {
          title: '病历管理',
          icon: 'el-icon-document'
        }
      },
      {
        path: '/patient/edit',
        hidden: true,
        component: () => import('@/views/patient/edit'),
        name: 'Edit',
        meta: {
          title: '患者编辑',
          activeMenu: '/patient'
        }
      }
    ]
  },
  {
    path: '/',
    redirect: '/configure',
    component: Layout,
    meta: {
      title: '配置管理',
      icon: 'el-icon-s-operation'
    },
    children: [
      {
        path: '/configure/dictionary',
        component: () => import('@/views/configure/dictionary'),
        name: 'dictionary',
        meta: {
          title: '字典配置',
          icon: 'el-icon-collection'
        }
      },
      {
        path: '/configure/emergencyStation',
        component: () => import('@/views/configure/emergencyStation'),
        name: 'emergencyStation',
        meta: {
          title: '急救站',
          icon: 'el-icon-place'
        }
      },
      {
        path: '/configure/emergencyCar',
        component: () => import('@/views/configure/emergencyCar'),
        name: 'emergencyCar',
        meta: {
          title: '急救车',
          icon: 'el-icon-truck'
        }
      },
      {
        path: '/configure/personnel',
        component: () => import('@/views/configure/personnel/index'),
        name: 'personnel',
        meta: {
          title: '人员',
          icon: 'el-icon-user'
        }
      },
      {
        path: '/configure/drug',
        component: () => import('@/views/configure/drug'),
        name: 'Drug',
        meta: {
          title: '药品',
          icon: 'el-icon-first-aid-kit'
        }
      }
    ]
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    meta: {
      title: '质控管理',
      icon: 'el-icon-pie-chart'
    },
    children: [
      {
        path: '/dashboard/home',
        component: () => import('@/views/dashboard/home'),
        name: 'Dashboard',
        meta: {
          title: '主页',
          icon: 'el-icon-house'
        }
      }, {
        path: '/dashboard/vehicle-dispatching',
        component: () => import('@/views/dashboard/vehicleDispatching'),
        name: 'VehicleDispatching',
        meta: {
          title: '出车情况统计',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/average-reaction-time',
        component: () => import('@/views/dashboard/averageReactionTime'),
        name: 'AverageReactionTime',
        meta: {
          title: '平均反应用时统计表',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/eachtime-vehicle-dispatching',
        component: () => import('@/views/dashboard/eachTimeVehicleDispatching'),
        name: 'EachTimeVehicleDispatching',
        meta: {
          title: '各时间段出车统计表',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/average-dispatching-duration',
        component: () => import('@/views/dashboard/averageDispatchingDuration'),
        name: 'AverageDispatchingDuration',
        meta: {
          title: '平均出车时长统计',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/disease-classification',
        component: () => import('@/views/dashboard/diseaseClassification'),
        name: 'DiseaseClassification',
        meta: {
          title: '病种分类统计表',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/regional-analysis',
        component: () => import('@/views/dashboard/regionalAnalysis'),
        name: 'RegionalAnalysis',
        meta: {
          title: '区域分析图',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/medicalrecord-completionrate',
        component: () => import('@/views/dashboard/medicalRecordCompletionRate'),
        name: 'MedicalRecordCompletionRate',
        meta: {
          title: '病历完成率',
          icon: 'el-icon-pie-chart'
        }
      }, {
        path: '/dashboard/measures-analysis',
        component: () => import('@/views/dashboard/measuresAnalysis'),
        name: 'MeasuresAnalysis',
        meta: {
          title: '急救措施统计表',
          icon: 'el-icon-pie-chart'
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
    routes: constantRoutes.concat(asyncRoutes)
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
