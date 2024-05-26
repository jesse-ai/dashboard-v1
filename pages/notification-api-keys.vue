<template>
  <SmallContainer>
    <Heading>
      Notification API Keys
    </Heading>

    <p>
      Here you can add your API keys for various notification drivers. API keys are used to connect your account to the notification driver and allow the bot to send notifications on your behalf.
      <br><br>Please note that for security reasons, once created, API keys cannot be modified or seen again.
    </p>

    <br>

    <UForm :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Driver:" required>
        <USelect v-model="form.driver" :options="notificationDrivers" />
      </UFormGroup>

      <UFormGroup label="Notification Type:" required>
        <USelect v-model="form.type" :options="notificationTypes" />
      </UFormGroup>

      <UFormGroup label="Name:" required>
        <UInput
          v-model="form.name" type="text"
          placeholder="Give a name to this API key to identify it later"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'Telegram'" label="Bot Token:" required>
        <UInput
          v-model="form.bot_token" type="text"
          placeholder="Enter your Telegram bot token"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'Telegram'" label="Chat ID:" required>
        <UInput
          v-model="form.chat_id" type="text"
          placeholder="Enter your Telegram chat ID"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'Discord'" label="Webhook URL:" required>
        <UInput
          v-model="form.webhook" type="text"
          placeholder="Enter your Discord webhook URL"
        />
      </UFormGroup>

      <UFormGroup v-if="form.driver === 'Slack'" label="Webhook URL:" required>
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

useSeoMeta({ title: 'API Keys' })

const submitLoading = ref(false)
const mainStore = useMainStore()
const notificationTypes = ['General', 'Error']
const notificationDrivers = ['Telegram', 'Discord', 'Slack']

type FormData = {
  name: string
  type: string
  driver: string
  fields: string
}

const form = reactive({
  name: '',
  type: notificationTypes[0],
  driver: notificationDrivers[0],
  bot_token: '',
  chat_id: '',
  webhook: '',
})

const apiKeys = computed(() => mainStore.notificationApiKeys)
const isValidForm = computed(() => form.type && form.driver && form.fields)

async function submit() {
  if (!isValidForm.value) {
    showNotification('error', 'Please fill in all required fields')
    return
  }
  submitLoading.value = true

  const formData: FormData = {
    type: form.type,
    driver: form.driver,
    fields: form.fields,
  }

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
  form.type = notificationTypes[0]
  form.driver = ''
  form.fields = ''
}
</script>
