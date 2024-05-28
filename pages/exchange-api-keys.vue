<template>
  <SmallContainer>
    <Heading>
      Exchange API Keys
    </Heading>

    <p>
      Here you can add your API keys for various exchanges. API keys are used to connect your account to the exchange and allow the bot to trade on your behalf.
      <br><br>Please note that for security reasons, once created, API keys cannot be modified or seen again.
    </p>

    <br>

    <UForm :state="form" class="space-y-4" @submit="submit">
      <UFormGroup label="Exchange name:" required>
        <USelect v-model="form.exchange" :options="mainStore.liveTradingExchangeNames" />
      </UFormGroup>

      <UFormGroup
        label="General Notifications:"
        help="Select a notification driver to receive general (all) notifications"
      >
        <template #hint>
          <UButton
            to="/notification-api-keys"
            icon="i-heroicons-information-circle"
            variant="link" size="xs">
            Notification API Keys
          </UButton>
        </template>
        <template #default>
          <USelect
            v-model="form.general_notifications_id"
            :disabled="!notifications_items.length"
            placeholder="Select a notification driver"
            :options="notifications_items" />
        </template>
      </UFormGroup>

      <UFormGroup
        label="Error Notifications:"
        help="Select a notification driver to receive error notifications only"
      >
        <template #hint>
          <UButton
            to="/notification-api-keys"
            icon="i-heroicons-information-circle"
            variant="link" size="xs">
            Notification API Keys
          </UButton>
        </template>
        <template #default>
          <USelect
            v-model="form.error_notifications_id"
            :disabled="!notifications_items.length"
            placeholder="Select a notification driver"
            :options="notifications_items" />
        </template>
      </UFormGroup>

      <UFormGroup label="Name:" required>
        <UInput
          v-model="form.name" type="text"
          placeholder="Give a name to this API key (e.g. subaccount1)"
        />
      </UFormGroup>

      <UFormGroup label="API Key:" required>
        <UInput
          v-model="form.apiKey"
          placeholder="Enter your API key here"
          type="text" />
      </UFormGroup>

      <UFormGroup label="API Secret:" required>
        <UInput
          v-model="form.apiSecret"
          placeholder="Enter your API secret here"
          type="text" />
      </UFormGroup>

      <UFormGroup
        v-if="showAdditionalFields"
        label="API Passphrase:" required>
        <UInput
          v-model="form.apiPassphrase"
          placeholder="Enter your API passphrase here"
          type="text" />
      </UFormGroup>

      <UFormGroup
        v-if="showAdditionalFields"
        label="Wallet Address:" required>
        <UInput
          v-model="form.walletAddress"
          placeholder="Enter your wallet address here"
          type="text" />
      </UFormGroup>

      <UFormGroup
        v-if="showAdditionalFields"
        label="Stark Private Key:" required>
        <UInput
          v-model="form.stark_private_key"
          placeholder="Enter your Stark private key here"
          type="text" />
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

      <ExchangeApiKey v-for="a in apiKeys" :key="a.id" :api-key="a" />
    </div>
  </SmallContainer>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'
import SmallContainer from '~/components/SmallContainer.vue'
import ExchangeApiKey from '~/components/ExchangeApiKey.vue'

useSeoMeta({ title: 'API Keys' })

const submitLoading = ref(false)
const mainStore = useMainStore()
const notifications_items = computed(() => {
  return mainStore.notificationApiKeys.map(n => ({
    label: `${n.name} - ${n.driver}`,
    value: n.id,
  }))
})

type FormData = {
  name: string
  exchange: string
  general_notifications_id: string | null
  error_notifications_id: string | null
  api_key: string
  api_secret: string
  additional_fields?: {
    api_passphrase: string
    wallet_address: string
    stark_private_key: string
  }
}

const form = reactive({
  exchange: mainStore.liveTradingExchangeNames[0],
  name: '',
  general_notifications_id: '',
  error_notifications_id: '',
  apiKey: '',
  apiSecret: '',
  apiPassphrase: '',
  walletAddress: '',
  stark_private_key: '',
})

const apiKeys = computed(() => mainStore.exchangeApiKeys)
const showAdditionalFields = computed(() => form.exchange.startsWith('Dydx') || form.exchange.startsWith('Apex'))
const isValidForm = computed(() => {
  if (form.exchange.startsWith('Dydx') || form.exchange.startsWith('Apex')) {
    return form.exchange && form.apiKey && form.apiSecret && form.apiPassphrase && form.walletAddress && form.stark_private_key
  }
  return form.exchange && form.apiKey && form.apiSecret
})

async function submit() {
  if (!isValidForm.value) {
    showNotification('error', 'Please fill in all required fields')
    return
  }
  submitLoading.value = true

  const formData: FormData = {
    name: form.name,
    general_notifications_id: form.general_notifications_id,
    error_notifications_id: form.error_notifications_id,
    exchange: form.exchange,
    api_key: form.apiKey,
    api_secret: form.apiSecret,
  }

  if (showAdditionalFields.value) {
    formData.additional_fields = {
      api_passphrase: form.apiPassphrase,
      wallet_address: form.walletAddress,
      stark_private_key: form.stark_private_key,
    }
  }

  const { data, error } = await usePostApi(
    '/exchange-api-keys/store', formData, true
  )

  submitLoading.value = false
  if (error.value && error.value.statusCode !== 200) {
    handleError(error)
  }

  const res = data.value as StoreExchangeApiKeyResponse
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
  form.exchange = mainStore.liveTradingExchangeNames[0]
  form.name = ''
  form.general_notifications_id = ''
  form.error_notifications_id = ''
  form.apiKey = ''
  form.apiSecret = ''
  form.apiPassphrase = ''
  form.walletAddress = ''
  form.stark_private_key = ''
}
</script>
