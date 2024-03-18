import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { useUsersStore } from "@/stores/users";
import HomeView from "@/views/HomeView.vue";

const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: Function,
) => {
  const userStore = useUsersStore();
  if (to.name !== "login" && !userStore.currentUser) {
    next({ name: "login" });
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: requireAuth,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
  ],
});

export default router;
