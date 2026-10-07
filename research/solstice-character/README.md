# What makes solstice solstice

**Why.** Kenny, 2026-10-07 04:23: the themes one by one, in this order: cyberpunk, synthwave, solstice, brutalism, grotesk,
blueprint; solstice third in that order, the same way as titanium, forest, nostromo, cyberpunk and synthwave (02:54: "waar jij eerst
uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet"). The analysis is
[themes/solstice/CHARACTER.md](../../themes/solstice/CHARACTER.md): every decided solstice pick measured, the grammar G1-G18, the
families, seventeen outliers, the composites and twenty-eight proposals. This page turns the proposals into the questions Kenny answers
to fix solstice's grammar.

**Already decided, not asked again.** Low Sun (2026-09-08), the rake across a button (2026-09-11), the signature (2026-10-03), the size
change (dawn) and the leave Kenny picked (the morning mist, 2026-10-04), the reverse-close pairing, and every component pick of the
character round. Solstice has **no family picks** (research/families/VERDICTS.md lists it as open), so the grammar is read from the
component picks themselves. Several of them, drawn as they are, are another theme's picture (the mist is light's leave, the flare dark's
live family, the swell light's, the rake cyberpunk's charge, a straight cut up from the foot synthwave's rise); each is still on the page
as an option, named after the theme it meets. **The network graph is in no scene**: it changes in no theme (Kenny, 02:54); in solstice
it is a source of the grammar (the low sun, embers catching, kindled), never a target.

**Recording check.** The register's comment above `kp-sig-solstice-leave` says "an eclipse"; the keyframe draws the morning mist,
exit 2 of research/size-motion, the exit Kenny picked. The eclipse was exit 3 and was not picked; synthwave's and nostromo's analyses
read the comment. The leave question names this.

**What.** One page, solstice only, in the review kit's aspect mode (`data-review-themes="solstice"`). An intro, "What solstice is" (the
low sun on warm charcoal; the package's own parts, and on demand six decided character demos embedded as they are today), then eighteen
questions. Each question is one rule of the grammar, with three options, each a live scene built from the package's components in
solstice (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-meter`, `.kp-progressbar`, `.kp-spinner`,
`.kp-badge`, `.kp-tag`, `.kp-alert`, `.kp-tooltip`, `.kp-empty`, `.kp-field`, `.kp-page-header`, the divider). The first option is
always the recommendation; every option says what you see and why it is or is not recommended, on the page and in its hint in the
dialog.

| #   | Question (rule)                       | Options, recommended first                                                                                                              |
| --- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The motion curve (G1)                 | the sun's sine · the register's standard curve (sepia's and deco's) · a spring (pastel's)                                               |
| 2   | The direction (G2)                    | up from the foot, the sun start → end · across from the start (titanium's feed) · jump and spring                                       |
| 3   | Opening what drops from a button (G3) | kindled: a dome of first light from the foot · kindled as picked, a straight cut (near synthwave's rise) · fades in and rises (light's) |
| 4   | How long things take (G4)             | 240 · 480 · 720 · 2400 (units of 240 ms) · as the picks, the slowest · brisk 150 · 300 · 450 · 1200                                     |
| 5   | Where the colour goes (G5)            | amber acts, rust glows, cream reads, red fails · one amber · rust acts                                                                  |
| 6   | The corners (G6)                      | one soft radius on everything, concentric · as picked (square, 2 px, 0.25, 0.9 rem, pills) · pills (light's, pastel's)                  |
| 7   | The surface (G7)                      | lit from below · lit from above (the lanterns) · a horizon in the plate (near synthwave's floor)                                        |
| 8   | A warning (G13)                       | the red sky: the foot light in the tone · a halo round the mark (near synthwave's ring) · on the tone's plate                           |
| 9   | A live update (G9)                    | the new value rises into its line · a flare of sun (dark's) · a swell (light's)                                                         |
| 10  | Loading (G10)                         | the sun crosses along the foot · the embers breathe · embers rising                                                                     |
| 11  | The spinner (G11)                     | the sun's arc (the signature) · an ember that breathes · the package's ring                                                             |
| 12  | Leaving and arriving (G12)            | an eclipse, the light returning · the morning mist (Kenny's pick; light's leave) · dusk, the light sinking into the foot                |
| 13  | Buttons inside composites (G17)       | exactly solstice's own · as today · solstice's own but quiet (ghosts inside a composite)                                                |
| 14  | Pointing at something (G8)            | the sun rises under it · the rake (cyberpunk's charge) · it warms all over (light's warm glow)                                          |
| 15  | The focus ring (G14, DI2)             | the two-channel ring, the sun raised · one amber outline · a halo                                                                       |
| 16  | The press (G14)                       | it glows inside, an ember blown on · drops 1 px (titanium's) · its light sinks                                                          |
| 17  | The voice (G15)                       | the serif speaks, in sentence case · mono capitals (the dark themes' label voice) · the sans for everything but titles                  |
| 18  | Motifs (G16)                          | every motif means one thing · only the sun · on everything                                                                              |

**How.**

- `demo.js` holds the eighteen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and the
  verdict), builds the rows (`data-so-aspect`, option cells `data-so-option`) and writes `data-review-choices` from the same data, so
  the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-so-<question>="<key>"` on the scene. Colours are tokens
  only (a relative colour of a token where a lighter ink is needed: the failure's red lifted to 68 %, the warning's light at 50 %);
  every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The "as picked" options
  reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos' own CSS, so one scene
  shows the same parts in every option). Parts at rest are drawn as the recommended grammar has them (lit from below, one soft radius,
  the serif in sentence case, the sun crossing), so each question changes only its own rule.
- The foot light: each plate carries a `.so-foot` element, a rust wash rising from its foot and its foot edge lit; every state (pointed,
  focused, a tone) changes only its custom properties (`--so-foot-ink`, `--so-foot-k`, `--so-foot-h`, `--so-edge`, `--so-edge-w`).
- Kindled: what opens is uncovered by a dome of light from the middle of its foot (`clip-path: ellipse(0% 0% at 50% 100%)` →
  `ellipse(150% 150% at 50% 100%)`) from `brightness(1.35) saturate(1.3)`, cooling; closing is the dome sinking back.
- The sun crossing: a runner as wide as the sun's travel moves its own width with `translate` (the waiting part is an inline-size
  container, so the travel is `100cqi` less the sun), and the sun on it rises out of the foot and sets into it; a transform only. A day
  in the month has no room to cross: its sun rises and sets in place, the days a tenth of the period apart.
