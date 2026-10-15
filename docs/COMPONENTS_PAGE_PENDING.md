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
