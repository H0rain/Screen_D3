<template>
  <div class="host-list">
    <h3 class="title">主机状态列表</h3>
    <div class="list-container">
      <div
        v-for="host in hosts"
        :key="host.hostid"
        :class="['host-item', getStatusClass(host)]"
      >
        <span class="host-id">{{ host.hostid }}</span>
        <span class="host-name">{{ host.hostname.split('.')[0] }}</span>
        <span class="cpu">CPU: {{ host.cpuUsage.toFixed(1) }}%</span>
        <span class="mem">内存: {{ host.memPercent }}%</span>
        <span class="net">网: {{ (host.netIn + host.netOut).toFixed(1) }} MB/s</span>
        <span :class="['status', getStatusClass(host)]">●</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HostStats } from '@/types/monitor'

defineProps<{
  hosts: HostStats[]
}>()

const getStatusClass = (host: HostStats): string => {
  if (host.cpuUsage > 80 || parseFloat(host.memPercent) > 85) return 'critical'
  if (host.cpuUsage > 60 || parseFloat(host.memPercent) > 70) return 'warning'
  return 'normal'
}
</script>

<style scoped>
.host-list { height: 100%; display: flex; flex-direction: column; }
.title { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.list-container { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
.host-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; background: rgba(255,255,255,0.05); font-size: 12px; transition: all 0.3s; }
.host-item.critical { border-left: 3px solid #ee6666; background: rgba(238,102,102,0.1); }
.host-item.warning { border-left: 3px solid #fac858; background: rgba(250,200,88,0.1); }
.host-item.normal { border-left: 3px solid #91cc75; background: rgba(145,204,117,0.1); }
.host-id { font-weight: 600; color: #5470c6; width: 70px; flex-shrink: 0; }
.host-name { color: #fff; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cpu, .mem, .net { color: #aaa; font-size: 11px; }
.status { font-size: 10px; }
.status.critical { color: #ee6666; }
.status.warning { color: #fac858; }
.status.normal { color: #91cc75; }
</style>