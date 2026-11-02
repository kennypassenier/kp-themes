# research/ux-dialogs-1101: dialogs, drawers and confirmations from the app review

**Decided (2026-11-02 00:25 UTC):** Kenny approved drawer-beside (formal) in round 2, with the Edit label on one line, so all eight sections are decided. Recorded in `VERDICTS.json`; the page is not offered again.

The app review of 2026-11-01 (`~/Projects/ux-review/kp-themes.md` and `kp-themes-components.md`) found eight things in the
package's dialogs, drawers and confirmations. Kenny's answers (2026-11-01) and where each is shown [uxdialogs1101]:

| Section              | Item                            | Answer                           | Part or option                                                        |
| -------------------- | ------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| `drawer-beside`      | drawer-modal, Kitchen           | As an option                     | `data-kp-drawer-mode="beside"` (`modal` default), `data-kp-drawer-room` |
| `drawer-width`       | drawer-modal, Kitchen           | As an option                     | `data-kp-drawer-width` (`narrow`, `wide`)                             |
| `dialog-guard`       | close-guard, Kitchen            | As an option                     | `data-kp-dialog-guard`, js/overlays/dialog-guard.js                   |
| `dialog-backdrop`    | dialog-backdrop, Medicine Cab.  | As an option, the demo picks     | `data-kp-backdrop="scrim"` (`opaque` default)                         |
| `dialog-phone-sheet` | dialog-phone-sheet, Medicine C. | As an option, the demo picks     | `data-kp-dialog-phone="sheet"` (`centre` default)                     |
| `dialog-stacking`    | dialog-stacking, HTTPSwitchb.   | As an option, the demo picks     | `data-kp-dialog-stack="replace"` (`over` default)                     |
| `confirm-text`       | confirm-text, kyu               | The label comes from the sentence | `confirmLabelFrom`, `confirmSaysIrreversible`                        |
| `typed-confirm-font` | typed-confirm, kyu              | Docs and the font                | the loses list in the body font                                       |

Not shown, as nothing of it is visible: confirm-restorable (`data-kp-confirm-restorable` refuses the confirmation and says why
in the console) and the documentation lines (Undo for anything restorable; a typed confirmation for mass or irreversible deletes).

**Round 1** (eight sections, formal only). Every component runs in a stage frame (`stage.html?scene=…&v=…&state=…`, built by
stage.js from stage-scenes.js), a page of its own, so a modal dialog, a drawer and a phone's 390 px are real there and "now" and
"new" can both stand open. The State control puts every frame of a section in one state; Width shows the frames at 390 px. A
state the page sets gives the focus back to the page (a modal in a frame takes it), and the frames hand the review dialog's
keys up. The three sections whose default the demo picks show the approved look and the new one under each other; the approved
look stays the default until Kenny's verdict. The names, counts and dates are mock.

**Generated** by `node research/ux-dialogs-1101/build.mjs` (edit the builder or sections.mjs, never the page).