- The eclipse: a disc in the ground's charcoal with an amber corona, 115 % of the part's width, crosses it start → end (`translate`
  against the part's own `cqi`) while the part dims and goes; arriving, the disc moves off toward the end and the part comes back
  overbright.
- One clock in `demo.js` plays every scene that arrives, opens, presses, updates or leaves (`data-so-phase`: gap, in, hold, out), so the
  options of a row start together. It only writes attributes and text, in one pass, and never reads layout; rows far off screen are not
  rendered (`content-visibility: auto`). Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it. Loading pictures and the spinners loop in CSS.
- Hover, focus and press are shown standing still on marked parts (`.so-pointed`, `.so-focused`) and by the clock (`.so-press`), so they
  can be compared without a pointer; the State buttons force a state on every button of question 13, and the dialog presses Hover there
  by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode (`?embed=…&theme=solstice`) only when
  it is opened.

**Distinct from the other themes** (Kenny, 03:37: a theme exists to be distinct). Before it was handed over, every recommendation was
measured against titanium's decided grammar, forest's, nostromo's, cyberpunk's and synthwave's proposed ones, the other registers and
the families' picks (CHARACTER.md §7); light, also a sun and also warm, is solstice's nearest neighbour. Ten first ideas overlapped and
were replaced by a solstice-own one: the register's standard curve (sepia's and deco's exactly) by the sun's sine; the menu's straight
cut from the foot (synthwave's rise) by the dome of first light; the dialog's fade-rise (light's Sunrise) by the same dome; the flare of
a live change (dark's family) and the chart's swell (light's) by the rising value; the rake under the pointer (cyberpunk's charge) and
the warm wash (light's warm glow) by the sun rising under the part; the morning mist (light's leave nearly exactly) by the eclipse; the
1 px drop (titanium's) by the ember press; mono capitals for labels (the dark themes' label voice) by the serif in sentence case. Each
overlap stays on the page as an option, named after the theme it belongs to.

**Compared before it was handed over** (2026-10-07, Firefox, 1600 px wide, each row's options side by side at rest, and the motion rows
at a quarter speed mid-motion). The first fade-out at the end of a cycle also faded the next entrance in, which hid the dome; the fade
now runs only on the way out. The warning's sky was first drawn in `--warning-foreground`, a near-white that read as fog; it is now the
warning hue lit to 50 %, the words keeping the pale ink. The key figures' labels came out in the package's capitals; the scenes now set
them in sentence case. The composites' third option ("the header in amber frames") was the same as "as today" at rest; it is now the
quiet variant, ghosts inside a composite. A focused button showed the register's rake parked outside its start; the scenes no longer
unclip it. The busy button's spinner was amber on amber in every option; it now takes the face's ink everywhere (proposal-28).
