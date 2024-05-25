<template>
  <Card class="mb-4 p-4">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-bold">
        {{ apiKey.name }} • {{ apiKey.exchange }}
      </h2>
      <UButton
        icon="i-heroicons-trash"
        color="red"
        label="Delete" variant="link"
        @click="deleteModal = true" />
    </div>

    <p class="text-sm text-gray-500">{{ useTimeAgo(apiKey.created_at).value }}</p>

    <div class="mt-4">
      <div class="flex justify-between">
        <span class="font-medium">API Key:</span>
        <span>{{ apiKey.api_key }}</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">API Secret:</span>
        <span>{{ apiKey.api_secret }}</span>
      </div>
      <div v-if="apiKey.exchange.startsWith('Dydx') || apiKey.exchange.startsWith('Apex')">
        <div class="flex justify-between">
          <span class="font-medium">API Passphrase:</span>
          <span>{{ apiKey.api_passphrase }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">Wallet Address:</span>
          <span>{{ apiKey.wallet_address }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium">Stark Private Key:</span>
          <span>{{ apiKey.stark_private_key }}</span>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-model="deleteModal" title="Delete API Key"
      :description="`Are you sure you want to delete '${apiKey.name}' API key?`"
      type="info">
      <UButton
        variant="solid" color="red"
        class="flex justify-center" label="Delete"
        :loading="deleteLoading"
        @click="deleteKey" />
    </ConfirmModal>
  </Card>
</template>

<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'

const props = defineProps<{
  apiKey: ExchangeApiKey
}>()

const deleteModal = ref(false)
const deleteLoading = ref(false)
const mainStore = useMainStore()

async function deleteKey() {
  deleteLoading.value = true
  const { data, error } = await usePostApi(
    '/exchange-api-keys/delete', {
      id: props.apiKey.id
    }, true
  )
  deleteLoading.value = false
  if (error.value && error.value.statusCode !== 200) {
    handleError(error)
    return
  }
  deleteModal.value = false
  showNotification('success', 'API Key deleted successfully')
  mainStore.exchangeApiKeys = mainStore.exchangeApiKeys.filter((
    key: ExchangeApiKey
  ) => key.id !== props.apiKey.id)
}
</script>
