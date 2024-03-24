import axios from "axios";
import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { useInvitesStore } from "./invites";
import type { TeamInfo } from "@/types";

export const useTeamsStore = defineStore("teams", {
  state: () => ({
    teams: [] as TeamInfo[],
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
    async fetchTeams() {
      return await axios
        .get("/api/teams/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setTeams(teams: TeamInfo[]) {
      this.teams = teams;
    },
    async createTeam(userId: number, name: string) {
      const usersStore = useUsersStore();
      const user = usersStore.getUserById(userId);
      if (!user) {
        return;
      }
      if (user.teamId) {
        return;
      }
      if (name.length < this.minCharactersInName) {
        return;
      }
      if (name.length > this.maxCharactersInName) {
        return;
      }

      await axios
        .post("/api/team/", {
          name,
        })
        .then(async (response) => {
          if (response.status === 200) {
            this.teams.push({
              id: response.data.id,
              name,
              memberIds: [userId],
            });
            await usersStore.updateUserTeam(userId, response.data.id);
          }
        });
    },
    async deleteTeam(teamId: number) {
      const invitesStore = useInvitesStore();
      await invitesStore.deleteInvitesByTeam(teamId);

      await axios.delete(`/api/team/${teamId}/`).then(async (response) => {
        if (response.status === 200) {
          this.teams = this.teams.filter((t) => t.id !== teamId);
        }
      });
    },
    async leaveTeam(userId: number, teamId: number) {
      const team = this.getTeamById(teamId);
      if (team) {
        team.memberIds = team.memberIds.filter((id) => id !== userId);
      }
      if (team?.memberIds.length === 0) {
        await this.deleteTeam(teamId);
      }

      const usersStore = useUsersStore();
      await usersStore.updateUserTeam(userId, null);
    },
    async joinTeam(userId: number, teamId: number) {
      const team = this.getTeamById(teamId);
      if (team) {
        team.memberIds.push(userId);
      }

      const usersStore = useUsersStore();
      await usersStore.updateUserTeam(userId, teamId);
    },
  },
});
