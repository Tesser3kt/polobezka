import axios from "axios";
import { defineStore } from "pinia";
import type { InviteInfo } from "@/types";

export const useInvitesStore = defineStore("invites", {
  state: () => ({
    invites: [] as InviteInfo[],
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
    async fetchInvites() {
      return await axios
        .get("/api/invites/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setInvites(invites: InviteInfo[]) {
      this.invites = invites;
    },
    async deleteInvite(inviteId: number) {
      await axios
        .delete(`/api/invite/${inviteId}/`)
        .then((response) => {
          if (response.status === 200) {
            this.invites = this.invites.filter((i) => i.id !== inviteId);
          }
        })
        .catch((error) => {
          console.error("Error deleting invite", error);
        });
    },
    async deleteInvitesByTeam(teamId: number) {
      const invitesToDelete = this.invites.filter((i) => i.teamFrom === teamId);

      for (const invite of invitesToDelete) {
        await this.deleteInvite(invite.id);
      }
    },
    async deleteInvitesToUser(userId: number) {
      const invitesToDelete = this.invites.filter((i) => i.userTo === userId);

      for (const invite of invitesToDelete) {
        await this.deleteInvite(invite.id);
      }
    },
    async sendInvite(teamId: number, userId: number) {
      const invite = this.getInviteByTeamAndUser(teamId, userId);
      if (invite) {
        await axios
          .put(`/api/invite/${invite.id}/`)
          .then((response) => {
            if (response.status === 200) {
              invite.date = response.data.date;
            }
          })
          .catch((error) => {
            console.error("Error updating invite", error);
          });
      } else {
        await axios
          .post("/api/invite/", {
            team_from_id: teamId,
            user_to_id: userId,
          })
          .then((response) => {
            if (response.status === 200) {
              this.invites.push({
                id: response.data.id,
                teamFrom: teamId,
                userTo: userId,
                date: new Date(response.data.date),
              });
            }
          })
          .catch((error) => {
            console.error("Error sending invite", error);
          });
      }
    },
  },
});
