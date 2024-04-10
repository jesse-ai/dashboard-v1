<template>
  <UModal v-model="(model as boolean)">
    <div class="inline-block px-4 pt-5 pb-4">
      <div class="w-full flex justify-between items-center">
        <div class="flex items-center">
          <div v-if="type === 'info'" class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <InformationCircleIcon check-icon :class="colors.text" class="h-7 w-7" aria-hidden="true" />
          </div>
          <div v-else-if="type === 'danger'" class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <NoSymbolIcon check-icon :class="colors.text" class="h-7 w-7" aria-hidden="true" />
          </div>
          <div v-else-if="type === 'success'" class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
            <CheckIcon :class="colors.text" class="h-7 w-7" aria-hidden="true" />
          </div>
          <div v-else class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon :class="colors.text" check-icon class="h-7 w-7 " aria-hidden="true" />
          </div>

          <!-- title -->
          <h3 class="text-gray-600 dark:text-gray-200 font-semibold ml-2 text-xl">
            {{ title }}
          </h3>
        </div>

        <UButton icon="i-heroicons-x-mark" variant="link" color="gray" class="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none" @click="model = false" />
      </div>

      <div :class="[description ? '' : 'items-center', 'flex items-start justify-start']">
        <div class="mt-3 sm:mt-0 sm:ml-4 text-left">
          <div v-if="description" class="my-4 ml-8">
            <p class="text-gray-500 dark:text-gray-300">
              {{ description }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-5 sm:mt-4 flex justify-end">
        <!-- action button which must insert in main component -->
        <UButton variant="link" color="gray" class="mr-4" size="lg" :label="type === 'danger' ? 'Cancel' : 'Close'" @click="model = false" />
        <slot />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { NoSymbolIcon, ExclamationTriangleIcon, CheckIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const model = defineModel()

const props = defineProps<{
  title: String;
  description?: String;
  type: String;
}>()

const colors = computed(() => {
  const color = {} as { text: string }
  switch (props.type) {
    case 'info':
      color.text = 'text-gray-600 dark:text-gray-200'
      return color
    case 'warning':
      color.text = 'text-yellow-600 dark:text-yellow-400'
      return color
    case 'success':
      color.text = 'text-green-400 dark:text-green-600'
      return color
    case 'danger':
      color.text = 'text-red-600 dark:text-red-400'
      return color
  }
  return color
})
</script>
