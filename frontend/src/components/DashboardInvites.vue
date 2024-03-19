<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  invites: { id: number; teamName?: string; date: Date }[];
}>();

const maxInvitesShown = 3;
const sortedInvites = computed(() =>
  props.invites
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxInvitesShown)
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
</script>
<template>
  <div class="container-fluid">
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
    </TransitionGroup>
  </div>
</template>
