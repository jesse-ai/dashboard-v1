<template>
  <div/>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';

const optimizeStore = useOptimizationStore()

const router = useRouter()
onMounted(() => {
  const keys = Object.keys(optimizeStore.tabs)
  if (keys.length > 0) {
    const firstTabKey = keys[0]
    const firstTab = optimizeStore.tabs[firstTabKey]
    router.push({path: `/optimization/${firstTab.id}`})
  }
})
</script>
