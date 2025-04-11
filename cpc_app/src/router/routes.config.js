import { BasicLayout, Container } from '@/layouts'
const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
export default [
  {
    path: '/',
    redirect: isProd ? '/document/index' : '/login',
    component: BasicLayout,
    children: [
      {
        name: 'index',
        path: '/index',
        redirect: '/main',
        component: BasicLayout
      },
      {
        path: '/patient/document/importInfo',
        component: resolve =>
          import('@views/patient/document/importInfo/index.vue').then(module =>
            resolve(module)
          ),
        meta: {
          keepAlive: true // 需要被缓存
        }
      },
      {
        path: '/patient/document/ecg/view',
        component: resolve =>
          import('@views/patient/document/ecg/ecgview.vue').then(module =>
            resolve(module)
          )
      },
      {
        name: 'addInformation',
        path: '/patient/document/addInformation',
        component: resolve =>
          import(
            '@views/patient/document/addInformation/index.vue'
          ).then(module => resolve(module))
      },
      {
        // 推送-急救病历
        path: '/patient/firstaid',
        component: resolve =>
          import('@views/patient/firstaid/index.vue').then(module =>
            resolve(module)
          ),
        meta: {
          keepAlive: true
        }
      },
      {
        // 推送-急诊病历
        path: '/patient/piatPreview',
        component: resolve =>
          import('@views/patient/piat/index.vue').then(module =>
            resolve(module)
          ),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/qc/detail/index',
        redirect: '/qc/detail/index',
        component: resolve =>
          import('@views/qc/detail/index.vue').then(module => resolve(module)),
        children: [
          {
            name: 'aianalysisList',
            path: '/qc/detail/aianalysisList',
            redirect: '/qc/detail/aianalysisList',
            component: Container,
            children: [
              {
                name: '/qc/detail/aianalysisList',
                path: '/qc/detail/aianalysisList',
                component: resolve =>
                  import('@views/qc/detail/aianalysisList.vue').then(module =>
                    resolve(module)
                  )
              },
              {
                name: '/qc/detail/aianalysisDetail',
                path: '/qc/detail/aianalysisDetail',
                component: resolve =>
                  import('@views/qc/detail/aianalysisDetail.vue').then(module =>
                    resolve(module)
                  )
              }
            ]
          }
        ]
      },
      {
        name: 'main',
        path: '/main',
        redirect: '/patient/document',
        component: resolve =>
          import('@views/index.vue').then(module => resolve(module)),
        children: [
          {
            name: 'document',
            path: '/patient/document',
            redirect: '/document/index',
            component: Container,
            children: [
              {
                name: 'document/index',
                path: '/document/index',
                component: resolve =>
                  import(
                    '@views/patient/document/main/index.vue'
                  ).then(module => resolve(module)),
                meta: {
                  keepAlive: true // 需要被缓存
                }
              },
              {
                // 院前推送-列表
                name: 'patient/preHospitalPush',
                path: '/patient/preHospitalPush',
                component: resolve =>
                  import('@views/patient/pushList/index.vue').then(module =>
                    resolve(module)
                  ),
                meta: {
                  keepAlive: true // 需要被缓存
                }
              },
              {
                name: 'patient/firstaid',
                path: '/patient/firstaid',
                component: resolve =>
                  import('@views/patient/firstaid/index.vue').then(module =>
                    resolve(module)
                  )
              },
              {
                name: 'qc/index',
                path: '/qc/index',
                component: resolve =>
                  import('@views/qc/index.vue').then(module => resolve(module))
              }
            ]
          }
        ]
      },
      {
        name: 'documentDetail',
        path: '/patient/document/detail',
        redirect: '/patient/document/detail/main',
        component: resolve =>
          import('@views/patient/document/detail/index.vue').then(module =>
            resolve(module)
          ),
        children: [
          {
            name: 'documentDetailIndex',
            path: '/patient/document/detail/main',
            component: resolve =>
              import(
                '@views/patient/document/detail/main/index.vue'
              ).then(module => resolve(module))
          },
          {
            name: 'timeLine',
            path: '/patient/document/detail/timeManagement/timeline',
            component: resolve =>
              import(
                '@views/patient/document/detail/timeManagement/timeline/index.vue'
              ).then(module => resolve(module))
          },
          {
            name: 'timeCollection',
            path: '/patient/document/detail/timeManagement/timeCollection',
            component: resolve =>
              import(
                '@views/patient/document/detail/timeManagement/timeCollection/index.vue'
              ).then(module => resolve(module))
          },
          {
            name: 'qualityControl',
            path: '/patient/document/detail/qc',
            component: resolve =>
              import(
                '@views/patient/document/detail/qc/index.vue'
              ).then(module => resolve(module))
          }
        ]
      },
      {
        name: 'timeManagement',
        path: '/patient/detail/timeManagement',
        redirect: '/patient/detail/timeManagement/timeCollection',
        component: resolve =>
          import(
            '@views/patient/document/detail/timeManagement/index.vue'
          ).then(module => resolve(module)),
        children: [
          {
            path: '/patient/detail/timeManagement/timeline',
            component: resolve =>
              import(
                '@views/patient/document/detail/timeManagement/timeline/index.vue'
              ).then(module => resolve(module))
          },
          {
            path: '/patient/detail/timeManagement/timeCollection',
            component: resolve =>
              import(
                '@views/patient/document/detail/timeManagement/timeCollection/index.vue'
              ).then(module => resolve(module))
          }
        ]
      },
      {
        name: 'overview',
        path: '/patient/document/overview',
        redirect: '/patient/document/overview/main',
        component: resolve =>
          import('@views/patient/document/overview/index.vue').then(module =>
            resolve(module)
          ),
        children: [
          {
            path: '/patient/document/overview/detail',
            component: resolve =>
              import(
                '@views/patient/document/detail/main/index.vue'
              ).then(module => resolve(module))
          },
          {
            path: '/patient/document/overview/timeline',
            component: resolve =>
              import(
                '@views/patient/document/detail/timeManagement/timeline/index.vue'
              ).then(module => resolve(module))
          },
          {
            name: 'overviewIndex',
            path: '/patient/document/overview/main',
            component: resolve =>
              import(
                '@views/patient/document/overview/main/index.vue'
              ).then(module => resolve(module))
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
        name: 'test',
        path: '/test',
        component: resolve =>
          import('@views/test.vue').then(module => resolve(module))
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: resolve => import('@views/404').then(module => resolve(module))
  }
]
