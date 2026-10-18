# kpadopt56 states: dark, cyberpunk, synthwave (DEMO_RULES chapter 3 and 4, measured per component)

Worked 2026-10-18 on `theme/t56-a`, only in `css/dark-register.css`, `css/cyberpunk-register.css` and
`css/synthwave-register.css` (plus the generated files each commit regenerates). Firefox, 1280 and 390 px, every section of
the eleven `research/kpadopt56-<topic>/demo.html` pages that has loading, empty or failed buttons (33 sections with 142 state
readings per theme and width). Formal was measured the same way as the reference. No browser test was run.

## How it was measured

For each group the script presses every state button, finds the part the buttons drive (the first top-level part whose
markup differs between the states), and reads in that state: the part's height (loaded = `ready`), the state plate's size
and the centre of the plate against the part, the title's font size and alignment, the Retry button against a normal
`kp-button`, the busy card's centre against the part's centre, and the running animations (including pseudo-elements). The
loading reading is taken at 350 ms and 1 s. Heights are in the tables below; the full readings are not kept in the
repository (a measuring script of my own, in the session scratchpad).

## Fixed (commits)

- `[t56-coralkeys-1018]` synthwave: Allow, Stop and Retry on a solid coral plate (a failed state, an urgent or a refused
  question) are dark keys: the plate's own ink (`--destructive-foreground`) as ground, a near-white tube round them, no pink
  glow. The pink frame on the coral read weak; looked at in the failed gallery plate and the urgent and refused question
  cards at 1280. The dark ink on the coral already read (kept).
- `[t56-focusnav-1018]` synthwave: Back, Next and Done in the cook mode navigation. At 390 the phone-frame navigation
  (124 px buttons) broke each label over 3 lines (`lines3`); less padding and tracking and no break inside a word keep each
  on one line (all nav buttons `lines1`, including Done on the last step).
- `[t56-quotefoot-1018]` dark, cyberpunk, synthwave: the quote card. Loading reserved `--kp-quote-min` (9rem) for its busy
  card, the loaded card did not: loaded 150.5 / 148.5 px, loading 178 / 176 px (+28 px layout shift in both). Synthwave
  empty was +16 px and failed (390) +7 px. The loaded card now keeps the same room; at 390 synthwave keeps 10.5rem for the
  wrapped failure. Now loaded, loading, empty and failed are one height in all three themes at both widths.

## Per section: loaded height, then loading (L) / empty (E) / failed (F) minus the loaded height (px)

`0` = the state fills the loaded footprint exactly. `before > after` where a commit moved it. "Formal" is the reference.
A negative number means the state is shorter than the loaded component (it does not fill its footprint). Sections with a
state that belongs to a different control (one passkey, a long line, a dense code, ...) are left out of the L/E/F columns.

### 1280 px: loaded height, then loading (L) / empty (E) / failed (F) minus loaded, in px; `before > after` where a commit moved it; formal for reference

