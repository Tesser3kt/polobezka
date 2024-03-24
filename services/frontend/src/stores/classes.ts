import axios from "axios";
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
  actions: {
    async fetchClasses() {
      return await axios
        .get("/api/classes/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setClasses(classes: ClassInfo[]) {
      this.classes = classes;
    },
  },
});
