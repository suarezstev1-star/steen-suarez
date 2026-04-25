import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const TARGET = 'https://www.thecashteamagency.com';
const OUT = '/home/user/steen-suarez/audit/out';
const SHOTS = path.join(OUT, 'screenshots');
const TIMEOUT = 25000;

const findings = {
  startedAt: new Date().toISOString(),
  target: TARGET,
  pageErrors: [],
  consoleErrors: [],
  failedRequests: [],
  brokenLinks: [],
  internalLinksChecked: [],
  externalLinksChecked: [],
  forms: [],
  buttonsTested: [],
  uxNotes: [],
  screenshots: [],
  pagesVisited: [],
  navigationErrors: [],
};

function log(...a) { console.log('[audit]', ...a); }

function attachListeners(page, label) {
  page.on('pageerror', (err) => {
    findings.pageErrors.push({ page: label, message: err.message, stack: (err.stack || '').split('\n').slice(0, 3).join(' | ') });
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      findings.consoleErrors.push({ page: label, text: msg.text().slice(0, 500) });
    }
  });
  page.on('requestfailed', (req) => {
    findings.failedRequests.push({ page: label, url: req.url(), method: req.method(), failure: req.failure()?.errorText, resourceType: req.resourceType() });
  });
  page.on('response', (resp) => {
    const status = resp.status();
    if (status >= 400) {
      findings.failedRequests.push({ page: label, url: resp.url(), status, method: resp.request().method(), resourceType: resp.request().resourceType() });
    }
  });
}

async function shoot(page, name) {
  const file = path.join(SHOTS, `${name}.png`);
  try {
    await page.screenshot({ path: file, fullPage: true });
    findings.screenshots.push({ name, file });
  } catch (e) {
    findings.uxNotes.push(`Screenshot failed for ${name}: ${e.message}`);
  }
}

async function dismissOverlays(page) {
  const selectors = [
    'button:has-text("Accept")', 'button:has-text("Aceptar")', 'button:has-text("Got it")',
    'button:has-text("Acepto")', 'button:has-text("OK")', 'button:has-text("Allow all")',
    'button:has-text("Agree")', '[id*="cookie"] button', '[class*="cookie"] button',
    '[aria-label*="accept" i]', '[aria-label*="cookie" i] button',
  ];
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.count() > 0 && await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1000 });
        await page.waitForTimeout(300);
        findings.uxNotes.push(`Dismissed overlay matching: ${sel}`);
        break;
      }
    } catch {}
  }
}

async function collectLinks(page) {
  return await page.$$eval('a[href]', (as) => as.map((a) => ({
    href: a.href,
    text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 80),
    target: a.target || '',
    rel: a.rel || '',
  })));
}

async function checkLinkStatus(context, url) {
  try {
    const resp = await context.request.fetch(url, { method: 'HEAD', timeout: 15000, maxRedirects: 5 });
    let status = resp.status();
    if (status === 405 || status === 403) {
      const r2 = await context.request.fetch(url, { method: 'GET', timeout: 15000, maxRedirects: 5 });
      status = r2.status();
    }
    return { url, status, ok: status < 400 };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message.slice(0, 200) };
  }
}

async function describeForms(page, label) {
  const forms = await page.$$eval('form', (fs) => fs.map((f, i) => ({
    index: i,
    action: f.getAttribute('action') || '(none)',
    method: (f.getAttribute('method') || 'GET').toUpperCase(),
    id: f.id || '',
    classes: f.className || '',
    fields: Array.from(f.querySelectorAll('input, textarea, select')).map((el) => ({
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      name: el.getAttribute('name') || '',
      required: el.required || false,
      placeholder: el.getAttribute('placeholder') || '',
      ariaLabel: el.getAttribute('aria-label') || '',
    })),
    submitText: (f.querySelector('button[type=submit], input[type=submit]')?.innerText || f.querySelector('button[type=submit], input[type=submit]')?.value || '').trim(),
  })));
  return forms.map((f) => ({ ...f, page: label }));
}

