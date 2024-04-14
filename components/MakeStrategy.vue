<template>
  <div id="make-strategy-modal" class="w-full select-none">
    <p>
      Filling this form will create a new strategy class with all the starting methods in it.
    </p>

    <br>

    <UForm :state="form" class="space-y-4" @submit="create">
      <UFormGroup label="Strategy name:" required>
        <UInput v-model="form.name" placeholder="ex: MyAwesomeStrategy01" type="text" />
      </UFormGroup>

      <div v-if="form.name.length">
        <p>The strategy will be located at:</p>
        <pre
          class="mt-2 text-sm whitespace-pre-line px-6 py-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-800 border border-gray-200 select-text">
            {{ `strategies/${form.name}/__init__.py` }}
          </pre>
      </div>

      <div class="flex justify-end">
        <UButton
          id="make-strategy-cancel-button" color="gray"
          variant="link" class="mr-8"
          label="Cancel"
          @click="makeStrategy = false" />

        <UButton
          id="make-strategy-submit-button" type="submit"
          class="w-48 flex justify-center " label="Create"
          :loading="loadingBtn" :disabled="!form.name.length" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'

const loadingBtn = ref(false)
const makeStrategy = defineModel()
const store = useMainStore()
const form = reactive({
  name: '',
})

const strategies = computed(() => store.strategies)

async function create () {
  if (!form.name.length) {
    showNotification('error', 'Please enter a name for the strategy')
    return
  }
  loadingBtn.value = true

  const { data, error } = await usePostApi('/make-strategy', {
    name: form.name,
  }, true)

  loadingBtn.value = false
  if (error.value && error.value.statusCode !== 200) {
    showNotification('error', `[${error.value.statusCode}]: Something went wrong. If this persists, please contact support.`)
  }


  const res = data.value as MakeStrategyResponse
  if (res.status === 'success') {
    showNotification('success', 'Successfully created strategy')
    strategies.value.push(form.name)
    strategies.value.sort()
    makeStrategy.value = false
  }
  else if (res.status === 'error') {
    showNotification('error', res.message)
  }
}
</script>
