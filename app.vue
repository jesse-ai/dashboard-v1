<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <Nav v-if="useAuthStore().isAuthenticated" />

    <NuxtPage v-if="useAuthStore().isAuthenticated" />

    <Login v-if="!useAuthStore().isAuthenticated" />
  </NuxtLayout>

  <UNotifications />
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/authState'

const settings = computed(() => useAuthStore().settings)
const authToken = computed(() => useAuthStore().authToken)

const systemInfo = computed(() => useAuthStore().systemInfo)
watch(authToken, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    useAuthStore().initiate()
  }
})

watch(settings, (newValue, oldValue) => {
  useAuthStore().updateConfig()
}, { deep: true })
</script>
