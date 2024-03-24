<script setup lang="ts">
import { ref, computed } from "vue";
import { useUsersStore } from "@/stores/users";

const props = defineProps<{
  id: string;
}>();

const usersStore = useUsersStore();
const emits = defineEmits(["set-nickname", "cancel"]);

const nicknameInput = ref("");
const setClicked = ref(false);

const userNicknames = computed(() => {
  return usersStore.users.map((user) => user.nickname);
});
const warningText = computed(() => {
  if (nicknameInput.value === "") {
    return "Vyplňte přezdívku.";
  }
  if (userNicknames.value.includes(nicknameInput.value)) {
    return "Přezdívka je již obsazena.";
  }
  if (nicknameInput.value.length < usersStore.minNicknameLength) {
    return `Přezdívka musí mít alespoň ${usersStore.minNicknameLength} znaky.`;
  }
  if (nicknameInput.value.length > usersStore.maxNicknameLength) {
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
  emits("set-nickname", nicknameInput.value);
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
              <div id="nicknameHelp" class="form-text">
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
