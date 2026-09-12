# Kenny's verdict on every theme — 2026-09-11

**Why this document exists.** Round seven opened as one new theme and
turned into something larger the moment Kenny looked at the whole set. He
wrote an evaluation of all twenty-five in one go, and named the thing he
is actually after:

> "Wat een goed thema zo cool maakt, zijn de individuele quirks, zoals bij
> nostromo het bolletje dat voor de naam van de actieve pagina komt te
> staan in de navbar, dat is uniek gedrag dat past bij het thema. Ik wil
> dat alle thema's is goed nadenken over hoe ze elementen eigen kunnen
> maken."

A quirk is **behaviour that belongs to one theme**, not decoration. That
distinction is what the measurement below settles.

## What the measurement says about shape

Counted on 2026-09-11 across the twenty-five registers: how many times
each one reaches for `clip-path`, the property a theme uses when it wants
a silhouette of its own.

| Registers using it most | Count |
| ----------------------- | ----- |
| cyberpunk | 36 |
| phantom, solstice | 10 |
| retro | 8 |
| shade-light | 7 |
| lapis | 6 |
| blueprint, light | 5 |
| high-contrast, nostromo, woodblock, synthwave | 4 |
| pastel | 3 |
| forest | 2 |
| deco | 1 |

Ten registers use it **zero** times: academia, brutalism, dark, formal,
grotesk, mono, sepia, shade-dark, terminal, ticker. On the same day,
across the button rule of every register, only blueprint declares a
polygon directly on `.kp-button`; every other theme's button is either a
plain rectangle or the default corner radius.

**And the count does not predict Kenny's verdict.** Terminal uses no
clip-path at all and he calls it "al heel goed". Brutalism uses none and
he calls it "al heel goed vormgegeven". Solstice uses ten and he calls it
too sober. So the quirk he wants is not a shape budget — what the themes
he praises share is a *behaviour*: nostromo's dot that marks the active
page, cyberpunk's notch that moves to whichever side of the screen the
navbar is on, retro's whole page becoming a window on a desktop,
terminal's cursor sitting inside the focused field rather than beside its
label.

## The verdicts, one row per theme

| Theme | Kenny, 2026-09-11 | What round seven does with it |
| ----- | ----------------- | ----------------------------- |
| academia | "mag verwijderd worden, niet meer nodig" | **leaves the set** |
| blueprint | "al heel goed, maar suggesties mogen altijd" | optional; a proposal only if it earns its place |
| brutalism | "al heel goed vormgegeven, maar sta open voor opties, misschien vooral effecten hier?" | an effects pass, not a redesign |
| cyberpunk | "heel goed in, die is heel distinct en perfect" | untouched, and the reference for what a quirk is |
| dark | "mag zijn sterren weer kwijtspelen op de achtergrond" | **done 2026-09-11** — and it was in two places, not one: the register's 102-point field with its ten shimmer stars (round six), and the base layer's own "Observatorium" from round one. Both gone. The divider keeps its dense local sample, which is a seam between sections rather than the background he named |
| deco | "al heel mooi, ook open voor suggesties" | optional |
| forest | "moet ook niet aangepast worden tenzij je een goed idee hebt" | optional, and the bar is high |
| formal | "mag op zich simpel blijven" | untouched |
| grotesk | "kan nog beter"; the theme picker sits far left | a quirk of its own; the picker is the queue's own row about the picker moving per theme, and is measured below |
| high-contrast | "mogen wel ideeën krijgen" | a quirk of its own |
| lapis | "kan ook nog beter, heeft wel een distinct kleurenschema maar mist nog iets" | **done 2026-09-11** — the fourfold ruling he chose ("A de vierdubbele liniëring"), on every button and every field: three rules at rest, five once touched, and the keyboard ring in front of them so DI2 keeps both halves |
| light | "mag simpel blijven" | untouched |
| mono | "gaat eruit, niet meer nodig" | **leaves the set** |
| nostromo | "redelijk goed, maar kan ook nog beter" | a quirk of its own — and its dot is the example the whole round is built on |
| pastel | "mag zeker wat individualiteit tonen bij sommige elementen" | **done 2026-09-11** — the sticker he chose ("A de sticker"): a hard offset drop at rest, a lift and a nudge askew under the pointer, pressed completely flat. The active row of its side navigation wears the same gesture |
| phantom | "één van de uniekst ogende thema's, al heel goed" | untouched |
| retro | "prachtig (wel heel anders qua breedte, is misschien deel van het effect?)" | untouched — and yes, measured below |
| sepia | "mogen wel ideeën krijgen"; and the scanline must go | a quirk of its own; the scanline is measured below and is not there |
| shade-dark | "nogal sober, mag zeker verbeterd worden" | a quirk of its own |
| shade-light | "nogal sober, mag zeker verbeterd worden" | a quirk of its own |
| solstice | "mag wel wat minder sober" | a quirk of its own |
| synthwave | not mentioned | no instruction either way; left as it shipped |
| terminal | "al heel goed" | untouched |
| ticker | "mag verwijderd worden, niet meer nodig" | **leaves the set** |
| woodblock | "mag verwijderd worden, niet meer nodig" | **leaves the set** |

