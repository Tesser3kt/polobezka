<script setup lang="ts">
import { ref, computed } from "vue";
import router from "@/router";
import { useUsersStore } from "@/stores/users";
import { useClassesStore } from "@/stores/classes";
import { useTeamsStore } from "@/stores/teams";
import AppHeader from "@/components/AppHeader.vue";
import AppDashboard from "@/components/AppDashboard.vue";

const usersStore = useUsersStore();
const classesStore = useClassesStore();
const teamsStore = useTeamsStore();

const currentUserClass = computed(() => {
  if (!usersStore.currentUser) return null;
  return classesStore.getClassById(usersStore.currentUser.classId);
});
const currentUserTeam = computed(() => {
  if (!usersStore.currentUser) return null;
  return teamsStore.getTeamById(usersStore.currentUser.teamId);
});

const logout = async () => {
  await usersStore.logoutUser();
  router.push("/login");
};
</script>

<template>
  <header>
    <AppHeader
      :user="usersStore.currentUser?.nickname"
      :class_="usersStore.currentUserClass?.name"
      :team="usersStore.currentUserTeam?.name"
      @logout="logout"
    />
  </header>
  <section class="kilometres mt-5">
    <AppDashboard
      :user="usersStore.currentUser"
      :class_="currentUserClass"
      :team="currentUserTeam"
    />
  </section>
</template>