| section                    | formal                    | dark                                                  | cyberpunk                             | synthwave                                 |
| -------------------------- | ------------------------- | ----------------------------------------------------- | ------------------------------------- | ----------------------------------------- |
| calm/calm-tones-states     | 496.5: L0 E0 F0           | 496.5: L0 E0 F0                                       | 496.5: L0 E0 F0                       | 524.3: L0 E0 F0                           |
| calm/quote-states          | 176: L+2 E+1 F0           | 150.5: L+28 E0 F0 > **178: L0 E0 F0**                 | 148.5: L+28 E0 F0 > **176: L0 E0 F0** | 179.9: L+28 E+16 F0 > **207.4: L0 E0 F0** |
| calm/focus-states          | 608: L0 E0 F0             | 608: L0 E0 F0                                         | 608: L0 E0 F0                         | 608: L0 E0 F0                             |
| charts/chart-annotations   | 235.5: L0 F0              | 235.5: L0 F0                                          | 235.5: L0 F0                          | 235.5: L0 F0                              |
| charts/uses-states         | 475.5: L-12 E-188 F-188   | 475.5: L-12 E-188 F-188                               | 475.5: L-12 E-188 F-188               | 475.5: L-12 E-188 F-188                   |
| charts/trace-states        | 319.5: L0 E0 F0           | 347.5: L0 E0 F0                                       | 347.5: L0 E0 F0                       | 353.5: L0 E0 F0                           |
| charts/availability-grid   | 495: L0 E0 F0             | 478: L0 E0 F0                                         | 478: L0 E0 F0                         | 478: L0 E0 F0                             |
| choose/usual-states        | 89.1: L0 E0 F0            | 89.1: L0 E0 F0                                        | 89.1: L0 E0 F0                        | 89.1: L0 E0 F0                            |
| choose/intent-states       | 569: L0 F-17              | 594: L0 F-41                                          | 545: L0 F+7                           | 551: L0 F+7                               |
| choose/dated-states        | 408.2: L0 E0 F0           | 412.2: L0 E0 F0                                       | 399.2: L0 E0 F0                       | 439.2: L0 E0 F0                           |
| fields/slider-states       | 44: L0                    | 44: L0                                                | 44: L0                                | 44: L0                                    |
| fields/time-field          | 108.6: L0 E-24 F0         | 109.4: L0 E-24 F0                                     | 110.2: L0 E-24 F0                     | 110.2: L0 E-24 F0                         |
| fields/autosize-states     | 111.6: L+2 F+50           | 112.4: L+3 F+53                                       | 123.2: L+2 F+51                       | 115.2: L+2 F+53                           |
| fields/rating-states       | 80: L0 F0                 | 80: L0 F0                                             | 80: L0 F0                             | 80: L0 F0                                 |
| lists/claim-row            | 673.3: L0 E-149 F-149     | 661.9: L0 E-139 F-139                                 | 688.8: L0 E-164 F-164                 | 703.9: L0 E-179 F-179                     |
| lists/master-detail        | 456: L0 E0 F0             | 456: L0 E0 F0                                         | 432: L0 E0 F0                         | 432: L0 E0 F0                             |
| lists/payload-cell         | 823.5: L-100 E-112 F-82   | 827.6: L-111 E-112 F-82 > **827.5: L-111 E-112 F-82** | 827.3: L-109 E-114 F-82               | 838.9: L-111 E-114 F-81                   |
| lists/request-inspector    | 1231: L+1749 E-789 F-789  | 1234.5: L+1756 E-792 F-792                            | 1245.8: L+1786 E-806 F-806            | 1301.9: L+1831 E-831 F-831                |
| lists/interactive-console  | 521.4: L0 E0 F0           | 521.4: L0 E0 F0                                       | 521.4: L0 E0 F0                       | 521.4: L0 E0 F0                           |
| lists/ops-page             | 1744.6: L0 F0             | 1729.6: L0 F0                                         | 1715.6: L0 F0                         | 2055: L-25 F-4 > **2052.7: L-23 F0**      |
| media/gallery-states       | 471: L-15 E-15 F-15       | 471: L-15 E-15 F-15                                   | 471: L-15 E-15 F-15                   | 471: L-15 E-15 F-15                       |
| media/qr-code              | 281.7: L0 E0              | 281.7: L0 E0                                          | 281.7: L0 E0                          | 281.7: L0 E0                              |
| people/passkey-list        | 432: L0 E0 F0             | 432: L0 E0 F0                                         | 432: L0 E0 F0                         | 432: L0 E0 F0                             |
| people/conversation-thread | 512: L0 E0 F0             | 512: L0 E0 F0                                         | 512: L0 E0 F0                         | 512: L0 E0 F0                             |
| people/entity-states       | 928: L-4 E-672 F-672      | 924: L0 E-668 F-668                                   | 916: L0 E-660 F-660                   | 1057.6: L0 E-802 F-802                    |
| schedule/runs-states       | 166: L0 E0 F0             | 166: L0 E0 F0                                         | 166: L0 E0 F0                         | 166: L0 E0 F0                             |
| schedule/sentence-states   | 134.4: L0                 | 134.4: L0                                             | 134.4: L0                             | 134.4: L0                                 |
| status/notices             | 1320.5: L-736 E-736 F-736 | 1320.5: L-736 E-736 F-736                             | 1320.5: L-736 E-736 F-736             | 1320.5: L-736 E-736 F-736                 |
| status/explain-lede        | 466.7: L0 E0 F0           | 470.9: L0 E0 F0                                       | 499: L0 E0 F0                         | 532.4: L0 E0 F0                           |
| status/today-states        | 670: L0 E0 F0             | 718.8: L0 E0 F0                                       | 715.6: L0 E0 F0                       | 761: L0 E0 F0                             |
| updates/version-states     | 23.2: L-5 F+1             | 23.3: L-3 F0                                          | 22.7: L+4 F+2                         | 24.2: L-4 F0                              |
| updates/ack-states         | 182: L0 E-182 F0          | 182: L0 E-182 F0                                      | 182: L0 E-182 F0                      | 182: L0 E-182 F0                          |
| updates/deplist-states     | 260: L0 E0 F0             | 260: L0 E0 F0                                         | 260: L0 E0 F0                         | 260: L0 E0 F0                             |

