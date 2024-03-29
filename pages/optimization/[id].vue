<template>
    <OptimizationTab v-if="currentTab" :form="currentTab.form" :results="currentTab.results" />
</template>
  
<script setup lang="ts">
import { useOptimizationStore } from '@/stores/optimizationState'
import { computed, onMounted } from 'vue';

const optimizationStore = useOptimizationStore()
const tabs = computed(() => optimizationStore.tabs)
const route = useRoute()
const pageId = computed(() => route.params.id as string)

const currentTab = computed(() => {
  // if can't find it, select and return the first tab
  if (!tabs.value[pageId.value]) {
    const keys = Object.keys(tabs.value)
    if (keys.length > 0) {
      const firstTab = tabs.value[keys[0]]
      useRouter().push(`/optimization/${firstTab.id}`)
      return firstTab
    }
  }
  return tabs.value[pageId.value]
})

// Add a new tab if there are no tabs
if (Object.keys(tabs.value).length === 0) {
  optimizationStore.addTab()
}

onMounted(() => {
    if (tabs.value[pageId.value] && tabs.value[pageId.value].results.executing) {
      tabs.value[pageId.value].results.executing = false
    }
})
</script>
