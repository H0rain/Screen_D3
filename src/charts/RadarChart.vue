<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { RadarData } from '@/types'

const props = defineProps<{
  data: RadarData
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance || !props.data.dimensions.length) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(10, 20, 60, 0.9)',
      borderColor: 'rgba(100, 150, 255, 0.3)',
      textStyle: { color: '#fff' }
    },
    radar: {
      indicator: props.data.dimensions.map(d => ({
        name: d.name,
        max: d.max
      })),
      center: ['50%', '50%'],
      radius: '65%',
      startAngle: 90,
      splitNumber: 4,
      shape: 'polygon',
      axisName: {
        color: '#fff',
        fontSize: 11
      },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      splitArea: { areaStyle: { color: ['rgba(84, 112, 198, 0.1)', 'rgba(84, 112, 198, 0.05)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.data.dimensions.map(d => d.value),
            name: '能力值',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { color: '#5470c6', width: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ])
            },
            itemStyle: { color: '#5470c6' }
          }
        ]
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