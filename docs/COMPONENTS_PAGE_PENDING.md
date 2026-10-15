# What the components page still has to show

The site's component pages (`site/components/*.html`, every component with its
code examples) are brought up to date in one pass, on Kenny's go, once every
open review is approved (Kenny, 2026-10-13: "nadat alles approved is, vraag je
aan mij of je onze pagina waar al onze componenten staan (met codevoorbeelden)
mag updaten met alles wat nieuws is en alle nieuwe opties").

Every session that adds or changes a component, an option, an attribute or a
token adds a line here in the same commit. The pass works down the list, gives
each line its example and its option row, and empties the list.

## Waiting

(The pass of 2026-10-15 brought the last three lines onto their pages: the date
picker's `data-kp-date-format`, the key-figure label wrap, the side navigation's
`data-kp-sidenav-opener`. The pass of 2026-10-14 brought every line before them.)

- `--kp-menu-anchor-x`, written by `js/menu-button.js` on the open menu of a menu button (the button's centre, in px from the menu's left edge,
  kept 14 px inside it; not written when the menu hangs above its button). Written for every theme, read only by deco, whose inlay starts under the
  button. Belongs on the menu button page next to the knobs (2026-10-15, research/leftover-looks).
- `.kp-segmented` (new component, js/segmented.js, kpadopt-controls): `data-kp-segmented="single|multi"`, `data-kp-segmented-all`, `data-kp-segmented-collapse="false"`, `.kp-segmented--chips`, `.kp-segmented--block`, parts `__item`, `__label`, `__count`; written by the script `data-kp-segmented-thumb`, `-glide`, `-overflow` and `--kp-seg-x`, `--kp-seg-w`; states disabled, `aria-disabled`, `aria-busy`; event `kp-segmented-change`; functions `attachSegmented`, `getSegmentedValues`, `setSegmentedValues`, `resetSegmented`, `setSegmentedCounts`, `setSegmentedItems`; tokens `--kp-seg-radius`, `-pad`, `-gap`, `-font`, `-size`, `-tracking`, `-case`, `-weight`, `-track`, `-edge`, `-ink`, `-ink-hover`, `-hover`, `-thumb`, `-thumb-ink`, `-thumb-edge`, `-thumb-lift`, `-duration`, `-ease`, `-label-max`, `-item-pad-block`, `-item-pad-inline`, `-count-radius`; chips `--kp-chip-gap`, `-height`, `-pad-inline`, `-edge`, `-radius`, `-ground`, `-ink`, `-hover`, `-on`, `-on-ink`, `-on-edge`. Needs its own page with a single, a multi, a chips and a loading example.
- `.kp-toolbar` (new component, js/toolbar.js, kpadopt-controls): `data-kp-toolbar`, `data-kp-toolbar-key`, `data-kp-toolbar-reserve`, `.kp-toolbar--stacked`, parts `__search`, `__input`, `__key`, `__filters`, `__group`, `__label`, `__state`, `__active`, `__active-label`, `__active-list`; `data-kp-toolbar-clear` on the Clear all button; events `kp-toolbar-remove` `{ id, label }` and `kp-toolbar-clear`; functions `attachToolbars`, `setToolbarActive(toolbar, filters, { clearAll, removeGlyph })`, `toolbarSearch`; strings `toolbarShowingOnly`, `toolbarClearAll`; tokens `--kp-toolbar-search-min`, `-search-max`, `-gap-block`, `-gap-inline`, `-group-gap`, `-key-room`, `-active-height`.
- `.kp-keys` and `kbd.kp-kbd` (new components, js/keys.js, kpadopt-controls): `.kp-keys--end`, parts `__item`, `__caps`; `data-kp-key="mod"` on a cap; functions `setKeys(el, pairs)`, `attachKeys`; string `keysLabel`; tokens `--kp-keys-gap`, `--kp-keys-caps-gap`, `--kp-kbd-pad`, `-edge`, `-foot`, `-radius`, `-ground`, `-ink`.
