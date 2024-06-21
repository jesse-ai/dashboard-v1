<template>
  <div class="mb-16">
    <div v-if="loading" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600 p-4">
      <USkeleton class="h-4 w-full mb-4" />
      <USkeleton class="h-4 w-2/3 mb-4" />
      <USkeleton class="h-4 w-1/2 mb-4" />
      <USkeleton class="h-4 w-full mb-4" />
      <USkeleton class="h-4 w-full mb-4" />
      <USkeleton class="h-4 w-2/3 mb-4" />
      <USkeleton class="h-4 w-full mb-4" />
      <USkeleton class="h-4 w-full" />
    </div>

    <!--    <div -->
    <!--      class="border-2 border-b-0 px-1 py-1 text-sm rounded-t border-gray-100 dark:border-gray-600 flex justify-between items-center"> -->
    <!--      <div> -->
    <!--        <span class="font-bold">{{ selectedChartRoute.symbol }}</span> • {{ selectedChartRoute.timeframe }} -->
    <!--      </div> -->
    <!--      <div> -->
    <!--        open: {{ lastCandle.open }} • close: {{ lastCandle.close }} • high: {{ lastCandle.high }} • low: {{ lastCandle.low }} -->
    <!--      </div> -->
    <!--    </div> -->

    <div ref="chartContainer" :class="{ 'rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600': !loading }" />

    <UButton
      v-for="route in props.form.routes" :key="route.symbol"
      variant="soft"
      color="gray"
      :disabled="results.selectedRoute.symbol === route.symbol && results.selectedRoute.timeframe === route.timeframe"
      class="mt-2 mr-2"
      @click="changeRoute(route)">
      {{ route.symbol }} • {{ route.timeframe }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import {
  createChart,
  type CreatePriceLineOptions,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi
} from 'lightweight-charts'
import _ from 'lodash'
import { settings, lightTheme, darkTheme } from '~/composables/charts/candles'
import { useLiveStore } from '~/stores/liveStore'

const colorMode = useColorMode()
const pageId = computed(() => useRoute().params.id as string)
const loading = ref(true)

const props = defineProps<{
  form: LiveForm
  results: LiveResults
}>()

const chartContainer = ref()
let chart: IChartApi | null = null
let series: ISeriesApi<any> | null = null
const lines = {
  orderEntries: {} as any,
  positionEntry: null as IPriceLine | null
}

const theme = computed(() => colorMode.value)
const exchange = props.form.paper_mode ? props.form.exchange : props.form.exchange_api_key.exchange
const candleKey = `${exchange}-${props.results.selectedRoute.symbol}-${props.results.selectedRoute.timeframe}`
const currentCandles = computed(() => props.results.currentCandles)
const position = computed(() => {
  // search for the proper timeframe and symbol using props.results.selectedRoute
  const p = props.results.positions.find((p) => {
    return p[0].value === props.results.selectedRoute.symbol
  })
  if (p === undefined) return []
  return p
})
const positionEntry = computed(() => position.value[2].value)
const positionType = computed(() => {
  if (Number(position.value[1].value) > 0) return 'long'
  if (Number(position.value[1].value) < 0) return 'short'
  return 'close'
})
// const lastCandle = computed(() => {
//   return props.results.currentCandles[candleKey]
// })

watch(currentCandles, (newValue, oldValue) => {
  if (series === null) return

  updateCurrentCandle(newValue[candleKey])
})

watch(theme, (newVal) => {
  setTheme(newVal)
})


watch(positionEntry, (newValue, oldValue) => {
  if (series === null) return

  if (newValue !== oldValue) {
    updatePositionEntry()
  }
})

watch(() => props.results.orders, () => {
  if (series === null) return

  updateOrderEntries()
}, { deep: true })

onMounted(async () => {
  setTimeout(async () => {
    await init()
  }, 200)
})

async function init() {
  loading.value = true
  await useLiveStore().fetchCandles(pageId.value)
  loading.value = false

  settings.width = chartContainer.value.clientWidth

  chart = createChart(chartContainer.value, settings)

  // add watermark
  chart.applyOptions({
    watermark: {
      visible: true,
      fontSize: 16,
      horzAlign: 'left',
      vertAlign: 'bottom',
      color: '#888',
      text: `${props.results.selectedRoute.symbol} • ${props.results.selectedRoute.timeframe}`,
    },
  })

  series = chart.addCandlestickSeries()
  series!.setData(props.results.candles)
  chart.timeScale().fitContent()

  updatePositionEntry()
  updateOrderEntries()

  setTheme(theme.value)
}

onUnmounted(() => {
  flush()
  // window.removeEventListener('resize', resizeHandler)
})

function flush() {
  if (chart !== null) {
    chart.remove()
    chart = null
  }
  if (series) {
    series = null
  }
}

function updatePositionEntry() {
  const color = positionType.value === 'long' ? '#00AB5C' : '#FF497D'

  if (lines.positionEntry) {
    series!.removePriceLine(lines.positionEntry)
  }

  if (Number(positionEntry.value) > 0) {
    const entryPrice: CreatePriceLineOptions = {
      price: Number(positionEntry.value),
      color: color,
      lineWidth: 1,
      lineStyle: 0,
      axisLabelVisible: true,
      title: 'Entry Price',
    }

    lines.positionEntry = series!.createPriceLine(entryPrice)
  }
}

function updateOrderEntries() {
  const PositionSymbol = position.value[0].value

  for (const key in lines.orderEntries) {
    series!.removePriceLine(lines.orderEntries[key])
    delete lines.orderEntries[key]
  }

  props.results.orders.forEach((order) => {
    const color = order.side === 'buy' ? '#00AB5C' : '#FF497D'
    const title = _.startCase(_.lowerCase(`${order.side} ${order.type}`))

    if ((order.status === 'ACTIVE' || order.status === 'QUEUED') && order.symbol === PositionSymbol) {
      const orderPrice: CreatePriceLineOptions = {
        price: Number(order.price),
        color: color,
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: title
      }

      lines.orderEntries[order.id] = series!.createPriceLine(orderPrice)
    }
  })
}

function updateCurrentCandle(candle: LiveCandleData) {
  if (candle === undefined) {
    throw new TypeError('candle is undefined!')
  }

  if (props.results.candles.length === 0) {
    return
  }

  const lastExistingCandle = props.results.candles[props.results.candles.length - 1]
  if (lastExistingCandle.time > candle.time) {
    return
  }

  series!.update(candle)
}

function setTheme(val: string) {
  if (chart === null) return

  chart.applyOptions(
    val === 'light' ? lightTheme.chart : darkTheme.chart
  )
}

function changeRoute(route: Route) {
  props.results.selectedRoute = route
  flush()
  init()
}
</script>
