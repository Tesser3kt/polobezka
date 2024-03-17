<script setup lang="ts">
import { computed } from 'vue'
import type { UserInfo, ClassInfo, TeamInfo } from '@/types'
import { useUsersStore } from '@/stores/users'
import { useActivitiesStore } from '@/stores/activities'
import DashboardKilometres from './DashboardKilometres.vue'
import DashboardTeam from './DashboardTeam.vue'

const props = defineProps<{
  user?: UserInfo | null
  class_?: ClassInfo | null
  team?: TeamInfo | null
}>()

const usersStore = useUsersStore()
const activitiesStore = useActivitiesStore()

const currentUserKm = computed(() => {
  if (!props.user) return null
  return activitiesStore.getUserKm(props.user.id)
})
const currentClassKm = computed(() => {
  if (!props.class_) return null
  return activitiesStore.getClassKm(props.class_.id)
})
const currentTeamKm = computed(() => {
  if (!props.team) return null
  return activitiesStore.getTeamKm(props.team.id)
})
const schoolKm = computed(() => activitiesStore.getTotalKm)

const userNickAndKm = computed(() => {
  if (!props.user) return null
  return { nickname: props.user.nickname, km: currentUserKm.value }
})
const teamNicksAndKms = computed(() => {
  if (!props.team) return null

  return props.team.memberIds.map((id) => {
    const user = usersStore.getUserById(id)
    return { nickname: user?.nickname, km: activitiesStore.getUserKm(id) }
  })
})
</script>
<template>
  <DashboardKilometres
    :currentUserId="props.user?.id"
    :userKm="currentUserKm"
    :classKm="currentClassKm"
    :teamKm="currentTeamKm"
    :schoolKm="schoolKm"
  />
  <DashboardTeam
    v-if="props.team"
    :user="userNickAndKm"
    :teamName="props.team?.name"
    :team="teamNicksAndKms"
  />
</template>
