<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { TrendData } from '@/types'

const props = defineProps<{
  data: TrendData[]
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

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 20, 60, 0.9)',
      borderColor: 'rgba(100, 150, 255, 0.3)',
      textStyle: { color: '#fff' }
    },
    legend: {
      data: ['访问量', '订单数'],
      textStyle: { color: '#aaa' },
      top: 0
    },
    xAxis: {
      type: 'category',
      data: props.data.map(d => d.time),
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#aaa', fontSize: 10 }
    },
    yAxis: [
      {
        type: 'value',
        name: '访问量',
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#aaa' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      {
        type: 'value',
        name: '订单数',
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: '#aaa' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '访问量',
        type: 'line',
        data: props.data.map(d => d.visits),
        smooth: true,
        lineStyle: { color: '#5470c6', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
          ])
        },
        itemStyle: { color: '#5470c6' }
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        data: props.data.map(d => d.orders),
        smooth: true,
        lineStyle: { color: '#91cc75', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(145, 204, 117, 0.5)' },
            { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
          ])
        },
        itemStyle: { color: '#91cc75' }
      }
    ]
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
.chart-container {
  width: 100%;
  height: 100%;
}
</style>