<template>
  <div class="w-full flex justify-between items-center">
    <span class="pr-3 bg-gray-50 dark:bg-backdrop-dark text-lg font-semibold text-gray-900 dark:text-gray-200" v-text="title" />

    <div class="w-full flex items-center" aria-hidden="true">
      <div class="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
    </div>

    <span class="whitespace-nowrap ml-2">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
