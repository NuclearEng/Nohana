(function(){
	'use strict';

	// Basic error capture
	window.__TEST_ERRORS__ = [];
	(function setupErrorCapture(){
		const origError = console.error;
		console.error = function(){
			try {
				window.__TEST_ERRORS__.push({
					when: new Date().toISOString(),
					route: window.location.hash || '/',
					message: Array.from(arguments).map(String).join(' ')
				});
			} catch (_) {}
			origError.apply(console, arguments);
		};
		window.addEventListener('error', function(e){
			window.__TEST_ERRORS__.push({ when: new Date().toISOString(), route: window.location.hash || '/', message: String(e.message || e.error) });
		});
		window.addEventListener('unhandledrejection', function(e){
			window.__TEST_ERRORS__.push({ when: new Date().toISOString(), route: window.location.hash || '/', message: 'Promise rejection: ' + String(e.reason) });
		});
		// Prevent destructive dialogs during test
		window.confirm = function(){ return false; };
	})();

	function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

	function collectRouteLinks(){
		const links = new Set();
		// header/user menu
		document.querySelectorAll('[data-route]').forEach(a => { const r = a.getAttribute('data-route'); if (r) links.add(r); });
		return Array.from(links);
	}

	function collectClickablesWithinMain(){
		const root = document.getElementById('main-content') || document.body;
		const selectors = [
			'button', '.btn', '.btn-primary', '.btn-secondary', '.favorite',
			'.filter-button', '.apply-filters', '.clear-filters', '.show-list',
			'.zoom-in', '.zoom-out', '.auth-tab', '.close-modal', '.seat-increment', '.seat-decrement', '.time-option', '.time-slot'
		];
		const elements = new Set();
		selectors.forEach(sel => root.querySelectorAll(sel).forEach(el => elements.add(el)));
		// Exclude destructive actions by text
		return Array.from(elements).filter(el => {
			const txt = (el.textContent || '').toLowerCase();
			return !(txt.includes('delete') || txt.includes('cancel booking'));
		});
	}

	async function clickSafely(el){
		try {
			el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
			await wait(50);
		} catch (e) {
			console.error('AutoTest click error', e);
		}
	}

	function addReport(){
		const existing = document.getElementById('autotest-report');
		if (existing) existing.remove();
		const box = document.createElement('div');
		box.id = 'autotest-report';
		box.style.position = 'fixed';
		box.style.bottom = '10px';
		box.style.right = '10px';
		box.style.maxWidth = '420px';
		box.style.maxHeight = '40vh';
		box.style.overflow = 'auto';
		box.style.background = 'rgba(0,0,0,0.8)';
		box.style.color = '#fff';
		box.style.padding = '12px';
		box.style.borderRadius = '8px';
		box.style.zIndex = '99999';
		const errs = window.__TEST_ERRORS__;
		box.innerHTML = `<div style="font-weight:600;margin-bottom:8px;">Auto UI Test Report</div>
			<div>Total errors: ${errs.length}</div>
			<div style="margin-top:8px;">${errs.slice(-10).map(e => `<div style='margin:4px 0;border-bottom:1px solid #444;padding-bottom:4px;'><div style='font-size:12px;color:#bbb;'>${e.when} — ${e.route}</div><div>${e.message}</div></div>`).join('')}</div>`;
		document.body.appendChild(box);
	}

	async function runAutoUITest(){
		const baseRoutes = [
			'/', '/search', '/listing/listing-1', '/booking/listing-1', '/booking-details/booking-1', '/booking-confirmation/booking-1',
			'/favorites', '/bookings', '/account', '/host', '/become-host', '/messages'
		];
		const discovered = collectRouteLinks();
		const queue = Array.from(new Set([...baseRoutes, ...discovered]));

		for (const route of queue){
			try {
				if (window.waveRouter) {
					window.waveRouter.navigate(route);
				} else {
					window.location.hash = '#'+route;
				}
				await wait(800);

				// Click within page
				const els = collectClickablesWithinMain();
				for (const el of els){
					await clickSafely(el);
					await wait(30);
				}

				// Update on-screen report after each route
				addReport();
			} catch (e) {
				console.error('AutoTest route error', route, e);
			}
		}

		console.log('Auto UI Test complete. Errors found:', window.__TEST_ERRORS__);
		window.__AUTOTEST_DONE__ = true;
		try { window.__GET_AUTOTEST_ERRORS__ = () => window.__TEST_ERRORS__; } catch(_) {}
		addReport();
	}

	function shouldRun(){
		const href = window.location.href;
		return href.includes('autotest=1');
	}

	// Expose and optionally run
	window.runAutoUITest = runAutoUITest;
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function(){ if (shouldRun()) setTimeout(runAutoUITest, 300); });
	} else {
		if (shouldRun()) setTimeout(runAutoUITest, 300);
	}
})();
