<script setup lang="ts">
import logoUrl from "@/assets/imgs/logo.png";

const props = defineProps<{
  user?: string;
  class_?: string;
  team?: string;
}>();
</script>

<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid px-3 px-sm-4">
      <a href="#" class="navbar-brand d-inline-flex align-items-center fs-4">
        <img
          :src="logoUrl"
          alt="logo"
          width="60"
          height="42"
          class="d-inline-block align-text-top d-none d-md-block"
        />
        Poloběžka
      </a>
      <div v-if="props.user" class="user-data d-inline-flex align-items-center">
        <p className="mb-0 d-inline-flex align-items-center">
          <span class="d-none d-md-block fs-5" v-if="props.class_">{{
            props.class_
          }}</span>
          <i
            v-if="props.class_"
            class="bi bi-dot text-body-tertiary fs-3 mt-1 d-none d-md-block"
          ></i>
          <span class="d-none d-md-block fs-5" v-if="props.team">{{
            props.team
          }}</span>
          <i
            v-if="props.team"
            class="bi bi-dot text-body-tertiary fs-4 mt-1 d-none d-md-block"
          ></i>
          <span class="fs-5">{{ props.user }}</span>
        </p>
        <button
          class="btn btn-outline-danger ms-sm-4 ms-2"
          @click="$emit('logout')"
        >
          <i class="bi bi-box-arrow-in-right logout-icon"></i>
          <span class="d-none d-sm-inline-block ms-2">Odhlásit</span>
        </button>
      </div>
    </div>
  </nav>
</template>
