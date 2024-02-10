<template>
    <!-- Execution -->
    <div v-if="!form.debug_mode && results.executing && !results.showResults" class="flex flex-col items-center justify-center select-none mt-[10%]">
        <div>
            <CircleProgressbar :progress="results.progressbar.current" />
        </div>

        <h3 v-if="!results.exception.error" class="mt-8 animate-pulse" v-text="remainingTimeText" />

        <div class="mt-8">
            <UButton @click="cancel(Number($route.params.id))" color="gray" class="w-64 flex justify-center" icon="i-heroicons-no-symbol" size="sm" variant="solid" label="Cancel" :trailing="false" />
        </div>

        <!-- exception  -->
        <div v-if="results.exception.error && results.executing" class="mx-auto container mt-8">
            <Exception :title="results.exception.error" :content="results.exception.traceback" mode="candles" v-model="exceptionReport" />
        </div>
    </div>

    <LayoutsSidebar v-else>
        <template #left>
            <!-- alert -->
            <div v-if="results.alert.message">
                <Alert :data="results.alert" />
            </div>

            <!-- Content -->
            <div v-if="!results.executing && !results.showResults" class="pb-4">
                <!-- exchange -->
                <Divider title="Exchange" />
                <USelectMenu v-model="form.exchange" :options="backtestingExchangeNames" size="xl" class="mt-2" />


                <!-- symbol -->
                <Divider title="Symbol" class="mt-16" />
                <UInput v-model="form.symbol" placeholder="ex: BTC-USDT" size="xl" class="mt-2" />

                <Divider title="Start Date" class="mt-16" />
                <UInput v-model="form.start_date" type="date" size="xl" class="mt-2" />
            </div>
        </template>

        <template #right>
            <!-- Action Buttons -->
            <div v-if="!results.executing">
                <div v-if="results.showResults">
                    <button class="btn-primary text-center block w-full mb-4" @click="rerun(Number($route.params.id))">
                        Rerun
                    </button>

                    <button class="btn-secondary text-center block w-full mb-4" @click="newBacktest(Number($route.params.id))">
                        New backtest
                    </button>
                </div>

                <div v-else>
                    <UButton @click="start(Number($route.params.id))" class="w-full flex justify-center" icon="i-heroicons-bolt" size="xl" variant="solid" label="Start" :trailing="false" />

                    <UButton @click="startInNewTab(Number($route.params.id))" class="w-full flex justify-center mt-4" color="gray" icon="i-heroicons-plus" size="xl" variant="solid" label="Start in a new tab" :trailing="false" />
                </div>
            </div>
        </template>
    </LayoutsSidebar>
</template>
  
<script setup lang="ts">
import { useCandlesStore } from '@/stores/candleState'
import { useAuthStore } from '@/stores/authState'
import helpers from '@/utils/helpers'


const candlesStore = useCandlesStore()
const authState = useAuthStore()
const backtestState = useBacktestStore()

const props = defineProps<{
    form: any;
    results: CandleTabResults
}>();

props.results.alert.message = ''

const exceptionReport = ref(false)

const totalSymbolError = ref<string[]>([])
const copiedForm = ref<{ symbol: Object }>({ symbol: props.form })

const backtestingExchangeNames = computed(() => authState.backtestingExchangeNames)

const remainingTimeText = computed(() => helpers.remainingTimeText(props.results.progressbar.estimated_remaining_seconds))

watch(props.form, () => {
    initiate()
    if (props.form.exchange !== '') {
        candlesStore.candlesForm = props.form
    }
}, { deep: true })


useAuthStore().initiate()

watch(copiedForm, () => {
    checkSymbol()
}, { deep: true })

const initiate = () => {
    if (props.form.exchange === '') {
        props.form.exchange = backtestingExchangeNames.value[0]
    }
}

const checkSymbol = () => {
    totalSymbolError.value = []
    const symbolErrors = []

    const ERRORS = {
        maxSymbolLengthErrorMessage: 'Maximum symbol length is exceeded!',
        mustContainDashErrorMessage: 'Symbol parameter must contain "-" character!',
        emptySymbolErrorMessage: 'Symbol parameter cannot be empty',
    }

    if (props.form.symbol.length === 0) {
        symbolErrors.push(ERRORS.emptySymbolErrorMessage)
    }

    if (!symbolErrors.includes(ERRORS.maxSymbolLengthErrorMessage) && props.form.symbol.length > 19) {
        symbolErrors.push(ERRORS.maxSymbolLengthErrorMessage)
    }

    if (props.form.symbol.length >= 5) {
        let checkDash = false
        for (const item1 of props.form.symbol.substring(3, 5)) {
            if (item1 === '-') {
                checkDash = true
            }
        }
        if (!checkDash) {
            symbolErrors.push(ERRORS.mustContainDashErrorMessage)
        }
    }

    for (const item of symbolErrors) {
        totalSymbolError.value.push(item)
    }
}

const { cancel } = candlesStore
const { rerun, newBacktest } = backtestState

const start = (id: number) => {
    if (forValidate()) return
    candlesStore.start(id)
}

const startInNewTab = (id: number) => {
    if (forValidate()) return
    candlesStore.startInNewTab(id)
}

const forValidate = () => {
    if (!props.form.exchange) {
        showNotification('error', 'Exchange parameter cannot be empty')
        return true
    }
    if (!props.form.symbol) {
        showNotification('error', 'Symbol parameter cannot be empty')
        return true
    } else {
        if (!props.form.symbol.includes('-')) {
            showNotification('error', 'Symbol parameter must contain "-" character')
            return true
        } else if (props.form.symbol.length > 13) {
            showNotification('error', 'Maximum symbol length is exceeded!')
            return true
        }
    }
    if (!props.form.start_date) {
        showNotification('error', 'Start date parameter cannot be empty')
        return true
    }
}
initiate()
checkSymbol()
</script>  
  