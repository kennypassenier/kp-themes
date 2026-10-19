# AuDHD recepten: backward timing (time blindness)

**Decided (2026-10-19 02:38):** Kenny approved every pair (4 of 4 approved; one default changed: the start disc is "A 60-minute dial"). Recorded in `VERDICTS.json`; the page is not offered again.

Demo for the screen "backward timing" of the recipe app (BRIEF.md, CONCEPT.md pillar 4). Formal only
(`data-review="audhd-timing"`, `data-review-themes="formal"`). Open `demo.html`; everything is mock data (the
sample dish is spaghetti with meatballs, three tracks: pasta, sauce, oven) and nothing is saved. A demo clock
starts at 17:22 on 18/10/2026; it is held until a control moves it.

## Sections (4 judged items, 4 pairs)

| Item | What it shows | Components |
| --- | --- | --- |
| `timing-sentence` | "We eat at [18:30], so I start at [17:40]. I cook at a [normal] pace and want [no time] to spare." Live and two-way: typing the start moves dinner. A start in the past gives a calm note with a new dinner time (18:34), never an error | sentence, timefield (inline, presets, step, min/max), card-state, alert |
| `timing-plan` | Lanes per track with the moment each starts under its name ("Start at 18:05"), a diamond at each start, a band at dinner, legend per track; Slow day, dinner time and a clock that runs | gantt (runs, series, points, kinds, zones, legend, lane `sub`, `now`, `strings`), card-state, busy card |
| `timing-disc` | The wait to the start as a disc that shrinks, no ticking numbers; digits are an option; "Last minute" and "Time is up" jump the clock | timer-disc, countdown, card-state |
| `timing-nudge` | One gentle nudge 10 minutes before (info), at the start (warning tone), past the start (new dinner time or leave out the oven track); Not yet with exact moments | attention, snooze, card-state |

Each section: heading plus sentence, Expected block, look-at line, at most four control groups at the component
(`data-review-controls-for`), states Ready, Loading, No step times (prominent plate that explains, with an action),
Failed (alert with Try again). Loading of data areas is the card's busy card; the sentence's start field loads as its own
skeleton in place (an inline control).

## Options (each a choice with a default, applied live)

- sentence: look (underline, boxed), size (lg, md), time list step (5, 15), spare time default (none, 10 min)
- plan: start marks (on, off), bar colour (per track, one colour), band at dinner (on, off)
- disc: digits beside the disc (off, on), what a full disc is (the whole wait, 60-minute dial)
- nudge: first nudge (10 minutes, plus 30 minutes, only at the start), Not yet look (chips, menu)

## My own ideas (why each helps with AuDHD)

- Two-way sentence: "I only get going at 17:50" is a real way to plan; typing the start moves dinner.
- Spare time and a slow-day pace: sensory or low-energy days make hands-on steps longer; the plan stretches only those
  steps and says which steps you may walk away from (the bar's card).
- Lateness is never red: past the start the page says "Nothing is lost" and offers a new dinner time or dropping the oven
  track, no shame, no alarm.
- A run-up: the nudge says what the first step is and to put the board out now (task initiation), once, with Not yet.
- The disc has no moving digits; the digits are an option for days they help.

## Component gaps (not built around; for kp-themes)

1. gantt: a plan is in the future, but bars cannot be planned (only points can be `planned`); the plan uses finished-looking
   bars and the legend says "planned". Wanted: `state: 'planned'` bars (hollow or dashed) with a start and end.
2. gantt: the toolbar's range buttons and Live, the legend's failed/running/queued and the hint line are for history; a plan
   has no use for them. Wanted: `data-kp-gantt-toolbar="none"`, a legend limited to the states in use, a hint option.
3. gantt: bars of five minutes are too narrow for their label: measure-gaps reports "Season" 0 px from the bar's edge, and
   adjacent steps of one track alternate between two rows because of the bar padding. Wanted: a label that moves outside a
   narrow bar, and no extra row for steps that only touch.
4. timer-disc: it counts a duration, not a moment. Wanted `data-kp-timer-disc-until="<ISO moment>"` so "until 17:40" survives a
   reload and a pause of the page; and a name for the end moment ("Time to start") instead of "time is up".
5. countdown: no option to hide its own Start/Pause/Reset when it is driven by a disc. The demo therefore lets the disc be the
   only control and hides the digits' own buttons with one rule in page.css.
6. sentence: no read-only computed field; "so I start at" is an editable time field that the page keeps in step.
7. attention: an item takes one action node; a calm "not yet" would belong in the item (the demo puts the snooze under the band).

## DEMO_RULES chapters

1 Building: kept (review kit, look-at per theme, Expected block, grid layout, dd/mm/yyyy HH:mm in the snooze, English sample content, no CDNs).
2 Components: kept, package parts only (no plain button without a kp class); no raised surface of my own.
3 States: kept (busy card / plate / alert at the card's footprint; sentence field skeleton in place).
4 Motion: kept, the page opens still; the disc and the clock move only on a press.
5 Themes: formal only, as the brief says.
6 Grouping: one demo, four sections, no topics needed for one theme.
7 Dialog: kept; at most four groups per component, choices have defaults and apply live.
8 Before the Agenda: measure-gaps and check-kit were run in Chromium (Firefox is not installed here); results in the report.
9 After the answer: not applicable yet.
