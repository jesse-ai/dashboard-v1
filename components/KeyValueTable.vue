<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto">
      <div class="py-2 align-middle inline-block min-w-full">
        <div class="border dark:border-gray-600 overflow-hidden sm:rounded">
          <table class="min-w-full divide-y divide-gray-200">
            <tbody>
              <tr v-for="(d, index) in data" :key="index" :class="index % 2 === 0 ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-backdrop-dark'">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ d[0] }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-200">
                  {{ d[1] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  data: [string, string | number][]
}>()
</script>
