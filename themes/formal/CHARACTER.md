# Formal — character

The reference for how formal looks and moves, derived from its anchor. Read the
grammar before adding or changing any formal component; the inventory and the
outliers record where the decided picks (2026-10-05 … 2026-10-07) stand against
it, and the questions (research/formal-character) are the plan to bring them in
line. Kenny picked the anchor on 2026-10-08 in research/formal-anchor; the grammar
below is proposed from it and goes to him question by question.

Sources measured (2026-10-08): every `research/character-*/decided.json` pick
for formal resolved to its option (research/THEME_PROFILES.md and the demos'
`demo.js`), `css/formal-register.css` (2073 lines, layers `kp.register` and
`kp.signature`), `css/themes.css` (formal's tokens, `--fx-ease`
`cubic-bezier(0.2, 0, 0, 1)`, `--fx-duration` 180 ms, the T5 gravure grain at
0.035), `js/motion.js` (`--kp-open: reverse-close`, formal 300 / 200 ms), the
families verdict (research/families/VERDICTS.md: loading = busy table, arrival =
meter, live = trend tile, hover = network graph, tone = dashboard tiles, shape =
meter), `themes/formal/anatomy.md` and research/formal-anchor.

---

## 0. Decided before this analysis (Kenny)

| When             | Where                                    | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-07 01:32 | research/families, formal                | **Loading** = the busy table's _The seal is pressed_. **Arrival** = the meter's _Written into the ledger_. **Live** = the trend's _Redrawn_. **Hover, focus, press** = the graph's _Red-ink tick_. **Tone** = the tiles' _engraved plate_. **Shape** = the meter's _bound volume_.                                                                                                                                                                                                                                               |
| 2026-10-07 02:54 | the Homelab project thread               | **The network graph changes in no theme.** In formal its picks (annual report, courier's round, typeset, red-ink tick, re-inked) are a source, never a target.                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-10-08       | research/formal-anchor, review dialog    | **The anchor = The account is closed: the double rule** (option 2): a navy rule ruled under the figure from the start at an even pace, and a thinner second rule under it the moment it reaches the end; the hover rule inside a button doubled on press.                                                                                                                                                                                                                                                                        |
| 2026-10-08       | research/formal-character, review dialog | **All nineteen questions approved, every recommendation except Pointing at something = A rule under the label and Motifs = Those plus the seal where picked** (research/formal-character/decided.json). The grammar G1 to G21 below stands as decided, with G15 (hover) = a navy rule ruled under the pointed-at label, and G21 (motifs) = the rule, the double rule, the docket cut, red ink, plus the wax seal where a decided pick placed it. To be applied in css/formal-register.css and the research/character-* variants. |

Decided 2026-10-08: every question in research/formal-character is answered (see the last row above); what remains is applying the grammar to the register and the variants, and the package findings under a Formal heading in research/PACKAGE_FINDINGS.md.

---

## 1. The formal grammar (proposed)

Formal is **the clerk's ledger**: paper stock in three tones, near-black ink
with a blue cast, one navy that does every acting, red ink for the accountant's
entries, gold only on a ribbon. The anchor says what the clerk does: he
**rules**. A rule is drawn under a figure from the start at an even pace, it
stops at the margin, and when the account is done a thinner second rule closes
it. Everything that happens on screen is something a clerk does to a ledger: it
is **ruled in, ruled off, closed with the double rule, ruled again, struck
through**. Nothing fades, nothing rises, nothing is stamped or sealed or
squashed, and nothing performs: motion commits.

| #   | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **A rule is drawn at an even pace and stops at the margin.** Every one-shot motion is a rule being ruled: linear from the start to the end, a dead stop, no settle, no overshoot (`linear`). A close is the rule taken off, the same motion backwards. The register's `--fx-ease` (`cubic-bezier(0.2, 0, 0, 1)`, a quick start and a long settle) reads as a thing sliding into place, not as a line being ruled; it stays for colour changes only.                    |
| G2  | **Along the line, start → end; lines top → bottom.** A rule runs along its line from inline-start to end (mirrored by `dir`); a group of rules (a ledger, a menu, a list, a month) is ruled one line after the other from the top down, 60 ms apart. Nothing grows up, nothing falls, nothing comes from its centre.                                                                                                                                                   |
| G3  | **What opens is ruled open from its anchor.** A menu under its button is ruled line by line downward out of the button's edge (its frame rule first, then each entry's line); a dialog is ruled in where it stands: its frame rule, its title's rule, its lines, top down. Both close as the rules taken off, bottom first. Never a scale, a squash, a fade, an unroll.                                                                                                |
| G4  | **Durations: one ruling time.** Contact 180 ms (`--fx-duration`). A rule across a part: 400 ms. A group: 400 ms per rule, 60 ms apart, so a six-line menu is done in 700 ms. The close: the same backwards. A loop (the busy bar's rule ruled and closed and lifted): 2400 ms.                                                                                                                                                                                         |
| G5  | **Navy rules, red ink marks, gold never acts.** `--primary` draws every rule, every act, every pick. Red ink (`--destructive`) marks an entry that needs attention (a warning, a failure): a rule in red along the start edge and the figure's change on a square plate in a hairline (the red-ink entry). Bronze (`--accent`) is a wash for emphasis, never a line. Gold (`--fx-signal`) is the ribbon of the meter and the laurels, never a rule, never a control.   |
| G6  | **Plates keep their corner; rules and plates-in-rules are square.** Cards, dialogs, menus, tiles keep `--radius` (0.375 rem). A rule has square ends. A small plate that sits inside a rule (the change, a tag, a tooltip, the field note of the ledger) is square: a ruled thing has no rounded corner.                                                                                                                                                               |
| G7  | **Paper with ledger lines under figures; the double rule frames what matters.** Three paper tones (page 97 %, card 99 %, muted 91 %), the gravure grain felt and not seen. Under tabular figures, charts and the empty state run faint ledger lines (`--border`). What matters (a heading, a dialog, an engraved plate, a certificate) is framed by the double rule: a strong hairline with a thinner one inside it. No other texture, no shadow but the dialog's mat. |
| G8  | **A warning is a red-ink entry.** A warning or failed figure is ruled off along its start edge in red ink (3 px), its change on a square plate inside a hairline; the plate's ground stays paper. Never a tinted plate, never a stamp, never a frame all round.                                                                                                                                                                                                        |
| G9  | **A live update is ruled again and closed.** When a figure changes, a navy rule is ruled under it from the start (400 ms), and the second rule closes it at the end (the account closed on the new figure), then both are lifted; the figure never moves. Not a stamp (today's `--kp-update: stamp`), not a swell, not a retrace.                                                                                                                                      |
| G10 | **Loading is ruling the lines.** On every waiting surface the ledger's lines are ruled across it one after the other, top down, at the ruling pace, lifted, and ruled again (the trend's pick, _The ledger is ruled_, carried everywhere): a tile, a panel, a menu entry, a day, a chart's plot, a skeleton. Not a dotted leader, not a seal pressed, not a shimmer.                                                                                                   |
| G11 | **The busy bar is a rule ruled and closed.** The band is ruled start → end (1200 ms), the second rule closes it (the account closed), both are lifted from the start (1200 ms), and it is ruled again. With a share known: the band ruled to the share, the second rule only at 100 %, as the bar already does.                                                                                                                                                        |
| G12 | **The spinner rules an arc round a double ring.** A hairline ring with a thinner ring inside it (the double rule, round); a navy arc is ruled round the ring at an even pace, closes with a thinner arc inside it, both lifted, ruled again. Not a hand on a dial.                                                                                                                                                                                                     |
| G13 | **Arriving is ruled in, leaving is ruled off.** A part arrives as its rules are ruled: its frame rule start → end, then its lines top down, the words revealed behind each rule; it leaves as the rules are taken off, bottom first, end → start: one animation, played forward and backwards (`reverse-close` stays). Not folded up (today), not struck through.                                                                                                      |
| G14 | **An element inside a composite is formal's own element.** A button in a header, menu, drawer, tile or alert hovers, focuses and presses exactly like formal's `.kp-button`; a menu entry like `.kp-menu__item`; a link like its link. A composite may add a rule around them, never replace their hover, focus ring, press, corner or face.                                                                                                                           |
| G15 | **Pointing draws the inner rule.** Hover draws the rule 2 px inside a control (the register's gap-4, the one gesture formal already makes), navy on paper, `currentColor` on a filled button; a menu entry takes the muted ground and a navy rule under its label; a link's underline turns double. No lift, no shadow, no tint.                                                                                                                                       |
| G16 | **Focus is DI2's two-channel ring**, a system constant; the inner rule stays drawn under it when the part is also pointed at.                                                                                                                                                                                                                                                                                                                                          |
| G17 | **A press doubles the rule.** The inner rule gains its second rule 3 px further in (the anchor's press) and the face takes `--secondary-active`; nothing moves. Release lifts the second rule.                                                                                                                                                                                                                                                                         |
| G18 | **Fraunces for titles and figures, small capitals for labels.** Titles and large figures in Fraunces (opsz by size, tabular numerals); labels, captions, menu headings and tags in all-small-caps Instrument Sans tracked 0.06 em; prose in Instrument Sans; no monospace voice (identifiers in small caps too).                                                                                                                                                       |
| G19 | **Motifs: the rule, the double rule, the docket cut, red ink.** A rule under a figure, a double rule on what matters, the docket cut (hairline + a short navy tick) as a divider and a bar track, red ink for the entries that need the eye. The stamp and the seal are retired from the picks (the busy table, the key figure, the chart, the state word, the drawer); the ribbon stays on the meter only.                                                            |
| G20 | **Every animation sits under `prefers-reduced-motion: no-preference`;** the reduced pose is the ruled, closed picture.                                                                                                                                                                                                                                                                                                                                                 |
| G21 | **The network graph is never a target** (Kenny, 2026-10-07 02:54).                                                                                                                                                                                                                                                                                                                                                                                                     |

---

## 2. The decided picks against the grammar

Only the meter and the signature elements are in `css/formal-register.css`
today; the other picks live in the `research/character-*` demos and wait for
the port. Verdict: **fits**, or the outlier it is (§3).

| Component · aspect    | Pick                                      | Verdict                                                 |
| --------------------- | ----------------------------------------- | ------------------------------------------------------- |
| register · curve      | `--fx-ease` (0.2, 0, 0, 1) everywhere     | outlier-1 (G1)                                          |
| register · leave      | folded up like a letter (`scaleY(0)`)     | outlier-2 (G13)                                         |
| register · dialog     | a sheet laid on the desk (fade + 14 px)   | outlier-3 (G3)                                          |
| register · tooltip    | drops 3 px, fades                         | outlier-3 (G3)                                          |
| register · toast      | rises 8 px, its top rule drawn            | the rule fits; the rise is outlier-3                    |
| register · update     | the checked stamp                         | outlier-4 (G9, G19)                                     |
| register · spinner    | the watch dial, a hand turning            | outlier-5 (G12)                                         |
| register · skeleton   | ledger lines inked across, then wiped     | fits in picture (G10); its 3 s loop is outlier-6 (G4)   |
| register · busy bar   | a dotted leader, still                    | outlier-7 (G11)                                         |
| register · hover      | the inner rule                            | **the anchor** (G15)                                    |
| register · press      | none                                      | outlier-8 (G17)                                         |
| meter · all           | bound volume, ribbon, stamped and filed   | fits (G19 keeps the ribbon); loading's sliding bar: G10 |
| busy · shape          | the engraved plate                        | fits (G7)                                               |
| busy · loading        | the seal is pressed                       | outlier-9 (G10, G19)                                    |
| busy · arrival        | entered in the ledger (hard steps)        | picture fits; the steps: outlier-1                      |
| busy · failure        | the voided stamp                          | outlier-9 (G19)                                         |
| calendar · shape      | the desk diary                            | fits (G7)                                               |
| calendar · loading    | the dotted leader                         | outlier-9 (G10)                                         |
| calendar · arrival    | the page turns                            | outlier-2 (G2, G13)                                     |
| calendar · tone       | tinted paper + rule; today in double rule | the rule and the double rule fit; the tint: outlier-10  |
| chart · shape         | the ledger graph (double rule baseline)   | fits (G7, G19)                                          |
| chart · loading       | the received stamp                        | outlier-9                                               |
| chart · arrival       | written in by hand                        | outlier-2 (a pen stroke, not a rule)                    |
| columns · shape       | the engraved certificate                  | fits                                                    |
| columns · loading     | the dotted leader                         | outlier-9                                               |
| columns · arrival     | set in type (hard steps)                  | outlier-1                                               |
| columns · tone        | plus and minus on a square plate          | fits (G6, G8)                                           |
| columns · live        | the clerk's stamp                         | outlier-4                                               |
| drawer · shape, card  | engraved plate, index card                | fits                                                    |
| drawer · open         | the seal is broken                        | outlier-9                                               |
| drawer · highlight    | ruled margin note (corner rules)          | fits                                                    |
| header · shape        | the letterhead (double rule)              | fits                                                    |
| header · menu         | opened at the ribbon (a hinge)            | outlier-3                                               |
| header · interactive  | the pressed plate                         | C1 (G14)                                                |
| kpi · shape           | the annual report                         | fits                                                    |
| kpi · loading         | the seal is pressed                       | outlier-9                                               |
| kpi · tone            | the red-ink entry                         | **the reference** (G8)                                  |
| kpi · interactive     | guilloche rises on hover                  | C2 (G15)                                                |
| kpi · live            | signed again                              | outlier-4                                               |
| menu · shape          | the engraved plate                        | fits                                                    |
| menu · loading        | the dotted leader                         | outlier-9                                               |
| menu · open           | unrolled                                  | outlier-3                                               |
| menu · tone           | the red-ink entry                         | fits                                                    |
| menu · interact       | the quill underline, double on press      | fits (G15, G17)                                         |
| state · shape, change | the seal, re-sealed                       | outlier-9 (G19)                                         |
| tiles · shape         | the engraved plate                        | fits                                                    |
| tiles · loading       | the dotted leader                         | outlier-9                                               |
| tiles · arrival       | engraved (written in from the left)       | fits (G2)                                               |
| tiles · hover         | the raised seal (a lift)                  | outlier-11 (G15)                                        |
| tiles · live          | signed again                              | outlier-4                                               |
| trend · shape         | the engraved plate                        | fits                                                    |
| trend · loading       | the ledger is ruled                       | **the reference** (G10)                                 |
| trend · arrival       | engraved                                  | fits                                                    |
| trend · tone          | the red-ink entry                         | fits                                                    |
| trend · live          | redrawn, a pointer slides                 | outlier-4                                               |

---

## 3. The outliers

| #          | What                                                                                           | Breaks                                                           | Strength |
| ---------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| outlier-1  | the register's settle curve on every motion; hard steps in two arrivals                        | a rule is ruled at an even pace (G1)                             | ●●       |
| outlier-2  | the leave folds up; the diary's page turns; the chart is written by hand                       | ruled in, ruled off, along the line (G2, G13)                    | ●●●      |
| outlier-3  | the dialog's fade and rise, the tooltip's drop, the toast's rise, the menu unrolled, the hinge | ruled open from its anchor (G3)                                  | ●●●      |
| outlier-4  | the stamp as the live update; signed again; the clerk's stamp; the pointer slides              | ruled again and closed (G9)                                      | ●●●      |
| outlier-5  | the spinner's hand                                                                             | an arc ruled round a double ring (G12)                           | ●●       |
| outlier-6  | the skeleton's 3 s loop; the meter's 2.6 s bar                                                 | one ruling time (G4)                                             | ●        |
| outlier-7  | the busy bar stands still                                                                      | a rule ruled and closed (G11)                                    | ●●       |
| outlier-8  | no press                                                                                       | the rule doubles (G17)                                           | ●●       |
| outlier-9  | the seal pressed, the dotted leader, the received stamp, the voided stamp, the seal broken     | loading is ruling the lines; stamps and seals retired (G10, G19) | ●●●      |
| outlier-10 | tinted paper for a day's tone                                                                  | a warning is a red-ink entry on paper (G8)                       | ●        |
| outlier-11 | the tile lifts on a soft shadow; guilloche rises behind a figure                               | pointing draws the inner rule (G15)                              | ●●       |

Composites against the base element (G14): C1 the header's buttons (a ruled
plate that thickens on hover and presses inward); C2 the key figure's guilloche
on hover; C3 the tile's Open link (underlined navy, the plate lifted). Each
becomes formal's own button or link plus, at most, a rule round it.

---

## 4. The questions (research/formal-character)

Each proposal is one question; its first option is the grammar above.

| #   | Question                         | Rule | Options, recommended first                                                                                                                           |
| --- | -------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve                 | G1   | ruled at an even pace, dead stop · the register's commit curve · the hand's ease-in-out · as today (the mix)                                         |
| 2   | The direction                    | G2   | along the line start → end, lines top → bottom · up from the base line · as today                                                                    |
| 3   | Opening what drops from a button | G3   | ruled open from its anchor · unrolled (the pick) · as today                                                                                          |
| 4   | How long things take             | G4   | 180 · 400 (+60) · 2400 · brisk 120 · 240 (+40) · 1600 · unhurried 240 · 700 (+90) · 3600                                                             |
| 5   | Where the colour goes            | G5   | navy rules, red ink marks, gold never acts · gold draws the second rule · ink only                                                                   |
| 6   | The corners                      | G6   | plates keep their corner, ruled things square · everything square · as today                                                                         |
| 7   | The surface                      | G7   | ledger lines under figures, the double rule on what matters · plain paper, rules only when something happens · as today (engraved frames everywhere) |
| 8   | A warning                        | G8   | the red-ink entry · the tinted plate with a rule · the voided stamp                                                                                  |
| 9   | A live update                    | G9   | ruled again and closed · the checked stamp (today) · signed again                                                                                    |
| 10  | Loading                          | G10  | ruling the lines · the dotted leader (the picks) · the seal pressed (the picks) · as today (the skeleton's ink)                                      |
| 11  | The busy progress bar            | G11  | ruled and closed, lifted, ruled again · the dotted leader written dot by dot · the band slides to and fro (the meter's)                              |
| 12  | The spinner                      | G12  | an arc ruled round a double ring · the dial (today) · a dotted leader round a ring                                                                   |
| 13  | Leaving and arriving             | G13  | ruled in, ruled off · folded up (today) · struck through                                                                                             |
| 14  | Buttons inside composites        | G14  | exactly formal's own · formal's own plus a rule round them · as today                                                                                |
| 15  | Pointing at something (hover)    | G15  | the inner rule · a rule under the label · the lift (the tiles')                                                                                      |
| 16  | The focus ring                   | G16  | the two-channel ring · the double rule as the ring · as today                                                                                        |
| 17  | The press                        | G17  | the rule doubles · the plate pressed a shade · as today (nothing)                                                                                    |
| 18  | The voice                        | G18  | Fraunces figures, small-caps labels · sans figures · tabular mono figures                                                                            |
| 19  | Motifs                           | G19  | the rule, the double rule, the docket cut, red ink · those plus the seal where picked · as today (everything)                                        |

---

## 5. Distinct from the other themes

| Aspect       | Formal (recommended)                               | Overlap found, and the difference                                                                                                 |
| ------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Curve        | linear, dead stop at the margin                    | grotesk's even pace and dead stop (a station clock) — grotesk dwells and its plate turns; formal rules and closes, nothing turns  |
| Direction    | along the line, lines top down                     | titanium feeds start → end, terminal prints lines top down — formal rules a double line and never types or feeds                  |
| Opening      | ruled open from the anchor, line by line           | forest grows out of its anchor (clipped growth); formal's lines appear one by one, each a rule                                    |
| Live         | ruled again and closed                             | grotesk's train along the baseline, blueprint's pointer on a scale — formal's rule closes with a second rule, nobody else doubles |
| Loading      | lines ruled top down                               | dark's ticker baseline, terminal's htop row — formal's are ledger lines in navy on paper, several, one after the other            |
| Leave        | ruled off, bottom first                            | nostromo's raster erases rows from the top; formal lifts rules from the bottom                                                    |
| Hover, press | the inner rule, doubled on press                   | grotesk draws a baseline under the words and thickens it; formal's rule is inside the control and doubles                         |
| Type         | Fraunces figures, small capitals                   | solstice's Instrument Serif sentence case; formal's figures are Fraunces with tabular numerals and its labels small capitals      |
| Motifs       | the rule, the double rule, the docket cut, red ink | grotesk's one red disc and index bar; formal's red is ink on an entry, never a plate                                              |
