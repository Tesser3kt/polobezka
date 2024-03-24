<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Modal } from "bootstrap";
import type { UserInfo, ClassInfo, TeamInfo } from "@/types";
import { useUsersStore } from "@/stores/users";
import { useTeamsStore } from "@/stores/teams";
import { useActivitiesStore } from "@/stores/activities";
import { useInvitesStore } from "@/stores/invites";
import DashboardKilometres from "./DashboardKilometres.vue";
import DashboardTeam from "./DashboardTeam.vue";
import DashboardInvites from "./DashboardInvites.vue";
import ErrorModal from "./ErrorModal.vue";

const props = defineProps<{
  user?: UserInfo | null;
  class_?: ClassInfo | null;
  team?: TeamInfo | null;
}>();

const usersStore = useUsersStore();
const teamsStore = useTeamsStore();
const activitiesStore = useActivitiesStore();
const invitesStore = useInvitesStore();

const userInClass = ref(props.user?.classId !== null);
const userInTeam = ref(props.user?.teamId !== null);
const errorMessage = ref("");

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

const leaveTeam = async () => {
  if (props.user && props.team) {
    teamsStore.leaveTeam(props.user.id, props.team.id);
    userInTeam.value = false;
  }
};
const joinTeam = async (inviteId: number) => {
  const invite = invitesStore.getInviteById(inviteId);
  if (invite && props.user) {
    await teamsStore.joinTeam(props.user.id, invite.teamFrom);
    await invitesStore.deleteInvite(inviteId);
    await invitesStore.deleteInvitesToUser(props.user.id);
    userInTeam.value = true;
  }
};

const inviteUser = async (nickname: string) => {
  if (props.team && props.user) {
    // Too many invites from team
    if (
      invitesStore.getTeamInvites(props.team.id).length >=
      invitesStore.maxInvitesFromTeam
    ) {
      showErrorModal("Tým má příliš mnoho odeslaných pozvánek.");
      return;
    }

    const userTo = usersStore.getUserByNickname(nickname);
    if (!userTo) return;

    // User already in some team
    if (userTo.teamId !== null) {
      showErrorModal("Uživatel je již v týmu.");
      return;
    }

    // User was already invited
    if (invitesStore.getInviteByTeamAndUser(props.team.id, userTo.id)) {
      showErrorModal("Uživatel byl již pozván.");
      return;
    }

    // Too many invites to user
    if (
      invitesStore.getUserInvites(userTo.id).length >=
      invitesStore.maxInvitesToUser
    ) {
      showErrorModal("Uživatel dostal příliš mnoho pozvánek.");
      return;
    }
    await invitesStore.sendInvite(props.team.id, userTo.id);
  }
};
const showErrorModal = (message: string) => {
  errorMessage.value = message;
  const modal = new Modal(document.getElementById("errorModal") as Element);
  modal?.show();
};

const handleCreateTeam = async (teamName: string) => {
  if (props.user) {
    await teamsStore.createTeam(props.user.id, teamName);
    await invitesStore.deleteInvitesToUser(props.user.id);
    userInTeam.value = true;
  }
};
</script>
<template>
  <TransitionGroup tag="div" name="fade" appear>
    <Transition name="fade" key="km" appear>
      <div class="dashboard-wrapper container-fluid">
        <div class="dashboard-km-wrapper container">
          <DashboardKilometres
            :currentUserId="props.user?.id"
            :userInClass="userInClass"
            :userInTeam="userInTeam"
            :userKm="currentUserKm"
            :classKm="currentClassKm"
            :teamKm="currentTeamKm"
            :schoolKm="schoolKm"
          />
        </div>
      </div>
    </Transition>
    <div key="team" v-if="userInTeam" class="dashboard-wrapper container-fluid">
      <div class="dashboard-team-wrapper container">
        <DashboardTeam
          :user="userNickAndKm"
          :teamName="props.team?.name"
          :team="teamNicksAndKms"
          :maxTeamMembers="teamsStore.maxMembers"
          @leave-team="leaveTeam"
          @invite-user="inviteUser"
        />
      </div>
    </div>
    <div
      key="invites"
      v-if="!userInTeam"
      class="dashboard-wrapper container-fluid"
    >
      <div class="dashboard-invites-wrapper container mt-5">
        <DashboardInvites
          :invites="userInvites"
          @accept="joinTeam"
          @decline="invitesStore.deleteInvite"
          @create-team="handleCreateTeam"
        />
      </div>
    </div>
  </TransitionGroup>

  <!-- Error Modal -->
  <ErrorModal id="errorModal" :message="errorMessage" />
</template>
