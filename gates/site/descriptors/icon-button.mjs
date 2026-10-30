// Page descriptor for the "icon-button" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const iconButtonDescriptor = {
        id: 'icon-button',
        title: 'Icon button',
        group: 'Forms',
        classes: ['kp-icon-button'],
        exports: [],
        intro: 'A square, quiet button for a single glyph: the theme menu’s trigger, the close on a dialog, an alert or a toast. It has no ground until it is hovered, and the wash it takes then has no hue of its own, so it stays quiet in every theme.',
        whenToUse:
            'Where the meaning is obvious from the glyph and the row has no room for words — a close, a menu, a sort. Not for the main action of a view: an icon alone is a guess for anyone who does not already know what it means. Not as a decoration either; if there is nothing to press, it is a span.',
        examples: [
            {
                title: 'A close button and a menu trigger',
                why: 'The size is fixed so a row of them lines up, and the glyph inside is capped rather than the button growing around it.',
                markup: `
<button type="button" class="kp-icon-button" aria-label="Close">×</button>
<button type="button" class="kp-icon-button" aria-label="More actions">⋯</button>
`,
            },
        ],
        variants: [
            { name: '.kp-icon-button', what: 'The only look. It has no variants on purpose: a destructive or primary icon button is colour as the only carrier.' },
            { name: ':hover', what: 'A wash of the page’s own ink, so it does not take the accent colour that made a highlighted row turn lavender in one theme and emerald in another.' },
            { name: 'with an svg child', what: 'An inline glyph is sized by the button rather than by its own attributes, so icons from different sets end up the same size.' },
        ],
        accessibility: [
            'Built in — the target is larger than the glyph, which is what keeps it above the 24px minimum of WCAG 2.5.8.',
            'Yours — every one of these needs an accessible name; the glyph is not one.',
            'Yours — mark a decorative glyph as hidden so it is not read out beside the name you gave the button.',
        ],
    };
