import { defineStore } from 'pinia'
import type { UserInfo } from '@/types'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [
      {
        id: 1,
        name: 'user1',
        nickname: '6666666666666666',
        email: 'user1@random.com',
        classId: 1,
        teamId: 1
      },
      {
        id: 2,
        name: 'user2',
        nickname: 'user2nick',
        email: 'user2@random.com',
        classId: 1,
        teamId: 1
      },
      {
        id: 3,
        name: 'user3',
        nickname: 'user3nick',
        email: 'user3@random.com',
        classId: 1,
        teamId: 2
      },
      {
        id: 4,
        name: 'user4',
        nickname: 'user4nick',
        email: 'user4@random.com',
        classId: 2,
        teamId: 2
      }
    ] as UserInfo[],
    currentUser: {
      id: 1,
      name: 'user1',
      nickname: '6666666666666666',
      email: 'user1@random.com',
      classId: 1,
      teamId: 1
    } as UserInfo | null
  }),
  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find((u) => u.id === id)
    }
  }
})
