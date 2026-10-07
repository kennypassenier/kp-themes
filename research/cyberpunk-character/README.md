# What makes cyberpunk cyberpunk

**Why.** Kenny, 2026-10-07 04:23: after nostromo, the rest one by one, cyberpunk first, the same way as titanium, forest and
nostromo (02:54: "waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet? begin met 1 thema en we
zullen dat één voor één afwerken zo"). The analysis is [themes/cyberpunk/CHARACTER.md](../../themes/cyberpunk/CHARACTER.md): every
decided cyberpunk pick measured, the grammar G1-G18, the families, seventeen outliers, the composites and twenty-six proposals. This
page turns the proposals into the questions Kenny answers to fix cyberpunk's grammar.

**Already decided, not asked again.** Signal Yellow (2026-09-08), the signature (2026-10-03), the leave (2026-10-04), the
reverse-close pairing, every component pick of the character round, and Kenny's family picks of 2026-10-07 01:32: the lock-on
(loading), Glitch in (arrival), the circuit lights (hover, focus, press), Target locked (tone), the holo card (shape); the
count-down stutter (live, 02:49). The questions ask how those land on every carrier and which parameters (curve, durations, corners,
colour, type, motifs) hold them together. **The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in cyberpunk
it is a source of the grammar (its target lock, its packet race), never a target.

**What.** One page, cyberpunk only, in the review kit's aspect mode (`data-review-themes="cyberpunk"`). An intro, "What cyberpunk
is" (the netrunner's HUD: the void, the holo plate, the HUD over it; the package's own parts, and on demand six decided character
demos embedded as they are today), then eighteen questions. Each question is one rule of the grammar, with three options (four for
the warning, where Kenny's own pick and the proposal differ only in motion), each a live scene built from the package's components
in cyberpunk (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`, `.kp-progressbar`,
`.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-skeleton`, `.kp-tooltip`, `.kp-empty`, `.kp-field`, `.kp-page-header`, the
divider). The first option is always the recommendation; every option says what you see and why it is or is not recommended, on the
page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                                   |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | The motion curve (G1)                 | hard ticks, it jitters home · smooth (synthwave's, nearly titanium's) · even steps (nostromo's, terminal's)  |
| 2   | The direction (G2)                    | sideways tears, reading start → end · everything start → end (titanium's) · down from the top                |
| 3   | Opening what drops from a button (G3) | glitched in · the dialog's CRT line (nostromo's strike) · cut from the top in steps (titanium's)             |
| 4   | How long things take (G4)             | 180 · 360 · 480 · 1800 · 120 · 240 · 360 · 1200 · 300 · 600 · 720 · 2400                                     |
| 5   | Where the colour goes (G5)            | yellow acts, cyan reads, red alarms · cyan acts · as today                                                   |
| 6   | The corners (G6)                      | square or notched · the holo's 0.3 rem (dark's, synthwave's) · a pair on every part (titanium's)             |
| 7   | The surface (G7)                      | every plate a holo card · the register's dossier · neon on everything (synthwave's way)                      |
| 8   | A warning (G13)                       | target locked, then holds · twitching (the menu pick as is) · a hazard band · the full frame (nostromo's)    |
| 9   | A live update on every carrier (G9)   | every carrier stutters · only text (the package today) · as the components play it today                     |
| 10  | Loading (G10)                         | the lock-on on every waiting part · the data stream at every foot (dark's ticker) · as today                 |
| 11  | The spinner (G11)                     | the reticle locks on its core · the scanner (today) · a glyph cell deciphers                                 |
| 12  | Leaving and arriving (G12)            | torn out, glitched in, in ticks · the classic glitch as today · collapsed to a line (nostromo's)             |
| 13  | Buttons inside composites (G17)       | exactly cyberpunk's own · as today · cyberpunk's own, the header in cyan                                     |
| 14  | Pointing at something (G8)            | the circuit lights · the charge runs on everything · as today                                                |
| 15  | The focus ring (G14, DI2)             | the two-channel ring inset, the circuit lit · the glitch-cut ring · as today                                 |
| 16  | The press (G14)                       | the circuit closes · drops 1 px (titanium's) · the kick                                                      |
| 17  | The voice (G15)                       | prefixed mono names, the condensed display counts · mono figures (titanium's, terminal's) · no machine voice |
| 18  | Reticles, splits, stripes (G16)       | every motif means one thing · only the notch · on everything                                                 |

**How.**

- `demo.js` holds the eighteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-cy-aspect`, option cells `data-cy-option`) and writes `data-review-choices` from the same data,
  so the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-cy-<question>="<key>"` on the scene. Colours are
  tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "today"
  options reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos' own CSS, so
  one scene shows the same parts in every option). Parts at rest are drawn as the recommended grammar has them (the holo plate, the
  notch, the prefixed mono, the lock-on), so each question changes only its own rule.
- The tick: every recommended motion is `steps(1, end)` keyframes on 60 ms ticks; what moves to a place jitters home (the readouts
  of question 1: +18, −12, +8, −4, +1, 0 px). The glitch-in is the menu's pick (`mb-r3-cy-glitch-in`) on the tick, with the cyan and
  red copies as drop shadows; a plate's notch is its clip's end value (`--cy-end-clip`), so the tear ends on the part's own cut.
- The holo plate's outward glow is a drop shadow on a wrapper (`.cy-glow`), because the notch's clip would cut a box shadow on the
  plate itself.
- The lock-on is the menu's `mb-r3-cy-lock` on each waiting part's own box: four mask tiles of a 2 px frame hunt from the inline end
  and blink cyan and yellow; a day locks without hunting, one tick after the one before.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-cy-phase`: gap, in, hold, out), so
  the options of a row start together. It only writes attributes and text, in one pass, and never reads layout; rows far off screen
  are not rendered (`content-visibility: auto`). Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's
  Pause (Space) stops it. Loading pictures, the spinner and the hover's charge loop in CSS.
