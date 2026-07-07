import type { DashboardData } from '@/types'

const generateTrends = (): DashboardData['trends'] => {
  const trends: DashboardData['trends'] = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    const hour = time.getHours().toString().padStart(2, '0')
    trends.push({
      time: `${hour}:00`,
      visits: Math.floor(Math.random() * 500) + 200,
      orders: Math.floor(Math.random() * 100) + 20
    })
  }
  return trends
}

const generateCategories = (): DashboardData['categories'] => [
  { name: '课程学习', value: 35, color: '#5470c6' },
  { name: '项目实战', value: 28, color: '#91cc75' },
  { name: '资料下载', value: 20, color: '#fac858' },
  { name: '社区讨论', value: 12, color: '#ee6666' },
  { name: '其他', value: 5, color: '#73c0de' }
]

const generateCityRanking = (): DashboardData['cityRanking'] => [
  { rank: 1, city: '北京', visits: 12580, percentage: 28.5 },
  { rank: 2, city: '上海', visits: 10320, percentage: 23.2 },
  { rank: 3, city: '广州', visits: 6850, percentage: 15.4 },
  { rank: 4, city: '深圳', visits: 5420, percentage: 12.2 },
  { rank: 5, city: '杭州', visits: 3890, percentage: 8.8 },
  { rank: 6, city: '成都', visits: 2650, percentage: 6.0 },
  { rank: 7, city: '武汉', visits: 1890, percentage: 4.3 },
  { rank: 8, city: '南京', visits: 1520, percentage: 3.4 }
]

const generateRadar = (): DashboardData['radar'] => ({
  dimensions: [
    { name: '前端基础', value: 85, max: 100 },
    { name: '图表配置', value: 78, max: 100 },
    { name: '数据建模', value: 72, max: 100 },
    { name: '工程化', value: 88, max: 100 },
    { name: '性能优化', value: 75, max: 100 },
    { name: '团队协作', value: 82, max: 100 }
  ]
})

const generateSituation = (): DashboardData['situation'] => ({
  nodes: [
    { id: 'center', name: '如意中枢', type: 'center', x: 50, y: 50 },
    { id: 'learning', name: '学习中心', type: 'business', x: 20, y: 30 },
    { id: 'project', name: '项目中心', type: 'business', x: 80, y: 30 },
    { id: 'resource', name: '资源库', type: 'data', x: 20, y: 70 },
    { id: 'community', name: '社区', type: 'service', x: 80, y: 70 },
    { id: 'analytics', name: '数据分析', type: 'data', x: 50, y: 20 }
  ],
  edges: [
    { source: 'center', target: 'learning', value: 85 },
    { source: 'center', target: 'project', value: 92 },
    { source: 'center', target: 'resource', value: 78 },
    { source: 'center', target: 'community', value: 65 },
    { source: 'learning', target: 'analytics', value: 70 },
    { source: 'project', target: 'analytics', value: 88 }
  ]
})

const generateActivities = (): DashboardData['activities'] => {
  const types: DashboardData['activities'][0]['type'][] = ['info', 'warning', 'success', 'info']
  const messages = [
    '新用户注册成功',
    '课程《Vue3实战》学习人数突破1000',
    '系统备份完成',
    '数据同步任务执行成功',
    '用户活跃度达到历史新高',
    '检测到异常访问，已自动拦截',
    '项目《电商大屏》提交审核',
    '资料下载量今日已达5000次'
  ]
  const activities: DashboardData['activities'] = []
  for (let i = 0; i < 8; i++) {
    const now = new Date()
    const time = new Date(now.getTime() - i * Math.floor(Math.random() * 300000) - 60000)
    activities.push({
      id: `act-${i}`,
      type: types[i % types.length],
      message: messages[i],
      timestamp: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
    })
  }
  return activities
}

export const mockDashboardData: DashboardData = {
  summary: {
    todayVisits: 44100,
    realTimeOrders: 158,
    activeUsers: 8560,
    systemHealth: 98
  },
  trends: generateTrends(),
  categories: generateCategories(),
  cityRanking: generateCityRanking(),
  radar: generateRadar(),
  situation: generateSituation(),
  activities: generateActivities()
}