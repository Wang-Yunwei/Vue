import { BasicLayout } from '@/layouts'
const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)

export default [
  {
    path: '/',
    name: 'index',
    redirect: isProd ? '/gc' : '/login',
    component: BasicLayout,
    children: [
      {
        name: 'gc',
        path: '/gc',
        redirect: '/gc/fileList',
        component: resolve =>
          import('@views/gc').then(module => resolve(module)),
        children: [
          {
            // 卒中档案
            name: 'fileList',
            path: '/gc/fileList',
            component: resolve =>
              import('@views/gc/fileList/index.vue').then(module =>
                resolve(module)
              )
          },
          {
            // 患者列表
            path: '/gc/patientList',
            component: resolve =>
              import('@views/gc/patientList').then(module => resolve(module))
          },
          {
            // 院前推送-列表
            path: '/gc/preHospitalPush',
            component: resolve =>
              import(
                '@views/gc/preHospitalPush/pushList/index.vue'
              ).then(module => resolve(module))
          },
          {
            // 推送-急救病历
            path: '/gc/preHospitalPreview',
            component: resolve =>
              import(
                '@views/gc/preHospitalPush/firstAid/index.vue'
              ).then(module => resolve(module))
          },
          {
            // 推送-急诊病历
            path: '/gc/piatPreview',
            component: resolve =>
              import('@views/gc/preHospitalPush/piat/index.vue').then(module =>
                resolve(module)
              )
          },
          {
            // 院前推送-新建病例
            path: '/gc/preHospitalPush/createPatientHistory',
            name: 'createPatientHistory',
            component: resolve =>
              import(
                '@/views/gc/preHospitalPush/pushList/createPatientHistory/index.vue'
              ).then(module => resolve(module))
          },
          {
            // 添加基本信息
            path: '/gc/addInformation',
            component: resolve =>
              import('@views/gc/addInformation/index.vue').then(module =>
                resolve(module)
              )
          },
          {
            // 病历详情
            path: '/gc/detail',
            redirect: '/gc/detail/task',
            component: resolve =>
              import('@views/gc/detail/index.vue').then(module =>
                resolve(module)
              ),
            children: [
              {
                // 病历编辑
                path: '/gc/detail/task',
                component: resolve =>
                  import('@views/gc/detail/task/index.vue').then(module =>
                    resolve(module)
                  )
              },
              {
                // 时间点采集
                path: '/gc/detail/timeCollection',
                component: resolve =>
                  import(
                    '@views/gc/timeManagement/timeCollection/index.vue'
                  ).then(module => resolve(module))
              },
              {
                // 时间轴
                path: '/gc/detail/timeline',
                component: resolve =>
                  import('@views/gc/detail/timeline/index.vue').then(module =>
                    resolve(module)
                  )
              }
            ]
          },
          {
            // 已完成
            path: '/gc/completed',
            redirect: '/gc/completed/overview',
            component: resolve =>
              import('@views/gc/completed/index.vue').then(module =>
                resolve(module)
              ),
            children: [
              {
                // 时间轴
                path: '/gc/completed/timeline',
                component: resolve =>
                  import('@views/gc/detail/timeline/index.vue').then(module =>
                    resolve(module)
                  )
              },
              {
                // 病历全览
                path: '/gc/completed/overview',
                component: resolve =>
                  import('@views/gc/detail/overview/index.vue').then(module =>
                    resolve(module)
                  )
              }
            ]
          },
          {
            // 预览
            path: '/gc/preview',
            redirect: '/gc/preview/overview',
            component: resolve =>
              import('@views/gc/preview/index.vue').then(module =>
                resolve(module)
              ),
            children: [
              {
                // 病历编辑
                path: '/gc/preview/task',
                component: resolve =>
                  import('@views/gc/detail/task/index.vue').then(module =>
                    resolve(module)
                  )
              },
              {
                // 时间轴
                path: '/gc/preview/timeline',
                component: resolve =>
                  import('@views/gc/detail/timeline/index.vue').then(module =>
                    resolve(module)
                  )
              },
              {
                // 病历全览
                path: '/gc/preview/overview',
                component: resolve =>
                  import('@views/gc/detail/overview/index.vue').then(module =>
                    resolve(module)
                  )
              }
            ]
          },
          {
            // 已归档-时间管理/病历预览
            path: '/gc/filingTimeline',
            redirect: '/gc/filingTimeline/timeline',
            component: resolve =>
              import('@views/gc/filingTimeline/index.vue').then(module =>
                resolve(module)
              ),
            children: [
              {
                // 已归档-时间管理
                path: '/gc/filingTimeline/timeline',
                component: resolve =>
                  import(
                    '@views/gc/filingTimeline/timeline/index.vue'
                  ).then(module => resolve(module))
              },
              {
                // 已归档-病历预览
                path: '/gc/filingTimeline/overview',
                component: resolve =>
                  import('@views/gc/detail/overview/index.vue').then(module =>
                    resolve(module)
                  )
              }
            ]
          },
          {
            // 心电图列表
            path: '/gc/electrocardiogram',
            component: resolve =>
              import('@views/gc/electrocardiogram/index.vue').then(module =>
                resolve(module)
              )
          },
          {
            // 添加心电图
            path: '/gc/addElectrocardiogram',
            component: resolve =>
              import('@views/gc/addElectrocardiogram/index.vue').then(module =>
                resolve(module)
              )
          },
          {
            // 时间管理
            path: '/gc/timeManagement',
            redirect: '/gc/timeManagement/timeCollection',
            component: resolve =>
              import('@views/gc/timeManagement/index.vue').then(module =>
                resolve(module)
              ),
            children: [
              {
                // 时间点采集
                path: '/gc/timeManagement/timeCollection',
                component: resolve =>
                  import(
                    '@views/gc/timeManagement/timeCollection/index.vue'
                  ).then(module => resolve(module))
              },
              {
                // 时间轴
                path: '/gc/timeManagement/timeline',
                component: resolve =>
                  import(
                    '@views/gc/timeManagement/timeline/index.vue'
                  ).then(module => resolve(module))
              }
            ]
          }
        ]
      },
      {
        name: 'login',
        path: '/login',
        component: resolve =>
          import('@views/tmpLogin.vue').then(module => resolve(module))
      },
      {
        name: 'demo',
        path: '/demo',
        component: resolve =>
          import('@views/demo.vue').then(module => resolve(module))
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: resolve => import('@views/404').then(module => resolve(module))
  }
]
