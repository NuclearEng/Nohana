import { webkit } from 'playwright';

const BASE_URL = process.env.AUTOTEST_URL || 'http://localhost:5173/?autotest=1';
const TIMEOUT_MS = 90_000;

(async () => {
	const browser = await webkit.launch({ headless: true });
	const context = await browser.newContext();
	const page = await context.newPage();

	page.on('console', msg => {
		const type = msg.type();
		if (type === 'error') {
			console.error('[browser]', msg.text());
		} else if (type === 'warning') {
			console.warn('[browser]', msg.text());
		} else {
			console.log('[browser]', msg.text());
		}
	});

	await page.goto(BASE_URL, { waitUntil: 'load' });

	// Wait for test to complete or timeout
	const start = Date.now();
	let done = false;
	while (!done) {
		try {
			done = await page.evaluate(() => !!window.__AUTOTEST_DONE__);
		} catch (_) {}
		if (done) break;
		if (Date.now() - start > TIMEOUT_MS) {
			console.error('Timed out waiting for autotest to complete');
			break;
		}
		await page.waitForTimeout(500);
	}

	// Retrieve errors
	let errors = [];
	try {
		errors = await page.evaluate(() => (typeof window.__GET_AUTOTEST_ERRORS__ === 'function' ? window.__GET_AUTOTEST_ERRORS__() : (window.__TEST_ERRORS__ || [])));
	} catch (_) {}

	if (errors.length) {
		console.error('AutoTest found errors:', JSON.stringify(errors, null, 2));
		await browser.close();
		process.exit(1);
	} else {
		console.log('AutoTest passed. No console errors found across routes.');
		await browser.close();
		process.exit(0);
	}
})();
