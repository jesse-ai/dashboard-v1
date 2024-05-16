<template>
  <!-- Debugger Logs -->
  <SlideOver v-if="form.debug_mode" v-model="results.logsModal" title="Logs">
    <template #default>
      <Logs :logs="results.infoLogs" />
    </template>

    <template #buttons>
      <button
        class="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
        @click="copyInfoLogs">
        <CheckIcon v-if="copiedLogsInfo" class="h-6 w-6" aria-hidden="true" />
        <ClipboardIcon v-if="!copiedLogsInfo && results.infoLogs.length != 0" class="h-6 w-6" aria-hidden="true" />
      </button>
      <input id="copy-info-logs" type="hidden" :value="results.infoLogs">
    </template>
  </SlideOver>

  <LayoutsSidebar>
    <template #left>
      <!-- alert -->
      <div v-if="results.alert.message" class="mb-8">
        <UAlert
          color="teal" icon="i-heroicons-check-circle"
          variant="soft" :title="results.alert.message"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link' }"
          @close="results.alert.message = ''" />
      </div>

      <!-- exception  -->
      <div v-if="results.exception.error && results.executing" class="mb-8">
        <Exception
          v-model="exceptionReport" :title="results.exception.error"
          :content="results.exception.traceback"
          mode="optimize" />
      </div>

      <!-- Execution -->
      <div v-if="(results.executing || results.showResults) && !results.exception.error">
        <Divider title="Info" />
        <KeyValueTable v-if="results.generalInfo.length" :data="results.generalInfo" class="my-4" />
        <TablePlaceholder v-else class="my-4" />

        <div v-if="results.best_candidates.length" class="mt-16">
          <Divider title="Best DNA Candidates" class="my-4" />
          <MultipleValuesTable
            :data="results.best_candidates"
            :header-items="['Rank', 'DNA', 'Fitness', 'Training-Testing winrate', 'Training-testing total trades', 'Training-Testing PNL']"
            header />
        </div>
      </div>

      <!-- Content -->
      <div v-if="!results.executing && !results.showResults">
        <Routes :total-routes-error="totalRoutesError" :form="form" :results="results" mode="optimization" />

        <Divider class="mt-16 mb-4" title="Duration" />
        <div class="flex items-center select-none flex-1 mb-4">
          <UInput
            v-model="form.start_date" type="date"
            variant="outline" size="xl"
            class="w-full mr-2" />

          <UInput
            v-model="form.finish_date" type="date"
            variant="outline" size="xl"
            class="w-full ml-2" />
        </div>

        <Divider class="mt-16 mb-4" title="Optimal Trades" />
        <div class="select-none">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            The number that tells Jesse how many trades you would find optimal for your strategy in the targeted time
            period so that it can filter out those DNAs that cause too few trades.
            <a
              href="https://docs.jesse.trade/docs/optimize/executing-the-optimize-mode.html" target="_blank"
              class="font-semibold hover:underline italic">More Details...</a>
          </p>
          <br>
          <NumberInput v-model="form.optimal_total" title="Optimal number of trades:" :default="7" />
        </div>

        <Divider class="mt-16 mb-4" title="Options" />
        <div class="grid grid-cols-1 gap-6">
          <!-- debug mode -->
          <ToggleButton
            v-model="form.debug_mode" title="Debug Mode"
            description="Displays detailed logs about the genetics algorithm. Use it if you are interested in the genetics algorithm and are familiar with its basics." />
        </div>
      </div>
    </template>

    <template #right>
      <!-- Action Buttons -->
      <div v-if="!results.executing && !results.showResults">
        <div>
          <UButton
            class="w-full flex justify-center" icon="i-heroicons-bolt"
            size="xl" variant="solid"
            label="Start" :trailing="false"
            @click="start()" />
        </div>
      </div>

      <!-- Execution -->
      <div
        v-if="results.executing && !results.showResults"
        class="flex flex-col items-center justify-center select-none">
        <div class="mb-8 w-full">
          <UButton
            color="gray" :ui="{ color: { gray: { solid: 'text-rose-500 dark:text-rose-400' } } }"
            class="w-full flex justify-center" icon="i-heroicons-no-symbol"
            size="xl" variant="solid"
            label="Cancel" :trailing="false"
            @click="cancel()" />

          <a
            v-if="form.debug_mode" :href="logsUrl"
            class="flex justify-center items-center btn-secondary text-center mb-4 mt-4 w-full">
            <UButton
              class="w-full flex justify-center" color="gray"
              size="xl" variant="solid"
              label="Debugging Logs" icon="i-heroicons-document-arrow-down"
              :trailing="false" />
          </a>
        </div>

        <div>
          <CircleProgressbar :progress="results.progressbar.current" />
        </div>

        <h3
          v-if="!results.exception.error && !results.best_candidates.length" class="mt-8 animate-pulse"
          v-text="remainingTimeText" />
      </div>
      <!-- Show Results -->
      <div v-if="results.showResults">
        <div class="mb-8 w-full">
          <UButton
            class="w-full flex justify-center" icon="i-heroicons-arrow-uturn-left"
            size="xl" variant="solid"
            label="New Session" :trailing="false"
            @click="newSession" />

          <a
            v-if="form.debug_mode" :href="logsUrl"
            class="flex justify-center items-center btn-secondary text-center my-4 w-full">
            <UButton
              color="gray" variant="solid"
              label="Debugging Logs" icon="i-heroicons-document-arrow-down"
              block size="xl"
              :trailing="false" />
          </a>
        </div>
      </div>
    </template>
  </LayoutsSidebar>
