import { defineStore } from "pinia";
import type { UserInfo } from "@/types";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as UserInfo[],
    currentUser: null,
    minNicknameLength: 4,
    maxNicknameLength: 16,
  }),
  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find((u) => u.id === id);
    },
    getUserByNickname: (state) => (nickname: string) => {
      return state.users.find((u) => u.nickname === nickname);
    },
  },
  actions: {
    updateUserTeam(userId: number, teamId: number) {
      const user = this.getUserById(userId);
      if (user) {
        user.teamId = teamId;
      }
      if (this.currentUser?.id === userId) {
        this.currentUser.teamId = teamId;
      }
    },
  },
});