Six untouched, four optional, ten getting a quirk, one unmentioned, four
leaving. Twenty-one remain; with hypertech the set is twenty-two.

## Three observations, measured rather than accepted

**The scanline on sepia is not in sepia.** Sepia's register declares
exactly one keyframe, a 160 ms fade on a dialog backdrop
(`css/sepia-register.css:1047`). Searched across every stylesheet for a
keyframe that moves something a screen's height: there is exactly one in
the package, `kp-sweep` in `css/terminal-register.css`, which translates a
band by `100vh + 140px` and is scoped to `[data-theme='terminal']`. So
the effect Kenny wants removed from sepia is already only on terminal —
the one theme he called "al heel goed". Nothing to remove; his wider
point, that this effect suits very few themes, is already how the package
is built.

**Retro's width is the window, and Kenny guessed it.**
`css/retro-register.css:311` makes the whole `body` a 1995 window:
`max-inline-size: 84rem`, centred with a margin, three pixels of padding
and a border, on a desktop-coloured root. It is deliberate and it is the
effect. Only one other register touches the page container at all.

**Grotesk's picker is not grotesk's doing.** The only rule in its
register that offsets anything by a column is on the alternate divider
(`css/grotesk-register.css:191`). The picker sits where the bar's
contents put it, which is the queue's existing row about the picker
moving from theme to theme — a constraint on every register rather than a
fix in one.

## Where the ideas come from

Kenny's own list, from the three hypertech worlds he was shown:

- Buttons **and form inputs** with a shape of their own — "de gele zaal".
- A button whose round end is mirrored so it points the other way: keep
  the submit as it is, mirror the destructive one so the round side is on
  the right — "event display".
- Double-layered buttons where the second layer converges on hover, and a
  ghost button built the same way — "interferometer".
- "Meer unieke vormgevingen zijn goed."

## What each theme is getting, as of 2026-09-11

Five of the ten that needed a quirk now have one, and the sixth is
handled by replacement rather than by addition.

| Theme | Its quirk | Settled |
| ----- | --------- | ------- |
| dark | replaced outright by the spectral instrument | scope-16 |
| pastel | the sticker: a flat offset shadow, a lift and a nudge, pressed flat | scope-24 |
| solstice | the line that opens out of a short bar into the control's whole edge, lit from below | scope-24 |
| nostromo | the moulded step, and the accent bar rising along the right edge | scope-24 |
| grotesk | the rule that starts short under a control and becomes its whole edge | scope-24 |
| blueprint | the measurement frame from the command table, replacing its own | **done 2026-09-11** — four corner brackets and one readout printing the box they hold, in place of two dimension lines with four ticks and two labels. Four keyframes became one fade used twice |
| high-contrast | the flip: a control turns into its own negative with no transition, and the yellow exists only while something is pressed | scope-25 |
| sepia | the ink spreading into the paper on a press, and a rule that is thickest in the middle | scope-25 |
| shade-light | the pointer is the light, and a control throws its shade away from it | scope-25 |
| shade-dark | the same light, the other reading: a control lies in shade and the pointer lifts it out | scope-25 |
| lapis | the fourfold ruling: four concentric rules instead of one border, closing around the word when it is touched | scope-27 |

**All ten are settled.** None of them is a shape left over from a demo:
every one comes out of the sentence that theme already used to describe
itself, which is what scope-12 asked for. Two needed a second attempt —
solstice, where the first drawing overflowed a rounded corner, and lapis,
where gold leaf catching the light turned out to be a property of a
material rather than something a manuscript does.

## Six built into their registers, 2026-09-12 [scope-12]

Kenny answered the eight-quirk form on 2026-09-11. Six were actionable
without him and are in the package, each with a test in its register spec
and a drill that drove that test red:

