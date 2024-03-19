import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import type { TeamInfo } from "@/types";

export const useTeamsStore = defineStore("teams", {
  state: () => ({
    teams: [
      {
        id: 1,
        name: "6666666666666666",
        description: "Team 1 description",
        memberIds: [1, 2, 3, 4],
      },
      {
        id: 2,
        name: "Team 2",
        description: "Team 2 description",
        memberIds: [3, 4],
      },
    ] as TeamInfo[],
  }),
  getters: {
    getTeamById: (state) => (id: number) => {
      return state.teams.find((t) => t.id === id);
    },
    getUserTeamById: (state) => (userId: number) => {
      return state.teams.find((t) => t.memberIds.includes(userId));
    },
  },
  actions: {
    leaveTeam(userId: number, teamId: number) {
      const team = this.getTeamById(teamId);
      if (team) {
        team.memberIds = team.memberIds.filter((id) => id !== userId);
      }

      const usersStore = useUsersStore();
      usersStore.updateUserTeam(userId, 0);
    },
    joinTeam(userId: number, teamId: number) {
      const team = this.getTeamById(teamId);
      if (team) {
        team.memberIds.push(userId);
      }

      const usersStore = useUsersStore();
      usersStore.updateUserTeam(userId, teamId);
    },
  },
});
