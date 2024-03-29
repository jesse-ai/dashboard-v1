<template>
  <div class="w-full">
    <Tabs :page-id="pageId" :tabs="tabs" mode="backtest" @close="backtestStore.closeTab"/>
  </div>

  <BacktestTab v-if="currentTab" :form="currentTab.form" :results="currentTab.results"/>
</template>

<script setup lang="ts">
import {useBacktestStore} from '@/stores/backtestState'
import {computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute()
const backtestStore = useBacktestStore()

const tabs = computed(() => backtestStore.tabs)

const pageId = computed(() => route.params.id as string)

const currentTab = computed(() => {
  // if can't find it, select and return the first tab
  if (!tabs.value[pageId.value]) {
    const keys = Object.keys(tabs.value)
    if (keys.length > 0) {
      const firstTab = tabs.value[keys[0]]
      useRouter().push(`/backtest/${firstTab.id}`)
      return firstTab
    }
  }
  return tabs.value[pageId.value]
})
</script>
