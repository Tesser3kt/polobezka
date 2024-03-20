<script setup lang="ts">
import { computed } from "vue";
import { Modal } from "bootstrap";
import CreateTeamModal from "./CreateTeamModal.vue";

const props = defineProps<{
  invites: { id: number; teamName?: string; date: Date }[];
}>();
const emits = defineEmits(["create-team", "accept", "decline"]);

const maxInvitesShown = 3;

const sortedInvites = computed(() =>
  props.invites
    .filter((invite) => invite.teamName !== undefined)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxInvitesShown),
);

const inviteDate = (date: Date) => {
  const { day, month, hour, minute } = {
    day: date.getDate(),
    month: date.getMonth() + 1,
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
  return `${day}. ${month}., ${hour}:${minute}`;
};
const handleCreateTeam = (name: string) => {
  const createModal = Modal.getInstance(
    document.getElementById("createTeamModal") as Element,
  );
  createModal?.hide();
  emits("create-team", name);
};
</script>
<template>
  <div class="container-fluid">
    <Transition name="fade">
      <div
        key="no-invites"
        v-show="sortedInvites.length === 0"
        class="text-center"
      >
        <p class="mb-0 fs-5 d-inline-flex align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            class="me-2"
          >
            <path
              d="M175.9 448c-35-.1-65.5-22.6-76-54.6C67.6 356.8 48 308.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208s-93.1 208-208 208c-28.4 0-55.5-5.7-80.1-16zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM128 369c0 26 21.5 47 48 47s48-21 48-47c0-20-28.4-60.4-41.6-77.7c-3.2-4.4-9.6-4.4-12.8 0C156.6 308.6 128 349 128 369zm128-65c-13.3 0-24 10.7-24 24s10.7 24 24 24c30.7 0 58.7 11.5 80 30.6c9.9 8.8 25 8 33.9-1.9s8-25-1.9-33.9C338.3 320.2 299 304 256 304zm47.6-96a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm-128 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
            />
          </svg>
          Nemáte žádné pozvánky.
        </p>
      </div>
    </Transition>
    <TransitionGroup
      name="invite-list"
      tag="ul"
      class="invites-container list-unstyled mb-0 mx-auto"
    >
      <li
        v-for="invite in sortedInvites"
        :key="invite.id"
        class="mt-3 invite-card-container"
      >
        <div class="card invite-card">
          <div
            class="card-body d-inline-flex justify-content-between align-items-center bg-body-tertiary"
          >
            <div class="card-text mb-0">
              <p class="card-text mb-0">
                Pozvánka od týmu
                <span class="d-none d-sm-inline-block fw-bold">
                  {{ invite.teamName }}<span class="fw-normal">.</span>
                </span>
                <span class="d-block d-sm-none fw-bold">
                  {{ invite.teamName }}<span class="fw-normal">.</span>
                </span>
              </p>
              <p class="card-text-small mb-0 fw-light fst-italic">
                {{ inviteDate(invite.date) }}
              </p>
            </div>
            <div class="d-inline-flex ms-4">
              <button
                class="btn btn-success invite-button"
                @click="$emit('accept', invite.id)"
              >
                <i class="bi bi-check"></i>
              </button>
              <button
                class="btn btn-danger invite-button ms-1"
                @click="$emit('decline', invite.id)"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </li>
      <div key="create-team-button" class="container mt-2 text-center">
        <button
          class="btn btn-success fs-5 mt-3"
          data-bs-toggle="modal"
          data-bs-target="#createTeamModal"
        >
          <i class="bi bi-people"></i>
          Vytvořit tým
        </button>
      </div>
    </TransitionGroup>
  </div>

  <!-- Create Team Modal-->
  <CreateTeamModal id="createTeamModal" @create-team="handleCreateTeam" />
</template>
