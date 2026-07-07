<template>
  <header class="header">
    <div class="header-left">
      <h1 class="title">如意数据大屏</h1>
      <span class="subtitle">RuyiBigScreen</span>
    </div>
    <div class="header-right">
      <div class="time-display">
        <span class="time-icon">🕐</span>
        <span class="time-text">{{ currentTime }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getCurrentTime } from '@/utils/format'

const currentTime = ref(getCurrentTime())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = getCurrentTime()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(90deg, rgba(84, 112, 198, 0.2) 0%, rgba(145, 204, 117, 0.1) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(90deg, #5470c6 0%, #91cc75 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #aaa;
  letter-spacing: 2px;
}

.header-right {
  display: flex;
  align-items: center;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(84, 112, 198, 0.3);
}

.time-icon {
  font-size: 18px;
}

.time-text {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  font-family: 'Courier New', monospace;
}
</style>