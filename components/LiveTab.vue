<template>
    <!-- orders modal -->
    <SlideOver v-model="ordersModal" width="max-w-5xl" title="Orders">
        <LiveOrders :orders="results.orders" />
    </SlideOver>

    <!-- report without exception -->
    <SlideOver v-model="reportWithoutExceptionModal" width="max-w-3xl" title="Report">
        <template #default>
            <ReportLiveSession :session-id="results.generalInfo.session_id" @close="reportWithoutExceptionModal = false" />
        </template>
    </SlideOver>

    <!-- general logs modal -->
    <SlideOver v-model="infoLogsModal" title="Info Logs">
        <template #default>
            <Logs :logs="results.infoLogs" />
        </template>

        <template #buttons>
            <!-- copy button -->
            <button class="btn-nav" @click="copyInfoLogs">
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
            <button class="btn-nav" @click="copyErrorLogs">
                <CheckIcon v-if="copiedErrorLogs" class="h-6 w-6" aria-hidden="true" />
                <ClipboardIcon v-if="!copiedErrorLogs && results.errorLogs.length != 0" class="h-6 w-6" aria-hidden="true" />
            </button>
        </template>
    </SlideOver>

    <!-- session termination modal -->
    <ConfirmModal title="Termination Confirm" description="Are you sure you want to terminate this session?" type="info" v-model="terminationConfirmModal">
        <button class="btn-danger ml-2" @click="stop(Number($route.params.id))">Terminate</button>
    </ConfirmModal>

    <!-- Execution -->
    <div v-if="results.booting" class="flex flex-col items-center justify-center select-none mt-[10%]">
        <div>
            <CircleProgressbar :progress="results.progressbar.current" />
        </div>

        <h3 v-if="!results.exception.error" class="mt-8 animate-pulse" v-text="remainingTimeText" />

        <div class="mt-8">
            <button v-if="form.debug_mode" class="flex justify-center items-center btn-primary mb-4 w-64" @click="infoLogsModal = true">
                <ClipboardListIcon class="w-5 h-5 mr-2" />
                View Logs
            </button>

            <button data-cy="live-cancel-button" class="flex justify-center items-center btn-secondary w-64" @click="cancel(Number($route.params.id))">
                <BanIcon class="w-5 h-5 mr-2" />
                Cancel
            </button>
        </div>

        <!-- exception  -->
        <div v-if="results.exception.error" class="mx-auto container mt-8">
            <Exception :title="results.exception.error" :content="results.exception.traceback" mode="live" :debug-mode="form.debug_mode" :session-id="results.generalInfo.session_id" />
        </div>
    </div>

    <LayoutWithSidebar v-else>
        <template #left>
            <!-- form -->
            <div v-if="!results.booting && !results.monitoring && !results.showResults" data-cy="live-page-content">
                <Routes :form="form" :results="results" />

                <Divider class="mt-16" title="Options" />

                <div class="grid grid-cols-1 gap-6">
                    <ToggleButton :object="form" name="debug_mode" title="Debug Mode" description="Logs more details, helpful for debugging. Not recommended for beginners." />

                    <ToggleButton :object="form" name="paper_mode" title="Paper Trade" :disabled="planInfo.plan !== 'premium'" :disabled-guide="planInfo.plan !== 'premium' ? 'Premium plan required' : ''" description="Trade in real-time using actual exchange data with PAPER money." />
                </div>
            </div>

            <!-- Monitoring Dashboard -->
            <div v-if="results.monitoring">
                <!-- exception  -->
                <div v-if="results.exception.error" class="mb-8">
                    <Exception :title="results.exception.error" :content="results.exception.traceback" mode="live" :debug-mode="form.debug_mode" :session-id="results.generalInfo.session_id" />
                </div>

                <!-- Candlesticks chart-->
                <div>
                    <CandlesChart v-if="results.candles.length" :candles="results.candles" :results="results" :form="form" />
                </div>

                <!--tables-->
                <Divider class="mt-12" title="Routes" />
                <MultipleValuesTable :data="results.routes" :header-items="['Exchange', 'Symbol', 'Timeframe', 'Strategy']" header />

                <Divider class="mt-12" title="Positions" />
                <MultipleValuesTable :data="results.positions" :headerItems="['Symbol', 'QTY', 'Entry', 'Price', 'Liq Price', 'PNL']" header />

                <DividerWithButtons class="mt-12" title="Orders">
                    <button type="button" class="inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 dark:border-gray-900 text-sm leading-5 font-medium rounded-full text-gray-700 dark:text-gray-100 bg-white dark:bg-backdrop-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none" @click="ordersModal = true">
                        <CollectionIcon class="-ml-1.5 mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span>More</span>
                    </button>
                </DividerWithButtons>
                <MultipleValuesTable :data="orders" :headerItems="['Created', 'Symbol', 'Type', 'Side', 'Price', 'QTY', 'Status']" header />
            </div>
        </template>

        <template #right>
            <!-- Action Buttons -->
            <div v-if="!results.booting">
                <div v-if="results.monitoring">
                    <button v-if="results.finished" class="flex justify-center items-center btn-primary text-center mb-4 w-full" @click="newLive(Number($route.params.id))">
                        <PlusSmIcon class="w-5 h-5 mr-2" />
                        New session
                    </button>

                    <button v-else :disabled="results.terminating" class="flex items-center justify-center btn-cancel text-center mr-2 w-full mb-4" @click="terminationConfirmModal = true">
                        <BanIcon class="w-5 h-5 mr-2" />
                        {{ results.terminating ? 'Terminating...' : 'Terminate' }}
                    </button>

                    <!-- report button -->
                    <button v-if="results.monitoring || results.finished" class="flex items-center justify-center btn-secondary text-center mr-2 w-full mb-4" @click="reportWithoutExceptionModal = true">
                        <FlagIcon class="w-5 h-5 mr-2" />
                        Report
                    </button>
                </div>

                <div v-else data-cy="live-action-button">
                    <button data-cy="live-start-button" class="flex justify-center items-center btn-primary text-center mr-2 w-full mb-4" @click="start(Number($route.params.id))">
                        <LightningBoltIcon class="w-5 h-5 mr-2" />
                        Start
                    </button>

                    <!--          <button class="btn-secondary text-center block w-full mb-4" @click="startInNewTab($route.params.id)">-->
                    <!--            Start in a new tab-->
                    <!--          </button>-->
                </div>
            </div>

            <hr v-if="results.monitoring" class="my-8 border-2 dark:border-gray-600 rounded-full">

            <!-- general info table-->
            <dl v-if="results.monitoring" class="grid grid-cols-1 gap-6 border dark:border-gray-600 rounded py-4 px-6 select-none">
                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Current Time:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ timestampToTime(results.generalInfo.current_time) }}
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Started:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ timestampToTime(results.generalInfo.started_at) }}
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Started/Current Balance:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ `${results.generalInfo.started_balance}/${results.generalInfo.current_balance}` }}
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Debug Mode:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ results.generalInfo.debug_mode }}</div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Paper Trade:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ results.generalInfo.paper_mode }}</div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">PNL:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ `${results.generalInfo.pnl} (${results.generalInfo.pnl_perc}%)` }}
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Trades:</div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ results.generalInfo.count_trades }}
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center">
                        <button class="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 truncate flex items-center hover:underline cursor-pointer focus:outline-none" @click="modals.infoLogs = true">
                            <span>Info Logs:</span>
                            <span class="focus:outline-none flex justify-start items-center">
                                <ClipboardListIcon class="w-6 h-6 ml-2" />
                            </span>
                        </button>
                    </div>
                    <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {{ results.generalInfo.count_info_logs }}
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="flex justify-start items-center">
                        <button class="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 truncate flex items-center hover:underline cursor-pointer focus:outline-none" @click="modals.errorLogs = true">
                            <span>Error Logs:</span>
                            <span class="focus:outline-none flex justify-start items-center">
                                <ClipboardListIcon class="w-6 h-6 ml-2 cursor-pointer" />
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
                <Divider class="mt-8" title="Watch List" />
                <KeyValueTableSimple :data="results.watchlist" />
            </div>
        </template>
    </LayoutWithSidebar>
