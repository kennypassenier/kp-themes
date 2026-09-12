// Numbers that count up [feat-count-1, Kenny 2026-09-12].
//
// The frozen bar is one sentence: "at the reduced-motion setting the
// final number is there immediately, measured on what is painted". That
// is the first test below, and it is the one this feature exists to
// satisfy — the rest guard the promise that makes it safe, which is that
// the AUTHORED text is the oracle. The module never invents a number and
// never formats one of its own: it reads what the page already says,
// counts to it, and puts the same string back. A page that never attaches
// the module shows the final number too, because the final number is what
// is written in the HTML.
//
// Drilled 2026-09-12 in firefox; the record is beside each test.
import { expect, test } from '@playwright/test';

const PAGE = '/tests/fixtures/count.html';

/** @param {import('@playwright/test').Page} page */
const settled = async (page) => {
    await page.waitForSelector('[data-attached]');
    await page.waitForFunction(
        () => [...document.querySelectorAll('[data-kp-count]')].every((el) => el.getAttribute('data-kp-count-state') === 'done'),
        null,
        {
            timeout: 8000,
        },
    );
};

/** @param {import('@playwright/test').Page} page */
const texts = (page) =>
    page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-kp-count]')].map((el) => [el.id, el.textContent ?? ''])));

// The frozen bar. Drill: the `reduced()` branch removed from countUp() in
// js/effects.js -> red, the numbers caught mid-count. Restored: green.
test('at the reduced-motion setting the number is simply there [feat-count-1]', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(PAGE);
    await page.waitForSelector('[data-attached]');

    // The recorder in the fixture was armed before the module existed
    // [fix-1]. Reading the text afterwards proves nothing at all here —
    // the final number is what the HTML says, so it reads correct both
    // when nothing counted and when the count has already finished. What
    // the setting forbids is the number ever having been anything else.
    await page.waitForTimeout(1200);
    const changes = await page.evaluate(() => window.__changes);
    expect(changes, `the number counted anyway:\n${JSON.stringify(changes)}`).toEqual([]);

    const seen = await texts(page);
    expect(seen.plain, 'the plain number is final on the first paint').toBe('1204');
    expect(seen.slow, 'and so is the long one, separators and all').toBe('1.118.204,75');
    expect(seen.from, 'a number with a starting point does not start from it').toBe('640');

    const states = await page.evaluate(() => [...document.querySelectorAll('[data-kp-count]')].map((el) => el.getAttribute('data-kp-count-state')));
    expect(new Set(states), 'nothing is left running').toEqual(new Set(['done']));
});

// Drill: `render(target)` in rest() replaced with `render(from)` -> red on
// every number. Restored: green.
test('every number ends on exactly what the page authored [feat-count-1]', async ({ page }) => {
    await page.goto(PAGE);
    await settled(page);
    expect(await texts(page)).toEqual({
        plain: '1204',
        slow: '1.118.204,75',
        instant: '98%',
        from: '640',
        currency: '€ 1.204',
        english: '1,204.50',
        noNumber: 'no number here',
    });
});

// Drill: the `Intl.NumberFormat` lookup replaced with a fixed `.`/`,`
// pair -> red on the Dutch numbers, which then count through English
// separators. Restored: green.
test('the page says which separator is which, not the module [feat-count-1]', async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForSelector('[data-attached]');

    // `1.204` is one thousand two hundred and four in Dutch and
    // one-point-two-oh-four in English, and no amount of looking at the
    // string decides which. Mid-count is where the difference shows: a
    // number counting to 1204 passes through the hundreds, one counting
    // to 1.204 never leaves nought.
    await page.waitForFunction(() => (document.getElementById('currency')?.textContent ?? '') !== '€ 1.204');
    const mid = await page.locator('#currency').textContent();
    const value = Number((mid ?? '').replace(/[^\d]/g, ''));
    expect(value, `the Dutch thousand separator was read as a decimal point: ${mid}`).toBeGreaterThan(1);

    // And the English one keeps its own shape while it counts.
    const english = await page.locator('#english').textContent();
    expect(english, 'an English number counts in English').toMatch(/^[\d,]+\.\d{2}$/);
});

// Drill: the `asked === ''` guard replaced with `|| 900` -> red on
// `instant`, which then counts for 900ms. Restored: green.
test('a theme that asks for no counting gets none [feat-count-1, KT6]', async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForSelector('[data-attached]');
    // `--kp-count: 0` is a choice, not an absent value. Read at once.
    expect(await page.locator('#instant').textContent(), 'zero means zero').toBe('98%');
    expect(await page.locator('#instant').getAttribute('data-kp-count-state')).toBe('done');
});

// Drill: the `cleanups.push` in countUp() removed -> red, the number left
// wherever the count had reached. Restored: green.
test('detaching leaves the real number, not the one it had reached [feat-count-1, KT6]', async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForSelector('[data-attached]');
    // Mid-count, deliberately: the point is that letting go does not
    // freeze a half-counted number on the page.
    await page.waitForFunction(() => document.getElementById('slow')?.getAttribute('data-kp-count-state') === 'running');
    await page.evaluate(() => window.__handle?.detach?.());
    expect(await page.locator('#slow').textContent(), 'the number a reader is left with is the true one').toBe('1.118.204,75');
    expect(await page.locator('#slow').getAttribute('data-kp-count-state')).toBe('done');
});

// Drill: the `started.has(el)` guard removed from the count branch of
// scan() -> red, the number restarting from nought. Restored: green.
test('attaching a second time does not send the number back to nought [feat-count-1]', async ({ page }) => {
    await page.goto(PAGE);
    await settled(page);
    await page.evaluate(async () => {
        const { attachEffects } = await import('/js/effects.js');
        attachEffects();
    });
    await page.waitForTimeout(120);
    expect(await page.locator('#plain').textContent(), 'js/auto.js attaches over React; a counted number stays counted').toBe('1204');
});

// Drill: the `el.dispatchEvent` in rest() removed -> red. Restored: green.
test('a consumer is told when a number has landed [feat-count-1, KT6]', async ({ page }) => {
    await page.goto(PAGE);
    const landed = await page.evaluate(
        () =>
            new Promise((resolve) => {
                const seen = [];
                document.addEventListener('kp-count', (event) => {
                    seen.push({ id: /** @type {Element} */ (event.target).id, value: /** @type {CustomEvent} */ (event).detail.value });
                    if (seen.length >= 3) resolve(seen);
                });
                setTimeout(() => resolve(seen), 6000);
            }),
    );
    expect(Array.isArray(landed) && landed.length, 'the event carries the value it landed on').toBeGreaterThan(0);
    expect(landed.every((/** @type {{ value: number }} */ entry) => Number.isFinite(entry.value))).toBe(true);
});
