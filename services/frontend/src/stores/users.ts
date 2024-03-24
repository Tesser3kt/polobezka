import axios from "axios";
import { googleLogout } from "vue3-google-login";
import { defineStore } from "pinia";
import type { UserInfo } from "@/types";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as UserInfo[],
    currentUser: undefined as UserInfo | undefined,
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
    getUsersByClassId: (state) => (classId: number) => {
      return state.users.filter((u) => u.classId === classId);
    },
    getUsersByTeamId: (state) => (teamId: number) => {
      return state.users.filter((u) => u.teamId === teamId);
    },
    isLogged: (state) => {
      return state.currentUser !== undefined;
    },
  },
  actions: {
    async fetchUsers() {
      return await axios
        .get("/api/users/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setUsers(users: UserInfo[]) {
      this.users = users;
    },
    async getUserByEmail(email: string) {
      return await axios
        .get(`/api/user/?user_info=${email}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async setNickname(nickname: string) {
      return await axios
        .put(`/api/user/${this.currentUser?.id}/`, {
          nickname: nickname,
          email: this.currentUser?.email,
          class_id: this.currentUser?.classId,
          team_id: this.currentUser?.teamId,
        })
        .then((response) => {
          console.log("Nickname updated", response.data);
          return response.data;
        })
        .catch((error) => {
          return null;
        });
    },
    async loginUser(userId: number | undefined) {
      if (!userId) {
        return;
      }
      this.currentUser = this.getUserById(userId);

      $cookies?.set("currentUser", this.currentUser?.id);
    },
    async logoutUser() {
      this.currentUser = undefined;
      $cookies?.remove("currentUser");
      googleLogout();
    },
    async updateUserTeam(userId: number, teamId: number | null) {
      const user = this.getUserById(userId);
      if (user) {
        await axios
          .put(`/api/user/${userId}/`, {
            nickname: user.nickname,
            email: user.email,
            class_id: user.classId,
            team_id: teamId,
          })
          .then((response) => {
            if (response.status === 200) {
              user.teamId = teamId;
              console.log(this.users);
              if (this.currentUser?.id === userId) {
                this.currentUser.teamId = teamId;
              }
            }
          })
          .catch((error) => {
            return null;
          });
      }
    },
    resetCurrentUser() {
      if (this.currentUser) {
        this.currentUser = this.getUserById(this.currentUser.id);
        console.log("Current user reset", this.currentUser);
      }
    },
  },
});
