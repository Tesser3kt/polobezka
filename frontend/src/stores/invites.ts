import { defineStore } from "pinia";
import type { InviteInfo } from "@/types";

export const useInvitesStore = defineStore("invites", {
  state: () => ({
    invites: [
      {
        id: 1,
        teamFrom: 1,
        userTo: 1,
        date: new Date(2023, 11, 10),
      },
      {
        id: 2,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1),
      },
    ] as InviteInfo[],
  }),
  getters: {
    getUserInvites: (state) => (userId: number) => {
      return state.invites.filter((i) => i.userTo === userId);
    },
  },
});