### 390 px: loaded height, then loading (L) / empty (E) / failed (F) minus loaded, in px; `before > after` where a commit moved it; formal for reference

| section                    | formal                     | dark                         | cyberpunk                    | synthwave                                               |
| -------------------------- | -------------------------- | ---------------------------- | ---------------------------- | ------------------------------------------------------- |
| calm/calm-tones-states     | 522.8: L0 E0 F0            | 522.8: L0 E0 F0              | 522.8: L0 E0 F0              | 522.8: L0 E0 F0                                         |
| calm/quote-states          | 215.5: L0 E0 F0            | 192: L0 E0 F0                | 190: L0 E0 F0                | 221.4: L0 E0 F+7 > **231.4: L0 E0 F0**                  |
| calm/focus-states          | 608: L0 E0 F0              | 608: L0 E0 F0                | 608: L0 E0 F0                | 608: L0 E0 F0                                           |
| charts/chart-annotations   | 319.5: L0 F0               | 319.5: L0 F0                 | 291.5: L0 F0                 | 291.5: L0 F0                                            |
| charts/uses-states         | 701.5: L-238 E-414 F-414   | 701.5: L-238 E-414 F-414     | 701.5: L-238 E-414 F-414     | 701.5: L-238 E-414 F-414                                |
| charts/trace-states        | 319.5: L0 E0 F0            | 347.5: L0 E0 F0              | 367: L0 E0 F0                | 353.5: L0 E0 F0                                         |
| charts/availability-grid   | 592.5: L0 E-40 F0          | 611.5: L0 E-16 F0            | 611.5: L0 E-40 F0            | 557.5: L0 E-40 F0                                       |
| choose/usual-states        | 89.1: L0 E0 F0             | 89.1: L0 E0 F0               | 89.1: L0 E0 F0               | 89.1: L0 E0 F0                                          |
| choose/intent-states       | 689: L0 F-136              | 666: L0 F-112                | 665: L0 F-113                | 671: L0 F-113                                           |
| choose/dated-states        | 537.2: L0 E0 F0            | 541.2: L0 E0 F0              | 528.2: L0 E0 F0              | 568.2: L0 E0 F0                                         |
| fields/slider-states       | 82: L0                     | 82: L0                       | 82: L0                       | 84: L0                                                  |
| fields/time-field          | 116.6: L0 E-24 F0          | 117.4: L0 E-24 F0            | 118.2: L0 E-24 F0            | 118.2: L0 E-24 F0                                       |
| fields/autosize-states     | 111.6: L+2 F+50            | 112.4: L+3 F+53              | 144.8: L+2 F+51              | 115.2: L+2 F+53                                         |
| fields/rating-states       | 92: L0 F0                  | 92: L0 F0                    | 92: L0 F0                    | 92: L0 F0                                               |
| lists/claim-row            | 1620.8: L0 E-1028 F-1028   | 1675.4: L0 E-1018 F-1018     | 1687.8: L0 E-996 F-996       | 1702.9: L0 E-1011 F-1011                                |
| lists/master-detail        | 432: L0 E0 F0              | 456: L0 E0 F0                | 432: L0 E0 F0                | 432: L0 E0 F0                                           |
| lists/payload-cell         | 1874.4: L-151 E-168 F-129  | 1898.6: L-162 E-168 F-128    | 1837.9: L-160 E-169 F-129    | 1938: L-167 E-173 F-134 > **1937.4: L-166 E-172 F-133** |
| lists/request-inspector    | 1447.4: L+2107 E-978 F-978 | 1808.4: L+2417 E-1339 F-1339 | 1937.4: L+2418 E-1470 F-1470 | 2137.6: L+2727 E-1639 F-1639                            |
| lists/interactive-console  | 663.5: L0 E0 F-34          | 663.5: L0 E0 F-34            | 644: L0 E0 F-15              | 644: L0 E0 F-15                                         |
| lists/ops-page             | 3226.5: L-4 F0             | 3232: L0 F0                  | 3181.1: L0 F0                | 3947.5: L-39 F+10 > **3951.9: L-43 F-9**                |
| media/gallery-states       | 788: L-332 E-332 F-332     | 788: L-332 E-332 F-332       | 788: L-332 E-332 F-332       | 788: L-332 E-332 F-332                                  |
| media/qr-code              | 289.7: L0 E0               | 289.7: L0 E0                 | 289.7: L0 E0                 | 289.7: L0 E0                                            |
| people/passkey-list        | 747.4: L-315 E0 F0         | 751.4: L-319 E0 F0           | 747.4: L-315 E0 F0           | 751.4: L-319 E0 F0                                      |
| people/conversation-thread | 512: L0 E0 F0              | 512: L0 E0 F0                | 512: L0 E0 F0                | 512: L0 E0 F0                                           |
| people/entity-states       | 928: L-4 E-672 F-672       | 924: L0 E-668 F-668          | 916: L0 E-660 F-660          | 1057.6: L0 E-802 F-802                                  |
| schedule/runs-states       | 202.5: L-36 E-36 F-36      | 202.5: L-36 E-36 F-36        | 202.5: L-36 E-36 F-36        | 202.5: L-36 E-36 F-36                                   |
| schedule/sentence-states   | 177.6: L0                  | 177.6: L0                    | 177.6: L0                    | 177.6: L0                                               |
| status/notices             | 1579.3: L-995 E-995 F-995  | 1567.6: L-984 E-984 F-984    | 1541: L-957 E-957 F-957      | 1562: L-978 E-978 F-978                                 |
| status/explain-lede        | 597.7: L0 E+2 F0           | 592.5: L0 E0 F0              | 612.6: L0 E0 F0              | 648: L0 E0 F0                                           |
| status/today-states        | 763.2: L0 E0 F0            | 793.8: L0 E0 F0              | 808.8: L0 E0 F0              | 854.2: L0 E0 F0                                         |
| updates/version-states     | 23.2: L-5 F+1              | 23.3: L-3 F0                 | 22.7: L+4 F+2                | 24.2: L-4 F0                                            |
| updates/ack-states         | 182: L0 E-182 F+32         | 182: L0 E-182 F+32           | 182: L0 E-182 F+32           | 182: L0 E-182 F+32                                      |
| updates/deplist-states     | 260: L0 E0 F0              | 260: L0 E0 F0                | 260: L0 E0 F0                | 260: L0 E0 F0                                           |

