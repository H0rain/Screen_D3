<template>
  <div class="activity-list">
    <h3 class="title">实时动态与告警</h3>
    <div class="list-container">
      <div
        v-for="activity in activities"
        :key="activity.id"
        :class="['activity-item', activity.type]"
      >
        <span class="type-icon">{{ getTypeIcon(activity.type) }}</span>
        <span class="message">{{ activity.message }}</span>
        <span class="timestamp">{{ activity.timestamp }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityItem } from '@/types'

defineProps<{
  activities: ActivityItem[]
}>()

const getTypeIcon = (type: ActivityItem['type']): string => {
  switch (type) {
    case 'success': return '✓'
    case 'warning': return '⚠'
    case 'error': return '✗'
    default: return 'ℹ'
  }
}
</script>

<style scoped>
.activity-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.list-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.activity-item.info {
  background: rgba(115, 192, 222, 0.1);
  border-left: 3px solid #73c0de;
}

.activity-item.success {
  background: rgba(145, 204, 117, 0.1);
  border-left: 3px solid #91cc75;
}

.activity-item.warning {
  background: rgba(250, 200, 88, 0.1);
  border-left: 3px solid #fac858;
}

.activity-item.error {
  background: rgba(238, 102, 102, 0.1);
  border-left: 3px solid #ee6666;
}

.type-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.message {
  flex: 1;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timestamp {
  color: #aaa;
  font-size: 11px;
  flex-shrink: 0;
}
</style>