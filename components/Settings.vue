<template>
  <div class="lg:grid lg:grid-cols-12 lg:gap-x-5 select-none">
    <aside class="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav class="space-y-1">
        <button v-for="item in navigation" :key="item.name" class="block w-full"
                :class="[currentTab === item.name ? 'bg-gray-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-400 hover:text-indigo-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300', 'group rounded-md px-3 py-2 flex items-center text-sm font-medium']"
                @click="currentTab = item.name">
          <component :is="item.icon"
                     :class="[currentTab === item.name ? 'text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400', 'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                     aria-hidden="true"/>
          <span class="truncate">{{ item.name }}</span>
        </button>
      </nav>
    </aside>

    <!-- general settings -->
    <GeneralSettings v-if="currentTab === 'General'"/>

    <!-- backtest settings -->
    <BacktestSettings v-if="currentTab === 'Backtest'"/>

    <!-- live settings -->
    <LiveSettings v-if="currentTab === 'Live'"/>

    <!-- optimization settings -->
    <OptimizationSetting v-if="currentTab === 'Optimization'"/>
  </div>
</template>

<script setup lang="ts">
import {CalculatorIcon, CpuChipIcon, CurrencyDollarIcon, InformationCircleIcon} from '@heroicons/vue/24/outline'
import {useAuthStore} from '@/stores/authState'
import BacktestSettings from "~/components/settings/BacktestSettings.vue";
import OptimizationSetting from "~/components/settings/OptimizationSettings.vue";
import LiveSettings from "~/components/settings/LiveSettings.vue";
import GeneralSettings from "~/components/settings/GeneralSettings.vue";

const store = useAuthStore()
const route = useRoute()

let currentTab = ref(['Optimization', 'Backtest', 'Live'].includes(route.name as string) ? route.name : 'Backtest')
const settings = computed(() => store.settings)
const hasLivePluginInstalled = computed(() => store.hasLivePluginInstalled)
const planInfo = computed(() => store.planInfo)
const exchangeInfo = computed(() => store.exchangeInfo)

const isLive = computed(() => route.name === 'Live')
const navigation = computed(() => {
  const arr = [
    {name: 'General', icon: InformationCircleIcon},
    {name: 'Backtest', icon: CalculatorIcon},
    {name: 'Optimization', icon: CpuChipIcon},
  ]
  if (hasLivePluginInstalled.value) {
    arr.push({name: 'Live', icon: CurrencyDollarIcon})
  }
  return arr
})

if (String(route.name).includes('backtest')) {
  currentTab.value = 'Backtest'
} else if (String(route.name).includes('optimization')) {
  currentTab.value = 'Optimization'
} else if (String(route.name).includes('live')) {
  currentTab.value = 'Live'
} else {
  currentTab.value = 'General'
}

sortExchanges()
removeInactiveLiveExchanges()

function sortExchanges() {
  const sortBacktestKeys = Object.keys(settings.value.backtest.exchanges).sort()
  const sortLiveKeys = Object.keys(settings.value.live.exchanges).sort()
  const backtestExchange = {} as { [key: string]: ConfigExchange }
  const liveExchange = {} as { [key: string]: ConfigExchange }
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
  return exchangeInfo.value[exchangeName].required_live_plan === 'free'
}
</script>
