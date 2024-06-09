<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import logoUrl from "@/assets/imgs/logo.png";
import { Modal } from "bootstrap";
import NicknameModal from "./NicknameModal.vue";
import ErrorModal from "./ErrorModal.vue";
import { useUsersStore } from "@/stores/users";

const props = defineProps<{
  user: string | null | undefined;
  class_?: string;
  team?: string;
}>();

const route = useRoute();

const usersStore = useUsersStore();

const emits = defineEmits(["logout"]);

const userNick = ref(props.user);
const errorMessage = ref("");
const showErrorModal = (message: string) => {
  errorMessage.value = message;
  const modal = new Modal(
    document.getElementById("headerErrorModal") as Element
  );
  modal?.show();
};
const nicknameSet = async (nickname: string) => {
  const responseData = await usersStore.setNickname(nickname);
  if (!responseData) {
    showErrorModal("Nastavení přezdívky selhalo.");
    return;
  }
  if (responseData?.error) {
    showErrorModal(responseData.error);
    return;
  }

  const modal = Modal.getInstance(
    document.getElementById("headerNicknameModal") as Element
  );
  modal?.hide();
  errorMessage.value = "";
  userNick.value = nickname;
};

watch(
  () => props.user,
  () => {
    userNick.value = props.user;
  }
);
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid px-3 px-sm-4">
      <a href="#" class="navbar-brand d-inline-flex align-items-center fs-4">
        <img
          :src="logoUrl"
          alt="logo"
          width="60"
          height="42"
          class="d-inline-block align-text-top d-none d-md-block"
        />
        Poloběžka
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :to="{ name: 'home' }"
              class="nav-link"
              :class="{ active: route.name === 'home' }"
              >Domů</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'records' }"
              class="nav-link"
              :class="{ active: route.name === 'records' }"
              >Záznamy</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="{ name: 'milestones' }"
              class="nav-link"
              :class="{ active: route.name === 'milestones' }"
              >Milníky</router-link
            >
          </li>
        </ul>
        <div v-if="userNick" class="user-data d-inline-flex align-items-center">
          <p className="mb-0 d-inline-flex align-items-center">
            <span class="d-none d-md-block fs-5" v-if="props.class_">{{
              props.class_
            }}</span>
            <i
              v-if="props.class_"
              class="bi bi-dot text-body-tertiary fs-3 mt-1 d-none d-md-block"
            ></i>
            <span class="d-none d-md-block fs-5" v-if="props.team">{{
              props.team
            }}</span>
            <i
              v-if="props.team"
              class="bi bi-dot text-body-tertiary fs-4 mt-1 d-none d-md-block"
            ></i>
            <span class="fs-5">{{ userNick }}</span>
          </p>
          <button
            type="button"
            class="btn btn-outline-primary ms-sm-4 ms-2"
            data-bs-toggle="modal"
            data-bs-target="#headerNicknameModal"
          >
            <i class="bi bi-pencil-square"></i>
            <span class="d-none d-sm-inline-block ms-2">Změnit nick</span>
          </button>
          <button
            class="btn btn-outline-danger ms-sm-2 ms-2"
            @click="$emit('logout')"
          >
            <i class="bi bi-box-arrow-in-right logout-icon"></i>
            <span class="d-none d-sm-inline-block ms-2">Odhlásit</span>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Nickname Modal -->
  <NicknameModal
    id="headerNicknameModal"
    :show-info="false"
    @set-nickname="nicknameSet"
  />

  <!-- Error Modal -->
  <ErrorModal id="headerErrorModal" :message="errorMessage" />
</template>