</template>

<script setup lang="ts">
import { CheckIcon, ClipboardIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { useOptimizationStore } from '~/stores/optimizationStore'

useSeoMeta({ title: 'Optimization - Jesse' })

const optimizationStore = useOptimizationStore()
const form = computed(() => optimizationStore.form)
const results = computed(() => optimizationStore.results)

const exceptionReport = ref(false)
const copiedLogsInfo = ref(false)
const baseURL = ref(useRuntimeConfig().public.apiBaseUrl)
const totalRoutesError = ref<string[]>([])

const authKey = computed(() => useMainStore().authToken)
const remainingTimeText = computed(() => helpers.remainingTimeText(results.value.progressbar.estimated_remaining_seconds))
const logsUrl = computed(() => {
  let url = `/download/optimize/log?token=${authKey.value}`
  if (baseURL.value !== '/') {
    url = baseURL.value + url
  }
  return url
})

const { cancel } = useOptimizationStore()

const start = () => {
  if (totalRoutesError.value.length) {
    const routeSection = document.getElementById('routes-section')
    if (routeSection) {
      const offsetTop = routeSection.offsetTop
      // scroll to routes section
      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
    for (let i = 0; i < totalRoutesError.value.length; i++) {
      setTimeout(() => {
        showNotification('error', totalRoutesError.value[i])
      }, i * 100)
    }
    return
  }

  useOptimizationStore().start()
}

function copyInfoLogs() {
  navigator.clipboard.writeText(results.value.infoLogs)
  showNotification('success', 'Logs copied successfully')
  copiedLogsInfo.value = true

  setTimeout(() => {
    copiedLogsInfo.value = false
  }, 3000)
}

function newSession() {
  results.value.showResults = false
  results.value.executing = false
  results.value.progressbar.current = 0
  results.value.progressbar.estimated_remaining_seconds = 0
  results.value.alert.message = ''
  results.value.alert.type = ''
}

// make sure finish_date is always greater than start_date
watch(() => form.value.start_date, (val) => {
  if (form.value.finish_date < val) {
    form.value.finish_date = val
  }
})

watch(() => form.value.finish_date, (val) => {
  if (form.value.start_date > val) {
    form.value.start_date = val
  }
})
</script>
