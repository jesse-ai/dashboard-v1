<template>
  <div class="flex items-center justify-center w-full min-h-full">
    <h1 class="md:text-5xl text-2xl my-32 text-center" v-if="loading">Verifying your email...</h1>

    <h1 class="md:text-5xl text-2xl my-32 text-center" v-if="validationSuccess">
      Thank you for verifying your email 🎉
    </h1>
    <h1 class="md:text-5xl text-2xl my-32 text-center" v-if="!validationSuccess && !loading">
      Email verification failed ☹️
    </h1>
  </div>
</template>

<script setup lang="ts">
import {showNotification} from "~/composables/notifications";
import {useFetchApi2} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Email Verification'
const seoDescription = 'Verify your email to access the full features of Jesse trading framework.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'auth'
});

const validationSuccess = ref(false);
const loading = ref(true);

const token = useRoute().query.token as string;

if (!token) {
  showNotification('error', 'Invalid token')
} else {
  loading.value = true;
  const {data, error} = await useFetchApi2(`/verify-email?token=${token}`, true);
  loading.value = false;

  // If there is an error, show it
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', error.value.data.message)
  } else { // Otherwise, show success message
    validationSuccess.value = true;
    const res = data.value as EmailVerificationResponse;
    showNotification('success', 'Email verified successfully')
    validationSuccess.value = true;
    authStore().setUser(res.user);
  }
}
</script>
