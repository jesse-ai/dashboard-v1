<template>
  <div />
</template>

<script setup lang="ts">
import { useLiveStore } from '~/stores/liveStore'

const router = useRouter()
const liveStore = useLiveStore()
const keys = Object.keys(liveStore.tabs)
if (keys.length > 0) {
  const firstTabKey = keys[0]
  const firstTab = liveStore.tabs[firstTabKey]
  router.push({ path: `/live/${firstTab.id}` })
}
else {
  liveStore.addTab()
}
</script>
