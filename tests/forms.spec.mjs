// Forms [TH38].
//
// The browser already validates. What this suite checks is the part it
// does not do: putting the message where it will be read, gathering the
// errors, and moving focus to them.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';
// Driven in both channels [AR7]: the framework-free half attaches to a
// form a server wrote, the React half renders one. The assertions are the
// same because the contract is.
const CHANNELS = [
    {
        name: 'framework-free',
        form: '[data-test="plain-form"]',
        naam: '[data-test="plain-form-naam"]',
        mail: '[data-test="plain-form-mail"]',
        submit: '[data-test="plain-form-submit"]',
        help: 'naam-help',
    },
    {
        name: 'React',
        form: '[data-test="react-form"] form',
        naam: '[data-test="react-form"] input[name="naam"]',
        mail: '[data-test="react-form"] input[name="mail"]',
        submit: '[data-test="react-form"] button[type="submit"]',
        help: null,
    },
];

for (const channel of CHANNELS) {
    test.describe(`forms — ${channel.name}`, () => {
        test('a failed submit summarises the errors and takes focus [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();

            const summary = form.locator('[data-kp-form-summary]');
            await expect(summary).toBeVisible();
            await expect(summary).toContainText(S.formSummaryMany(2));
            // Rendered is not enough: a message above the fold is invisible to
            // someone whose focus is at the bottom of a long form, which is
            // exactly where the submit button is.
            await expect(summary).toBeFocused();
        });

        test('each summary line names its field and jumps to it [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            const link = form.locator('[data-kp-form-summary] a').first();
            await expect(link).toContainText('Naam');
            await link.click();
            await expect(page.locator(channel.naam)).toBeFocused();
        });

        test('an invalid field is announced, not only coloured [TH38, DI4]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            const field = page.locator(channel.naam);
            await expect(field).toHaveAttribute('aria-invalid', 'true');

            // The message is pointed at, and the help text it already had survives:
            // overwriting aria-describedby is how help disappears the first time
            // someone gets something wrong.
            const described = (await field.getAttribute('aria-describedby')) ?? '';
            // The React channel generates its own ids, so the help id is
            // read from the field rather than hard-coded — what is asserted
            // is that BOTH are pointed at, which is the contract.
            const helpId = channel.help ?? (await form.locator('.kp-field__help').first().getAttribute('id')) ?? '';
            expect(described).toContain(helpId);
            const errorId = described.split(/\s+/).find((id) => id !== helpId);
            expect(errorId).toBeTruthy();
            await expect(page.locator(`#${errorId}`)).toBeVisible();
        });

        test('validation reports on blur, not on every keystroke [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            const mail = page.locator(channel.mail);
            await mail.click();
            await mail.type('ke');
            // Telling someone their email is wrong while they are typing the third
            // character is technically true and practically hostile.
            await expect(mail).not.toHaveAttribute('aria-invalid', 'true');
            await mail.blur();
            await expect(mail).toHaveAttribute('aria-invalid', 'true');
        });

        test('a fixed field clears its error and its describedby [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            const naam = page.locator(channel.naam);
            await page.locator(channel.submit).click();
            await expect(naam).toHaveAttribute('aria-invalid', 'true');
            await naam.fill('Kenny');
            await naam.blur();
            await expect(naam).not.toHaveAttribute('aria-invalid', 'true');
            // The help text is still pointed at — only the error left.
            const helpId = channel.help ?? (await form.locator('.kp-field__help').first().getAttribute('id')) ?? '';
            await expect(naam).toHaveAttribute('aria-describedby', helpId);
        });

        test('the submit button says it is working [TH38]', async ({ page }) => {
            await page.goto(URL);
            // The busy state is held open until this test lets go, so the
            // assertions below measure the state rather than racing it.
            // Before this, the fixture settled after 400ms and a poll that
            // landed late could never pass -- retrying cannot recover a
            // state that is already gone. Named and proved on 2026-09-07:
            // closing the window to 0ms reproduces it exactly.
            await page.evaluate(() => {
                window.kpFormHold = true;
            });
            const form = page.locator(channel.form);
            await page.locator(channel.naam).fill('Kenny');
            await page.locator(channel.mail).fill('kenny@example.test');
            const submit = page.locator(channel.submit);
            await submit.click();
            // Without this a slow save looks like a click that missed, and the
            // second click sends the form twice.
            await expect(submit).toHaveAttribute('aria-busy', 'true');
            await expect(submit).toBeDisabled();
        });

        // KT6. The test above pinned the latch closing and never asked
        // whether it opens. JobTracker rebuilt their login on this form
        // and their suite failed at the second submit — the one after a
        // typo — with "element is not enabled".
        test('the busy state ends when the consumer says so, and a second submit lands [KT6]', async ({ page }) => {
            await page.goto(URL);
            await page.evaluate(() => {
                window.kpFormHold = true;
            });
            await page.locator(channel.naam).fill('Kenny');
            await page.locator(channel.mail).fill('kenny@example.test');
            const submit = page.locator(channel.submit);
            const idle = await submit.textContent();
            await submit.click();
            await expect(submit).toBeDisabled();
            // The fixture's handler settles the way a rendered "wrong
            // password" does: resolved, not rejected. This test now says
            // WHEN, rather than waiting 400ms and hoping a poll lands
            // inside it. Drill: with `done` never wired (React: the
            // then(done, done) removed; framework-free: the DONE_EVENT
            // listener removed) this waits out the timeout on the next
            // line.
            await page.evaluate(() => window.kpFormSettle?.());
            await expect(submit).toBeEnabled();
            await expect(submit).not.toHaveAttribute('aria-busy', 'true');
            await expect(submit).toHaveText(idle ?? '');
            // The half that matters: the person tries again and it works.
            await submit.click();
            await expect(submit).toBeDisabled();
            await page.evaluate(() => window.kpFormSettle?.());
            await expect(submit).toBeEnabled();
        });
    });
}

