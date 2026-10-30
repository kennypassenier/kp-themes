// Page descriptor for the "accordion" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const accordionDescriptor = {
        id: 'accordion',
        title: 'Accordion',
        group: 'Navigation',
        classes: ['kp-accordion'],
        exports: ['Accordion'],
        intro: 'Disclosure sections built on the browser’s own details element, so opening, closing and the keyboard come from the platform rather than from a hand-written toggle.',
        whenToUse:
            'For a long page of questions or optional detail the reader dips into. Not for content most readers need — anything folded away is missed and, in some browsers, not found by a search of the page. Not as tabs either: an accordion can have everything open at once, which is often the point.',
        examples: [
            {
                title: 'Two sections, one open',
                why: 'A details element is already keyboard-operable and its state is already announced; the classes only paint. The open attribute is the whole of the open state.',
                markup: `
<div class="kp-accordion">
<details class="kp-accordion__item" open>
<summary class="kp-accordion__summary">What is a theme?</summary>
<div class="kp-accordion__body">A block of tokens on the document, which every component reads.</div>
</details>
<details class="kp-accordion__item">
<summary class="kp-accordion__summary">What is a register?</summary>
<div class="kp-accordion__body">An optional stylesheet that adds a texture without changing the colours.</div>
</details>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-accordion__item', what: 'One section, with a rule under it so a stack of them reads as a list.' },
            { name: '.kp-accordion__summary', what: 'The header. It is the button, in bold, with the browser’s own marker.' },
            { name: '.kp-accordion__body', what: 'The content, in quiet ink, with room under it.' },
            { name: 'open', what: 'The browser’s own state; the React component can also keep one section open at a time.' },
        ],
        accessibility: [
            'Built in — the element is a real disclosure: Enter and Space open it, and its state is announced without a written role.',
            'Yours — write a summary that says what is inside; “more” tells the reader nothing.',
            'Yours — open the section that matters on arrival rather than leaving the page as a row of closed lids.',
            'Yours — do not fold away anything the reader must not miss.',
        ],
    };
