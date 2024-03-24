<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ActivityModal from "./ActivityModal.vue";

const props = defineProps<{
  currentUserId: number | undefined;
  userInTeam: boolean;
  userInClass: boolean;
  userKm?: number | null;
  classKm?: number | null;
  teamKm?: number | null;
  schoolKm?: number | null;
}>();

const prevUserKm = ref(0);
const prevClassKm = ref(0);
const prevTeamKm = ref(0);
const prevSchoolKm = ref(0);

watch(
  () => props.userKm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      prevUserKm.value = oldVal || 0;
    }
  }
);
watch(
  () => props.classKm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      prevClassKm.value = oldVal || 0;
    }
  }
);
watch(
  () => props.teamKm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      prevTeamKm.value = oldVal || 0;
    }
  }
);
watch(
  () => props.schoolKm,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      prevSchoolKm.value = oldVal || 0;
    }
  }
);

const colNumber = computed(() => {
  if (props.userInTeam && props.userInClass) return 4;
  if (props.userInTeam || props.userInClass) return 3;
  return 2;
});
</script>
<template>
  <div class="dashboard-card card">
    <div class="card-header bg-primary py-3">
      <h3 class="card-title text-light text-center m-0 fs-3">Ušlé kilometry</h3>
    </div>
    <div class="card-body">
      <div class="container-fluid py-2">
        <div
          class="row row-cols-2 row-gap-4"
          :class="`row-cols-sm-${colNumber}`"
        >
          <div class="col d-flex flex-column justify-content-center">
            <h4 class="fs-3 text-center text-primary">Já</h4>
            <p class="km-text fs-2 text-center m-0">
              <AnimatedNumber
                :from="prevUserKm"
                :to="userKm"
                :decimal-digits="0"
                :duration="700"
              />
            </p>
          </div>
          <div
            v-if="userInTeam"
            class="col d-flex flex-column justify-content-center"
          >
            <h4 class="fs-3 text-center text-success">Tým</h4>
            <p class="km-text fs-2 text-center m-0">
              <AnimatedNumber
                :from="prevTeamKm"
                :to="teamKm"
                :decimal-digits="0"
                :duration="700"
              />
            </p>
          </div>
          <div
            v-if="userInClass"
            class="col d-flex flex-column justify-content-center"
          >
            <h4 class="fs-3 text-center text-warning-emphasis">Třída</h4>
            <p class="km-text fs-2 text-center m-0">
              <AnimatedNumber
                :from="prevClassKm"
                :to="classKm"
                :decimal-digits="0"
                :duration="700"
              />
            </p>
          </div>
          <div class="col d-flex flex-column justify-content-center">
            <h4 class="fs-3 text-center text-danger">Škola</h4>
            <p class="km-text fs-2 text-center m-0">
              <AnimatedNumber
                :from="prevSchoolKm"
                :to="schoolKm"
                :decimal-digits="0"
                :duration="700"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer text-center text-sm-start">
      <button
        type="button"
        class="btn btn-primary fs-5"
        data-bs-toggle="modal"
        data-bs-target="#activityModal"
      >
        <i class="bi bi-plus-circle"></i> Činnost
      </button>
    </div>
  </div>

  <!-- Activity Modal -->
  <ActivityModal id="activityModal" :userId="props.currentUserId" />
</template>
