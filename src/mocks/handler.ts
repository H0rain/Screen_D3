import { http, HttpResponse } from 'msw'
import { mockDashboardData } from './data'

export const handlers = [
  http.get('/dashboard', () => {
    return HttpResponse.json(mockDashboardData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
]