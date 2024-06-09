<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useTeamsStore } from "@/stores/teams";
import { useClassesStore } from "@/stores/classes";
import { useMilestonesStore } from "@/stores/milestones";
import { milestonesData } from "@/types";
import { useActivitiesStore } from "@/stores/activities";
import AppHeader from "@/components/AppHeader.vue";

const usersStore = useUsersStore();
const milestonesStore = useMilestonesStore();
const classesStore = useClassesStore();
const teamsStore = useTeamsStore();
const activitiesStore = useActivitiesStore();

const router = useRouter();
const { milestones } = storeToRefs(milestonesStore);

const currentUser = ref(usersStore.currentUser);

const currentUserClass = computed(() => {
  if (!currentUser.value) return null;
  return classesStore.getClassById(currentUser.value.classId);
});
const currentUserTeam = computed(() => {
  if (!currentUser.value) return null;
  return teamsStore.getTeamById(currentUser.value.teamId);
});
const currentUserMilestones = computed(() => {
  if (!currentUser.value) return null;
  return milestones.value
    .filter((milestone) => milestone.userId === currentUser.value?.id)
    .map((milestone) => milestone.number);
});
const milestonesToShow = computed(() => {
  const totalActivitiesKm = activitiesStore.getTotalKm;
  return milestonesData.filter((milestone) => {
    return totalActivitiesKm >= milestone.km;
  });
});
const logout = async () => {
  await usersStore.logoutUser();
  router.push("/login");
};

const markCompleted = async (milestoneNumber: number) => {
  if (!currentUser.value) {
    return;
  }

  await milestonesStore.addMilestone(milestoneNumber, currentUser.value.id);
  console.log(milestones.value);
};

const markUncompleted = async (milestoneNumber: number) => {
  if (!currentUser.value) {
    return;
  }

  await milestonesStore.deleteMilestone(milestoneNumber, currentUser.value.id);
  console.log(milestones.value);
};

const fetchMilestones = async () => {
  const milestonesData = await milestonesStore.fetchMilestones();
  if (!milestonesData) {
    return;
  }

  try {
    const milestones = milestonesData.map((milestone) => {
      return {
        number: milestone.number,
        userId: milestone.user_id,
      };
    });
    await milestonesStore.setMilestones(milestones);
  } catch (e) {}
};

onMounted(async () => {
  await fetchMilestones();
});
</script>
<template>
  <header>
    <AppHeader
      :user="currentUser?.nickname"
      :class_="currentUserClass?.name"
      :team="currentUserTeam?.name"
      @logout="logout"
    />
  </header>
  <Transition name="fade" appear>
    <section class="milestones my-5">
      <div class="milestones-wrapper container-xl text-center mx-auto">
        <h2 class="text-center text-primary mb-5">Milníky</h2>
        <div class="milestones-cards container-xl">
          <div class="row gy-5">
            <div
              v-for="(milestone, index) in milestonesToShow"
              class="milestone-card-container col-12"
            >
              <div class="milestone-card card">
                <div
                  class="card-header"
                  :class="
                    currentUserMilestones?.includes(index + 1)
                      ? 'bg-success-subtle'
                      : 'bg-danger-subtle'
                  "
                >
                  <h4 class="pt-1">
                    {{ milestone.km }} km
                    <span class="fw-normal">&ndash; {{ milestone.title }}</span>
                    <i
                      v-if="currentUserMilestones?.includes(index + 1)"
                      class="bi bi-check-circle-fill text-success float-end"
                    ></i>
                    <i
                      v-else
                      class="bi bi-x-circle-fill text-danger float-end"
                    ></i>
                  </h4>
                </div>
                <div class="milestones-card-body card-body">
                  <p class="card-text">
                    {{ milestone.text }}
                  </p>
                  <div v-if="index === 0" class="alert alert-light my-0">
                    <a
                      href="https://docs.google.com/forms/d/1keVCSRBP5f16ZAStcB_0FXC4opUkEkO3YUB1O0NlSm0/edit?ts=665b8e2e"
                      >Odkaz na kvíz</a
                    >
                  </div>
                </div>
                <div class="milestones-card-footer card-footer">
                  <button
                    v-if="currentUserMilestones?.includes(index + 1)"
                    type="button"
                    class="btn btn-outline-danger"
                    @click="() => markUncompleted(index + 1)"
                  >
                    Označit za nesplněný
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn btn-outline-success"
                    @click="() => markCompleted(index + 1)"
                  >
                    Označit za splněný
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Transition>
</template>
