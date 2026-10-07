# What makes nostromo nostromo

**Why.** Kenny, 2026-10-07 03:50, while he judges forest: "doe terwijl nostromo al", the same way as titanium and forest (02:54:
"waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet? begin met 1 thema en we zullen dat één voor
één afwerken zo"). Nostromo is the second theme of that series. The analysis is
[themes/nostromo/CHARACTER.md](../../themes/nostromo/CHARACTER.md): every decided nostromo pick measured, the grammar G1-G18, the
families, nineteen outliers, the composites and twenty-six proposals. This page turns the proposals into the questions Kenny answers
to fix nostromo's grammar.

**Already decided, not asked again.** The lamp on every switch (scope-12, 2026-09-11), Beige Freight (2026-09-08), the size change
and the reverse-close pairing, and every component pick of the character round. Nostromo has no family picks
(research/families/VERDICTS.md: still open), so the questions derive the grammar from the component picks and the theme's world: the
warm-up five times (arrival), the klaxon five times (tone), the amber CRT, the duty roster and MU/TH/UR's screen (the screen), the
backlit vents and the indicator panel (the case). **The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in
nostromo it is a source of the grammar (its lamp that blinks, its panel that switches on), never a target.

**What.** One page, nostromo only, in the review kit's aspect mode (`data-review-themes="nostromo"`). An intro, "What nostromo is"
(the ship's console: the case and the screens, the package's own parts, and on demand six decided character demos embedded as they
are today), then eighteen questions. Each question is one rule of the grammar and three options, each a live scene built from the
package's components in nostromo (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`,
`.kp-progressbar`, `.kp-spinner`, `.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-skeleton`, `.kp-tooltip`, `.kp-empty`, `.kp-field`,
`.kp-page-header`). The first option is always the recommendation; every option says what you see and why it is or is not
recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                       | Options, recommended first                                                                       |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | The motion curve (G1)                 | the ship's frame clock · smooth on the register's curve (four themes share it) · the current mix |
| 2   | The direction (G2)                    | the raster, rows from the top · everything start → end (titanium's) · as today                   |
| 3   | Opening what drops from a button (G3) | the tube strikes on · the tracker pings it open · cut open from the top (titanium's)             |
| 4   | How long things take (G4)             | 160 · 320 · 640 · 1600 ms · 80 · 160 · 320 · 960 · 240 · 480 · 960 · 2400                        |
| 5   | Where the colour goes (G5)            | ink acts, the lamp indicates, the screen amber · green phosphor (terminal's) · orange acts       |
| 6   | The corners (G6)                      | moulded plates, keys, tape and glass · 0.75 rem on everything · 2 px on everything               |
| 7   | The surface (G7)                      | the case and the screen, each its own · a screen on everything · only the case                   |
| 8   | A warning (G13)                       | the klaxon frame · the tone lamp · as today                                                      |
| 9   | A live update (G9)                    | the reading's lamp lights · a blip (dark's and synthwave's flare) · as today                     |
| 10  | Loading (G10)                         | the lamp bank computes · the lamps scan (synthwave's marquee) · as today                         |
| 11  | The spinner (G11)                     | the tape reel · a ring of lamps computes · the tracker pings                                     |
| 12  | Leaving and arriving (G12)            | switched off, struck on · the flare (today) · scrolls off the top                                |
| 13  | Buttons inside composites (G17)       | exactly nostromo's own · as today · nostromo's own plus the header's stripe                      |
| 14  | Pointing at something (G8)            | the switch's lamp lights · a scanline sweeps · as today                                          |
| 15  | The focus ring (G14, DI2)             | the two-channel ring, the lamp lit · the ring, the lamp lit orange · as today                    |
| 16  | The press (G14)                       | the key goes in · drops 1 px (titanium's) · as today                                             |
| 17  | The voice (G15)                       | label tape names, Michroma counts · mono for figures (titanium's, terminal's) · Michroma only    |
| 18  | Lamps, tape, vents, screws (G16)      | only where the ship has them · none · on everything                                              |

**How.**

- `demo.js` holds the eighteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and
  the verdict), builds the rows (`data-nc-aspect`, option cells `data-nc-option`) and writes `data-review-choices` from the same
  data, so the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-nc-<question>="<key>"` on the scene. Colours are
  tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "today"
  options reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos' own CSS, so
  one scene shows the same parts in every option).
- The frame clock is a set of `linear()` easings (`--nc-f1` … `--nc-f12`, the count of 80 ms frames): the register's curve, each
  frame holding the value at its start, so the first frame shows the part switched on (a line, a lamp) and the last lands.
- The lamp bank is the signature progress bar's LED window drawn again (`.nc-bank`): a sixteen-LED pattern tile shifted by 0, 6, 3,
  13 and 9 LEDs, one shift every 320 ms (`steps(1)`), so nothing travels; the scan option moves one block of three LEDs instead.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-nc-phase`: gap, in, hold, out), so
  the options of a row start together. Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it. Loading pictures loop in CSS.
- Hover, focus and press are shown standing still on marked parts (`.nc-pointed`, `.nc-focused`) and by the clock (`.nc-press`), so
  they can be compared without a pointer; the State buttons force a state on every button of question 13, and the dialog presses
  Hover there by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=nostromo`) only
  when it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every
recommendation was measured against titanium's decided grammar, forest's proposed one, the other registers and the families' picks
(CHARACTER.md §7). Six first recommendations overlapped and were replaced by a nostromo-own one: the smooth register curve (formal's,
light's, brutalism's and grotesk's too) by the frame clock, the blip (dark's and synthwave's live flare) by the reading's lamp, the
scanning lamps (synthwave's marquee) by the lamp bank computing, the cut from the top (titanium's opening) by the tube striking on,
mono figures (titanium's and terminal's voice) by Michroma figures, and the 1 px press (titanium's) by the key going in. Each overlap
stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's three options side by side, paused
mid-motion frames of the motion rows, and the still rows at rest): the frame clock first ran at 40 ms frames, which could not be told
from the smooth curve; it now runs at 80 ms frames and holds each frame's starting value, so the strike shows its line first. The
focus question first offered "the ring alone", which differed from the recommendation only by an ink dot; it now offers the lamp lit
orange. The press first differed from titanium's 1 px drop only by a faint shadow; a key now rests raised and falls into a shadowed
well.
