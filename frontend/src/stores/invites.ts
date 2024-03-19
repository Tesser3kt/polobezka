import { defineStore } from "pinia";
import type { InviteInfo } from "@/types";

export const useInvitesStore = defineStore("invites", {
  state: () => ({
    invites: [
      {
        id: 1,
        teamFrom: 1,
        userTo: 1,
        date: new Date(2023, 11, 10, 20, 30),
      },
      {
        id: 2,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1, 14, 35),
      },
      {
        id: 3,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1, 17, 35),
      },
      {
        id: 4,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1, 14, 50),
      },
      {
        id: 5,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1, 18, 12),
      },
    ] as InviteInfo[],
  }),
  getters: {
    getUserInvites: (state) => (userId: number) => {
      return state.invites.filter((i) => i.userTo === userId);
    },
    getInviteById: (state) => (id: number) => {
      return state.invites.find((i) => i.id === id);
    },
  },
  actions: {
    deleteInvite(inviteId: number) {
      this.invites = this.invites.filter((i) => i.id !== inviteId);
    },
  },
});
