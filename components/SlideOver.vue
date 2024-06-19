<template>
  <USlideover
    v-model="open" :ui="{ width: 'w-screen ' + width }">
    <UCard
      class="flex flex-col flex-1 overflow-auto"
      :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-200 dark:divide-gray-700' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>

          <div>
            <slot name="buttons" />

            <button
              class="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              @click="open = false">
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </template>

      <slot />
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const open = defineModel({
  default: false,
})

const props = defineProps({
  title: String,
  size: { type: String, default: 'medium' }
})

const width = computed(() => {
  if (props.size === 'small') return 'max-w-2xl'
  if (props.size === 'big') return 'max-w-4xl'
  if (props.size === 'ultra') return 'max-w-6xl'
  return 'max-w-3xl'
})
</script>
