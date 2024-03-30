<template>
  <div/>
</template>

<script setup lang="ts">
const optimizeStore = useOptimizationStore()
const router = useRouter()
const keys = Object.keys(optimizeStore.tabs)
if (keys.length > 0) {
  const firstTabKey = keys[0]
  const firstTab = optimizeStore.tabs[firstTabKey]
  router.push({path: `/optimization/${firstTab.id}`})
} else {
  optimizeStore.addTab()
}
</script>
