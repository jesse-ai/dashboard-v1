<template>
  <div ref="chartContainer" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />

  <div class="mt-2">
    <span
      v-for="d in data" :key="d.name"
      class="text-xs mr-2 rounded bg-white dark:bg-gray-700 p-1"
    >
      <span class="inline-block" :style="{ backgroundColor: d.color, width: '25px', height: '10px' }" />
      <span class="ml-2">{{ d.name }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
} from 'lightweight-charts'
import { settings, lightTheme, darkTheme } from '~/composables/charts/lineSeries'

const colorMode = useColorMode()
const theme = computed(() => colorMode.value)
const chartContainer = ref()
let chart: IChartApi | null = null
let series: ISeriesApi<any>[] = []

const props = defineProps<{
  data: EquityCurve[]
}>()

watch(props.data, (data) => {
  if (series === null) return

  // series.setData(data)
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

  // series
  for (const eq of props.data) {
    const s = chart.addLineSeries({
      lineWidth: 2,
    })
    s.setData(eq.data as any)
    series.push(s)
  }

  chart.timeScale().fitContent()

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
    series = []
  }
}

function setTheme(val: string) {
  if (chart === null || series === null) return

  chart.applyOptions(
    val === 'light' ? lightTheme.chart : darkTheme.chart
  )
  // for (const key in series) {
  //   series[key].applyOptions(
  //     val === 'light' ? lightTheme.series : darkTheme.series
  //   )
  // }
}
</script>

