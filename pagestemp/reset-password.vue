<template>
  <SmallContainer>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h2 class="text-center font-semibold text-xl font-serif">
          Reset Your Password
        </h2>
      </template>

      <UForm :state="formState" class="space-y-4" @submit="onSubmit">
        <UFormGroup>
          <p>
            Just one more step before your new password is set. You must choose a password that is strong enough.
          </p>
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="formState.password"
                  required
                  type="password"
                  icon="i-heroicons i-heroicons-lock-closed"
                  placeholder="New Password"/>
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="password_confirmation">
          <UInput v-model="formState.password_confirmation"
                  required
                  type="password"
                  icon="i-heroicons i-heroicons-lock-closed"
                  placeholder="Confirm New Password"/>
        </UFormGroup>

        <UButton type="submit" block :loading="loading">
          Reset Password
        </UButton>
      </UForm>
    </UCard>
  </SmallContainer>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import type {FormSubmitEvent} from '#ui/types'
import {usePostApi2} from "~/composables/useApi";
import {showNotification} from "~/composables/notifications";
import {useRoute} from "vue-router";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'Reset Your Password'
const seoDescription = 'Reset your password for Jesse.'
setSeoMeta(seoTitle, seoDescription)

const formState = reactive({
  password: "",
  password_confirmation: "",
  token: ""
})

let loading = ref(false);

const route = useRoute();

onMounted(() => {
  if (route.query.token) {
    formState.token = route.query.token as string;
  }
});

async function onSubmit(event: FormSubmitEvent<any>) {
  // Check if password and confirmation are the same
  if (formState.password !== formState.password_confirmation) {
    showNotification('error', 'Password and confirmation do not match')
    return
  }

  // Check if password is strong enough
  if (formState.password.length < 8) {
    showNotification('error', 'Password must be at least 8 characters long')
    return
  }

  loading.value = true;

  const {data, error} = await usePostApi2('/reset-password', Object.assign({}, formState));

  loading.value = false;

  if (error && error.value && error.value.status !== 200) {
    if (error.value.data) {
      showNotification('error', error.value.data.message)
    }
    return
  }

  showNotification('success', 'Password reset successful');
  await useRouter().push('/login');
}
</script>
