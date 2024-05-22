<template>
  <div class="w-full">
    <LiveTabs :tabs="tabs" @close="liveStore.closeTab" />
  </div>

  <LiveTab v-if="currentTab" :form="currentTab.form" :results="currentTab.results" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLiveStore } from '~/stores/liveStore'

useSeoMeta({ title: 'Live/Paper trading - Jesse' })

const liveStore = useLiveStore()
const tabs = computed(() => liveStore.tabs)
const route = useRoute()
const pageId = computed(() => route.params.id as string)

const currentTab = computed(() => {
  // if can't find it, select and return the first tab
  if (!tabs.value[pageId.value]) {
    const keys = Object.keys(tabs.value)
    if (keys.length > 0) {
      const firstTab = tabs.value[keys[0]]
      useRouter().push(`/live/${firstTab.id}`)
      return firstTab
    }
  }
  return tabs.value[pageId.value]
})

// Add a new tab if there are no tabs
if (Object.keys(tabs.value).length === 0) {
  useLiveStore().addTab()
}
</script>
