import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { useInvitesStore } from "./invites";
import type { TeamInfo } from "@/types";

export const useTeamsStore = defineStore("teams", {
  state: () => ({
    teams: [
      {
        id: 1,
        name: "6666666666666666",
        memberIds: [1],
      },
      {
        id: 2,
        name: "Team 2",
        memberIds: [3, 4],
      },
    ] as TeamInfo[],
    maxMembers: 4,
    minCharactersInName: 4,
    maxCharactersInName: 16,
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
    createTeam(userId: number, name: string) {
      const usersStore = useUsersStore();
      const user = usersStore.getUserById(userId);
      if (!user) {
        return;
      }
      if (user.teamId !== 0) {
        return;
      }
      if (name.length < this.minCharactersInName) {
        return;
      }
      if (name.length > this.maxCharactersInName) {
        return;
      }
      const teamId =
        this.teams.map((t) => t.id).reduce((a, b) => Math.max(a, b), 0) + 1;
      this.teams.push({
        id: teamId,
        name,
        memberIds: [userId],
      });
      usersStore.updateUserTeam(userId, teamId);
    },
    deleteTeam(teamId: number) {
      this.teams = this.teams.filter((t) => t.id !== teamId);
      const invitesStore = useInvitesStore();
      invitesStore.deleteInvitesByTeam(teamId);
    },
    leaveTeam(userId: number, teamId: number) {
      const team = this.getTeamById(teamId);
      if (team) {
        team.memberIds = team.memberIds.filter((id) => id !== userId);
      }
      if (team?.memberIds.length === 0) {
        this.deleteTeam(teamId);
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
