import { defineStore } from 'pinia'
import type { TeamInfo } from '@/types'

export const useTeamsStore = defineStore('teams', {
  state: () => ({
    teams: [
      {
        id: 1,
        name: '6666666666666666',
        description: 'Team 1 description',
        memberIds: [1, 2, 3, 4]
      },
      {
        id: 2,
        name: 'Team 2',
        description: 'Team 2 description',
        memberIds: [3, 4]
      }
    ] as TeamInfo[]
  }),
  getters: {
    getTeamById: (state) => (id: number) => {
      return state.teams.find((t) => t.id === id)
    },
    getUserTeamById: (state) => (userId: number) => {
      return state.teams.find((t) => t.memberIds.includes(userId))
    }
  }
})
