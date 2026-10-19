# audhd-recepten / wheel: "What do we eat?"

Screen demo for the AuDHD recipe app (concept: pillars "no choice stress" and "bad days"). Formal only
(`data-review="audhd-wheel"`). Open `demo.html`; judge in the review dialog.

## Sections (4)
1. **The wheel and its answer**: `js/wheel.js` over 13 Belgian dishes (slice by days since last cooked), the answer card
   (name, facts, why, start time counted back from 18:30), **Yes, cook this**, **Spin again**, and the extra idea
   **Not this one, not again this week** with a Resting list and Bring back.
2. **Filters: want, not, or either way**: three `data-kp-segmented="tri"` chip groups (meal, time, ingredients) with exact
   counts and summaries, a `data-kp-toggle` group as the other way to ask time, Clear all, and the list of dishes that fit.
3. **No energy today**: `kp-switch` plus a `data-kp-toggle` group (safe favourites, freezer portions, no prep) that limit the wheel.
4. **Loading, nothing fits and failed**: `js/card-state.js` (busy card, the package's state plate, failure alert), `js/art.js`.

## Options (data-review-choices, all with a default, all live)
odds (long not eaten / freezer first / equal), spin length, repeat, skip button wording (week / tonight / off), time asked
(tri chips / one limit), what Loosen a filter lets go of (most freed / last pressed), what the switch does (only easy /
easy dishes x4), calm look with the switch (on / off, not remembered), drawing on empty and failed cards.

## My own ideas, and why they help
- **Not this one, not again this week**: refusing a dish is cheap and remembered, so the wheel never offers it again to a
  tired person; resting dishes are visible and reversible (no hidden rules).
- **Loosen a filter** does the thinking: it measures every chip and lets go of the one that frees most dishes, and says which.
- **Backward timing** on Yes: "Start at 17:45 to eat at 18:30", or says plainly that it is already too late (time blindness).
- **No energy today** can also switch calm mode on (movement down), as an option; an "easy" weight mode keeps all dishes.
- Freezer-first odds use up portions before they get old.

## Component gaps
- `js/wheel.js` has no way to name a dish tag on a slice (e.g. a snowflake for freezer) or to mark a slice "rested"; slices
  are label and weight only. The answer card carries those facts instead.
- `js/wheel.js` has no option to show the answer as a component of its own (name, facts, actions); the page builds that card
  from package parts (badges, buttons) around it.
- `js/card-state.js` empty note has no `data-kp-art` or state-plate classes of its own; this page adds `kp-stateplate` classes
  and `data-kp-art` to the built note.
- `js/toggle.js` has no switch look (`kp-switch` is a checkbox, not a toggle group member), so "No energy today" is a kp-switch.
- Two of the checks (check-kit, measure-gaps) expect Firefox at a fixed path; only Chromium was available here.

## Not done
Dark/other themes (formal only by rule). Real recipes, cook mode and persistence belong to the app.
