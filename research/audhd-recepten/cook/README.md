# Cook mode (AuDHD recipe app, screen demo)

Open `demo.html` (review id `audhd-cook`, formal only). Brief: `../BRIEF.md`. Sample dish: Spaghetti with tomato sauce and
meatballs, nine steps, where the pasta and the sauce run at the same time. All data is mock; the timers run fast by default
(1 minute = 3 s) so they can be watched ending, `Timers: Real time` switches to real seconds.

## Sections (5)

| # | Section | Component | What it shows |
| - | --- | --- | --- |
| 1 | Begin: gather everything first | `js/checklist.js` | a Begin card; Begin loads and opens the mise-en-place checklist (3 groups, ticked items sink); Start cooking is off until all ticked, Skip always works |
| 2 | Cook mode: one step at a time | `js/focus-steps.js` + `js/timer.js` | nine steps with needs, step timers (Water, Onion, Sauce, Pasta), the timer list beside it, an attention band when one ends with "Go to step N" |
| 3 | Running timers | `js/timer.js` + `js/attention.js` | Pasta 9 min and Sauce 10 min side by side; sound, voice, ring repeat; the end names itself in the band |
| 4 | Time at a glance | `js/timer-disc.js` | the same Pasta and Sauce as discs that follow the timers; 60-minute dial (default, Kenny) or own length; disabled |
| 5 | On a phone: calm mode and the states | `js/calm.js` + `js/focus-steps.js` | 390 px cook mode, the calm switch, scope and loading options, loading / no steps / failed |

## Options used (all switchable in the dialog, defaults set)

- checklist: `data-kp-checklist-sink` (default sink), Check all / Uncheck all, loading, empty, failed.
- focus-steps (read mode): `data-kp-focus-steps-wake` true (default) / false, Read aloud, `data-kp-focus-steps-timers`,
  `data-kp-focus-steps-empty`, ingredients, timer, note and `noteTone`, loading / empty / error.
- timer list: `data-kp-timers-sound` chime (default) / bell / buzzer / off, `data-kp-timers-speak`, `data-kp-timers-ring`
  60 (default) / 20 / 0, `data-kp-timers-empty`, `startTimer`, `getTimers`, `stopTimer`, the kp-timer-* events.
- timer-disc: `data-kp-timer-disc`, `-name`, `-scale` (60-minute dial), `-disabled`, `timerDiscOf` clock (start, pause, add, reset).
- attention: `setAttention` with an action button per item.
- calm: `data-kp-calm-switch`, `setCalm` scope (motion / effects default / all) and loading (slow default / still).

## My own improvement ideas (each with why it helps)

- Begin opens a checklist, not step 1: the first action is tiny and cannot be wrong (task initiation); "Skip, start anyway" so a
  missing onion never blocks dinner (no coercion).
- An attention band with "Go to step N" when a timer ends: the next action is handed over, nothing has to be remembered
  (working memory, time blindness). Sound, bell, buzzer and a spoken name: for hyperfocus, where a soft sound is missed.
- The discs follow the timers started in the list: time as an amount, seen across the room.
- Calm as one switch with a scope: a low-energy day should not need a settings hunt.
- Demo clock (fast / real) is page wiring only, to make the ends watchable; it starts the same package timers at a shorter length.

## Component gaps (for the kp-themes owner)

1. **focus-steps: parallel tracks (the one Kenny requires).** Exact option wanted:
   - per step `track: { id: 'pasta', name: 'Pasta' }` (steps without a track belong to all);
   - root attribute `data-kp-focus-tracks` (or automatic when any step has a track) that adds a lane strip (`__tracks`) under the head:
     one lane per track with its name, its progress ("step 2 of 4"), and, if `data-kp-focus-steps-timers` names a list, the timer of
     that track (matched by `timer.name` or a `timer.track`) as a small running countdown;
   - the big step shows the active track's current step; one tap on a lane switches the active track; Back and Next walk the active
     track only (`data-kp-track-nav` = `track` | `recipe`);
   - when a track's timer ends, the lane asks for attention (the same `kp-attention` item as today) and offers "Go to Pasta, step 7";
   - events `kp-focus-steps-track` `{ track, index, from }`; `setFocusSteps(el, steps, { start, tracks: [{ id, start }] })`;
   - a step may say `after: { track, step }` or `waitFor: 'Water'` ("add the spaghetti when the water boils") so the lane shows
     "waiting for Water" instead of a step that cannot be done yet.
   Today's best (what the demo shows): the track is named in each step's note, step timers carry the track name, the timer list is
   the lane strip, and the attention band hands over "Go to step N".
2. **focus-steps: read-mode empty and failed states.** They are a small `kp-empty` line and an `kp-alert` in the step's place, with no
   Retry, unlike answer mode's centred plates (`data-kp-focus-mode="answer"`). Wanted: the same `statePlate` (title, text, Retry,
   `kp-focus-steps-retry`) in read mode, filling the step area. Answer mode cannot be used for cook mode because it draws neither
   ingredients nor the step timer.
3. **focus-steps: the screen option is not live.** `data-kp-focus-steps-wake` is read when the view attaches and when the page comes
   back; changing it at runtime does nothing until the next `visibilitychange` (the demo fires one). Wanted: re-read on attribute change.
4. **checklist: failed state without Retry.** `setChecklistState(list, 'error')` writes a message line with no action. Wanted a
   normal-size Retry (`kp-checklist-retry`) in a centred plate at the list's full height.
5. **timer list: no loading or failed state, and the empty plate is not full height.** Restoring saved timers after a reload is a data
   load (`setTimersState(list, 'loading' | 'error')` with the busy card and a Retry). The empty list also keeps an empty cards row above
   the plate, so a list with `min-block-size` needs `grid-template-rows: auto minmax(0, 1fr)` on the page; wanted in the package.
6. **timer-disc: not linked to a timer list.** The demo follows Pasta and Sauce with page code listening to `kp-timer-*`. Wanted
   `data-kp-timer-disc-for="Pasta"` (name or id of a timer in a list) so one disc mirrors one timer (start, pause, +1 min, remove).
7. **timer-disc: options are read once.** Scale and disabled are read when the disc is attached, so a runtime switch needs the disc to
   be built again (the demo does). Wanted: an attribute change re-renders.
8. **timer list: a step timer's id.** The starter of a step timer is `start:<name>`; two recipes' steps named alike collide. Wanted
   `timer.id` in the step data.

## DEMO_RULES chapters

1. Building a demo page: kept (review kit, one section per judged piece, look-at line for formal, grid layout, English content, dd/mm
   style not needed here, no CDN). Not kept: "show every `kp-<component>--<variant>`" is not applicable (no variant gate run).
2. Components: kept (package parts only; every button is a kp-button; no hand-drawn controls). Exceptions: none.
3. States: loading (busy card), empty and failed for the checklist and the cook mode; read-mode failed/empty are not plates and the
   timer list has no loading/failed (gaps 2, 4, 5).
4. Motion and loading: kept (page opens still, nothing moves until pressed; the Calm section shows motion off).
5. Themes: formal only (new demo).
6. Grouping: one demo, five sections, 5 pairs.
7. Dialog: groups at the component with `data-review-controls-for`, at most four per component, choice sets with defaults.
8. Before the Agenda: `measure-gaps` clear (formal, 1280 and 390, Chromium). `check-kit` could not run in Firefox here (not installed).
9. After the answer: not applicable yet.
