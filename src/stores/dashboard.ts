import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DashboardData } from '@/types'
import { dashboardService } from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const summary = computed(() => data.value?.summary)
  const trends = computed(() => data.value?.trends)
  const categories = computed(() => data.value?.categories)
  const cityRanking = computed(() => data.value?.cityRanking)
  const radar = computed(() => data.value?.radar)
  const situation = computed(() => data.value?.situation)
  const activities = computed(() => data.value?.activities)

  async function loadDashboard() {
    loading.value = true
    error.value = null
    try {
      data.value = await dashboardService.fetchDashboard()
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
    data,
    loading,
    error,
    summary,
    trends,
    categories,
    cityRanking,
    radar,
    situation,
    activities,
    loadDashboard,
    refresh
  }
})