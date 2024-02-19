<template>
    <OptimizationTab v-if="tabs[pageId]" :form="tabs[pageId].form" :results="tabs[pageId].results" />
</template>
  
<script setup lang="ts">
import { useOptimizationStore } from '@/stores/optimizationState'
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const optimizationState = useOptimizationStore()
const tabs = computed(() => optimizationState.tabs)
const route = useRoute()
const pageId = computed(() => parseInt(route.params.id as string))

onMounted(() => {
    if (tabs.value[pageId.value] && tabs.value[pageId.value].results.executing)
        tabs.value[pageId.value].results.executing = false
})
</script>
  