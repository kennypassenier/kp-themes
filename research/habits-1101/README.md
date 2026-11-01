# research/habits-1101: six parts the Habits app asked for

Kenny's Habits todo app (`~/Projects/habits`) listed what it had to draw itself in `~/Projects/kp-gaps/habits.md` (2026-11-01).
Six of those items are new parts of the package, each opt-in (without it everything is as approved):

| Section         | Gap item              | Part                                                                                                              |
| --------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `reorder-group` | drag between lists    | `data-kp-reorder-group` on `.kp-reorder` lists; `kp-reorder` adds `fromList` / `toList`; ← / → on the handle        |
| `board`         | kanban board          | `js/board.js`, `data-kp-board`: pipeline lanes, task rows as cards, `data-kp-board-limit`, narrow `scroll` / `tabs` |
| `context-menu`  | context menu          | `js/context-menu.js`, `data-kp-context-menu` (empty, `inner`, an id), right click, long press, Shift+F10            |
| `md-editor`     | Markdown editor       | `js/markdown-editor.js`, `data-kp-md-editor`, `data-kp-md-preview` (`side`, `tabs`, `off`); reader `tasks` option  |
| `categorical`   | categorical colours   | `--kp-cat-1` … `--kp-cat-12`, `--kp-cat-ink`, `data-kp-cat`, `.kp-cat-chip`, `.kp-cat-dot`                         |
| `task-row`      | task row              | `js/task-row.js`, `.kp-task-row`, `buildTaskRow`, with the reorder group, the context menu and row picking         |

**Round 1** (six sections, formal only): the parts on the app's own shapes and words (its rows and facts from
`web/js/ui/task-row.js`, its ⋯ menu, its Boards page over tags, its notes). The task titles, projects and tags are mock.
Every section has its option against the approved default as a control where it has one, its data states where it has them
(the board), and the stage at a phone's 390 px.

## The categorical colours, measured (information, not a gate)

Contrast is advice (Kenny, 2026-10-05), so the demo shows no numbers. Each colour's contrast against the theme's ground, which is
also the contrast of `--kp-cat-ink` (the ground) on the colour as a fill; and the closest pair of the twelve in OKLab distance
×100 (above about 2 is a visible difference; categorical sets aim for 10). Each colour is a hue at the theme's own chroma with its
lightness solved against the ground; neighbours alternate between two lightness steps and slate stands on a deeper third.
Every colour is at or above 4.5:1 in every theme.

| Theme | 1 red | 2 orange | 3 amber | 4 lime | 5 green | 6 teal | 7 cyan | 8 blue | 9 indigo | 10 violet | 11 pink | 12 slate | Closest pair (OKLab ×100) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| formal | 4.74 | 7.13 | 4.76 | 7.29 | 4.78 | 7.29 | 4.87 | 7.35 | 4.70 | 7.33 | 7.26 | 9.78 | 9.2 (lime/teal) |
| pastel | 4.63 | 7.00 | 4.66 | 7.10 | 4.68 | 6.95 | 4.76 | 7.08 | 4.59 | 6.89 | 6.85 | 9.24 | 9.2 (violet/pink) |
| brutalism | 4.73 | 7.41 | 4.65 | 7.55 | 4.60 | 7.41 | 4.90 | 7.53 | 4.81 | 7.29 | 7.24 | 9.76 | 9.2 (lime/teal) |
| forest | 4.62 | 7.47 | 4.80 | 7.54 | 4.74 | 7.22 | 4.80 | 7.24 | 4.70 | 7.34 | 7.21 | 9.75 | 7.7 (violet/pink) |
| nostromo | 4.68 | 7.09 | 4.57 | 7.36 | 4.56 | 7.28 | 4.68 | 7.15 | 4.70 | 7.02 | 7.06 | 9.33 | 7.2 (lime/teal) |
| dark | 6.09 | 9.50 | 6.14 | 9.64 | 6.16 | 9.56 | 6.12 | 9.71 | 6.06 | 9.75 | 9.74 | 12.75 | 9.7 (violet/pink) |
| cyberpunk | 7.13 | 10.65 | 7.26 | 10.85 | 7.04 | 10.56 | 7.14 | 10.49 | 7.18 | 10.64 | 10.80 | 14.03 | 9 (violet/pink) |
| synthwave | 6.05 | 9.13 | 6.21 | 9.07 | 6.14 | 9.25 | 5.94 | 9.04 | 6.19 | 9.02 | 9.21 | 12.18 | 11.5 (blue/indigo) |
| deco | 5.28 | 8.76 | 5.46 | 8.65 | 5.34 | 8.80 | 5.19 | 8.79 | 5.36 | 8.74 | 8.66 | 11.60 | 9.2 (violet/pink) |
| solstice | 5.41 | 8.67 | 5.36 | 8.80 | 5.29 | 8.67 | 5.51 | 8.72 | 5.31 | 8.60 | 8.83 | 11.50 | 9.2 (violet/pink) |
| titanium | 5.39 | 8.84 | 5.25 | 8.72 | 5.29 | 8.75 | 5.30 | 8.63 | 5.30 | 8.85 | 8.86 | 11.60 | 7.5 (violet/pink) |
| blueprint | 4.99 | 8.05 | 4.97 | 8.16 | 4.88 | 8.09 | 5.06 | 8.05 | 4.87 | 7.97 | 8.20 | 10.72 | 9.3 (violet/pink) |

The other eleven themes are asked after the formal round (DEMO_RULES ch. 6: a new demo starts in formal only).

**Generated** by `node research/habits-1101/build.mjs` from `sections.mjs` (edit those, never the page); `demo.js` and `data.js`
fill and wire it.
