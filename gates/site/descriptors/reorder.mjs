// Page descriptor for the "reorder" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const reorderDescriptor = {
        id: 'reorder',
        title: 'Reorder list',
        group: 'Data',
        classes: ['kp-reorder'],
        exports: ['Reorder'],
        aliases: ['item', 'handle', 'label', 'pointer', 'dragging'],
        intro: 'A list whose items can be moved: a real grab handle that moves an item with the arrow keys, and a pointer drag beside it. Every move is announced in words and reported as the new order.',
        whenToUse:
            'When the order is the data — a playlist, a checklist, columns in a report. Not for sorting by a property, which belongs to the table and needs no dragging. Not for a list of two: a pair is better served by a swap.',
        examples: [
            {
                title: 'Three items with a handle each',
                why: 'The handle is a real button, not a decorative grip: it has to be reachable by Tab or the arrow keys have nothing to act on. Dragging is the easy half and the platform gives it away.',
                markup: `
<ul class="kp-reorder" data-kp-reorder aria-label="Report columns">
<li data-kp-item="name"><button type="button" data-kp-handle aria-label="Move Name">⠿</button> Name</li>
<li data-kp-item="amount"><button type="button" data-kp-handle aria-label="Move Amount">⠿</button> Amount</li>
<li data-kp-item="date"><button type="button" data-kp-handle aria-label="Move Date">⠿</button> Date</li>
</ul>
`,
            },
        ],
        variants: [
            { name: 'keyboard move', what: 'With the handle focused the arrows move the item and the list says where it went.' },
            { name: 'pointer drag', what: 'The same move with a pointer, added beside the keyboard rather than instead of it.' },
            { name: 'dragging', what: 'While an item is being moved it is marked, so the stylesheet can lift it out of the row.' },
            { name: 'item label', what: 'The name used in the announcement can be the item’s own text or a label element inside it.' },
        ],
        accessibility: [
            'Built in — the whole gesture exists on the keyboard, which is the half a drag library leaves out.',
            'Built in — each move is announced (“Amount, position two of three”) through the dictionary, so it can be translated.',
            'Built in — the new order is an event, so the consumer stores what the reader arranged.',
            'Yours — name each handle after the item it moves; “drag” repeated six times is not a name.',
            'Yours — give every item a stable identifier, or the order you get back cannot be applied to your data.',
            'Yours — save the order. The list reports the move and forgets it.',
        ],
    };
