# research/focus-tracks-1019: cook mode with parallel tracks

Round `focustracks-<uuid>` (see `demo.html`, 2026-10-19): 6 sections, 6 pairs (formal only; the lanes use the theme's own buttons, bar and
plates). Kenny, AuDHD recipes: "ondersteuning om verschillende stappen gelijktijdig te doen, bv de pasta koken terwijl we met de saus bezig
zijn" (gaps 7, 26, 31, 33 of audhd-recepten). It changes an approved component (research/audhd-recepten/cook), so it comes back through the
review dialog with a "What changed" text. See CHANGELOG.md "Unreleased".

**The composition** (js/focus-steps.js, css/components.css "Parallel tracks"): a grid of two columns, the step of the active track on 2fr and
the tracks on 1fr, rows band / head / step (the one flexible row) / buttons, the lanes spanning all rows of the second column. The lanes
share one height; inside each lane the name and the clock, the step's title, the words and the place, and the theme's bar are four rows of one
grid, so the clocks of all lanes stand in one column. On a root narrower than 44rem it is one column and the lanes are short rows under the
head.

1. **tracks**: switching by tap or T, Back/Next per track, the clocks, the options Lanes and Detail.
2. **waiting**: `waitFor` with the time left and the button to the track that can go on; the option When a track waits.
3. **attention**: a timer ends on another track: the band (js/attention.js), the ringing lane; the option The band.
4. **finished**: a track with no step left.
5. **phone**: the lanes as short rows above the step at 390 px.
6. **states**: loading, no steps and failed as full plates (js/state-plate.js) with Retry.

Options (attribute, default): `data-kp-tracks` auto, `data-kp-lanes` auto, `data-kp-lane-detail` full, `data-kp-track-follow` suggest,
`data-kp-track-attention` on, `data-kp-track-shared` "Together". All are read again when changed (js/live-options.js `watchOptions`);
`data-kp-wake` is now live too (audhd gap 28).

Not done: remembering the tracks across a reload (the timers are kept by the timer list's own `getTimers`/`restoreTimers`), backward timing
through gantt lanes (audhd gap 7's last clause), and a linked timer disc (gap 31) which needs its own round.

**Generated** by `node research/focus-tracks-1019/build.mjs` (edit the builder, never the page).
