# research/graph-loading-1019: the network graph's decided loading picture
**Decided (2026-10-19 11:22):** Kenny did not approve any of the 12 pairs ("elk thema heeft hier al een animatie voor, gebruik die!"). Superseded: the per-theme pictures are removed again and a loading graph is the theme's data loading animation, the busy card (js/busy-card.js), over its whole box. Recorded in `VERDICTS.json`; the page is not offered again.

Round `graphloading-<uuid>` (see `demo.html`, 2026-10-19): 1 section asked in 12 themes, 12 pairs. Kenny rejected kyu's overview graph
(2026-10-19 02:38: "dit is toch niet de standaard laadanimatie die Formeel heeft voor een netwerkdiagram?"): the loading pictures decided in
`research/character-graph/decided.json` (2026-10-06 21:37) never reached the package, which drew one generic pulse for every theme.

Fix: `js/graph.js` gives each ghost link `pathLength` 100; `css/components.css` has the shared hooks (`--kp-graph-ghost`,
`--kp-graph-ghost-anim`, `--kp-graph-edge-anim`, `--kp-graph-node-anim` with stagger and delay, the sentence at the foot);
each `css/<theme>-register.css` ends with that theme's decided picture. Themes without a decided picture keep the generic pulse.
Sepia and high-contrast are decided in the research but are not themes of this package.

**Generated** by `node research/graph-loading-1019/build.mjs` (edit the builder, never the page).
