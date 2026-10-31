// Page descriptor for the "badge" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const badgeDescriptor = {
        id: 'badge',
        title: 'Badge',
        group: 'Feedback',
        classes: ['kp-badge', 'kp-badges'],
        exports: ['Badge'],
        aliases: ['semantic'],
        intro: 'A small pill for a state — a status, a count, a label. It says what it is in text; the colour is the second channel and never the only one.',
        whenToUse:
            'To mark a row or a card with a state the reader scans for. Not as a button: a pill that acts is a button, and painting one as a badge hides that it can be pressed. Not for long text either — a badge that wraps to two lines is a sentence wearing a costume.',
        examples: [
            {
                title: 'A row of statuses',
                why: 'Each badge names its status. The status colours come from the theme’s own scale, so the same seven states look right in all twenty-four themes.',
                markup: `
<span class="kp-badge" data-kp-semantic data-status="draft">draft</span>
<span class="kp-badge" data-kp-semantic data-status="sent">sent</span>
<span class="kp-badge" data-kp-semantic data-status="interview">interview</span>
<span class="kp-badge" data-kp-semantic data-status="offer">offer</span>
<span class="kp-badge" data-kp-semantic data-status="rejected">rejected</span>
`,
            },
            {
                title: 'A count beside a label',
                why: 'Without the semantic marking a badge is just a pill on the quiet surface, which is what a count wants: it is a number, not a state.',
                markup: `
<span>Unread <span class="kp-badge">12</span></span>
`,
            },
            {
                title: 'A run of badges that wraps in columns',
                why: '`.kp-badges` holds several badges in one cell and wraps them when the cell is narrow. It is a grid, not a flex run: its tracks are as wide as the widest badge in them, so a wrapped run stands in columns and no label is ever cut; a badge’s words wrap at spaces, never between letters. Make the window narrow to see the second line line up under the first.',
                markup: `
<div class="kp-stack kp-gap-sm">
<div class="kp-badges" role="list" aria-label="Status of Vitamin D3 25 µg">
<span class="kp-badge" role="listitem">On schedule</span><span class="kp-badge kp-badge--warning" role="listitem">Expires 11/2026</span><span class="kp-badge" role="listitem">Refill on 12/11</span><span class="kp-badge kp-badge--success" role="listitem">60 capsules</span><span class="kp-badge" role="listitem">Taken with breakfast</span>
</div>
<div class="kp-badges" role="list" aria-label="Status of Ibuprofen 400 mg">
<span class="kp-badge kp-badge--warning" role="listitem">Low stock</span><span class="kp-badge" role="listitem">Expires 03/2027</span>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-badge', what: 'The default: the quiet ground and its ink, for counts and neutral labels.' },
            { name: '.kp-badges', what: 'A run of badges in one cell, wrapping as a grid whose columns are as wide as their widest badge (at least a knob’s width), so a wrapped run stands in columns and a label is never cut. A `ul` works too: the list’s marks and room are taken away.' },
            { name: 'semantic', what: 'A badge carrying a status colour. It must say what it means in text; one carrying none is refused by the contract enforcer.' },
            { name: 'with a status', what: 'The status attribute is what a consumer paints from, using the theme’s own status pair for that name.' },
        ],
        accessibility: [
            'Built in — a coloured badge with no words is disarmed and reported, because seven pale plates are one plate to somebody who cannot tell them apart.',
            'Yours — write the state in the badge. A colour with no word is a colour.',
            'Yours — if a badge is a filter, make it a button; if it is a link, make it a link.',
            'Yours — say what the badge belongs to when it stands alone in a row: “12 unread”, not “12”.',
        ],
    };
