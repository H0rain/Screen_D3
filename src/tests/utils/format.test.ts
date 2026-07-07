import { describe, it, expect } from 'vitest'
import { formatNumber, formatPercent, getCurrentTime } from '@/utils/format'

describe('formatNumber', () => {
  it('should format numbers under 10000 correctly', () => {
    expect(formatNumber(1234)).toBe('1,234')
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(9999)).toBe('9,999')
  })

  it('should format numbers over 10000 with "万" unit', () => {
    expect(formatNumber(10000)).toBe('1.0万')
    expect(formatNumber(12345)).toBe('1.2万')
    expect(formatNumber(123456)).toBe('12.3万')
  })
})

describe('formatPercent', () => {
  it('should format percentages correctly', () => {
    expect(formatPercent(50)).toBe('50.0%')
    expect(formatPercent(12.345)).toBe('12.3%')
    expect(formatPercent(99.99)).toBe('100.0%')
  })
})

describe('getCurrentTime', () => {
  it('should return current time in correct format', () => {
    const time = getCurrentTime()
    expect(time).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })
})