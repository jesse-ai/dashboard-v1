<template>
  <div ref="chart" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />
</template>

<script setup lang="ts">
import { createChart, CrosshairMode } from 'lightweight-charts'
import _ from 'lodash'

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

const settings = ref({
  width: 800,
  height: 380,
  crosshair: {
    mode: CrosshairMode.Normal
  },
})

const colorMode = useColorMode()

const lightTheme = ref({
  chart: {
    layout: {
      background: { color: '#ffffff' },
      textColor: 'rgba(33, 56, 77, 1)'
    },
    grid: {
      vertLines: {
        color: '#f1f1f1',
        visible: false,
      },
      horzLines: {
        color: '#f1f1f1',
        visible: false,
      }
    },
    priceScale: {
      borderColor: 'rgba(197, 203, 206, 0.6)'
    },
    timeScale: {
      borderColor: 'rgba(197, 203, 206, 0.6)',
      timeVisible: true,
      secondsVisible: false
    }
  },
  series: {
    color: '#4f46e5'
  }
})

const darkTheme = ref({
  chart: {
    layout: {
      background: { color: '#333333' },
      textColor: '#D1D5DB'
    },
    grid: {
      vertLines: {
        color: '#525252',
        visible: false
      },
      horzLines: {
        color: '#525252',
        visible: false
      }
    },
    priceScale: {
      borderColor: '#525252'
    },
    timeScale: {
      borderColor: '#525252',
      timeVisible: true,
      secondsVisible: false
    }
  },
  series: {
    color: '#818CF8'
  }
})

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
  checkTheme(newVal)
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
  settings.value.width = chart.clientWidth

  chart = createChart(chart, settings.value)

  candleSeries = chart.addCandlestickSeries()
  candleSeries.setData(props.candles)

  chart.timeScale().fitContent()

  if (theme.value === 'light') {
    chart.applyOptions(lightTheme.value.chart)
  }
  else {
    chart.applyOptions(darkTheme.value.chart)
  }

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

function checkTheme(val: string) {
  if (val === 'light') {
    chart.applyOptions(lightTheme.value.chart)
  }
  else {
    chart.applyOptions(darkTheme.value.chart)
  }
}
</script>
