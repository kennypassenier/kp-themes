# research/kyu-11-topic-subs: kyu on kp-themes 11, the Topic page's top half

Kenny asked (2026-10-19) how kyu's pages look when they use as many of the new kp-themes 11.0.0 components as make sense, every option to the full. This part is the top half of the Topic page (`/t/notify.kenny/dashboard`): the page header, "Send and receive", and "Subscriptions". Formal only, mock data in kyu's real shape. Source map: kyu `docs/KP_THEMES_11_ADOPTION.md`.

`demo.html` is generated: edit `demo.template.html` and `options.mjs`, then run `node research/kyu-11-topic-subs/build.mjs` (the control buttons and the dialog's choice sets come from the one list in `options.mjs`).

Sections (every setting is a button above the component and a choice set in the dialog that only asks for the default):

1. `topic-header`: `kp-page-header` with heading line, `idmark` (option Topic mark: Letters*, Pattern, Glyph), `freshness` (`data-kp-ago`, stale-after, Quiet state), `lede` (option Sentence: Whole*, Folded), `data-kp-reveal="headline"`, copy button; states Filled, Quiet, Loading (skeleton).
2. `send`: `steplist --journey` publish, receive, acknowledge (steps tick off on Copy), four `command` blocks, four `.kp-secret` fields holding the working command (options Reveal shows for: 10 s*, 30 s, Until hidden; Reveal works by: Click*, Holding; states Hidden, Being read, Cannot be read, Locked), `card-state` (Filled, Loading, Failed).
3. `bootstrap`: the warning as a `problems` alert (what, why, what now with a command and Copy) in a `card-state` card (Shown, Loading, Failed, A reader exists).
4. `subs`: `datatable` (sort, multi-sort, remembered, cards on a phone, a range filter on Backlog), `segmented` multi filter with exact counts (options Filter look: Track*, Chips; Filter picks: Several at once*, One at a time), `actions` fixed columns (Archive, Delete, More), `reason` on the disabled buttons, `idmark` set, option Rows: Compact*, Comfortable; states Filled, Loading, Empty, Failed.
5. `row-menu`: `menu-button` with grouped entries and disabled entries that carry a reason; states Closed/Open, Entries Filled/Loading/Nothing to offer.
6. `archive`: `undo-toast` with defer, ring clock (options Clock: Ring*, Rule, Seconds in words, None; Undo is offered for: 3 s, 6 s*, 10 s; The archive happens: After the window*, At once with Undo reversing; Server Accepts/Refuses).
7. `delete`: typed-name confirm both inline (`data-kp-type-confirm`) and as the dialog (`data-kp-confirm-type`), with a server refusal and an at-once list update (option Typed name: Capitals must match*, Any capitals; Server; As a dialog Shown).

`*` marks the default.
