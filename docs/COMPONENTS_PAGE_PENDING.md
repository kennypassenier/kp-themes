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

- `toast()` options `pause` (default true: the clock stops while the pointer is on the toast or focus is in it; `data-kp-paused`), `linger` (ms left after both are gone, `TOAST_LINGER_MS` = 2000), `close` (adds a close button) and `sticky` (no clock, with a close button); event `kp-toast-pause` (`TOAST_PAUSE_EVENT`) `{ toast, paused }` on the region; Esc on a focused toast closes it. Belongs on the toast page (research/kpadopt-feedback).
- New component `.kp-steplist` (`__item[data-state=pending|running|done|failed|skipped]`, `__mark`, `__body`, `__title`, `__note`, `__time`, `__state`, `__live`) with `js/steplist.js`: `attachSteplists`, `buildSteplist`, `setStep`, event `kp-steplist-step`, `STEP_ID_ATTRIBUTE` `data-kp-step-id`; knobs `--kp-steplist-mark`, `--kp-steplist-time`, `--kp-steplist-gap`, `--kp-steplist-mark-radius`; glyph tokens `--kp-glyph-done` (falls back to `--kp-glyph-check`), `--kp-glyph-failed`, `--kp-glyph-skipped`; strings `stepPending`, `stepRunning`, `stepDone`, `stepFailed`, `stepSkipped`, `stepAnnounce`. Needs a page of its own next to the progress bar and the timeline (research/kpadopt-feedback).
- `.kp-diff__hunk` and `.kp-diff__hunk-context`: the `@@` header row of a diff hunk. Belongs on the diff section of the data page (research/kpadopt-feedback).
- `--kp-menu-anchor-x`, written by `js/menu-button.js` on the open menu of a menu button (the button's centre, in px from the menu's left edge,
  kept 14 px inside it; not written when the menu hangs above its button). Written for every theme, read only by deco, whose inlay starts under the
  button. Belongs on the menu button page next to the knobs (2026-10-15, research/leftover-looks).
- `.kp-segmented` (new component, js/segmented.js, kpadopt-controls): `data-kp-segmented="single|multi"`, `data-kp-segmented-all`, `data-kp-segmented-collapse="false"`, `.kp-segmented--chips`, `.kp-segmented--block`, parts `__item`, `__label`, `__count`; written by the script `data-kp-segmented-thumb`, `-glide`, `-overflow` and `--kp-seg-x`, `--kp-seg-w`; states disabled, `aria-disabled`, `aria-busy`; event `kp-segmented-change`; functions `attachSegmented`, `getSegmentedValues`, `setSegmentedValues`, `resetSegmented`, `setSegmentedCounts`, `setSegmentedItems`; tokens `--kp-seg-radius`, `-pad`, `-gap`, `-font`, `-size`, `-tracking`, `-case`, `-weight`, `-track`, `-edge`, `-ink`, `-ink-hover`, `-hover`, `-thumb`, `-thumb-ink`, `-thumb-edge`, `-thumb-lift`, `-duration`, `-ease`, `-label-max`, `-item-pad-block`, `-item-pad-inline`, `-count-radius`; chips `--kp-chip-gap`, `-height`, `-pad-inline`, `-edge`, `-radius`, `-ground`, `-ink`, `-hover`, `-on`, `-on-ink`, `-on-edge`. Needs its own page with a single, a multi, a chips and a loading example.
- `.kp-toolbar` (new component, js/toolbar.js, kpadopt-controls): `data-kp-toolbar`, `data-kp-toolbar-key`, `data-kp-toolbar-reserve`, `.kp-toolbar--stacked`, parts `__search`, `__input`, `__key`, `__filters`, `__group`, `__label`, `__state`, `__active`, `__active-label`, `__active-list`; `data-kp-toolbar-clear` on the Clear all button; events `kp-toolbar-remove` `{ id, label }` and `kp-toolbar-clear`; functions `attachToolbars`, `setToolbarActive(toolbar, filters, { clearAll, removeGlyph })`, `toolbarSearch`; strings `toolbarShowingOnly`, `toolbarClearAll`; tokens `--kp-toolbar-search-min`, `-search-max`, `-gap-block`, `-gap-inline`, `-group-gap`, `-key-room`, `-active-height`.
- `.kp-keys` and `kbd.kp-kbd` (new components, js/keys.js, kpadopt-controls): `.kp-keys--end`, parts `__item`, `__caps`; `data-kp-key="mod"` on a cap; functions `setKeys(el, pairs)`, `attachKeys`; string `keysLabel`; tokens `--kp-keys-gap`, `--kp-keys-caps-gap`, `--kp-kbd-pad`, `-edge`, `-foot`, `-radius`, `-ground`, `-ink`.
- `data-kp-nav-fold` (nav), `data-kp-nav-keep` (item), `NavBar fold`, `attachNavFolds()` / `foldNav()` / `planFold()` in `js/nav-fold.js`, event `kp-nav-fold`,
  `--kp-nav-more-dot`, the marks `data-kp-nav-fold-ready`, `data-kp-nav-folding`, `data-kp-nav-folded`, `data-kp-nav-more-current`, `data-kp-nav-more-alert`
  and the dictionary words `navMore`, `navMoreMenu`, `navMoreAlert`, `navMoreUnavailable`. Belongs on the navigation page next to "A bar that collapses"
  (2026-10-15, research/kpadopt-nav).
