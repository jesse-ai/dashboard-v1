<template>
  <Card class="mb-4">
    Exchange: {{ apiKey.exchange }}<br>
    Name: {{ apiKey.name }}<br>
    API Key: {{ apiKey.api_key }}<br>
    API Secret: {{ apiKey.api_secret }}<br>
    <div v-if="apiKey.exchange.startsWith('Dydx') || apiKey.exchange.startsWith('Apex')">
      API Passphrase: {{ apiKey.api_passphrase }}<br>
      Wallet Address: {{ apiKey.wallet_address }}<br>
      Stark Private Key: {{ apiKey.stark_private_key }}<br>
    </div>

    <UButton
      icon="trash" color="red"
      label="Delete" variant="link"
      @click="deleteModal = true" />

    <ConfirmModal
      v-model="deleteModal" title="Delete API Key"
      :description="`Are you sure you want to delete ${apiKey.name} API key?`"
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
