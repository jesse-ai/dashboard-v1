<template>
  <MediumContainer>
    <div class="flex items-center justify-center w-full min-h-full">
      <h1 class="md:text-5xl text-2xl my-32 text-center font-serif" v-if="loading">
        Processing your unsubscription request...
      </h1>

      <h1 class="md:text-5xl text-2xl my-32 text-center font-serif" v-if="unsubscriptionSuccess">
        You have successfully unsubscribed. We're sorry to see you go! 😔
      </h1>

      <h1 class="md:text-5xl text-2xl my-32 text-center font-serif" v-if="!unsubscriptionSuccess && !loading">
        Unsubscription request failed ☹️
      </h1>
    </div>
  </MediumContainer>
</template>

<script setup lang="ts">
import {showNotification} from "~/composables/notifications";
import {useFetchApi2} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Unsubscription Confirmation'
const seoDescription = 'Confirm your unsubscription from our mailing list.'
setSeoMeta(seoTitle, seoDescription)

const unsubscriptionSuccess = ref(false);
const loading = ref(true);
const token = useRoute().query.token as string;

onMounted(async () => {
  setTimeout(async () => {
    if (!token) {
      showNotification('error', 'Invalid token')
    } else {
      loading.value = true;
      const {data, error} = await useFetchApi2(`/unsubscribe?token=${token}`, false);
      loading.value = false;
      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', error.value.data.message)
      } else {
        unsubscriptionSuccess.value = true;
        showNotification('success', 'You have unsubscribed successfully')
      }
    }
  }, 200)
})
</script>
