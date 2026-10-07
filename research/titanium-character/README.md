# What makes titanium titanium

**Decided (Kenny, 2026-10-07 00:51): every recommendation, except the motion curve = Eased** (applied in f637569f; see themes/titanium/CHARACTER.md §0).

**Why.** Kenny, 2026-10-07 00:05, on the alignment proposal in
[themes/titanium/CHARACTER.md](../../themes/titanium/CHARACTER.md): "ik wil eerst wel zelf evalueren wat de opties zijn, zodat ik
kan zien wat het beste past" and "maak een demo die mij helpt om te kiezen wat Titanium nu echt Titanium maakt, met voorbeelden en
aanbevelingen. Wees uitgebreid en zet er een woordje uitleg bij. Alles wat je denkt dat ik nodig zou hebben om dit thema uniform te
maken wil ik aangereikt krijgen."

**What.** One page, titanium only, in the review kit's aspect mode (`data-review-themes="titanium"`). An intro, "What titanium is"
(the material story, the package's own parts, and on demand six decided character demos embedded as they are today), then
seventeen questions. Each question is one rule of the grammar (G1-G13) and three options, each a live scene built from the
package's components (`.kp-button`, `.kp-dialog`, `.kp-popover` + `.kp-menu`, `.kp-card`, `.kp-kpi`, `.kp-badge`, `.kp-alert`,
`.kp-skeleton`, `.kp-field`, `.kp-page-header`). The first option is always the recommendation; every option says what you see and
why it is or is not recommended, on the page and in its hint in the dialog.

| #   | Question (rule)                  | Options, recommended first                                                 |
| --- | -------------------------------- | -------------------------------------------------------------------------- |
| 1   | The motion curve (G1)            | linear everywhere · eased (decelerate) · the current mix                   |
| 2   | The direction (G2)               | start → end feed · centre-out · mixed as today                             |
| 3   | Opening what drops from a button | cut open from the top · seated drop (today's menu) · scale from the button |
| 4   | How long things take (G4)        | 60 / 240 / 1800 ms · 40 / 160 / 1200 · 120 / 400 / 2600                    |
| 5   | Where the colour goes (G5, G6)   | oxide only as a cause · oxide as decoration · monochrome metal, one accent |
| 6   | The corners (G7)                 | square with the chamfer · square · small radius                            |
| 7   | Which corners are cut (G7)       | top-left + bottom-right · top-right + bottom-left · all four               |
| 8   | The surface (G8)                 | brushed grain, tool edge, engraving · plain matte · heavy texture          |
| 9   | A live update (G9)               | the heat tint on every carrier · the six current picks · a light glint     |
| 10  | Loading (G10)                    | the cutter leaving heat · the anodising bath alone · grey passes as today  |
| 11  | Leaving and arriving (G11)       | cool-away start → end 400 ms · today's 650 ms ease-in · a plain cut        |
| 12  | Buttons inside composites (G13)  | exactly the theme's button · as today · the base plus a composite accent   |
| 13  | The focus ring                   | the register's inset ring · a bright primary outline · the current mix     |
| 14  | The press                        | 1 px drop · 2 px drop, deeper shadow · 2 % shrink (today's header)         |
| 15  | Where the monospace goes         | figures, labels and counts · everywhere · figures only                     |
| 16  | Screws and knurling              | only where a real part has them · none · on everything                     |
| 17  | Bronze and the error colour (G5) | only inside the ramp · as a free accent · no bronze at all                 |

**How.**

- `demo.js` holds the seventeen questions as data (`ASPECTS`: question, reason, rule, kind, scene, options with what you see and
  the verdict), builds the rows (`data-tc-aspect`, option cells `data-tc-option`) and writes `data-review-choices` from the same
  data, so the page and the dialog cannot disagree.
- `options.css` (in `@layer kp.signature`) draws every option, scoped by `data-tc-<question>="<key>"` on the scene. Colours are
  tokens only; every motion sits under `prefers-reduced-motion: no-preference`; the reduced pose is the finished part. The
  "today" options reproduce the decided picks with the values measured in CHARACTER.md §2 (they are not the character demos'
  own CSS, so one scene shows the same parts in every option).
- One clock in `demo.js` plays every scene that arrives, opens, presses or updates (`data-tc-phase`: gap, in, hold, out), so the
  options of a row start together. Replay restarts it; the speed buttons stretch every duration by 2 or 4; the dialog's Pause
  (Space) stops it. Loading pictures loop in CSS.
- The State buttons (Rest, Hover, Focus, Press) force that state on every button in question 12, so the composites can be
  compared without a pointer; the dialog presses Hover there by itself.
- The gallery of decided components loads the character demos through the review kit's embed mode
  (`?embed=shape&theme=titanium`) only when it is opened, so the page itself stays light.

**Found while building.** The package's own `.kp-badge` in titanium is drawn with `border-radius: 999px` under the register's
chamfer clip, so two corners are cut and two are round; question 6 says so.
