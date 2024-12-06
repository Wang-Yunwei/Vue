import { BasicLayout, Container } from '@/layouts'

export default [
  {
    path: '/',
    redirect: process.env.NODE_ENV === 'production' ? '/document' : '/login',
    component: BasicLayout,
    children: [
      {
        name: 'document',
        path: '/document',
        redirect: '/document/list',
        component: Container,
        children: [
          {
            name: 'documentList',
            path: '/document/list',
            component: resolve => require(['@views/document/list/index.vue'], module => { resolve(module) })
          },
          {
            name: 'documentDetail',
            path: '/document/detail',
            redirect: '/document/detail/document',
            component: () => import('@views/document/detail/index.vue'),
            children: [
              {
                name: 'documentDetailDocument',
                path: '/document/detail/document',
                component: resolve =>
                  import(
                    '@views/document/detail/document/index.vue'
                  ).then(module => resolve(module))
              },
              {
                name: 'documentDetailtimeCollection',
                path: '/document/detail/time-collection',
                component: resolve =>
                  import(
                    '@views/document/detail/time_collection/index.vue'
                  ).then(module => resolve(module))
              },
              {
                name: 'documentDetailtimeLine',
                path: '/document/detail/time-line',
                component: resolve =>
                  import(
                    '@views/document/detail/time_line/index.vue'
                  ).then(module => resolve(module))
              }
            ]
          }
        ]
      },
      {
        name: 'preHospital',
        path: '/prehospital',
        redirect: '/prehospital',
        component: Container,
        children: [
          {
            name: 'preHospitalList',
            path: '/prehospital',
            component: resolve =>
              import('@views/preHospital/index.vue').then(module =>
                resolve(module)
              )
          },
          {
            name: 'preHospitalDetails',
            path: '/prehospital/details',
            component: resolve =>
              import('@views/preHospital/details/index.vue').then(module =>
                resolve(module)
              )
          }
        ]
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
