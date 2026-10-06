# A spinner for titanium

**Why.** Kenny, 2026-10-07 00:54: "ik wil ook een paar nieuwe ontwerpen voor de spinner (die ook in andere componenten
terugkomt)". Titanium's spinner today is the drill (`.kp-spinner`, `kp-sig-titanium-ti-flutes`, 480 ms, in
`css/titanium-register.css`). Six new ideas from a machine shop that works titanium, judged against the decided grammar in
[themes/titanium/CHARACTER.md](../../themes/titanium/CHARACTER.md) §0 and §1, with the anodising bath as the loading reference.

**What.** One page, titanium only, in the review kit's aspect mode: one aspect, "The spinner", seven options, the
recommendation first and the drill as today last.

| #   | Option              | Echoes                                                      | Period            | Oxide                             |
| --- | ------------------- | ----------------------------------------------------------- | ----------------- | --------------------------------- |
| 1   | The facing cut      | a bar's end face on the lathe, the tool tip leaving heat    | 1800 ms, linear   | trail behind the tip, gold → cyan |
| 2   | The tag in the bath | an anodising tag dipped start → end, the film growing       | 1800 ms, linear   | the film behind the waterline     |
| 3   | The indexing turret | a hexagonal six-station turret indexing                     | 1800 ms, steps(6) | the stations that just cut        |
| 4   | The end mill        | a four-flute cutter end on, flutes catching heat in the cut | 960 ms, linear    | blended onto flutes in the cut    |
| 5   | The dial indicator  | a test gauge's needle sweeping a twelve-tick face           | 1800 ms, linear   | none (a gauge is not heated)      |
| 6   | The slitting saw    | a toothed slitting saw on its arbor                         | 1200 ms, linear   | none (the coolant takes the heat) |
| 7   | The drill, as today | the register's drill bit, unchanged                         | 480 ms a pitch    | the register's two iris bands     |

Each option shows the spinner where it really appears: alone at 0.75, 1.25 and 2.5 rem and beside a line of text, inside a
busy primary and secondary button, in the data table's busy overlay panel and its status line, in two calendar days being read
(`.kp-calendar--busy-days`), and beside an anodising-bath tile. A line-up at the top shows the seven side by side at three
sizes on the page's ground and on a card's.

**How.**

- `options.css` (in `@layer kp.signature`) draws every option on the package's own `.kp-spinner` and its two pseudo-elements,
  scoped by `[data-ts-spinner='<key>']`, so the contract is unchanged: one span, `--kp-spinner-size`, `role`/`aria-*` on the
  span. Tokens only; every animation sits under `prefers-reduced-motion: no-preference`; the still pose is the base and reads as
  busy on its own (the tip with its tail, the tag six tenths in, the lit station, the needle at zero). Loops are linear (or
  steps for the turret's count), never an overshoot; the feed is clockwise, mirrored for `dir="rtl"`. The drill option is the
  register's own, only its period follows the page's speed buttons.
- `demo.js` holds the options as data (`OPTIONS`: name, what you see, verdict) and builds the row (`data-ts-aspect`, cells
  `data-ts-option`) and `data-review-choices` from the same data, so the page and the dialog cannot disagree. The busy overlay's
  top and bottom knobs are measured here, since the table has no script of its own on this page.
- The anodising-bath tile reproduces `r2-ti-load-1` (research/character-kpi/round2-d.css): same band, stops and 2200 ms.
- Nothing in `css/titanium-register.css` or the character demos is touched.
