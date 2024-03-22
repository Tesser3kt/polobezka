import { defineStore } from "pinia";
import type { ClassInfo } from "@/types";

export const useClassesStore = defineStore("classes", {
  state: () => ({
    classes: [] as ClassInfo[],
  }),
  getters: {
    getClassById: (state) => (id: number) => {
      return state.classes.find((c) => c.id === id);
    },
    getUserClassById: (state) => (userId: number) => {
      return state.classes.find((c) => c.studentIds.includes(userId));
    },
  },
});
