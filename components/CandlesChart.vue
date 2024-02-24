<template>
    <div ref="chart" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />
</template>
  
<script setup lang="ts">
import { createChart, CrosshairMode } from 'lightweight-charts'
import _ from 'lodash'

const props = defineProps<{
    form: FormLiveTab;
    results: ResultsLiveTab;
    candles: Array<any>;
}>()

const chart = null as any
const candleSeries = null as any
const lines = ref({
    orderEntries: {} as any,
    positionEntry: null
})

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
            backgroundColor: '#ffffff',
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
            backgroundColor: '#333333',
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

let theme = computed(() => colorMode.preference)
const currentCandles = computed(() => props.results.currentCandles)
const positionEntry = computed(() => props.results.positions[1][2].value)
const positionType = computed(() => {
    if (Number(props.results.positions[1][1].value) > 0) return 'long'
    if (Number(props.results.positions[1][1].value) < 0) return 'short'
    return 'close'
})
const firstPosition = computed(() => props.results.positions[1])

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
    settings.value.width = chart.value.clientWidth

    chart.value = createChart(chart, settings.value)

    candleSeries.value = chart.value.addCandlestickSeries()
    candleSeries.value.setData(props.candles)

    chart.value.timeScale().fitContent()

    if (theme.value === 'light') {
        chart.value.applyOptions(lightTheme.value.chart)
    } else {
        chart.value.applyOptions(darkTheme.value.chart)
    }

    updatePositionEntry()
    updateOrderEntries()
})

onBeforeUnmount(() => {
    chart.value = null
    candleSeries.value = null
})

function updatePositionEntry() {
    const color = positionType.value === 'long' ? '#00AB5C' : '#FF497D'

    if (lines.value.positionEntry) {
        candleSeries.value.removePriceLine(lines.value.positionEntry)
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
        lines.value.positionEntry = candleSeries.value.createPriceLine(entryPrice)
    }
}

function updateOrderEntries() {
    const PositionSymbol = firstPosition.value[0].value

    for (const key in lines.value.orderEntries) {
        candleSeries.value.removePriceLine(lines.value.orderEntries[key])
        delete lines.value.orderEntries[key]
    }

    props.results.orders.forEach(order => {
        const color = order.side === 'buy' ? '#00AB5C' : '#FF497D'
        const title = _.startCase(_.lowerCase(`${order.side} ${order.type}`))

        if ((order.status === 'ACTIVE' || order.status === 'QUEUED') && order.symbol === PositionSymbol) {
            const orderPrice = {
                price: order.price,
                color,
                lineWidth: 1,
                lineStyle: 3,
                axisLabelVisible: true,
                title,
            }
            lines.value.orderEntries[order.id] = candleSeries.value.createPriceLine(orderPrice)
        }
    })
}

function updateCurrentCandle(candle: any) {
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

    candleSeries.value.update(candle)
}

function checkTheme(val: string) {
    if (val === 'light') {
        chart.value.applyOptions(lightTheme.value.chart)
    } else {
        chart.value.applyOptions(darkTheme.value.chart)
    }
}
</script>