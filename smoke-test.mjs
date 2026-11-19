import { chromium } from 'playwright';

let browser = null;
try {
  browser = await chromium.launch({ channel: 'chromium' });
  const page = await browser.newPage();
  await page.goto(new URL('index.html', import.meta.url).href);
  await page.waitForSelector('body');
  console.log('smoke: page loaded OK');
} finally {
  if (browser !== null) {
    await browser.close();
  }
}
