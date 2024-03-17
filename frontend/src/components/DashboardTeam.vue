<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

const props = defineProps<{
  user: { nickname: string; km: number | null } | null
  teamName: string | undefined
  team: { nickname: string | undefined; km: number }[] | null
}>()

const prevUserKm = ref(0)

watch(
  () => props.user?.km,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      prevUserKm.value = oldVal || 0
    }
  }
)
</script>
<template>
  <Transition name="fade" appear>
    <div class="dashboard-card card mt-5">
      <div class="card-header bg-success py-3">
        <h3 class="card-title text-light text-center m-0 fs-3">Tým: {{ props.teamName }}</h3>
      </div>
      <div class="card-body">
        <div class="container-fluid py-2">
          <div class="row row-gap-4">
            <div
              v-for="(member, index) in props.team"
              :key="member.nickname"
              class="col-12 px-5 col-sm-6 px-sm-3 col-md-4 px-md-2 col-lg-3 px-lg-2 px-xl-4 px-xxl-5"
            >
              <div class="card">
                <div
                  class="card-header m-0 py-2"
                  :class="
                    props.user?.nickname === member.nickname ? 'bg-primary' : 'bg-body-secondary'
                  "
                >
                  <h5
                    class="card-title my-0 text-center"
                    :class="props.user?.nickname === member.nickname && 'text-light'"
                  >
                    {{ member.nickname }}
                  </h5>
                </div>
                <div class="card-body">
                  <p class="km-text fs-3 text-center m-0">
                    <AnimatedNumber
                      :from="index === 0 ? prevUserKm : 0"
                      :to="member.km"
                      :decimal-digits="0"
                      :duration="700"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
