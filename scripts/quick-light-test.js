const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function quickLightTest() {
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

    // Ensure light mode
    console.log('Ensuring light mode...');
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(1000);

    console.log('Taking light mode screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'verify-light-before.png'), fullPage: true });

    // Check what theme will be detected
    const theme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    console.log('Detected theme before PDF:', theme);

    console.log('Clicking PDF button...');
    await page.click('button:has-text("PDF 출력")');

    // Wait for PDF generation
    console.log('Waiting for PDF generation (20 seconds)...');
    await page.waitForTimeout(20000);

    console.log('Taking screenshot after PDF...');
    await page.screenshot({ path: path.join(__dirname, 'verify-light-after.png'), fullPage: true });

    console.log('\n✅ Light mode test completed!');
    console.log('Check ~/다운로드 for the new PDF');

  } catch (error) {
    console.error('Error:', error.message);
    if (page) {
      await page.screenshot({ path: path.join(__dirname, 'error-light.png'), fullPage: true }).catch(() => {});
    }
  } finally {
    await browser.close();
  }
}

quickLightTest();
