<template>
    <pre v-if="logs.length" class="whitespace-pre-line rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 select-text text-base dark:text-gray-300 w-full px-4 sm:px-6 py-2" v-html="logs" />

    <EmptyBox v-else />
</template>
  
<script setup lang="ts">
import { defineProps } from 'vue'
import helpers from '@/utils/helpers'

defineProps<{
    logs: string;
}>()

const timestampToTimeRef = helpers.timestampToTime
</script>
  