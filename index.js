const puppeteer = require('puppeteer');

(async () => {
  const COLAB_URL = process.env.COLAB_URL;
  const COOKIES = process.env.COOKIE_STRING;

  if (!COLAB_URL || !COOKIES) {
    console.error("Missing COLAB_URL or COOKIE_STRING environment variables");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    'cookie': COOKIES
  });

  console.log('Opening Colab notebook...');
  await page.goto(COLAB_URL, { waitUntil: 'networkidle2' });

  await page.waitForSelector('colab-toolbar-button[tooltip="Run all"]', {timeout: 60000});
  await page.click('colab-toolbar-button[tooltip="Run all"]');
  console.log('Clicked Run All');

  // Wait 30 seconds to let notebook fully start
  await new Promise(r => setTimeout(r, 30000));
  await browser.close();
  console.log('Notebook restarted successfully');
})();