// Every field type, both channels [TH38, TH61].
//
// FormField rendered an `<input>` whatever it was told, so a real form
// grew a hand-written half beside it — without the label, the error and
// the describedby wiring that are the point of the component. The
// framework-free half already worked on anything the browser validates;
// what it did not know was that a radio group is one question.
const RICH = [
    {
        name: 'framework-free',
        form: '[data-test="plain-rich-form"]',
        submit: '[data-test="plain-rich-submit"]',
        land: '[data-test="plain-rich-land"]',
        toelichting: '[data-test="plain-rich-toelichting"]',
        akkoord: '[data-test="plain-rich-akkoord"]',
        group: '[data-kp-radiogroup="kanaal"]',
        radio: '[data-test="plain-rich-kanaal-mail"]',
    },
    {
        name: 'React',
        form: '[data-test="react-rich-form"] form',
        submit: '[data-test="react-rich-form"] button[type="submit"]',
        land: '[data-test="react-rich-form"] select[name="land"]',
        toelichting: '[data-test="react-rich-form"] textarea[name="toelichting"]',
        akkoord: '[data-test="react-rich-form"] input[name="akkoord"]',
        group: '[role="radiogroup"]',
        radio: '[data-test="react-rich-form"] input[name="kanaal"]',
    },
];

for (const channel of RICH) {
    test.describe(`form field types — ${channel.name}`, () => {
        test('a select, a textarea, a checkbox and a radio group all render and all validate [TH61]', async ({ page }) => {
            await page.goto(URL);
            await expect(page.locator(channel.land)).toHaveCount(1);
            await expect(page.locator(channel.toelichting)).toHaveCount(1);
            await expect(page.locator(channel.akkoord)).toHaveCount(1);
            await page.locator(channel.submit).click();
            // Drill: with the React FormField's select branch removed, this
            // goes red on the React channel with 0 selects found.
            await expect(page.locator(channel.land)).toHaveAttribute('aria-invalid', 'true');
            await expect(page.locator(channel.toelichting)).toHaveAttribute('aria-invalid', 'true');
            await expect(page.locator(channel.akkoord)).toHaveAttribute('aria-invalid', 'true');
        });

        test('the summary counts a radio group once, not once per button [TH61]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            const summary = form.locator('[data-kp-form-summary]');
            // Four questions, five controls: two radios are one question.
            // Drill: with the deduplication removed this reads five.
            await expect(summary).toContainText(S.formSummaryMany(4));
            await expect(summary.locator('a')).toHaveCount(4);
        });

        test('the summary names the radio group by its legend, not by an option [TH61]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            const links = form.locator('[data-kp-form-summary] a');
            // "Hoe bereiken we je?" is the question; "E-mail" is one answer
            // to it, and naming the answer tells nobody what is missing.
            await expect(links.last()).toContainText('Hoe bereiken we je?');
        });

        test('the group carries the invalid state, not one of its buttons [TH61]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            // aria-invalid on a single radio says the wrong thing about the
            // other one. Drill: with stateHolder() returning the field
            // itself, the framework-free channel fails here.
            await expect(form.locator(channel.group)).toHaveAttribute('aria-invalid', 'true');
            await expect(page.locator(channel.radio).first()).not.toHaveAttribute('aria-invalid', 'true');
        });
    });
}

