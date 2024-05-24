<template>
  <div id="exchange-api-keys" class="w-full select-none">
    <p>
      This page allows you to add new Exchange API keys. Please note that for security reasons, once created, API keys cannot be modified or seen again. You can only delete or create new ones.
    </p>

    <br>

    <UForm :state="form" class="space-y-4" @submit="create">
      <UFormGroup label="Exchange name:" required>
        <USelect v-model="form.exchange" :options="exchanges.map(e => e.name)" />
      </UFormGroup>

      <UFormGroup v-for="field in selectedExchange.fields" :key="field" :label="field + ':'" required>
        <UInput v-model="form[field]" type="text" />
      </UFormGroup>

      <div class="flex justify-end">
        <UButton
          id="api-keys-cancel-button" color="gray"
          variant="link" class="mr-8"
          label="Cancel"
          @click="resetForm" />

        <UButton
          id="api-keys-submit-button" type="submit"
          class="w-48 flex justify-center " label="Create"
          :loading="loadingBtn" :disabled="!isValidForm" />
      </div>
    </UForm>

    <div class="mt-8">
      <h2 class="text-lg font-semibold">Previously Created API Keys</h2>
      <div v-for="key in apiKeys" :key="key.id">
        <p>{{ key.exchange }}</p>
        <UButton label="Delete" @click="deleteKey(key.id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'

const loadingBtn = ref(false)
const mainStore = useMainStore()
const form = reactive({
  exchange: '',
  apiKey: '',
  apiSecret: '',
  starkPublicKey: '',
  starkPrivateKey: '',
})

const exchanges = [
  {
    name: 'Exchange1',
    fields: ['API Key', 'API Secret'],
  },
  {
    name: 'Exchange2',
    fields: ['API Key', 'API Secret'],
  },
  {
    name: 'ExchangeWithStarkKeys',
    fields: ['API Key', 'API Secret', 'Stark Public Key', 'Stark Private Key'],
  },
]

const apiKeys = computed(() => mainStore.exchangeApiKeys)

const selectedExchange = computed(() => {
  return exchanges.find(exchange => exchange.name === form.exchange)
})

const isValidForm = computed(() => {
  // Add your own validation logic here
  return form.exchange && form.apiKey && form.apiSecret
})

async function create() {
  if (!isValidForm.value) {
    showNotification('error', 'Please fill in all required fields')
    return
  }
  loadingBtn.value = true

  const { data, error } = await usePostApi('/exchange-api-keys', form, true)

  loadingBtn.value = false
  if (error.value && error.value.statusCode !== 200) {
    handleError(error)
  }

  const res = data.value as StoreExchangeApiKeyResponse
  if (res.status === 'success') {
    showNotification('success', 'Successfully added API key')
    apiKeys.value.push(form)
    resetForm()
  }
  else if (res.status === 'error') {
    showNotification('error', res.message)
  }
}

function resetForm() {
  form.exchange = ''
  form.apiKey = ''
  form.apiSecret = ''
  form.starkPublicKey = ''
  form.starkPrivateKey = ''
}

// async function deleteKey(id) {
//   // Add your own delete logic here
// }
</script>
