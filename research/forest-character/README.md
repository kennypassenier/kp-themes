# What makes forest forest

**Why.** Kenny, 2026-10-07 02:54, after rejecting research/families-applied as a way to choose: "Dit werkt helemaal niet voor mij.
Kunnen we het op dezelfde manier aanpakken als we met titanium gedaan hebben? waar jij eerst uitzoekt wat bij mekaar past, wat niet
past en dan zo voorstellen doet? begin met 1 thema en we zullen dat één voor één afwerken zo." Forest is the first theme of that
series. The analysis is [themes/forest/CHARACTER.md](../../themes/forest/CHARACTER.md): every decided forest pick measured, the
grammar G1-G16, the families, twenty outliers, the composites and twenty-three proposals. This page turns the proposals into the
questions Kenny answers to fix forest's grammar.

**Already decided, not asked again.** Kenny's family picks for forest (research/families/VERDICTS.md, 01:32): arrival = the strip's
_Growing_, live = the trend's _Growth ring_, hover = the graph's _Blazed_, tone = the strip's _field note_, shape = the meter's
_wooden gauge_; loading = the signature progress bar with the planted trees (02:54). The questions ask how those picks land on every
other component. **The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in forest it is a source of the
grammar (the hover family is its pick), never a target.

**What.** One page, forest only, in the review kit's aspect mode (`data-review-themes="forest"`). An intro, "What forest is" (the
field kit's story, the package's own parts including the tree bar, and on demand six decided character demos embedded as they are
today), then seventeen questions. Each question is one rule of the grammar and three options (six in question 1, four in question 4), each a live scene built from the
package's components in forest (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`,
`.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-skeleton`, `.kp-tooltip`, `.kp-empty`, `.kp-field`,
`.kp-page-header`). The first option is always the recommendation; every option says what you see and why it is or is not
recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                                                |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | grows like a tree · pushes, then unfurls · three spurts · the register's curve · titanium's quick curve · the current mix |
| 2   | The direction (G2)                    | growth up, walking start → end · everything start → end · as today                                                        |
| 3   | Opening what drops from a button (G3) | grows out of its anchor · the map unfolds · as today                                                                      |
| 4   | How long things take (G4)             | 200 · 1000 · 3200 ms · 120 · 500 · 2000 · 300 · 1600 · 4800 · the first proposal 200 · 320 / 520 / 800 · 3200             |
| 5   | Where the colour goes (G5)            | green acts, clay marks the trail · the leaf palette as decoration · forest ink only                                       |
| 6   | The corners (G6)                      | paper rounded, wood cut · the gauge's 3 px on everything · the leaf corner                                                |
| 7   | The surface (G7)                      | paper for plates, wood for instruments · wood on everything · plain kraft                                                 |
| 8   | A live update (G8)                    | the growth ring on every carrier · a new ring laid round it · as today                                                    |
| 9   | Loading (G9)                          | the planting strip on every waiting surface · a stand grows behind the content · as today                                 |
| 10  | The spinner (G9)                      | a tree is planted · growth rings · the compass (today)                                                                    |
| 11  | Leaving and arriving (G10)            | withers into the ground, grows out of it · the autumn fade (today) · blown by the wind                                    |
| 12  | Buttons inside composites (G11)       | exactly forest's own · as today · forest's own plus the header's green foot                                               |
| 13  | Pointing at something (G12)           | the blaze ring · the blaze mark · the lift (today)                                                                        |
| 14  | The focus ring (G12, DI2)             | the two-channel ring · the ring with a blaze round it · as today                                                          |
| 15  | The press (G12)                       | the blaze closes in · settles 1 px (titanium's) · shrinks 2 %                                                             |
| 16  | The voice of a note (G13)             | italic for notes · monospace for tags and labels · a serif italic                                                         |
| 17  | Trig points, blazes and rings (G14)   | only where the map or the wood has them · none · on everything                                                            |

**How.**

- `demo.js` holds the seventeen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and
  the verdict), builds the rows (`data-fc-aspect`, option cells `data-fc-option`) and writes `data-review-choices` from the same
  data, so the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-fc-<question>="<key>"` on the scene. Colours are
  tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "today"
  options reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos' own CSS, so
  one scene shows the same parts in every option).
- The planting strip is the register's own busy progress bar (`.kp-progressbar[data-kp-indeterminate]`) at
  `--kp-progressbar-scale: 0.8`, so it is the decided picture exactly, at 1 rem. The single planted tree (a day, the spinner) is
  three fixed drawings from the bar (seedling, sapling, the first pine of its tree tile) shown one at a time; a mask is never
  animated (an animated `mask-image` drew a bare rectangle in the review dialog's stage, measured in Firefox).
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-fc-phase`: gap, in, hold, out), so
  the options of a row start together. Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it. Loading pictures loop in CSS.
- Hover, focus and press are shown standing still on marked parts (`.fc-pointed`, `.fc-focused`) and by the clock (`.fc-press`), so
  they can be compared without a pointer; the State buttons force a state on every button of question 12, and the dialog presses
  Hover there by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=forest`) only
  when it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every
recommendation was measured against titanium's decided grammar and the other registers (CHARACTER.md §7). Three first
recommendations overlapped and were replaced by a forest-own one: the quick curve (titanium's exactly) by the register's own
slow-start curve, the swell (light's "A soft swell") by a growth ring drawn round the change, the 1 px settle (titanium's press) by
the blaze closing in. Each overlap stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's three options side by side and mid-motion
frames, plus the review dialog's one-option stage): the corners question first offered "one radius everywhere", which differed
from the recommendation only on the tags; it now offers the gauge's 3 px on every plate and the leaf corner on every plate, which
differ at a glance. The "slow" durations first shared the 520 ms dialog with the recommendation; it now unfolds in 780 ms.

**Remade after Kenny's verdicts on question 1** (2026-10-07 15:13 to 15:16: the dialog "staat er toch bijna instant", it read
"veel trager dan a menu", forest must grow "van beneden naar boven … ik wil het element zien groeien", a menu grows down from its
button, close is open reversed). Measured per frame in Firefox (every animation paused and sought every 40 ms, the scene's pixels
compared with its empty and its finished frame): before, the recommended dialog was open in about 0.4 s (two folds, the curve per
fold, 520 ms) while the stems took 0.9 s, the menu in 0.32 s, and the tile showed 60 % of itself on the first frame; every close in
questions 1 to 4 was a cut, because a CSS animation whose name stays the same is not restarted when only its direction changes. Now
every part in question 1 grows for the same second on the option's curve only (the dialog and tile up out of their base, the menu
down out of its button, a stem beside an even-pace stem), questions 2 to 4 and 11 grow on forest's growth curve, and every leave is a
copy of the arrival's keyframes played `reverse`: its frames are the arrival's in reverse order (0.0 % pixel difference, measured).
A press is let go as it was pressed (transitions both ways, 200 ms) instead of at once. The map's fold now runs one progress value
(`--fc-p`) on one curve over the whole run.
