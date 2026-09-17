// The compact form is tighter in every theme [TH105, Kenny 2026-09-14].
//
// The block `#density-compact-form` on catalogue/page-effects.html holds
// the same form twice, the right copy under `data-density="compact"`, and
// promises that in every theme the compact one is visibly tighter. Kenny's
// look found it tighter in four themes only. The cause was the registers:
// eighteen of them restated the form's gaps as fixed lengths (`gap: 1rem`,
// `gap: 0.3rem`) where the component reads them off the spacing scale, so
// the density mode, which retunes the scale, had nothing left to reach.
//
// The bar, per theme, read from what the browser laid out [KT13]:
//   - the gap between two fields is at least 20% smaller under compact;
//   - the gap between a label and its input is at least 20% smaller;
//   - the input and the button are each at least 10% lower, and both stay
//     at or above the 24px pointer target WCAG 2.5.8 asks for.
//
// Drill [KT3]: on the code before the repair this test listed all
// twenty-two themes — eighteen on both gaps, high-contrast on its label
// gap, and all but dark on the input or the button, whose block padding
// (a literal in components.css or the register) held the height up. Putting `gap: 1rem` back into one register's
// `.kp-form` lists that theme again.

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

/** The smallest share a compact gap may keep of its default: 20% tighter at least. */
const MAX_RATIO = 0.8;

/** The largest share a compact control may keep of its default height: 10% lower at least. */
const MAX_HEIGHT_RATIO = 0.9;

/** The WCAG 2.5.8 pointer target, in CSS pixels. */
const TARGET_FLOOR = 24;

/**
 * The spacing the block's two forms lay out, measured in the page.
 * Runs in the page; returns the default copy and the compact copy.
 */
const measure = () => {
    const block = document.querySelector('#density-compact-form');
    const read = (/** @type {Element} */ form) => {
        const fields = form.querySelectorAll('.kp-field');
        const label = fields[0].querySelector('.kp-field__label').getBoundingClientRect();
        const input = fields[0].querySelector('.kp-field__input');
        const inputBox = input.getBoundingClientRect();
        return {
            fieldGap: fields[1].getBoundingClientRect().top - fields[0].getBoundingClientRect().bottom,
            labelGap: inputBox.top - label.bottom,
            inputPadding: Number.parseFloat(getComputedStyle(input).paddingTop),
            inputHeight: inputBox.height,
            buttonHeight: form.querySelector('.kp-button').getBoundingClientRect().height,
        };
    };
    return {
        roomy: read(block.querySelector('.cat-pair > div:not([data-density]) .kp-form')),
        compact: read(block.querySelector('[data-density="compact"] .kp-form')),
    };
};

test.beforeEach(async ({ page, context }) => {
    await useEmptyRegister(context);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/catalogue/page-effects.html#density-compact-form');
    await waitForJudging(page);
});

test('the compact form is tighter than the default one in every theme [TH105]', { tag: ['@sweep', '@component:field'] }, async ({ page }) => {
    await expect
        .poll(
            async () => {
                /** @type {string[]} */
                const faults = [];
                /** @type {string[]} */
                const rows = [];
                for (const theme of THEMES) {
                    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
                    const { roomy, compact } = await page.evaluate(measure);
                    const px = (/** @type {number} */ n) => `${n.toFixed(1)}px`;
                    rows.push(
                        `${theme}: field gap ${px(roomy.fieldGap)} -> ${px(compact.fieldGap)}, label gap ${px(roomy.labelGap)} -> ${px(compact.labelGap)}, ` +
                            `input padding ${px(roomy.inputPadding)} -> ${px(compact.inputPadding)}, input ${px(roomy.inputHeight)} -> ${px(compact.inputHeight)}, ` +
                            `button ${px(roomy.buttonHeight)} -> ${px(compact.buttonHeight)}`,
                    );
                    const why = [];
                    if (compact.fieldGap > roomy.fieldGap * MAX_RATIO) why.push(`field gap ${px(roomy.fieldGap)} -> ${px(compact.fieldGap)}`);
                    if (compact.labelGap > roomy.labelGap * MAX_RATIO) why.push(`label gap ${px(roomy.labelGap)} -> ${px(compact.labelGap)}`);
                    if (compact.inputHeight > roomy.inputHeight * MAX_HEIGHT_RATIO)
                        why.push(`input ${px(roomy.inputHeight)} -> ${px(compact.inputHeight)}`);
                    if (compact.buttonHeight > roomy.buttonHeight * MAX_HEIGHT_RATIO)
                        why.push(`button ${px(roomy.buttonHeight)} -> ${px(compact.buttonHeight)}`);
                    if (compact.inputHeight < TARGET_FLOOR) why.push(`input under ${TARGET_FLOOR}px (${px(compact.inputHeight)})`);
                    if (compact.buttonHeight < TARGET_FLOOR) why.push(`button under ${TARGET_FLOOR}px (${px(compact.buttonHeight)})`);
                    if (why.length) faults.push(`${theme}: ${why.join('; ')}`);
                }
                if (process.env.KP_DENSITY_REPORT) console.log(rows.join('\n'));
                return faults;
            },
            { timeout: 15000 },
        )
        .toEqual([]);
});
