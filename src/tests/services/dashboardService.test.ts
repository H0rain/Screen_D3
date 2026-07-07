import { describe, it, expect } from 'vitest'
import { dashboardService } from '@/services/dashboardService'

describe('dashboardService', () => {
  it('should fetch dashboard data successfully', async () => {
    const data = await dashboardService.fetchDashboard()
    expect(data).toBeDefined()
    expect(data.summary).toBeDefined()
    expect(data.trends).toBeDefined()
    expect(data.categories).toBeDefined()
    expect(data.cityRanking).toBeDefined()
    expect(data.radar).toBeDefined()
    expect(data.situation).toBeDefined()
    expect(data.activities).toBeDefined()
  })

  it('should have correct summary structure', async () => {
    const data = await dashboardService.fetchDashboard()
    expect(typeof data.summary.todayVisits).toBe('number')
    expect(typeof data.summary.realTimeOrders).toBe('number')
    expect(typeof data.summary.activeUsers).toBe('number')
    expect(typeof data.summary.systemHealth).toBe('number')
  })

  it('should have non-empty trends array', async () => {
    const data = await dashboardService.fetchDashboard()
    expect(data.trends.length).toBeGreaterThan(0)
    expect(data.trends[0]).toHaveProperty('time')
    expect(data.trends[0]).toHaveProperty('visits')
    expect(data.trends[0]).toHaveProperty('orders')
  })

  it('should have non-empty categories array', async () => {
    const data = await dashboardService.fetchDashboard()
    expect(data.categories.length).toBeGreaterThan(0)
    expect(data.categories[0]).toHaveProperty('name')
    expect(data.categories[0]).toHaveProperty('value')
    expect(data.categories[0]).toHaveProperty('color')
  })
})