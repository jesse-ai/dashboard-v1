<template>
  <div ref="chartContainer" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />
</template>

<script setup lang="ts">
import {
  createChart,
  type IChartApi,
  type ISeriesApi
} from 'lightweight-charts'
import { settings, lightTheme, darkTheme } from '~/composables/charts/lineSeries'

const colorMode = useColorMode()
const theme = computed(() => colorMode.value)
const chartContainer = ref()
let chart: IChartApi | null = null
let series: ISeriesApi<any> | null = null

const props = defineProps<{
  equityCurve: { time: number, value: number }[]
}>()

watch(props.equityCurve, (data) => {
  if (series === null) return

  series.setData(data)
})

watch(theme, (newVal) => {
  setTheme(newVal)
})

onMounted(async () => {
  await init()
})

async function init() {
  settings.width = chartContainer.value.clientWidth

  chart = createChart(chartContainer.value, settings)

  series = chart.addLineSeries({
    lineWidth: 2
  })

  chart.timeScale().fitContent()
  series.setData(props.equityCurve)

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

function setTheme(val: string) {
  if (chart === null || series === null) return

  chart.applyOptions(
    val === 'light' ? lightTheme.chart : darkTheme.chart
  )
  series.applyOptions(
    val === 'light' ? lightTheme.series : darkTheme.series
  )
}
</script>

