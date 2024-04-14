<template>
  <div class="mb-4">
    <div class="hidden sm:block">
      <nav
        class="relative rounded-lg shadow flex divide-x divide-gray-200 dark:divide-gray-700"
        aria-label="props.Tabs">
        <div
          v-for="(tab, name, index) in props.tabs" :key="tab.id"
          class="relative group min-w-0 flex-1 overflow-hidden text-center flex items-center ">
          <NuxtLink
            :to="`/candles/${tab.id}`"
            :class="[tab.id === pageId ? 'text-gray-900 dark:text-gray-100 font-bold ' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 font-medium ', 'py-3 px-4 inline-block select-none cursor-pointer focus:outline-none  w-full text-sm bg-white dark:bg-backdrop-dark']">
            <span>{{ getTitle(tab) }}</span>

            <span
              aria-hidden="true"
              :class="[tab.id === pageId && (Object.keys(props.tabs).length > 1) ? 'bg-indigo-400' : 'bg-transparent dark:bg-gray-600', 'absolute inset-x-0 bottom-0 h-0.5']" />
          </NuxtLink>

          <!-- Tab close button -->
          <button
            v-show="Object.keys(props.tabs).length > 1" :data-cy="'tab-close-button' + index"
            class="absolute right-[1em] focus:outline-none" @click="emit('close', tab.id)">
            <XMarkIcon
              class="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
              aria-hidden="true" />
          </button>
        </div>

        <!-- New Tab Button -->
        <div
          class="select-none cursor-pointer text-gray-400 dark:text-gray-100 hover:text-gray-600 focus:outline-none group relative w-14 overflow-hidden bg-white dark:bg-backdrop-dark py-3 px-4 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center "
          @click="useCandlesStore().addTab()">
          <button class="absolute right-[1em] focus:outline-none ">
            <PlusIcon class="h-6 w-6 rounded-full" aria-hidden="true" />
          </button>
          <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-0.5 bg-transparent dark:bg-gray-600" />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useCandlesStore } from '~/stores/candleStore'

const route = useRoute()
const pageId = ref(route.params.id as string)

const emit = defineEmits(['close'])

const props = defineProps<{
  tabs: CandleTabs
}>()

function getTitle (tab: CandleTab) {
  // if error, show error
  if (tab.results.exception.error && tab.results.executing) {
    return `Error`
  }

  if (tab.results.executing) {
    return `${tab.form.symbol.toUpperCase()} • ${tab.form.start_date} | ${tab.results.progressbar.current}%`
  }

  if (tab.form.symbol) {
    return `${tab.form.symbol.toUpperCase()} • ${tab.form.start_date}`
  }

  return `${tab.form.start_date}`
}
</script>
