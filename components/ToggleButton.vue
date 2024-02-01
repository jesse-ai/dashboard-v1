<template>
    <div class="flex justify-between items-center">
        <UToggle v-model="(btnModel as boolean)" />
        <div class="font-medium text-gray-700 dark:text-gray-200">
            {{ title }}
        </div>
    </div>
    <div @if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-4">
        {{ description }}
    </div>
</template>

<script setup lang="ts">
const btnModel = defineModel()

const props = defineProps<{
    title: string;
    description?: string;
}>()
</script>