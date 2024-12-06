import { BasicLayout } from '@/layouts'
const isProd = ['prod', 'production'].includes(process.env.NODE_ENV)
export default [
  {
    path: '/',
    redirect: isProd ? '/aid' : '/login',
    component: BasicLayout,
    children: [
      {
        name: 'aid',
        path: '/aid',
        redirect: '/aid/ambulances',
        component: resolve =>
          import('@views/aid/index').then(module => resolve(module)),
        children: [
          {
            path: '/aid/map',
            component: resolve =>
              import('@views/aid/map/index').then(module => resolve(module))
          },
          {
            path: '/aid/consultation',
            component: resolve =>
              import('@views/aid/consultation/index').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/history',
            component: resolve =>
              import('@views/aid/history/index').then(module => resolve(module))
          },
          {
            path: '/aid/mine',
            component: resolve =>
              import('@views/aid/mine/index').then(module => resolve(module))
          },
          {
            path: '/aid/task',
            component: resolve =>
              import('@views/aid/task/index').then(module => resolve(module))
          },
          {
            path: '/aid/task/noTask',
            component: resolve =>
              import('@views/aid/task/parts/NoTask/index').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/task/poct',
            component: resolve =>
              import('@views/aid/task/parts/AuxiliaryExam/poct').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/task/ti',
            component: resolve =>
              import('@views/aid/task/parts/AuxiliaryExam/ti').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/task/gcs',
            component: resolve =>
              import('@views/aid/task/parts/AuxiliaryExam/gcs').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/task/chestPain',
            component: resolve =>
              import(
                '@views/aid/task/parts/AuxiliaryExam/chestPain'
              ).then(module => resolve(module))
          },
          {
            path: '/aid/task/killip',
            component: resolve =>
              import(
                '@views/aid/task/parts/AuxiliaryExam/killip'
              ).then(module => resolve(module))
          },
          {
            path: '/aid/task/fast',
            component: resolve =>
              import('@views/aid/task/parts/AuxiliaryExam/fast').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/task/preliminaryDiagnosis',
            component: resolve =>
              import(
                '@views/aid/task/parts/Diagnosis/preliminaryDiagnosis'
              ).then(module => resolve(module))
          },
          {
            path: '/aid/task/treatment',
            component: resolve =>
              import('@views/aid/task/parts/Diagnosis/treatment').then(module =>
                resolve(module)
              )
          },
          {
            path: '/aid/task/otherDruge',
            component: resolve =>
              import(
                '@views/aid/task/parts/Diagnosis/otherDruge'
              ).then(module => resolve(module))
          },
          {
            path: '/aid/task/diseaseCategory',
            component: resolve =>
              import(
                '@views/aid/task/parts/BasicInfo/diseaseCategory'
              ).then(module => resolve(module))
          },
          {
            path: '/aid/task/historyTemp',
            component: resolve =>
              import('@views/aid/task/parts/History/historyTemp').then(module =>
                resolve(module)
              )
          }
        ]
      },
      {
        name: 'aid-ambulances',
        path: '/aid/ambulances',
        component: resolve =>
          import('@views/aid/task/parts/Ambulances/index').then(module =>
            resolve(module)
          )
      },
      {
        path: '/aid/task/epidemiological',
        component: resolve =>
          import(
            '@views/aid/task/parts/InformedConsent/Epidemiological'
          ).then(module => resolve(module))
      },
      {
        path: '/aid/task/consents',
        component: resolve =>
          import(
            '@views/aid/task/parts/InformedConsent/Consents'
          ).then(module => resolve(module))
      },
      {
        name: 'login',
        path: '/login',
        component: resolve =>
          import('@views/tmpLogin.vue').then(module => resolve(module))
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: resolve => import('@views/404').then(module => resolve(module))
  }
]