## What each theme shows in the states (looked at, plus the animation names read from the page)

- Loading, dark: the comet (`kp-sig-dark-comet`) and the five bars (`kp-sig-dark-bars`) in the busy card; the film sweep on
  the card itself. Cyberpunk: the packet bars (`kp-sig-cyberpunk-bars-1..4`) and the hunting lock-on in the busy card.
  Synthwave: the sun setting behind the cyan horizon (`kp-sig-synthwave-sink`, `sun`, `sw-set`) in the busy card, the
  marquee on its edge. Every loading state of the three themes that shows a busy card had at least one running animation
  at 350 ms (the exceptions are listed under "shared").
- Empty: dark's plate with the film and heading size; cyberpunk's scan plate with the notch; synthwave's sun above its
  horizon with the heading under it. Failed: dark's alert with the red top edge, cyberpunk's blood-red scan plate with the
  yellow Retry, synthwave's solid coral plate with the dark Retry key.
- Retry is a normal `kp-button` (36 px; the small 28 px size appears only on the exception named next) in every failed state of the three themes
  except the ops page's own "Page failed" retry (28 px, a small button in every theme including formal; shared).
- The synthwave busy card of the conversation and the passkey list sits 200 to 240 px low in the 1 s reading at 390 and is
  centred at rest: it is the 900 ms rise over the horizon (the theme's arrival), not a wrong position. Looked at at 2.5 s.

## Shared (the same in formal, or in shared CSS or js): not fixed here

Heights (a state shorter or taller than the loaded component, formal identical to within a few px; the theme numbers are in
the tables):

- charts/uses-states: empty and failed 288 px against 475 px loaded (1280) and 701 px (390); loading 464 px. The state
  plate has its own `min-block-size` and does not take the matrix's height.
- lists/claim-row: empty and failed 524 px against 673 px (1280), 593 against 1621 px (390).
- lists/request-inspector: empty and failed about 2.5 to 3 thousand px shorter than the loaded list.
- lists/payload-cell: loading, empty and failed 82 to 168 px shorter than the loaded cell.
- people/entity-states: empty and failed 256 px against 928 px loaded (the three cards); loading keeps it.
- status/notices: the states are 584 px against 1320 px loaded (1280), 995 px shorter at 390.
- media/gallery-states: loading, empty, failed 456 px against 471 px (1280) and 788 px (390).
- choose/intent-states: failed 17 px (1280) to 136 px (390) shorter than the open palette.
- charts/availability-grid at 390: empty and "nobody" 40 px shorter; people/passkey-list loading at 390 315 px shorter;
  lists/interactive-console failed 34 px shorter at 390; schedule/runs-states 36 px shorter at 390;
  status/today-states and the explain-lede card: the plate (112 to 165 px) stands in the top part of a 470 px card.
- fields/autosize-states failed +50 px (the error line is added under the field); fields/time-field and slider "wrong"
  +24 px (an error line is added under the control, a field message, not a state plate).

Busy card not at the centre of the whole component (offset of the card's centre from the component's centre, formal's
number in brackets; the overlay is laid by the shared script with insets that leave the headers and toolbars out):
gallery-states -180, ops-page -291 (-614 at 390), interactive-console -52 (-123), trace-states -70, usual-states +195,
claim-row +37 (+81), master-detail (-8,+26), qr-code (-112,-45), today-states -94, explain-lede -65, notices -30,
availability-grid (+78,+2), runs-states +16, deplist-states +16, calm-tones +17 at 390.

Loading without any busy card (a shared choice of the component: an inline skeleton or a pulse only): ack-states,
chart-annotations, payload-cell, rating-states, sentence-states, slider-states, time-field, version-states, and
master-detail at 390 (the loading is over before 350 ms).

Failed or empty plate not centred, not heading size or not on a full footprint: the card's failure plate (`kp-card__state`
with `kp-card__failure`) is left-aligned with Retry beside the words, at 16 px: quote-states, today-states, explain-lede
failed (title centre 40 to 53 px left of the plate's centre in all four themes), rating-states failed, ops-page failed
(16 px, left, Retry 28 px). Empty in the card is 16 px (quote-states, today-states, explain-lede). Inline field messages
(time-field, slider, sentence) are 13 px by design and are not states of a data area.

Other shared:

- Entity grid, notices and the ack gate's "empty" are driven by two button groups; the group measured here drives the
  grid in its states (`#kv-entity-gstates`), the other drives the three cards.
- `gates/box-metrics.test.mjs` fails on `css/dark-register.css:5397 .kp-badge--version { font-size: 0.75rem }` (the version
  badge commit of the earlier helper, `[t56-version-1018]`); the commit hook's gates run is green because that test is not
  in its chain, `npm run gates` prints it. Not touched here: it is dark's own file but it was approved as measured; say if the
  font size should go.
- The 13 failing tests of `npm run gates` (16 stories, "16 themes", the digests...) are older than this branch and come
  from the twelve-theme cut.
- Hygiene: the shared `/tmp` filled to 100 % (several helpers' scratchpads, 3.7 of 4 GB) while this was measured; the
  first sweep wrote truncated files and was repeated.

## DEMO_RULES chapters

- Chapter 3 (states): measured per section as above. Fixed the quote card's footprint in all three themes. What is left is
  in the shared list; no state was resized by a hack, nothing was hidden to hit a number.
- Chapter 4 (motion and loading): every loading state that shows a busy card runs a theme-own animation (names above); no
  motion was added.
