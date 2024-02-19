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
import { useSocketStore } from '@/stores/socketState'
const settings = computed(() => useAuthStore().settings)
const authToken = computed(() => useAuthStore().authToken)

onMounted(() => {
  useSocketStore().initiate()
  setTimeout(() => {
    useAuthStore().initiate()
  }, 500);
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


<style>
select {
  padding-right: 24px;
  appearance: none;
  /* This is to remove the default browser styles */
  background: url('assets/svg/dropdown-icon.svg') no-repeat center;
  background-position: right 4px center;
  /* Replace 'dropdown-icon.png' with your icon */
  background-size: 15px;
  /* Adjust this value to change the size of the icon */
}
</style>
