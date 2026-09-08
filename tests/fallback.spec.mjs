// An unknown theme name says so, once, along each of the four paths
// [TH97, AR25, S29].
//
// The fault, live: almanac.kp-soft.dev vendored a css/themes.css that
// knows twenty-four themes beside a js/ that knows eleven. Every new name
// fell back to `formal` without a word, so the page looked like a broken
// picker rather than like two files out of step.
//
// AR25 corrected the draft on where to warn. TH97 as written put the
// warning in `applyTheme`, and `applyTheme` never sees an unknown name:
// `asTheme()` returns null inside `storedTheme` and `currentTheme`, which
// then apply `?? DEFAULT_THEME`, so the name is gone before applyTheme is
// called. Verified in js/theme-core.js before this was written. Hence one
// test per site, four of them, each proving the source it came from.
//
// Nothing here is a style assertion, so no KT3 drill applies: these
// measure JavaScript behaviour, not a rule the package applies. The KT3
// drills for this milestone are in tests/diagnostics.spec.mjs, which does
// read a declaration off the stylesheet.

import { test, expect } from '@playwright/test';

const PAGE = '/tests/fixtures/fallback.html';
const UNKNOWN = 'lavender';

/**
 * Collect the console warnings and the unknown-theme events of one page
 * load. Re-installed on every navigation, which is what lets the
 * once-per-session test read a reload's own tally rather than a running
 * total.
 *
 * @param {import('@playwright/test').Page} page
 */
async function watch(page) {
    await page.addInitScript(() => {
        /** @type {string[]} */
        window.__warnings = [];
        const warn = console.warn.bind(console);
        console.warn = (...args) => {
            window.__warnings.push(args.join(' '));
            warn(...args);
        };
        /** @type {unknown[]} */
        window.__unknown = [];
        document.addEventListener('kp-theme-unknown', (e) => window.__unknown.push(e.detail));
    });
}

test('site 1 of 4: a stored name this build does not know [TH97, AR25]', async ({ page }) => {
    await watch(page);
    await page.goto(PAGE);
    const result = await page.evaluate(async (unknown) => {
        localStorage.setItem('theme', unknown);
        const core = await import('/js/theme-core.js');
        // Three reads of the same bad value, and one initializeTheme on
        // top of it: the count below is what "once" means.
        const first = core.storedTheme();
        const second = core.storedTheme();
        const applied = core.initializeTheme();
        return {
            first,
            second,
            applied,
            stillStored: localStorage.getItem('theme'),
            warnings: window.__warnings,
            events: window.__unknown,
        };
    }, UNKNOWN);

    expect(result.first).toBeNull();
    expect(result.second).toBeNull();
    expect(result.applied).toBe('formal');
    // AR25: the fallback is never persisted. The preference is right
    // again the day this page gets a newer js/.
    expect(result.stillStored).toBe(UNKNOWN);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain(UNKNOWN);
    expect(result.warnings[0]).toContain('formal');
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ requested: UNKNOWN, applied: 'formal', source: 'stored' });
});

test('site 2 of 4: a name the server wrote into the markup [TH97, AR25]', async ({ page }) => {
    await watch(page);
    await page.goto(PAGE);
    const result = await page.evaluate(async (unknown) => {
        document.documentElement.setAttribute('data-theme', unknown);
        const core = await import('/js/theme-core.js');
        const read = core.currentTheme();
        core.currentTheme();
        return { read, warnings: window.__warnings, events: window.__unknown };
    }, UNKNOWN);

    expect(result.read).toBe('formal');
    expect(result.warnings).toHaveLength(1);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ requested: UNKNOWN, applied: 'formal', source: 'current' });
});

