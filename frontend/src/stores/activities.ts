import { defineStore } from 'pinia'
import type { ActivityInfo } from '@/types'
import { Activity, activityUnits, activityCalorieConversion } from '@/types'
import { useClassesStore } from '@/stores/classes'
import { useTeamsStore } from '@/stores/teams'

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: [
      {
        id: 1,
        type: Activity.Walking,
        unitCount: 100,
        userId: 1
      },
      {
        id: 2,
        type: Activity.Running,
        unitCount: 200,
        userId: 2
      },
      {
        id: 3,
        type: Activity.Bicycle,
        unitCount: 300,
        userId: 3
      },
      {
        id: 4,
        type: Activity.Football,
        unitCount: 100,
        userId: 4
      },
      {
        id: 5,
        type: null,
        unitCount: 500,
        userId: 1
      }
    ] as ActivityInfo[]
  }),
  getters: {
    getActivityById: (state) => (id: number) => {
      return state.activities.find((a) => a.id === id)
    },
    getUserKm: (state) => (userId: number) => {
      const totalUnits = state.activities
        .filter((a) => a.userId === userId)
        .reduce((acc, a) => {
          if (a.type === null) return acc + a.unitCount
          return acc + a.unitCount * activityCalorieConversion[a.type]
        }, 0)
      return Math.round(totalUnits / activityCalorieConversion[Activity.Walking])
    },
    getClassKm: (state) => (classId: number) => {
      const classesStore = useClassesStore()
      const totalUnits = state.activities
        .filter((a) => classesStore.getUserClassById(a.userId)?.id === classId)
        .reduce((acc, a) => {
          if (a.type === null) return acc + a.unitCount
          return acc + a.unitCount * activityCalorieConversion[a.type]
        }, 0)
      return Math.round(totalUnits / activityCalorieConversion[Activity.Walking])
    },
    getTeamKm: (state) => (teamId: number) => {
      const teamsStore = useTeamsStore()
      const totalUnits = state.activities
        .filter((a) => teamsStore.getUserTeamById(a.userId)?.id === teamId)
        .reduce((acc, a) => {
          if (a.type === null) return acc + a.unitCount
          return acc + a.unitCount * activityCalorieConversion[a.type]
        }, 0)
      return Math.round(totalUnits / activityCalorieConversion[Activity.Walking])
    },
    getTotalKm: (state) => {
      const totalUnits = state.activities.reduce((acc, a) => {
        if (a.type === null) return acc + a.unitCount
        return acc + a.unitCount * activityCalorieConversion[a.type]
      }, 0)
      return Math.round(totalUnits / activityCalorieConversion[Activity.Walking])
    }
  },
  actions: {
    addActivity(userId: number | undefined, unitCount: number, type?: Activity) {
      if (userId === undefined) return
      if (type === undefined) {
        const newActivity = {
          id: this.activities.length + 1,
          type: null,
          unitCount,
          userId
        } as ActivityInfo
        this.activities.push(newActivity)
        console.log('newActivity', newActivity)
      } else {
        const newActivity = {
          id: this.activities.length + 1,
          type,
          unitCount,
          userId
        } as ActivityInfo
        this.activities.push(newActivity)
        console.log('newActivity', newActivity)
      }
    }
  }
})
