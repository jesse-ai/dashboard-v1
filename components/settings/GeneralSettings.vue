<template>
  <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
    <Card>
      <Heading>
        Browser Cache
      </Heading>

      <p>
        Jesse uses browser cache to store some data to speed up the app. However, sometimes this cache might get
        corrupted
        or outdated for example after an update. In such cases, you can clear the cache by clicking the button below.
      </p>

      <br>

      <div class="flex justify-end items-center">
        <UButton @click="clearCacheConfirmation = true" color="rose" size="xl" variant="outline">
          Clear Cache
        </UButton>
      </div>

      <!-- Clear Cache Confirmation Modal -->
      <ConfirmModal title="Clear Cache"
                    description="Are you sure you want to clear the cache? This will remove all the data stored in the browser cache and reload the app."
                    type="info" v-model="clearCacheConfirmation">
        <UButton @click="clearCache"
                 variant="solid"
                 color="rose"
                 size="lg"
                 label="Clear Cache"/>
      </ConfirmModal>
    </Card>
  </div>
</template>

<script setup lang="ts">
const clearCacheConfirmation = ref(false)

function clearCache() {
  localStorage.clear()
  location.reload()
  clearCacheConfirmation.value = false
}
</script>
