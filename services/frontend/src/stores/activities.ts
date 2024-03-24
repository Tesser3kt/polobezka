import axios from "axios";
import { defineStore } from "pinia";
import type { ActivityInfo } from "@/types";
import { Activity, activityUnits, activityCalorieConversion } from "@/types";
import { useClassesStore } from "@/stores/classes";
import { useTeamsStore } from "@/stores/teams";

export const useActivitiesStore = defineStore("activities", {
  state: () => ({
    activities: [] as ActivityInfo[],
  }),
  getters: {
    getActivityById: (state) => (id: number) => {
      return state.activities.find((a) => a.id === id);
    },
    getUserActivities: (state) => (userId: number) => {
      return state.activities.filter((a) => a.userId === userId);
    },
    getUserActivitiesByDate: (state) => (userId: number, date: Date) => {
      return state.activities.filter(
        (a) =>
          a.userId === userId && a.date.toDateString() === date.toDateString()
      );
    },
    getUserKm: (state) => (userId: number) => {
      const totalUnits = state.activities
        .filter((a) => a.userId === userId)
        .reduce((acc, a) => {
          if (a.type === null) return acc + a.unitCount;
          return acc + a.unitCount * activityCalorieConversion[a.type];
        }, 0);
      return Math.round(
        totalUnits / activityCalorieConversion[Activity.Walking]
      );
    },
    getClassKm: (state) => (classId: number) => {
      const classesStore = useClassesStore();
      const totalUnits = state.activities
        .filter((a) => classesStore.getUserClassById(a.userId)?.id === classId)
        .reduce((acc, a) => {
          if (a.type === null) return acc + a.unitCount;
          return acc + a.unitCount * activityCalorieConversion[a.type];
        }, 0);
      return Math.round(
        totalUnits / activityCalorieConversion[Activity.Walking]
      );
    },
    getTeamKm: (state) => (teamId: number) => {
      const teamsStore = useTeamsStore();
      const totalUnits = state.activities
        .filter((a) => teamsStore.getUserTeamById(a.userId)?.id === teamId)
        .reduce((acc, a) => {
          if (a.type === null) return acc + a.unitCount;
          return acc + a.unitCount * activityCalorieConversion[a.type];
        }, 0);
      return Math.round(
        totalUnits / activityCalorieConversion[Activity.Walking]
      );
    },
    getTotalKm: (state) => {
      const totalUnits = state.activities.reduce((acc, a) => {
        if (a.type === null) return acc + a.unitCount;
        return acc + a.unitCount * activityCalorieConversion[a.type];
      }, 0);
      return Math.round(
        totalUnits / activityCalorieConversion[Activity.Walking]
      );
    },
  },
  actions: {
    async fetchActivities() {
      return await axios
        .get("/api/activities/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setActivities(activities: ActivityInfo[]) {
      this.activities = activities;
    },
    async addActivity(
      userId: number | undefined,
      unitCount: number,
      type?: Activity
    ) {
      if (userId === undefined) return;
      let newActivity;
      if (type === undefined) {
        newActivity = {
          type: null,
          unitCount,
          userId,
        };
      } else {
        newActivity = {
          type,
          unitCount,
          userId,
        };
      }

      await axios
        .post(
          "/api/activity/",
          JSON.stringify({
            type: newActivity.type,
            unit_count: newActivity.unitCount,
            user_id: newActivity.userId,
          })
        )
        .then((response) => {
          const activity = response.data;
          if (activity) {
            this.activities.push({
              id: activity.id,
              type: activity.type,
              unitCount: activity.unit_count,
              userId: activity.user_id,
              date: new Date(activity.date),
            });
          } else {
          }
        })
        .catch((error) => {
          return null;
        });
    },
    async deleteActivity(activityId: number) {
      await axios
        .delete(`/api/activity/${activityId}/`)
        .then((response) => {
          this.activities = this.activities.filter((a) => a.id !== activityId);
        })
        .catch((error) => {
          return null;
        });
    },
  },
});