- Every close is its open played backwards (Kenny's standing rule; 2026-10-07 15:16: "ik weet niet of je openen en sluiten bv altijd het omgekeerde van mekaar hebt gemaakt"). At `out`, `demo.js` (`closeByReverse`, keyed to `data-cy-phase`) plays every arrival of a cell backwards over the cell's whole arrival: the same keyframes, curve and pace, what arrived last leaving first; the clock's `out` lasts as long as the longest close. Before, most scenes stood through `out` and were cut away at `gap`, or snapped shut as `out` began. The hand-drawn closes (glitch out, rise out, uncover out, cut out, the CRT's 600 ms close) are gone: each was off by a tick or ran its curve forwards; the CRT option now closes in its own 1.5 s. The leave question's arrivals now run on the same parts as their leaves. Measured frame by frame in Firefox with `research/_review/measure-motion.mjs`: every arrival's close is now its mirror within one frame.
- Hover, focus and press are shown standing still on marked parts (`.cy-pointed`, `.cy-focused`) and by the clock (`.cy-press`), so
  they can be compared without a pointer; the State buttons force a state on every button of question 13, and the dialog presses
  Hover there by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=cyberpunk`) only
  when it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every recommendation
was measured against titanium's decided grammar, forest's and nostromo's proposed ones, the other registers and the families' picks
(CHARACTER.md §7). Six first ideas overlapped and were replaced by a cyberpunk-own one: the register's smooth curve (synthwave's
exactly, nearly titanium's) by hard ticks that jitter home, the dialog's CRT line (nostromo's proposed tube strike) by the glitch-in
on every panel, the 1 px press (titanium's) by the closed circuit, the holo's 0.3 rem corner (dark's and synthwave's soft corner) by
the notch, the full warning frame (nostromo's klaxon) by the target lock, and mono figures (titanium's and terminal's) by the
condensed display. Each overlap stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's options side by side at rest, and the motion
rows at a quarter speed mid-motion). The voice row first showed one figure, where the condensed display and the mono could hardly be
told apart; it now carries a strip of three figures. The tone tag first overlapped the label of a narrow key figure; it now stands
only where the plate has room (a container query). The neon option's glow on the buttons was cut by their notch; it now sits on the
row. The press of a key figure as a filter first collapsed to a narrow column; it now takes the full width.
