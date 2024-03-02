<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <Nav v-if="useAuthStore().isAuthenticated" />

    <Loading v-if="useAuthStore().isAuthenticated && useAuthStore().loading" />
    <NuxtPage v-if="useAuthStore().isAuthenticated && !useAuthStore().loading" />

    <Login v-if="!useAuthStore().isAuthenticated" />
  </NuxtLayout>

  <UNotifications />
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/authState'
import { useSocketStore } from '@/stores/socketState'
const settings = computed(() => useAuthStore().settings)
const authToken = computed(() => useAuthStore().authToken)

onMounted(() => {
  if (useAuthStore().isAuthenticated) {
    useSocketStore().initiate()
    setTimeout(() => {
      useAuthStore().initiate()
    }, 500);
  }
});

watch(authToken, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    useAuthStore().initiate()
  }
})

watch(settings, (newValue, oldValue) => {
  useAuthStore().updateConfig()
}, { deep: true })
</script>