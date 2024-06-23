<template>
  <ClientOnly>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <Nav v-if="useMainStore().isAuthenticated" />

      <Login v-if="showLogin" />
      <Loading v-else-if="loading" />
      <NuxtPage v-else />
    </NuxtLayout>

    <UNotifications />
  </ClientOnly>
</template>


<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'
import { useSocketStore } from '~/stores/websocketStore'

const showLogin = ref(false)
const loading = ref(true)
const settings = computed(() => useMainStore().settings)
const authToken = computed(() => useMainStore().authToken)
const initiated = computed(() => useMainStore().initiated)

if (useMainStore().isAuthenticated) {
  if (useMainStore().initiated) {
    loading.value = false
  }

  useSocketStore().initiate()
  setTimeout(() => {
    useMainStore().initiate()
  }, 300)
}
else {
  showLogin.value = true
  useMainStore().initiated = false
}

watch(authToken, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    useMainStore().initiate()
  }
})

watch(initiated, (newValue) => {
  if (newValue) {
    loading.value = false
  }
})

watch(settings, () => {
  useMainStore().updateConfig()
}, { deep: true })

onMounted(() => {
  document.documentElement.classList.add('h-full', 'bg-gray-50')
  document.body.classList.add('h-full')
})
</script>
