<template>
  <div />
</template>

<script setup lang="ts">
const router = useRouter()
const backtestStore = useBacktestStore()
const keys = Object.keys(backtestStore.tabs)
if (keys.length > 0) {
  const firstTabKey = keys[0]
  const firstTab = backtestStore.tabs[firstTabKey]
  router.push({ path: `/backtest/${firstTab.id}` })
}
else {
  backtestStore.addTab()
}
</script>
