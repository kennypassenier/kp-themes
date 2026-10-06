# Every component's pick, family by family, per theme

Kenny, 2026-10-06 23:52: "Misschien helpt het om alle bestaande laadschermen
per thema te tonen, zodat ik dan bij andere thema's ook kan kiezen welke de
beste zijn of eventueel nog eentje laten bijmaken. Hetzelfde doen we dan per
familie van animaties of keuzes."

## What

Every character demo (`research/character-*`) is decided: one pick per
aspect per theme. This page lays those picks side by side by family, for one
theme at a time: every loading picture together, then every arrival, every
live update, every hover, every tone and every shape. It is a review-kit demo
in aspect mode, so it is judged in the dialog like the character demos: per
theme one step per family, one component's card at a time (←/→ flips, ↑ picks
it, ↓ is None of these with a note, R replays, E slows every card). The
answer says, per theme and family, which component's picture the whole theme
should speak.

## Why

Each component's pick was made on its own. Seen together, a theme's loading
pictures can be compared, and one of them chosen as the theme's own, or a new
one asked for.

## How

- `demo.js` holds the one table that maps a family to each demo's own aspect
  id (loading is `loading`; an arrival is `arrival`, `open`, `openclose` or
  the header's `menu`; a live update is `live`, `update` or `change`; hover is
  `hover`, `interact`, `interactive`, `focus` or `select`).
- Each card is the component's own demo in a frame,
  `../character-<c>/demo.html?embed=<aspect>&theme=<theme>`. The embed mode
  is the review kit's (`research/_review/review.js`, "Embed mode"): the demo
  shows only its combination of the picks (the element marked
  `data-review-preview`) and presses its own buttons for the aspect (those
  whose `data-review-plays` names it, as the dialog's autoplay does). A frame
  loads only while its card is on screen.
- The frame shows the decided picks: the embed reads the demo's own
  `decided.json` (the meter's was written 2026-10-07 from its round-3 PICKED
  and the round-4 verdicts in its README) and plays each key into the preview
  as a dialog tick (`review:choice`) when it is one of the aspect's options,
  or writes it on the preview's `data-<prefix>-<aspect>` otherwise. Measured
  2026-10-07: 13 demos × 19 themes, every aspect's shown key equals
  `decided.json`.
- A card's caption: the component, the picked option's name (told by the
  frame, from the demo's own "Your combination" words), the decided key, and
  one line under them: the buttons pressed for the family, or what the played
  pointer is on; a frame that shows another key than the decided one turns the
  card red and says so.
- Hover, focus, press: a script cannot hover, so for calendar, key figure,
  menu and header (`point=1`) the kit copies every `:hover`,
  `:focus-visible`/`:focus` and `:active` rule onto attributes and walks them
  over up to four of the preview's parts (the demo's own rules first), each
  pointed at, focused and pressed in turn. Tiles presses its own Pointed at;
  the graph's "focus" is a standing state (Pump house 3 picked, Telemetry
  hidden), pressed through its toggles.
- Buttons the dialog must not press but an embed should carry
  `data-review-embed-plays` (graph: the pick and hide toggles for focus; menu:
  Open for interact; columns: Drawn for its tone, the change under each
  figure, which has no state of its own).
- When the dialog switches the theme, every card follows.
