# research/app-hsb-translate: HTTPSwitchboard, try a translation and the history of reloads

Rows 9 and 11 of HTTPSwitchboard's `docs/KP_THEMES_11_ADOPTION.md`, both new use cases. One page, `demo.html`, formal only
(`data-review-themes="formal"`), six sections in two topics.

| Topic   | Section | Package parts                                                                 |
| ------- | ------- | ----------------------------------------------------------------------------- |
| try     | try     | segmented, `data-kp-json`, `.kp-card` data states, `.kp-code`, problems, diff |
| try     | box     | `data-kp-json` with check, format, indent, gutter, wrap                       |
| try     | code    | `.kp-code` (pretty/raw, lines, wrap, fold, copy, four states)                 |
| try     | problem | `data-kp-problems` (each, list, fold; info notes dismissible)                 |
| try     | diff    | `.kp-diff` with hunk headers, `.kp-card` data states                          |
| reloads | reloads | `.kp-timeline`, `data-kp-follow` pill, problems with a command, card states   |

Mock: the second profile `uptime-kuma`, every sample message, the template engine in `demo.js` and the reload record. The Home
Assistant address is never shown. `page.css` (`hs-` classes) only lays the sections out.
