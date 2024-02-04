<template>
  <NuxtLoadingIndicator />

  <NuxtLayout>
    <Nav v-if="store.isAuthenticated" />

    <NuxtPage v-if="store.isAuthenticated" />

    <Login v-else />
  </NuxtLayout>

  <UNotifications />
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/authState'

const store = useAuthStore()
const settings = computed(() => store.settings)
const authToken = computed(() => store.authToken)

watch(authToken, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    store.initiate()
  }
})

watch(settings, (newValue, oldValue) => {
  store.updateConfig()
}, { deep: true })


onMounted(() => {
  if (sessionStorage.getItem('auth_key') !== null) {
    store.setAuthToken(sessionStorage.auth_key)
  }
})
</script>