| Theme | What it does | Where |
| --- | --- | --- |
| high-contrast | nothing fades — a state change is a switch, and the touched control inverts outright | `css/high-contrast-register.css` |
| nostromo | the dot becomes a lamp on every control: dark at rest, lit under the pointer, full when pressed | `css/nostromo-register.css` |
| shade-light | one light at the top left that everything obeys; pressed, the control goes under the surface | `css/shade-light-register.css` |
| sepia | the marginal bracket, drawn beside the touched control, where a reader writes | `css/sepia-register.css` |
| solstice | the low sun rakes once across the touched control, `kp-rake` | `css/solstice-register.css` |
| brutalism | the thing names itself, in English, through `--kp-label` | `css/brutalism-register.css` |

**Kenny's answers, 2026-09-12.** The six are signed off ("Klopt") and
shade-dark is approved ("Goedkeuren"), so seven of the eight are closed.
Grotesk is the one left, and his answer there was **neither** — see the
note below, which also records that what he was shown was broken.

**Two still open.** Grotesk was rejected — "als ik hover dan
vergroot/verkleint de knop zelf, dat is geen wenselijk gedrag" — and needs
a proposal that does not change the control's size. Shade-dark's hover was
the `fix-11` fault and is fixed; its press half is still to be measured
against his reading that clicking the button shows nothing.

**Two findings for Kenny [S49].** Both are places where a quirk he
approved collides with a value an approved concept demo already pinned,
and neither has been decided here:

1. **shade-light's light stops at the button variants.** The round-six
   demo draws the primary, ghost and destructive buttons FLAT and its own
   test pins that. "One light everything obeys" and "the buttons are flat"
   cannot both hold. The elevation reaches the plain control only, until
   he rules.
2. **high-contrast's inversion stops short of the mirror's press.** That
   demo draws the mirrored button dropping onto its own offset with no
   shadow; the inversion's two bars would have replaced it. The inversion
   now excludes `.kp-button--mirror` and `:active`.

## The shade collision, settled 2026-09-12 [S49]

Kenny's answer to the first finding was **"De demo houdt gelijk"**: the
approved round-six demo draws the primary, ghost and destructive buttons
flat, and it keeps that. The light of shade-light and shade-dark reaches
the plain control only — `:not([class*='kp-button--'])` in both registers
— and the demo tests stay as they were. This is a decision, not an
oversight, and it is written here so a later reader does not "fix" it.

The second finding, the mirror button under high-contrast, he could not
answer: _"geen idee wat je bedoelt, laat zien"_. It goes to a deep-dive
round with the thing itself on screen.

## Grotesk's first two proposals, and why one of them did not count

Kenny answered **"allebei niet"** on 2026-09-12, and added: _"bij de
grond komt aan was de achtergrondkleur van de knoppen helemaal fout btw,
leek precies appelblauwzeegroen"_.

He is right, and it was a defect in the demo rather than a matter of
taste. Proposal A laid a block of the theme's red over the control with
`mix-blend-mode: difference`. Difference subtracts, so on the white
ground of grotesk the block painted `255-224, 255-6, 255-26` =
`rgb(31, 249, 229)` — cyan, not red. The mechanism was chosen for what it
does to the LETTERS and never checked for what it does to the GROUND
behind them.

So A was never seen. The next round shows two new proposals with their
painted colours measured in the browser first, and says plainly that A's
rejection rests on a demo that was broken.

## All twenty-five carry a quirk, 2026-09-12

Kenny chose **"De basislijn verschijnt"** for grotesk and **"Zo laten"**
for the mirror button. Both are in.

**Grotesk: the baseline appears.** One 2px rule in the theme's red, drawn
from the leading edge out past the word, with its top edge exactly on the
type's baseline — so the letters stand on it and the descenders cross it.
It reaches `.kp-button__label`, `.kp-nav__link` and `.kp-sidenav__link`.
The press thickens it to 4px in `--primary-active`, growing downward so
the top edge stays put, and instantly, because a click is shorter than a
transition.

The placement is measured, not guessed. Firefox reports Inter 700 at 16px
in a 19.20px line box with ascent 16.00 and descent 4.00, so the baseline
sits 3.60px above the box bottom — `0.225em`. A first measurement said
9.60px, because a zero-width inline probe inside `.kp-button__label`
becomes a flex item, where `vertical-align` does nothing.

Measured across all three states: the label is 102.65px wide at rest,
hovered and pressed. That was the whole complaint the quirk replaces —
the first proposal grew an eight-character label by about 13.8px.

