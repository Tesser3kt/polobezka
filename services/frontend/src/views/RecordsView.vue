<script setup lang="ts">
import { ref, computed } from "vue";
import router from "@/router";
import { useUsersStore } from "@/stores/users";
import { useClassesStore } from "@/stores/classes";
import { useTeamsStore } from "@/stores/teams";
import { useActivitiesStore } from "@/stores/activities";
import { activityUnits } from "@/types";
import AppHeader from "@/components/AppHeader.vue";

const usersStore = useUsersStore();
const classesStore = useClassesStore();
const teamsStore = useTeamsStore();
const activitiesStore = useActivitiesStore();

const currentUser = ref(usersStore.currentUser);

const currentUserClass = computed(() => {
  if (!currentUser.value) return null;
  return classesStore.getClassById(currentUser.value.classId);
});
const currentUserTeam = computed(() => {
  if (!currentUser.value) return null;
  return teamsStore.getTeamById(currentUser.value.teamId);
});
const currentUserActivities = computed(() => {
  if (!currentUser.value) return null;
  return activitiesStore.getUserActivities(currentUser.value.id);
});
const userActivitiesByWeek = computed(() => {
  if (!currentUserActivities.value) return null;
  // Sort activities by date,
  const sortedActivities = currentUserActivities.value.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Group activities by week
  const now = new Date();
  const start = new Date(2024, 2, 21);
  let weeks = [];
  for (let w = start; w <= now; w.setDate(w.getDate() + 7)) {
    weeks.push({
      start: new Date(w),
      end: new Date(w.getFullYear(), w.getMonth(), w.getDate() + 6),
      activities: sortedActivities.filter(
        (a) =>
          a.date.getTime() >= w.getTime() &&
          a.date.getTime() <=
            new Date(w.getFullYear(), w.getMonth(), w.getDate() + 6).getTime()
      ),
    });
  }

  // Show only non-empty weeks
  return weeks.filter((week) => week.activities.length > 0).reverse();
});

const logout = async () => {
  await usersStore.logoutUser();
  router.push("/login");
};
const dateToDayMonth = (date: Date) => {
  return `${date.getDate()}. ${date.getMonth() + 1}.`;
};
const recordDate = (date: Date) => {
  const { day, month, hour, minute } = {
    day: date.getDate(),
    month: date.getMonth() + 1,
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
  return `${day}. ${month}., ${hour}:${minute.toString().padStart(2, "0")}`;
};
const deleteRecord = async (id: number) => {
  await activitiesStore.deleteActivity(id);
};
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
    <section class="records mt-5">
      <div class="records-wrapper container text-center">
        <h2 class="text-center text-primary mb-4">Záznamy činností</h2>
        <div
          v-if="!currentUserActivities || currentUserActivities?.length === 0"
          class="text-center"
        >
          <p
            class="alert alert-info mb-0 fs-5 d-inline-flex align-items-center"
          >
            <i class="bi bi-ban me-2"></i>
            Žádné záznamy
          </p>
        </div>
        <div v-else class="text-center accordion" id="recordsAccordion">
          <template v-for="(week, index) in userActivitiesByWeek">
            <div
              v-if="week.activities.length > 0"
              :key="dateToDayMonth(week.start)"
              class="accordion-item"
            >
              <h2 class="accordion-header">
                <button
                  class="accordion-button fs-4"
                  :class="index !== 0 ? 'collapsed' : ''"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#week${index}`"
                  aria-expanded="true"
                  :aria-controls="`week${index}`"
                >
                  {{ dateToDayMonth(week.start) }} &ndash;
                  {{ dateToDayMonth(week.end) }}
                </button>
              </h2>
              <div
                :id="`week${index}`"
                class="accordion-collapse collapse"
                :class="index === 0 ? 'show' : ''"
                data-bs-parent="#recordsAccordion"
              >
                <div class="accordion-body container">
                  <TransitionGroup
                    name="record-list"
                    tag="div"
                    class="mb-0 mx-auto row row-cols-4 row-gap-4"
                  >
                    <div
                      v-for="record in week.activities"
                      :key="record.id"
                      class="record-card-container col"
                    >
                      <div class="card rounded-2">
                        <div
                          class="card-body rounded-2 bg-body-tertiary d-inline-flex align-items-center justify-content-between"
                        >
                          <p
                            v-if="record.type"
                            class="card-text mb-0 text-start"
                          >
                            {{ record.type }}: {{ record.unitCount }}
                            <span class="fw-light fst-italic">
                              {{ activityUnits[record.type] }}
                            </span>
                            <br />
                            <span
                              class="card-text-small mb-0 fw-light fst-italic text-start"
                            >
                              {{ recordDate(record.date) }}
                            </span>
                          </p>
                          <p v-else class="card-text mb-0 text-start">
                            {{ record.unitCount }}
                            <span class="fw-light fst-italic">kcal</span>
                            <br />
                            <span
                              class="card-text-small mb-0 fw-light fst-italic text-start"
                            >
                              {{ recordDate(record.date) }}
                            </span>
                          </p>
                          <div class="ms-4">
                            <button
                              class="btn btn-danger invite-button ms-1"
                              @click="deleteRecord(record.id)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TransitionGroup>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </Transition>
</template>
