<template>
    <LiveTab v-if="tabs[pageId]" :form="tabs[pageId].form" :results="tabs[pageId].results" />
</template>
  
<script setup lang="ts">
import { useLiveStore } from '@/stores/liveState'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const liveStore = useLiveStore()
const tabs = computed(() => liveStore.tabs)
const route = useRoute()
const pageId = computed(() => parseInt(route.params.id as string))
</script>
  