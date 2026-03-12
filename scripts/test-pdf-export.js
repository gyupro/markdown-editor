const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testPDFExport() {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    // Enable download handling
    const downloadPath = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    // Navigate to the page
    console.log('Navigating to page...');
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take screenshot before PDF export in light mode
    console.log('Capturing light mode preview...');
    await page.screenshot({ path: path.join(__dirname, 'before-pdf-light.png'), fullPage: true });

    // Find and click the PDF export button
    console.log('Looking for PDF button...');

    // Try different selectors for the PDF button
    const pdfButton = await page.locator('button:has-text("PDF 출력"), button:has-text("PDF"), [aria-label*="PDF"]').first();

    if (await pdfButton.count() > 0) {
      console.log('Found PDF button, clicking...');

      // Set up download listener before clicking
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

      await pdfButton.click();
      console.log('Clicked PDF button, waiting for download...');

      // Wait for potential download or timeout
      const download = await downloadPromise;

      if (download) {
        const lightPdfPath = path.join(downloadPath, 'light-mode.pdf');
        await download.saveAs(lightPdfPath);
        console.log(`Light mode PDF saved to: ${lightPdfPath}`);
      } else {
        console.log('No download event received - PDF might be generated differently');
        // Take screenshot to see what happened
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(__dirname, 'after-pdf-click-light.png'), fullPage: true });
      }
    } else {
      console.log('PDF button not found. Taking screenshot...');
      await page.screenshot({ path: path.join(__dirname, 'no-pdf-button.png'), fullPage: true });
    }

    // Wait for any UI updates
    await page.waitForTimeout(2000);

    // Switch to dark mode
    console.log('Switching to dark mode...');
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(1000);

    // Take screenshot in dark mode
    console.log('Capturing dark mode preview...');
    await page.screenshot({ path: path.join(__dirname, 'before-pdf-dark.png'), fullPage: true });

    // Try PDF export in dark mode
    const pdfButtonDark = await page.locator('button:has-text("PDF 출력"), button:has-text("PDF"), [aria-label*="PDF"]').first();

    if (await pdfButtonDark.count() > 0) {
      console.log('Found PDF button in dark mode, clicking...');

      const downloadPromiseDark = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

      await pdfButtonDark.click();
      console.log('Clicked PDF button, waiting for download...');

      const downloadDark = await downloadPromiseDark;

      if (downloadDark) {
        const darkPdfPath = path.join(downloadPath, 'dark-mode.pdf');
        await downloadDark.saveAs(darkPdfPath);
        console.log(`Dark mode PDF saved to: ${darkPdfPath}`);
      } else {
        console.log('No download event in dark mode');
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(__dirname, 'after-pdf-click-dark.png'), fullPage: true });
      }
    }

    console.log('\n✅ PDF export test completed!');

  } catch (error) {
    console.error('Error during PDF export test:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

testPDFExport().catch(console.error);