</template>
  
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useLiveStore } from '@/stores/liveState'
import { useAuthStore } from '@/stores/authState'
import helpers from '@/utils/helpers'

const props = defineProps<{
    form: FormLiveTab;
    results: ResultsLiveTab
}>()

const displayInfo = ref(false)
const displayErrors = ref(false)
const copiedLogsInfo = ref(false)
const copiedErrorLogs = ref(false)
const ordersModal = ref(false)
const reportWithoutExceptionModal = ref(false)
const infoLogsModal = ref(false)
const errorLogsModal = ref(false)
const terminationConfirmModal = ref(false)
const authStore = useAuthStore()
const liveStore = useLiveStore()

const planInfo = computed(() => authStore.planInfo)

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
            { value: helpers.timestampToTimeOnly(item.created_at), style: 'text-xs', tooltip: helpers.timestampToTime(item.created_at) },
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

const start = liveStore.start
const cancel = liveStore.cancel
const stop = liveStore.stop
const newLive = liveStore.newLive

const copyInfoLogs = () => {
    displayInfo.value = true

    navigator.clipboard.writeText(props.results.infoLogs)
    showNotification('success', 'Info copied successfully')
    copiedLogsInfo.value = true

    setTimeout(() => {
        copiedLogsInfo.value = false
    }, 3000)
}

const copyErrorLogs = () => {
    displayErrors.value = true

    navigator.clipboard.writeText(props.results.errorLogs)
    showNotification('success', 'Error copied successfully')
    copiedErrorLogs.value = true

    setTimeout(() => {
        copiedErrorLogs.value = false
    }, 3000)
}
</script>
  
  