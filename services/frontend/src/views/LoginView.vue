<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { decodeCredential } from "vue3-google-login";
import { Modal } from "bootstrap";
import type { UserInfo } from "@/types";
import { useActivitiesStore } from "@/stores/activities";
import { useUsersStore } from "@/stores/users";
import NicknameModal from "@/components/NicknameModal.vue";

const activitiesStore = useActivitiesStore();
const usersStore = useUsersStore();

const showError = ref(false);
const errorMessage = ref("");

const nicknameCancel = () => {
  showError.value = true;
  errorMessage.value = "Je nutné vyplnit přezdívku.";
};

const nicknameSet = async (nickname: string) => {
  const responseData = await usersStore.setNickname(nickname);
  if (!responseData) {
    showError.value = true;
    errorMessage.value = "Nastavení přezdívky selhalo.";
    return;
  }
  if (responseData?.error) {
    showError.value = true;
    errorMessage.value = responseData.error;
    return;
  }

  const modal = Modal.getInstance(
    document.getElementById("nicknameModal") as Element
  );
  modal?.hide();

  showError.value = false;
  errorMessage.value = "";
  await usersStore.loginUser(usersStore.currentUser?.id);
  router.push("/");
};

const callback = async (response) => {
  const userData = decodeCredential(response.credential);
  if (!userData) {
    showError.value = true;
    errorMessage.value = "Přihlášení selhalo.";
    return;
  }

  const responseData = await usersStore.getUserByEmail(userData.email);
  if (!responseData) {
    showError.value = true;
    errorMessage.value = "Uživatel nenalezen.";
    return;
  }

  await usersStore.loginUser(responseData.id);
  if (!usersStore.currentUser) {
    showError.value = true;
    errorMessage.value = "Přihlášení selhalo.";
    return;
  }

  if (!usersStore.currentUser.nickname) {
    const modal = new Modal(
      document.getElementById("nicknameModal") as Element
    );
    modal?.show();
    return;
  }

  showError.value = false;
  errorMessage.value = "";
  router.push("/");
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
      <div v-show="showError" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-diamond"></i> {{ errorMessage }}
      </div>
      <GoogleLogin :callback="callback" prompt auto-login />
    </div>
  </div>

  <!-- Nickname Modal -->
  <NicknameModal
    id="nicknameModal"
    @set-nickname="nicknameSet"
    @cancel="nicknameCancel"
  />
</template>
