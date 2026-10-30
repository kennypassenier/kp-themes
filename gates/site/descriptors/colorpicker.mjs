// Page descriptor for the "colorpicker" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const colorpickerDescriptor = {
        id: 'colorpicker',
        title: 'Colour picker',
        group: 'Forms',
        classes: ['kp-colorpicker'],
        exports: ['ColorPicker'],
        aliases: ['color', 'swatch', 'against', 'channel', 'follow', 'contrast-ok'],
        intro: 'Three labelled sliders, a swatch, and the number that makes this one different: the WCAG contrast ratio of the chosen colour against the current theme’s own background, measured with the same function the contrast gate uses.',
        whenToUse:
            'Where somebody picks a colour that text or a boundary will later have to survive on — a status colour, a label, a theme of their own. Not as a general colour wheel: three sliders are exact and operable from the keyboard, but they are slower than a canvas for browsing. Not for choosing from a fixed set either; that is a row of swatch buttons.',
        examples: [
            {
                title: 'A picker measured against the page background',
                why: 'The verdict is a sentence in a live region, not a green tick: the colour is the second carrier, never the only one. Sliders rather than a canvas, because a canvas needs a pointer.',
                markup: `
<div class="kp-colorpicker" data-kp-colorpicker data-kp-against="--background">
<label class="kp-field__label" for="doc-color-h">Hue</label>
<input id="doc-color-h" type="range" data-kp-channel="h" min="0" max="360" value="220" />
<label class="kp-field__label" for="doc-color-s">Saturation</label>
<input id="doc-color-s" type="range" data-kp-channel="s" min="0" max="100" value="90" />
<label class="kp-field__label" for="doc-color-l">Lightness</label>
<input id="doc-color-l" type="range" data-kp-channel="l" min="0" max="100" value="56" />
<span class="kp-colorpicker__swatch" data-kp-swatch aria-hidden="true"></span>
<output class="kp-colorpicker__value" data-kp-colorpicker-value></output>
<p class="kp-colorpicker__contrast" data-kp-colorpicker-contrast role="status" aria-live="polite"></p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-colorpicker__channel', what: 'One label and its slider. The wrapper contributes nothing to the box tree, so the three pairs line up as one grid.' },
            { name: '.kp-colorpicker__swatch', what: 'The chosen colour, with a boundary — a pale swatch on a pale card is otherwise an invisible square.' },
            { name: '.kp-colorpicker__value', what: 'The colour in numbers, in the mono face, so it can be read back and copied.' },
            { name: '.kp-colorpicker__contrast', what: 'The verdict. It takes the destructive colour while the ratio fails and the quiet one once it passes.' },
            { name: 'measured against another token', what: 'The comparison surface is declared on the markup: a card, a primary plate, or the page itself.' },
            { name: 'following the theme', what: 'The picker can re-measure when the page’s theme changes, so the same colour is judged again against the new background.' },
        ],
        accessibility: [
            'Built in — three range inputs are operable from the keyboard, announced with their values, and give exact numbers back; a canvas gradient does none of that.',
            'Built in — the verdict is words in a live region, so it reaches someone who cannot compare the two colours by eye.',
            'Built in — the swatch is marked decorative, because the value beside it is the thing that carries the information.',
            'Yours — label each of the three sliders. They are hue, saturation and lightness only if something says so.',
            'Yours — decide what the ratio has to clear. The picker measures; it does not refuse.',
        ],
    };
