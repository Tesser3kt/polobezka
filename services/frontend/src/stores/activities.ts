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
    addActivity(
      userId: number | undefined,
      unitCount: number,
      type?: Activity
    ) {
      if (userId === undefined) return;
      if (type === undefined) {
        const newActivity = {
          id: this.activities.length + 1,
          type: null,
          unitCount,
          userId,
          date: new Date(),
        } as ActivityInfo;
        this.activities.push(newActivity);
      } else {
        const newActivity = {
          id: this.activities.length + 1,
          type,
          unitCount,
          userId,
          date: new Date(),
        } as ActivityInfo;
        this.activities.push(newActivity);
      }
    },
  },
});
