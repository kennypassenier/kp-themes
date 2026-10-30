// Page descriptor for the "dialog" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const dialogDescriptor = {
        id: 'dialog',
        title: 'Dialog',
        group: 'Navigation',
        classes: ['kp-dialog'],
        exports: ['Dialog'],
        intro: 'The browser’s own dialog element, painted. Opened as a modal it traps focus, closes on Escape and puts focus back where it came from — all three for free, which is why none of them is written here.',
        whenToUse:
            'For a decision that has to be made before anything else continues, and for a short form that would lose its context on its own page. Not for a message, which is an alert or a toast; not for anything long, because a dialog cannot be scrolled comfortably or printed; and not for something the reader may want to keep open while working.',
        examples: [
            {
                title: 'A button that opens a modal dialog',
                why: 'The trigger names the dialog by id and the module wires the two together. Escape closes it and focus returns to the button.',
                markup: `
<button type="button" class="kp-button" data-kp-dialog="doc-dialog">Delete application</button>
<dialog class="kp-dialog" id="doc-dialog">
<h2 class="kp-dialog__title">Delete this application?</h2>
<p class="kp-dialog__description">It disappears from your list. This cannot be undone.</p>
<div class="kp-dialog__actions">
<button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-dialog-close>Delete</button>
</div>
</dialog>
`,
            },
            {
                title: 'A dialog that manages one thing, in sections',
                why: 'The head holds the title, a state badge and the description; the body holds sections with a heading and a note, the danger section last. The wide variant takes its full width at once, so a section that fills later moves nothing sideways.',
                markup: `
<dialog class="kp-dialog kp-dialog--wide" open aria-labelledby="doc-manage-title">
<div class="kp-dialog__head">
<h2 class="kp-dialog__title" id="doc-manage-title">home-assistant</h2>
<span class="kp-badge kp-badge--success">active</span>
<p class="kp-dialog__description">Issued 02/10/2026 09:14 · last used 16/10/2026 18:40 (412×)</p>
</div>
<div class="kp-dialog__body">
<section class="kp-dialog__section">
<h3 class="kp-dialog__heading">Token</h3>
<div class="kp-secret" data-kp-secret data-kp-secret-label="Token of home-assistant" data-kp-secret-value="kp_live_7Hq2v9XcLm4TzR8sWb3N"></div>
<p class="kp-dialog__note">Hides itself again after 30 seconds.</p>
</section>
<section class="kp-dialog__section kp-dialog__section--danger">
<h3 class="kp-dialog__heading">Danger zone</h3>
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Revoke this token?">Revoke</button>
<p class="kp-dialog__note">Revoking keeps the row and its history; deleting does not.</p>
</section>
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button">Close</button>
</div>
</dialog>
`,
            },
            {
                title: 'A confirmation that lists what still uses the thing, and one that blocks',
                why: '`openConfirmation(button, options)` in js/components.js is what a button with `data-kp-confirm` opens; a page can call it itself. `dependents` lists what still uses the thing under the description, in `.kp-confirm__dependents` (a `.kp-dialog__heading` with the exact count, then `.kp-confirm__list`, one line each). `blocked` (a sentence, or `true` for the dictionary’s) makes it a notice instead of a question: one Close button, no Confirm, and no typed field either. The same options come from the button as `data-kp-confirm-dependents` (one name per `;`) and `data-kp-confirm-blocked`. `onAccept` runs only on Confirm.',
                markup: `
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button kp-button--destructive" data-doc-confirm="list">Delete the source…</button>
<button type="button" class="kp-button kp-button--destructive" data-doc-confirm="blocked">Delete the calendar…</button>
</div>
<p class="kp-text-muted" data-doc-confirm-said role="status">Nothing has been deleted.</p>
`,
                script: `
import { openConfirmation } from '@kp-soft/themes/js/components';

const said = document.querySelector('[data-doc-confirm-said]');
const dependents = ['kyu-runner', 'Home Assistant', 'Almanac'];

document.querySelector('[data-doc-confirm="list"]').addEventListener('click', (event) => {
    openConfirmation(event.currentTarget, {
        phrase: 'Delete the source Household?',
        dependents,
        onAccept: () => { said.textContent = 'Deleted. Three things lost their source.'; },
    });
});
document.querySelector('[data-doc-confirm="blocked"]').addEventListener('click', (event) => {
    openConfirmation(event.currentTarget, {
        phrase: 'Delete the calendar Household?',
        dependents: dependents.slice(0, 2),
        blocked: 'Delete those two sources first, on the Sources page.',
        onAccept: () => { said.textContent = 'This is never reached: a blocked removal has no Confirm.'; },
    });
});
`,
            },
            {
                title: 'The parts, with the dialog left open',
                why: 'Printed open so the pieces can be seen at rest: the title, the description under it, the close in the corner and the actions at the end.',
                markup: `
<dialog class="kp-dialog" open>
<h2 class="kp-dialog__title">Invite a colleague</h2>
<p class="kp-dialog__description">They get an email with a link that expires in a week.</p>
<button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close">×</button>
<div class="kp-field">
<label class="kp-field__label" for="doc-dialog-mail">Email</label>
<input class="kp-field__input" id="doc-dialog-mail" type="email" />
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button">Cancel</button>
<button type="button" class="kp-button kp-button--primary">Send</button>
</div>
</dialog>
`,
            },
        ],
        variants: [
            { name: 'modal', what: 'The default: the rest of the page is inert behind a dimmed backdrop, focus is trapped, and Escape closes.' },
            { name: 'non-modal', what: 'Opened without inerting the page, for a panel that has to sit beside what it is about.' },
            { name: '.kp-dialog__title / __description', what: 'The heading and the sentence under it, which are also what name and describe the dialog.' },
            { name: '.kp-dialog__close', what: 'The close in the corner, on top of the padding rather than in the flow.' },
            { name: '.kp-dialog__actions', what: 'The buttons at the end, pushed to the trailing edge, primary last.' },
            { name: '.kp-dialog--wide', what: 'A dialog that manages one thing: 42rem wide at once, so a section that fills later moves nothing sideways.' },
            { name: '.kp-dialog__head', what: 'The title with a state badge beside it and the description under both.' },
            { name: '.kp-dialog__section / __heading / __note', what: 'One part of the body under its heading, with an optional note under it; sections are divided by a rule.' },
            { name: '.kp-dialog__section--danger', what: 'The last section, for what cannot be undone: ruled along its start edge in the destructive colour.' },
            { name: '.kp-confirm__dependents, .kp-confirm__list', what: 'In a confirmation: what still uses the thing, a section with a heading that carries the exact count and a list of one line each. Set by `dependents` or `data-kp-confirm-dependents`; the dialog is then described by its description and this list.' },
            { name: 'blocked confirmation', what: '`blocked` or `data-kp-confirm-blocked`: the description becomes the sentence that says what to do first, and the only button is Close. A blocked removal shows no typed field and no Confirm.' },
            { name: 'backdrop', what: 'A dimming rather than a theme colour: a tinted backdrop paints the page instead of pushing it back.' },
            { name: 'pastel', what: 'In pastel a dialog is printed twice and stuck on: its second pass, a flat silhouette in the second ink drawn by its ::backdrop and placed on it by anchor positioning, springs into its rest 6 px off register, then the dialog swings down onto it from its top-start corner on the soft landing (one 8 % overshoot, settled once); a strip of washi tape crosses its top-start corner, and the modal’s dim is the backdrop’s border, so a click outside still reaches it. The close is that opening played backwards. Without anchor positioning the pass rests as a flat shadow and the dialog opens with the swing alone; under reduced motion it is simply there.' },
            { name: 'section inset', what: 'A section’s rule keeps a small room between the text and the ends of the rule (a knob).' },
        ],
        accessibility: [
            'Built in — focus trapping, Escape and focus return come from the element itself, so they work the way the platform’s do.',
            'Built in — opening from a wired trigger is an event that says which trigger and whether it was modal, so a consumer can restore state.',
            'Yours — name the dialog with its title, and point it at its description.',
            'Yours — give every dialog a way out that is not Escape; a modal with only a submit is a trap on touch.',
            'Yours — keep it short. A dialog is not a page.',
        ],
    };
