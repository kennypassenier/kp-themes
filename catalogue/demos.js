// Behaviour a catalogue block needs that the package does not attach by
// itself. Delegated from the document, so it works on the component page, on
// the review page that gathers the block, and in a compare column alike —
// an inline script in the page would run in the first place only.
import { toast } from '../js/overlays.js';

const WORDS = {
    '': 'Saved. The handover note is visible to the day shift.',
    success: 'Success: incident INC-4471 closed.',
    error: 'Error: the note was not saved; you are offline.',
};

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-toast]') : null;
    if (!button) return;
    // The toast lands in the region of its own block, whatever id the region
    // was given when the block was gathered.
    const region =
        button.closest('.cat-block, .cat-frame__main')?.querySelector('.kp-toasts') ?? document.getElementById('cat-live-toasts') ?? undefined;
    const variant = button.getAttribute('data-cat-toast') ?? '';
    toast(WORDS[variant] ?? WORDS[''], { region, className: variant ? `kp-toast kp-toast--${variant}` : 'kp-toast' });
});
