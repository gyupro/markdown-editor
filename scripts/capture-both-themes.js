const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureBothThemes() {
  // Set a specific download directory
  const downloadDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  // Clear old PDFs in download directory
  const oldPdfs = fs.readdirSync(downloadDir).filter(f => f.endsWith('.pdf'));
  oldPdfs.forEach(f => fs.unlinkSync(path.join(downloadDir, f)));

  const browser = await chromium.launch({
    headless: true,
    downloadsPath: downloadDir
  });

  let page = null;
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true,
    });
    page = await context.newPage();

    // ============= LIGHT MODE TEST =============
    console.log('=== LIGHT MODE TEST ===');
    console.log('Navigating to page...');
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Ensure light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(1000);

    const lightTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    console.log('Theme before light PDF:', lightTheme);

    // Take screenshot of light mode
    await page.screenshot({ path: path.join(__dirname, 'compare-light-preview.png'), fullPage: true });

    // Click PDF and wait for download
    console.log('Generating light mode PDF...');
    const [lightDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('button:has-text("PDF 출력")')
    ]);

    const lightPdfPath = path.join(downloadDir, 'light-mode.pdf');
    await lightDownload.saveAs(lightPdfPath);
    console.log(`Light PDF saved: ${lightPdfPath}`);

    // Wait for overlay to clear
    await page.waitForTimeout(3000);
    try {
      await page.waitForSelector('.html2pdf__overlay', { state: 'detached', timeout: 10000 });
    } catch (e) {
      console.log('Overlay already cleared');
    }

    // ============= DARK MODE TEST =============
    console.log('\n=== DARK MODE TEST ===');

    // Reload page to clear any state
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(1000);

    const darkTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    console.log('Theme before dark PDF:', darkTheme);

    // Take screenshot of dark mode
    await page.screenshot({ path: path.join(__dirname, 'compare-dark-preview.png'), fullPage: true });

    // Click PDF and wait for download
    console.log('Generating dark mode PDF...');
    const [darkDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('button:has-text("PDF 출력")')
    ]);

    const darkPdfPath = path.join(downloadDir, 'dark-mode.pdf');
    await darkDownload.saveAs(darkPdfPath);
    console.log(`Dark PDF saved: ${darkPdfPath}`);

    // Convert PDFs to PNGs for comparison
    console.log('\n=== CONVERTING PDFs TO PNGs ===');
    const { execSync } = require('child_process');

    try {
      execSync(`pdftoppm -png -f 1 -l 1 "${lightPdfPath}" "${path.join(downloadDir, 'light-pdf')}"`, { stdio: 'inherit' });
      execSync(`pdftoppm -png -f 1 -l 1 "${darkPdfPath}" "${path.join(downloadDir, 'dark-pdf')}"`, { stdio: 'inherit' });
      console.log('PDFs converted to PNG for inspection');
    } catch (e) {
      console.log('PDF to PNG conversion failed:', e.message);
    }

    console.log('\n✅ Both theme PDFs generated successfully!');
    console.log('Check screenshots and PDFs in:', downloadDir);

  } catch (error) {
    console.error('Error:', error.message);
    if (page) {
      await page.screenshot({ path: path.join(__dirname, 'error.png'), fullPage: true }).catch(() => {});
    }
  } finally {
    await browser.close();
  }
}

captureBothThemes();
