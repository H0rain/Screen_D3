import axios from 'axios'
import type { SummaryData, HostStats, MetricPoint, NetworkPoint, LocationData, ModelData, OwnerData } from '@/types/monitor'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})

export const monitorService = {
  async getSummary(): Promise<SummaryData> {
    const response = await apiClient.get<SummaryData>('/summary')
    return response.data
  },

  async getHostStats(): Promise<HostStats[]> {
    const response = await apiClient.get<HostStats[]>('/hosts/stats')
    return response.data
  },

  async getCpuTrend(hostid?: string): Promise<MetricPoint[]> {
    const params = hostid ? { hostid } : {}
    const response = await apiClient.get<MetricPoint[]>('/trends/cpu', { params })
    return response.data
  },

  async getMemoryTrend(hostid?: string): Promise<MetricPoint[]> {
    const params = hostid ? { hostid } : {}
    const response = await apiClient.get<MetricPoint[]>('/trends/memory', { params })
    return response.data
  },

  async getNetworkTrend(hostid?: string): Promise<NetworkPoint[]> {
    const params = hostid ? { hostid } : {}
    const response = await apiClient.get<NetworkPoint[]>('/trends/network', { params })
    return response.data
  },

  async getLocations(): Promise<Record<string, LocationData>> {
    const response = await apiClient.get<Record<string, LocationData>>('/locations')
    return response.data
  },

  async getModels(): Promise<Record<string, ModelData>> {
    const response = await apiClient.get<Record<string, ModelData>>('/models')
    return response.data
  },

  async getOwners(): Promise<Record<string, OwnerData>> {
    const response = await apiClient.get<Record<string, OwnerData>>('/owners')
    return response.data
  }
}