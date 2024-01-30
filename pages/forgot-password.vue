<template>
  <SmallContainer>
    <UCard>
      <template #header>
        <h2 class="text-center font-semibold font-serif text-xl">
          Forgot Your Password?
        </h2>
      </template>

      <UForm :state="formState" class="space-y-4" @submit="onSubmit">
        <UFormGroup>
          <p>
            Forgot your password? No problem. Just let us know your email address and we will email you a password reset
            link
            that will allow you to choose a new one.
          </p>
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="formState.email"
                  icon="i-heroicons i-heroicons-envelope"
                  placeholder="Email address"/>
        </UFormGroup>

        <UButton type="submit" block :loading="loading">
          Send Reset Link
        </UButton>
      </UForm>
    </UCard>
  </SmallContainer>
</template>

<script setup lang="ts">
import type {FormSubmitEvent} from '#ui/types'
import {showNotification} from "~/composables/notifications";
import {usePostApi2} from "~/composables/useApi";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Forgot Your Password?'
const seoDescription = 'Forgot your password for Jesse? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.'
setSeoMeta(seoTitle, seoDescription)

definePageMeta({
  middleware: 'guest'
});

const formState = reactive({
  email: ''
})

const resetLinkSent = ref(false);
const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true;
  const {data, error} = await usePostApi2(`/forgot-password`, event.data);
  loading.value = false;

  // If there is an error, show it
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', error.value.data.message)
  } else { // Otherwise, show success message
    resetLinkSent.value = true;
    showNotification('success', 'Password reset link sent successfully')
  }
}
</script>
