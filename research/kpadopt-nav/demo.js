// research/kpadopt-nav: the buttons that play a state, the slider, and the note for reduced motion.
// Nothing here is the package's: it only presses what the package already does.
import { openMenu } from '../../js/menu-button.js';
import { setTabbarBadge, setTabbarBusy, setTabbarCurrent } from '../../js/tabbar.js';

const note = document.querySelector('[data-nf-motion]');
if (note instanceof HTMLElement && matchMedia('(prefers-reduced-motion: reduce)').matches) note.hidden = false;

/** @param {string} id @returns {HTMLElement | null} */
const frameOf = (id) => document.querySelector(`[data-nf="${id}"]`);

/**
 * Resolves when the bar in a frame has been fitted by the script.
 * @param {HTMLElement} nav
 * @returns {Promise<void>}
 */
function fitted(nav) {
    if (nav.hasAttribute('data-kp-nav-fold-ready')) return Promise.resolve();
    return new Promise((resolve) => {
        const watch = new MutationObserver(() => {
            if (!nav.hasAttribute('data-kp-nav-fold-ready')) return;
            watch.disconnect();
            resolve();
        });
        watch.observe(nav, { attributes: true, attributeFilter: ['data-kp-nav-fold-ready'] });
    });
}

/** The slider resizes the first bar. */
for (const slider of document.querySelectorAll('[data-nf-slider]')) {
    const input = /** @type {HTMLInputElement} */ (slider);
    const frame = frameOf(input.dataset.nfSlider ?? '');
    const out = document.querySelector(`[data-nf-out="${input.dataset.nfSlider}"]`);
    const apply = () => {
        frame?.style.setProperty('--nf-w', `${input.value}rem`);
        if (out) out.textContent = `${input.value}rem`;
    };
    input.addEventListener('input', apply);
    apply();
}

/** More, shown open (and again on the button). */
async function showOpen(id) {
    const nav = frameOf(id)?.querySelector('.kp-nav');
    if (!(nav instanceof HTMLElement)) return;
    await fitted(nav);
    const wrapper = nav.querySelector('.kp-nav__more > .kp-menu-button');
    if (wrapper) openMenu(wrapper, { focus: 'none' });
}
for (const button of document.querySelectorAll('[data-nf-open]')) {
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        void showOpen(/** @type {HTMLElement} */ (button).dataset.nfOpen ?? '');
    });
}

/**
 * The "More opened" bar shows its menu open once the bar is on screen, and again each time it comes back to it: a menu
 * opened at load, while its bar was far below the window, was placed for a window it was not in, and a section the
 * review dialog moves into its stage loses its place in the top layer. A menu that is open and was left behind is
 * placed again by the window's own resize (the menu button listens to it); one that was closed (a press outside) opens.
 */
const openFrame = frameOf('open');
if (openFrame && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        const button = openFrame.querySelector('.kp-nav__more-button');
        if (button?.getAttribute('aria-expanded') === 'true') window.dispatchEvent(new Event('resize'));
        else void showOpen('open');
    }).observe(openFrame);
} else void showOpen('open');

/** Keyboard focus on More, on the button's press only: a focus on load scrolls the page. */
for (const button of document.querySelectorAll('[data-nf-focus]')) {
    button.addEventListener('click', () => {
        const more = frameOf(/** @type {HTMLElement} */ (button).dataset.nfFocus ?? '')?.querySelector('.kp-nav__more-button');
        if (more instanceof HTMLElement) more.focus({ preventScroll: true, focusVisible: true });
    });
}

/** The phones: pressing a tab makes it current. */
for (const tab of document.querySelectorAll('.tb-phone a.kp-tabbar__tab')) {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        const bar = tab.closest('.kp-tabbar');
        if (bar && !tab.hasAttribute('aria-disabled') && !tab.hasAttribute('aria-busy')) setTabbarCurrent(bar, tab.getAttribute('data-kp-tab'));
    });
}

const first = document.querySelector('[data-tb="home"]');
let count = 3;
document.querySelector('[data-tb-count]')?.addEventListener('click', () => {
    count += 1;
    const inbox = first?.querySelector('[data-kp-tab="inbox"]');
    if (inbox) setTabbarBadge(inbox, count);
});
document.querySelector('[data-tb-clear]')?.addEventListener('click', () => {
    count = 0;
    const inbox = first?.querySelector('[data-kp-tab="inbox"]');
    if (inbox) setTabbarBadge(inbox, null);
});
document.querySelector('[data-tb-busy]')?.addEventListener('click', () => {
    const overview = first?.querySelector('[data-kp-tab="overview"]');
    if (overview) setTabbarBusy(overview, !overview.hasAttribute('aria-busy'));
});
document.querySelector('[data-tb-focus]')?.addEventListener('click', () => {
    const activity = first?.querySelector('[data-kp-tab="activity"]');
    if (activity instanceof HTMLElement) activity.focus({ preventScroll: true, focusVisible: true });
});
