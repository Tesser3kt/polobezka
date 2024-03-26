<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users";

const usersStore = useUsersStore();

const props = defineProps<{
  id: string;
  teamName: string | undefined;
}>();
const emits = defineEmits(["invite-user"]);

const nicknameInput = ref("");
const inviteClicked = ref(false);

const userNicknames = computed(() => {
  return usersStore.users.map((user) => user.nickname);
});
const warningText = computed(() => {
  if (nicknameInput.value === "") {
    return "Vyplňte přezdívku.";
  }
  if (!userNicknames.value.includes(nicknameInput.value)) {
    return "Uživatel s touto přezdívkou neexistuje.";
  }
  return "";
});
const showWarning = computed(
  () => warningText.value !== "" && inviteClicked.value
);

const handleInvite = () => {
  inviteClicked.value = true;
  if (warningText.value !== "") {
    return;
  }
  emits("invite-user", nicknameInput.value);
  clearForm();
};
const clearForm = () => {
  nicknameInput.value = "";
  inviteClicked.value = false;
};
</script>
<template>
  <div
    class="modal fade"
    :id="id"
    tabIndex="-1"
    :aria-labelledby="`${id}Label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${props.id}Label`">
            Pozvat do týmu {{ teamName }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="clearForm"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleInvite">
            <div class="input-group mb-3">
              <span class="input-group-text bg-secondary text-light">
                Přezdívka
              </span>
              <input
                id="nicknameInput"
                class="form-control"
                list="nicknameList"
                placeholder="Zadejte přezdívku"
                v-model="nicknameInput"
                required
              />
              <datalist id="nicknameList">
                <option v-for="(nickname, index) in userNicknames" :key="index">
                  {{ nickname }}
                </option>
              </datalist>
            </div>
            <div v-if="showWarning" class="alert alert-danger" role="alert">
              {{ warningText }}
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-warning"
            data-bs-dismiss="modal"
            @click="clearForm"
          >
            Zrušit
          </button>
          <button type="button" class="btn btn-success" @click="handleInvite">
            Pozvat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
