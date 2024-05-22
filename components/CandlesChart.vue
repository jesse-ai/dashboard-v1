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
    <div ref="chartContainer" :class="{ 'rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600': !loading }" />
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
import { settings, lightTheme, darkTheme } from '~/composables/lightweightCharts'
import { useLiveStore } from '~/stores/liveStore'

const colorMode = useColorMode()
const pageId = computed(() => useRoute().params.id as string)
const loading = ref(true)

const props = defineProps<{
  form: FormLiveTab
  results: ResultsLiveTab
}>()

const chartContainer = ref()
let chart: IChartApi | null = null
let series: ISeriesApi<any> | null = null
const lines = {
  orderEntries: {} as any,
  positionEntry: null as IPriceLine | null
}

const theme = computed(() => colorMode.preference)
const currentCandles = computed(() => props.results.currentCandles)
const positionEntry = computed(() => props.results.positions[0][2].value)
const positionType = computed(() => {
  if (Number(props.results.positions[0][1].value) > 0) return 'long'
  if (Number(props.results.positions[0][1].value) < 0) return 'short'
  return 'close'
})

const firstPosition = computed(() => props.results.positions[0])

watch(currentCandles, (newValue, oldValue) => {
  if (series === null) return

  const firstRoute = props.form.routes[0]
  const key = `${firstRoute.exchange}-${firstRoute.symbol}-${firstRoute.timeframe}`
  updateCurrentCandle(newValue[key])
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

watch(() => props.results.orders, (newValue, oldValue) => {
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

  // // add watermark
  // chart.applyOptions({
  //   watermark: {
  //     visible: true,
  //     fontSize: 24,
  //     horzAlign: 'left',
  //     vertAlign: 'bottom',
  //     color: '#888',
  //     text: 'BTC-USD - 1m',
  //   },
  // })

  series = chart.addCandlestickSeries()
  series!.setData(props.results.candles)
  chart.timeScale().fitContent()

  setTheme(theme.value)
  updatePositionEntry()
  updateOrderEntries()
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
  const PositionSymbol = firstPosition.value[0].value

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
</script>
