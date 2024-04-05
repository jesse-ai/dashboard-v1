<template>
  <NuxtLoadingIndicator/>

  <NuxtLayout>
    <Nav v-if="useMainStore().isAuthenticated"/>

    <Login v-if="showLogin"/>
    <Loading v-if="loading"/>
    <NuxtPage v-else/>
  </NuxtLayout>

  <UNotifications/>
</template>


<script setup lang="ts">
import {useMainStore} from '~/stores/mainStore'
import {useSocketStore} from '~/stores/websocketStore'

const showLogin = ref(false)
const loading = ref(true)
const settings = computed(() => useMainStore().settings)
const authToken = computed(() => useMainStore().authToken)
const initiated = computed(() => useMainStore().initiated)

onMounted(() => {
  if (useMainStore().isAuthenticated) {
    if (useMainStore().initiated) {
      loading.value = false
    }

    useSocketStore().initiate()
    setTimeout(() => {
      useMainStore().initiate()
    }, 500);
  } else {
    showLogin.value = true
    useMainStore().initiated = false
  }
});

watch(authToken, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    useMainStore().initiate()
  }
})

watch(initiated, (newValue, oldValue) => {
  if (newValue) {
    loading.value = false
  }
})

watch(settings, (newValue, oldValue) => {
  useMainStore().updateConfig()
}, {deep: true})
</script>
