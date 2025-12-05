const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    // Navigate to the page
    await page.goto('http://localhost:3001/ko');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take full page screenshot in light mode
    await page.screenshot({ path: path.join(__dirname, 'light-full.png'), fullPage: true });

    // Find the preview section and capture it
    const previewSection = await page.locator('article').first();
    if (await previewSection.count() > 0) {
      await previewSection.screenshot({ path: path.join(__dirname, 'light-preview.png') });
    }

    // Get computed styles for key elements in light mode
    const lightStyles = await page.evaluate(() => {
      const styles = {};
      const article = document.querySelector('article');
      if (!article) return styles;

      const elements = {
        'article': article,
        'h1': article.querySelector('h1'),
        'h2': article.querySelector('h2'),
        'h3': article.querySelector('h3'),
        'p': article.querySelector('p'),
        'pre': article.querySelector('pre'),
        'table': article.querySelector('table'),
        'th': article.querySelector('th'),
        'td': article.querySelector('td'),
        'blockquote': article.querySelector('blockquote'),
        'code': article.querySelector('code:not(pre code)'),
        'ul': article.querySelector('ul'),
        'li': article.querySelector('li'),
        'strong': article.querySelector('strong'),
        'em': article.querySelector('em'),
        'hr': article.querySelector('hr'),
      };

      for (const [name, el] of Object.entries(elements)) {
        if (el) {
          const computed = window.getComputedStyle(el);
          styles[name] = {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            lineHeight: computed.lineHeight,
            margin: computed.margin,
            padding: computed.padding,
            borderLeft: computed.borderLeft,
            borderColor: computed.borderColor,
            borderRadius: computed.borderRadius,
            boxShadow: computed.boxShadow,
          };
        }
      }
      return styles;
    });

    fs.writeFileSync(path.join(__dirname, 'light-styles.json'), JSON.stringify(lightStyles, null, 2));

    // Toggle to dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(1000);

    // Take screenshot in dark mode
    await page.screenshot({ path: path.join(__dirname, 'dark-full.png'), fullPage: true });

    const previewSectionDark = await page.locator('article').first();
    if (await previewSectionDark.count() > 0) {
      await previewSectionDark.screenshot({ path: path.join(__dirname, 'dark-preview.png') });
    }

    // Get computed styles for dark mode
    const darkStyles = await page.evaluate(() => {
      const styles = {};
      const article = document.querySelector('article');
      if (!article) return styles;

      const elements = {
        'article': article,
        'h1': article.querySelector('h1'),
        'h2': article.querySelector('h2'),
        'h3': article.querySelector('h3'),
        'p': article.querySelector('p'),
        'pre': article.querySelector('pre'),
        'table': article.querySelector('table'),
        'th': article.querySelector('th'),
        'td': article.querySelector('td'),
        'blockquote': article.querySelector('blockquote'),
        'code': article.querySelector('code:not(pre code)'),
        'ul': article.querySelector('ul'),
        'li': article.querySelector('li'),
        'strong': article.querySelector('strong'),
        'em': article.querySelector('em'),
        'hr': article.querySelector('hr'),
      };

      for (const [name, el] of Object.entries(elements)) {
        if (el) {
          const computed = window.getComputedStyle(el);
          styles[name] = {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            lineHeight: computed.lineHeight,
            margin: computed.margin,
            padding: computed.padding,
            borderLeft: computed.borderLeft,
            borderColor: computed.borderColor,
            borderRadius: computed.borderRadius,
            boxShadow: computed.boxShadow,
          };
        }
      }
      return styles;
    });

    fs.writeFileSync(path.join(__dirname, 'dark-styles.json'), JSON.stringify(darkStyles, null, 2));

    // Get HTML content of preview section
    const previewHTML = await page.evaluate(() => {
      const article = document.querySelector('article');
      return article ? article.outerHTML : 'No article found';
    });
    fs.writeFileSync(path.join(__dirname, 'preview-html.txt'), previewHTML);

    console.log('=== Light Mode Styles ===');
    console.log(JSON.stringify(lightStyles, null, 2));
    console.log('\n=== Dark Mode Styles ===');
    console.log(JSON.stringify(darkStyles, null, 2));
    console.log('\nScreenshots captured successfully!');

  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
