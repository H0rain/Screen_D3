<template>
  <div class="dashboard-layout">
    <Header />
    <main class="main-content">
      <div class="metrics-row">
        <MetricCard
          icon="👁"
          label="今日访问量"
          :value="summary?.todayVisits || 0"
          trend="up"
          trend-text="+12.5%"
        />
        <MetricCard
          icon="📋"
          label="实时订单数"
          :value="summary?.realTimeOrders || 0"
          unit="单"
          trend="up"
          trend-text="+8.3%"
        />
        <MetricCard
          icon="👥"
          label="活跃用户数"
          :value="summary?.activeUsers || 0"
          trend="up"
          trend-text="+15.2%"
        />
        <MetricCard
          icon="💚"
          label="系统健康度"
          :value="summary?.systemHealth || 0"
          unit="%"
          trend="stable"
          trend-text="正常"
        />
      </div>

      <div class="charts-grid">
        <div class="chart-section trend-section">
          <h3 class="section-title">访问趋势</h3>
          <TrendChart :data="trends || []" />
        </div>

        <div class="chart-section category-section">
          <h3 class="section-title">分类占比</h3>
          <CategoryChart :data="categories || []" />
        </div>

        <div class="chart-section situation-section">
          <h3 class="section-title">中心态势总览</h3>
          <SituationChart :data="situation || { nodes: [], edges: [] }" />
        </div>

        <div class="chart-section ranking-section">
          <h3 class="section-title">城市访问排名</h3>
          <CityRankingChart :data="cityRanking || []" />
        </div>

        <div class="chart-section radar-section">
          <h3 class="section-title">能力雷达模型</h3>
          <RadarChart :data="radar || { dimensions: [] }" />
        </div>

        <div class="chart-section activity-section">
          <ActivityList :activities="activities || []" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import Header from '@/components/Header.vue'
import MetricCard from '@/components/MetricCard.vue'
import ActivityList from '@/components/ActivityList.vue'
import TrendChart from '@/charts/TrendChart.vue'
import CategoryChart from '@/charts/CategoryChart.vue'
import CityRankingChart from '@/charts/CityRankingChart.vue'
import RadarChart from '@/charts/RadarChart.vue'
import SituationChart from '@/charts/SituationChart.vue'

const store = useDashboardStore()

const summary = store.summary
const trends = store.trends
const categories = store.categories
const cityRanking = store.cityRanking
const radar = store.radar
const situation = store.situation
const activities = store.activities
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.main-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.charts-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
}

.chart-section {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.trend-section {
  grid-column: span 2;
}

.category-section {
  grid-column: span 1;
}

.situation-section {
  grid-column: span 1;
  grid-row: span 2;
}

.ranking-section {
  grid-column: span 1;
}

.radar-section {
  grid-column: span 1;
}

.activity-section {
  grid-column: span 1;
}

.chart-section > :deep(.chart-container) {
  flex: 1;
  min-height: 0;
}

@media (max-width: 1400px) {
  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }

  .trend-section {
    grid-column: span 2;
  }

  .situation-section {
    grid-column: span 2;
    grid-row: span 1;
  }
}
</style>