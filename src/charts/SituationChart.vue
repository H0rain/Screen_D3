<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { SituationOverview } from '@/types'

const props = defineProps<{
  data: SituationOverview
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const getNodeColor = (type: string): string => {
  switch (type) {
    case 'center': return '#5470c6'
    case 'business': return '#91cc75'
    case 'data': return '#fac858'
    case 'service': return '#ee6666'
    default: return '#73c0de'
  }
}

const updateChart = () => {
  if (!chartInstance || !props.data.nodes.length) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(10, 20, 60, 0.9)',
      borderColor: 'rgba(100, 150, 255, 0.3)',
      textStyle: { color: '#fff' }
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        data: props.data.nodes.map(node => ({
          id: node.id,
          name: node.name,
          x: node.x * 8,
          y: node.y * 6,
          symbolSize: node.type === 'center' ? 60 : 40,
          itemStyle: {
            color: getNodeColor(node.type),
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 20,
            shadowColor: getNodeColor(node.type)
          },
          label: {
            show: true,
            color: '#fff',
            fontSize: node.type === 'center' ? 14 : 12,
            fontWeight: node.type === 'center' ? 'bold' : 'normal'
          }
        })),
        links: props.data.edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          lineStyle: {
            color: 'rgba(145, 204, 117, 0.5)',
            width: edge.value / 20,
            curveness: 0.2
          },
          emphasis: {
            lineStyle: {
              color: '#91cc75',
              width: edge.value / 15
            }
          }
        })),
        roam: false,
        draggable: false
      }
    ]
  }

  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
  updateChart()
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