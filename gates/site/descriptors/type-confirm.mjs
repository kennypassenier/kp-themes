// Page descriptor for the "type-confirm" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const typeConfirmDescriptor = {
        id: 'type-confirm',
        title: 'Typed confirmation',
        group: 'Feedback',
        classes: ['kp-type-confirm'],
        aliases: ['matched'],
        exports: [],
        intro: 'A destructive action that turns on only once the reader has typed its name. On a button that already asks for a confirmation, `data-kp-confirm-type="media"` makes the package’s confirmation dialog show what will be lost (`data-kp-confirm-loses`, the id of a template or an element), the field, the rule it is matched by and a line that says whether it matches; Confirm stays disabled until it does, carries the button’s own words (or `data-kp-confirm-label`), and Enter in the field confirms a match. Spaces at the start and the end never count; capitals count unless `data-kp-confirm-case="any"`. In a page’s own dialog or form, `data-kp-type-confirm="media"` with `data-kp-type-confirm-for="<button id>"` builds the same block and holds that button off.',
        whenToUse:
            'For the few actions that delete something that cannot come back and whose name the reader should look at first: wiping a stack, removing a service, deleting a backup set. For an everyday delete the plain confirmation or an undo is enough.',
        examples: [
            {
                title: 'In the confirmation dialog',
                why: 'The button keeps its own handler: the dialog swallows the click, and re-fires it once the name is typed and Confirm is pressed.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Wipe the stack media?" data-kp-confirm-type="media" data-kp-confirm-loses="lost-media">Wipe media…</button>
<template id="lost-media"><ul class="kp-type-confirm__list"><li>3 containers: jellyfin, jellyseerr, tdarr</li><li>/srv/media/config (2.4 GB)</li></ul></template>
`,
            },
            {
                title: 'In a page’s own dialog',
                why: 'The block fills itself and keeps the button it names disabled until the name matches; a button the page disabled itself stays disabled.',
                markup: `
<div data-kp-type-confirm="media" data-kp-type-confirm-for="wipe"></div>
<button type="button" class="kp-button kp-button--destructive" id="wipe">Wipe media</button>
`,
            },
            {
                title: 'Capitals do not count, and the words on Confirm',
                why: '`data-kp-confirm-case="any"` makes capitals not count (spaces at the start and the end never do), and `data-kp-confirm-label` gives the words on Confirm: else it carries the button’s own words without a trailing “…”. `openConfirmation(button, { typeName, anyCase, loses, acceptLabel })` is the same dialog from a script; the dialog gains `.kp-confirm--typed`. Enter in the field confirms a match.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Remove the service jellyfin?" data-kp-confirm-type="Jellyfin" data-kp-confirm-case="any" data-kp-confirm-label="Remove it for good" data-kp-confirm-loses="lost-jellyfin">Remove jellyfin…</button>
<template id="lost-jellyfin"><ul class="kp-type-confirm__list"><li>The container and its image</li><li>The watch history of 3 users</li></ul></template>
`,
            },
        ],
        variants: [
            { name: 'openConfirmation / attachTypeConfirms', what: '`openConfirmation(button, { typeName, anyCase, loses, acceptLabel })` opens the typed dialog from a script; `attachTypeConfirms(root)` fills the page’s own blocks and `buildTypeConfirm` makes one; `typeConfirmMatches` is the rule. `TYPE_CONFIRM` is the selector and `TYPE_CONFIRM_EVENT` (`kp-type-confirm`) the event a block fires when the match changes.' },
            { name: '.kp-type-confirm parts', what: 'The block’s parts: `__loses` with `__loses-title` and `__list`, `__label`, `__name`, `__input`, `__rule`, `__status` and `__match`; the dialog it stands in is `.kp-confirm--typed`.' },
            { name: 'data-kp-confirm-type', what: 'On a button with `data-kp-confirm`: the name the reader types before Confirm turns on.' },
            { name: 'data-kp-confirm-case', what: '`any`: capitals do not count. Spaces at the start and the end never do.' },
            { name: 'data-kp-confirm-loses', what: 'The id of a `<template>` or an element whose content says what will be lost; shown above the field.' },
            { name: 'data-kp-confirm-label', what: 'The words on Confirm; else the button’s own words without a trailing “…”.' },
            { name: 'data-kp-type-confirm', what: 'A block a page puts in its own dialog or form: the name to type.' },
            { name: 'data-kp-type-confirm-for', what: 'The id of the button the block holds off until the name matches.' },
            { name: 'data-kp-type-confirm-case', what: '`any`: capitals do not count.' },
            { name: 'data-kp-type-confirm-loses', what: 'The id of a template or an element with what will be lost.' },
            { name: 'data-kp-type-confirm-attached', what: 'Set by the script once the block is filled.' },
            { name: 'data-kp-matched', what: 'Set by the script on the block: `true` while what is typed matches the name.' },
        ],
        accessibility: [
            'Built in — the field is labelled by the sentence with the name in it and described by the rule and the match line; the match line is a polite live region; the field has the focus when the dialog opens.',
            'Built in — Confirm is disabled until the name matches, so neither a click nor Enter can act before; a match is a word on the success plate as well as a colour.',
            'Yours — list what will be lost in plain words, keep the name the one the reader knows it by, and keep the action rare: a typed name asked every day is typed without reading.',
        ],
    };
