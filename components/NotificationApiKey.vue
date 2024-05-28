<template>
  <Card class="mb-4 p-4">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-bold">
        {{ apiKey.name }} • {{ apiKey.driver }}
      </h2>

      <UButton
        icon="i-heroicons-trash"
        color="red"
        label="Delete" variant="link"
        @click="deleteModal = true" />
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400">{{ useTimeAgo(apiKey.created_at).value }}</p>

    <div class="mt-4">
      <div v-if="apiKey.bot_token" class="flex justify-between">
        <span class="font-medium">Bot Token:</span>
        <span>{{ apiKey.bot_token }}</span>
      </div>
      <div v-if="apiKey.chat_id" class="flex justify-between">
        <span class="font-medium">Chat ID:</span>
        <span>{{ apiKey.chat_id }}</span>
      </div>
      <div v-if="apiKey.webhook" class="flex justify-between">
        <span class="font-medium">Webhook URL:</span>
        <span>{{ apiKey.webhook }}</span>
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
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'

const props = defineProps<{
  apiKey: NotificationApiKey
}>()

const deleteModal = ref(false)
const deleteLoading = ref(false)
const mainStore = useMainStore()

async function deleteKey() {
  deleteLoading.value = true
  const { data, error } = await usePostApi(
    '/notification-api-keys/delete', {
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
  mainStore.notificationApiKeys = mainStore.notificationApiKeys.filter((
    key: NotificationApiKey
  ) => key.id !== props.apiKey.id)
}
</script>
