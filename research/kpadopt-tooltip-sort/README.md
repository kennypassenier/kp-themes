# Hover card, plain-click multi-sort, group headings that stay

**Decided (2026-10-16 04:39):** Kenny approved it in full in the review dialog: 48 of 48 approved in round 2 (round 1: oval hover card in light, pastel and solstice, groupalways in forest, mended). Recorded in `VERDICTS.json`; the demo is not offered again.

Kenny's rule: a consumer draws nothing itself. The admin dashboard still drew three things because kp-themes 10.1.1 lacked them. Demo: [`demo.html`](demo.html) (package parts tagged **package**, page-only script **mock**).

| Gap                      | What the dashboard did                                                                            | What the package now offers                                                                                                                  | Build cost | Recommendation                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| Hover card               | `ui.js` `hoverCard()`: one `.nx-tip` node filled per hover for cells and chips rebuilt every 30 s | `attachHoverCards(root, { selector, fill })`, `data-kp-hovercard`, one shared `.kp-popover.kp-tooltip`, delegated, kp placement and entrance | medium     | Adopt; `attachTooltips` stays for markup that carries its tooltip |
| Plain-click multi-sort   | `sortclick.js` rewrote a click into Shift-click                                                   | `data-kp-sort-multi="click"`: click adds a key, Shift + click sorts alone                                                                    | small      | Adopt                                                             |
| Group heading that stays | none (kp hides a heading with no data row)                                                        | `data-kp-group-always` on `tr[data-kp-row-group]`                                                                                            | small      | Adopt                                                             |

Reference: the dashboard's own versions (read-only) in homelab `admin/web/js/ui.js` 1447-1519, `sortclick.js`, `pages/backups.js` 1385-1410; WCAG 1.4.13 (content on hover or focus: dismissible, hoverable, persistent).

## Decisions to judge in the demo

- The card opens after 300 ms for the pointer (kp's tooltip default; the dashboard opened at once) and at once for focus or when moving between anchors. A page can pass `openDelayMs: 0`.
- Anchors must be focusable for the keyboard (`tabindex="0"`); the package does not add it.
- Click mode: Shift + click means "this column alone" (the old plain click), so single-column sorting is never lost.
- Reset restores the opening sort (none when the table opens unsorted), as before.
