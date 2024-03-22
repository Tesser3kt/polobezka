<script setup lang="ts">
import { ref } from "vue";
import { decodeCredential } from "vue3-google-login";
import { useActivitiesStore } from "@/stores/activities";
import { useUsersStore } from "@/stores/users";

const activitiesStore = useActivitiesStore();
const usersStore = useUsersStore();

const showError = ref(false);
const errorMessage = ref("");

const callback = (response) => {
  const userData = decodeCredential(response.credential);
};
</script>
<template>
  <div class="min-vh-100">
    <div
      class="min-vh-100 d-flex flex-column align-items-center justify-content-center"
    >
      <h1 class="text-primary-emphasis mb-4">Poloběžka</h1>
      <p class="d-inline-flex align-items-center fs-4 mb-5">
        Ušli jsme
        <AnimatedNumber
          :from="0"
          :to="activitiesStore.getTotalKm"
          :decimal-digits="0"
          :duration="700"
          class="fs-3 text-white badge bg-primary rounded-pill mx-2"
        />
        jarních kilometrů.
      </p>
      <GoogleLogin :callback="callback" prompt auto-login />
    </div>
  </div>
</template>
