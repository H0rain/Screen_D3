export interface SummaryData {
  todayVisits: number
  realTimeOrders: number
  activeUsers: number
  systemHealth: number
}

export interface TrendData {
  time: string
  visits: number
  orders: number
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

export interface CityRankingData {
  rank: number
  city: string
  visits: number
  percentage: number
}

export interface RadarDimension {
  name: string
  value: number
  max: number
}

export interface RadarData {
  dimensions: RadarDimension[]
}

export interface SituationNode {
  id: string
  name: string
  type: 'center' | 'business' | 'data' | 'service'
  x: number
  y: number
}

export interface SituationEdge {
  source: string
  target: string
  value: number
}

export interface SituationOverview {
  nodes: SituationNode[]
  edges: SituationEdge[]
}

export interface ActivityItem {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  timestamp: string
}

export interface DashboardData {
  summary: SummaryData
  trends: TrendData[]
  categories: CategoryData[]
  cityRanking: CityRankingData[]
  radar: RadarData
  situation: SituationOverview
  activities: ActivityItem[]
}