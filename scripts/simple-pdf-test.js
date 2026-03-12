const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function simplePDFTest() {
  const browser = await chromium.launch({ headless: false }); // Use headed mode to see downloads

  let page = null;
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      acceptDownloads: true,
    });
    page = await context.newPage();

    const downloadPath = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    console.log('Navigating to page...');
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('Taking light mode screenshot (before PDF)...');
    await page.screenshot({ path: path.join(__dirname, 'light-mode-before.png'), fullPage: true });

    console.log('Clicking PDF button...');

    // Intercept blob downloads by overriding URL.createObjectURL
    await page.evaluate(() => {
      window.__pdfBlobs = [];
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = function(blob) {
        if (blob && blob.type === 'application/pdf') {
          window.__pdfBlobs.push(blob);
          console.log('PDF blob captured:', blob.size, 'bytes');
        }
        return originalCreateObjectURL.call(URL, blob);
      };
    });

    // Click the PDF button
    await page.click('button:has-text("PDF 출력")');

    // Wait for PDF generation (html2pdf overlay)
    console.log('Waiting for PDF generation...');
    try {
      await page.waitForSelector('.html2pdf__overlay', { timeout: 10000 });
      console.log('PDF overlay appeared');
    } catch {
      console.log('No overlay detected, continuing...');
    }

    // Wait for it to disappear
    await page.waitForTimeout(15000); // Give it time to generate

    console.log('Taking screenshot after PDF generation...');
    await page.screenshot({ path: path.join(__dirname, 'after-pdf-light.png'), fullPage: true });

    // Try to get the blob data
    const blobInfo = await page.evaluate(async () => {
      if (window.__pdfBlobs && window.__pdfBlobs.length > 0) {
        const blob = window.__pdfBlobs[window.__pdfBlobs.length - 1];
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        return {
          size: blob.size,
          type: blob.type,
          data: Array.from(uint8Array)
        };
      }
      return null;
    });

    if (blobInfo && blobInfo.data) {
      const pdfBuffer = Buffer.from(blobInfo.data);
      const pdfPath = path.join(downloadPath, 'test-light.pdf');
      fs.writeFileSync(pdfPath, pdfBuffer);
      console.log(`Light mode PDF saved to: ${pdfPath} (${blobInfo.size} bytes)`);
    } else {
      console.log('Could not capture PDF blob, check browser downloads folder');
    }

    // Now test dark mode
    console.log('\n--- Testing Dark Mode ---');

    // Switch to dark mode
    console.log('Switching to dark mode...');
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(2000);

    console.log('Taking dark mode screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'dark-mode-before.png'), fullPage: true });

    // Reset blob capture for dark mode
    await page.evaluate(() => {
      window.__pdfBlobs = [];
    });

    console.log('Clicking PDF button for dark mode...');
    await page.click('button:has-text("PDF 출력")');

    // Wait for PDF generation
    await page.waitForTimeout(15000);

    console.log('Taking screenshot after dark PDF generation...');
    await page.screenshot({ path: path.join(__dirname, 'after-pdf-dark.png'), fullPage: true });

    // Try to get the dark mode blob data
    const darkBlobInfo = await page.evaluate(async () => {
      if (window.__pdfBlobs && window.__pdfBlobs.length > 0) {
        const blob = window.__pdfBlobs[window.__pdfBlobs.length - 1];
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        return {
          size: blob.size,
          type: blob.type,
          data: Array.from(uint8Array)
        };
      }
      return null;
    });

    if (darkBlobInfo && darkBlobInfo.data) {
      const pdfBuffer = Buffer.from(darkBlobInfo.data);
      const pdfPath = path.join(downloadPath, 'test-dark.pdf');
      fs.writeFileSync(pdfPath, pdfBuffer);
      console.log(`Dark mode PDF saved to: ${pdfPath} (${darkBlobInfo.size} bytes)`);
    } else {
      console.log('Could not capture dark PDF blob, check browser downloads folder');
    }

    console.log('\n✅ Test completed!');
    console.log('Check the screenshots and PDF files in:', __dirname);

  } catch (error) {
    console.error('Error:', error.message);
    if (page) {
      await page.screenshot({ path: path.join(__dirname, 'error-screenshot.png'), fullPage: true }).catch(() => {});
    }
  } finally {
    await browser.close();
  }
}

simplePDFTest();
