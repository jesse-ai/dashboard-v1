<template>
  <div ref="chart" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />
</template>

<script setup lang="ts">
import { createChart } from 'lightweight-charts'
import _ from 'lodash'
import { settings, lightTheme, darkTheme } from '~/composables/lightweightCharts'

const colorMode = useColorMode()

const props = defineProps<{
  form: FormLiveTab
  results: ResultsLiveTab
  candles: Array<any>
}>()

let chart = null as any
let candleSeries = null as any
const lines = {
  orderEntries: {} as any,
  positionEntry: null
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
  const firstRoute = props.form.routes[0]
  const key = `${firstRoute.exchange}-${firstRoute.symbol}-${firstRoute.timeframe}`
  updateCurrentCandle(newValue[key])
})

watch(theme, (newVal) => {
  setTheme(newVal)
})

watch(positionEntry, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    updatePositionEntry()
  }
})

watch(() => props.results.orders, (newValue, oldValue) => {
  updateOrderEntries()
}, { deep: true })

onMounted(() => {
  settings.width = chart.clientWidth

  chart = createChart(chart, settings)

  candleSeries = chart.addCandlestickSeries()
  candleSeries.setData(props.candles)
  chart.timeScale().fitContent()

  setTheme(theme.value)
  updatePositionEntry()
  updateOrderEntries()
})

onBeforeUnmount(() => {
  chart = null
  candleSeries = null
})

function updatePositionEntry() {
  const color = positionType.value === 'long' ? '#00AB5C' : '#FF497D'

  if (lines.positionEntry) {
    candleSeries.removePriceLine(lines.positionEntry)
  }

  if (Number(positionEntry.value) > 0) {
    const entryPrice = {
      price: positionEntry.value,
      color: color,
      lineWidth: 1.5,
      lineStyle: 0,
      axisLabelVisible: true,
      title: 'Entry Price',
    }

    lines.positionEntry = candleSeries.createPriceLine(entryPrice)
  }
}

function updateOrderEntries() {
  const PositionSymbol = firstPosition.value[0].value

  for (const key in lines.orderEntries) {
    candleSeries.removePriceLine(lines.orderEntries[key])
    delete lines.orderEntries[key]
  }

  props.results.orders.forEach((order) => {
    const color = order.side === 'buy' ? '#00AB5C' : '#FF497D'
    const title = _.startCase(_.lowerCase(`${order.side} ${order.type}`))

    if ((order.status === 'ACTIVE' || order.status === 'QUEUED') && order.symbol === PositionSymbol) {
      const orderPrice = {
        price: Number(order.price),
        color: color,
        lineWidth: 1.5,
        lineStyle: 0,
        axisLabelVisible: true,
        title: title
      }

      lines.orderEntries[order.id] = candleSeries.createPriceLine(orderPrice)
    }
  })
}

function updateCurrentCandle(candle: LiveCandleData) {
  if (candle === undefined) {
    throw new TypeError('candle is undefined!')
  }

  if (props.candles.length === 0) {
    return
  }

  const lastExistingCandle = props.results.candles[props.results.candles.length - 1]
  if (lastExistingCandle.time > candle.time) {
    return
  }

  candleSeries.update(candle)
}

function setTheme(val: string) {
  chart.applyOptions(
    val === 'light' ? lightTheme.chart : darkTheme.chart
  )
}
</script>
