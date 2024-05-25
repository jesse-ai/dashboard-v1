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
      @click="deleteKey(apiKey.id)" />

    <ConfirmModal
      v-model="deleteModal" title="Delete API Key"
      :description="`Are you sure you want to delete ${apiKey.name} API key?`"
      type="info">
      <UButton
        variant="solid" color="red"
        class="flex justify-center" label="Delete"
        @click="stop($route.params.id as string)" />
    </ConfirmModal>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  apiKey: ExchangeApiKey
}>()

const deleteModal = ref(false)

function deleteKey(id: string) {
  useConfirmDialog({
    title: 'Delete API Key',
    message: 'Are you sure you want to delete this API key?',
    onConfirm: async () => {
      const { data, error } = await usePostApi(
        '/exchange-api-keys/delete', { id }, true
      )

      if (error.value && error.value.statusCode !== 200) {
        handleError(error)
      }

      const res = data.value as DeleteExchangeApiKeyResponse
      if (res.status === 'success') {
        showNotification('success', 'Successfully deleted API key')
        const index = apiKeys.value.findIndex(a => a.id === id)
        apiKeys.value.splice(index, 1)
      }
      else if (res.status === 'error') {
        showNotification('error', res.message)
      }
    }
  })
}
</script>
