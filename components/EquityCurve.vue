<template>
    <div ref="chart" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />
</template>
  
<script setup lang="ts">
import { createChart } from 'lightweight-charts'

const colorMode = useColorMode()

let theme = computed(() => colorMode.preference)
let chart = null as any
let lineSeries = null as any

const props = defineProps<{
    equityCurve: { time: number, value: number }[]
}>()

const settings = ref({
    width: 800,
    height: 300,
    priceScale: {
        borderColor: 'rgba(197, 203, 206, 1)'
    },
    timeScale: {
        borderColor: 'rgba(197, 203, 206, 1)',
        timeVisible: true,
        secondsVisible: false
    }
})

const lightTheme = ref({
    chart: {
        layout: {
            background: { color: '#ffffff' },
            textColor: 'rgba(33, 56, 77, 1)'
        },
        grid: {
            vertLines: {
                color: '#f1f1f1',
            },
            horzLines: {
                color: '#f1f1f1',
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
            },
            horzLines: {
                color: '#525252',
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

watch(props.equityCurve, (data) => {
    lineSeries.setData(data)
})

watch(theme, (newVal) => {
    checkTheme(newVal)
})

onMounted(() => {
    settings.value.width = chart.clientWidth
    chart = createChart(chart, settings.value)

    lineSeries = chart.addLineSeries({
        lineWidth: 1.5
    })

    chart.timeScale().fitContent()
    lineSeries.setData(props.equityCurve)

    if (theme.value === 'light') {
        chart.applyOptions(lightTheme.value.chart)
        lineSeries.applyOptions(lightTheme.value.series)
    } else {
        chart.applyOptions(darkTheme.value.chart)
        lineSeries.applyOptions(darkTheme.value.series)
    }
})

onBeforeUnmount(() => {
    chart = null
    lineSeries = null
})

function checkTheme(val: string) {
    if (val === 'light') {
        chart.applyOptions(lightTheme.value.chart)
        lineSeries.applyOptions(lightTheme.value.series)
    } else {
        chart.applyOptions(darkTheme.value.chart)
        lineSeries.applyOptions(darkTheme.value.series)
    }
}
</script>
  
  