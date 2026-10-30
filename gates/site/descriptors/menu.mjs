// Page descriptor for the "menu" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const menuDescriptor = {
        id: 'menu',
        title: 'Dropdown menu',
        group: 'Navigation',
        classes: ['kp-menu', 'kp-popover'],
        exports: ['DropdownMenu'],
        intro: 'A list of actions on the popover layer, anchored under the control that opens it. The browser gives it light dismiss, Escape and focus return; the package gives it the looks and the anchor.',
        whenToUse:
            'For actions that belong to one thing and would crowd the row they sit in. Not for navigation, which reads better as links; not for a choice that changes a value, which is a select or a listbox; and not for more than a handful of entries, where a command palette or a page is kinder.',
        examples: [
            {
                title: 'A menu with a destructive entry',
                why: 'Anchor positioning puts the list under its button without either of them measuring the other, and the popover is the browser’s, so Escape and clicking away are free.',
                markup: `
<button type="button" class="kp-button" popovertarget="doc-menu" style="anchor-name: --doc-menu">Actions</button>
<div popover="auto" id="doc-menu" class="kp-popover" style="position-anchor: --doc-menu">
<ul class="kp-menu">
<li><button type="button" class="kp-menu__item">Edit</button></li>
<li><button type="button" class="kp-menu__item">Duplicate</button></li>
<li><hr class="kp-menu__separator" /></li>
<li><button type="button" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
</ul>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-popover', what: 'The floating surface: its own ground, a boundary, a maximum height it scrolls inside, and a position taken from its anchor.' },
            { name: '.kp-menu', what: 'The column of entries. It never wraps into a second column, whatever height it is given.' },
            { name: '.kp-menu__item', what: 'One entry: a real button that fills the row and wears no button chrome.' },
            { name: '.kp-menu__item--destructive', what: 'An entry in the destructive colour. It still needs a confirmation or an undo behind it.' },
            { name: '.kp-menu__separator', what: 'A rule between groups of entries.' },
            { name: 'hover', what: 'A wash of the page’s ink rather than the accent colour, so a highlighted row is quiet in every theme.' },
            { name: 'pastel', what: 'In pastel a popover or a menu has its pass on its own ::backdrop (no dim), placed on it by anchor positioning, and lands on it from its top-start corner in one landing (560 ms); it closes as that backwards. An entry under the pointer peels its top-end corner into a fold, a press sticks it flat, and focus is the dashed line alone. The theme menu is this menu.' },
        ],
        accessibility: [
            'Built in — light dismiss, Escape and focus return are the browser’s, because a hand-written focus trap is how focus traps break.',
            'Built in — the list scrolls inside the popover instead of running off the bottom of the window.',
            'Yours — make every entry a real button or link; a div with a click handler is not reachable.',
            'Yours — name the trigger, and say when it opens a menu rather than acting.',
            'Yours — put a destructive entry behind the same confirmation you would give a destructive button.',
        ],
    };
