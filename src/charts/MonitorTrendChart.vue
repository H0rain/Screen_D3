<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { MetricPoint, NetworkPoint } from '@/types/monitor'

const props = defineProps<{
  data: MetricPoint[] | NetworkPoint[]
  type: 'cpu' | 'memory' | 'network'
  title?: string
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const formatTime = (ts: number): string => {
  const date = new Date(ts)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const updateChart = () => {
  if (!chartInstance || !props.data.length) return

  let option: echarts.EChartsOption

  if (props.type === 'network') {
    const networkData = props.data as NetworkPoint[]
    option = {
      backgroundColor: 'transparent',
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 20, 60, 0.9)',
        borderColor: 'rgba(100, 150, 255, 0.3)',
        textStyle: { color: '#fff' }
      },
      legend: { data: ['入站流量', '出站流量'], textStyle: { color: '#aaa' }, top: 0 },
      xAxis: {
        type: 'category',
        data: networkData.map(d => formatTime(d.ts)),
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#aaa', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: 'MB/s',
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#aaa' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: '入站流量',
          type: 'line',
          data: networkData.map(d => d.in),
          smooth: true,
          lineStyle: { color: '#5470c6', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
              { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
            ])
          }
        },
        {
          name: '出站流量',
          type: 'line',
          data: networkData.map(d => d.out),
          smooth: true,
          lineStyle: { color: '#91cc75', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(145, 204, 117, 0.5)' },
              { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
            ])
          }
        }
      ]
    }
  } else {
    const metricData = props.data as MetricPoint[]
    const unit = props.type === 'cpu' ? '%' : 'GB'
    const color = props.type === 'cpu' ? '#ee6666' : '#fac858'

    option = {
      backgroundColor: 'transparent',
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 20, 60, 0.9)',
        borderColor: 'rgba(100, 150, 255, 0.3)',
        textStyle: { color: '#fff' },
        formatter: `{b}<br/>{a}: {c}${unit}`
      },
      xAxis: {
        type: 'category',
        data: metricData.map(d => formatTime(d.ts)),
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#aaa', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: unit,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#aaa' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: props.title || (props.type === 'cpu' ? 'CPU使用率' : '内存使用'),
          type: 'line',
          data: metricData.map(d => parseFloat(String(d.value))),
          smooth: true,
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}80` },
              { offset: 1, color: `${color}10` }
            ])
          }
        }
      ]
    }
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