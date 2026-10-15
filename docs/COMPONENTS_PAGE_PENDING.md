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
