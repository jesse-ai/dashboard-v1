<template>
  <div class="w-full">
    <CandleTabs :page-id="pageId" :tabs="tabs" @close="candlesStore.closeTab"/>
  </div>

  <CandlesTab v-if="currentTab" :form="currentTab.form" :results="currentTab.results"/>
</template>

<script setup lang="ts">
import {useCandlesStore} from '@/stores/candleState'

const candlesStore = useCandlesStore()
const tabs = computed(() => candlesStore.tabs)
const route = useRoute()
const pageId = computed(() => route.params.id as string)

const currentTab = computed(() => {
  // if can't find it, select and return the first tab
  if (!tabs.value[pageId.value]) {
    const keys = Object.keys(tabs.value)
    if (keys.length > 0) {
      const firstTab = tabs.value[keys[0]]
      useRouter().push(`/candles/${firstTab.id}`)
      return firstTab
    }
  }
  return tabs.value[pageId.value]
})
</script>
