import { chromium, devices } from 'playwright';

const base = 'http://127.0.0.1:4173/';
const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await desktop.newPage();
await dp.goto(base, { waitUntil: 'networkidle' });
await dp.screenshot({ path: 'artifacts/site-stats-desktop.png', fullPage: true });
await desktop.close();

const mobile = await browser.newContext({ ...devices['iPhone 13'] });
const mp = await mobile.newPage();
await mp.goto(base, { waitUntil: 'networkidle' });
await mp.screenshot({ path: 'artifacts/site-stats-mobile.png', fullPage: true });
await mobile.close();

await browser.close();
console.log('screenshots done');
