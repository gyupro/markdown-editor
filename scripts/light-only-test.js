const { chromium } = require('playwright');
const path = require('path');

async function lightOnlyTest() {
  const browser = await chromium.launch({
    headless: false,
  });
  let page = null;

  try {
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      colorScheme: 'light', // Force light color scheme
    });
    page = await context.newPage();

    console.log('Navigating to page...');
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Force light mode multiple times to be sure
    console.log('Forcing light mode...');
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      // Also set color-scheme
      document.documentElement.style.colorScheme = 'light';
    });
    await page.waitForTimeout(1000);

    // Take screenshot to verify light mode
    await page.screenshot({ path: path.join(__dirname, 'light-verify.png'), fullPage: true });

    const theme = await page.evaluate(() => ({
      htmlHasDark: document.documentElement.classList.contains('dark'),
      bodyHasDark: document.body.classList.contains('dark'),
      localStorage: localStorage.getItem('theme'),
    }));
    console.log('Theme check:', theme);

    // Click fullscreen button first to see the preview
    console.log('Clicking fullscreen button...');
    await page.click('button:has-text("전체화면 미리보기")');
    await page.waitForTimeout(2000);

    // Take screenshot of fullscreen preview
    await page.screenshot({ path: path.join(__dirname, 'fullscreen-light-verify.png'), fullPage: true });

    // Now click PDF button in fullscreen mode (use force: true to bypass intercept)
    console.log('Clicking PDF button...');
    await page.locator('[role="dialog"] button:has-text("PDF")').click({ force: true });

    console.log('Waiting 20s for PDF generation...');
    await page.waitForTimeout(20000);

    console.log('✅ Test completed! Check ~/다운로드 for new PDF');

  } catch (error) {
    console.error('Error:', error.message);
    if (page) {
      await page.screenshot({ path: path.join(__dirname, 'error.png'), fullPage: true });
    }
  } finally {
    await browser.close();
  }
}

lightOnlyTest();
