const { chromium } = require('playwright');
const path = require('path');

async function headedTest() {
  const browser = await chromium.launch({ headless: false });
  let page = null;

  try {
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
    });
    page = await context.newPage();

    // Light mode test
    console.log('=== LIGHT MODE ===');
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Force light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(500);

    const theme1 = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    console.log('Current theme:', theme1);

    // Click PDF button
    console.log('Clicking PDF button...');
    await page.click('button:has-text("PDF 출력")');

    // Wait for PDF generation and download (15 seconds)
    console.log('Waiting 15s for PDF generation...');
    await page.waitForTimeout(15000);

    // Dark mode test
    console.log('\n=== DARK MODE ===');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Force dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(500);

    const theme2 = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    console.log('Current theme:', theme2);

    // Click PDF button
    console.log('Clicking PDF button...');
    await page.click('button:has-text("PDF 출력")');

    // Wait for PDF generation and download (15 seconds)
    console.log('Waiting 15s for PDF generation...');
    await page.waitForTimeout(15000);

    console.log('\n✅ Test completed! Check ~/다운로드 for new PDFs');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

headedTest();
