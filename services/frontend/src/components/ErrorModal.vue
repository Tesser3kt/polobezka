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
      <div class="modal-content fs-5 error-modal-content">
        <div
          class="modal-body d-inline-flex justify-content-between align-items-center"
        >
          <p class="mb-0">
            <i class="bi bi-exclamation-triangle fs-4 text-danger me-1"></i>
            {{ message }}
          </p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