**The mirror button stays as it was.** The inversion of high-contrast
excludes `.kp-button--mirror` and `:active`, so the demo's clean drop onto
its own offset survives. This is Kenny's decision of 2026-09-12, not an
omission.

| Theme | Quirk | Settled |
| --- | --- | --- |
| high-contrast | nothing fades — the touched control inverts outright | 2026-09-12 |
| nostromo | every control gets its own lamp | 2026-09-12 |
| shade-light | one light at the top left, the press goes under | 2026-09-12 |
| shade-dark | the same light on the other material | 2026-09-12 |
| sepia | the marginal bracket, beside the control | 2026-09-12 |
| solstice | the low sun rakes across, once | 2026-09-12 |
| brutalism | the thing names itself, in English, through `--kp-label` | 2026-09-12 |
| grotesk | the baseline appears under the label | 2026-09-12 |

## The two new themes, tokens in, 2026-09-12

Kenny answered the four values one by one. The two themes are in the
package as token layers; their registers are the next step.

**The pressed state: "Het thema zet zijn eigen indruk."** The derivation
takes one step off the resting colour for hover and two for the press,
which is right almost everywhere and wrong at the ends of the lightness
scale. The spectral instrument's signal is 93% lightness and titanium's
is 87%, so two steps down measured 4.9 and 9.95 against a floor of 10 —
pressing either control would have changed nothing anyone could see,
which is the fault KT2 exists about.

Rather than darken two signals a demo had approved, a theme may now write
its own state, the way it could already write its own `--link`. Authored
wins in three places, all changed together: `gates/generate-themes.mjs`
for the app surfaces, the same file for the hero, and
`gates/check-invariants.mjs`, which until 2026-09-12 re-derived
unconditionally and so would have measured a theme on the very value it
had replaced.

Both demos already wrote their own hover by hand, so the package was
behind its own demos here.

| Theme | Signal (untouched) | Hover | Press | Measured |
| --- | --- | --- | --- | --- |
| dark | 93% | 86%, as the demo writes it | 78% | 11.61 |
| titanium | 87% | 80%, as the demo writes it | 74% | 10.64 |

**The three colours.** Dark's muted text 50% → **53%**, dark's hero
border 30% → **38%**, titanium's hero border 40% → **41%**. Kenny chose
52% for the first on a figure that turned out to be two hundredths
optimistic: the package's own maths reads 4.48 there, not 4.50. He chose
the option described as the smallest number that clears the floor, and
53% is the smallest number that actually does.

**What is not built yet.** Neither register. Titanium's hooks row is
empty, which says the base layer answers all six — true while it is a
token layer and nothing more.

## Both registers, 2026-09-12

The two themes are no longer token layers. Each carries a register built
from its own approved demo, and the two are near neighbours in the set —
both dark, both chamfered, both carrying an oxide — so what separates them
is written down here as well as in the files.

**The spectral instrument (dark).** A near-black face, a pale signal, and
every colour reserved for the film. Its button does three things at once
and none of them is a colour change: two brackets close on the label, the
label draws itself in to 0.94, and the film runs along the bottom edge.
The rule under a heading is the film scaling out from the leading edge;
the divider is the edge of a ruler — a hairline that fades at both ends,
ticks standing on it, the film across the middle third. The headline
converges: the word arrives split into two of the film's own wavelengths,
out of focus, and the halves come together as the blur clears.

**Titanium.** The corner is cut on the OTHER diagonal, with a bright line
along the top where the tool left the face. The film is a linear sweep,
not a conic one, because an oxide on a flat machined face runs across the
surface rather than turning about a point — and it CATCHES rather than
sweeps: it lies over the whole face at `mix-blend-mode: screen` and simply
becomes visible, the way an anodised part does when it turns into the
light. Sixty milliseconds, linear. No brackets, because those are an
instrument annotating what it has selected and a material does not
annotate. No label shrink, because metal has no give — a press drops the
whole control one pixel. The ground is carbon twill, two diagonals
crossing; the divider is a milled groove with a bright lip above and
below, the film lying in it.

**One hazard worth writing down.** A keyframe name is global. Both
registers started from the same file, so both declared `kp-resolve`, and
whichever loaded last would have handed its shape to BOTH themes.
Titanium's headline is `kp-mill` for that reason. Five registers do share
`kp-dialog-in`, and that is correct: they share the shape. These two do
not.

**Both themes' words were rewritten.** Dark's copy still described the old
theme — "quiet hours", "112 irregular points", "a light unsaturated
violet" — none of which is true of the theme that replaced it.
