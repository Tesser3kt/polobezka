<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import { useClassesStore } from "@/stores/classes";
import { useTeamsStore } from "@/stores/teams";
import AppHeader from "@/components/AppHeader.vue";
import AppDashboard from "@/components/AppDashboard.vue";

const usersStore = useUsersStore();
const classesStore = useClassesStore();
const teamsStore = useTeamsStore();

const currentUser = ref(usersStore.currentUser);

const currentUserClass = computed(() => {
  if (!currentUser.value) return null;
  return classesStore.getClassById(currentUser.value.classId);
});
const currentUserTeam = computed(() => {
  if (!currentUser.value) return null;
  return teamsStore.getTeamById(currentUser.value.teamId);
});
</script>

<template>
  <header>
    <AppHeader
      :user="currentUser?.nickname"
      :class_="currentUserClass?.name"
      :team="currentUserTeam?.name"
    />
  </header>
  <section class="kilometres mt-5">
    <div class="container">
      <AppDashboard
        :user="currentUser"
        :class_="currentUserClass"
        :team="currentUserTeam"
      />
    </div>
  </section>
</template>
