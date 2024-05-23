<template>
  <div id="make-strategy-modal" class="w-full select-none">
    <KeyValueTable :data="(tableData as [])" />

    <div class="flex justify-end mt-8">
      <UButton
        id="feedback-cancel-button"
        color="gray"
        block
        label="Close" @click="about = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores/mainStore'

const about = defineModel()
const store = useMainStore()
const systemInfo = computed(() => store.systemInfo)

const tableData = computed(() => {
  return Object.entries(systemInfo.value).map(([key, value]) => [key, value])
})
</script>
