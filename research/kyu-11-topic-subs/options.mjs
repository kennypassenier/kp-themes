// The runtime settings of this demo, one entry per control group. `state` groups only put the component in a state;
// `option` groups are real settings of a package component: each is also a choice set in the review dialog that asks only
// for the default (DEMO_RULES ch. 2 and 7). build.mjs writes both from here, so the buttons and the choices cannot drift.

/** @typedef {{ value: string, label: string, hint?: string }} Value */
/** @typedef {{ id: string, kind: 'state' | 'option', label: string, default: string, values: Value[], latent?: boolean }} Group */

/** @type {Record<string, Group[]>} */
export const GROUPS = {
    header: [
        {
            id: 'hd-state',
            kind: 'state',
            label: 'Header',
            default: 'filled',
            values: [
                { value: 'filled', label: 'Filled' },
                { value: 'quiet', label: 'Quiet topic' },
                { value: 'loading', label: 'Loading' },
            ],
        },
        {
            id: 'hd-mark',
            kind: 'option',
            label: 'Topic mark',
            default: 'letters',
            values: [
                { value: 'letters', label: 'Letters', hint: 'Two letters on a plate in one of the theme colours, the same on every page.' },
                { value: 'pattern', label: 'Pattern', hint: 'A 5 by 5 pattern made from the name, for telling two topics apart without reading.' },
                { value: 'glyph', label: 'Glyph', hint: 'Letters plus a small corner shape (circle, square, triangle or diamond) chosen from the name.' },
            ],
        },
        {
            id: 'hd-lede',
            kind: 'option',
            label: 'Sentence under the title',
            default: 'full',
            values: [
                { value: 'full', label: 'Whole', hint: 'The whole explanation stays open under the title.' },
                { value: 'folded', label: 'Folded after the first sentence', hint: 'Only the first sentences show, the rest sits behind More.' },
            ],
        },
    ],
    send: [
        {
            id: 'sd-state',
            kind: 'state',
            label: 'Section',
            default: 'ready',
            values: [
                { value: 'ready', label: 'Filled' },
                { value: 'loading', label: 'Loading' },
                { value: 'error', label: 'Failed' },
            ],
        },
        {
            id: 'sd-token',
            kind: 'state',
            label: 'Token',
            default: 'hidden',
            values: [
                { value: 'hidden', label: 'Hidden' },
                { value: 'reading', label: 'Being read' },
                { value: 'failed', label: 'Cannot be read' },
                { value: 'locked', label: 'Locked' },
            ],
        },
        {
            id: 'sd-ttl',
            kind: 'option',
            label: 'Reveal shows for',
            default: '10',
            values: [
                { value: '10', label: '10 s', hint: 'Short: a shoulder-surfer has little time, one more press if you were slow.' },
                { value: '30', label: '30 s', hint: 'Long enough to read it aloud or type it on another machine.' },
                { value: '0', label: 'Until hidden', hint: 'Stays until you press Hide. No countdown.' },
            ],
        },
        {
            id: 'sd-by',
            kind: 'option',
            label: 'Reveal works by',
            default: 'click',
            values: [
                { value: 'click', label: 'Click', hint: 'One press shows the command, the countdown hides it again.' },
                { value: 'hold', label: 'Holding', hint: 'Shown only while the button is held down (pointer, or Space and Enter held).' },
            ],
        },
    ],
    bootstrap: [
        {
            id: 'bs-state',
            kind: 'state',
            label: 'Warning',
            default: 'ready',
            values: [
                { value: 'ready', label: 'Shown' },
                { value: 'loading', label: 'Loading' },
                { value: 'error', label: 'Failed' },
                { value: 'empty', label: 'A reader exists' },
            ],
        },
    ],
    subs: [
        {
            id: 'sb-state',
            kind: 'state',
            label: 'Table',
            default: 'ready',
            values: [
                { value: 'ready', label: 'Filled' },
                { value: 'loading', label: 'Loading' },
                { value: 'empty', label: 'Empty' },
                { value: 'error', label: 'Failed' },
            ],
        },
        {
            id: 'sb-density',
            kind: 'option',
            label: 'Rows',
            default: 'compact',
            values: [
                { value: 'compact', label: 'Compact', hint: 'Tighter rows: more subscriptions without scrolling, and the table fits a narrower page.' },
                { value: 'comfortable', label: 'Comfortable', hint: 'Roomy rows, easy to hit on a touch screen.' },
            ],
        },
        {
            id: 'sb-look',
            kind: 'option',
            label: 'Filter look',
            default: 'track',
            values: [
                { value: 'track', label: 'Track', hint: 'One track with a plate under what is on; sits tight above the table.' },
                { value: 'chips', label: 'Chips', hint: 'Separate pills; reads as a set of toggles and wraps well on a phone.' },
            ],
        },
        {
            id: 'sb-mode',
            kind: 'option',
            label: 'Filter picks',
            default: 'multi',
            values: [
                { value: 'multi', label: 'Several at once', hint: 'A plain click turns a state on or off: active plus flagged together. None on means All.' },
                { value: 'single', label: 'One at a time', hint: 'Like a radio group: exactly one state is chosen.' },
            ],
        },
    ],
    rowmenu: [
        {
            id: 'rm-menu',
            kind: 'state',
            label: 'Menu',
            default: 'closed',
            values: [
                { value: 'closed', label: 'Closed' },
                { value: 'open', label: 'Open' },
            ],
        },
        {
            id: 'rm-content',
            kind: 'state',
            label: 'Entries',
            default: 'filled',
            values: [
                { value: 'filled', label: 'Filled' },
                { value: 'loading', label: 'Loading' },
                { value: 'empty', label: 'Nothing to offer' },
            ],
        },
    ],
    archive: [
        {
            id: 'ar-clock',
            kind: 'option',
            label: 'Clock',
            default: 'ring',
            values: [
                { value: 'ring', label: 'Ring', hint: 'A ring that empties around the Undo button.' },
                { value: 'bar', label: 'Rule', hint: 'A rule along the foot of the toast that runs out.' },
                { value: 'text', label: 'Seconds in words', hint: 'The seconds left, in words, on the toast.' },
                { value: 'none', label: 'None', hint: 'No clock at all; Undo just stays until the window closes.' },
            ],
        },
        {
            id: 'ar-ms',
            kind: 'option',
            label: 'Undo is offered for',
            default: '6000',
            values: [
                { value: '3000', label: '3 s', hint: 'Quick; for a list you are tidying fast.' },
                { value: '6000', label: '6 s', hint: 'The package default.' },
                { value: '10000', label: '10 s', hint: 'More time to notice a slip.' },
            ],
        },
        {
            id: 'ar-mode',
            kind: 'option',
            label: 'The archive happens',
            default: 'defer',
            values: [
                { value: 'defer', label: 'After the window', hint: 'Held back: nothing reaches the server until the window closes; Undo only puts the row back.' },
                { value: 'revert', label: 'At once, Undo reverses', hint: 'Done at once; Undo calls the reverse on the server.' },
            ],
        },
        {
            id: 'ar-server',
            kind: 'state',
            label: 'Server',
            default: 'accept',
            latent: true,
            values: [
                { value: 'accept', label: 'Accepts' },
                { value: 'refuse', label: 'Refuses' },
            ],
        },
    ],
    delete: [
        {
            id: 'dl-case',
            kind: 'option',
            label: 'Typed name',
            default: 'exact',
            values: [
                { value: 'exact', label: 'Capitals must match', hint: 'The name has to be typed exactly as written.' },
                { value: 'any', label: 'Any capitals', hint: 'ARCHIVE counts as archive; for names where case means nothing.' },
            ],
        },
        {
            id: 'dl-server',
            kind: 'state',
            label: 'Server',
            default: 'accept',
            latent: true,
            values: [
                { value: 'accept', label: 'Accepts' },
                { value: 'refuse', label: 'Refuses' },
            ],
        },
        {
            id: 'dl-dialog',
            kind: 'state',
            label: 'As a dialog',
            default: 'hidden',
            values: [
                { value: 'hidden', label: 'Not shown' },
                { value: 'shown', label: 'Shown' },
            ],
        },
    ],
};

/** The controls markup of one section. @param {string} section */
export function controlsHtml(section) {
    return GROUPS[section]
        .map((g) => {
            const buttons = g.values
                .map(
                    (v) =>
                        `<button type="button" class="kp-button kp-button--sm" data-ks-opt="${g.id}" data-value="${v.value}" aria-pressed="${v.value === g.default}">${v.label}</button>`,
                )
                .join('\n                        ');
            return `                    <div role="group" aria-label="${g.label}"${g.latent ? ' data-review-latent' : ''}>
                        <b>${g.label}:</b>
                        ${buttons}
                    </div>`;
        })
        .join('\n');
}

/** The dialog's choice sets of one section (options only). @param {string} section */
export function choicesJson(section) {
    return JSON.stringify(
        GROUPS[section]
            .filter((g) => g.kind === 'option')
            .map((g) => ({
                id: g.id,
                label: g.label,
                default: g.default,
                options: g.values.map((v) => ({ value: v.value, label: v.label, ...(v.hint ? { hint: v.hint } : {}) })),
            })),
    ).replace(/'/g, '&#39;');
}
