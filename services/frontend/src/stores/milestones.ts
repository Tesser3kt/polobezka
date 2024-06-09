import axios from "axios";
import { defineStore } from "pinia";
import type { MilestoneInfo } from "@/types";
import { milestonesData } from "@/types";

export const useMilestonesStore = defineStore("milestones", {
  state: () => ({
    milestones: [] as MilestoneInfo[],
  }),
  actions: {
    async fetchMilestones() {
      return await axios
        .get("/api/milestones/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setMilestones(milestones: MilestoneInfo[]) {
      this.milestones = milestones;
    },
    async addMilestone(milestoneNumber: number, userId: number) {
      if (!milestonesData[milestoneNumber - 1]) {
        return null;
      }

      await axios
        .post(
          "/api/milestone/",
          JSON.stringify({
            number: milestoneNumber,
            user_id: userId,
          })
        )
        .then((response) => {
          if (response.status === 200) {
            this.milestones.push({
              number: response.data.number,
              userId: response.data.user_id,
            });
          }
        })
        .catch((error) => {
          console.error("Error adding milestone", error);
        });
    },
    async deleteMilestone(milestoneNumber: number, userId: number) {
      await axios
        .delete(`/api/milestone/${userId}/${milestoneNumber}/`)
        .then((response) => {
          if (response.status === 200) {
            this.milestones = this.milestones.filter(
              (m) => m.number !== milestoneNumber || m.userId !== userId
            );
          }
        })
        .catch((error) => {
          console.error("Error deleting milestone", error);
        });
    },
  },
});
