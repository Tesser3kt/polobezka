<script setup lang="ts">
import { ref, computed } from "vue";
import type { UserInfo, ClassInfo, TeamInfo } from "@/types";
import { useUsersStore } from "@/stores/users";
import { useTeamsStore } from "@/stores/teams";
import { useActivitiesStore } from "@/stores/activities";
import { useInvitesStore } from "@/stores/invites";
import DashboardKilometres from "./DashboardKilometres.vue";
import DashboardTeam from "./DashboardTeam.vue";
import DashboardInvites from "./DashboardInvites.vue";
import { join } from "path";

const props = defineProps<{
  user?: UserInfo | null;
  class_?: ClassInfo | null;
  team?: TeamInfo | null;
}>();

const usersStore = useUsersStore();
const teamsStore = useTeamsStore();
const activitiesStore = useActivitiesStore();
const invitesStore = useInvitesStore();

const userInTeam = ref(props.user?.teamId !== 0);

const currentUserKm = computed(() => {
  if (!props.user) return null;
  return activitiesStore.getUserKm(props.user.id);
});
const currentClassKm = computed(() => {
  if (!props.class_) return null;
  return activitiesStore.getClassKm(props.class_.id);
});
const currentTeamKm = computed(() => {
  if (!props.team) return null;
  return activitiesStore.getTeamKm(props.team.id);
});
const schoolKm = computed(() => activitiesStore.getTotalKm);

const userNickAndKm = computed(() => {
  if (!props.user) return null;
  return { nickname: props.user.nickname, km: currentUserKm.value };
});
const teamNicksAndKms = computed(() => {
  if (!props.team) return null;

  return props.team.memberIds.map((id) => {
    const user = usersStore.getUserById(id);
    return { nickname: user?.nickname, km: activitiesStore.getUserKm(id) };
  });
});

const userInvites = computed(() => {
  if (!props.user) return [];
  const invites = invitesStore.getUserInvites(props.user.id);
  return invites.map((invite) => {
    const team = teamsStore.getTeamById(invite.teamFrom);
    return { id: invite.id, teamName: team?.name, date: invite.date };
  });
});

const leaveTeam = () => {
  if (props.user && props.team) {
    teamsStore.leaveTeam(props.user.id, props.team.id);
    userInTeam.value = false;
  }
};
const joinTeam = (inviteId: number) => {
  const invite = invitesStore.getInviteById(inviteId);
  if (invite && props.user) {
    teamsStore.joinTeam(props.user.id, invite.teamFrom);
    userInTeam.value = true;
    invitesStore.deleteInvite(inviteId);
  }
};
</script>
<template>
  <TransitionGroup name="fade" tag="div" appear>
    <Transition name="fade" appear>
      <div class="dashboard-km-wrapper w-100">
        <DashboardKilometres
          :currentUserId="props.user?.id"
          :userInTeam="userInTeam"
          :userKm="currentUserKm"
          :classKm="currentClassKm"
          :teamKm="currentTeamKm"
          :schoolKm="schoolKm"
        /></div
    ></Transition>
    <div v-if="userInTeam" class="dashboard-team-wrapper">
      <DashboardTeam
        :user="userNickAndKm"
        :teamName="props.team?.name"
        :team="teamNicksAndKms"
        @leave-team="leaveTeam"
      />
    </div>
    <div v-if="!userInTeam" class="dashboard-invites-wrapper mt-5">
      <DashboardInvites
        :invites="userInvites"
        @accept="joinTeam"
        @decline="invitesStore.deleteInvite"
      />
    </div>
  </TransitionGroup>
</template>
