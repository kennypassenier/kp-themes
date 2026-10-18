# research/almanac-calendar-views: Almanac's two calendar views (formal only)

Judges two new Almanac use cases on kp-themes 11.0.0, formal only (`data-review-themes="formal"`), 2 sections, 2 pairs:

1. **Deliveries per day** (`.kp-calendar` month heatmap + the picked day's `.kp-datatable` beside it). Choice set: how the month
   shows loading, default `.kp-calendar--busy-whole`, option `--busy-days`.
2. **This week in the calendars** (`.kp-week[data-kp-week]`, colour per calendar, hover card from the item's `detail`, a
   `.kp-card` + `.kp-kv` for the opened event).

**Mock:** every event row (`sample.js`). The live service (4.1.7, 19/10/2026) has accepted and delivered 3 events, failed none.
Calendar names are real; source `home-assistant` is real, `homelab`, `kyu`, `claude-sessions` are mock names. The page says so.
Open package gaps found here are in the report, not drawn around.
