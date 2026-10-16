# kpadopt-nav: a folding top bar, a bottom tab bar, the running-job button

Three things the homelab dashboard (`admin/web`) still draws by hand because kp-themes 10.1.1 has no component for them
(KP_THEMES_ADOPTION.md kpa-33). Built into the package first, so the dashboard can draw nothing itself.

Demo: `research/kpadopt-nav/demo.html` (review kit, 16 themes, four sections). Regenerate with
`node research/kpadopt-nav/build.mjs`. Mock in the demo: the frames, the slider, the page behind the phones, the
buttons that play a state. The package's own: everything inside the frames.

| Name                    | What it is for                                                                       | Reference                                                                                                                             | What the package reuses                                                                                                                               | Build cost | Recommendation                                     |
| ----------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------- |
| Folding bar (priority+) | Links that do not fit leave the bar for a More menu, in a bar that must stay one row | <https://css-tricks.com/container-adapting-tabs-with-more-button/>                                                                    | `.kp-nav`, `.kp-nav__link` (every register dresses it), `js/menu-button.js` for the menu (APG keys, placement), `ResizeObserver`, the 40rem container | medium     | Build as `data-kp-nav-fold`, as done               |
| Bottom tab bar          | The frequent areas within thumb reach on a phone, a count, a More entry              | <https://m3.material.io/components/navigation-bar/overview>, <https://developer.apple.com/design/human-interface-guidelines/tab-bars> | `.kp-badge`, `.kp-spinner`, `data-kp-dialog` + `dialog.kp-drawer` for More, `aria-current`, the registers' tokens (`--fx-*`, `--primary`)             | medium     | Build as `.kp-tabbar`, as done                     |
| Running-job button      | A live job as one button in the bar: spinner, short/long label, cut when long        | the dashboard's `.nx-pill` (`chrome.js mountRunningPill`)                                                                             | `.kp-button` in every variant, `.kp-spinner`, the nav wrapper's container                                                                             | small      | A modifier, `kp-button--live`, not a new component |
| Safe-area insets        | Keep the bar clear of a home indicator and a landscape notch                         | <https://developer.mozilla.org/en-US/docs/Web/CSS/env>                                                                                | `env(safe-area-inset-*)`, a `--kp-tabbar-safe-bottom` knob to simulate it                                                                             | small      | Built in                                           |

## What was built

**1. The folding bar.** `data-kp-nav-fold` on a `.kp-nav` (`js/nav-fold.js`, loaded by `js/auto.js`; `fold` prop on the React
`NavBar`). The list is `flex: 1 1 0` and does not wrap, so what it holds never changes its width and the bar never
changes height: before the script runs the overflow is clipped instead of wrapped, after it the items that do not fit are
`data-kp-nav-folded` (out of the flow, `visibility: hidden`, so out of the tab order and the accessibility tree, but still
laid out at their natural width so the next fit can measure them). The More item is the package's menu button, its button
a `kp-nav__link`, its menu a `kp-menu--rich`; a pick clicks the real link, so a router still hears it. Decided inside a
`ResizeObserver` callback (before paint), from natural widths, so there is nothing to oscillate. The bar's phone toggle
wins below 40rem. The current page behind More marks the button (`aria-current="true"`); a counter behind it shows a dot.

**2. The bottom tab bar.** `nav.kp-tabbar`, tabs of an icon over a label, a count at the icon's corner (a dot when empty,
gone when `hidden`, never moving the tab), a More tab that opens the package's drawer through `data-kp-dialog`. Fixed to
the bottom, safe-area aware, 3rem tall tabs. Shown below 40rem; `kp-tabbar--wide` below 60rem (the dashboard's width),
`--always`, `--static`. It publishes `--kp-tabbar-height` on the root, which the body, `scroll-padding`, the toasts and
back-to-top read. Each of the 16 registers dresses the current tab in its own grammar (see the demo's look-at lines).

**3. The running-job button.** `kp-button--live` on any `.kp-button`. The kp badge and progress pieces do not cover it
(a badge is not a button; a progress bar is not a control in a bar), but the theme's button plus its spinner do: the only
missing pieces were the row, the ellipsis and the short/long swap, which are CSS only.

## Where the dashboard's behaviour is not matched, or goes differently

- The dashboard folds ALL links behind its own toggle as soon as one wraps; this folds only the ones that do not fit.
  That is the request, and it is a behaviour change the dashboard should accept.
- The dashboard's More tab opens a bespoke `dialog.nx-sheet`; this opens the package's `dialog.kp-drawer` (a panel at the end
  edge, not a bottom sheet; decided, question 1 below).
- The tab bar's breakpoint is 40rem (the package's one step) or 60rem with `kp-tabbar--wide`; the dashboard's 60rem is the
  second, as asked for by a class, not a number.
- The dashboard's `nx-count` badge in the tab is the package's `.kp-badge` made small and placed at the icon's corner.

## Open design questions for the demo

1. Decided in round 2 (Kenny, 2026-10-16, after the drawer opened over the whole window with no way back): the phone's More stays
   the package's **side drawer**, and a bottom sheet is not built. Why: every theme's drawer already has its approved character at the
   end edge (research/character-drawer: how it enters and leaves, its edge, its time), so a drawer is the theme's own element; a bottom
   sheet would be a second drawer to draw, move and approve in sixteen themes. What fixed the confusion was the way back, not the
   edge: on a phone the drawer now leaves a dimmed strip of the page (`min(28rem, 100vw - 3.5rem)`, `dialog[data-kp-tabbar-drawer]`),
   shows a visible **×** (the demo's close button had no glyph), closes on Escape, on a press on the strip and on a press on an entry
   (`js/tabbar.js`), and the demo's drawer now sits inside its review section, so the review dialog's Escape no longer closed the
   dialog and left the drawer open. Say so if a sheet from the bar is still wanted.
   Kenny's two reports on round 1 both happened, and their causes are found (docs/CORRECTIONS.md, tabbar-facts-1016): the drawer was
   a plain phone-wide `dialog.kp-drawer` whose close button had no glyph and whose entries did not close it, so a touch screen had no
   way back (fixed above); and the review dialog dropped the row of a pair marked not approved ("option 2", the bottom tab bar) from its
   list when the page was reopened in the same round (`show()` in research/_review/review.js listed only open pairs; fixed, a rejected
   pair stays listed until a round reopens it). Counts show every digit: `setTabbarBadge` has no cap.
2. Should the folded entry for a link with a counter read “Needs you · 3”, or show the count as a badge on the entry?
3. Should More be kept visible at all widths (greyed when empty) rather than appearing and disappearing? It is out of the
   flow when idle, so nothing moves either way.
4. A resting tab's label uses the muted ink. In some themes that is under 4.5:1 on the bar (it reads as the nav links do);
   say if a theme should lift it.
5. The current-tab marks are one gesture per theme (rule, pill, plate, slab, lamp, baseline…). Anything that reads as another theme's?

## Not shown, and why

Hover and press are the themes' own and live in the demo (hover and press the tabs); no static state can force them without
a class the package does not ship. The fixed (real) bar is shown in the iframes of the last section, because a fixed bar and a
media query answer to a window, not to a frame. The loading state of the folding bar does not exist (it has no data of its
own); the More menu shows the menu button's loading entry when a page fills it so.

## Recommendation

Accept all three as built. The tab bar is the one that needs an eye: the current-tab mark is where themes can drift into each
other, so it is judged theme by theme in the dialog.
