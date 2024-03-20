import { defineStore } from "pinia";
import type { UserInfo } from "@/types";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [
      {
        id: 1,
        nickname: "6666666666666666",
        email: "user1@random.com",
        classId: 1,
        teamId: 1,
      },
      {
        id: 2,
        nickname: "user2nick",
        email: "user2@random.com",
        classId: 1,
        teamId: 0,
      },
      {
        id: 3,
        nickname: "user3nick",
        email: "user3@random.com",
        classId: 1,
        teamId: 2,
      },
      {
        id: 4,
        nickname: "user4nick",
        email: "user4@random.com",
        classId: 1,
        teamId: 2,
      },
    ] as UserInfo[],
    currentUser: {
      id: 1,
      nickname: "6666666666666666",
      email: "user1@random.com",
      classId: 1,
      teamId: 1,
    } as UserInfo | null,
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
