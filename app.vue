<template>
  <NuxtLoadingIndicator/>

  <NuxtLayout>
    <Nav v-if="useAuthStore().isAuthenticated"/>

    <Login v-if="showLogin"/>
    <Loading v-if="loading"/>
    <NuxtPage v-else/>
  </NuxtLayout>

  <UNotifications/>
</template>


<script setup lang="ts">
import {useAuthStore} from '@/stores/authState'
import {useSocketStore} from '@/stores/socketState'

const showLogin = ref(false)
const loading = ref(true)
const settings = computed(() => useAuthStore().settings)
const authToken = computed(() => useAuthStore().authToken)
const initiated = computed(() => useAuthStore().initiated)

onMounted(() => {
  if (useAuthStore().isAuthenticated) {
    if (useAuthStore().initiated) {
      loading.value = false
    }

    useSocketStore().initiate()
    setTimeout(() => {
      useAuthStore().initiate()
    }, 500);
  } else {
    showLogin.value = true
    useAuthStore().initiated = false
  }
});

watch(authToken, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    useAuthStore().initiate()
  }
})

watch(initiated, (newValue, oldValue) => {
  console.log('initiated', newValue)
  console.log('loading', loading.value)
  if (newValue) {
    console.log('sdcdscds')
    loading.value = false
  }
})

watch(settings, (newValue, oldValue) => {
  useAuthStore().updateConfig()
}, {deep: true})
</script>
