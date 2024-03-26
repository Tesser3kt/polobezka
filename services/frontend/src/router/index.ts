import { inject } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";
import { useUsersStore } from "@/stores/users";
import HomeView from "@/views/HomeView.vue";
import type { VueCookies } from "vue-cookies";

const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: Function
) => {
  const userStore = useUsersStore();

  const $cookies = inject<VueCookies>("$cookies");
  if ($cookies?.get("currentUser")) {
    await userStore.loginUser(parseInt($cookies.get("currentUser")));
  }

  if (to.name !== "login" && !userStore.isLogged) {
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
    {
      path: "/records",
      name: "records",
      component: () => import("@/views/RecordsView.vue"),
      beforeEnter: requireAuth,
    },
  ],
});

export default router;
