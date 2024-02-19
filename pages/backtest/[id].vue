<template>
    <div class="w-full">
        <Tabs :page-id="pageId" :tabs="tabs" mode="backtest" />
    </div>

    <BacktestTab v-if="tabs[pageId]" :form="tabs[pageId].form" :results="tabs[pageId].results" />
</template>
  
<script setup lang="ts">
import { useBacktestStore } from '@/stores/backtestState'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const backtestsStore = useBacktestStore()
const tabs = computed(() => backtestsStore.tabs)
const route = useRoute()
const pageId = computed(() => parseInt(route.params.id as string))

onMounted(() => {
    if (tabs.value[pageId.value] && tabs.value[pageId.value].results.executing)
        tabs.value[pageId.value].results.executing = false
})
</script>
  