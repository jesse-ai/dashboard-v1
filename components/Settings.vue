<template>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-5 select-none">
        <aside class="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav class="space-y-1">
                <button v-for="item in navigation" :key="item.name" class="block w-full" :class="[currentTab === item.name ? 'bg-gray-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 hover:text-indigo-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300', 'group rounded-md px-3 py-2 flex items-center text-sm font-medium']" @click="currentTab = item.name">
                    <component :is="item.icon" :class="[currentTab === item.name ? 'text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400', 'flex-shrink-0 -ml-1 mr-3 h-6 w-6']" aria-hidden="true" />
                    <span class="truncate">
                        {{ item.name }}
                    </span>
                </button>
            </nav>
        </aside>

        <!-- backtest settings -->
        <div v-if="currentTab === 'Backtest'" class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
            <Card>
                <Heading>Logs</Heading>
                <p>
                    Below configurations are used to filter out the extra logging info that are displayed when the <code>"--debug"</code> flag is enabled.
                </p>
                <br>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UCheckbox label="Order Submission" v-model="settings.backtest.logging['order_submission']" />
                    <UCheckbox label="Order Cancellation" v-model="settings.backtest.logging['order_cancellation']" />
                    <UCheckbox label="Order Execution" v-model="settings.backtest.logging['order_execution']" />
                    <UCheckbox label="Position Opened" v-model="settings.backtest.logging['position_opened']" />
                    <UCheckbox label="Position Increased" v-model="settings.backtest.logging['position_increased']" />
                    <UCheckbox label="Position Reduced" v-model="settings.backtest.logging['position_reduced']" />
                    <UCheckbox label="Position Closed" v-model="settings.backtest.logging['position_closed']" />
                    <UCheckbox label="1m candles" v-model="settings.backtest.logging['shorter_period_candles']" />
                    <UCheckbox label="Trading Candles" v-model="settings.backtest.logging['trading_candles']" />
                </div>
            </Card>

            <Card>
                <Heading>Data</Heading>
                <div>
                    <UFormGroup label="Warmup Candles">
                        <template #description>
                            Number of warmup candles that is loaded before starting each session
                        </template>
                        <template #default>
                            <UInput v-model="settings.backtest.warm_up_candles" type="number" placeholder="ex: 210" />
                        </template>
                    </UFormGroup>
                </div>
            </Card>

            <Card>
                <Heading>Exchanges</Heading>
                <p>
                    Below you can modify configuration per each exchange. You can even choose to use a spot exchange's data for backtestig
                    in futures mode (just because spot exchanges usually have more historical data), and vice versa.
                </p>
                <br>
                <br>

                <div v-for="(e, index) in settings.backtest.exchanges" :key="index">
                    <UDivider :label="e.name" />

                    <div class="grid grid-cols-6 gap-6">
                        <UFormGroup label="Starting Capital">
                            <UInput v-model="e.balance" type="number" step="1000" />
                        </UFormGroup>

                        <UFormGroup :label="`Trading Fee (${round(e.fee * 100, 2)}%)`">
                            <UInput v-model="e.fee" type="number" step="0.0001" />
                        </UFormGroup>
                    </div>

                    <br>

                    <RadioGroups title="Type:" v-model="e.type" :options="['spot', 'futures']" />

                    <br>

                    <div v-if="e.type === 'futures'">
                        <RadioGroups title="Leverage Mode:" v-model="e.futures_leverage_mode" :options="['cross', 'isolated']" default="isolated" />
                        <br>
                        <NumberInput v-if="e.type === 'futures'" title="Leverage (x):" v-model="e.futures_leverage" :default="1" />
                        <br>
                    </div>
                </div>
            </Card>
        </div>

        <!-- live settings -->
        <div v-if="currentTab === 'Live'" class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
            <Card>
                <Heading>Persistency</Heading>
                <p>
                    If persistency is <b>enabled</b>, on new live session, Jesse will try to <b>continue</b> the previous
                    running session based on the existing positions and orders on the exchange.
                    <br>
                    <br>
                    If it's <b>disabled</b>, Jesse will first <b>close</b> all existing positions and orders before <b>starting</b> or <b>terminating</b> live sessions.
                </p>

                <br>

                <ToggleButton v-model="settings.live.persistency" title="Enable Persistency" />
            </Card>

            <Card>
                <Heading>Candle Generation</Heading>
                <p>
                    If the bellow option is <b>disabled</b>, Jesse will fetch candles for all timeframes (based on your routes) from the exchange. This ensures faster session start times and similar result in Jesse's chart and the one you see on the exchange (or TradingView).
                    <br>
                    <br>
                    If the bellow option is <b>enabled</b>, Jesse will fetch 1m candles from the exchange, and generate bigger timeframes by its own. Doing so, Jesse is able to offer timeframes that are not supported by the exchange. It also captures the real price action that a shady exchange might be covering up later. In such case, you'll see differnet candle chart in Jesse and the one you see on the exchange.
                </p>

                <br>

                <ToggleButton v-model="settings.live.generate_candles_from_1m" title="Generate Candles Locally" />
            </Card>

            <Card>
                <Heading>Logs</Heading>
                <p>
                    You can filter the types of events that you want to be logged. Logging is often useful for debugging
                    and recommended. Hence, it doesn't hurt to enable them all:
                </p>
                <br>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UCheckbox label="Order Submission" v-model="settings.live.logging['order_submission']" />
                    <UCheckbox label="Order Cancellation" v-model="settings.live.logging['order_cancellation']" />
                    <UCheckbox label="Order Execution" v-model="settings.live.logging['order_execution']" />
                    <UCheckbox label="Position Opened" v-model="settings.live.logging['position_opened']" />
                    <UCheckbox label="Position Increased" v-model="settings.live.logging['position_increased']" />
                    <UCheckbox label="Position Reduced" v-model="settings.live.logging['position_reduced']" />
                    <UCheckbox label="Position Closed" v-model="settings.live.logging['position_closed']" />
                    <UCheckbox label="1m candles" v-model="settings.live.logging['shorter_period_candles']" />
                    <UCheckbox label="Trading Candles" v-model="settings.live.logging['trading_candles']" />
                </div>
            </Card>

            <br>

            <Card>
                <Heading>Data</Heading>
                <div>
                    <FormInput placeholder="ex: 210" title="Warmup Candles" :object="settings.live" description="Number of warmup candles that is loaded before starting each session" name="warm_up_candles" :min="1" input-type="number" />
                </div>
            </Card>

            <br>

            <Card>
                <Heading>
                    Notifications
                </Heading>
                <p>
                    Jesse can notify every time something interesting happens so you don't have to monitor your bots 24/7. Currently, Telegram and Discord drivers are supported. <br><br>
                    To enter API keys for Telegram or Discord, check out your project's <code>.env</code> file.
                </p>
                <br>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <UCheckbox label="Enable Notifications" v-model="settings.live.notifications['enabled']" />
                </div>
                <br>

                <div v-if="settings.live.notifications.enabled">
                    <p>
                        You can choose for which events you want to receive notifications:
                    </p>
                    <br>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UCheckbox label="Errors" v-model="settings.live.notifications.events['errors']" />
                        <UCheckbox label="Session Start" v-model="settings.live.notifications.events['started_session']" />
                        <UCheckbox label="Session Termination" v-model="settings.live.notifications.events['terminated_session']" />
                        <UCheckbox label="Order Submission" v-model="settings.live.notifications.events['submitted_orders']" />
                        <UCheckbox label="Order Cancellation" v-model="settings.live.notifications.events['cancelled_orders']" />
                        <UCheckbox label="Order Execution" v-model="settings.live.notifications.events['executed_orders']" />
                        <UCheckbox label="Opened Positions" v-model="settings.live.notifications.events['opened_position']" />
                        <UCheckbox label="Updated Position" v-model="settings.live.notifications.events['updated_position']" />
                    </div>

                    <br>

                    <Heading>
                        Recurring Position Reports
                    </Heading>

                    <p>
                        You will also receive recurring reports about your positions as notifications.
                        This gives you a little ease of mind so you don't have to constantly check your positions.
                    </p>

                    <br>

                    <p>You can choose the <strong>timeframe</strong> for how frequently you want to receive them:</p>

                    <select v-model="settings.live.notifications.position_report_timeframe" class="dark:bg-backdrop-dark dark:hover:bg-gray-800 hover:bg-gray-50 cursor-pointer w-full py-2 my-4 rounded border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option v-for="item in timeframes" :key="item">{{ item }}</option>
                    </select>

                    <br>
                </div>
            </Card>

            <Card v-if="Object.keys(settings.live.exchanges).length">
                <div v-for="(e, index) in settings.live.exchanges" :key="index">
                    <UDivider :label="e.name" />

                    <RadioGroups title="Leverage Mode:" v-model="e.futures_leverage_mode" :options="['cross', 'isolated']" />

                    <br>

                    <NumberInput title="Leverage (x):" v-model="e.futures_leverage" />

                    <br>

                    <p>Balances and fees will be fetched from the exchange in live trading. But for <b>paper trading</b> you can set them here:</p>

                    <br>

                    <div class="grid grid-cols-6 gap-6">
                        <UFormGroup label="Starting Capital">
                            <UInput v-model="e.balance" type="number" step="1000" />
                        </UFormGroup>

                        <UFormGroup :label="`Trading Fee (${round(e.fee * 100, 2)}%)`">
                            <UInput v-model="e.fee" type="number" step="0.0001" />
                        </UFormGroup>
                    </div>

                    <br>
                </div>
            </Card>
        </div>

        <!-- optimization settings -->
        <div v-if="currentTab === 'Optimization'" class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9 w-full">
            <!-- CPU cores -->
            <Card>
                <Heading>CPU</Heading>
                <div>
                    <UFormGroup :label="`CPU cores to use for optimization(${settings.optimization.cpu_cores} / ${systemInfo.cpu_cores})`" :object="settings.optimization" description="How many CPU cores of your machine would you like to be used for optimization?`">
                        <UInput v-model="settings.optimization.cpu_cores" type="number" placeholder="ex: 4" />
                    </UFormGroup>
                </div>
            </Card>

            <!-- Fitness Function-->
            <Card>
                <Heading>Fitness Function</Heading>
                <RadioGroups title="Ratio:" v-model="settings.optimization.ratio" :options="['sharpe', 'calmar', 'sortino', 'omega']" />
            </Card>

            <!-- Data -->
            <Card>
                <Heading>Data</Heading>
                <div>
                    <UFormGroup label="Warmup Candles" name="Warmup Candles">
                        <template #description>
                            Number of warmup candles that is loaded before starting each session
                        </template>
                        <template #default>
                            <UInput v-model="settings.optimization.warm_up_candles" typ="number" placeholder="ex: 210" />
                        </template>
                    </UFormGroup>
                </div>
            </Card>

            <!-- exchange -->
            <Card>
                <Heading>Exchange</Heading>
                <p>
                    Because the optimize mode is limited to one route only, it makes sense to have only one configuration section for the exchange values. Depending on the exchange you define in your route, these configurations will be used.
                </p>
                <div class="grid grid-cols-6 gap-6 my-4">

                    <UFormGroup label="Starting Capital" name="Starting Capital">
                        <UInput v-model="settings.optimization.exchange.balance" typ="number" step="1000" />
                    </UFormGroup>

                    <UFormGroup :label="`Trading Fee (${round(settings.optimization.exchange.fee * 100, 2)}%)`">
                        <UInput v-model="settings.optimization.exchange.fee" typ="number" step="0.0001" />
                    </UFormGroup>
                </div>

                <br>

                <RadioGroups title="Type:" v-model="settings.optimization.exchange.type" :options="['spot', 'futures']" default="futures" />

                <br>

                <div v-if="settings.optimization.exchange.type === 'futures'">
                    <RadioGroups title="Leverage Mode:" v-model="settings.optimization.exchange.futures_leverage_mode" :options="['cross', 'isolated']" default="isolated" />

                    <br>

                    <NumberInput title="Leverage (x):" v-model="settings.optimization.exchange.futures_leverage" :default="1" />
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CalculatorIcon, CpuChipIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authState'
import _ from 'lodash'