async function testFormValidation(page, formIndex, label) {
  const result = { page: label, formIndex, validationTriggered: false, notes: [] };
  try {
    const form = page.locator('form').nth(formIndex);
    const submit = form.locator('button[type=submit], input[type=submit]').first();
    if (await submit.count() === 0) {
      result.notes.push('No submit button found inside form');
      return result;
    }
    const emailInput = form.locator('input[type=email]').first();
    if (await emailInput.count() > 0) {
      await emailInput.fill('not-an-email', { timeout: 2000 }).catch(() => {});
    }
    await submit.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
    await submit.click({ timeout: 3000, trial: false }).catch((e) => result.notes.push('click failed: ' + e.message.slice(0, 120)));
    await page.waitForTimeout(800);
    const invalid = await form.locator(':invalid').count();
    const visibleErrors = await page.locator('[role="alert"], .error, .invalid, [class*="error" i]:visible').count().catch(() => 0);
    if (invalid > 0 || visibleErrors > 0) {
      result.validationTriggered = true;
      result.notes.push(`Validation kicked in (invalid=${invalid}, errorElems=${visibleErrors})`);
    } else {
      result.notes.push('No HTML5 validation or visible error after submit with bad data');
    }
  } catch (e) {
    result.notes.push('test error: ' + e.message.slice(0, 200));
  }
  return result;
}

