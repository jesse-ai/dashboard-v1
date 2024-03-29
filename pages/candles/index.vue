<template>
  <div />
</template>


<script setup lang="ts">
import {onMounted} from 'vue';

const candleStore = useCandlesStore()

const router = useRouter()
onMounted(() => {
  const keys = Object.keys(candleStore.tabs)
  if (keys.length > 0) {
    const firstTabKey = keys[0]
    const firstTab = candleStore.tabs[firstTabKey]
    router.push({path: `/optimization/${firstTab.id}`})
  }
})
</script>
