<template>
  <dl class="dark:bg-gray-700 bg-white grid grid-cols-1 gap-6 border dark:border-gray-600 rounded py-4 px-6">
    <div v-for="(item, index) in data" :key="index" class="flex justify-between items-center">
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
        {{ item[0] }}
      </div>
      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {{ item[1] }}
      </div>
    </div>
  </dl>
</template>


<script setup lang="ts">
defineProps<{
  data: [string, string | number][]
}>()
</script>
