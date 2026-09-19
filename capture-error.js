import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('Page error:', err.toString());
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });

  await page.goto('http://localhost:3000');
  
  // Wait a bit for React to render and throw
  await new Promise(r => setTimeout(r, 2000));
  
  // Let's try to login
  try {
    await page.type('input[type="email"]', 'test@test.com');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
    
    // Now click on KPIs module
    const elements = await page.$$('button');
    for (let el of elements) {
      const text = await page.evaluate(e => e.textContent, el);
      if (text && text.includes('Métricas y KPIs')) {
        await el.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log("Error during interaction:", e);
  }

  await browser.close();
})();
