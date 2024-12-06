import BasicLayout from "@/layouts/BasicLayout";

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export default [
  {
    path: "/",
    name: "index",
    component: BasicLayout,
    meta: { title: "首页" },
    redirect: "/patients",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "仪表盘" },
      },
      {
        path: "/patients",
        name: "Patients",
        component: () => import("@/views/patients/index"),
        meta: { title: "患者列表" },
      },
      {
        name: "Task",
        path: "/task",
        redirect: "/task/list",
        component: RouteView,
        meta: { title: "任务" },
        children: [
          {
            path: "/task/list",
            name: "TaskList",
            component: () => import("@/views/task/list/index"),
            meta: { title: "任务列表" },
          },
          {
            path: "/task/detail",
            name: "TaskDetail",
            component: () => import("@/views/task/detail/index"),
            meta: { title: "任务详情" },
          },
        ],
      },
      {
        name: "Dispatching",
        path: "/dispatching",
        component: () => import("@/views/dispatching/index"),
        meta: { hideTitle: true },
      },
    ],
  },
  {
    path: '/404',
    name: "404",
    component: () => import("@/views/errorPage/404"),
    meta: { title: "页面不存在" },
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];
