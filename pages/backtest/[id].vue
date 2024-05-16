<template>
  <div class="w-full">
    <BacktestTabs :tabs="tabs" mode="backtest" @close="backtestStore.closeTab" />
  </div>

  <BacktestTab v-if="currentTab" :form="currentTab.form" :results="currentTab.results" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBacktestStore } from '~/stores/backtestStore'

useSeoMeta({ title: 'Backtest - Jesse' })

const backtestStore = useBacktestStore()
const tabs = computed(() => backtestStore.tabs)
const pageId = computed(() => useRoute().params.id as string)

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

// Add a new tab if there are no tabs
if (Object.keys(tabs.value).length === 0) {
  backtestStore.addTab()
}
</script>