// TH62: the consumer's own link component.
test('NavBar renders its links through the component a consumer hands in [TH62]', async ({ page }) => {
    await page.goto(URL);
    const nav = page.locator('[data-test="react-router-nav"]');
    // Drill: with `linkComponent: Link = 'a'` ignored and a literal <a>
    // rendered again, this goes red — no element carries data-routed.
    await expect(nav.locator('a[data-routed]')).toHaveCount(1);
    await expect(nav.locator('a[data-routed]')).toHaveText('Gerouteerd');
    // The class and the current marker still land on it: handing over the
    // rendering may not hand over the styling.
    await expect(nav.locator('a[data-routed]')).toHaveClass(/kp-nav__link/);
    // The skip link is deliberately NOT routed: it is a same-page anchor,
    // and sending it through a router turns the one link a keyboard user
    // needs into a navigation.
    await expect(nav.locator('a.kp-skip-link[data-routed]')).toHaveCount(0);
});

// ── gap-11, the field faults of catalogue batch 2 [2026-09-13] ────────────

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));
const FIELD_PAGE = '/catalogue/field.html';

/**
 * What a control paints for its boundary and its ground, normalised so an
 * absent value reads the same however the browser spells it: `none`, a
 * zero width, an identity matrix, a transparent colour.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
const surface = (page, selector) =>
    page.locator(selector).evaluate((el) => {
        const s = getComputedStyle(el);
        /** @param {string} v */
        const zero = (v) => v === 'none' || v === '0px' || v === 'matrix(1, 0, 0, 1, 0, 0)' || v === 'rgba(0, 0, 0, 0)' || v === 'transparent';
        /** @param {string[]} values */
        const part = (...values) => (values.some(zero) ? 'none' : values.join(' '));
        return {
            border: ['top', 'right', 'bottom', 'left']
                .map((side) =>
                    part(
                        s.getPropertyValue(`border-${side}-style`),
                        s.getPropertyValue(`border-${side}-width`),
                        s.getPropertyValue(`border-${side}-color`),
                    ),
                )
                .join(', '),
            shadow: zero(s.boxShadow) ? 'none' : s.boxShadow,
            outline: part(s.outlineStyle, s.outlineWidth, s.outlineColor),
            ground: [zero(s.backgroundColor) ? 'none' : s.backgroundColor, zero(s.backgroundImage) ? 'none' : s.backgroundImage].join(' '),
            ink: `${s.color} ${s.opacity}`,
            transform: zero(s.transform) ? 'none' : s.transform,
        };
    });

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

test('an invalid input differs visibly from a valid one, in every theme [gap-11]', async ({ page }) => {
    // gap-11: formal, high-contrast, blueprint, solstice and lapis set the field border in kp.register, which beat .kp-field--invalid in kp.components.
    // Reduced motion, so a theme's transition cannot be read half-way between two themes.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FIELD_PAGE);
    const same = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const invalid = await surface(page, '#f-bad-email');
        const valid = await surface(page, '#f-good-email');
        const boundary = (/** @type {Record<string, string>} */ paint) => [paint.border, paint.shadow, paint.outline, paint.ground].join(' / ');
        if (boundary(invalid) === boundary(valid)) same.push(theme);
    }
    expect(same, 'themes whose invalid input paints like the valid one').toEqual([]);
});

test('the valid field keeps the look of a plain field in every theme [gap-11]', async ({ page }) => {
    // gap-11: the repair lives in the invalid state only — the valid field must still paint what a plain field paints.
    // Reduced motion, so a theme's transition cannot be read half-way between two themes.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FIELD_PAGE);
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        expect(await surface(page, '#f-good-email'), theme).toEqual(await surface(page, '#f-email'));
    }
});

