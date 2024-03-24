<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "./stores/users";
import { useClassesStore } from "./stores/classes";
import { useTeamsStore } from "./stores/teams";
import { useActivitiesStore } from "./stores/activities";
import { useInvitesStore } from "./stores/invites";
import type {
  UserInfo,
  ClassInfo,
  TeamInfo,
  ActivityInfo,
  InviteInfo,
  Activity,
} from "./types";

const usersStore = useUsersStore();
const classesStore = useClassesStore();
const teamsStore = useTeamsStore();
const activitiesStore = useActivitiesStore();
const invitesStore = useInvitesStore();

const loading = ref(true);
const error = ref(false);
const errorMessage = ref("");

const fetchUsers = async () => {
  const usersData = await usersStore.fetchUsers();
  if (!usersData) {
    error.value = true;
    errorMessage.value = "Načtení uživatelů selhalo.";
    return;
  }

  try {
    const users = usersData.map((user) => {
      return {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        classId: user.class_id,
        teamId: user.team_id,
      };
    }) as UserInfo[];
    await usersStore.setUsers(users);
  } catch (e) {
    error.value = true;
    errorMessage.value = "Načtení uživatele selhalo.";
  }
};

const fetchClasses = async () => {
  const classesData = await classesStore.fetchClasses();
  if (!classesData) {
    error.value = true;
    errorMessage.value = "Načtení tříd selhalo.";
    return;
  }

  try {
    const classes = classesData.map((class_) => {
      return {
        id: class_.id,
        name: class_.name,
        studentsIds: usersStore
          .getUsersByClassId(class_.id)
          .map((user) => user.id),
      };
    }) as ClassInfo[];
    await classesStore.setClasses(classes);
  } catch (e) {
    error.value = true;
    errorMessage.value = "Načtení tříd selhalo.";
  }
};

const fetchTeams = async () => {
  const teamsData = await teamsStore.fetchTeams();
  if (!teamsData) {
    error.value = true;
    errorMessage.value = "Načtení týmů selhalo.";
    return;
  }

  try {
    const teams = teamsData.map((team) => {
      return {
        id: team.id,
        name: team.name,
        memberIds: usersStore.getUsersByTeamId(team.id).map((user) => user.id),
      };
    }) as TeamInfo[];
    await teamsStore.setTeams(teams);
  } catch (e) {
    error.value = true;
    errorMessage.value = "Načtení týmů selhalo.";
  }
};

const fetchActivities = async () => {
  const activitiesData = await activitiesStore.fetchActivities();
  if (!activitiesData) {
    error.value = true;
    errorMessage.value = "Načtení aktivit selhalo.";
    return;
  }

  try {
    const activities = activitiesData.map((activity) => {
      return {
        id: activity.id,
        type: activity.type as Activity,
        unitCount: activity.unit_count,
        userId: activity.user_id,
        date: new Date(activity.date),
      };
    }) as ActivityInfo[];
    await activitiesStore.setActivities(activities);
  } catch (e) {
    error.value = true;
    errorMessage.value = "Načtení aktivit selhalo.";
  }
};

const fetchInvites = async () => {
  const invitesData = await invitesStore.fetchInvites();
  if (!invitesData) {
    error.value = true;
    errorMessage.value = "Načtení pozvánek selhalo.";
    return;
  }

  try {
    const invites = invitesData.map((invite) => {
      return {
        id: invite.id,
        teamFrom: invite.team_from_id,
        userTo: invite.user_to_id,
        date: new Date(invite.date),
      };
    }) as InviteInfo[];
    await invitesStore.setInvites(invites);
  } catch (e) {
    error.value = true;
    errorMessage.value = "Načtení pozvánek selhalo.";
  }
};

const fetchData = async () => {
  await fetchUsers();
  await fetchClasses();
  await fetchTeams();
  await fetchActivities();
  await fetchInvites();
  usersStore.resetCurrentUser();
  loading.value = false;
};

onMounted(async () => {
  await fetchData();
});
</script>
<template>
  <div
    v-if="error || loading"
    class="container min-vh-100 d-flex align-items-center justify-content-center"
  >
    <div v-show="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-diamond"></i> {{ errorMessage }}
    </div>
    <div v-show="loading" class="bg-body-secondary rounded-3 p-4">
      <div class="spinner-border text-primary">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <router-view v-else />
</template>
