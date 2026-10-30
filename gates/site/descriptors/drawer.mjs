// Page descriptor for the "drawer" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const drawerDescriptor = {
        id: 'drawer',
        title: 'Drawer',
        group: 'Navigation',
        classes: ['kp-drawer'],
        exports: [],
        intro: 'A panel at the end edge of the window, full height: a head with the title, the close button and one sentence, a body that scrolls, and a foot that stays. `.kp-drawer` lays out any element; a `dialog.kp-drawer` (with `.kp-dialog`) is placed at the edge and slides in.',
        whenToUse:
            'For Help, settings or the detail of one thing, kept beside the page rather than over its middle. Not for a decision that must be made first, which is a dialog, and not for navigation that is always there, which is a side navigation.',
        examples: [
            {
                title: 'Help in a drawer',
                why: 'The button names the dialog by id, as every dialog trigger does; Esc or ✕ closes it and the focus goes back to the button. The foot holds what Help can start.',
                markup: `
<button type="button" class="kp-button" data-kp-dialog="doc-drawer">Help</button>
<dialog class="kp-drawer kp-dialog" id="doc-drawer" aria-labelledby="doc-drawer-title">
<header class="kp-drawer__head">
<h2 class="kp-dialog__title" id="doc-drawer-title">Help</h2>
<button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close Help" data-kp-dialog-close>✕</button>
<p class="kp-drawer__desc">Where things live on this site, the words it uses, and its keys.</p>
</header>
<div class="kp-drawer__body">
<section class="kp-help kp-card">
<h3>Words</h3>
<p>The words this site uses for things.</p>
<dl class="kp-help__list">
<dt>Pump house</dt><dd>A building with one or more pumps that keep the pressure up in a part of the network.</dd>
<dt>Ring main</dt><dd>The loop of large pipes that feeds the town from two sides.</dd>
</dl>
</section>
</div>
<footer class="kp-drawer__foot">
<button type="button" class="kp-button kp-button--primary">Take the 1-minute tour</button>
</footer>
</dialog>
`,
            },
        ],
        variants: [
            { name: '.kp-drawer', what: 'Three rows: the head, the body (which scrolls) and the foot (which stays). On any element.' },
            { name: 'dialog.kp-drawer', what: 'At the end edge at the full height of the window, square, sliding in from the edge unless the reader asked for less motion.' },
            { name: '.kp-drawer__head, __desc', what: 'The title (a `.kp-dialog__title`, kept clear of the close button) and one sentence under it.' },
            { name: '.kp-drawer__body', what: 'What the drawer holds, in a column with room between; it scrolls inside itself.' },
            { name: '.kp-drawer__foot', what: 'The drawer’s action, always in view at the bottom.' },
            { name: 'pastel', what: 'In pastel the drawer opens as pastel’s dialog (its pass, the landing onto it, a strip of washi tape) and swings from its top-end corner; it closes as that opening backwards.' },
        ],
        accessibility: [
            'Built in — as a modal `dialog` it traps the focus, closes on Escape and returns the focus to its button: the browser’s, as every dialog’s.',
            'Yours — name the drawer by its title (`aria-labelledby`) and give it a close button with a name.',
        ],
    };
