<script setup lang="ts">
const props = defineProps<{
  id: string;
  title: string;
  message: string;
}>();
</script>
<template>
  <div
    class="modal fade"
    :id="id"
    tabIndex="-1"
    :aria-labelledby="`${id}Label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${props.id}Label`">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="$emit('no')"
          ></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="$emit('no')"
          >
            Ne
          </button>
          <button type="button" class="btn btn-success" @click="$emit('yes')">
            Ano
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
