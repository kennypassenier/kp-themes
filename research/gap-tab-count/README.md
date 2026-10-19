# research/gap-tab-count: three small gaps the admin dashboard found

Round `gap-tab-count-9718e977-ecfa-461b-aada-e522db179a46` (2026-10-19): 4 sections, 4 pairs, formal only (a new demo starts in formal; the other
eleven themes are asked afterwards). Evidence: the gap research of the homelab session (gaps 2, 5c and 7a).

1. **tab-count.** A count on a `.kp-tab` (`setTabCount`, `data-kp-tab-count…`, js/tabbar.js). Controls: the number (12, 1, 1534, 0, 0 shown, not counted),
   the tone, the state (counted, counting, could not count), the words.
2. **tile-keys.** `data-kp-tiles-keys` over a board of 19 app tiles in four groups (js/tiles.js). Controls: keys on or off, the board's width,
   the platform group open or folded, all apps or only those with a problem. Readings under the board: tab stops, tile in focus, tiles shown.
3. **heat-legend.** `setHeatLegend` and the `legend` of `setHeat` (js/heat.js). Controls: nightly backups or requests per hour (a value ramp),
   key line, words only or hidden, ready, loading or could not be read.
4. **heat-calm.** The legend a grid with `data-kp-tones="calm"` draws by itself. Controls: automatic or hidden (an attribute flip), a three-day
   pause, ready or loading.

The data is made up (stacks such as media, platform and home; jellyfin, sonarr, traefik; log lines of the kind Loki holds). Hand-written page;
every component is the package's own. `data-kp-count` is not used for the tab count: the count-up effect (js/effects/count.js) owns that name.

**Bundled** (Kenny, 2026-10-19 02:38): this demo is the source of the review page [research/gap-round-1](../gap-round-1/demo.html) and is no longer on the Agenda by itself (`"bundledInto"` in its VERDICTS.json).
