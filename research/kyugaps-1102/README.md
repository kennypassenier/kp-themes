# research/kyugaps-1102: kyu's selection bar room and the tour on a tall part

Two of kyu's package gaps (`~/Projects/kp-gaps/kyu.md`) with a visible result, shown on kyu's own topic page (its dead
letters card: the selection bar over the table, columns Died, Subscription, Tries, Why it died, Payload, Actions)
[kyugaps-1102]. Gap 19 (a sticky end column in the data table) was already in the package (`data-kp-fixed-end`, 11.1.0)
and is not shown.

| Section          | Gap     | What changed                                             | Part or option                                         |
| ---------------- | ------- | -------------------------------------------------------- | ------------------------------------------------------ |
| `selection-room` | kyu 34  | An empty bar can give up its room; the default is asked   | `data-kp-selection-room="fold"` (`hold` default)       |
| `tour-tall`      | kyu 33  | The tour card stays in the window on a part taller than it | `tourCardPlace` (a fault fix, nothing to choose)       |

**Round 1** (two sections, formal only). Every component runs in a stage frame (`stage.html?scene=…&v=…&state=…`, built by
stage.js from stage-scenes.js), a page of its own, so the sticky bar, the tour card fixed to the window and a phone's 390 px
are real there. The State control puts every frame of a section in one state; Width shows the frames at 390 px. The
selection section shows Hold (approved, the default until Kenny's verdict) and Fold under each other and asks only which is
the default. The names, counts and dates are mock.

**Generated** by `node research/kyugaps-1102/build.mjs` (edit the builder or sections.mjs, never the page).
