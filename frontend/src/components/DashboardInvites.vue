<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  invites: { id: number; teamName?: string; date: Date }[];
}>();

const sortedInvites = computed(() =>
  props.invites.sort((a, b) => b.date.getTime() - a.date.getTime())
);
</script>
<template>
  <div class="container-fluid">
    <div class="invites-container row row-cols-1 row-gap-4">
      <div v-for="invite in invites" :key="invite.id" class="col">
        <div class="card invite-card mx-auto">
          <div
            class="card-body d-inline-flex justify-content-between align-items-center bg-body-secondary"
          >
            <p class="card-text mb-0">
              Pozvánka od týmu {{ invite.teamName }}.
            </p>
            <div class="d-inline-flex ms-4">
              <button class="btn btn-success invite-button">
                <i class="bi bi-check"></i>
              </button>
              <button class="btn btn-danger invite-button ms-1">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