- `.kp-tabbar` with `__tab`, `__icon`, `__icon--more`, `__label`, `__badge`; modifiers `kp-tabbar--wide`, `--always`, `--static`; `js/tabbar.js`
  (`attachTabbars`, `setTabbarBadge`, `setTabbarCurrent`, `setTabbarBusy`); `--kp-tabbar-height` (written on the root), `--kp-tabbar-tab-height`,
  `--kp-tabbar-icon`, `--kp-tabbar-pad`, `--kp-tabbar-size`, `--kp-tabbar-safe-bottom`, `--kp-tabbar-duration`, `--kp-z-tabbar`. A new component with its own
  catalogue block (listed in `catalogue/coverage.json` until then) (2026-10-15, research/kpadopt-nav).
- `kp-button--live` with `kp-button__spin`, `__short`, `__long`, knob `--kp-live-max`; belongs on the button page (2026-10-15, research/kpadopt-nav).
- `.kp-toasts` and `.kp-to-top` rise by `--kp-tabbar-height`: one sentence on the toast and back-to-top pages (2026-10-15, research/kpadopt-nav).
- Hover card: `attachHoverCards(root, { selector, fill, openDelayMs, closeDelayMs, closeOnEscape, cardClass })` from `js/hovercard.js` (`@kp-soft/themes/js/hovercard`), attribute `data-kp-hovercard="text"` (per anchor also `data-kp-open-delay`, `data-kp-close-delay`, `data-kp-close-on-escape="false"`), event `kp-hovercard` `{ open, card, anchor }` on the anchor, handle `{ card, open(anchor), hide(), refresh(), anchor() }`, the card `.kp-popover.kp-tooltip[data-kp-hovercard-card]`, token `--kp-hovercard-max-width`. Belongs on the tooltip page (2026-10-15, research/kpadopt-tooltip-sort).
- Data table `data-kp-sort-multi="click"` / `multiSort: 'click'`: a plain header click (Enter, Space) adds a sort key, Shift + click sorts on the column alone; the reset button and summary are the existing ones. Belongs on the data table page, multi-sort section (2026-10-15, research/kpadopt-tooltip-sort).
- Data table `data-kp-group-always` on a `tr[data-kp-row-group]` heading: stays visible with no data row under it (loading, failed with a Retry in the heading, empty with the reason). Belongs on the data table page, row groups (2026-10-15, research/kpadopt-tooltip-sort).
