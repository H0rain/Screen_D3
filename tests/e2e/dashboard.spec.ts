import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should display the dashboard title', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header h1')).toContainText('如意数据大屏')
    await expect(page.locator('header .subtitle')).toContainText('RuyiBigScreen')
  })

  test('should display the current time', async ({ page }) => {
    await page.goto('/')
    const timeDisplay = page.locator('.time-text')
    await expect(timeDisplay).toBeVisible()
    await expect(timeDisplay).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  test('should display metric cards', async ({ page }) => {
    await page.goto('/')
    const metricCards = page.locator('.metric-card')
    await expect(metricCards).toHaveCount(4)
  })

  test('should display charts', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    await expect(page.locator('.trend-section')).toBeVisible()
    await expect(page.locator('.category-section')).toBeVisible()
    await expect(page.locator('.situation-section')).toBeVisible()
    await expect(page.locator('.ranking-section')).toBeVisible()
    await expect(page.locator('.radar-section')).toBeVisible()
    await expect(page.locator('.activity-section')).toBeVisible()
  })

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    await page.goto('/')
    await page.waitForTimeout(3000)
    expect(errors).toHaveLength(0)
  })
})