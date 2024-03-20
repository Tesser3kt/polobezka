import { defineStore } from "pinia";
import type { ClassInfo } from "@/types";

export const useClassesStore = defineStore("classes", {
  state: () => ({
    classes: [
      {
        id: 1,
        name: "1.A",
        studentIds: [1, 2, 3, 4],
      },
      {
        id: 2,
        name: "2.A",
        studentIds: [],
      },
    ] as ClassInfo[],
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
