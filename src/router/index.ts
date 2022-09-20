import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AllView from "@/views/AllView.vue";
import ActiveView from "@/views/ActiveView.vue";
import CompletedView from "@/views/CompletedView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "all",
    component: AllView,
  },
  {
    path: "/active",
    name: "active",
    component: ActiveView,
  },
  {
    path: "/completed",
    name: "completed",
    component: CompletedView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
