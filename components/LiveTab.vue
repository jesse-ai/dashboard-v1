<template>
  <!-- orders modal -->
  <SlideOver v-model="ordersModal" size="ultra" title="Orders">
    <LiveOrders :orders="results.orders" />
  </SlideOver>

  <!-- report without exception -->
  <SlideOver v-model="reportWithoutExceptionModal" size="small" title="Report">
    <ReportLiveSession @close="reportWithoutExceptionModal = false" />
  </SlideOver>

  <!-- general logs modal -->
  <SlideOver v-model="infoLogsModal" title="Info Logs">
    <template #default>
      <Logs :logs="results.infoLogs" />
    </template>

    <template #buttons>
      <!-- copy button -->
      <button class="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none" @click="copyInfoLogs">
        <CheckIcon v-if="copiedLogsInfo" class="h-6 w-6" aria-hidden="true" />
        <ClipboardIcon v-if="!copiedLogsInfo && results.infoLogs.length != 0" class="h-6 w-6" aria-hidden="true" />
      </button>
    </template>
  </SlideOver>

  <!-- error logs modal -->
  <SlideOver v-model="errorLogsModal" title="Error Logs">
    <template #default>
      <Logs :logs="results.errorLogs" />
    </template>

    <template #buttons>
      <button class="ml-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none" @click="copyErrorLogs">
        <CheckIcon v-if="copiedErrorLogs" class="h-6 w-6" aria-hidden="true" />
        <ClipboardIcon v-if="!copiedErrorLogs && results.errorLogs.length != 0" class="h-6 w-6" aria-hidden="true" />
      </button>
    </template>
  </SlideOver>

  <!-- session termination modal -->
  <ConfirmModal v-model="terminationConfirmModal" title="Termination Confirm" description="Are you sure you want to terminate this session?" type="info">
    <UButton
      variant="solid" color="red"
      class="flex justify-center" label="Terminate"
      @click="stop($route.params.id as string)" />
  </ConfirmModal>

  <!-- Execution -->
  <div v-if="results.booting" class="flex flex-col items-center justify-center select-none mt-[10%]">
    <div>
      <CircleProgressbar :progress="results.progressbar.current" />
    </div>

    <h3 v-if="!results.exception.error" class="mt-8 animate-pulse" v-text="remainingTimeText" />

    <div class="mt-8">
      <UButton
        v-if="form.debug_mode" icon="i-heroicons-clipboard-document-list"
        variant="solid" label="View Logs"
        size="xl" class="flex justify-center w-64"
        @click="infoLogsModal = true" />

      <UButton
        color="gray" class="w-64 flex justify-center mt-4"
        size="xl" :ui="{ color: { gray: { solid: 'text-rose-500 dark:text-rose-400' } } }"
        icon="i-heroicons-no-symbol" variant="solid"
        label="Cancel" :trailing="false"
        @click="cancel($route.params.id as string)" />
    </div>

    <!-- exception  -->
    <div v-if="results.exception.error" class="mx-auto container mt-8">
      <Exception
        v-model="exceptionReport" :title="results.exception.error"
        :content="results.exception.traceback" mode="live"
        :debug-mode="form.debug_mode" />
    </div>
  </div>

  <LayoutsSidebar v-else>
    <template #left>
      <!-- form -->
      <div v-if="!results.booting && !results.monitoring && !results.showResults" data-cy="live-page-content">
        <!-- exchange -->
        <Divider class="mb-4" title="Exchange" />
        <USelectMenu
          v-if="form.paper_mode"
          v-model="form.exchange"
          placeholder="Select an exchange..."
          searchable
          :options="exchangeItems"
          size="lg"
          class="mt-2 mb-16" @change="updateSupportedSymbols"
        />
        <USelectMenu
          v-else
          v-model="form.exchange_api_key"
          placeholder="Select an exchange..."
          searchable
          value-attribute="value"
          :options="exchangeItems"
          size="lg"
          class="mt-2 mb-16" @change="updateSupportedSymbols">
          <template #empty>
            <div class="flex justify-between items-center">
              <span>
                No exchange API keys found. Please add at least one:
              </span>
              <UButton
                to="/exchange-api-keys"
                icon="i-heroicons-plus"
                type="link"
                variant="solid" size="sm"
                label="Add Exchange API Key" />
            </div>
          </template>
        </USelectMenu>

        <Routes
          :total-routes-error="totalRoutesError" :form="form"
          :results="results" mode="live"
          :symbols="supportedSymbols"
          :timeframes="timeframeItems" />

        <!-- options -->
        <Divider class="mt-16 mb-4" title="Options" />

        <div class="grid grid-cols-1 gap-6">
          <ToggleButton
            v-model="form.debug_mode"
            title="Debug Mode" description="Logs more details, helpful for debugging." />

          <ToggleButton
            v-model="form.paper_mode"
            title="Paper Trade" :disabled="planInfo.plan !== 'premium'"
            :disabled-guide="planInfo.plan !== 'premium' ? 'Premium plan required' : ''" description="Trade in real-time using actual exchange data with PAPER money." />

          <UFormGroup
            label="Notifications:"
            help="Select a notification driver to receive notifications"
          >
            <template #default>
              <USelectMenu
                v-model="form.notification_api_key_id"
                placeholder="Select a notification driver"
                :options="notificationsItems"
                value-attribute="value">
                <template #empty>
                  <div class="flex justify-between items-center">
                    <span>
                      No notification API keys found. Please add at least one:
                    </span>
                    <UButton
                      to="/notification-api-keys"
                      icon="i-heroicons-plus"
                      type="link"
                      variant="solid" size="sm"
                      label="Add Notification API Key" />
                  </div>
                </template>
              </USelectMenu>
            </template>
          </UFormGroup>
        </div>
      </div>

      <!-- Monitoring Dashboard -->
      <div v-if="results.monitoring">
        <!-- exception  -->
        <div v-if="results.exception.error" class="mb-8">
          <Exception
            :title="results.exception.error" :content="results.exception.traceback"
            mode="live" :debug-mode="form.debug_mode" />
        </div>

        <!-- Candlesticks chart -->
        <CandlesChart
          v-if="results.monitoring && !results.finished && !results.exception.error"
          :results="results"
          :form="form"
          :exchange="form.paper_mode ? form.exchange : form.exchange_api_key.exchange"
        />

        <!-- tables -->
        <Divider class="mb-4" title="Routes" />
        <MultipleValuesTable :data="results.routes" :header-items="['Symbol', 'Timeframe', 'Strategy']" header />

        <Divider class="mt-12 mb-4" title="Positions" />
        <MultipleValuesTable :data="results.positions" :header-items="['Symbol', 'QTY', 'Entry', 'Price', 'Liq Price', 'PNL']" header />

        <DividerWithButtons class="mt-12 mb-4" title="Orders">
          <button type="button" class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-900 text-sm leading-5 font-medium rounded-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none" @click="ordersModal = true">
            <RectangleStackIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            <span>More</span>
          </button>
        </DividerWithButtons>

        <MultipleValuesTable :data="orders" :header-items="['Created', 'Symbol', 'Type', 'Side', 'Price', 'QTY', 'Status']" header />
      </div>
    </template>

    <template #right>
      <!-- Action Buttons -->
      <div v-if="!results.booting">
        <div v-if="results.monitoring" class="mt-8 lg:mt-0">
          <UButton
            v-if="results.finished" class="w-full flex justify-center"
            variant="solid" icon="i-heroicons-plus"
            size="xl" label="New session"
            @click="newLive($route.params.id as string)" />

          <UButton
            v-else class="w-full flex justify-center"
            variant="solid" color="gray"
            icon="i-heroicons-no-symbol" size="xl"
            :label="results.terminating ? 'Terminating...' : 'Terminate'" :ui="{ color: { gray: { solid: 'text-rose-500 dark:text-rose-400' } } }"
            @click="terminationConfirmModal = true" />

          <!-- report button -->
          <UButton
            v-if="results.monitoring || results.finished" class="w-full flex justify-center mt-4"
            variant="solid" color="gray"
            icon="i-heroicons-flag" size="xl"
            label="Report" @click="reportWithoutExceptionModal = true" />
        </div>

        <div v-else data-cy="live-action-button">
          <UButton
            class="w-full flex justify-center" icon="i-heroicons-bolt"
            size="xl" variant="solid"
            label="Start" :trailing="false"
            @click="start($route.params.id as string)" />
        </div>
      </div>

      <hr v-if="results.monitoring" class="my-8 border-2 dark:border-gray-600 rounded-full">

      <!-- general info table -->
      <dl v-if="results.monitoring" class="bg-white dark:bg-gray-700 grid grid-cols-1 gap-6 border dark:border-gray-600 rounded py-4 px-6 select-none">
        <div v-for="i in sidebarInfo" :key="i.label" class="flex justify-between items-center">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{{ i.label }}:</div>
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ i.value }}
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex justify-start items-center">
            <button class="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 truncate flex items-center hover:underline cursor-pointer focus:outline-none" @click="infoLogsModal = true">
              <span>Info Logs:</span>
              <span class="focus:outline-none flex justify-start items-center">
                <ClipboardDocumentListIcon class="w-6 h-6 ml-2" />
              </span>
            </button>
          </div>
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ results.generalInfo.count_info_logs }}
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex justify-start items-center">
            <button class="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 truncate flex items-center hover:underline cursor-pointer focus:outline-none" @click="errorLogsModal = true">
              <span>Error Logs:</span>
              <span class="focus:outline-none flex justify-start items-center">
                <ClipboardDocumentListIcon class="w-6 h-6 ml-2 cursor-pointer" />
              </span>
            </button>
          </div>
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ results.generalInfo.count_error_logs }}
          </div>
        </div>
      </dl>

      <!-- watch list -->
      <div v-if="results.monitoring && results.watchlist.length">
        <Divider class="mt-8 mb-4" title="Watch List" />
        <KeyValueTableSimple :data="results.watchlist" />
      </div>
    </template>
  </layoutssidebar>