async function run() {
  if (!existsSync(SHOTS)) await mkdir(SHOTS, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141 Safari/537.36 PlaywrightAudit',
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  attachListeners(page, 'home');

  // ---- HOME ----
  log('Navigating to home');
  let resp;
  try {
    resp = await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
  } catch (e) {
    findings.navigationErrors.push({ url: TARGET, error: e.message });
  }
  if (resp) {
    findings.pagesVisited.push({ label: 'home', url: page.url(), status: resp.status() });
    if (resp.status() >= 400) findings.brokenLinks.push({ url: TARGET, status: resp.status(), context: 'home page' });
  }
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await dismissOverlays(page);
  await page.waitForTimeout(800);

  // Title & meta
  const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    viewport: document.querySelector('meta[name="viewport"]')?.content || '',
    lang: document.documentElement.lang || '',
    h1Count: document.querySelectorAll('h1').length,
    h1Text: Array.from(document.querySelectorAll('h1')).map((h) => (h.innerText || '').trim().slice(0, 200)),
    imagesNoAlt: Array.from(document.images).filter((i) => !i.alt && !i.getAttribute('aria-label')).map((i) => i.src).slice(0, 25),
    imagesTotal: document.images.length,
    iframes: document.querySelectorAll('iframe').length,
    buttons: document.querySelectorAll('button, [role=button]').length,
    forms: document.querySelectorAll('form').length,
  }));
  findings.meta = meta;

  if (!meta.title) findings.uxNotes.push('Home: missing <title>');
  if (!meta.description) findings.uxNotes.push('Home: missing meta description');
  if (!meta.viewport) findings.uxNotes.push('Home: missing viewport meta (mobile UX)');
  if (!meta.lang) findings.uxNotes.push('Home: <html> has no lang attribute (a11y)');
  if (meta.h1Count === 0) findings.uxNotes.push('Home: no <h1> on page (SEO/a11y)');
  if (meta.h1Count > 1) findings.uxNotes.push(`Home: ${meta.h1Count} <h1> elements (should typically be 1)`);
  if (meta.imagesNoAlt.length) findings.uxNotes.push(`Home: ${meta.imagesNoAlt.length}/${meta.imagesTotal} images without alt text`);

  await shoot(page, '01-home-full');

  // Scroll through page to trigger lazy content
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const t = setInterval(() => {
        window.scrollBy(0, 600);
        y += 600;
        if (y >= document.body.scrollHeight) { clearInterval(t); res(); }
      }, 150);
    });
  }).catch(() => {});
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // ---- LINKS ----
  const homeLinks = await collectLinks(page);
  const seen = new Set();
  const internal = [];
  const external = [];
  const origin = new URL(TARGET).origin;
  for (const l of homeLinks) {
    if (!l.href || l.href.startsWith('javascript:') || l.href.startsWith('mailto:') || l.href.startsWith('tel:') || l.href.startsWith('#')) continue;
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    try {
      const u = new URL(l.href);
      if (u.origin === origin) internal.push(l); else external.push(l);
    } catch {}
  }
  log(`Found ${internal.length} internal and ${external.length} external links`);

  // Check link statuses (capped)
  const linkCheckLimit = 40;
  const toCheck = [...internal, ...external].slice(0, linkCheckLimit);
  for (const l of toCheck) {
    const r = await checkLinkStatus(context, l.href);
    const record = { ...l, status: r.status, ok: r.ok, error: r.error };
    if (l.href.startsWith(origin)) findings.internalLinksChecked.push(record);
    else findings.externalLinksChecked.push(record);
    if (!r.ok) findings.brokenLinks.push({ url: l.href, status: r.status, text: l.text, error: r.error, source: 'home' });
  }
  if ([...internal, ...external].length > linkCheckLimit) {
    findings.uxNotes.push(`Link check capped at ${linkCheckLimit}; ${[...internal, ...external].length - linkCheckLimit} links not validated`);
  }

  // ---- FORMS on home ----
  const homeForms = await describeForms(page, 'home');
  for (const f of homeForms) findings.forms.push(f);
  for (let i = 0; i < homeForms.length; i++) {
    const r = await testFormValidation(page, i, 'home');
    findings.forms[findings.forms.length - homeForms.length + i].validationTest = r;
    // Reset page to avoid cumulative state
    await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: TIMEOUT }).catch(() => {});
    await dismissOverlays(page);
  }

  // ---- BUTTONS (non-link, non-submit) ----
  const buttons = await page.$$eval('button:not([type=submit]), [role=button]:not(a)', (bs) =>
    bs.slice(0, 20).map((b, i) => ({
      idx: i,
      text: (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 60),
      ariaLabel: b.getAttribute('aria-label') || '',
      disabled: b.disabled || b.getAttribute('aria-disabled') === 'true',
    }))
  );
  for (const b of buttons.slice(0, 10)) {
    if (b.disabled || !b.text) { findings.buttonsTested.push({ ...b, result: 'skipped (disabled or empty)' }); continue; }
    try {
      const before = page.url();
      const loc = page.locator('button:not([type=submit]), [role=button]:not(a)').nth(b.idx);
      await loc.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
      // Don't click submit/payment/donate-style buttons
      if (/submit|enviar|pay|comprar|donate|donar|checkout/i.test(b.text)) {
        findings.buttonsTested.push({ ...b, result: 'skipped (potential submission)' });
        continue;
      }
      await loc.click({ timeout: 2500, trial: false }).catch(() => {});
      await page.waitForTimeout(500);
      const after = page.url();
      findings.buttonsTested.push({ ...b, result: 'clicked', urlChanged: before !== after, newUrl: after !== before ? after : undefined });
      if (after !== before) {
        await page.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: TIMEOUT }).catch(() => {});
        await dismissOverlays(page);
      } else {
        // Close any opened menu/modal by pressing Escape
        await page.keyboard.press('Escape').catch(() => {});
      }
    } catch (e) {
      findings.buttonsTested.push({ ...b, result: 'error: ' + e.message.slice(0, 120) });
    }
  }

  // ---- VISIT internal pages ----
  const visitTargets = internal.slice(0, 8);
  for (let i = 0; i < visitTargets.length; i++) {
    const target = visitTargets[i];
    const label = `page-${i + 2}-${target.text.replace(/[^a-z0-9]+/gi, '-').slice(0, 30) || 'unnamed'}`;
    try {
      const r = await page.goto(target.href, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
      const status = r ? r.status() : 0;
      findings.pagesVisited.push({ label, url: target.href, status });
      if (status >= 400) findings.brokenLinks.push({ url: target.href, status, context: 'visited page' });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await dismissOverlays(page);

      const localForms = await describeForms(page, label);
      for (const f of localForms) findings.forms.push(f);

      const pageMeta = await page.evaluate(() => ({
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        imagesNoAlt: Array.from(document.images).filter((i) => !i.alt).length,
        imagesTotal: document.images.length,
      }));
      if (pageMeta.h1Count === 0) findings.uxNotes.push(`${label}: no <h1>`);
      if (pageMeta.h1Count > 1) findings.uxNotes.push(`${label}: ${pageMeta.h1Count} <h1> elements`);
      if (pageMeta.imagesNoAlt > 0) findings.uxNotes.push(`${label}: ${pageMeta.imagesNoAlt}/${pageMeta.imagesTotal} images without alt`);

      await shoot(page, `${String(i + 2).padStart(2, '0')}-${label}`.slice(0, 60));
    } catch (e) {
      findings.navigationErrors.push({ url: target.href, error: e.message.slice(0, 200) });
    }
  }

  // ---- Mobile viewport screenshot ----
  await context.close();
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1', ignoreHTTPSErrors: true });
  const mPage = await mobileCtx.newPage();
  attachListeners(mPage, 'home-mobile');
  try {
    await mPage.goto(TARGET, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await mPage.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await dismissOverlays(mPage);
    await shoot(mPage, '99-home-mobile');
    // Heuristic: detect horizontal scroll
    const overflow = await mPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    if (overflow) findings.uxNotes.push('Mobile (390px): horizontal overflow detected on home');
  } catch (e) {
    findings.navigationErrors.push({ url: TARGET + ' (mobile)', error: e.message });
  }

  await browser.close();

  findings.endedAt = new Date().toISOString();
  await writeFile(path.join(OUT, 'findings.json'), JSON.stringify(findings, null, 2));
  log('Done. Output at', OUT);
}

run().catch((e) => { console.error('FATAL', e); process.exit(1); });
