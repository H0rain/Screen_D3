<template>
  <div class="monitor-layout">
    <header class="header">
      <div class="title-section">
        <h1 class="title">数据中心运行监控大屏</h1>
        <span class="subtitle">Data Center Monitor Dashboard</span>
      </div>
      <div class="time-section">
        <span class="time">{{ currentTime }}</span>
        <span class="date">{{ currentDate }}</span>
      </div>
    </header>

    <main class="main-content">
      <div class="metrics-row">
        <div class="metric-card">
          <span class="icon">🖥️</span>
          <span class="label">主机总数</span>
          <span class="value">{{ summary?.hosts || 0 }}</span>
          <span class="unit">台</span>
        </div>
        <div class="metric-card" :class="{ warning: (summary?.avgCpu || 0) > 60 }">
          <span class="icon">📊</span>
          <span class="label">平均CPU使用率</span>
          <span class="value">{{ (summary?.avgCpu || 0).toFixed(1) }}</span>
          <span class="unit">%</span>
        </div>
        <div class="metric-card" :class="{ warning: (summary?.avgMem || 0) > 150 }">
          <span class="icon">💾</span>
          <span class="label">平均内存使用</span>
          <span class="value">{{ (summary?.avgMem || 0).toFixed(1) }}</span>
          <span class="unit">GB</span>
        </div>
        <div class="metric-card">
          <span class="icon">📡</span>
          <span class="label">入站流量</span>
          <span class="value">{{ (summary?.totalNetIn || 0).toFixed(1) }}</span>
          <span class="unit">MB/s</span>
        </div>
        <div class="metric-card">
          <span class="icon">📤</span>
          <span class="label">出站流量</span>
          <span class="value">{{ (summary?.totalNetOut || 0).toFixed(1) }}</span>
          <span class="unit">MB/s</span>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-section">
          <h3 class="section-title">CPU使用率趋势</h3>
          <MonitorTrendChart :data="cpuTrend" type="cpu" title="CPU使用率" />
        </div>
        <div class="chart-section">
          <h3 class="section-title">内存使用趋势</h3>
          <MonitorTrendChart :data="memoryTrend" type="memory" title="内存使用" />
        </div>
        <div class="chart-section">
          <h3 class="section-title">网络流量趋势</h3>
          <MonitorTrendChart :data="networkTrend" type="network" />
        </div>

        <div class="chart-section">
          <h3 class="section-title">主机CPU排名</h3>
          <HostRankingChart :data="hostStats" metric="cpu" />
        </div>
        <div class="chart-section">
          <h3 class="section-title">机房分布</h3>
          <LocationPieChart :data="locations" type="location" />
        </div>
        <div class="chart-section">
          <h3 class="section-title">机型分布</h3>
          <LocationPieChart :data="models" type="model" />
        </div>

        <div class="chart-section full-width">
          <HostList :hosts="hostStats" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MonitorTrendChart from '@/charts/MonitorTrendChart.vue'
import HostRankingChart from '@/charts/HostRankingChart.vue'
import LocationPieChart from '@/charts/LocationPieChart.vue'
import HostList from '@/components/HostList.vue'

interface SummaryData {
  hosts: number
  avgCpu: number
  avgMem: number
  totalNetIn: number
  totalNetOut: number
  timestamp: number
}

interface HostStats {
  hostid: string
  hostname: string
  owner: string
  model: string
  location1: string
  location2: string
  cpuUsage: number
  memUsed: number
  memFree: number
  memPercent: string
  load1: number
  netIn: number
  netOut: number
  diskUtil: number
}

interface MetricPoint {
  ts: number
  value: number | string
}

interface NetworkPoint {
  ts: number
  in: number
  out: number
}

interface LocationData {
  count: number
  hosts: string[]
}

interface ModelData {
  count: number
  hosts: string[]
}

const summary = ref<SummaryData | null>(null)
const hostStats = ref<HostStats[]>([])
const cpuTrend = ref<MetricPoint[]>([])
const memoryTrend = ref<MetricPoint[]>([])
const networkTrend = ref<NetworkPoint[]>([])
const locations = ref<Record<string, LocationData>>({})
const models = ref<Record<string, ModelData>>({})
const currentTime = ref('')
const currentDate = ref('')

const API_BASE = 'http://localhost:3000/api'

async function fetchData() {
  try {
    const [summaryRes, statsRes, cpuRes, memoryRes, networkRes, locationsRes, modelsRes] = await Promise.all([
      fetch(`${API_BASE}/summary`),
      fetch(`${API_BASE}/hosts/stats`),
      fetch(`${API_BASE}/trends/cpu`),
      fetch(`${API_BASE}/trends/memory`),
      fetch(`${API_BASE}/trends/network`),
      fetch(`${API_BASE}/locations`),
      fetch(`${API_BASE}/models`)
    ])

    summary.value = await summaryRes.json()
    hostStats.value = await statsRes.json()
    cpuTrend.value = await cpuRes.json()
    memoryTrend.value = await memoryRes.json()
    networkTrend.value = await networkRes.json()
    locations.value = await locationsRes.json()
    models.value = await modelsRes.json()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN')
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

let timeInterval: ReturnType<typeof setInterval>
let refreshInterval: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchData()
  refreshInterval = setInterval(fetchData, 30000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
  clearInterval(refreshInterval)
})
</script>

<style scoped>
.monitor-layout { display: flex; flex-direction: column; width: 100%; height: 100%; background: linear-gradient(135deg, #0a1628 0%, #1a2634 100%); }
.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(100,150,255,0.2); }
.title-section { display: flex; align-items: baseline; gap: 16px; }
.title { font-size: 24px; font-weight: 700; color: #fff; margin: 0; background: linear-gradient(90deg, #5470c6, #73c0de); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { font-size: 14px; color: #888; }
.time-section { display: flex; flex-direction: column; align-items: flex-end; }
.time { font-size: 20px; font-weight: 600; color: #73c0de; }
.date { font-size: 12px; color: #666; }
.main-content { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 20px; overflow: hidden; }
.metrics-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.metric-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,0.3); border: 1px solid rgba(100,150,255,0.2); border-radius: 12px; transition: all 0.3s; }
.metric-card:hover { border-color: rgba(100,150,255,0.5); transform: translateY(-2px); }
.metric-card.warning { border-color: rgba(250,200,88,0.5); }
.metric-card.warning .value { color: #fac858; }
.icon { font-size: 28px; margin-bottom: 8px; }
.label { font-size: 14px; color: #aaa; margin-bottom: 8px; }
.value { font-size: 32px; font-weight: 700; color: #fff; }
.unit { font-size: 14px; color: #888; margin-top: 4px; }
.charts-grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 220px 220px 220px; gap: 16px; }
.chart-section { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; }
.section-title { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.full-width { grid-column: span 3; }
.chart-section > :deep(.chart-container) { flex: 1; min-height: 0; }

@media (max-width: 1400px) {
  .metrics-row { grid-template-columns: repeat(3, 1fr); }
  .charts-grid { grid-template-columns: repeat(2, 1fr); }
  .full-width { grid-column: span 2; }
}
@media (max-width: 768px) {
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
  .header { padding: 12px 16px; }
  .title { font-size: 18px; }
}
</style>