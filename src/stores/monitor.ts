import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SummaryData, HostStats, MetricPoint, NetworkPoint, LocationData, ModelData } from '@/types/monitor'
import { monitorService } from '@/services/monitorService'

export const useMonitorStore = defineStore('monitor', () => {
  const summary = ref<SummaryData | null>(null)
  const hostStats = ref<HostStats[]>([])
  const cpuTrend = ref<MetricPoint[]>([])
  const memoryTrend = ref<MetricPoint[]>([])
  const networkTrend = ref<NetworkPoint[]>([])
  const locations = ref<Record<string, LocationData>>({})
  const models = ref<Record<string, ModelData>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalHosts = computed(() => summary.value?.hosts || 0)
  const avgCpu = computed(() => summary.value?.avgCpu || 0)
  const avgMem = computed(() => summary.value?.avgMem || 0)
  const totalNetIn = computed(() => summary.value?.totalNetIn || 0)
  const totalNetOut = computed(() => summary.value?.totalNetOut || 0)

  const sortedHosts = computed(() => {
    return [...hostStats.value].sort((a, b) => b.cpuUsage - a.cpuUsage)
  })

  const topCpuHosts = computed(() => sortedHosts.value.slice(0, 5))

  async function loadDashboard() {
    loading.value = true
    error.value = null
    try {
      const [summaryData, stats, cpu, memory, network, locs, mds] = await Promise.all([
        monitorService.getSummary(),
        monitorService.getHostStats(),
        monitorService.getCpuTrend(),
        monitorService.getMemoryTrend(),
        monitorService.getNetworkTrend(),
        monitorService.getLocations(),
        monitorService.getModels()
      ])
      summary.value = summaryData
      hostStats.value = stats
      cpuTrend.value = cpu
      memoryTrend.value = memory
      networkTrend.value = network
      locations.value = locs
      models.value = mds
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  function refresh() {
    return loadDashboard()
  }

  return {
    summary,
    hostStats,
    cpuTrend,
    memoryTrend,
    networkTrend,
    locations,
    models,
    loading,
    error,
    totalHosts,
    avgCpu,
    avgMem,
    totalNetIn,
    totalNetOut,
    sortedHosts,
    topCpuHosts,
    loadDashboard,
    refresh
  }
})