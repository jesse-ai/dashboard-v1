<template>
  <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
    <Card>
      <Heading>
        Browser Cache
      </Heading>

      <p>
        Jesse uses browser cache to store some data to speed up the app. However, sometimes this cache might get
        corrupted or outdated for example after an update.
        <br><br>In such cases, you can clear the cache by clicking the button below.
      </p>

      <br>

      <div class="flex justify-end items-center">
        <UButton color="rose" size="xl" variant="outline" @click="clearCacheConfirmation = true">
          Clear Browser Cache
        </UButton>
      </div>

      <!-- Clear Cache Confirmation Modal -->
      <ConfirmModal
        v-model="clearCacheConfirmation" title="Clear Browser Cache"
        description="Are you sure you want to clear the cache? This will remove all the data stored in the browser cache and reload the app." type="info"
      >
        <UButton
          variant="solid" color="rose"
          label="Clear Browser Cache" size="lg"
          @click="clearCache"
        />
      </ConfirmModal>
    </Card>

    <Card>
      <Heading>
        Database Cache
      </Heading>

      <p>
        When you execute a backtest, Jesse caches those candles so that when you change your strategy and rerun your
        backtest on the same dataset, your future reruns would be significantly faster. <br><br>
        However, sometimes there could be some issues that might require you to clear this cache in order to fix it.
      </p>

      <br>

      <div class="flex justify-end items-center">
        <UButton color="rose" size="xl" variant="outline" @click="clearCandleDatabaseCacheConfirmation = true">
          Clear Database Cache
        </UButton>
      </div>

      <!-- Clear Cache Confirmation Modal -->
      <ConfirmModal
        v-model="clearCandleDatabaseCacheConfirmation" title="Clear Database Cache"
        description="Are you sure you want to clear the candle database cache?" type="info">
        <UButton
          variant="solid" color="rose"
          size="lg" label="Clear Database Cache"
          @click="clearCandleDatabaseCache" />
      </ConfirmModal>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { usePostApi } from '~/composables/useApi'
import { handleError } from '~/composables/notifications'

const clearCacheConfirmation = ref(false)
const clearCandleDatabaseCacheConfirmation = ref(false)

function clearCache () {
  localStorage.clear()
  location.reload()
  clearCacheConfirmation.value = false
}

async function clearCandleDatabaseCache () {
  const { data, error } = await usePostApi('/clear-candles-database-cache', {}, true)

  if (error.value) {
    handleError(error.value)
    return
  }

  const res = data.value as ClearCandlesDatabaseCacheResponse

  if (res.status === 'success') {
    clearCandleDatabaseCacheConfirmation.value = false
    showNotification('success', res.message)
  }
  else {
    showNotification('error', 'Failed to clear the candle database cache')
  }
}
</script>
