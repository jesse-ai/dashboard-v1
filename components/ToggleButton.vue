<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="font-medium text-gray-700 dark:text-gray-200">
        {{ title }}
      </div>

      <UToggle v-model="(btnModel as boolean)" />
    </div>
    <div class="text-sm text-gray-500 dark:text-gray-400 mt-2" @if="description">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
const btnModel = defineModel()

defineProps<{
  title: string
  description?: string
}>()
</script>
