const { chromium } = require('playwright');
const path = require('path');

async function captureFullscreen() {
  const browser = await chromium.launch({ headless: false });
  let page = null;

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    page = await context.newPage();

    console.log('Navigating to page...');
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of normal view
    console.log('Taking normal preview screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'normal-preview.png'), fullPage: true });

    // Click fullscreen button
    console.log('Clicking fullscreen button...');
    await page.click('button:has-text("전체화면 미리보기")');
    await page.waitForTimeout(1500);

    // Take fullscreen screenshot
    console.log('Taking fullscreen preview screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'fullscreen-preview.png'), fullPage: true });

    console.log('✅ Screenshots captured!');
    console.log('Check:', path.join(__dirname));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureFullscreen();
