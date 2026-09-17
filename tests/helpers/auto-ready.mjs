// Wait for js/auto.js to have attached what the page needed [scope-115].
//
// Since the split, the entry fetches a module only when the page carries its
// markup, so `attachAll()` finishes after load rather than before it. A test
// that acts in the same moment as `page.goto` returns — a key pressed, a shape
// read — now waits for `<html data-kp-auto-ready>`, which the entry sets once
// every needed module has attached. Measured 2026-09-17: without it, Ctrl+K on
// tests/fixtures/components.html opened no palette in Chromium, and the wizard
// example's static half read one class short once in eight runs.

/** @param {import('@playwright/test').Page} page */
export const autoReady = (page) => page.waitForSelector('html[data-kp-auto-ready]', { state: 'attached' });
