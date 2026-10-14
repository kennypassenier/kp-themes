# Cost of the 23 contrast-floor tests (Firefox, one worker, 2026-10-15 00:08-00:12)

Measured with `npx playwright test <bestand:regel> --project firefox --reporter=json`, KP_TEST_WORKERS=1.
Run 1: 21 tests, 3 min 8 s. Run 2: 2 tests, 29.5 s. Raw json: test-timings/contrast-2026-10-15.json and contrast-light-2026-10-15.json.

| Test                                 | Duration | Result        | Kenny's rule (over 20 s: delete)                          |
| ------------------------------------ | -------- | ------------- | --------------------------------------------------------- |
| calendar.spec.mjs:40                 | 29.8 s   | failed        | delete                                                    |
| nostromo-second-pass.spec.mjs:346    | 21.3 s   | failed        | delete                                                    |
| light-pastel-hc-notes.spec.mjs:94    | 18.9 s   | passed        | report (the "30 s alone" comment in the source was wrong) |
| nav-ghost.spec.mjs:95 (16 themes)    | 15.9 s   | passed        | report                                                    |
| kpi-columns.spec.mjs:134             | 15.4 s   | passed        | report                                                    |
| catalogue-review-dialog.spec.mjs:502 | 12.5 s   | passed        | report                                                    |
| registers.spec.mjs:155 (16 themes)   | 10.3 s   | pastel failed | report                                                    |
| kpi-trend.spec.mjs:198               | 9.2 s    | failed        | report                                                    |
| fixtures.spec.mjs:75 (16 themes)     | 8.7 s    | passed        | report                                                    |
| surfaces.spec.mjs:165 (16 themes)    | 8.7 s    | passed        | report                                                    |
| light-pastel-hc-notes.spec.mjs:67    | 8.6 s    | passed        | report                                                    |
| nav-ghost.spec.mjs:64 (16 themes)    | 7.6 s    | passed        | report                                                    |
| graph.spec.mjs:134                   | 7.2 s    | passed        | report                                                    |
| log.spec.mjs:125                     | 6.2 s    | passed        | report                                                    |
| alarm.spec.mjs:801 (2 viewports)     | 5.2 s    | failed        | report                                                    |
| scope-93-notes.spec.mjs:158          | 3.2 s    | passed        | report                                                    |
| nostromo-notes.spec.mjs:118          | 2.4 s    | failed        | report                                                    |
| alarm.spec.mjs:413                   | 2.0 s    | failed        | report                                                    |
| nostromo-notes.spec.mjs:89           | 1.9 s    | passed        | report                                                    |
| bare.spec.mjs:38                     | 1.8 s    | passed        | report                                                    |
| dark-themes-notes.spec.mjs:269       | 1.5 s    | passed        | report                                                    |
| register-grotesk.spec.mjs:229        | 1.4 s    | passed        | report                                                    |
| scope-93-notes.spec.mjs:288          | 0.9 s    | passed        | report                                                    |

Alle 8 fouten zijn contrastgrenzen. Opvallend: registers.spec.mjs:155 meet de destructieve alert van pastel op 1,02:1 (bijna wit op wit). Dat komt mee als report; het is ofwel een meetfout van de test, ofwel echt onleesbaar, en is niet nagekeken.