const store = useAuthStore()
const route = useRoute()

const timeframes = ref(['1m', '3m', '5m', '15m', '30m', '45m', '1h', '2h', '3h', '4h', '6h', '8h', '12h', '1D'])
let currentTab = ref(['Optimization', 'Backtest', 'Live'].includes(route.name as string) ? route.name : 'Backtest')
console.log(route.name)
const persistencyOptions = ref([
    {
        name: 'Continue Session',
        description: 'Continue from the previous session using existing data on the exchange'
    },
    {
        name: 'New Session',
        description: 'Start a fresh sessions. Close existing positions and orders on the exchange'
    }
])

const settings = computed(() => store.settings)
const systemInfo = computed(() => store.systemInfo)
const hasLivePluginInstalled = computed(() => store.hasLivePluginInstalled)
const planInfo = computed(() => store.planInfo)
const exchangeInfo = computed(() => store.exchangeInfo)

const isLive = computed(() => route.name === 'Live')
const navigation = computed(() => {
    const arr = [
        { name: 'Backtest', icon: CalculatorIcon },
        { name: 'Optimization', icon: CpuChipIcon },
    ]
    if (hasLivePluginInstalled.value) {
        arr.push({ name: 'Live', icon: CurrencyDollarIcon })
    }
    return arr
})

