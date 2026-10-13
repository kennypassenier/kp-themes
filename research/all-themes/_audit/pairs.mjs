// @ts-nocheck: scratch audit tooling
// The pair list of gates/measure-pairs.pairs.mjs (untouched) plus the pairs the meter lacks.
// `page` runs a pair on a catalogue page instead of the round-4 demo.
import { PAIRS as GATE } from '../../../gates/measure-pairs.pairs.mjs';

const click = (selector) => (page) => page.evaluate((s) => document.querySelector(s).click(), selector);
const press = (key) => (page) => page.keyboard.press(key);
const focus = (selector) => (page) => page.focus(selector);
const settle = (ms) => (page) => page.waitForTimeout(ms);

// probe: elements whose shape and face are read while the pair is open
const probes = {
    dialog: '.kp-dialog[open]',
    drawer: '.kp-drawer[open]',
    alarm: 'dialog.kp-alarm[open] .kp-alarm__panel, dialog.kp-alarm[open]',
    'popover-row-actions': '.kp-popover:popover-open',
    'theme-menu': '[data-fa-theme-menu] .kp-menu, .kp-popover:popover-open',
    tour: '.kp-tour[open]',
    palette: '.kp-palette[open]',
    combobox: '.kp-combobox__list:popover-open, .kp-combobox__list:not([hidden])',
};

async function holdNavTimers(page) {
    await page.focus('.fa-phone [data-kp-nav-toggle]');
    await page.evaluate(() => {
        const set = window.setTimeout.bind(window);
        window.__held = [];
        window.setTimeout = (fn, ms, ...rest) => (ms >= 200 && ms <= 2000 ? void window.__held.push(fn) : set(fn, ms, ...rest));
    });
}

