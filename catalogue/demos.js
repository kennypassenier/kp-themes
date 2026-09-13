// Behaviour a catalogue block needs that the package does not attach by
// itself. Delegated from the document, so it works on the component page, on
// the review page that gathers the block, and in a compare column alike —
// an inline script in the page would run in the first place only.
import { toast } from '../js/overlays.js';
import { sidenavOf } from '../js/sidenav.js';

const WORDS = {
    '': 'Saved. The handover note is visible to the day shift.',
    success: 'Success: incident INC-4471 closed.',
    error: 'Error: the note was not saved; you are offline.',
};

/**
 * The element a catalogue button names, looked up inside its own block
 * first: the review page gives every id a prefix, so an id written on the
 * component page is only a suffix there.
 * @param {Element} button
 * @param {string} name
 */
function named(button, name) {
    const block = button.closest('.cat-block, .cat-frame__main');
    return block?.querySelector(`[id="${CSS.escape(name)}"], [id$="--${CSS.escape(name)}"]`) ?? document.getElementById(name);
}

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest('[data-cat-toast]');
    if (button) {
        // The toast lands in the region of its own block, whatever id the region
        // was given when the block was gathered.
        const region =
            button.closest('.cat-block, .cat-frame__main')?.querySelector('.kp-toasts') ?? document.getElementById('cat-live-toasts') ?? undefined;
        const variant = button.getAttribute('data-cat-toast') ?? '';
        toast(WORDS[variant] ?? WORDS[''], { region, className: variant ? `kp-toast kp-toast--${variant}` : 'kp-toast' });
        return;
    }

    // The slim rail has no framework-free toggle: the package collapses and
    // expands it only through the handle sidenavOf() returns.
    const slim = target?.closest('[data-cat-slim]');
    if (slim) {
        const rail = named(slim, slim.getAttribute('data-cat-slim') ?? '');
        sidenavOf(rail)?.setSlim();
    }
});
