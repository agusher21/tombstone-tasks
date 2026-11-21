import { chromium } from 'playwright';

let browser = null;
try {
  browser = await chromium.launch({ channel: 'chromium' });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', function (msg) {
    if (msg.type() === 'error') { errors.push(msg.text()); }
  });
  await page.goto(new URL('index.html', import.meta.url).href);
  await page.waitForSelector('main');
  if (errors.length !== 0) {
    throw new Error('smoke: console errors on load: ' + errors.join(' | '));
  }
  if (!(await page.isVisible('#stats-bar'))) {
    throw new Error('smoke: #stats-bar is not visible');
  }
  console.log('smoke: app load — PASS');
  // Add task appears as a tombstone.
  await page.fill('#task-title', 'Test Ghost');
  await page.check('input[name="hauntingLevel"][value="medium"]');
  await page.click('#add-task-form button[type="submit"]');
  await page.waitForSelector('.tombstone-card');
  const cardTitle = await page.textContent('.tombstone-card:has-text("Test Ghost") h2');
  if (!cardTitle || !cardTitle.includes('Test Ghost')) {
    throw new Error('smoke: added task card does not contain "Test Ghost"');
  }
  const statsAfterAdd = await page.textContent('#stats-bar');
  if (!statsAfterAdd || !statsAfterAdd.includes('Alive: 1')) {
    throw new Error('smoke: stats alive count did not rise to 1 after add: ' + statsAfterAdd);
  }
  console.log('smoke: add task — PASS');
  // Bury task moves it to the Graveyard and updates stats.
  await page.click('button[aria-label^="Bury: Test Ghost"]');
  await page.waitForSelector('#epitaph-dialog', { state: 'visible' });
  await page.click('#epitaph-skip');
  await page.waitForTimeout(800);
  const activeGhosts = await page.locator('#graveyard-active .tombstone-card', { hasText: 'Test Ghost' }).count();
  if (activeGhosts !== 0) {
    throw new Error('smoke: buried task still present in #graveyard-active');
  }
  const buriedGhosts = await page.locator('#graveyard-buried .tombstone-card', { hasText: 'Test Ghost' }).count();
  if (buriedGhosts !== 1) {
    throw new Error('smoke: buried task not found in #graveyard-buried');
  }
  const statsAfterBury = await page.textContent('#stats-bar');
  if (!statsAfterBury || !statsAfterBury.includes('Alive: 0') || !statsAfterBury.includes('Buried: 1')) {
    throw new Error('smoke: stats did not update after bury: ' + statsAfterBury);
  }
  console.log('smoke: bury task — PASS');
  // Filter controls show only the matching section.
  await page.click('#filter-controls button:has-text("Buried")');
  const activeWhenBuried = await page.locator('#graveyard-active .tombstone-card').count();
  if (activeWhenBuried !== 0) {
    throw new Error('smoke: Buried filter still shows active cards');
  }
  await page.click('#filter-controls button:has-text("Alive")');
  const buriedWhenAlive = await page.locator('#graveyard-buried .tombstone-card').count();
  if (buriedWhenAlive !== 0) {
    throw new Error('smoke: Alive filter still shows buried cards');
  }
  await page.click('#filter-controls button:has-text("All")');
  if (!(await page.isVisible('#graveyard-active')) || !(await page.isVisible('#graveyard-buried'))) {
    throw new Error('smoke: All filter does not show both sections');
  }
  const pressedLabel = await page.textContent('#filter-controls button[aria-pressed="true"]');
  if (!pressedLabel || pressedLabel.trim() !== 'All') {
    throw new Error('smoke: aria-pressed is not on the All filter button');
  }
  console.log('smoke: filters — PASS');
  // Risen (overdue) styling: inject an overdue task, reload, check the class.
  await page.evaluate(function () {
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    var data = { tasks: [{ id: 'risen-test', title: 'Risen Test', dueDate: yesterday, buried: false, epitaph: null, buriedAt: null, hauntingLevel: 'low', createdAt: new Date().toISOString() }] };
    localStorage.setItem('tombstone-tasks', JSON.stringify(data));
  });
  await page.reload();
  await page.waitForSelector('.is-risen');
  const risenClass = await page.getAttribute('.is-risen', 'class');
  if (!risenClass || !risenClass.includes('is-risen')) {
    throw new Error('smoke: risen card is missing the is-risen class');
  }
  const risenIcons = await page.locator('.is-risen [aria-hidden="true"]').count();
  if (risenIcons < 1) {
    throw new Error('smoke: risen card has no aria-hidden warning icon');
  }
  console.log('smoke: risen styling — PASS');
} finally {
  if (browser !== null) {
    await browser.close();
  }
}
