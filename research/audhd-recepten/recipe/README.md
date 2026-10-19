# AuDHD recipes: the recipe page and calm settings (formal only)

**Decided (2026-10-19 02:38):** Kenny approved every pair (7 of 7 approved, defaults kept). Recorded in `VERDICTS.json`; the page is not offered again. Six sections were rebuilt afterwards for the grid rule and are asked again in research/audhd-recepten/grid-fix.

Demo `demo.html` (+ `demo.js`, `page.css`), `data-review="audhd-recipe"`, formal only. 7 sections in 3 topics.

| Topic | Section | Components |
| --- | --- | --- |
| The recipe page | recipe: read, scale, begin | card, lede, quantity, hovercard, flash |
| | recipe-states: loading, not found, could not load | card-state |
| Take it with you | qr: open cook mode on the phone | qr |
| | qr-states: loading, no link, too long, ran out | qr |
| | print: the printable sheet | print, checklist |
| Calm settings and the log | settings: calm, theme, language | calm, theme-picker, segmented, flash |
| | log: a quiet week is only quiet | heat with calm-tones, card-state, segmented |

Every option is a runtime option with a default (a button at the component and a choice set in the dialog). Own ideas, each
with its reason: the big button announces that the first step is only "get the 9 things out" (task initiation); effort and
hands-on time beside the title (decide on a low-energy day before committing); "Last time" note (memory without nagging); amounts
that light up when they change, but not in calm mode; kitchen fractions; a printed sheet with a tick box per ingredient and an
optional dotted line (the note for next time starts on paper); Log today's dinner with a feeling that can be skipped and any
past day loggable; weeks named in words ("Last week") because dates are hard to feel; a Not found plate that is calm and
offers one way out; failures say the connection dropped, never that anything is gone.

## Heat, not week, for the cooking log
`js/week.js` places timed pills on seven days and has no calm tones (its `skipped` state is struck through, which reads as a
judgement); a log has no time of day. `js/heat.js` takes `data-kp-tones="calm"` (logged, quiet, paused, future), so an empty week
is seven pale plates and nothing else, and its rows are weeks.

## Mock, said plainly
Begin cooking only shows busy and "Opening" (cook mode is another screen). The server is pretended (a 0.9 s fetch). Calm mode
and the theme are not stored by this demo (`data-kp-calm-remember="false"`, and the theme choice is caught) so the review site
stays as Kenny set it; the language is stored (`kp-audhd-lang`) and the recipe opens in it. Sample dates: today is 16/10/2026.

## Component gaps
- hovercard: ignores touch, so an ingredient note is unreachable on a phone; wanted `data-kp-hovercard-touch="tap"` (a tap opens it).
- lede: `data-kp-lede-collapsible` / `data-kp-lede-link` are read once; changing the attribute does not fold or unfold (the demo redraws the lede).
- heat: no legend (calendar and uptime have one); the demo says what the tones mean in one plain sentence under the grid.
- heat: a press picks a whole column (kp-heat-pick); a log wants to pick one day (row and column). The demo derives the day from rowKey and colKey.
- card-state: the empty and error title is bold body text, not heading size (DEMO_RULES ch. 3 asks heading size, prominent).
- qr: `data-kp-qr-retry` is not observed; the demo calls `setQr(el, {})` after changing it.
- theme-picker: no way to preview a theme without applying it to the whole page (the demo only says what would happen).

## DEMO_RULES chapters
1 building: kept (review kit, expected, look-at, grids, English content). 2 components: kept (kp parts only; no plain button without a kp class; menus use the package's popover; text edges not measured with measure-gaps.mjs, see below). 3 states: kept (card-state and heat/qr states fill the footprint; the card title size is a gap). 4 motion: kept (loading is the theme's busy card; the page opens still). 5 themes: n/a, formal only. 6 grouping: kept (3 topics, 7 pairs, formal first). 7 dialog: kept (controls at the component, at most 4 groups, choice sets with defaults). 8 before the Agenda: check-kit layout part clear at 1920x965, 1280x800, 390x844 (Chromium; Firefox is not installed here); measure-gaps and the every-theme part not run; not added to catalogue/pages.js (not mine to touch).
