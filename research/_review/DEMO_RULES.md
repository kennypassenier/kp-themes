# Demo rules: everything Kenny expects from a review demo and its rounds

Compiled 2026-10-17 after Kenny: "ik heb al zoveel commentaar gegeven op de demo, waarvan vele dingen toch terug erin kruipen."
This list is binding. Each rule is one line: the rule, then [the source: Kenny's date and a short quote or the correction id],
then how it is checked: `gate: <file>`, `script: <file>` or `by hand: <what to look at>`. Every dated rule below was given by
Kenny; nothing here is invented.

## How to use this list

Every helper brief for a demo or a round links this file, and the helper confirms each chapter in its report (one line per
chapter: kept, or the rule it could not keep and why). Claude walks the chapter "Before a round goes on the Agenda" before every
push of a round, and no link goes to Kenny while one of its lines is open. A rule marked `by hand` has no gate or script: it is
checked by looking, in Firefox, in the review dialog.

## 1. Building a demo page

- A demo carries the review kit: `data-review`, one `data-review-item` and title per judged section, a look-at line per theme. [2026-10-03 "kan dit vanaf nu altijd voor demos?"; scope-141] by hand: `html[data-review]`, every section has `data-review-item`.
- Everything is judged from ONE central page and one dialog, never a review spread over several pages. [2026-10-04 "Alles moet vanuit 1 centrale pagina geevalueerd kunnen worden"] by hand: one demo.html, one dialog.
- Claude gives Kenny one link to judge (the Agenda, `catalogue/agenda.html`), never a list of pages. [2026-10-05 17:03 "ik heb altijd gezegd van dingen te bundelen"; 2026-10-13] by hand: the reply holds one review link.
- Show the real thing running on the package's own stylesheets, one section per theme with a short line of prose, anything that moves actually moving; never screenshots. [2026-09-08 "Elk in hun sectie per thema"] by hand: no images of components.
- Every section has an Expected block and a look-at line per theme saying what to check. [2026-09-08; researcher brief "Look at"] by hand: `[data-review-look]` has a `p[data-for]` per theme asked.
- Every section and action says on screen what it does: a heading plus one sentence, plain words, no jargon or internal ids. [2026-10-02 "ik moet niet raden naar wat een functie doet"] by hand: read each section as a stranger.
- Anything that opens (menu, dialog, popover) is also shown in its opened state. [researcher brief; KT14 2026-09-08] by hand: open every opener once.
- Show every `kp-<component>--<variant>` the catalogue renders of the component under judgement. [fix-90 2026-10-03] gate: gates/check-demo-variants.mjs
- Real sample content in English, no lorem ipsum, no external CDNs, real package classes; say plainly what is mock. [researcher brief] by hand: grep for `lorem` and `http`.
- Layout is a grid: elements align and keep the same place and size in every state (loading, empty, error, filled); labels in a group share one column as wide as the longest label. [2026-10-02 "maak hier ook een grid"; fix-64 2026-09-20] by hand: resize states, columns line up.
- Uniform siblings: tiles and cards in one grid share one height; same-role buttons in a list share a column. [2026-10-04 "uniformiteit is belangrijk"] by hand: look at every theme.
- Tables are the kp datatable (sortable, multi-sort, remembered), and table action buttons stand in fixed columns. [2026-09-28 "een tabel moet mss een datatable zijn"] by hand: data-kp-datatable on every table.
- Values are human readable (GB not MB, minutes not seconds, dd/mm/yyyy HH:MM) and a source appears once per graph. [2026-09-28 "human readable"; 2026-10-17 project memory] by hand: read the numbers.
- Exact counts: a counter or badge shows the real number, never "9+", "99+" or "1.5k", and is sized for it. [2026-10-03 "ik wil altijd het echte nummer zien"; tabbar-facts-1016 2026-10-16] by hand: feed a count past 99.
- Labels are never cut or abbreviated with "…": they wrap, and a button label never breaks mid-word. [2026-10-17 project memory; UI_PRINCIPLES §1] by hand: narrow width 390 px.
- Contrast is advice, never measured or fixed as a rule in a demo. [2026-10-05 23:04 "die contrastmetingen waren toch al lang afgeschaft?"] by hand: do not spend time on it.
- A destructive confirm needs the exact name typed plus a server refusal, and lists update at once. [2026-10-17 project memory] by hand: try the wrong name.
- A review demo is a reliable tool, not a demo: it never shows a broken or half-built control. [2026-10-17 16:34 "De demo zelf zou geen demo mogen zijn, maar een betrouwbare tool"] script: research/_review/check-kit.mjs

## 2. Components shown in a demo

- Build from the package's own parts (kp-button and its per-theme looks, menus, segmented, spinners, skeletons, arrival motion), never a hand-drawn basic control or a generic control inside a themed component. [2026-10-16 05:45 "neem in godsnaam de bestaande elementen/componenten/spirit/animaties van de thema's mee"] by hand: no plain `<button>` without a kp class.
- Use the kp-themes component that exists for every state (alert, empty, skeleton, datatable) before drawing your own. [2026-09-28 "Gemiste kans ... het Alarm component niet te gebruiken"] by hand: grep the state's markup for kp classes.
- Text always has margin: it never touches an icon, a neighbour or the side edge of its plate (measured at least 4 px by the script, 8 px in docs/RULES.md). [2026-10-16 05:45 "tekst moet altijd wat marge hebben"; 2026-10-17 15:37 "ik nooit text wil die tegen de rand plakt"; text-edge-1017] script: research/_review/measure-gaps.mjs
- A quantity or detail line aligns under the line it belongs to, and a list of rows keeps one grid so a row never sits under a neighbour's shorter amount. [2026-10-17 15:37; RULES 2026-10-17] by hand: look at the cooking-style rows.
- Anything raised (menu, popover, hover card, open drawer) keeps its theme's opaque, readable plate wherever it stands, also inside the review dialog. [2026-10-16 "het geopende menu heeft geen achtergrond"; 2026-10-16 project memory] gate: gates/check-raised-plate.mjs
- Nothing detached from its anchor: a menu sits at its button, an opener stays where its panel belongs. [fix-105, fix-40; 2026-10-06 phantom menu] by hand: open each menu at 1280 and 390 px.
- "Check all" always comes with "uncheck all". [2026-10-17 project memory] by hand: look at every select-all.
- Components stay dynamic and multi-purpose; a new one that resembles an existing one justifies the difference and is shown side by side first. [2026-10-16 23:07 project memory] by hand: ask "which existing component is this?" in the brief.
- Side navigation: panel only, no scrim by default, slides from the left, the edge tab is the default opener, no top or bottom panel. [2026-10-14 project memory; sidenav demos approved] by hand: check the default markup.
- Whatever helps judge (states, variants, tones, speed, replay) is a control inside the review dialog, always open, never folded or hidden. [2026-10-05 18:00 "ik bekijk alles altijd in dialogs"; 2026-10-06 14:53 fix-106] by hand: open the dialog, every demo control is visible on every page.
- A pressed state Kenny sets stays across options, aspects, themes and visits; an action never resets it (Replay included). [fix-112, fix-115 2026-10-06 "state moet onthouden worden"] by hand: press a state, flip, replay, change theme.
- The network graph changes in no theme. [2026-10-07 02:54 "dat is overal goed"] by hand: do not touch it.

- The same function sits in the same position in every row and every state: actions such as "Mark unread" line up in one fixed column (a grid), never left-aligned by the flow of the text before them. [2026-10-17 22:09 notices "I told you before … Same functionality needs to be in the same position every time"; web-grid rule 2026-10] by hand: put each section into its states and compare the rows.
- A new component that opens a menu, list or popover uses the package's existing surface for it (`.kp-menu`, the popover, the combobox list); it never paints its own. Those surfaces already render in every theme and are measured by `measure-plate.mjs` and gates/check-raised-plate.mjs. [2026-10-17 22:09 sentence menu "bijna helemaal zwart"; 22:23 "Volg gewoon wat er al bestaat"; correction states-1017] by hand: open it beside an existing menu.
- A variant the demo offers that could be a setting is a component option with a default, switchable at runtime (an attribute change re-renders); the demo shows that switch working. Ask Kenny only which option is the default. [2026-10-17 22:09 problem-alert, connection, conversation-thread] by hand: flip the attribute in the console.

## 3. States

- Failed, empty and loading states fill the component's full normal footprint, with a normal-size action (Retry). [2026-10-16 23:07 "de hele grootte van de component gebruiken"] by hand: measure each state's height in Firefox against the loaded height.
- Empty and failed states are prominent, proportionally large and centred in the component, set at heading size in the theme's own empty plate or alert, never a small line at the top. [2026-10-17 15:37 "dit is een vaste regel die we vanaf nu handhaven"] by hand: text centre against plate centre.
- A loaded list keeps a minimum height (a minimum number of rows) so loading to loaded jumps less. [2026-10-17 15:37] by hand: compare the heights.
- Buttons in a state are properly proportioned, never a short strip. [2026-10-16 23:07 "een te hoge Retry in een ingeklapt kader"] by hand: look at Retry.
- No layout shift between states: the skeleton has the final geometry and the frame stays steady. [UI_PRINCIPLES §1; 2026-10-02] by hand: toggle states and watch the surroundings.
- A data page or area shows its loading state from the first frame. [2026-10-02 "elke pagina dat data laadt moet dat tonen"] by hand: reload the demo slowly.
- The part an aspect judges is on screen in the state shown. [2026-10-06 22:31] by hand: open each aspect page.

## 4. Motion and loading

- Loading always animates in every theme, and a loading or arrival demo must actually play. [2026-10-05 20:03 "loading moet altijd animated zijn"; 2026-10-16 05:45] by hand: watch it in Firefox.
- A data area that loads (grid, matrix, week, timeline, list read as a whole) shows the theme's busy card centred over the whole component, like the table; never only text, no irregular skeletons, nothing overlapping; this is for data areas, not for an inline control (a slider, a time field, a version badge), which loads as its own skeleton in place. [2026-10-16 11:17, 11:41, 12:23, 14:17 "moet hier ook zoals bij een table zijn"; 2026-10-18 S14 measured: a busy card over an inline control covers the control] gate: gates/check-busy-card.mjs
- A loading picture fills the whole element edge to edge and is built from the component's own vocabulary (a graph loads as nodes and links), never a generic spinner or a small glyph in a box. [2026-10-06 09:31 and 10:58 "too detached from the end result"] by hand: compare loading with the loaded shape.
- A loading aspect sent back gets six options, and loading is its own aspect, never bundled with the approved shape. [2026-10-06 09:31 "give 6 versions"; 2026-10-05 20:03] by hand: count the options.
- Honest motion demos: motion is measured per frame as t50/t90, not declared durations; the option text matches the measured motion. [2026-10-07 15:16 "als de metingen hier niet overeenkwamen met de realiteit"] script: research/_review/measure-motion.mjs
- Close, leave and shrink are the exact reverse of open, arrive and grow; verified per frame. [2026-10-07 15:16; project memory] script: research/_review/measure-motion.mjs
- Motion happens around the content, never through it, and stays inside the element's own box, fluent rather than choppy. [2026-10-04 gambles; project memory] by hand: watch for overlap.
- Parts shown together arrive and leave at comparable perceived speed. [2026-10-07 15:16] script: research/_review/measure-motion.mjs
- A step that loads keeps the view at its top, and a step opens fast: nothing in a frame scrolls the dialog. [2026-10-17 03:06 "nu als alles geladen is dan moet ik manueel naar boven scrollen"; lane-1017] by hand: open a seven-frame step, view at 0 px.
- A demo page opens still on load, with a "Play once" for motion; it never autoplays endlessly. [2026-10-17 project memory] by hand: load the page, nothing moves until pressed.

## 5. Themes and character

- Build from the theme's spirit: ask what the theme's material or medium physically does, and draw that. [2026-10-04 "durf buiten bestaande boundaries te denken"; 2026-10-16 05:45] by hand: each theme answers "what does this world do?".
- Take theme-native gambles, at least one per set, never a variation of fade and slide. [2026-10-04 "These gambles pay off and I want more of that"] by hand: read the option list for a gamble.
- Strict and uniform within a theme, distinct between themes: if one theme brings items in a certain way, others preferably do not. [2026-10-07 03:37 "een thema bestaat om distinct te zijn"] by hand: the "Distinct from the other themes" part of themes/<t>/CHARACTER.md.
- New options for a theme are drawn from that theme's picks in the components already decided, so decisions stay uniform. [2026-10-06 12:59 "ik kan niet van 22 themas onthouden"] by hand: read research/THEME_PROFILES.md before designing.
- The demo renders under the theme it judges, with the theme's signature first and its colours and effects everywhere. [2026-10-17 project memory] by hand: every frame shows its own theme.
- Theme anchors stay: forest tree progress bar, titanium loading, cyberpunk glitch, solstice sun arc, brutalism hard slab, nostromo raster, blueprint tracing pen, synthwave horizon, pastel "twice printed, stuck on", deco gold inlay under the opening button. [2026-10-17 project memory; 2026-10-04 gambles] by hand: compare with the theme's CHARACTER.md.
- Align one theme at a time via CHARACTER.md and a character demo; never apply every family pick to every component at once. [2026-10-07 02:54 "werkt helemaal niet"] by hand: one theme per character demo.
- Options differ at a glance: look at the set side by side at the dialog's size before publishing; near-identical variants are the builder's fault. [2026-10-06 22:31 "gij hebt de demo toch opgezet?"; fix-117] by hand: compare side by side, name the measured difference per pair.
- Each pick is its own choice group (shape, loading, arrival, tone...), never bundled in Option 1/2/3. [2026-10-05 18:45 "keep these things separate"] by hand: one aspect per row.
- Aspects Kenny did not name in a rejection are settled and shown as a choice no more (not even pre-ticked). [2026-10-06 00:08 "De dingen die ik niet specifiek benoem ... staan vast"] by hand: the choice group has `fixed`.

## 6. Grouping, rounds and topics

- A new demo starts in formal only; then ask (one form) to extend to dark, cyberpunk and brutalism; ask again before all other themes. [2026-10-04 "Maak eerst een demo enkel voor het formal thema"] by hand: `data-review-themes="formal"` first.
- A component that only uses the theme's existing style is demoed in formal alone; the implementation is evaluated per theme afterwards. [2026-10-04 "enkel in formal de demo te maken"] by hand: ask "is anything unique per theme?".
- Group by component across themes, always where possible: a topic holds one component kind or truly related ones, never unrelated ones together (a timer and a checklist never share a topic). [2026-10-16 16:43 "doe dit vanaf nu altijd waar mogelijk"; 2026-10-17 17:20] by hand: read each `data-review-topic` list.
- Within a topic, one theme per step at the full window width and a fixed height. [2026-10-16 17:44 "1 item per thema per approval"; 15:06, 15:44] by hand: open a topic step.
- At most 100 pairs per review: a bigger round is split into one demo per component group, each its own Agenda entry. [2026-10-17 03:09 "demos met meer dan 100 beoordelingen moeten ook opgesplitst worden"] gate: gates/check-rereview.mjs
- New demos are listed under "Research to look at" in catalogue/pages.js; the Agenda is the start page. [2026-10-13; 2026-10-17 project memory] by hand: the entry exists.
- Only the current round's questions are counted: counters count what this round asks. [2026-10-17 project memory] by hand: compare the head count with the pairs.
- A second round shows only the unapproved pairs (section by theme); approved sections and themes leave the page, they are not just hidden. [2026-10-13 "toon je geen al goedgekeurde elementen meer"; rereview-1016] gate: gates/check-rereview.mjs
- The first round is the only time everything shows. [2026-10-13] by hand: compare with VERDICTS.json.
- Rejected rows stay visible with their comment until a new round reopens them. [tabbar-facts-1016 2026-10-16] by hand: reload after a "Not approved".
- A new round starts with no old answers: the kit resets its own stored state and Kenny clears nothing by hand. [2026-10-04 review-kit-rereview; 2026-10-16 received rounds] gate: gates/check-rereview.mjs
- Run `snapshot.mjs <topic>` before changing a demo, so "Previous version" shows the round he judged. [2026-10-13 "onmisbaar"] script: research/_review/snapshot.mjs
- Part-round ids are `<topic>-<uuid>`; an id never collides and is never reused. [2026-10-17 16:47 "een ID mag nooit colliden"; lost-answer-1017] gate: gates/check-rereview.mjs (page round not in `received`)

## 7. The review dialog and verdicts

- The dialog walks every section in every theme by itself, no manual theme or section switching; Up approves, Down rejects, the answer is one structured text. [2026-10-03 "ik wil niet altijd heen en weer switchen"] by hand: walk one demo.
- A choice set in the dialog asks only for the component's default: the default is already set and needs no tick, every other option in the set is a real, switchable option of the component that applies live, and Kenny never has to pick between two useful variants (if both are useful, both are options). Every other option also has its own small control "Remove this option" (default: kept, no click needed); the journal and the answer report only what he changed ("default changed to X", "remove option Y"), per pair, and nothing is ever required. [defaults-1017 2026-10-17 23:36 "het is ook niet altijd een keuze he, ik wil de optie om dingen als optie aan te houden, maar ook om ze te verwijderen"] [defaults-1017 2026-10-17 23:33 "Ik wil niet kiezen tussen A en B als beide nuttig zijn, dan moet enkel bepaald worden wat het default gedrag is van de component."; replaces the 2026-10-04 tickable choices] by hand: `data-review-choices` sets carry a `default`; switching an option changes the component; untouched sets are not in the answer.
- The tools bar above a section (Previous version, Play open and close, speed) shows only what is relevant: "Previous version" only when a `_previous` snapshot holds that section, "Play open and close" only when the section has an open and close motion (the demo marks it with `data-review-motion`, `none` to switch it off; else the package's own openers are detected), and the whole bar is absent, taking no space, when neither applies. [2026-10-18 00:28 "de balk met previous version, playopen and close is hier niet relevant dus moet niet getoond worden, enkel wanneer het relevant is"] script: research/_review/check-kit.mjs
- One aspect per page, centred, with the aspect's motion already playing; Replay (R), pause and speed are present. [2026-10-06 12:09, 15:49 "er moeten wel opties zijn om bv animaties terug te starten"] by hand: open an aspect page.
- Keys fit AZERTY with the left hand on the home row and the right on the arrows. [2026-10-06 17:14] by hand: arrows, Q/S/D/F/R/E/A, Space work.
- A rejection needs no note; a "None of these" asks for none. [2026-10-06 23:09 "ik wil de eis dat een afkeuring een text heeft ook afschaffen"] by hand: reject without typing.
- Verdicts are never lost: every one is kept in the append-only journal until Kenny pastes it, whatever he does on the site. [2026-10-17 16:34 "100% absoluut zeker ... vastgelegd"; lost-answer-1017] script: research/_review/check-kit.mjs
- Every step has exactly one approve/reject row per shown section, with its box, note and choice ticks; no step may lack one. [2026-10-17 16:34; project memory] script: research/_review/check-kit.mjs
- A fault Kenny reports is a fact: never answer or record "could not reproduce"; find the cause. [2026-10-06 form v33 "dat jij het niet kan repliceren boeit mij niet"] by hand: no such phrase in a reply or CORRECTIONS.md.
- The step-timing item is information only, no pills. [2026-10-13 23:41 "het is louter informatief!"] by hand: render it as a plain block.

## 8. Before a round goes on the Agenda

- `node research/_review/measure-gaps.mjs <port> <page> <themes> 1280,390` prints clear in every theme the round asks; also click each section into its states and measure those by hand. [2026-10-17 text-edge-1017] script: research/_review/measure-gaps.mjs
- `node research/_review/check-kit.mjs <port> <page>` prints clear on every page. [2026-10-17 lost-answer-1017] script: research/_review/check-kit.mjs
- `npm run gates` is green, including the re-review check against VERDICTS.json. [rereview-1016] gate: gates/check-rereview.mjs
- Every raised surface in the section is opened in the review dialog and measured (`measure-plate.mjs`). [2026-10-16 "het geopende menu heeft geen achtergrond"] script: research/_review/measure-plate.mjs
- The round holds a real decision, complete, with all its options; do not send a demo with nothing to decide. [2026-10-04 "waarom geef je die demo? daar is niks op te beslissen"] by hand: the sections hold something to judge; its option sets only set a default (see chapter 7).
- The builder has looked at every option set side by side at the dialog's size, and the reply names the measured difference per pair. [fix-117 2026-10-06] by hand: the reply lists the numbers.
- Loading, empty and failed states are checked in Firefox in the review dialog (busy card, full footprint, prominent). [2026-10-16, 2026-10-17] by hand: open each state.
- Browser measurements run on Firefox only; Chromium is off. [2026-10-12 "enkel tests op firefox!"; 2026-10-03] by hand: `--engine firefox`.
- No test run of any kind without Kenny's release go (`.claude/release-go`); helpers too; a measuring script is the most a helper may run. [2026-09-30 "tests draaien we vanaf nu pas na dat ik de toestemming geef"; fix-118] gate: .claude/hooks/release-tests.sh
- Every approved demo implemented exactly; a gate that disagrees yields a finding for Kenny, never a silent deviation. [2026-09-08 "exact zo geimplementeerd worden"; KT15] by hand: compare against the demo.
- The reply that sends the round states: what was changed, the one link, what Kenny must do ("Wat ik van je nodig heb: ..." or "Jij hoeft niets te doen"), in Dutch, with every item explained in plain words. [2026-10-17 project memory] by hand: re-read the reply.
- Long results go in a file, screenshots only for what changed, one combined form for several questions. [2026-10-17 project memory] by hand: check the reply.
- Before changing a demo for its next round, `snapshot.mjs` has run and the previous version is committed with the new round. [2026-10-13] script: research/_review/snapshot.mjs

## 9. After Kenny's answer

- The end of the review goes straight back to the Agenda: no in-between window, no copy step, no choice. [2026-10-16 11:17, 11:42 "no copy button"] by hand: approve the last pair.
- Record his answer in `research/<topic>/VERDICTS.json` before touching the demo, and list the received round in the new round's `received`. [rereview-1016; 2026-10-16] gate: gates/check-rereview.mjs
- Approved items are never re-checked, re-measured or swept; a fix touches only what was rejected, plus a guard so it cannot return. [2026-10-16 05:51 "ik wil niet dat je mijn beslissingen ondermijnt"] by hand: the diff touches only the rejected section.
- A fault found in approved work is put to Kenny; he decides, nobody fixes it silently. [2026-10-16 05:51 project memory] by hand: record a finding, ask.
- A rejection returns far better, at world-class top-5 level, never a variation of the rejected ideas; a repeat rejection goes to the strongest model. [2026-10-06 23:09 "je moet zelf weten dat je veel beter moet doen"] by hand: compare with the rejected set.
- UI work goes to the frontend-designer agent, with bold per-variant creativity. [2026-10-06 23:57, 2026-10-07 00:05 "schakel zeker die frontend helper in"] by hand: the brief names the agent.
- Frontend quality is senior at a top-5 company: spacing scale, grids, hierarchy, screenshots at desktop and phone width for what changed. [2026-10-01 "Een strakke, moderne, bruikbare UI is altijd van kritiek belang"; 2026-10-03 "ik zie vaak amateuristische fouten"] by hand: screenshots at 1280 and 390 px.
- Once the Agenda holds nothing waiting, ask Kenny's go to update the components page from docs/COMPONENTS_PAGE_PENDING.md. [2026-10-13] by hand: docs/COMPONENTS_PAGE_PENDING.md.
