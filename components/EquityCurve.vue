<template>
  <div ref="chart" class="rounded overflow-hidden border-2 border-gray-100 dark:border-gray-600" />
</template>

<script setup lang="ts">
import { createChart } from 'lightweight-charts'
import { settings, lightTheme, darkTheme } from '~/composables/charts/lineSeries'

const colorMode = useColorMode()

const theme = computed(() => colorMode.preference)
let chart = null as any
let lineSeries = null as any

const props = defineProps<{
  equityCurve: { time: number, value: number }[]
}>()


watch(props.equityCurve, (data) => {
  lineSeries.setData(data)
})

watch(theme, (newVal) => {
  checkTheme(newVal)
})

onMounted(() => {
  settings.width = chart.clientWidth
  chart = createChart(chart, settings)

  lineSeries = chart.addLineSeries({
    lineWidth: 1.5
  })

  chart.timeScale().fitContent()
  lineSeries.setData(props.equityCurve)

  if (theme.value === 'light') {
    chart.applyOptions(lightTheme.chart)
    lineSeries.applyOptions(lightTheme.series)
  }
  else {
    chart.applyOptions(darkTheme.chart)
    lineSeries.applyOptions(darkTheme.series)
  }
})

onBeforeUnmount(() => {
  chart = null
  lineSeries = null
})

function checkTheme(val: string) {
  if (val === 'light') {
    chart.applyOptions(lightTheme.chart)
    lineSeries.applyOptions(lightTheme.series)
  }
  else {
    chart.applyOptions(darkTheme.chart)
    lineSeries.applyOptions(darkTheme.series)
  }
}
</script>

