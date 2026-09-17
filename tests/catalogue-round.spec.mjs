// "Am I through?" — the page that answers a round's only real question [fix-48].
//
// Kenny, 2026-09-16, having said it twice: "Er MOET een pagina komen die toont
// dat ik klaar ben als ik alles beoordeeld heb." Red first, by construction:
// before this change catalogue/round.html did not exist and both tests failed
// at the first assertion.
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';

test.describe.configure({ timeout: 120_000 });

/**
 * The engines the register in the repository holds a verdict in [fix-51].
 *
 * A verdict is given per engine as well as per block and theme (Kenny,
 * 2026-09-13: "er moet ook een verschil zijn tussen firedragon en chrome
 * approved, dat zijn afzonderlijke testen"), and the round page counts in the
 * engine it runs in. Kenny judges in FireDragon, so the register holds Gecko's
 * verdicts and nothing else; asking Chromium whether the round is over is
 * asking about a round nobody has walked there, and it answered "3062 block
 * pair(s) still waiting" — correctly. Read from the file rather than written
 * down here, so the day a second engine is judged the test follows.
 */
const ENGINES_IN_REGISTER = new Set(
    Object.values(
        /** @type {Record<string, Record<string, Record<string, unknown>>>} */ (
            JSON.parse(readFileSync(new URL('../catalogue/verdicts.json', import.meta.url), 'utf8')).verdicts
        ),
    ).flatMap((themes) => Object.values(themes).flatMap((engines) => Object.keys(engines))),
);

const status = (page) => page.locator('[data-cat-round-status]');
const banner = (page) => page.locator('[data-cat-round-banner]');

test.describe('the round page [fix-48]', { tag: ['@component:catalogue'] }, () => {
    test('with nothing judged it says what is left, per theme', async ({ page, context }) => {
        await useEmptyRegister(context);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/round.html');
        await expect(status(page)).toContainText(/0 of \d+ block\/theme pair\(s\) carry a verdict/, { timeout: 60_000 });
        await expect(banner(page)).toContainText('Not yet through');
        const rows = page.locator('[data-cat-round-rows] tr');
        await expect(rows).toHaveCount(22);
        await expect(rows.first()).toContainText('Formal');
        await expect(rows.first()).toContainText('open the first one');
    });

    test('with the register as the repository holds it, it says the round is over', async ({ page, browserName }) => {
        test.skip(
            !ENGINES_IN_REGISTER.has(browserName),
            `the register holds no verdict in ${browserName}; the round was judged in ${[...ENGINES_IN_REGISTER].join(', ')}`,
        );
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/round.html');
        await expect(status(page)).toContainText(/of \d+ block\/theme pair\(s\) carry a verdict/, { timeout: 60_000 });
        await expect(banner(page)).toContainText('You are through');
        await expect(page.locator('[data-cat-round-rows] .kp-badge--success').first()).toHaveText('done');
    });
});
