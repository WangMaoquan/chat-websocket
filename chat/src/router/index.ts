import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import("@/views/login/index.vue"),
  },
  {
    name: 'Chat',
    path: '/',
    component: () => import("@/views/chat/index.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router;