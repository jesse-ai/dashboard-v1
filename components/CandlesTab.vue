<template>
  <!-- Execution -->
  <div
    v-if="!form.debug_mode && results.executing && !results.showResults"
    class="flex flex-col items-center justify-center select-none mt-[10%]">
    <div>
      <CircleProgressbar :progress="results.progressbar.current" />
    </div>

    <h3 v-if="!results.exception.error" class="mt-8 animate-pulse" v-text="remainingTimeText" />

    <div class="mt-8">
      <UButton
        color="gray" :ui="{ color: { gray: { solid: 'text-rose-500 dark:text-rose-400' } } }"
        class="w-64 flex justify-center" icon="i-heroicons-no-symbol"
        size="xl" variant="solid"
        label="Cancel" :trailing="false"
        @click="candlesStore.cancel($route.params.id as string)" />
    </div>

    <!-- exception  -->
    <div v-if="results.exception.error && results.executing" class="mx-auto container mt-8">
      <Exception
        v-model="exceptionReport" :title="results.exception.error"
        :content="results.exception.traceback"
        mode="candles" />
    </div>
  </div>

  <LayoutsSidebar v-else>
    <template #left>
      <!-- alert -->
      <div v-if="results.alert.message" class="mb-8">
        <UAlert
          color="teal" icon="i-heroicons-check-circle"
          variant="soft"
          :title="results.alert.message"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link' }"
          @close="results.alert.message = ''" />
      </div>

      <!-- Content -->
      <div v-if="!results.executing && !results.showResults" class="pb-4">
        <!-- exchange -->
        <Divider title="Exchange" />
        <USelectMenu
          v-model="form.exchange"
          searchable
          placeholder="Select an exchange..."
          :options="backtestingExchangeNames" size="lg"
          class="mt-2"
          @change="updateSupportedSymbols" />

        <!-- symbol -->
        <Divider title="Symbol" class="mt-16" />
        <USelectMenu
          v-model="form.symbol"
          placeholder="ex: BTC-USDT"
          searchable
          :options="supportedSymbols"
          size="lg"
          class="mt-2"
        />

        <Divider title="Start Date" class="mt-16" />
        <UInput v-model="form.start_date" type="date" size="lg" class="mt-2" />
      </div>
    </template>

    <template #right>
      <!-- Action Buttons -->
      <div v-if="!results.executing">
        <div v-if="results.showResults">
          <button
            class="font-medium select-none items-center px-2.5 py-1.5 border border-transparent rounded shadow-sm text-white bg-indigo-600 dark:bg-indigo-400 hover:bg-indigo-700 dark:hover:bg-indigo-300 focus:outline-none dark:text-black text-base tracking-wide text-center block w-full mb-4"
            @click="backtestState.rerun($route.params.id as string)">
            Rerun
          </button>

          <button class="btn-secondary text-center block w-full mb-4" @click="backtestState.newBacktest($route.params.id as string)">
            New backtest
          </button>
        </div>

        <div v-else>
          <UButton
            class="w-full flex justify-center" icon="i-heroicons-bolt"
            size="xl" variant="solid"
            label="Start" :trailing="false"
            @click="start($route.params.id as string)" />

          <UButton
            class="w-full flex justify-center mt-4" color="gray"
            icon="i-heroicons-plus" size="xl"
            variant="solid" label="Start in a new tab"
            :trailing="false" @click="startInNewTab($route.params.id as string)" />
        </div>
      </div>
    </template>
  </LayoutsSidebar>
</template>

<script setup lang="ts">
import { useCandlesStore } from '~/stores/candleStore'
import { useMainStore } from '~/stores/mainStore'
import helpers from '@/utils/helpers'

const props = defineProps<{
  form: CandleTabForm
  results: CandleTabResults
}>()

const candlesStore = useCandlesStore()
const mainStore = useMainStore()
const backtestState = useBacktestStore()
const supportedSymbols = ref<string[]>([])
async function updateSupportedSymbols() {
  supportedSymbols.value = await mainStore.getExchangeSupportedSymbols(props.form.exchange)
}

props.results.alert.message = ''
const exceptionReport = ref(false)

const backtestingExchangeNames = computed(() => mainStore.backtestingExchangeNames)
const remainingTimeText = computed(() => helpers.remainingTimeText(props.results.progressbar.estimated_remaining_seconds))

const start = (id: string) => {
  if (!validate()) {
    return
  }

  candlesStore.start(id)
}

const startInNewTab = (id: string) => {
  if (!validate()) {
    return
  }

  candlesStore.startInNewTab(id)
}

function validate() {
  const ERRORS = {
    maxSymbolLengthErrorMessage: 'Maximum symbol length is exceeded!',
    mustContainDashErrorMessage: 'Symbol parameter must contain "-" character!',
    emptySymbolErrorMessage: 'Symbol parameter cannot be empty',
  }

  if (!props.form.exchange) {
    showNotification('error', 'Exchange parameter cannot be empty')
    return false
  }
  if (!props.form.symbol) {
    showNotification('error', ERRORS.emptySymbolErrorMessage)
    return false
  }
  if (!props.form.symbol.includes('-')) {
    showNotification('error', ERRORS.mustContainDashErrorMessage)
    return false
  }
  if (props.form.symbol.length > 13) {
    showNotification('error', ERRORS.maxSymbolLengthErrorMessage)
    return false
  }
  if (!props.form.start_date) {
    showNotification('error', 'Start date parameter cannot be empty')
    return false
  }

  return true
}
</script>
