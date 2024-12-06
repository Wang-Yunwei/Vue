// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/preExam/selfReg',
    children: [
      {
        name: 'PreExam',
        path: '/preExam',
        redirect: '/preExam/selfReg',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '预检分诊', keepAlive: false, icon: 'icon_yujianfenzhen', permission: ['preExam'] },
        children: [
          {
            path: '/preExam/selfReg',
            name: 'PreExamSelfReg',
            component: () => import('@/views/preExam/selfReg/index'),
            meta: { title: '个人登记' }
          },
          {
            path: '/preExam/groupEvents',
            name: 'PreExamGroupEvents',
            component: () => import('@/views/preExam/groupEvents/index'),
            meta: { title: '群体事件' }
          },
          {
            path: '/preExam/secondaryDiagnosis',
            name: 'PreExamSecondaryDiagnosis',
            component: () => import('@/views/preExam/secondaryDiagnosis/index'),
            meta: { title: '二次分诊' }
          }
        ]
      },
      {
        name: 'TriageList',
        path: '/triageList',
        redirect: '/triageList/selfReg',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '分诊列表', keepAlive: true, icon: 'icon_fenzhenliebiao', permission: ['triageList'] },
        children: [
          {
            path: '/triageList/selfReg',
            name: 'TriageListSelfReg',
            component: () => import('@/views/triageList/selfReg/index'),
            meta: { title: '个人登记' }
          },
          {
            path: '/triageList/registration',
            name: 'TriageListRegistration',
            component: () => import('@/views/triageList/registration/index'),
            meta: { title: '挂号管理' }
          }
        ]
      },
      {
        name: 'QualityControl',
        path: '/qualityControl',
        redirect: '/qualityControl/triageQualityControl',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '质控统计', keepAlive: true, icon: 'icon_qualityControl', permission: ['qualityControl'] },
        children: [
          {
            path: '/qualityControl/triageQualityControl',
            name: 'TriageQualityControl',
            component: () => import('@/views/qualityControl/triageQualityControl/index'),
            meta: { title: '分诊质控' }
          },
          {
            path: '/qualityControl/triageStatistics',
            name: 'TriageStatistics',
            component: () => import('@/views/qualityControl/triageStatistics/index'),
            meta: { title: '分诊统计' }
          }
        ]
      },
      {
        name: 'ConfigurationManage',
        path: '/configurationManage',
        redirect: '/configurationManage/dictionary',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '配置管理', keepAlive: true, icon: 'lvtong_peizhiguanli', permission: ['configurationManage'] },
        children: [
          {
            path: '/configurationManage/dictionary',
            name: 'DataDictionary',
            component: () => import('@/views/configurationManage/dictionary'),
            meta: { title: '数据字典' }
          },
          {
            path: '/configurationManage/ratingsTemplate',
            name: 'RatingsTemplate',
            component: () => import('@/views/configurationManage/ratingsTemplate'),
            meta: { title: '评分模板' }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      }
    ]
  },
  {
    name: '403',
    path: '/403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/403')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
