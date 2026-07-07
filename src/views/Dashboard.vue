<template>
  <div class="dashboard-view">
    <DashboardLayout />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const store = useDashboardStore()

onMounted(() => {
  store.loadDashboard()
})
</script>

<style scoped>
.dashboard-view {
  width: 100%;
  height: 100%;
}
</style>