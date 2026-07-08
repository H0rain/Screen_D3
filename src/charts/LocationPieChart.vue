<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { LocationData, ModelData } from '@/types/monitor'

const props = defineProps<{
  data: Record<string, LocationData> | Record<string, ModelData>
  type: 'location' | 'model'
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance || !Object.keys(props.data).length) return

  const data = Object.entries(props.data).map(([name, value], index) => ({
    name,
    value: value.count,
    itemStyle: { color: colors[index % colors.length] }
  }))

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 20, 60, 0.9)',
      borderColor: 'rgba(100, 150, 255, 0.3)',
      textStyle: { color: '#fff' },
      formatter: '{b}: {c}台 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#aaa', fontSize: 12 },
      itemGap: 12
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: 'rgba(10, 20, 60, 0.8)',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#fff',
        formatter: '{b}\n{c}台'
      },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
      data
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