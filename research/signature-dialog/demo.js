// How a dialog opens, per theme (Kenny, 2026-10-03). The signature-elements
// round showed the dialog standing open in the page, so its entrance played
// once, on load, and nobody saw it. Here a button opens it over a backdrop the
// size of the screen (or of the review dialog's stage, whose `contain` makes
// it the box a fixed element fills), so the entrance plays every time.
//
// The drawings are the round's own files (../signature-elements/themes/*.css
// and demo.css): the overlay is the round's `.sx-backdrop`, inside `.sx-sig`
// for the signature and outside it for the package's look today.

const section = document.querySelector('[data-review-item="dialog"]');
const template = /** @type {HTMLTemplateElement} */ (document.querySelector('[data-sd-template]'));
const ideasBox = document.querySelector('[data-sd-ideas]');
const ideaLine = document.querySelector('[data-sd-idea]');
const themeName = document.querySelector('[data-sd-theme]');

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelector('[data-sd-motion]').hidden = false;
}

/* -------------------------------------------------------------- ideas */

// Formal, cyberpunk, retro and deco wrote theirs into the round's page; the
// rest into ideas/<theme>.json. Both are read, so nothing is copied by hand.
async function loadIdeas() {
    const ideas = {};
    try {
        const page = await (await fetch('../signature-elements/demo.html', { cache: 'no-cache' })).text();
        const doc = new DOMParser().parseFromString(page, 'text/html');
        for (const p of doc.querySelectorAll('[data-sx="dialog"] .sx-ideas [data-for]')) ideas[p.dataset.for] = p.innerHTML.trim();
    } catch {
        /* the lines are a help, not the demo */
    }
    const themes = (await import('../../js/theme-registry.js')).THEMES.map((t) => t.name);
    await Promise.all(
        themes.map(async (theme) => {
            try {
                const json = await (await fetch(`../signature-elements/ideas/${theme}.json`, { cache: 'no-cache' })).json();
                if (json.dialog) ideas[theme] = json.dialog;
            } catch {
                /* this theme writes its line in the page */
            }
        }),
    );
    for (const [theme, text] of Object.entries(ideas)) {
        const p = document.createElement('p');
        p.dataset.for = theme;
        p.innerHTML = text;
        ideasBox.append(p);
    }
    render();
}

function render() {
    const theme = document.documentElement.getAttribute('data-theme') || 'formal';
    themeName.textContent = theme;
    const line = ideasBox.querySelector(`[data-for="${theme}"]`);
    ideaLine.innerHTML = line ? `<b>The idea:</b> ${line.innerHTML}` : '';
}

new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
loadIdeas();

/* --------------------------------------------------------------- open */

/** @type {{ wrap: HTMLElement, back: HTMLElement | null } | null} */
let open = null;

function close() {
    if (!open) return;
    open.wrap.remove();
    open.back?.focus();
    open = null;
}

function show(kind, slow, back) {
    close();
    const wrap = document.createElement('div');
    wrap.className = kind === 'signature' ? 'sx-sig sd-layer' : 'sd-layer';
    wrap.append(template.content.cloneNode(true));
    section.append(wrap);
    open = { wrap, back };
    const overlay = wrap.querySelector('[data-sd-overlay]');
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay || /** @type {HTMLElement} */ (event.target).closest('[data-sd-close]')) close();
    });
    wrap.querySelector('.kp-button--primary')?.focus({ preventScroll: true });
    if (slow) {
        // A quarter of the speed, for every animation the entrance runs: the
        // dialog's, its pseudo-elements' and the backdrop's.
        for (const animation of document.getAnimations()) {
            const target = /** @type {KeyframeEffect} */ (animation.effect)?.target;
            if (target && wrap.contains(target)) animation.playbackRate = 0.25;
        }
    }
}

section.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('[data-sd-open]');
    if (!button) return;
    show(button.getAttribute('data-sd-open'), button.hasAttribute('data-sd-slow'), button);
});

// Escape closes the opened dialog first, and only that: in the review dialog
// it must not close the review as well.
window.addEventListener(
    'keydown',
    (event) => {
        if (event.key !== 'Escape' || !open) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        close();
    },
    true,
);

// A new theme, or the next step of the review: whatever was open closes.
new MutationObserver(close).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// In the review dialog every step opens the dialog once by itself, a moment
// after the theme is on, so the entrance is the first thing seen.
section.addEventListener('review:show', () => {
    setTimeout(() => show('signature', false, null), 350);
});
