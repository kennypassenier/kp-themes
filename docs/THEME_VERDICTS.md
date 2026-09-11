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
| dark | "mag zijn sterren weer kwijtspelen op de achtergrond" | the starfield goes |
| deco | "al heel mooi, ook open voor suggesties" | optional |
| forest | "moet ook niet aangepast worden tenzij je een goed idee hebt" | optional, and the bar is high |
| formal | "mag op zich simpel blijven" | untouched |
| grotesk | "kan nog beter"; the theme picker sits far left | a quirk of its own; the picker is the queue's own row about the picker moving per theme, and is measured below |
| high-contrast | "mogen wel ideeën krijgen" | a quirk of its own |
| lapis | "kan ook nog beter, heeft wel een distinct kleurenschema maar mist nog iets" | a quirk of its own |
| light | "mag simpel blijven" | untouched |
| mono | "gaat eruit, niet meer nodig" | **leaves the set** |
| nostromo | "redelijk goed, maar kan ook nog beter" | a quirk of its own — and its dot is the example the whole round is built on |
| pastel | "mag zeker wat individualiteit tonen bij sommige elementen" | a quirk of its own, in its own risograph language |
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
