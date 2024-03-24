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
        .get(`/api/user/?email=${email}`)
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

      await axios
        .get(`/api/user/${userId}/`)
        .then((response) => {
          if (response.status === 200 && response.data) {
            this.currentUser = {
              id: response.data.id,
              nickname: response.data.nickname,
              email: response.data.email,
              classId: response.data.class_id,
              teamId: response.data.team_id,
            };
            if (!this.currentUser) {
              return;
            }
            $cookies?.set("currentUser", this.currentUser?.id, "1d");
          }
        })
        .catch((error) => {
          return null;
        });
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
      }
    },
  },
});