export const PAIRS = [
    // the phone bar's script ends the close on a timer of the theme's close time (240 to 1000 ms): held while the
    // paused frames are read, released after, in every theme (the gate's row holds 400-600 ms, cyberpunk's)
    ...GATE.map((p) => ({ ...p, probe: probes[p.id], ...(p.id === 'phone-bar' ? { themes: undefined, setup: holdNavTimers } : {}) })),
    {
        id: 'sidenav-push',
        section: '#sidenav',
        setup: async (page) => {
            await page.evaluate(() => {
                const n = document.getElementById('fa-over');
                n.setAttribute('data-kp-sidenav-mode', 'push');
                n.removeAttribute('data-kp-sidenav-backdrop');
            });
            await page.waitForTimeout(300);
            await page.focus('button[aria-controls="fa-over"]');
        },
        open: click('button.kp-sidenav__toggle[aria-controls="fa-over"]'),
        close: click('#fa-over button[data-kp-sidenav-toggle]'),
    },
    // research/sidenav-edge (Kenny, 2026-10-13): the panel at the window's edge with its launcher, three variants on
    // three app pages; the launcher opens and closes it, and a push moves the page with the panel.
    ...['push', 'gutter', 'over'].map((variant) => ({
        id: `sidenav-edge-${variant}`,
        page: `/research/sidenav-edge/${variant}.html`,
        // the gutter page starts open: shut it first, then measure an opening and its close
        setup: async (page) => {
            if (variant === 'gutter') {
                await page.evaluate(() => document.querySelector('.kp-sidenav__launcher button').click());
                await page.waitForTimeout(1800);
            }
            await page.focus('.kp-sidenav__launcher button');
        },
        open: click('.kp-sidenav__launcher button'),
        close: click('.kp-sidenav__launcher button'),
    })),
    // the edge tab opens and closes the over panel; the collapsed rail's group floats out and back; the rail widens on focus
    {
        id: 'sidenav-edge-tab',
        page: '/research/sidenav-edge/over.html',
        setup: focus('.kp-sidenav__tab button'),
        open: click('.kp-sidenav__tab button'),
        close: click('.kp-sidenav__tab button'),
    },
    {
        id: 'sidenav-rail-flyout',
        page: '/research/sidenav-edge/rail.html',
        setup: (page) => page.evaluate(() => document.querySelectorAll('.kp-sidenav__category-toggle')[1].setAttribute('data-audit-t', '')),
        // a pointer's click (detail 1): a click with detail 0 is the keyboard's, which takes the focus into the group
        open: (page) => page.evaluate(() => document.querySelector('[data-audit-t]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))),
        close: (page) => page.evaluate(() => document.querySelector('[data-audit-t]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))),
    },
    {
        // the label tip of the collapsed rail: the pointer arrives on an item and leaves it
        id: 'sidenav-rail-tip',
        page: '/research/sidenav-edge/rail.html',
        open: async (page) => {
            const box = await page.locator('.kp-sidenav__link').first().boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.waitForFunction(() => document.querySelector('.kp-sidenav__tip')?.matches(':popover-open'));
        },
        // Escape takes the tip away with the pointer still on the item, so the item's own hover is not part of the pair
        close: (page) =>
            page.evaluate(() => document.querySelector('.kp-sidenav').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))),
    },
    {
        id: 'sidenav-rail-peek',
        page: '/research/sidenav-edge/peek.html',
        setup: settle(300),
        open: (page) => page.evaluate(() => document.querySelector('.kp-sidenav__link').focus()),
        close: (page) => page.evaluate(() => document.activeElement.blur()),
    },
    {
        id: 'sidenav-group',
        section: '#sidenav',
        setup: async (page) => {
            await page.evaluate(() =>
                document
                    .querySelector('#fa-side .kp-sidenav__category:not([data-kp-sidenav-expanded]) .kp-sidenav__category-toggle')
                    .setAttribute('data-audit-t', ''),
            );
            await page.focus('[data-audit-t]');
        },
        open: click('[data-audit-t]'),
        close: click('[data-audit-t]'),
    },
    {
        id: 'accordion',
        section: '#tree',
        setup: focus('.kp-accordion__item:nth-child(2) .kp-accordion__summary'),
        open: click('.kp-accordion__item:nth-child(2) .kp-accordion__summary'),
        close: click('.kp-accordion__item:nth-child(2) .kp-accordion__summary'),
    },
    {
        id: 'tree',
        section: '#tree',
        setup: async (page) => {
            await page.focus('[data-kp-tree] > li:first-child');
        },
        open: press('ArrowRight'),
        close: press('ArrowLeft'),
    },
    {
        id: 'calendar-busy',
        section: '#calendar',
        setup: focus('[data-fa-calendar="loading"]'),
        open: click('[data-fa-calendar="loading"]'),
        close: click('[data-fa-calendar="ready"]'),
    },
    {
        id: 'table-busy',
        section: '#table',
        setup: focus('[data-fa-table="busy"]'),
        open: click('[data-fa-table="busy"]'),
        close: click('[data-fa-table="ready"]'),
    },
    {
        id: 'upload-file',
        section: '#fields',
        setup: focus('[data-kp-upload-input]'),
        open: (page) => page.setInputFiles('#fa-up', { name: 'pump-log.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2\n') }),
        close: click('.kp-upload__file button'),
    },
    {
        id: 'toast',
        page: '/catalogue/feedback.html',
        section: '#toasts, .kp-toasts',
        setup: async (page) => {
            await page.evaluate(() => {
                const r = document.querySelector('.kp-toasts');
                r.replaceChildren();
            });
        },
        open: (page) =>
            page.evaluate(async () => {
                const m = await import('/js/overlays.js');
                window.__t = m.toast('Pair meter toast', { ms: 0, region: document.querySelector('.kp-toasts') });
            }),
        close: (page) => page.evaluate(() => window.__t.dismiss()),
        probe: '.kp-toasts .kp-toast',
    },
    {
        id: 'alert-close',
        page: '/catalogue/feedback.html',
        section: '.cat-stage:has(.kp-alert--success)',
        // dismissed first and let go, so the pair is the re-shown alert (hidden = false) and its dismissal
        setup: async (page) => {
            await page.evaluate(() => {
                window.__a = document.querySelector('.kp-alert--success');
                window.__a.scrollIntoView({ block: 'center' });
                window.__a.querySelector('.kp-alert__close').click();
            });
            await page.waitForTimeout(2200);
            await page.focus('.kp-alert--success .kp-alert__close').catch(() => {});
        },
        open: (page) =>
            page.evaluate(() => {
                window.__a.hidden = false;
            }),
        close: (page) => page.evaluate(() => window.__a.querySelector('.kp-alert__close').click()),
    },
    {
        id: 'tooltip',
        page: '/catalogue/overlays.html',
        section: '.kp-tooltip-anchor:not([data-kp-tooltip-owner])',
        setup: async (page) => {
            await page.evaluate(() => window.scrollTo(0, 0));
        },
        open: (page) =>
            page.evaluate(() =>
                document
                    .querySelector('.kp-tooltip-anchor:not([data-kp-tooltip-owner]) .kp-button')
                    .dispatchEvent(new FocusEvent('focusin', { bubbles: true })),
            ),
        close: press('Escape'),
        probe: '.kp-tooltip:popover-open, .kp-tooltip',
    },
    {
        id: 'wizard-step',
        page: '/catalogue/structure.html',
        section: '[data-kp-wizard]',
        setup: focus('[data-kp-wizard-next]'),
        open: click('[data-kp-wizard-next]'),
        close: click('[data-kp-wizard-back]'),
    },
    {
        id: 'empty-state',
        page: '/catalogue/table.html',
        section: '.kp-datatable__search',
        setup: async (page) => {
            await page.evaluate(() => {
                const e = document.querySelector('.kp-datatable__search');
                e.scrollIntoView();
                window.__s = e;
            });
            await page.focus('.kp-datatable__search');
        },
        open: (page) =>
            page.evaluate(() => {
                window.__s.value = 'zzzzzzz';
                window.__s.dispatchEvent(new Event('input', { bubbles: true }));
            }),
        close: (page) =>
            page.evaluate(() => {
                window.__s.value = '';
                window.__s.dispatchEvent(new Event('input', { bubbles: true }));
            }),
    },
    {
        id: 'tabs-panel',
        page: '/catalogue/navigation.html',
        section: '.kp-tabs',
        setup: focus('.kp-tabs [role="tab"]:nth-of-type(2)'),
        open: click('.kp-tabs [role="tab"]:nth-of-type(2)'),
        close: click('.kp-tabs [role="tab"]:nth-of-type(1)'),
    },
];
