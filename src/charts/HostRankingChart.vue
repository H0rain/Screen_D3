<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { HostStats } from '@/types/monitor'

const props = defineProps<{
  data: HostStats[]
  metric: 'cpu' | 'memory' | 'network'
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance || !props.data.length) return

  const sortedData = [...props.data].sort((a, b) => {
    switch (props.metric) {
      case 'cpu': return b.cpuUsage - a.cpuUsage
      case 'memory': return parseFloat(b.memPercent) - parseFloat(a.memPercent)
      case 'network': return (b.netIn + b.netOut) - (a.netIn + a.netOut)
      default: return 0
    }
  }).slice(0, 8)

  const colors = sortedData.map((_, i) => {
    if (i === 0) return '#ee6666'
    if (i === 1) return '#fac858'
    if (i === 2) return '#91cc75'
    return '#4a5568'
  })

  let yData = sortedData.map(d => d.hostid)
  let xData: number[]
  let unit = ''

  switch (props.metric) {
    case 'cpu':
      xData = sortedData.map(d => d.cpuUsage)
      unit = '%'
      break
    case 'memory':
      xData = sortedData.map(d => parseFloat(d.memPercent))
      unit = '%'
      break
    case 'network':
      xData = sortedData.map(d => (d.netIn + d.netOut).toFixed(1)).map(Number)
      unit = 'MB/s'
      break
    default:
      xData = []
  }

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 20, 60, 0.9)',
      borderColor: 'rgba(100, 150, 255, 0.3)',
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '15%', right: '8%', bottom: '3%', top: '8%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#aaa' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: yData,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#fff', fontSize: 12 }
    },
    series: [{
      type: 'bar',
      data: xData.map((value, index) => ({
        value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colors[index] },
            { offset: 1, color: `${colors[index]}60` }
          ]),
          borderRadius: [0, 4, 4, 0]
        }
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        color: '#aaa',
        formatter: `{c}${unit}`
      }
    }]
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(() => props.data, updateChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.chart-container { width: 100%; height: 100%; }
</style>