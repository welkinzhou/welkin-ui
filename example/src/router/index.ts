import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("@/layout/catalogue.vue"),
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        children: [],
      },
    ],
  },

  {
    path: "/article",
    component: () => import("@/views/articles/index.vue"),
    children: [],
  },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});
