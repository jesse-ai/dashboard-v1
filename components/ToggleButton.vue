<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="font-medium text-gray-700 dark:text-gray-200">
        {{ title }} <span v-if="disabled" class="opacity-70 text-sm">({{ disabledGuide }})</span>
      </div>

      <UToggle v-model="(btnModel as boolean)" :disabled="disabled" />
    </div>

    <div class="text-sm text-gray-500 dark:text-gray-400 mt-2" @if="description">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
const btnModel = defineModel({ type: Boolean, default: false })

const props = defineProps<{
  title: string
  description?: string
  disabled?: boolean
  disabledGuide?: string
}>()

if (props.disabled) {
  btnModel.value = false
}
</script>
