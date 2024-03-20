import { defineStore } from "pinia";
import type { InviteInfo } from "@/types";

export const useInvitesStore = defineStore("invites", {
  state: () => ({
    invites: [
      {
        id: 4,
        teamFrom: 1,
        userTo: 1,
        date: new Date(2023, 11, 10, 20, 30),
      },
      {
        id: 5,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1, 14, 35),
      },
      {
        id: 8,
        teamFrom: 2,
        userTo: 1,
        date: new Date(2024, 3, 1, 17, 35),
      },
    ] as InviteInfo[],
    maxInvitesToUser: 5,
    maxInvitesFromTeam: 5,
  }),
  getters: {
    getUserInvites: (state) => (userId: number) => {
      return state.invites.filter((i) => i.userTo === userId);
    },
    getInviteById: (state) => (id: number) => {
      return state.invites.find((i) => i.id === id);
    },
    getTeamInvites: (state) => (teamId: number) => {
      return state.invites.filter((i) => i.teamFrom === teamId);
    },
    getInviteByTeamAndUser: (state) => (teamId: number, userId: number) => {
      return state.invites.find(
        (i) => i.teamFrom === teamId && i.userTo === userId
      );
    },
  },
  actions: {
    deleteInvite(inviteId: number) {
      this.invites = this.invites.filter((i) => i.id !== inviteId);
    },
    deleteInvitesByTeam(teamId: number) {
      console.log("deleting invites by team", teamId);
      this.invites = this.invites.filter((i) => i.teamFrom !== teamId);
    },
    deleteInvitesToUser(userId: number) {
      this.invites = this.invites.filter((i) => i.userTo !== userId);
    },
    sendInvite(teamId: number, userId: number) {
      const invite = this.getInviteByTeamAndUser(teamId, userId);
      if (invite) {
        invite.date = new Date();
      } else {
        const freeId =
          this.invites.map((i) => i.id).reduce((a, b) => Math.max(a, b), 0) + 1;
        this.invites.push({
          id: freeId,
          teamFrom: teamId,
          userTo: userId,
          date: new Date(),
        });
      }
    },
  },
});
