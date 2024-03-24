<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users";

const props = defineProps<{
  id: string;
  showInfo: boolean;
}>();

const usersStore = useUsersStore();
const emits = defineEmits(["set-nickname", "cancel"]);

const nicknameInput = ref("");
const setClicked = ref(false);

const userNicknames = computed(() => {
  return usersStore.users.map((user) => user.nickname);
});
const warningText = computed(() => {
  const nickname = nicknameInput.value.trim();
  if (nickname === "") {
    return "Vyplňte přezdívku.";
  }
  if (userNicknames.value.includes(nickname)) {
    return "Přezdívka je již obsazena.";
  }
  if (nickname.length < usersStore.minNicknameLength) {
    return `Přezdívka musí mít alespoň ${usersStore.minNicknameLength} znaky.`;
  }
  if (nickname.length > usersStore.maxNicknameLength) {
    return `Přezdívka smí mít maximálně ${usersStore.maxNicknameLength} znaků.`;
  }
  return "";
});
const showWarning = computed(
  () => warningText.value !== "" && setClicked.value
);

const handleSet = () => {
  setClicked.value = true;
  if (warningText.value !== "") {
    return;
  }
  emits("set-nickname", nicknameInput.value.trim());
  clearForm();
};
const clearForm = () => {
  nicknameInput.value = "";
  setClicked.value = false;
};
</script>

<template>
  <div
    class="modal fade"
    :id="id"
    tabindex="-1"
    :aria-labelledby="`${id}label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${props.id}label`">
            Nastavit přezdívku
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="close"
            @click="
              () => {
                clearForm();
                emits('cancel');
              }
            "
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSet">
            <div class="mb-3">
              <input
                type="text"
                id="nicknameinput"
                class="form-control"
                placeholder="Zvolte přezdívku"
                v-model="nicknameInput"
                aria-describedby="nicknameHelp"
                required
              />
              <div v-show="showInfo" id="nicknameHelp" class="form-text">
                Bez nastavení přezdívky nelze pokračovat. Lze ji změnit později.
              </div>
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
            @click="
              () => {
                clearForm();
                emits('cancel');
              }
            "
          >
            Zrušit
          </button>
          <button type="button" class="btn btn-success" @click="handleSet">
            Nastavit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
