<template>
    <div class="w-full flex justify-between items-center">
        <div class="relative flex justify-start bg-inherit z-10">
            <span class="pr-3 text-lg font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap" v-text="title" />
        </div>

        <div class="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
    </div>
</template>
  
  
<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>
  