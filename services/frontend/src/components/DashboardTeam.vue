<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Modal } from "bootstrap";
import YesNoModal from "./YesNoModal.vue";
import InviteModal from "./InviteModal.vue";

const props = defineProps<{
  user: { nickname: string; km: number | null } | null;
  teamName: string | undefined;
  team: { nickname: string | undefined; km: number }[] | null;
  maxTeamMembers: number;
}>();
const emits = defineEmits(["leave-team", "invite-user"]);

const prevUserKm = ref(0);

const teamFull = computed(() => {
  return props.team?.length === props.maxTeamMembers;
});

const leaveTeamSignal = (): void => {
  const leaveTeamModal = Modal.getInstance(
    document.getElementById("leaveTeamModal") as Element
  );
  leaveTeamModal?.hide();
  emits("leave-team");
};
const inviteUserSignal = (nickname: string): void => {
  const inviteModal = Modal.getInstance(
    document.getElementById("inviteModal") as Element
  );
  inviteModal?.hide();
  emits("invite-user", nickname);
};

watch(
  () => props.user?.km,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      prevUserKm.value = oldVal || 0;
    }
  }
);
</script>
<template>
  <div class="dashboard-card card mt-5">
    <div class="card-header bg-success py-3">
      <h3 class="card-title text-light text-center m-0 fs-3">
        Tým: {{ props.teamName }}
      </h3>
    </div>
    <div class="card-body">
      <div class="container-fluid py-2">
        <div class="row row-gap-4">
          <div
            v-for="member in props.team"
            :key="member.nickname"
            class="member-header col-12 col-sm-6 px-sm-3 col-md-4 px-md-2 col-lg-3 px-lg-2 px-xl-4 px-xxl-5"
          >
            <div class="card">
              <div
                class="card-header m-0 py-2"
                :class="
                  props.user?.nickname === member.nickname
                    ? 'bg-primary'
                    : 'bg-body-secondary'
                "
              >
                <h5
                  class="card-title my-0 text-start"
                  :class="
                    props.user?.nickname === member.nickname && 'text-light'
                  "
                >
                  {{ member.nickname }}
                </h5>
              </div>
              <div class="card-body">
                <p class="km-text fs-3 text-center m-0">
                  <AnimatedNumber
                    :from="
                      props.user?.nickname === member.nickname ? prevUserKm : 0
                    "
                    :to="member.km"
                    :decimal-digits="0"
                    :duration="700"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer text-center text-sm-start">
      <div
        class="d-none d-sm-block btn-group"
        role="group"
        aria="Team button group"
      >
        <button
          v-if="!teamFull"
          class="btn btn-primary fs-5"
          data-bs-toggle="modal"
          data-bs-target="#inviteModal"
        >
          <i class="bi bi-person-plus"></i> Pozvat do týmu
        </button>
        <button v-else class="btn btn-secondary fs-5" disabled>
          <i class="bi bi-person-slash"></i> Tým je plný
        </button>
        <button
          class="btn btn-danger fs-5"
          data-bs-toggle="modal"
          data-bs-target="#leaveTeamModal"
        >
          <i class="bi bi-trash"></i> Odejít z týmu
        </button>
      </div>
      <div
        class="d-sm-none btn-group-vertical"
        role="group"
        aria="Team button group"
      >
        <button
          v-if="!teamFull"
          class="btn btn-primary fs-5 py-2"
          data-bs-toggle="modal"
          data-bs-target="#inviteModal"
        >
          <i class="bi bi-person-plus"></i> Pozvat do týmu
        </button>
        <button v-else class="btn btn-secondary fs-5 py-2" disabled>
          <i class="bi bi-person-slash"></i> Tým je plný
        </button>
        <button
          class="btn btn-danger fs-5 py-2"
          data-bs-toggle="modal"
          data-bs-target="#leaveTeamModal"
        >
          <i class="bi bi-trash"></i> Opustit tým
        </button>
      </div>
    </div>
  </div>

  <!-- Leave Team Modal -->
  <YesNoModal
    id="leaveTeamModal"
    title="Opustit tým"
    :message="`Opravdu chcete tým ${props?.teamName} opustit?`"
    @yes="leaveTeamSignal"
  />

  <!-- Invite Modal -->
  <InviteModal
    id="inviteModal"
    :teamName="props.teamName"
    @invite-user="inviteUserSignal"
  />
</template>
