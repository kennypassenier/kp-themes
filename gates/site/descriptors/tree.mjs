// Page descriptor for the "tree" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const treeDescriptor = {
        id: 'tree',
        title: 'Tree',
        group: 'Data',
        classes: ['kp-tree'],
        exports: ['Tree'],
        aliases: ['typeahead', 'selectable', 'click'],
        intro: 'A nested list a keyboard can walk: arrows move and open, Home and End jump to the ends, and typing a few letters finds the next matching item. The twisty points the way the branch will go rather than the way it is.',
        whenToUse:
            'For a hierarchy the reader browses — a file list, a category tree, a menu of settings. Not for a flat list of options, which is a listbox and cheaper in every way. Not for navigation that could be links: a tree that replaces a nav takes the middle click and the address bar away.',
        examples: [
            {
                title: 'A tree with one closed branch',
                why: 'A closed branch is skipped by the arrows, because Down should go to the next thing you can see; walking into a folder that is shut is the bug that makes a tree feel broken rather than merely awkward.',
                markup: `
<ul class="kp-tree" role="tree" data-kp-tree aria-label="Project files">
<li role="treeitem" aria-expanded="false">Components
<ul role="group">
<li role="treeitem">button.jsx</li>
<li role="treeitem">card.jsx</li>
</ul>
</li>
<li role="treeitem" aria-expanded="true">Styles
<ul role="group">
<li role="treeitem">components.css</li>
</ul>
</li>
<li role="treeitem">README.md</li>
</ul>
`,
            },
        ],
        variants: [
            { name: 'expanded / collapsed', what: 'The twisty is a second carrier beside the expanded state, and a collapsed branch is out of the walk as well as out of sight.' },
            { name: 'row inset', what: 'Where a row\u2019s text starts at the root level, before the depth adds its indent: a knob (listed in the table of knobs below), 0.375rem by default. A theme with a wider row padding (cyberpunk) sets it, so a row keeps its inset in every theme.' },
            { name: 'selected', what: 'Selection is separate from the highlight: a click can select or toggle, and which one it does is a choice.' },
            { name: 'depth', what: 'The indent per level is a measure the tree sets from its own depth, so a deep branch does not need a class per level.' },
            { name: 'typeahead', what: 'Typing letters jumps to the next item that starts with them; it can be turned off for a tree whose labels are numbers.' },
            { name: 'hover', what: 'A quiet ground on the item under the pointer. It is not selection and nothing depends on it.' },
        ],
        accessibility: [
            'Built in — the whole tree is one tab stop and the arrows move within it, which is the pattern a screen reader expects.',
            'Built in — expanding, collapsing and selecting are events, so a consumer can persist what the reader opened.',
            'Built in — the open state is on the item itself, so it is announced rather than inferred from the twisty.',
            'Yours — write the roles and the nesting. The module drives markup that is already a tree; it does not build one.',
            'Yours — give the tree a name, or a reader who lands in it is told only “tree”.',
            'Yours — keep the labels short. They are read one at a time as the arrows move.',
        ],
    };
