<template>
  <div class="w-full h-screen items-center flex justify-center" v-if="loading">
    <div class="font-bold text-xl md:text-2xl text-indigo-600">
      <h1 class="md:text-5xl text-2xl text-center font-serif">
        Checking payment information...
      </h1>
    </div>
  </div>

  <SmallContainer v-else>
    <UCard>
      <template #header>
        <h1 class="text-xl font-serif text-center">
          Payment Details
        </h1>
      </template>

      <div class="flex items-center justify-between px-2 py-4">
        <p>Product Name:</p>
        <p>{{ paymentResult.order.product_name }}</p>
      </div>

      <div class="flex items-center justify-between px-2 py-4">
        <p>Price:</p>
        <p>${{ paymentResult.order.price }}</p>
      </div>

      <div class="flex items-center justify-between px-2 py-4">
        <p>Order ID:</p>
        <p>#{{ paymentResult.order.id }}</p>
      </div>

      <div class="flex items-center justify-between px-2 py-4">
        <p>Status:</p>
        <UBadge size="md" :color="paymentStatus === 'Successful' ? 'teal' : 'rose'">
          {{ paymentStatus }}
        </UBadge>
      </div>

      <template #footer>
        <NuxtLink href="https://docs.jesse.trade/docs/livetrade.html#installation" target="_blank"
                  v-if="paymentStatus === 'Successful'">
          <UButton block>
            Continue to Installation <span class="ml-2">→</span>
          </UButton>
        </NuxtLink>

        <p v-else>
          If you think this is a mistake, please contact us at
          <a class="underline"
             href="mailto:support@jesse.trade">support@jesse.trade</a>
          with your Order ID and we'll get back to you as soon as possible.
        </p>
      </template>
    </UCard>
  </SmallContainer>
</template>


<script setup lang="ts">
import {showNotification} from "~/composables/notifications";
import {useFetchApi1} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Payment Details'
const seoDescription = 'Payment Details'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'auth'
});

const loading = ref(true);
const paymentResult = ref({} as PaymentResultResponse);
const paymentStatus = computed(() => {
  if (paymentResult.value.status === 'success') {
    return 'Successful'
  }

  return paymentResult.value.status
});

onMounted(() => {
  setTimeout(async () => {
    const id = useRoute().query.id as string
    const token = useRoute().query.token as string

    if (!id) {
      showNotification('error', 'Invalid id')
    } else if (!token) {
      showNotification('error', 'Invalid token')
    } else {
      loading.value = true;
      const {data, error} = await useFetchApi1(`/orders?id=${id}&token=${token}`, true);
      loading.value = false;

      console.log('data', data)
      console.log('error', error)

      // If there is an error, show it
      if (error.value && error.value.statusCode !== 200) {
        showNotification('error', error.value.data.message)
      } else { // Otherwise, show success message
        paymentResult.value = data.value as PaymentResultResponse;
        if (paymentResult.value.status === 'success') {
          authStore().setPremium()
          showNotification('success', '🎉 Payment successful!')
        } else {
          showNotification('error', '☹️ Payment failed')
        }
      }
    }
  }, 100);
})
</script>
