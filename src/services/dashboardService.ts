import axios from 'axios'
import type { DashboardData } from '@/types'
import { mockDashboardData } from '@/mocks/data'

const isMockMode = import.meta.env.VITE_DATA_SOURCE !== 'api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000
})

export const dashboardService = {
  async fetchDashboard(): Promise<DashboardData> {
    if (isMockMode) {
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockDashboardData
    }
    const response = await apiClient.get<DashboardData>('/dashboard')
    return response.data
  }
}