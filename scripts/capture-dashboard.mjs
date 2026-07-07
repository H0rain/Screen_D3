import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:10001'
const outputDir = join(__dirname, '../docs/screenshots')
const outputFile = join(outputDir, 'dashboard-1920x1080.png')

const consoleErrors = []

async function captureDashboard() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  })
  const page = await context.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' })

    await page.waitForSelector('header h1', { timeout: 5000 })
    await page.waitForSelector('.metric-card', { timeout: 5000 })
    await page.waitForSelector('.situation-section', { timeout: 5000 })

    await page.waitForTimeout(2000)

    await page.screenshot({
      path: outputFile,
      fullPage: true
    })

    console.log(`Screenshot saved to: ${outputFile}`)

    if (consoleErrors.length > 0) {
      console.error('Console errors found:')
      consoleErrors.forEach((error) => console.error(`  - ${error}`))
      process.exit(1)
    }
  } catch (error) {
    console.error('Error capturing dashboard:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

captureDashboard()