test('site 3 of 4: applyTheme called with a name that is not one [TH97, AR25]', async ({ page }) => {
    await watch(page);
    await page.goto(PAGE);
    const result = await page.evaluate(async (unknown) => {
        const core = await import('/js/theme-core.js');
        const applied = core.applyTheme(unknown);
        return { applied, worn: document.documentElement.getAttribute('data-theme'), warnings: window.__warnings, events: window.__unknown };
    }, UNKNOWN);

    expect(result.applied).toBe('formal');
    expect(result.worn).toBe('formal');
    expect(result.warnings).toHaveLength(1);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ requested: UNKNOWN, applied: 'formal', source: 'apply' });
});

test('site 4 of 4: another tab, running a newer deployment, stores a name this one lacks [TH97, AR25]', async ({ page }) => {
    await watch(page);
    await page.goto(PAGE);
    const result = await page.evaluate(async (unknown) => {
        const core = await import('/js/theme-core.js');
        // A known theme first, so `currentTheme()` inside the handler has
        // nothing of its own to report and the source below is the one
        // under test.
        core.applyTheme('dark');
        core.onThemeChange(() => {});
        window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: unknown, oldValue: 'dark' }));
        return { worn: document.documentElement.getAttribute('data-theme'), warnings: window.__warnings, events: window.__unknown };
    }, UNKNOWN);

    // Nothing was applied: this tab keeps what it is wearing and says so.
    expect(result.worn).toBe('dark');
    expect(result.warnings).toHaveLength(1);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({ requested: UNKNOWN, applied: 'dark', source: 'cross-tab' });
});

test('once per session, and a session outlives a page load [TH97, AR25]', async ({ page }) => {
    await watch(page);
    await page.goto(PAGE);
    const first = await page.evaluate(async (unknown) => {
        localStorage.setItem('theme', unknown);
        const core = await import('/js/theme-core.js');
        core.storedTheme();
        return { warnings: window.__warnings.length, remembered: sessionStorage.getItem('kp-themes-unknown-reported') };
    }, UNKNOWN);
    expect(first.warnings).toBe(1);
    expect(first.remembered).toBe(UNKNOWN);

    // The reason this is sessionStorage and not a module-level flag: in a
    // server-rendered dashboard every click is a page load, so a module
    // flag is a fresh flag and the warning fires on every click. The
    // reload below is that click.
    //
    // Drilled 2026-09-06: with the sessionStorage read removed from
    // `alreadyReported` in js/theme-core.js — the write left in place, so
    // the assertion above still passes and only the reload is affected —
    // this line reads one warning where it expects none, and the array it
    // prints is the message a consumer would get on every click.
    await page.reload();
    const second = await page.evaluate(async () => {
        const core = await import('/js/theme-core.js');
        core.storedTheme();
        core.currentTheme();
        return { warnings: window.__warnings, events: window.__unknown };
    });
    expect(second.warnings).toHaveLength(0);
    expect(second.events).toHaveLength(0);

    // A DIFFERENT unknown name is a different fault and still gets its
    // word: the flag remembers names, not that it once spoke.
    const third = await page.evaluate(async () => {
        const core = await import('/js/theme-core.js');
        core.applyTheme('vermilion');
        return { warnings: window.__warnings, remembered: sessionStorage.getItem('kp-themes-unknown-reported') };
    });
    expect(third.warnings).toHaveLength(1);
    expect(third.remembered).toBe(`${UNKNOWN} vermilion`);
});

test('a name that is a theme, and no name at all, say nothing [TH97]', async ({ page }) => {
    await watch(page);
    await page.goto(PAGE);
    const result = await page.evaluate(async () => {
        const core = await import('/js/theme-core.js');
        // An empty attribute is what a server writes when it has no
        // preference to write; it is not a fault.
        document.documentElement.setAttribute('data-theme', '');
        core.currentTheme();
        core.applyTheme('woodblock');
        core.storedTheme();
        return { warnings: window.__warnings, events: window.__unknown, worn: document.documentElement.getAttribute('data-theme') };
    });
    expect(result.warnings).toHaveLength(0);
    expect(result.events).toHaveLength(0);
    expect(result.worn).toBe('woodblock');
});