</template>

<script setup lang="ts">
import {
  RectangleStackIcon,
  ClipboardDocumentListIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { useLiveStore } from '~/stores/liveStore'
import { useMainStore } from '~/stores/mainStore'
import helpers from '@/utils/helpers'

const props = defineProps<{
  form: LiveForm
  results: LiveResults
}>()

const totalRoutesError = ref<string[]>([])
const exceptionReport = ref(false)
const displayInfo = ref(false)
const displayErrors = ref(false)
const copiedLogsInfo = ref(false)
const copiedErrorLogs = ref(false)
const ordersModal = ref(false)
const reportWithoutExceptionModal = ref(false)
const infoLogsModal = ref(false)
const errorLogsModal = ref(false)
const terminationConfirmModal = ref(false)
const mainStore = useMainStore()
const liveStore = useLiveStore()

const supportedSymbols = ref<string[]>([])
async function updateSupportedSymbols() {
  supportedSymbols.value = await useMainStore().getExchangeSupportedSymbols(props.form.exchange)
}

const planInfo = computed(() => mainStore.planInfo)

const sidebarInfo = computed(() => {
  const arr = [
    { label: 'Exchange', value: props.results.generalInfo.exchange },
    { label: 'Current Time', value: helpers.timestampToTime(props.results.generalInfo.current_time) },
    { label: 'Debug Mode', value: props.results.generalInfo.debug_mode },
    { label: 'Paper Trade', value: props.results.generalInfo.paper_mode },
    { label: 'PNL', value: `${props.results.generalInfo.pnl} (${props.results.generalInfo.pnl_perc}%)` },
    { label: 'Started', value: helpers.timestampToTime(props.results.generalInfo.started_at) },
    { label: 'Started/Current Balance', value: `${props.results.generalInfo.started_balance} / ${props.results.generalInfo.current_balance}` },
  ]

  // for futures only
  if (props.results.generalInfo.leverage_type !== 'spot') {
    arr.push({ label: 'Available Margin', value: `${props.results.generalInfo.available_margin}` })
    arr.push({ label: 'Leverage', value: `${props.results.generalInfo.leverage}x (${props.results.generalInfo.leverage_type})` })
  }

  return arr
})

const notificationsItems = computed(() => {
  return mainStore.notificationApiKeys.map(n => ({
    label: `${n.name} - ${n.driver}`,
    value: n.id,
  }))
})

const exchangeItems = computed(() => {
  // if paper mode
  if (props.form.paper_mode) {
    return mainStore.liveTradingExchangeNames
  }

  // if live mode
  return mainStore.exchangeApiKeys.map(n => ({
    label: `${n.exchange} - ${n.name}`,
    value: n,
  }))
})

onMounted(() => {
  // if (exchangeItems.value.length == 1) {
  //   if (props.form.paper_mode) {
  //     props.form.exchange = exchangeItems.value[0]
  //   }
  //   else {
  //     props.form.exchange_api_key = exchangeItems.value[0].value
  //   }
  // }
})

const remainingTimeText = computed(() => {
  if (Math.round(props.results.progressbar.estimated_remaining_seconds) === 0) {
    return 'Please wait...'
  }

  return `${Math.round(props.results.progressbar.estimated_remaining_seconds)} seconds remaining...`
})

const orders = computed(() => {
  if (!props.results.orders) return []

  const arr = []
  const limitCount = 5
  const len = props.results.orders.length
  const loopLength = (len - limitCount) >= 0 ? (len - limitCount) : 0
  for (let i = len - 1; i >= loopLength; i--) {
    const item = props.results.orders[i]
    const qty = item.status === 'PARTIALLY FILLED' ? `${item.filled_qty}/${item.qty}` : item.qty
    arr.push([
      {
        value: helpers.timestampToTimeOnly(item.created_at),
        style: 'text-xs',
        tooltip: helpers.timestampToTime(item.created_at)
      },
      { value: item.symbol, style: 'text-xs' },
      { value: item.type, style: 'text-xs' },
      { value: item.side, style: helpers.colorBasedOnSide(item.side) },
      { value: item.price, style: 'text-xs' },
      { value: qty, style: helpers.colorBasedOnSide(item.side) },
      { value: item.status, style: 'text-xs' },
    ])
  }
  return arr
})

const timeframeItems = computed(() => {
  if (mainStore.settings.live.generate_candles_from_1m || !props.form.exchange) {
    return mainStore.jesseSupportedTimeframes
  }
  return mainStore.exchangeInfo[props.form.exchange].supported_timeframes
})

const cancel = liveStore.cancel
const newLive = liveStore.newLive

function start(id: string) {
  if (totalRoutesError.value.length) {
    for (let i = 0; i < totalRoutesError.value.length; i++) {
      showNotification('error', totalRoutesError.value[i])
    }
    return
  }

  if ((props.form.paper_mode && !props.form.exchange) || (!props.form.paper_mode && props.form.exchange_api_key.id === '')) {
    console.log(props.form.paper_mode, props.form.exchange, props.form.exchange_api_key.exchange)
    showNotification('error', 'Please select an exchange')
    return
  }

  liveStore.start(id)
}

function stop(id: string) {
  terminationConfirmModal.value = false
  liveStore.stop(id)
}

function copyInfoLogs() {
  displayInfo.value = true

  navigator.clipboard.writeText(props.results.infoLogs)
  showNotification('success', 'Logs copied successfully')
  copiedLogsInfo.value = true

  setTimeout(() => {
    copiedLogsInfo.value = false
  }, 3000)
}

function copyErrorLogs() {
  displayErrors.value = true

  navigator.clipboard.writeText(props.results.errorLogs)
  showNotification('success', 'Logs copied successfully')
  copiedErrorLogs.value = true

  setTimeout(() => {
    copiedErrorLogs.value = false
  }, 3000)
}
</script>
