# research/gaps-1031: seven options homelab and kyu asked for

**Decided (2026-10-31 22:17):** Kenny approved all seven pairs (formal) in round 1. Recorded in `VERDICTS.json`; the page is not offered again.

Kenny, 2026-10-31, for 12.1.0: "zie dat alles gefixt is in deze release". Seven open items of `~/Projects/kp-gaps/homelab.md`
(22, 26, 39, 43, 70, 73) and `kyu.md` (15) that add a visible option or part, each opt-in with a default that leaves the
approved look as it was:

| Section            | Item        | Option                                                                                                 |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `question-batch`   | homelab 22  | `data-kp-questions-batch` (`off` default, `on`, `confirm`), `data-kp-questions-batch-min` (2)          |
| `notices-preview`  | homelab 26  | `data-kp-notices-look="preview"`                                                                       |
| `passkeys-slot`    | homelab 39  | a row's `extra` slot beside its badges                                                                 |
| `passkeys-tokens`  | homelab 70  | `data-kp-rename="off"` / `rename: false`; `data-kp-missing-use` (`never` default, `unknown`, `none`)  |
| `md-aside`         | homelab 73  | master-detail with a detail and an aside but no list (`data-kp-pane-listless` written)                 |
| `week-off`         | homelab 43  | `data-kp-week-off` (`show` default, `hide`)                                                            |
| `command-secret`   | kyu 15      | `data-kp-command-secret` in the code, `-mask` (`dots` default, `tail`), `-reveal` (`on` default, `off`) |

**Round 1** (seven sections, formal only): the components on the apps' own data (the homelab Inbox's questions and pushes, its
Settings tokens, vaultwarden's secrets, its schedules; kyu's publish snippet from `src/dashboard/snippets.rs`). Every section has
its new option and the approved look side by side as a control, its data states where it has them, and the stage at a phone's
390 px. The names, times and the token are mock.

**Generated** by `node research/gaps-1031/build.mjs` (edit the builder, never the page).
