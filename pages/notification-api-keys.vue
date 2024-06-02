<template>
  <SmallContainer>
    <Heading>
      Notification API Keys
    </Heading>

    <p>
      Here you can add your API keys for various notification drivers. API keys are used to connect your account to the
      notification driver and allow the bot to send notifications on your behalf.
      <br><br>Please note that for security reasons, once created, API keys cannot be modified or seen again.
    </p>
    <br>
    <p>
      If you need help setting up your API keys, please refer to the documentation for <NuxtLink class="underline" href="https://docs.jesse.trade/docs/notifications" target="_blank">notification drivers</NuxtLink>.
    </p>

    <br>

    <UForm :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Driver:" required>
        <USelectMenu
          v-model="form.driver"
          value-attribute="value"
          :options="notificationDrivers" />
      </UFormGroup>

      <UFormGroup label="Name:" required>
        <UInput
          v-model="form.name" type="text"
          placeholder="Give a name to this API key to identify it later"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'telegram'" label="Bot Token:" required>
        <UInput
          v-model="form.bot_token" type="text"
          placeholder="Enter your Telegram bot token"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'telegram'" label="Chat ID:" required>
        <UInput
          v-model="form.chat_id" type="text"
          placeholder="Enter your Telegram chat ID"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'discord'" label="Webhook URL:" required>
        <UInput
          v-model="form.webhook" type="text"
          placeholder="Enter your Discord webhook URL"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'slack'" label="Webhook URL:" required>
        <UInput
          v-model="form.webhook" type="text"
          placeholder="Enter your Slack webhook URL"
        />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton
          type="submit"
          icon="i-heroicons-plus"
          class="w-48 flex justify-center " label="Create"
          :loading="submitLoading" :disabled="!isValidForm" />
      </div>
    </UForm>

    <!-- Previously Added -->
    <div class="mt-8">
      <Heading>
        Previously Added <span v-if="apiKeys.length">({{ apiKeys.length }})</span>
      </Heading>

      <EmptyBox v-if="!apiKeys.length">
        No API keys added yet
      </EmptyBox>

      <NotificationApiKey v-for="a in apiKeys" :key="a.id" :api-key="a" />
    </div>
  </SmallContainer>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'
import SmallContainer from '~/components/SmallContainer.vue'

useSeoMeta({ title: 'Notification API Keys' })

const submitLoading = ref(false)
const mainStore = useMainStore()

const notificationDrivers = [
  { label: 'Telegram', value: 'telegram' },
  { label: 'Discord', value: 'discord' },
  { label: 'Slack', value: 'slack' },
]

type FormData = {
  name: string
  driver: string
  fields: {
    bot_token?: string
    chat_id?: string
    webhook?: string
  }
}

const form = reactive({
  name: '',
  driver: notificationDrivers[0].value,
  bot_token: '',
  chat_id: '',
  webhook: '',
})

const apiKeys = computed(() => mainStore.notificationApiKeys)
const isValidForm = computed(() => {
  if (form.driver === 'telegram') {
    return form.bot_token && form.chat_id
  }
  // (form.driver === 'discord' || form.driver === 'slack') {
  else {
    return form.webhook
  }
})

async function submit() {
  if (!isValidForm.value) {
    showNotification('error', 'Please fill in all required fields')
    return
  }

  const fields: { [key: string]: string } = {}
  if (form.driver === 'telegram') {
    fields['bot_token'] = form.bot_token
    fields['chat_id'] = form.chat_id
  }
  else if (form.driver === 'discord' || form.driver === 'slack') {
    fields['webhook'] = form.webhook
  }

  const formData: FormData = {
    driver: form.driver,
    name: form.name,
    fields: fields,
  }

  submitLoading.value = true
  const { data, error } = await usePostApi(
    '/notification-api-keys/store', formData, true
  )
  submitLoading.value = false

  if (error.value && error.value.statusCode !== 200) {
    handleError(error)
  }

  const res = data.value as StoreNotificationApiKeyResponse
  if (res.status === 'success') {
    showNotification('success', 'Successfully added API key')
    apiKeys.value.push(res.data)
    resetForm()
  }
  else if (res.status === 'error') {
    showNotification('error', res.message)
  }
}

function resetForm() {
  form.chat_id = ''
  form.bot_token = ''
  form.webhook = ''
}
</script>
