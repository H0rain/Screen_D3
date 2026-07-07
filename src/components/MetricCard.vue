<template>
  <div class="metric-card">
    <div class="card-header">
      <span class="icon">{{ icon }}</span>
      <span class="label">{{ label }}</span>
    </div>
    <div class="card-body">
      <span class="value">{{ formattedValue }}</span>
      <span v-if="unit" class="unit">{{ unit }}</span>
    </div>
    <div class="card-footer">
      <span :class="['trend', trendClass]">
        {{ trendIcon }}{{ trendText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/utils/format'

const props = defineProps<{
  icon: string
  label: string
  value: number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendText?: string
}>()

const formattedValue = computed(() => formatNumber(props.value))

const trendClass = computed(() => {
  switch (props.trend) {
    case 'up': return 'trend-up'
    case 'down': return 'trend-down'
    default: return 'trend-stable'
  }
})

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up': return '↑'
    case 'down': return '↓'
    default: return '→'
  }
})
</script>

<style scoped>
.metric-card {
  background: linear-gradient(135deg, rgba(84, 112, 198, 0.15) 0%, rgba(145, 204, 117, 0.1) 100%);
  border: 1px solid rgba(84, 112, 198, 0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: rgba(84, 112, 198, 0.6);
  box-shadow: 0 0 20px rgba(84, 112, 198, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 20px;
}

.label {
  font-size: 14px;
  color: #aaa;
}

.card-body {
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
}

.unit {
  font-size: 14px;
  color: #aaa;
}

.card-footer {
  margin-top: 8px;
}

.trend {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.trend-up {
  color: #91cc75;
  background: rgba(145, 204, 117, 0.15);
}

.trend-down {
  color: #ee6666;
  background: rgba(238, 102, 102, 0.15);
}

.trend-stable {
  color: #aaa;
  background: rgba(255, 255, 255, 0.05);
}
</style>