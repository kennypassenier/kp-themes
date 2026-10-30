// The navigation toggle that opens and closes the nav on small screens.
import { getStrings } from '../strings.js';

/** Fired on the nav when its toggle opens or closes it: `{ open }`. */
export const NAV_TOGGLE_EVENT = 'kp-nav-toggle';
/** The mark the React NavBar puts on a toggle it wires itself [AR29]. */
export const NAV_OWNED = '[data-kp-nav-owner]';
/**
 * Wire the toggle a narrow navigation collapses into [scope-10, stage 1.3].
 *
 * Opt-in by the button being there: a nav without one keeps the behaviour
 * it had, which is what makes this additive for every page already built.
 * The CSS decides when the bar is narrow enough to collapse; this decides
 * nothing about width at all, so the two cannot disagree.
 *
 * Every state it sets has a way out [KT6]: the toggle itself, Escape while
 * the focus is inside the nav, a click outside it, and the `kp-nav-toggle`
 * event for a consumer who wants to persist or veto nothing but observe.
 * `detach` removes what attach stamped.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, ownedBy?: string }} [options]
 * @returns {() => void} detach
 */
export function attachNavToggles(root = document, { strings, ownedBy = NAV_OWNED } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll('[data-kp-nav-toggle]')) {
        const button = /** @type {HTMLElement} */ (el);
        // AR29, and it is the fault that shipped once already: two channels
        // wiring the same button re-armed each other's state forever. The
        // React NavBar marks its own, and a consumer who wants this module
        // over a React nav anyway passes `ownedBy: ''`.
        if (ownedBy !== '' && button.matches(ownedBy)) continue;
        if (button.dataset.kpNavToggleAttached !== undefined) continue;
        button.dataset.kpNavToggleAttached = '';

        const nav = button.closest('.kp-nav') ?? button.parentElement;
        if (!nav) continue;
        const links = nav.querySelector('.kp-nav__links');

        // aria-controls needs an id, and a page that did not give one still
        // deserves the association rather than silence.
        if (links && !links.id) links.id = `kp-nav-links-${cleanups.length}-${Math.random().toString(36).slice(2, 8)}`;
        if (links) button.setAttribute('aria-controls', links.id);

        const label = () => {
            const s = { ...getStrings(), ...strings };
            return nav.hasAttribute('data-kp-nav-open') ? s.closeMenu : s.menu;
        };
        /** @param {boolean} open */
        const write = (open) => {
            nav.toggleAttribute('data-kp-nav-open', open);
            button.setAttribute('aria-expanded', String(open));
            button.setAttribute('aria-label', label());
        };
        let closing = false;
        /** @param {boolean} open */
        const set = (open) => {
            if (open) {
                closing = false;
                nav.removeAttribute('data-kp-nav-closing');
                write(true);
                // The panel's own height, for a theme that grows it: a ceiling
                // taller than the list hides the first and last part of the
                // growth, and the close is not the open reversed.
                if (links) /** @type {HTMLElement} */ (nav).style.setProperty('--kp-nav-links-height', `${links.scrollHeight}px`);
                nav.dispatchEvent(new CustomEvent(NAV_TOGGLE_EVENT, { bubbles: true, detail: { open: true } }));
            } else {
                if (closing || !nav.hasAttribute('data-kp-nav-open')) return;
                closing = true;
                nav.setAttribute('data-kp-nav-closing', '');
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('aria-label', label());
                const navStyle = getComputedStyle(nav);
                const durVal = (navStyle.getPropertyValue('--kp-nav-close-time') || navStyle.getPropertyValue('--kp-sig-fo-time')).trim();
                const dur = durVal ? (durVal.endsWith('ms') ? parseFloat(durVal) : parseFloat(durVal) * 1000) : 300;
                setTimeout(
                    () => {
                        if (!closing) return;
                        closing = false;
                        nav.removeAttribute('data-kp-nav-closing');
                        write(false);
                        nav.dispatchEvent(new CustomEvent(NAV_TOGGLE_EVENT, { bubbles: true, detail: { open: false } }));
                    },
                    Number.isFinite(dur) ? dur : 300,
                );
            }
        };
        // Attaching is not a toggle. This wrote the starting state THROUGH
        // the dispatch, so every consumer listening heard a close that
        // nobody performed, on every page load — found by the first test
        // ever to listen.
        write(nav.hasAttribute('data-kp-nav-open'));

        const onClick = () => set(!nav.hasAttribute('data-kp-nav-open') && !closing);
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (event.key !== 'Escape' || !nav.hasAttribute('data-kp-nav-open')) return;
            set(false);
            button.focus();
        };
        /** @param {Event} event */
        const onOutside = (event) => {
            if (!nav.hasAttribute('data-kp-nav-open')) return;
            if (nav.contains(/** @type {Node} */ (event.target))) return;
            set(false);
        };

        button.addEventListener('click', onClick);
        nav.addEventListener('keydown', /** @type {EventListener} */ (onKey));
        document.addEventListener('click', onOutside, true);

        cleanups.push(() => {
            button.removeEventListener('click', onClick);
            nav.removeEventListener('keydown', /** @type {EventListener} */ (onKey));
            document.removeEventListener('click', onOutside, true);
            nav.removeAttribute('data-kp-nav-open');
            button.removeAttribute('aria-expanded');
            button.removeAttribute('aria-label');
            button.removeAttribute('aria-controls');
            delete button.dataset.kpNavToggleAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
