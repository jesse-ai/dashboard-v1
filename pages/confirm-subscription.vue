<template>
  <MediumContainer>
    <div class="flex items-center justify-center w-full min-h-full">
      <h1 class="md:text-5xl text-2xl my-32 text-center font-serif" v-if="loading">Confirming your subscription...</h1>

      <h1 class="md:text-5xl text-2xl my-32 text-center font-serif" v-if="confirmationSuccess">
        Thank you for confirming your subscription 🎉
      </h1>
      <h1 class="md:text-5xl text-2xl my-32 text-center font-serif" v-if="!confirmationSuccess && !loading">
        Subscription confirmation failed ☹️
      </h1>
    </div>

  </MediumContainer>
</template>

<script setup lang="ts">
import {showNotification} from "~/composables/notifications";
import {useFetchApi2, usePostApi2} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Subscription Confirmation'
const seoDescription = 'Confirm your subscription to receive updates about Jesse trading framework.'
setSeoMeta(seoTitle, seoDescription)

const confirmationSuccess = ref(false);
const loading = ref(true);

const token = useRoute().query.token as string;

if (!token) {
  showNotification('error', 'Invalid token')
} else {
  loading.value = true;
  const {data, error} = await useFetchApi2(`/confirm-subscription?token=${token}`, false);
  loading.value = false;

  // If there is an error, show it
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', error.value.data.message)
  } else { // Otherwise, show success message
    confirmationSuccess.value = true;
    const res = data.value as SubscriptionConfirmationResponse;
    showNotification('success', 'Subscription confirmed successfully')
    confirmationSuccess.value = true;
  }
}
</script>
