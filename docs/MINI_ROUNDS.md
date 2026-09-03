# Mini-round and measurement queue — kp-themes

Open items that must not live only in a conversation: pending
measurements from correction forms, and mini-rounds that reopen a frozen
decision. An entry leaves this list only when it has actually happened,
with the result recorded.

| ID  | What | Opened | Triggers at | Status |
| --- | ---- | ------ | ----------- | ------ |
| KT1-M1 | Count, in the Phase 2 decision form, how many claims assert a fact about code or another project and how many of those carry a file:line or an explicit second-hand label. The measure passes when the two numbers match. See [CORRECTIONS.md](CORRECTIONS.md) KT1 field 7. | 2026-09-03 | the Phase 2 decision form | open |
| KT1-M2 | KT1's measure did not hold before its own measurement moment: on 2026-09-03 Claude asserted in a reply and a commit message that cyberpunk "has no display face at all" in the plain-CSS consumers. Kenny checked the live kyu dashboard; both consumers apply it themselves from their own `theme-bridge.css`. The claim was checkable and was not checked. Question for Kenny: does KT1 field 8's fallback (a form may contain only sourced claims; everything unverified becomes its own item) trigger now, or does it stay tied to KT1-M1's original moment? | 2026-09-03 | the next form Claude builds for this project | open |
