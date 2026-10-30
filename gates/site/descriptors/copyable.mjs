// Page descriptor for the "copyable" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const copyableDescriptor = {
        id: 'copyable',
        title: 'Copyable value',
        group: 'Data',
        classes: ['kp-copyable'],
        exports: ['Copyable'],
        aliases: ['copy', 'copied'],
        intro: 'A value in the mono face with a button beside it that copies it and then says so, in words on the button, for as long as the confirmation lasts. When the clipboard refuses, that is said too.',
        whenToUse:
            'For a value someone has to paste somewhere else — a token, an identifier, a command. Not for prose, which is selected and copied the ordinary way. Not for a secret you would rather nobody copied by accident: the button makes it one click.',
        examples: [
            {
                title: 'A token with a copy button',
                why: 'The confirmation is words on the button rather than a green flash, because a flash is invisible to a screen reader and to anyone who looked away.',
                markup: `
<span class="kp-copyable">
<span class="kp-copyable__value" id="doc-copy-token">a3f9-2b71</span>
<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="doc-copy-token">Copy</button>
</span>
`,
            },
            {
                title: 'Copying a value that is not on screen',
                why: 'The button can carry the text itself, for a value that is shortened on screen or not shown at all.',
                markup: `
<span class="kp-copyable">
<span class="kp-copyable__value">https://example.test/i/a3f9…</span>
<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy data-kp-copy-value="https://example.test/invite/a3f9-2b71-0c4d" aria-label="Copy the invitation link">Copy</button>
</span>
`,
            },
        ],
        variants: [
            { name: '.kp-copyable__value', what: 'The value, in the mono face, so an identifier can be read character by character.' },
            { name: 'copied', what: 'The button wears the success colour and says it copied, then goes back by itself.' },
            { name: 'refused', what: 'When the clipboard is unavailable the button says so instead of silently doing nothing.' },
            { name: 'with a toast', what: 'The confirmation can be a toast as well as the button’s own label, for a copy that happens far from where the reader is looking.' },
            { name: 'the Copy button and kv', what: 'The Copy button never wraps or shrinks; inside `.kp-kv` the copyable fills its value cell with Copy at the cell’s end.' },
        ],
        accessibility: [
            'Built in — the confirmation is a change of text, and the button announces itself when its own label changes.',
            'Built in — a refusal is reported rather than swallowed; a copy button that does nothing looks broken.',
            'Built in — both outcomes are events, so a consumer can log or count them.',
            'Yours — name the button after what it copies when the value is long or shortened on screen.',
            'Yours — do not put a copy button on something that has to stay secret.',
        ],
    };
