<script setup lang="ts">
import { ref, computed } from "vue";
import { Modal } from "bootstrap";
import { Activity, activityUnits } from "@/types";
import { useActivitiesStore } from "@/stores/activities";

const activitiesStore = useActivitiesStore();

const props = defineProps<{
  id: string;
  userId: number | undefined;
}>();

const activityInput = ref("");
const showUnitsInput = ref(false);
const unitsInput = ref("");
const calorieInput = ref("");
const saveClicked = ref(false);

const warningText = computed(() => {
  if (calorieInput.value !== "" && unitsInput.value !== "") {
    return "Vyplňte pouze jedno pole.";
  }
  if (
    calorieInput.value === "" &&
    (unitsInput.value === "" || !correctActivity.value)
  ) {
    return "Vyplňte alespoň jedno pole.";
  }
  if (calorieInput.value !== "" && parseInt(calorieInput.value) <= 0) {
    return "Počet spálených kalorií musí být kladné číslo.";
  }
  if (unitsInput.value !== "" && parseInt(unitsInput.value) <= 0) {
    return "Počet jednotek musí být kladné číslo.";
  }
  return "";
});
const showWarning = computed(
  () => warningText.value !== "" && saveClicked.value
);

const correctActivity = computed(() => {
  return Object.values(Activity).includes(activityInput.value as Activity);
});
const currentActivityUnits = computed(() => {
  if (correctActivity.value)
    return activityUnits[activityInput.value as Activity];
  return null;
});

const handleSave = async () => {
  saveClicked.value = true;
  if (warningText.value !== "") {
    return;
  }

  if (calorieInput.value !== "") {
    const calories = parseInt(calorieInput.value);
    if (calories > 0) {
      await activitiesStore.addActivity(props.userId, calories);
    } else {
      return;
    }
  } else {
    const units = parseInt(unitsInput.value);
    if (units > 0) {
      await activitiesStore.addActivity(
        props.userId,
        units,
        activityInput.value as Activity
      );
    }
  }

  clearForm();
  hideModal();
};
const clearForm = () => {
  setTimeout(() => {
    activityInput.value = "";
    showUnitsInput.value = false;
    unitsInput.value = "";
    calorieInput.value = "";
    saveClicked.value = false;
  }, 500);
};
const hideModal = () => {
  const modal = Modal.getInstance(document.getElementById(props.id) as Element);
  modal?.hide();
};
</script>
<template>
  <div
    class="modal fade"
    :id="id"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabIndex="-1"
    :aria-labelledby="`${id}Label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${id}Label`">Nová činnost</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="clearForm"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <div class="input-group mb-3">
              <span class="input-group-text bg-secondary text-light"
                >Činnost</span
              >
              <input
                class="form-control"
                list="activityTypes"
                id="activityInput"
                placeholder="Vyberte činnost"
                v-model="activityInput"
                @input="showUnitsInput = correctActivity"
                :disabled="calorieInput !== ''"
              />
              <datalist id="activityTypes">
                <option v-for="type_ in Activity" :key="type_">
                  {{ type_ }}
                </option>
              </datalist>
              <input
                v-if="showUnitsInput"
                type="number"
                class="form-control d-none d-sm-block"
                placeholder="Počet"
                aria-label="Počet"
                aria-describedby="basic-addon2"
                v-model="unitsInput"
                :disabled="calorieInput !== ''"
              />
              <span
                v-if="showUnitsInput"
                class="input-group-text d-none d-sm-block"
                id="basic-addon2"
              >
                {{ currentActivityUnits }}
              </span>
            </div>
            <div v-if="showUnitsInput" class="input-group mb-3 d-sm-none">
              <input
                type="number"
                class="form-control"
                placeholder="Počet"
                aria-label="Počet"
                aria-describedby="basic-addon2"
                v-model="unitsInput"
                :disabled="calorieInput !== ''"
              />
              <span
                v-if="showUnitsInput"
                class="input-group-text"
                id="basic-addon2"
              >
                {{ currentActivityUnits }}
              </span>
            </div>
            <div class="mb-3 text-center">
              <span>nebo</span>
            </div>
            <div class="input-group" :class="showWarning && 'mb-3'">
              <span class="input-group-text bg-secondary text-light"
                >Kalorie</span
              >
              <input
                type="number"
                class="form-control"
                placeholder="Počet spálených kcal"
                aria-label="Počet"
                aria-describedby="basic-addon3"
                v-model="calorieInput"
                :disabled="unitsInput !== '' || correctActivity"
              />
              <span class="input-group-text" id="basic-addon3">kcal</span>
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
            Zavřít
          </button>
          <button type="button" class="btn btn-success" @click="handleSave">
            Uložit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
