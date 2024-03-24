<script setup lang="ts">
import { ref, computed } from "vue";
import { useTeamsStore } from "@/stores/teams";

const teamsStore = useTeamsStore();

const props = defineProps<{
  id: string;
}>();
const emits = defineEmits(["create-team"]);

const nameInput = ref("");
const createClicked = ref(false);

const teamNames = computed(() => {
  return teamsStore.teams.map((team) => team.name);
});
const warningText = computed(() => {
  const name = nameInput.value.trim();
  if (name === "") {
    return "Vyplňte jméno týmu.";
  }
  if (teamNames.value.includes(name)) {
    return "Tým s tímto jménem již existuje.";
  }
  if (name.length < teamsStore.minCharactersInName) {
    return `Jméno týmu musí mít alespoň ${teamsStore.minCharactersInName} znaky.`;
  }
  if (name.length > teamsStore.maxCharactersInName) {
    return `Jméno týmu může mít maximálně ${teamsStore.maxCharactersInName} znaků.`;
  }
  return "";
});
const showWarning = computed(
  () => warningText.value !== "" && createClicked.value
);

const handleCreate = () => {
  createClicked.value = true;
  if (warningText.value !== "") {
    return;
  }
  emits("create-team", nameInput.value.trim());
  clearForm();
};
const clearForm = () => {
  nameInput.value = "";
  createClicked.value = false;
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
          <h5 class="modal-title" :id="`${props.id}Label`">Vytvořit tým</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="clearForm"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleCreate">
            <div class="input-group mb-3">
              <span class="input-group-text bg-secondary text-light">
                Jméno týmu
              </span>
              <input
                type="text"
                id="nameInput"
                class="form-control"
                placeholder="Zadejte jméno týmu"
                v-model="nameInput"
                required
              />
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
          <button type="button" class="btn btn-success" @click="handleCreate">
            Vytvořit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
