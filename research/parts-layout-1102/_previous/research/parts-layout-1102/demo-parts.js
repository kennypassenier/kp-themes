// research/parts-layout-1102: the page's own wiring, part two: Kitchen's and Medicine Cabinet's bars, Homelab's snooze popover and
// Overview cards, Kitchen's coupled wheels. The shared helpers are demo.js's. The data is mock.

import { attachMenuButtons, openMenu, setMenu } from '../../js/menu-button.js';
import { attachNavFolds } from '../../js/nav-fold.js';
import { attachPopoverForms, openPopoverForm } from '../../js/popover-form.js';
import { attachWheels, setWheelItems } from '../../js/wheel.js';
import { $, REPLY_MS, answer, on, pressed, say } from './demo.js';
import { MAINS, SIDES, STOCK_MENU } from './data.js';

// ---------------------------------------------------------------- 5 · nav-more (Kitchen's and Medicine Cabinet's bars)
const kitchen = $('pg-kitchen-nav');
const stockMenu = $('pg-stock-menu');
attachNavFolds(document);
attachMenuButtons(document);
if (stockMenu) setMenu(stockMenu, STOCK_MENU);

/** Mark one of Kitchen's pages as the page shown, as its router does. @param {string} page */
function showPage(page) {
    for (const link of kitchen?.querySelectorAll('a[data-pg-page]') ?? []) {
        if (link.getAttribute('data-pg-page') === page) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    }
    const words = kitchen?.querySelector(`a[data-pg-page="${page}"]`)?.textContent?.trim() ?? page;
    say('pg-nav-log', `Kitchen shows ${words}`);
}
// A link of the bar, or the More menu's entry that clicks it: the page stays, the current mark moves.
kitchen?.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[data-pg-page]') : null;
    if (!link || !kitchen.contains(link)) return;
    event.preventDefault();
    showPage(link.getAttribute('data-pg-page') ?? 'today');
});
// Medicine Cabinet's links and menu entries stay on this page.
$('pg-cabinet-nav')?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a[href^="#cabinet-"]')) event.preventDefault();
});
stockMenu?.addEventListener('kp-menu-select', (event) => {
    const { item } = /** @type {CustomEvent<{ item?: { label?: string } }>} */ (event).detail ?? {};
    say('pg-nav-log', `Medicine Cabinet: Stock, ${item?.label ?? 'an entry'}`);
});
on('page', (value) => showPage(value));
on('navopen', (value) => {
    const wrapper = value === 'more' ? kitchen?.querySelector('.kp-nav__more > .kp-menu-button') : stockMenu;
    if (wrapper) requestAnimationFrame(() => openMenu(/** @type {HTMLElement} */ (wrapper)));
});

// ---------------------------------------------------------------- 6 · snooze-popover (Homelab's Inbox)
attachPopoverForms(document);
const SNOOZE_FAILED = 'Homelab did not answer; the alert is not snoozed.';
/** dd/mm/yyyy from an ISO day. @param {string} iso */
const shown = (iso) => iso.split('-').reverse().join('/');
for (const form of document.querySelectorAll('#pg-inbox [data-kp-popover-form]')) {
    form.addEventListener('kp-popover-form-accept', (event) => {
        const { values, waitUntil } = /** @type {CustomEvent<{ values: Record<string, string>, waitUntil: (p: Promise<unknown>) => void }>} */ (event).detail;
        const fails = pressed('snoozesave', 'pg-inbox', 'ok') === 'fail';
        const until = `${shown(values.day ?? '')} ${values.time ?? ''}`;
        say('pg-snooze-log', `kp-popover-form-accept: day ${values.day}, time ${values.time}`);
        waitUntil(
            answer(REPLY_MS).then(() => {
                if (fails) throw new Error(SNOOZE_FAILED);
                const badge = form.closest('.kp-formgrid__row')?.querySelector('.kp-badge');
                if (badge) badge.textContent = `Snoozed until ${until}`;
            }),
        );
    });
}
on('snoozesave', (value) => say('pg-snooze-log', value === 'fail' ? 'The next snooze fails: Homelab will not answer.' : 'The next snooze is saved.'));
on('snoozeopen', () => {
    const form = $('pg-snooze-nas');
    if (form) requestAnimationFrame(() => openPopoverForm(form));
});

// ---------------------------------------------------------------- 7 · card-empty (Homelab's Overview cards)
on('cards', (value, target) => {
    const items = value === 'items';
    for (const plate of target?.querySelectorAll('[data-pg-empty]') ?? []) plate.toggleAttribute('hidden', items);
    for (const list of target?.querySelectorAll('[data-pg-items]') ?? []) list.toggleAttribute('hidden', !items);
});

// ---------------------------------------------------------------- 8 · coupled-wheels (Kitchen's dinner)
const main = $('pg-wheel-main');
const side = $('pg-wheel-side');
attachWheels(document);
if (main) setWheelItems(main, MAINS);
if (side) setWheelItems(side, SIDES);
/** @type {Record<string, string>} */
const picked = {};
for (const [wheel, name] of /** @type {[HTMLElement | null, string][]} */ ([[main, 'main course'], [side, 'side dish']])) {
    wheel?.addEventListener('kp-wheel-spin', () => {
        delete picked[name];
    });
    wheel?.addEventListener('kp-wheel-result', (event) => {
        picked[name] = /** @type {CustomEvent<{ item: { label: string } }>} */ (event).detail.item.label;
        say('pg-wheel-log', Object.entries(picked).map(([which, label]) => `kp-wheel-result (${which}): ${label}`).join(' · '));
    });
}
on('couple', (value, target) => {
    if (value === 'on') target?.setAttribute('data-kp-wheel-follows', 'pg-wheel-main');
    else target?.removeAttribute('data-kp-wheel-follows');
});