test('an invalid radio group carries one mark on the group, not a frame per radio [gap-11]', async ({ page }) => {
    // gap-11: .kp-field--invalid .kp-field__check outlined every radio inside the group, a square frame around each round control.
    // Reduced motion, so a theme's transition cannot be read half-way between two themes.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FIELD_PAGE);
    const unmarked = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const radios = await page
            .locator('#invalid input[name="bad-shift"]')
            .evaluateAll((els) => els.map((el) => getComputedStyle(el).outlineStyle));
        expect(radios, `${theme}: a radio in the invalid group is framed on its own`).toEqual(['none', 'none']);
        const group = await surface(page, '#invalid .kp-fieldset[aria-invalid="true"]');
        const plain = await surface(page, '#choices .kp-fieldset:not([data-kp-layout])');
        if (JSON.stringify(group) === JSON.stringify(plain)) unmarked.push(theme);
    }
    expect(unmarked, 'themes whose invalid group paints like a valid one').toEqual([]);
    // The checkbox, a control on its own, keeps its outline.
    await wear(page, 'formal');
    await expect.poll(() => page.locator('#f-bad-ack').evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
});

test('disabled, read-only and editable inputs look different from each other, in every theme [gap-11]', async ({ page }) => {
    // gap-11: a disabled, a read-only and an editable .kp-field__input painted identically, so a reviewer typed into the read-only one.
    // Reduced motion, so a theme's transition cannot be read half-way between two themes.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FIELD_PAGE);
    const alike = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const disabled = JSON.stringify(await surface(page, '#f-dis'));
        const readOnly = JSON.stringify(await surface(page, '#f-ro'));
        const editable = JSON.stringify(await surface(page, '#f-site'));
        if (disabled === readOnly) alike.push(`${theme}: disabled = read-only`);
        if (readOnly === editable) alike.push(`${theme}: read-only = editable`);
        if (disabled === editable) alike.push(`${theme}: disabled = editable`);
    }
    expect(alike).toEqual([]);
});

test('data-kp-layout="inline" lays a fieldset\'s options in a row [gap-11]', async ({ page }) => {
    // gap-11: the inline rule set flex-direction on a fieldset that was never a flex container, so the options stayed in a column.
    // Reduced motion, so a theme's transition cannot be read half-way between two themes.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(FIELD_PAGE);
    const boxes = await page.locator('#choices .kp-fieldset[data-kp-layout="inline"] .kp-field__option').evaluateAll((els) =>
        els.map((el) => {
            const r = el.getBoundingClientRect();
            return { top: Math.round(r.top), left: Math.round(r.left) };
        }),
    );
    expect(boxes).toHaveLength(3);
    expect(new Set(boxes.map((b) => b.top)).size, JSON.stringify(boxes)).toBe(1);
    expect(boxes[1].left).toBeGreaterThan(boxes[0].left);
    expect(boxes[2].left).toBeGreaterThan(boxes[1].left);
});

test('the switch page shows the package switch, and it flips with Space [gap-11]', async ({ page }) => {
    // gap-11: there was no switch at all, so a toggle had to be a checkbox; the concept page Kenny approved now shows the package's .kp-switch.
    // The behaviour in both channels and every theme is tests/switch.spec.mjs; this holds the catalogue page on the package class.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/switch.html');
    const control = page.locator('#states .kp-switch__input').first();
    await expect(control).toHaveAttribute('role', 'switch');
    const paint = () =>
        control.evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el, '::before').insetInlineStart].join(' | '));
    const off = await paint();
    await control.focus();
    await page.keyboard.press('Space');
    await expect(control).toBeChecked();
    await expect.poll(paint).not.toBe(off);
    // Enter does not flip it: that is a checkbox's behaviour, and the reason the switch is one.
    await page.keyboard.press('Enter');
    await expect(control).toBeChecked();
    await expect(page.locator('#states .kp-switch__input[disabled]')).toHaveCount(2);
    // No page-scoped concept styles are left: the paint comes from the package.
    await expect(page.locator('.cat-switch-concept, .cat-switch-concept__input')).toHaveCount(0);
});
