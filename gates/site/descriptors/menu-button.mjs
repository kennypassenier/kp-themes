// Page descriptor for the "menu-button" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const menuButtonDescriptor = {
        id: 'menu-button',
        title: 'Menu button',
        group: 'Navigation',
        classes: ['kp-menu-button'],
        exports: [],
        aliases: ['menu-open', 'menu-close', 'menu-select', 'menu-empty', 'value', 'reason', 'loading'],
        intro: 'A button that opens every other action of a page or a thing, grouped under small muted capitals, each entry its label over a one-line hint. It is the package’s `.kp-menu` with `.kp-menu__item` entries, made rich (`.kp-menu--rich`) and wired by js/menu-button.js: the keys of a menu, a fill that waits while the menu is open, and an action that cannot be used now that stays in the list and says why.',
        whenToUse:
            'For the rare actions on a page or a record, behind a “More ▾” at the end of its header, when each needs a word of explanation. Not for the one or two actions used every day, which are buttons; not for navigation, which reads better as links; and not for a plain list of short commands, which the dropdown menu does with less.',
        examples: [
            {
                title: 'More ▾ with groups, hints and an action that cannot be used now',
                why: 'The entries are markup here; `setMenu(wrapper, groups)` writes the same from a script, and a live page refills it the same way. ↓ on the button opens it on the first entry; the grey entry takes the focus, keeps its hint and says why under it, and Enter does nothing there.',
                markup: `
<div class="kp-menu-button" data-kp-menu-button data-kp-key="doc-pump-more">
<button type="button" class="kp-button">More ▾</button>
<div class="kp-menu kp-menu--rich" role="menu" aria-label="Every other action on this pump house" hidden>
<div class="kp-menu__group" role="group" aria-labelledby="doc-mb-g1">
<p class="kp-menu__heading" id="doc-mb-g1" role="presentation">Run</p>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-labelledby="doc-mb-l1" aria-describedby="doc-mb-h1" data-kp-value="restart"><span class="kp-menu__label" id="doc-mb-l1">Restart the pumps</span><span class="kp-menu__hint" id="doc-mb-h1">Stop and start both pumps, one after the other</span></button>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-disabled="true" aria-labelledby="doc-mb-l2" aria-describedby="doc-mb-h2 doc-mb-r2" data-kp-value="test"><span class="kp-menu__label" id="doc-mb-l2">Run a pressure test</span><span class="kp-menu__hint" id="doc-mb-h2">Close the ring main valve and measure for ten minutes</span><span class="kp-menu__hint kp-menu__reason" id="doc-mb-r2">Not while a field engineer is on site</span></button>
</div>
<div class="kp-menu__group" role="group" aria-labelledby="doc-mb-g2">
<p class="kp-menu__heading" id="doc-mb-g2" role="presentation">Records</p>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-labelledby="doc-mb-l3" aria-describedby="doc-mb-h3" data-kp-value="print"><span class="kp-menu__label" id="doc-mb-l3">Print the site sheet</span><span class="kp-menu__hint" id="doc-mb-h3">One page with the pumps, the valves and the contacts</span></button>
<button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive" tabindex="-1" aria-labelledby="doc-mb-l4" aria-describedby="doc-mb-h4" data-kp-value="archive"><span class="kp-menu__label" id="doc-mb-l4">Archive this pump house…</span><span class="kp-menu__hint" id="doc-mb-h4">Take it off the network; its readings are kept</span></button>
</div>
</div>
</div>
`,
            },
            {
                title: 'A menu that is still loading',
                why: 'This is what `setMenu(wrapper, "loading")` writes: one disabled entry at the final row height and `aria-busy` on the menu, so the menu opens at once and fills when the entries arrive. In pastel the waiting menu becomes caterpillar: a head on its top-end corner and legs along its foot that step in turn.',
                markup: `
<div class="kp-menu-button" data-kp-menu-button>
<button type="button" class="kp-button">Actions ▾</button>
<div class="kp-menu kp-menu--rich" role="menu" aria-label="Actions on this pump house" aria-busy="true" hidden>
<button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-disabled="true" data-kp-loading><span class="kp-menu__label">Loading…</span><span class="kp-menu__hint"> </span></button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '--kp-menu-anchor-x', what: 'Written by `js/menu-button.js` on the open menu: the button’s centre in pixels from the menu’s left edge, kept 14 px inside it, and not written when the menu hangs above its button. Every theme receives it; only deco reads it, to start its inlay under the button.' },
            { name: '.kp-menu-button', what: 'The wrapper, `[data-kp-menu-button]`: a button, then its `[role="menu"]`. The menu hangs under the button at its end edge.' },
            { name: '.kp-menu--rich', what: 'The menu itself, a `.kp-menu`: wide enough for a label over a hint, and past its maximum height it scrolls inside itself.' },
            { name: '.kp-menu__group, __heading', what: 'A group of entries and its heading in small muted capitals, which names the `role="group"`. A menu of one entry, or a nameless group, has no heading.' },
            { name: '.kp-menu__label, __hint', what: 'An entry’s label over its one-line hint; every label and every hint start at one edge.' },
            { name: '.kp-menu__reason', what: 'Under the hint of an entry that cannot be used now (`aria-disabled`), in italics: why. The entry keeps its focus and does nothing.' },
            { name: '.kp-menu__item--destructive', what: 'A destructive entry: its label in the destructive colour.' },
            { name: 'loading', what: '`setMenu(wrapper, "loading")`: one grey entry at the height of a real one, the menu `aria-busy`.' },
            { name: 'empty', what: 'No entries: the button stays, grey, and its title says why; `data-kp-menu-empty="hide"` takes it away instead.' },
            { name: 'in a page header', what: 'In a `.kp-page-header` 40rem wide or narrower, the open menu spans the header’s buttons, inside the screen.' },
            { name: 'a refill while open', what: 'Waits until the menu closes, so a live update never moves an entry under the pointer or the focus; a fill that shows the same is skipped.' },
            { name: 'pastel', what: 'The menu opens and closes as pastel’s popover (the menu page): its pass on its ::backdrop, the landing onto it, the close as the opening backwards. A loading menu becomes caterpillar, a head on its top-end corner and stepping legs along its foot, until its entries arrive.' },
        ],
        accessibility: [
            'Built in — the APG menu button: `aria-haspopup`, `aria-expanded` and `aria-controls` on the button; ↓ or ↑ opens it on the first or last entry; ↓ ↑ wrap, Home and End, and a letter jumps to the next entry that starts with it.',
            'Built in — Esc closes it and puts the focus back on the button, and the page’s own Escape listeners hear nothing; Tab closes it and moves on; a click outside closes it.',
            'Built in — an entry that cannot be used stays focusable with `aria-disabled`, and its hint and reason are its description, so a keyboard reader learns why.',
            'Built in — every word the menu says is in the dictionary (`menuLoading`, `menuEmpty`); `attachMenuButtons(root, { strings })` overrides them.',
            'Yours — name the menu (`aria-label`) and say in the button that it opens one (“More ▾”).',
            'Yours — put a destructive entry behind the same confirmation you would give a destructive button.',
        ],
    };
