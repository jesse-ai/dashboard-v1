<template>
  <SmallContainer>
    <h1 class="font-serif text-2xl mb-4">
      API Tokens
    </h1>

    <p>
      Here you can generate a new API token or delete an existing one. API tokens are tied to the first IP address that
      accesses the API.
    </p>
    <br>
    <p>
      If you change your IP for any reason, you have to come back to this page to delete the old one
      and regenerate a new one.
    </p>

    <br>

    <UCard>
      <template #header>
        <h2 class="font-serif text-center">
          Create API Token
        </h2>
      </template>
      <UForm :state="form" @submit="submit">
        <UFormGroup label="Token Name" name="token_name">
          <UInput v-model="form.name" required type="text" label="Name" placeholder="A name to identify this token"/>
        </UFormGroup>

        <UFormGroup class="mt-2 flex justify-end">
          <UButton type="submit" color="primary" :loading="loading" icon="i-heroicons i-heroicons-key">
            Generate
          </UButton>
        </UFormGroup>
      </UForm>
    </UCard>

    <br>
    <br>

    <UCard v-if="tokens.length">
      <template #header>
        <h2 class="font-serif text-center">
          Existing API Tokens
        </h2>
      </template>

      <table class="min-w-full divide-y divide-gray-300 border">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">IP Address</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Delete</span>
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="token in tokens" :key="token.id">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ token.name }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ token.ip_address }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ useTimeAgo(token.created_at).value }}</td>
          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            <UButton type="button" color="rose" icon="i-heroicons i-heroicons-trash" @click="deleteToken(token.id)">
              Delete
            </UButton>
          </td>
        </tr>
        </tbody>
      </table>
    </UCard>
  </SmallContainer>

  <UModal v-model="openModal" :close-on-esc="false" :close-on-click-outside="false">
    <UCard>

      <template #header>
        <h2 class="font-serif text-center">
          API Token Created
        </h2>
      </template>
      <p>
        Please copy your new API token. For your security, it won't be shown again.
      </p>

      <div class="mt-4">
        <pre class="bg-gray-100 p-4 rounded break-words whitespace-pre-wrap font-mono text-sm">{{
            plainTextToken
          }}</pre>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton type="button" color="gray" @click="copy" icon="i-heroicons i-heroicons-clipboard" class="mr-2">
            Copy
          </UButton>

          <UButton type="button" color="primary" @click="openModal = false">
            Close
          </UButton>
        </div>
      </template>

    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import {useFetchApi1, usePostApi1} from "~/composables/useApi";
import {useTimeAgo} from "@vueuse/core";
import {setSeoMeta} from "~/utils/meta";

const seoTitle = 'API Tokens'
const seoDescription = 'Generate and manage API tokens for Jesse'
setSeoMeta(seoTitle, seoDescription)

const loading = ref(false)
const form = reactive({
  name: '',
})

const tokens = ref([] as ApiToken[])
const plainTextToken = ref('')
const openModal = ref(false)

const {data, error} = await useFetchApi1('/api-tokens', true)
if (error.value && error.value.statusCode !== 200) {
  showNotification('error', error.value.data.message)
} else {
  const res = data.value as ApiTokenResponse
  tokens.value = res.tokens
}

async function deleteToken(id: number) {
  const {data, error} = await usePostApi1(`/api-tokens/delete`, {id}, true)
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', error.value.data.message)
  } else {
    // remove from list
    tokens.value = tokens.value.filter(token => token.id !== id)
    showNotification('success', 'Token deleted successfully')
  }
}

async function submit() {
  loading.value = true
  const {data, error} = await usePostApi1('/api-tokens', form, true)
  loading.value = false
  const res = data.value as TokenCreationResponse

  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', error.value.data.message)
  } else {
    tokens.value.push(res.token)
    plainTextToken.value = res.access_token
    openModal.value = true
  }
}

function copy() {
  navigator.clipboard.writeText(plainTextToken.value)
  showNotification('success', 'Token copied to clipboard')
}
</script>
