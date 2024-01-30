<template>
  <NuxtLoadingIndicator/>
  
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>

  <UNotifications/>
</template>

<script lang="ts" setup>
import {authStore} from "~/stores";
import {usePostApi2} from "~/composables/useApi";

onMounted(() => {
  document.documentElement.classList.add('h-full', 'bg-gray-50');
  document.body.classList.add('h-full');

  setTimeout(() => {
    const ref = useRoute().query.ref as string;
    if (ref && !authStore().isAuthenticated && !authStore().referral_code) {
      // send the visit event to the backend
      usePostApi2('/referrals', {ref}, false).then(res => {
        console.log('referral visit event sent', res);
        authStore().setRef(ref);
      });
    }
  }, 1000);
})
</script>