if (route.name === 'Backtest') {
    currentTab.value = 'Backtest'
} else if (route.name === 'Optimization') {
    currentTab.value = 'Optimization'
} else if (route.name === 'Live') {
    currentTab.value = 'Live'
}

sortExchanges()
removeInactiveLiveExchanges()

const round = _.round

function sortExchanges() {
    const sortBacktestKeys = Object.keys(settings.value.backtest.exchanges).sort()
    const sortLiveKeys = Object.keys(settings.value.live.exchanges).sort()
    const backtestExchange = {} as any
    const liveExchange = {} as any
    for (const item of sortBacktestKeys) {
        backtestExchange[item] = settings.value.backtest.exchanges[item]
    }
    settings.value.backtest.exchanges = backtestExchange

    for (const item of sortLiveKeys) {
        liveExchange[item] = settings.value.live.exchanges[item]
    }
    settings.value.live.exchanges = liveExchange
}

function removeInactiveLiveExchanges() {
    // loop through this.settings.value.live.exchanges, if the
    // allowedToTradeIn(exchange.name) is false, remove
    // that item from this.settings.value.live.exchanges
    for (const exchange of Object.keys(settings.value.live.exchanges)) {
        if (!allowedToTradeIn(exchange)) {
            delete settings.value.live.exchanges[exchange]
        }
    }
}

function allowedToTradeIn(exchangeName: string) {
    if (!isLive.value) return true
    if (planInfo.value.plan === 'premium') {
        return true
    }
    const exchange = exchangeInfo.value.find(exchange => exchange.name === exchangeName)
    return exchange ? exchange.required_live_plan === 'free' : false
}

function convertToSlug(Text: string) {
    return Text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
}
</script>
  