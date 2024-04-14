<template>
  <div />
</template>

<script setup lang="ts">
const candleStore = useCandlesStore()
const router = useRouter()
const keys = Object.keys(candleStore.tabs)
if (keys.length > 0) {
  const firstTabKey = keys[0]
  const firstTab = candleStore.tabs[firstTabKey]
  router.push({ path: `/candles/${firstTab.id}` })
}
else {
  candleStore.addTab()
}
</script>
