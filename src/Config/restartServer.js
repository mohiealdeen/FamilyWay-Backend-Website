const puppeteer = require('puppeteer');
 // this file help you to get src from github and run it on aws server
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://familyway.sa/secret-restart-123654`, {
    waitUntil: 'networkidle2',
  });
  await browser.close();
})();