// Page descriptor for the "button" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const buttonDescriptor = {
        id: 'button',
        title: 'Button',
        group: 'Forms',
        classes: ['kp-button', 'kp-confirm'],
        exports: ['Button'],
        aliases: ['confirm', 'contract', 'destructive', 'armed', 'undo', 'action', 'key'],
        intro: 'One button in four looks and three sizes, and the two contracts a button can carry: an action that cannot be taken back must offer a confirmation or an undo, and a row action can act at once and offer the way back beside itself while the window is open.',
        whenToUse:
            'For anything that acts on the page or sends something. Not for navigation — a control that goes to another URL is a link, and a link painted as a button loses the middle click, the context menu and what a screen reader says about it. Not for a bar of icons either: that is the icon button, which is the same paint at a square size.',
        examples: [
            {
                title: 'The four looks and a disabled one',
                why: 'Hover, active and disabled are derived from the base colour by the theme generator rather than authored per theme, so a new theme gets all three by declaring one.',
                markup: `
<button type="button" class="kp-button">Default</button>
<button type="button" class="kp-button kp-button--primary">Primary</button>
<button type="button" class="kp-button kp-button--destructive">Destructive</button>
<button type="button" class="kp-button kp-button--ghost">Ghost</button>
<button type="button" class="kp-button kp-button--primary" disabled>Disabled</button>
`,
            },
            {
                title: 'Three sizes',
                why: 'The middle step is the unmodified button, so `.kp-button` on its own is `md` and nothing that exists today changes size. The small step is floored at the 24px pointer target even under the compact density, and the large one is the row-leading action on a marketing page. Every measure behind them is a knob.',
                markup: `
<button type="button" class="kp-button kp-button--sm">Small</button>
<button type="button" class="kp-button">Medium</button>
<button type="button" class="kp-button kp-button--lg">Large</button>
`,
            },
            {
                title: 'A label beside an icon',
                why: 'The words go in their own `.kp-button__text` and the icon stays a hidden sibling. A register that underlines the first letter of the label when the button is pointed at (retro did, until it was removed on 2026-10-09) cannot tell a bare run of text from the icon next to it in CSS, so without the element that letter is never found. No theme styles it today: in the button’s flex row it lays out exactly as the bare text did. `<Button>` and the generated examples write it for you when the label mixes text with an element; by hand, add it yourself.',
                markup: `
<button type="button" class="kp-button"><span aria-hidden="true">↻</span><span class="kp-button__text">Retry</span></button>
<button type="button" class="kp-button kp-button--primary"><span class="kp-button__text">Export</span><span aria-hidden="true">↓</span></button>
`,
            },
            {
                title: 'A destructive button that confirms',
                why: 'Since 4.0.0 the click opens a modal dialog carrying your phrase: Escape and Cancel do nothing, Confirm re-fires the click so your own handler runs exactly once, and focus comes back to the button. Add `data-kp-confirm-mode="inline"` for the arm-then-act of 3.x, where the label changes and a second click acts. A destructive button carrying neither a confirmation nor an undo is disarmed by the contract enforcer and reported.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete this application?">Delete</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete this application?" data-kp-confirm-mode="inline">Delete, the 3.x way</button>
`,
            },
            {
                title: 'A removal that depends on something',
                why: 'The confirmation lists what still uses the thing (`data-kp-confirm-dependents`, one name per `;`, under a heading with the exact count). `data-kp-confirm-blocked` makes it a notice with one Close button and the sentence that says what to do first; `data-kp-confirm-type` turns Confirm on only once that name is typed (the typed confirmation).',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete the calendar Household?" data-kp-confirm-dependents="kyu-runner; Home Assistant" data-kp-confirm-blocked="Delete those two sources first, on the Sources page.">Delete</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete the calendar Holidays and everything on it?" data-kp-confirm-type="Holidays">Delete</button>
`,
            },
            {
                title: 'A removal that lists what it will leave without',
                why: '`data-kp-confirm-dependents` alone does not block: the confirmation lists what still uses the thing, under a heading with the exact count, and Confirm stays available for a reader who knows. Put `data-kp-confirm-blocked` on it as well (as above) when the removal may not go ahead.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete the source Household?" data-kp-confirm-dependents="kyu-runner; Home Assistant; Almanac">Delete</button>
`,
            },
            {
                title: 'A removal that asks for the name, and says what is lost',
                why: '`data-kp-confirm-type="media"` keeps Confirm off until the name is typed; `data-kp-confirm-loses` names a template or an element whose content is listed above the field as what will be lost; `data-kp-confirm-case="any"` lets capitals differ (spaces at the ends never count) and `data-kp-confirm-label` words Confirm (else the button’s own words without a trailing “…”). The dialog gains `.kp-confirm--typed`, and Enter in the field confirms a match. The typed confirmation has a page of its own, with the block for a page’s own dialog.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Wipe the stack media?" data-kp-confirm-type="media" data-kp-confirm-case="any" data-kp-confirm-label="Wipe it for good" data-kp-confirm-loses="doc-button-lost-media">Wipe media…</button>
<template id="doc-button-lost-media"><ul class="kp-type-confirm__list"><li>3 containers: jellyfin, jellyseerr, tdarr</li><li>/srv/media/config (2.4 GB)</li></ul></template>
`,
            },
            {
                title: 'A row action that acts at once and offers the way back',
                why: 'The optimistic half: the row goes away immediately, an undo appears beside it, and the action commits only when the window closes. The consumer hears both outcomes as events.',
                markup: `
<ul class="kp-stack">
<li data-kp-undo-target>Application at Example Inc
<button type="button" class="kp-button kp-button--ghost" data-kp-undo-action>Delete</button>
</li>
</ul>
`,
            },
            {
                title: 'A button that shows a running job',
                why: '`kp-button--live` is a row with the theme’s own spinner in front and a label that gives way: it never grows past its maximum width, cuts the long label with an ellipsis and, in a container narrower than 40rem (the nav wrapper is one), swaps the long label for the short one, so the box never empties. `hidden` takes it out of the bar without a gap. The narrow box below shows the short label.',
                markup: `
<div class="kp-row kp-gap-md">
<button type="button" class="kp-button kp-button--secondary kp-button--sm kp-button--live"><span class="kp-spinner kp-button__spin" aria-hidden="true"></span><span class="kp-button__short">Running</span><span class="kp-button__long">Updating gateway · step 3 of 35</span></button>
<div style="inline-size: 14rem; container-type: inline-size">
<button type="button" class="kp-button kp-button--secondary kp-button--sm kp-button--live"><span class="kp-spinner kp-button__spin" aria-hidden="true"></span><span class="kp-button__short">Running</span><span class="kp-button__long">Updating gateway · step 3 of 35</span></button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-button--live', what: 'A running-job button: `.kp-button__spin` (the theme’s spinner), `.kp-button__short` and `.kp-button__long`. The long label is cut with an ellipsis; the short one takes over in a container under 40rem. The widest it grows is the live-width knob.' },
            { name: '.kp-button', what: 'The default: the secondary surface with a boundary, for the actions that are neither the main one nor dangerous.' },
            { name: '.kp-button--primary', what: 'One per view. The action the reader came to take.' },
            { name: '.kp-button--destructive', what: 'Deletes and disconnections. It has to carry a confirmation or an undo as well.' },
            { name: '.kp-button--ghost', what: 'No ground and no boundary until it is hovered, for actions that sit inside dense rows.' },
            {
                name: '.kp-button--sm',
                what: 'The small step, for a control that sits inside a table row or a menu. Its height is floored so the compact density cannot take it under the 24px pointer target.',
            },
            { name: '.kp-button--lg', what: 'The large step, for the one action a landing page is about. There is no modifier for the middle step: that is `.kp-button` itself.' },
            {
                name: '.kp-button__text',
                what: 'The words of a label that also holds an icon or another element. Public: use it whenever the label is more than bare text. A label of text alone needs none, and a label that marks its own access key with `data-kp-key` is left as written.',
            },
            { name: '.kp-button__undo', what: 'The undo the pattern puts beside a committed action, inline rather than in a toast that may already be gone.' },
            {
                name: '.kp-confirm',
                what: 'The dialog the confirmation opens, on top of `.kp-dialog`. It also carries `data-kp-confirm-dialog`, which is what a consumer reaches it by.',
            },
            { name: 'data-kp-confirm-dependents', what: 'What still uses the thing, one name per `;`: listed in the confirmation (`.kp-confirm__dependents`, `.kp-confirm__list`) under a heading with the exact count.' },
            { name: 'data-kp-confirm-blocked', what: 'The removal may not go ahead: the confirmation says this sentence (empty: the dictionary’s) and offers only Close.' },
            { name: 'data-kp-confirm-type', what: 'Confirm turns on only once this name is typed: the typed confirmation (its own page), with what will be lost, the rule and a line that says whether it matches; Enter in the field confirms. A blocked removal shows no field.' },
            { name: ':hover / :active', what: 'Both are derived colours; on a theme that lifts its controls the button also rises, and by nothing at all where the theme answers zero.' },
            { name: ':disabled', what: 'A dimmed ground and a refusing cursor. DI8 records the decision that a disabled control may fall below the contrast floor.' },
            {
                name: 'armed',
                what: 'A confirming button between its first and second click, in the `inline` variant only. The module writes the state, the label changes, and a timeout disarms it. The default variant opens a dialog instead and writes nothing on the button.',
            },
            { name: 'pastel', what: 'In pastel a button is a sticker with a flat peel straight under it: the pointer lifts it 2 px and curls its top-end corner into a fold, a press sticks it down flat, and focus is the dashed ring line alone, 3 px out, with no inner line. On a destructive, info or primary plate the dashed line takes the plate’s ink, where the ring colour would read 1.34, 2.92 and 1.40:1. A button in a header, a menu, a tile, an alert or the alarm is this button.' },
        ],
        accessibility: [
            'Built in — a destructive action with no way back is disarmed rather than left to fire, which is SC 3.3.4 turned into something a review cannot forget.',
            'Built in — the confirmation label, the undo label and the announcement all come from the dictionary, so they can be replaced in one place.',
            'Built in — the disabled look is not carried by colour alone: the cursor changes and the button refuses the click.',
            'Yours — use a real button element. The class paints; it does not make a div focusable or operable by Enter.',
            'Yours — a button with only an icon in it needs a name of its own.',
            'Yours — say what happens in the label. “Delete application” survives being read out of context; “OK” does not.',
        ],
    };
