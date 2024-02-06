<template>
    <Tabs :page-id="pageId" :tabs="tabs" />
    

    <!-- <CandlesTab v-if="tabs[pageId]" :form="tabs[pageId].form" :results="tabs[pageId].results" /> -->
</template>
  
<script setup lang="ts">
import { useCandlesStore } from '@/stores/candleState'

const candlesStore = useCandlesStore()
const tabs = computed(() => candlesStore.tabs)
const route = useRoute()
const pageId = computed(() => parseInt(route.params.id as string))
</script>
  