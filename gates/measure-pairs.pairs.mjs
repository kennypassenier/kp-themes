// The pairs the meter plays: one opening and the closing that must be it backwards.
// Each `open` / `close` runs the gesture; the meter pauses what it started.
// `section` is scrolled into view first so every frame is the same picture.
// `setup` puts the page where the gesture starts AND where it ends (focus goes
// back to the opener), so a focus ring is not read as a leftover.

const click = (selector) => (page) => page.evaluate((s) => document.querySelector(s).click(), selector);
const press = (key) => (page) => page.keyboard.press(key);
const focus = (selector) => (page) => page.focus(selector);

export const PAIRS = [
    { id: 'dialog', section: '#dialogs', setup: focus('[data-kp-dialog="fa-dialog"]'), open: click('[data-kp-dialog="fa-dialog"]'), close: click('#fa-dialog [data-kp-dialog-close="keep"]') },
    { id: 'drawer', section: '#dialogs', setup: focus('[data-kp-dialog="fa-drawer"]'), open: click('[data-kp-dialog="fa-drawer"]'), close: click('#fa-drawer [data-kp-dialog-close]:last-of-type') },
    { id: 'palette', section: '#palette', setup: focus('[data-kp-palette-open="fa-pal"]'), open: click('[data-kp-palette-open="fa-pal"]'), close: press('Escape') },
    { id: 'datepicker', section: '#datepicker', setup: focus('[data-kp-date-open]'), open: click('[data-kp-date-open]'), close: press('Escape') },
    {
        id: 'combobox',
        section: '#combobox',
        setup: async (page) => {
            await page.focus('.kp-combobox__input');
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1100);
        },
        open: (page) => page.keyboard.press('ArrowDown'),
        close: press('Escape'),
    },
    { id: 'theme-menu', section: '#theme-menu', setup: focus('[data-fa-theme-menu] button'), open: click('[data-fa-theme-menu] button'), close: press('Escape') },
    { id: 'popover-row-actions', section: '#popover-menus', setup: focus('[popovertarget="fa-menu"]'), open: click('[popovertarget="fa-menu"]'), close: press('Escape') },
    { id: 'tour', section: '#tour', setup: focus('[data-fa-tour-start]'), open: click('[data-fa-tour-start]'), close: press('Escape') },
    { id: 'alarm', section: '#alarm', setup: focus('[data-kp-alarm="Pressure lost"]'), open: click('[data-kp-alarm="Pressure lost"]'), close: click('dialog.kp-alarm .kp-alarm__ack') },
    {
        id: 'sidenav',
        section: '#sidenav',
        setup: focus('button[aria-controls="fa-over"]'),
        open: click('button.kp-sidenav__toggle[aria-controls="fa-over"]'),
        close: click('#fa-over button[data-kp-sidenav-toggle]'),
    },
    { id: 'bar-equipment', section: '#bar', setup: focus('.kp-nav__disclosure'), open: click('.kp-nav__disclosure'), close: click('.kp-nav__disclosure') },
];
