# Feedback components the admin dashboard still draws itself

Kenny's rule (2026-10-15): the dashboard draws nothing itself, so what the package lacks is built here first. Three gaps from `docs/admin/KP_THEMES_ADOPTION.md` of the homelab repo (kpa-9, kpa-14, kpa-18, kpa-19, kpa-32, kpa-33). Demo: `demo.html` (all 16 themes, review kit, one section per component).

| Component                                    | What it is for                                                                        | Dashboard source                                                                                            | What the package reused                                                              | Build cost | Recommendation                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------- |
| `toast()` pause, `linger`, `close`, `sticky` | A toast that does not leave under a reader's eye; one that stays until closed         | `admin/web/js/ui.js` `holdToast` (hold on pointer and focus, 2 s linger, close button), `actui.js` `notify` | `toast()` in `js/overlays.js`, `.kp-toast__close`, `attachDismissals`                | small      | Ship. Default `pause: true` is a behaviour change: a toast now waits for the pointer. |
| `.kp-steplist` + `js/steplist.js`            | The steps of a run, each pending / running / done / failed / skipped, live, announced | `ui.js` `checkList` + `.nx-check`                                                                           | `.kp-spinner` (each theme's own), `--kp-glyph-check`, `.kp-sr-only`, `js/strings.js` | medium     | Ship as a new component (below).                                                      |
| `.kp-diff__hunk` (+ `__hunk-context`)        | The `@@ -a,b +c,d @@ context` row that opens a block of changes                       | `app.css` `.diff-hunk`, `editui.js` `diffBlocks`                                                            | `.kp-diff`, `.kp-diff__line`                                                         | small      | Ship.                                                                                 |

## Why the step list is a new component

- `.kp-timeline` is the past: events with a time, never re-stated, no failed or running, no live announcement. Bending it into a run would make `data-state` mean two things.
- `.kp-wizard__steps` is navigation in a form: a person moves `current`, steps are a flex row, the states are done/current only, and it owns focus and validation.
- A run has five states, a spinner on the one in flight, a failure that skips the rest, a duration per step, and must be heard by a screen reader as it changes. That is its own contract. It borrows the spinner and the glyph tokens; the list is an `ol`, the mark is a fixed box (a state change moves nothing), and the status region is separate from the list so a note changing is not read twice.

## API

- Toast: `toast(text, { pause = true, linger = 2000, close = false, sticky = false, ... })`; `data-kp-paused` while held; `kp-toast-pause` `{ toast, paused }` on the region; `TOAST_LINGER_MS`, `TOAST_PAUSE_EVENT`. Esc on a focused toast closes it. Touch does not count as hovering. Backwards compatible: same defaults, same return value.
- Step list: `<ol class="kp-steplist">` of `.kp-steplist__item[data-state]`; `attachSteplists(root)`, `buildSteplist(rows, { label })`, `setStep(list, idOrIndex, { state, title, note, time })`; event `kp-steplist-step` `{ item, id, state, previous }`; knobs `--kp-steplist-mark`, `--kp-steplist-time`, `--kp-steplist-gap`, `--kp-steplist-mark-radius`, `--kp-glyph-done|failed|skipped`; strings `stepPending` ... `stepAnnounce`.
- Diff: `<div class="kp-diff__hunk">@@ -4,7 +4,7 @@ <span class="kp-diff__hunk-context">[site]</span></div>` as a row in `.kp-diff`.

## Open for Kenny to judge in the demo

1. Is "a toast waits when hovered" right as the default for every consumer, or should it be opt-in (`pause: false` by default)?
2. A paused toast looks like a running one. Should it show a cue (a thin rule, a dimmed timer)? Deliberately none yet.
3. The step list in each theme is static character (frame, mark shape, glyphs); state changes have no theme motion beyond the spinner. Should a step finishing play the theme's own settle (as the update-in-place component does)?
4. Skipped is quieter by ink and a dashed ring, not by opacity (the dashboard used opacity .6).
