// Every review page, in the order the navigation shows them. Its own module
// so the review page can read the list without mounting the shell twice.
// gates/check-catalogue.mjs refuses a catalogue page or a research demo that
// is missing here, and an entry here with no page behind it.

/**
 * @typedef {object} Page
 * @property {string} href
 * @property {string} label
 * @property {boolean} [component]  a component page: "Every component, one page" gathers its blocks
 * @property {boolean} [review]     an example page: it wears the shell only when asked by `?review`
 * @property {string} [rework]      a research round being rebuilt: the Agenda leaves it out until the flag goes
 * @property {string} [about]       a research demo: what it asks, in one sentence, for the Agenda's row
 * @property {string[]} [after]     a research demo: the demos (their href) to judge before this one; the Agenda
 *                                  orders by it and says "Judge after: …" on the row
 * @property {boolean} [nav]       false: reachable, but not listed in the side navigation (Kenny, 2026-10-13: the Agenda
 *                                  replaced them, so they are noise there)
 * @property {string} [affects]     a research demo: what a rejection here changes elsewhere, one sentence the Agenda
 *                                  shows as "A rejection here changes: …"
 */

/** @type {{ group: string, nav?: boolean, pages: Page[] }[]} */
export const PAGES = [
    {
        group: 'Review',
        pages: [
            // The one page Kenny starts from (Kenny, 2026-10-13): what waits for him, in order, with what depends on
            // what; To judge and Every component, one page stay reachable from it.
            { href: 'catalogue/agenda.html', label: 'Agenda' },
            { href: 'catalogue/changed.html', label: 'To judge, by theme', nav: false },
            { href: 'catalogue/index.html', label: 'Every component, one page', nav: false },
            { href: 'catalogue/compare.html', label: 'Compare two themes' },
        ],
    },
    {
        group: 'Components',
        pages: [
            { href: 'catalogue/button.html', label: 'Buttons', component: true },
            { href: 'catalogue/table.html', label: 'Tables', component: true },
            { href: 'catalogue/field.html', label: 'Fields and forms', component: true },
            { href: 'catalogue/switch.html', label: 'Switch', component: true },
            { href: 'catalogue/combobox.html', label: 'Combobox', component: true },
            { href: 'catalogue/datepicker.html', label: 'Date picker', component: true },
            { href: 'catalogue/upload.html', label: 'Upload', component: true },
            { href: 'catalogue/colorpicker.html', label: 'Colour picker', component: true },
            { href: 'catalogue/feedback.html', label: 'Alerts, toasts, badges, progress', component: true },
            { href: 'catalogue/alarm.html', label: 'Alarm', component: true },
            { href: 'catalogue/overlays.html', label: 'Dialogs, popovers, menus, tooltips', component: true },
            { href: 'catalogue/navigation.html', label: 'Navigation', component: true },
            { href: 'catalogue/structure.html', label: 'Accordion, tree, timeline, split, reorder, wizard', component: true },
            { href: 'catalogue/data.html', label: 'Showing data', component: true },
            { href: 'catalogue/chart.html', label: 'Charts', component: true },
            { href: 'catalogue/media.html', label: 'Media, grid, marquee', component: true },
            { href: 'catalogue/page.html', label: 'Page header, footer, palette, theme menu', component: true },
            { href: 'catalogue/page-effects.html', label: 'Page effects', component: true },
            { href: 'catalogue/motion.html', label: 'Motion: closing, resizing, arriving, leaving', component: true },
            // Not a component page: each block is a window playing one theme's
            // intro on demand, so the review page does not gather it [scope-84].
            { href: 'catalogue/intros.html', label: 'Theme intros', component: true },
            // Not a component page: it carries no block under review, it counts
            // the verdicts and says whether the round is finished [fix-48].
            { href: 'catalogue/round.html', label: 'Am I through?' },
        ],
    },
    {
        // The ten example pages as fixed pages [scope-31]. Not component pages:
        // a page is read whole, so the review page does not gather it. The
        // pages are generated (gates/generate-examples.mjs) and are also the
        // documentation site's; they put the catalogue's shell on only when
        // asked by `?review`, which the navigation adds (catalogue.js).
        group: 'Example pages',
        pages: [
            { href: 'examples/app-shell.html', label: 'Application shell', review: true },
            { href: 'examples/login.html', label: 'Sign in', review: true },
            { href: 'examples/list-with-form.html', label: 'List with a filter form', review: true },
            { href: 'examples/settings.html', label: 'Settings', review: true },
            { href: 'examples/wizard.html', label: 'Wizard', review: true },
            { href: 'examples/empty-and-error.html', label: 'Empty and error states', review: true },
            { href: 'examples/hero.html', label: 'Hero', review: true },
            { href: 'examples/pricing-and-testimonials.html', label: 'Pricing and testimonials', review: true },
            { href: 'examples/article.html', label: 'Article', review: true },
            { href: 'examples/profile.html', label: 'Profile', review: true },
        ],
    },
    {
        // ONE group, always. Three of these stood side by side on 2026-09-17,
        // one per topic, and Kenny found three identical headings in his
        // navigation: "zie gewoon dat het niet meer gebeurt" [scope-126]. A
        // new demo joins this group's list; it moves to 'Archived research'
        // once he has decided on it [scope-81]. A demo whose round is being
        // rebuilt carries `rework: '<why>'`: "To judge" leaves it out until the
        // session that rebuilds it removes the flag with the new round
        // (Kenny, 2026-10-07: only fresh verdicts left to give).
        group: 'Research to look at',
        pages: [
            // Kenny, 2026-10-19 (AuDHD recepten thread): the recipe app's cook mode, formal only (new demo). research/audhd-recepten/.
            {
                href: 'research/audhd-recepten/cook/demo.html',
                label: 'Recipe app: cook mode with timers side by side',
                about: 'The AuDHD recipe app cook mode: Begin opens a short checklist of what to take out, then one step at a time with the screen kept on, named timers for pasta and sauce running side by side, a band that says which step to go to when one ends, discs on a 60-minute dial, and calm mode on a phone. 5 sections, formal only.',
            },
            // Kenny, 2026-10-19 (kp-themes 11.0.0 adoption, homelab admin dashboard): the Metrics page (T10) rebuilt on the package, formal only: live charts that keep your place, kinds and hatched windows on events, typical level and runs, the time window with a custom start and end, a window per section, scope and key figures, traffic (status mix, heat, table) and drives.
            {
                href: 'research/app-homelab-metrics/demo.html',
                label: 'Homelab dashboard: Metrics, live charts and the time window',
                about: 'The dashboard\'s Metrics page on the package: charts that keep a pinned reading, a zoom and switched-off sources through every refresh, marks for what the host did (windows hatched, failures as lines) with a ribbon, a typical level and runs, a time window with an exact start and end, a window per section, a machine picker with key figures, and the traffic and drives views. 8 sections (8 pairs, formal); each only asks for a default.',
            },
            // Kenny, 2026-10-19 (findings-1019): four package faults found while the components page was checked, each a change to an approved component, so asked again in all twelve themes with what was wrong and what is different now: Copy in a command block and Back/Next of the check-in broke per letter on a phone, the flash button set to grow by hand was empty, a lede with fold and link never folded. Generated by research/findings-1019/build.mjs.
            // Kenny, 2026-10-19 (kp-themes 11.0.0 adoption, homelab admin dashboard): T9 Schedules, how the Schedules page would look on 11.0.0 (week grid, next-run countdown and preview, the sentence form with weekdays and a 24-hour time field, the datatable with bulk turn-off and delete with undo, pause until a date, the busy-hours and coverage maps, the run history), formal only, sample data.
            {
                href: 'research/app-homelab-schedules/demo.html',
                label: 'Homelab dashboard: the Schedules page, week, form, table, pause and history',
                about: 'How the homelab dashboard\'s Schedules page would work and look: the next 7 days on one calendar, the next run counting down, a form that reads as a sentence with a preview, the table with bulk turn-off and delete with undo, pausing until a date, where two schedules start together, which stack has no backup, and the run history. 9 sections in formal, with sample data; you judge the look, and you set defaults for three things (turned-off schedules in the week, drawer or beside the list, menu or chips for pausing).',
            },
            // Kenny, 2026-10-19 (findings-1019): four package faults found while the components page was checked, each a change to an approved component, so asked again in all twelve themes with what was wrong and what is different now: Copy in a command block and Back/Next of the check-in broke per letter on a phone, the flash button set to grow by hand was empty, a lede with fold and link never folded. Generated by research/findings-1019/build.mjs.
            // Kenny, 2026-10-19 (AuDHD recepten thread): the recipe app's wheel screen, formal only (new demo). research/audhd-recepten/.
            {
                href: 'research/audhd-recepten/wheel/demo.html',
                label: 'Recipe app: what do we eat? (the wheel)',
                about: 'The AuDHD recipe app wheel: dishes not cooked for long get a bigger slice, yes or spin again or not this week, three-way filter chips for meal, time and ingredients, and a No energy today switch that keeps only safe dishes, freezer portions and zero-prep food. 4 sections, formal only.',
            },
            // Kenny, 2026-10-19 (AuDHD recepten thread): the recipe app's backward timing, formal only (new demo). research/audhd-recepten/.
            {
                href: 'research/audhd-recepten/timing/demo.html',
                label: 'Recipe app: counting back from dinner time',
                about: 'The AuDHD recipe app against time blindness: the sentence We eat at 18:30 so I start at 17:40, the plan as lanes for pasta, sauce and oven, a disc that shrinks to the start moment, and gentle nudges before the start. 4 sections, formal only.',
            },
            // Kenny, 2026-10-19 (kp-themes 11.0.0 adoption, homelab admin dashboard): the Inbox triage and the Notification rules pages rebuilt on 11.0.0 components, formal only, with sample data in the dashboard's own shapes.
            {
                href: 'research/app-homelab-inbox/demo.html',
                label: 'Homelab dashboard: Inbox triage and notification rules',
                about: 'What needs you in the homelab, and what reaches your phone. 7 sections (7 pairs): the Inbox list with keys, snooze and version jumps; ticking many rows and acting on all of them with Undo; a question from the host with its clock and a tick before it deletes; the manual checks one question per screen; delivery (snooze everything, the daily digest, push off behind a tick, a test push); routing per kind and per stack; and quiet hours with the last 14 days of pushes. Formal only; three things need the server first (a snooze for one row, a quiet-hours field, a test push) and run on sample data.',
            },
            // Kenny, 2026-10-19 (AuDHD recepten thread): the recipe app's recipe page and calm settings, formal only (new demo). research/audhd-recepten/.
            {
                href: 'research/audhd-recepten/recipe/demo.html',
                label: 'Recipe app: the recipe page, QR, print and calm settings',
                about: 'The AuDHD recipe app recipe page: summary, portions that rescale every amount, ingredient notes, a big Begin cooking button and last time\'s note; a QR code to open cook mode on the phone, a printable recipe, calm settings (calm mode, theme, language) and a cooking log where an empty week stays quiet. 7 sections, formal only.',
            },
            // Kenny, 2026-10-19 (AuDHD recepten thread): the recipe app's bad-days screen, formal only (new demo). research/audhd-recepten/.
            {
                href: 'research/audhd-recepten/baddays/demo.html',
                label: 'Recipe app: bad days (safe dishes, freezer, zero-prep shelf)',
                about: 'The AuDHD recipe app screen for days with no energy: six safe dishes as big tiles, the freezer as a table with take one portion and undo, the zero-prep shelf, a mini recipe and a calm calendar. 5 sections, formal only.',
            },
            // Kenny, 2026-10-19 (almanac on kp-themes 11.0.0), formal only.
            {
                href: 'research/almanac-calendars/demo.html',
                label: 'Almanac: the Calendars page',
                about: 'The Calendars page rebuilt on the package: header with New calendar, counts that filter, the problems band, the calendars table with a typed delete, the new-calendar dialog, the profile files and a map of which source writes to which calendar. 7 sections, formal only, sample data.',
            },
            // Kenny, 2026-10-19 (almanac on kp-themes 11.0.0), formal only.
            {
                href: 'research/almanac-journal/demo.html',
                label: 'Almanac: Journal and Sources on the Status page',
                about: 'What Almanac shows on its Status page: the journal at a glance, the recent deliveries table with filters, live refresh and connection, and the sources with a reload that stays on the page. 4 sections, formal only, sample data.',
            },
            // Kenny, 2026-10-19 (almanac on kp-themes 11.0.0), formal only.
            {
                href: 'research/almanac-delivery-chain/demo.html',
                label: 'Almanac: the delivery chain and the retry schedule',
                about: 'How an event travels from the call to Google Calendar, with live counts per stage and the failing stage lit; when each waiting event is tried next; and an event Almanac gave up on, with what to do. 3 sections, formal only, sample data.',
            },
            // Kenny, 2026-10-19 (almanac on kp-themes 11.0.0), formal only.
            {
                href: 'research/almanac-try-source/demo.html',
                label: 'Almanac: try a source',
                about: 'A new page to try an event call without writing to the calendar: the source and its profile, an event editor that checks the call, the path the call takes with the refused step lit, and the event it would make. 4 sections, formal only, sample data.',
            },
            // Kenny, 2026-10-19 (app-hsb-1019): two new use cases for HTTPSwitchboard from its kp-themes 11.0.0 adoption plan (rows 9 and 11), formal only: try a translation without delivering, and the history of reloads of the profile file. Hand-written page: research/app-hsb-translate.
            {
                href: 'research/app-hsb-translate/demo.html',
                label: 'HTTPSwitchboard: try a translation and reloads',
                about: 'Two pages HTTPSwitchboard does not have yet, in formal only: pick a profile, paste a sample message and see the translated body and a before and after diff without delivering anything; and a timeline of reloads of the profile file (applied, needs a restart, invalid) with an N new pill and an alert for the latest invalid reload. 6 sections in 2 topics.',
            },
            // Kenny, 2026-10-19 (almanac on kp-themes 11.0.0), formal only.
            {
                href: 'research/almanac-calendar-views/demo.html',
                label: 'Almanac: deliveries per day and this week',
                about: 'Two new views for Almanac: a month that shows how many events it delivered each day (pick a day to see them), and a week agenda of the events it put in the calendars, coloured per calendar. 2 sections, formal only, sample data.',
            },
            // Kenny, 2026-10-19: chassis-rs's shared kit pages rebuilt on kp-themes 11.0.0, bundled into one review (shared code and generator: research/chassis-kit-pages/build.mjs).
            {
                href: 'research/chassis-kit-pages/demo.html',
                label: 'chassis-rs kit pages: shell, status, clients, login and passkeys',
                about: 'Every page the kit serves to every service, rebuilt from kp-themes 11 components: the bar with its search palette (Ctrl K), shortcuts and the phone\'s tab bar with exact counts; the error page; the status page as an operations page with the sections a service adds; the clients list, issuing and managing a client; the login page with the service\'s health; the passkeys page with this device, rename and a QR code for another device. 12 sections (12 pairs, formal).',
            },
            // Kenny, 2026-10-08: the anchor round for the nine themes without one, the grotesk way (one question, six to ten candidates, each in its own scene, as a progress bar and as a button press, the recommendation first).
            // Kenny, 2026-10-08: what makes formal, light and deco themselves, the forest way (the analysis in themes/<theme>/CHARACTER.md), the nineteen questions each, every option a live scene that follows from the theme's decided anchor, the recommendation first.
            // Kenny, 2026-10-08 (update 1): deco's grammar did not convince him ("fancy, distinguished … lots of gold accents and fancy blue backgrounds … elegance without being too in your face"); thirteen questions redrawn as thin gold on lacquer with the wallpaper, his six picks kept.
            // Kenny, 2026-10-08: what makes dark, retro and phantom themselves (retro dropped 2026-10-09, its demos removed; the idea is in docs/FUTURE_THEMES.md), the forest way (the analysis in themes/<theme>/CHARACTER.md), the nineteen questions each, every option a live scene that follows from the theme's decided anchor, the recommendation first.
            // The character round, sixth demo (2026-10-05): the key-figure strip with its columns in 22 themes, two characters each.
            // The character round, eighth component: the attention band, shape/arrival/leave/tone/empty/loading, one pick per aspect (formal and titanium built first).
            // The character round, ninth and tenth components: the action columns and the menu button.
            // Kenny, 2026-10-07 03:50: what makes nostromo nostromo, the same way (the analysis in themes/nostromo/CHARACTER.md), eighteen rules of its grammar as questions, each option a live scene, the recommendation first; the second theme of the one-by-one series.
            // Kenny, 2026-10-07 04:23: what makes solstice solstice, the same way (the analysis in themes/solstice/CHARACTER.md), eighteen rules of its grammar as questions, each option a live scene, the recommendation first; the fifth theme of the one-by-one series, after synthwave.
            // Kenny, 2026-10-07 04:23: what makes brutalism brutalism, the same way (the analysis in themes/brutalism/CHARACTER.md), eighteen rules of its grammar as questions, each option a live scene, the recommendation first; the sixth theme of the one-by-one series, after solstice.
            // Kenny, 2026-10-07 04:23: what makes grotesk grotesk, the same way (the analysis in themes/grotesk/CHARACTER.md), nineteen rules of its grammar as questions, each option a live scene, the recommendation first; the seventh theme of the one-by-one series, after brutalism. Questions 9 to 12 are the grotesk-only loading demo Kenny asked for on 2026-10-06 21:37, from the graph's Out of register.
            // Kenny, 2026-10-12: "Cyberpunk lijkt af, zie dat dezelfde fouten nu niet terugkomen in andere thema's": every other theme mended so a close is its open backwards with the theme's own effect; only what changed, each block in the themes where it did (research/all-themes).
            // Kenny, 2026-10-16 (kp-adopt-rest, round 2): eight things the admin dashboard still draws itself (action tiles, status rows, the facet list, the coverage heat grid, the reachability matrix, bars in table cells with data-kp-sort-value, the week agenda, the run timeline), built in the package first as ONE demo, formal only until Kenny approves it.
            // Kenny, 2026-10-16 (kp-adopt-rest, round 3): six things the dashboard still drew itself, each an opt-in option of an approved component (nav separator, choice-filter value, timeline day buttons and series legend, the week's next-N phone list, facet identity patterns, the heat grid's jump to the latest), formal only.
            // Kenny, 2026-10-18 (kpadopt5/6, other themes): the 79 sections of the fifth and sixth adoption rounds that he approved in formal, now asked in the eleven other themes (dark, cyberpunk, synthwave, pastel, forest, blueprint, solstice, brutalism, deco, nostromo, titanium), grouped by kind of component into eleven reviews of at most 99 pairs each, generated from research/kpadopt56/src by research/kpadopt56/build-parts.mjs.
            // Kenny, 2026-10-19 (kp-themes 11.0.0 adoption, HTTPSwitchboard rows 8 and 10): one profile's settings as a key-value list with the retry budget against the lease as a meter, and the Recheck profiles flash button, its toasts and the per-profile recheck, formal only.
            {
                href: 'research/app-hsb-settings/demo.html',
                label: 'HTTPSwitchboard: profile settings and recheck',
                about: 'Whether a profile\'s settings read at a glance, with its retry budget against its lease as a bar, and whether the Recheck button, its toasts and the per-profile recheck feel right, in formal.',
            },
            // Kenny, 2026-10-19 (kp-themes 11.0.0 adoption, HTTPSwitchboard): the profiles view of the service dashboard (map or cards as the main view, the path of one profile, the card on a profile name), formal only; plan rows 1, 2, 3 and 15 of http-switchboard/docs/KP_THEMES_11_ADOPTION.md.
            {
                href: 'research/app-hsb-profiles/demo.html',
                label: 'HTTPSwitchboard: the profiles view',
                about: 'How HTTPSwitchboard would show its profiles with kp-themes 11.0.0: a map or cards as the main view (you set the default), the path of one profile and where it stops, and the card that opens on a profile name.',
            },
            // Kenny, 2026-10-19 (11.0.0 adoption plan rows 6, 7, 13): HTTPSwitchboard's key figures, hourly uptime strips and ways to stay current, formal only.
            {
                href: 'research/app-hsb-history/demo.html',
                label: 'HTTPSwitchboard: figures and history',
                about: 'What the HTTPSwitchboard status page could show over the last 24 hours, in formal only: four key figures with their trend that count up as messages arrive, one strip of hour cells per profile with a hover card, and a list that stays current by a refresh chooser or by live push with a count of new alerts. The hourly history is a new capability of the service.',
            },
            // Kenny, 2026-10-19 (app-hsb-health-1019): HTTPSwitchboard's adoption plan rows 4, 5, 12 and 14 (docs/KP_THEMES_11_ADOPTION.md), formal only until he approves it.
            {
                href: 'research/app-hsb-health/demo.html',
                label: 'HTTPSwitchboard: health and problems',
                about: 'How the status page tells a person that a profile needs them: the attention band and the problem alert (what, why, what now, with a Copy command), the "last delivery" freshness line, the kyu hub connection banner, and the profiles card loading, empty and failed. 5 sections (5 pairs, formal), with the defaults for you to confirm.',
            },
            // Kenny, 2026-10-19 (kp-themes 11.0.0 adoption, kyu): kyu's dashboard with every component that fits used to the full, formal only, five parts; map in kyu docs/KP_THEMES_11_ADOPTION.md.
            {
                href: 'research/kyu-11-overview/demo.html',
                label: 'kyu, part 1 of 5: across every page',
                about: 'The command palette, keyboard shortcuts and their help sheet, a first-visit tour, links to a heading or a row, and two overviews of which app reads which topic. Formal only.',
            },
            {
                href: 'research/kyu-11-topics/demo.html',
                label: 'kyu, part 2 of 5: the Topics page',
                about: 'The list of every topic: key figures that filter the table, what needs attention first, the topics table with bars, flow and live refresh, the command to start a topic, and two new views (a heat map per hour and trend tiles). Formal only; items marked New need kyu backend work.',
            },
            {
                href: 'research/kyu-11-topic-subs/demo.html',
                label: 'kyu, part 3 of 5: the Topic page, sending and subscriptions',
                about: 'The topic header, the four commands to send and receive with the token kept hidden, the warning when no app token exists yet, and the subscriptions table with its filter, row menu, archive with undo and delete by typing the name. Formal only.',
            },
            {
                href: 'research/kyu-11-topic-messages/demo.html',
                label: 'kyu, part 4 of 5: the Topic page, dead letters and messages',
                about: 'Dead letters with their reason and remedy, readable payloads, requeue or delete many at once, recent messages beside their payload, new arrivals, replay, and the publish box that checks its JSON. Formal only; items marked New need kyu backend work.',
            },
            {
                href: 'research/kyu-11-subscription/demo.html',
                label: 'kyu, part 5 of 5: the Subscription page',
                about: 'One subscription: its header, its policy, gauges against the lease and the attempts, the backlog with bulk delete, and three new views of delivery attempts and 90 days of history. Formal only; items marked New need kyu backend work.',
            },
        ],
    },
    {
        // Every demo here has its decision taken. A new research demo goes in
        // a 'Research to look at' group of its own, above this one, and moves
        // down here once Kenny has decided on it [scope-81].
        group: 'Archived research',
        // Decided demos stay reachable from the Agenda's Done list, not from the side navigation (Kenny, 2026-10-13).
        nav: false,
        pages: [
            // Decided 2026-10-19 01:52: Kenny approved every findings pair (research/findings-1019/decided.json).
            // Kenny, 2026-10-19 (findings-1019): four package faults found while the components page was checked, each a change to an approved component, so asked again in all twelve themes with what was wrong and what is different now: Copy in a command block and Back/Next of the check-in broke per letter on a phone, the flash button set to grow by hand was empty, a lede with fold and link never folded. Generated by research/findings-1019/build.mjs.
            {
                href: 'research/findings-1019/demo.html',
                label: 'Four faults found in the package: Copy, Back and Next, the flash button and the lede',
                about: 'The Copy button of a command block and the Back and Next buttons of the check-in broke their words letter by letter on a phone, the flash button set to grow by hand was an empty button, and a lede asked to fold and carry a link never folded. 4 sections (48 pairs): each fault in the twelve themes, the first two in a phone-width frame. Each says what was wrong and what is different now.',
            },
            // Decided 2026-10-19 00:50: Kenny approved dark keys on every red alert in synthwave (research/synth-alert-buttons/decided.json).
            // Kenny, 2026-10-19 (synth-alert-1019): two rulings disagree about the buttons on a synthwave red alert (scope-94 "Alleen Try again", 2026-09-15; round t56 dark keys, approved 2026-10-18). One section, five red-alert contexts, one option at the component to flip between the rulings. Hand-written page: research/synth-alert-buttons.
            {
                href: 'research/synth-alert-buttons/demo.html',
                label: 'Synthwave: buttons on a red alert, dark keys everywhere or only on the named plates',
                about: 'Your September ruling (only the data table\'s Try again takes the alert\'s ink, every other button keeps its pink frame) and the dark keys you approved on 18/10 disagree for the plain Try again and any plain red alert. 1 section (1 pair, synthwave): five red alerts one under the other, and an option to see each ruling.',
            },
            // Decided 2026-10-18 22:36: Kenny approved every choose pair over three rounds (research/kpadopt56-choose/decided.json).
            {
                href: 'research/kpadopt56-choose/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 2 of 14: Pickers and palettes',
                about: 'Picking from a list: the usual on top, with its band and its states, and words in any order. 5 sections (55 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every fields pair (research/kpadopt56-fields/decided.json).
            {
                href: 'research/kpadopt56-fields/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 4 of 14: Fields and inputs',
                about: 'Entering a value: a slider with a typed value beside it, a time of day, a text box that grows, a JSON box that checks what you type, and a star rating. 9 sections (99 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every lists pair (research/kpadopt56-lists/decided.json).
            {
                href: 'research/kpadopt56-lists/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 7 of 14: Lists, records and pages',
                about: 'Rows and what sits in them: ticking with the keyboard, who brings what, a list with its detail, new lines on a live list, payloads, requests, a console, and the frame of a dashboard page. 8 sections (88 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every media pair (research/kpadopt56-media/decided.json).
            {
                href: 'research/kpadopt56-media/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 13 of 14: Pictures, documents and printing',
                about: 'Things you look at or take away: the picture gallery, the document preview, anchors on headings and rows, a QR code, and a printed checklist. 8 sections (88 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every people pair (research/kpadopt56-people/decided.json).
            {
                href: 'research/kpadopt56-people/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 14 of 14: People and cards',
                about: 'Who is who: the avatar, the list of ways to sign in, the conversation in bubbles, and the entity card. 8 sections (88 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every schedule pair (research/kpadopt56-schedule/decided.json).
            {
                href: 'research/kpadopt56-schedule/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 1 of 14: Schedules and reminders',
                about: 'Choosing weekdays, seeing the next times a schedule runs, snoozing, and a schedule written as a sentence. 8 sections (88 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every status pair (research/kpadopt56-status/decided.json).
            {
                href: 'research/kpadopt56-status/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 9 of 14: Messages and status',
                about: 'Telling the reader what is going on: a problem with its reason and its remedy, the offline banner, a transfer with its time left, the notification centre, the line under a heading, and the today card. 7 sections (77 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 21:37: Kenny approved every updates pair (research/kpadopt56-updates/decided.json).
            {
                href: 'research/kpadopt56-updates/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 5 of 14: Updating safely',
                about: 'What an update list needs: the size of a version jump, a tick before it may start, what needs what, and how often the list refreshes. 7 sections (77 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 22:09: Kenny approved every follow-ups pair (research/kpadopt56-followups/decided.json).
            // Kenny, 2026-10-18 (kpadopt5/6 follow-ups): two faults found in approved work, asked again with what changed. The floating selection bar could not be seen in the review dialog (his note "ik zie de balk nergens?"; twelve themes), and the two picker samples shown opened flickered when half in view (formal). Generated by research/kpadopt56-followups/build.mjs.
            {
                href: 'research/kpadopt56-followups/demo.html',
                label: 'Two things found in work you approved: the floating selection bar and the opened pickers',
                about: 'The selection bar that floats at the foot of the window could not be seen in the review dialog, and two picker samples shown opened flickered open and shut when half in view. 2 sections (13 pairs): the bar in twelve themes, dark first, and the pickers in formal. Each says what you saw before and what is different now.',
            },
            // Decided 2026-10-18 19:53: Kenny approved every toggles pair over three rounds (research/kpadopt56-toggles/decided.json).
            {
                href: 'research/kpadopt56-toggles/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 3 of 14: Dated options, toggles and keys',
                about: 'Options with a date, a button that stays pressed, and keys that know their own list. 5 sections (55 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 19:08: Kenny approved every pages pair in the eleven themes (research/kpadopt56-pages/decided.json).
            {
                href: 'research/kpadopt56-pages/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 8 of 14: Requests, consoles and pages',
                about: 'Looking into a request, a console with a prompt and a block per command, and the frame of a dashboard page. 5 sections (55 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 19:08: Kenny approved every charts pair in the eleven themes (research/kpadopt56-charts/decided.json).
            {
                href: 'research/kpadopt56-charts/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 11 of 14: Charts and maps',
                about: 'Drawings of data: chart markers and a median line, what uses what, and the path of a connection. 7 sections (77 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 19:08: Kenny approved every calm pair in the eleven themes (research/kpadopt56-calm/decided.json).
            {
                href: 'research/kpadopt56-calm/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 10 of 14: Calm screens',
                about: 'A quiet daily check-in: calm mode, calm days, the quote card and questions one per screen. 8 sections (88 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 19:08: Kenny approved every availability pair in the eleven themes (research/kpadopt56-availability/decided.json).
            {
                href: 'research/kpadopt56-availability/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 12 of 14: Who can come',
                about: 'People over days or periods, in five sections of the same grid: its states, how people answer, the best column, the rows and the summary, and the phone and density. 5 sections (55 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 19:08: Kenny approved every confirm pair in the eleven themes (research/kpadopt56-confirm/decided.json).
            {
                href: 'research/kpadopt56-confirm/demo.html',
                label: 'Fifth and sixth adoption rounds in the other themes, part 6 of 14: Saving, undoing and answering',
                about: 'What happens after you act: the unsaved-changes bar, a toast with Undo, a button that shows its result, a question that waits for your answer, and the bar over a selection. 8 sections (88 pairs), asked in the eleven themes other than formal, one theme per step; formal is already approved.',
            },
            // Decided 2026-10-18 18:42: Kenny approved every formal re-review section over two rounds (research/kpadopt56-formal/decided.json).
            {
                href: 'research/kpadopt56-formal/demo.html',
                label: 'Approved in formal, changed since: judge it again',
                about: 'Eleven components you approved in formal that look different now because the shared package code changed: bars that scroll sideways at phone width, version badges, checklist detail, entity card actions, chart labels and the availability grid. Each says what changed and what to check; a width switch shows 1280 and 390.',
            },
            // Decided 2026-10-18 01:21: Kenny approved every kpadopt6 ops part in formal, defaults kept (research/kpadopt6-ops/decided.json).
            {
                href: 'research/kpadopt6-ops/demo.html',
                label: 'More parts for a dashboard, second round (toggle button, word-order search, stack card)',
                about: 'The three parts of the sixth ops round that came back, in formal only: the button that stays pressed (beside the segmented control the package already has), the command palette that finds words in any order (now always the same list) and the fixed card for one stack (buttons only from the data). One topic per part.',
            },
            // Decided 2026-10-18 01:21: Kenny approved every kpadopt5 ops part in formal, defaults kept (research/kpadopt5-ops/decided.json).
            {
                href: 'research/kpadopt5-ops/demo.html',
                label: 'Operations parts for a dashboard (page frame, list and detail, auto refresh, connection banner, transfers, questions, notifications)',
                about: 'Seven parts a dashboard needs, in formal only: the page frame, a list with its detail that folds on a phone, the automatic refresh chooser, the offline banner, a transfer with speed and time left, a question that waits for an answer and the notification centre. One topic per part.',
            },
            // Decided 2026-10-18 01:21: Kenny approved every kpadopt5 rows part in formal, defaults kept (research/kpadopt5-rows/decided.json).
            {
                href: 'research/kpadopt5-rows/demo.html',
                label: 'The fifth adoption round, rows: ticking rows, selection bar, undo toast, new-lines pill, payload cell, JSON box, request inspector',
                about: 'Seven new parts for lists that are worked through, in formal only, one review topic per part, with the real choices to tick.',
            },
            // Decided 2026-10-18 00:28: Kenny approved every kpadopt5 basics pair in formal (research/kpadopt5-basics/decided.json).
            {
                href: 'research/kpadopt5-basics/demo.html',
                label: 'The fifth adoption round, the basics: calm mode, shortcuts, explaining lines, problem alerts and a button that shows its result',
                about: 'Five small parts every page needs, in formal: a switch that stops movement, keys that know their own list, the line under a heading, a problem that says what, why and what now, and a button that shows its result without changing width.',
            },
            // Decided 2026-10-18 00:28: Kenny approved every kpadopt5 people pair in formal (research/kpadopt5-people/decided.json).
            {
                href: 'research/kpadopt5-people/demo.html',
                label: 'People: avatar with a photo, ways to sign in, a conversation, chart markers',
                about: 'An avatar with a photo, the list of ways to sign in (passkeys, magic links, passwords, tokens), a conversation in bubbles, and markers, windows and a median line on a chart, in formal.',
            },
            // Decided 2026-10-18 00:28: Kenny approved every kpadopt5 time pair in formal (research/kpadopt5-time/decided.json).
            {
                href: 'research/kpadopt5-time/demo.html',
                label: 'Time and sentence: seven new parts (weekday picker, next runs, snooze, dated options, sentence form, slider, unsaved changes)',
                about: 'Seven parts that schedules, reminders and settings forms draw by hand today, built in the package and shown in formal only: a weekday picker, a list of the next times a schedule runs, a snooze picker, a picker for options with a date and an age, a form that reads as a sentence, a slider with a typed value, and a bar for unsaved changes.',
            },
            // Decided 2026-10-18 00:28: Kenny approved the kpadopt6 calm parts and changed some defaults (research/kpadopt6-calm/decided.json).
            {
                href: 'research/kpadopt6-calm/demo.html',
                label: 'Calm screens: a picker with the usual on top, one question per screen, a quiet today card, quotes, calm days, star rating',
                about: 'Six parts for a daily check-in and a today screen, in formal only: a choice list with the choices you use most on top, questions answered one per screen, a card that shows what is open, done or paused without any red, a card that quotes your own earlier words, a calendar that shows a day with nothing logged as quiet, and a star rating. One topic per part, with the real choices to tick.',
            },
            // Decided 2026-10-18 00:28: Kenny approved the kpadopt6 social parts and changed some defaults (research/kpadopt6-social/decided.json).
            {
                href: 'research/kpadopt6-social/demo.html',
                label: 'Social parts: who brings it, who can come, QR code, time field, console',
                about: 'Five parts for people who plan and talk together, in formal only: a packing list that shows who brings each item, a grid of who can come on which day, a QR code for a link, a field for a time of day and a console with a prompt. One topic per part.',
            },
            // Decided 2026-10-17 23:33: Kenny approved all eleven kpadopt6 media pairs (research/kpadopt6-media/decided.json).
            {
                href: 'research/kpadopt6-media/demo.html',
                label: 'Pictures, documents, links and text: six new parts (what uses what, picture gallery, document preview, growing text box, link anchors, printing a list)',
                about: 'Six parts the apps draw by hand today, built in the package and shown in formal only: a map of what is used by what, a gallery of pictures that open large, a document preview with its small page icon, a text box that grows with its text, link anchors on headings and rows, and lists that print well.',
            },
            // Decided 2026-10-17 18:30: Kenny approved the kpadopt4 cooking part; every kpadopt4 part is decided.
            {
                href: 'research/kpadopt4-cooking/demo.html',
                label: 'The fourth adoption round, part 8 of 9: Cooking (AuDHD recipes)',
                about: 'The cooking (audhd recipes) group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            // Decided 2026-10-17 17:20: Kenny approved the kpadopt4 values part (forest's tick: branded digits).
            {
                href: 'research/kpadopt4-values/demo.html',
                label: 'The fourth adoption round, part 1 of 9: Values and figures',
                about: 'The values and figures group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            // Decided 2026-10-17 15:37: Kenny approved the kpadopt4 commands part in all eleven themes.
            {
                href: 'research/kpadopt4-commands/demo.html',
                label: 'The fourth adoption round, part 9 of 9: Commands and comparison',
                about: 'The commands and comparison group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            // Decided 2026-10-17 03:43: Kenny approved six kpadopt4 parts in all eleven themes (rows, records, cards, flows, secrets, time).
            {
                href: 'research/kpadopt4-rows/demo.html',
                label: 'The fourth adoption round, part 2 of 9: Rows and lists',
                about: 'The rows and lists group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            {
                href: 'research/kpadopt4-records/demo.html',
                label: 'The fourth adoption round, part 3 of 9: Records and forms',
                about: 'The records and forms group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            {
                href: 'research/kpadopt4-cards/demo.html',
                label: 'The fourth adoption round, part 4 of 9: Cards and states',
                about: 'The cards and states group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            {
                href: 'research/kpadopt4-flows/demo.html',
                label: 'The fourth adoption round, part 5 of 9: Flows and timelines',
                about: 'The flows and timelines group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            {
                href: 'research/kpadopt4-secrets/demo.html',
                label: 'The fourth adoption round, part 6 of 9: Secrets and confirmation',
                about: 'The secrets and confirmation group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            {
                href: 'research/kpadopt4-time/demo.html',
                label: 'The fourth adoption round, part 7 of 9: Time and timers',
                about: 'The time and timers group of the fourth adoption round in the eleven themes other than formal, one theme per step.',
            },
            // Decided 2026-10-17 00:31: Kenny approved all 51 sections of kpadopt4 in formal (round 2); the other themes are asked in its nine parts.
            {
                href: 'research/kpadopt4/demo.html',
                label: 'The fourth adoption round in formal: 51 sections in nine topics',
                about: 'Everything the component survey of 16/10/2026 found missing from the apps, built in the package and approved in formal; the source page of the nine parts that ask the eleven other themes.',
            },
            // Decided 2026-10-16 19:17: Kenny approved kpadopt2 (round 6) and kpadopt3 (round 2) in all 16 themes; recorded in their VERDICTS.json.
            {
                href: 'research/kpadopt3/demo.html',
                label: 'Round 3, page round 2: four of the six options in the fifteen other themes',
                about: 'Formal was approved in full in round 1. This round asks the fifteen other themes for the four options that are seen, each drawn in that theme’s own language: the separator in the folding bar (upright, in the phone’s list), the run timeline’s day buttons and series runs, the week agenda’s next 8 as a phone list, and the facet swatch’s identity pattern.',
            },
            {
                href: 'research/kpadopt2/demo.html',
                label: 'Round 5: the eight components in the fifteen other themes',
                about: 'Eight components the dashboard draws itself, each section judged in one review dialog: .kp-action tiles, .kp-statusrow, .kp-facets, .kp-heat, .kp-matrix, .kp-bar-cell with the table’s data-kp-sort-value, .kp-week, .kp-gantt. Approved in formal (rounds 1 to 4); this round asks every other theme, each built from its own parts.',
            },
            // Decided 2026-10-16 13:29: Kenny approved kpadopt-nav in full, the last pair (phantom's folding bar) in round 5; recorded in research/kpadopt-nav/VERDICTS.json.
            {
                href: 'research/kpadopt-nav/demo.html',
                label: 'Top bar that folds behind More, bottom tab bar, running-job button',
                about: 'The dashboard folds its bar by hand, draws its own phone tab bar and its own running-job pill: each is now built into the package, in all 16 themes, with every state, and shown with the real shell in three windows.',
            },
            // Decided 2026-10-16: Kenny approved all three in full (kpadopt-controls 48 of 48 in round 2, kpadopt-feedback 48 of 48 in round 1, kpadopt-tooltip-sort 48 of 48 in round 2); recorded in each folder's VERDICTS.json.
            {
                href: 'research/kpadopt-controls/demo.html',
                label: 'Segmented control, list toolbar and key line',
                about: 'Three parts the admin dashboard draws itself: the segmented control and filter chips, the toolbar above a list (search, filter groups, the filters that are on), and the inline line of keyboard shortcuts. Every state, in all sixteen themes.',
            },
            {
                href: 'research/kpadopt-feedback/demo.html',
                label: 'Feedback components: a toast that waits, a live step list, a diff hunk header',
                about: 'The dashboard draws these itself because the package lacks them: toast() gains pause, linger, close and sticky; .kp-steplist (pending, running, done, failed, skipped, announced to a screen reader); .kp-diff__hunk.',
            },
            {
                href: 'research/kpadopt-tooltip-sort/demo.html',
                label: 'Hover card, plain-click multi-sort, group headings that stay',
                about: 'One hover card filled when it opens (survives a table rebuilt every 30 s), a data table where every plain header click adds a sort key, and group headings that stay visible while loading, failed or empty.',
                affects: 'the admin dashboard swaps its own hover card (ui.js .nx-tip), sortclick.js and the Backups repository headings for these.',
            },
            // Decided 2026-10-15 02:30: Kenny approved both in full: phantom's one hard plate (option 1) and deco's inlay under the button that opened it; both ported to the package.
            {
                href: 'research/leftover-looks/demo.html',
                label: "Two leftover looks: phantom's second plate, deco's menu inlay",
                about: "Phantom's cut-paper cards, menus, dialogs and toasts cannot show their deep red second plate, and deco's menu inlay starts in the middle of the menu instead of under its button: each shown now next to the proposals.",
            },
            // Decided 2026-10-15 01:11: Kenny approved the side navigation's opener in full (64 of 64, all 16 themes; the edge tab is the default).
            { href: 'research/sidenav-opener/demo.html', label: 'Side navigation: launcher or edge tab' },
            // Decided 2026-10-14 19:12: Kenny approved both side navigation minor demos in full (behaviour 64 of 64, look 96 of 96, all 16 themes).
            { href: 'research/sidenav-minor/look.html', label: 'Side navigation: six new looks' },
            { href: 'research/sidenav-minor/behaviour.html', label: 'Side navigation: four new behaviours' },
            // Decided 2026-10-14 16:50: Kenny approved pastel as applied in full (23 of 23 blocks, round 2: the side navigation moves alone, every key figure tacked).
            { href: 'research/pastel-applied/demo.html', label: 'Pastel, as applied' },
            // Decided 2026-10-14 03:23: Kenny approved pastel's grammar after update 2 (research/pastel-character/decided.json): loading = the pom-pom caterpillar 6, spinner = the caterpillar 2, leave = the thumbtack, focus = the dashed line alone.
            { href: 'research/pastel-character/demo.html', label: 'What makes pastel pastel' },
            // Decided 2026-10-13 23:35: Kenny approved both in full (all-themes-applied 176 of 176, sidenav-edge 80 of 80).
            {
                href: 'research/all-themes-applied/demo.html',
                label: 'Every theme: closes as opens',
                about: "Every theme's bar, side navigation, palette, pickers, tour, dialogs and alarm close as their opening played backwards, with the theme's own effect.",
                // Its block 2 (the side navigation) is drawn with the side navigation's defaults, which the edge demo decides.
                after: ['research/sidenav-edge/demo.html'],
            },
            // Kenny, 2026-10-13 (his words, translated from Dutch): "That same side navigation must have a button (e.g. a hamburger icon) at the very top left of the page that is static; the sidebar itself must come all the way out of the left side of the screen and push the other content to the right (or there must be enough margin so nothing is obstructed; make both demos)." and "Maybe there should also be an option that does obstruct the content: make three demos and/or the option to choose the version through attributes.": push, reserved gutter and over, one attribute each (research/sidenav-edge).
            {
                href: 'research/sidenav-edge/demo.html',
                label: "The side navigation at the window's edge",
                about: "The side navigation slides out of the window's edge behind a fixed menu button, three ways (push the page, keep room for it, or cover it), plus its icon rail.",
                affects:
                    "block 2 of 'Every theme: closes as opens' (the side navigation) takes its defaults from here, so it is redrawn and asked again.",
            },
            // Decided 2026-10-13 00:19: Kenny approved all twenty cyberpunk components in the applied demo (research/cyberpunk-applied; audit in _audit/MISSING.md).
            { href: 'research/cyberpunk-applied/demo.html', label: 'Cyberpunk, as applied' },
            // Kenny, 2026-10-09: a showcase of every forest component changed by the uniformity round, to approve.
            { href: 'research/forest-applied/demo.html', label: 'Forest, as applied' },
            // Decided 2026-10-12 19:11: Kenny approved forest in full (round 6); nothing open.
            // Dropped 2026-10-08: Kenny stopped the theme in the anchor round (research/high-contrast-anchor/decided.json).
            { href: 'research/high-contrast-anchor/demo.html', label: "What is high-contrast's anchor element" },
            // Dropped 2026-10-08: Kenny stopped the theme in the anchor round (research/sepia-anchor/decided.json).
            { href: 'research/sepia-anchor/demo.html', label: "What is sepia's anchor element" },
            // Decided 2026-10-08: Kenny picked the line that lays the film down, turning, as dark's anchor element, update 1 (research/dark-anchor/decided.json).
            { href: 'research/dark-anchor/demo.html', label: "What is dark's anchor element" },
            // Decided 2026-10-08: Kenny approved formal's grammar, every recommendation except the hover = a rule under the label and the motifs = plus the seal where picked (research/formal-character/decided.json).
            { href: 'research/formal-character/demo.html', label: 'What makes formal formal' },
            // Decided 2026-10-09: Kenny approved dark's grammar after update 1 (research/dark-character/decided.json).
            { href: 'research/dark-character/demo.html', label: 'What makes dark dark' },
            // Decided 2026-10-09: Kenny approved deco's picks after update 3 (research/deco-character/decided.json).
            { href: 'research/deco-character/demo.html', label: 'What makes deco deco' },
            // Decided 2026-10-09: Kenny approved all ten uniformity questions of forest (research/forest-uniformity/decided.json).
            { href: 'research/forest-uniformity/demo.html', label: 'Forest, straightened' },
            // Decided 2026-10-08: Kenny picked the fan (and the progress bar is to be redone) as deco's anchor element (research/deco-anchor/decided.json).
            { href: 'research/deco-anchor/demo.html', label: "What is deco's anchor element" },
            // Decided 2026-10-08: Kenny picked the double rule (the account is closed) as formal's anchor element (research/formal-anchor/decided.json).
            { href: 'research/formal-anchor/demo.html', label: "What is formal's anchor element" },
            // Decided 2026-10-08 01:00: Kenny picked the floor as the page, behind the plates (research/synthwave-floor/decided.json).
            { href: 'research/synthwave-floor/demo.html', label: "Synthwave's floor depth" },
            // Decided 2026-10-08 01:02: Kenny approved all nineteen of nostromo's grammar questions (research/nostromo-character/decided.json); applied to css/nostromo-register.css.
            { href: 'research/nostromo-character/demo.html', label: 'What makes nostromo nostromo' },
            // Decided 2026-10-07 23:54: Kenny settled all eighteen questions of synthwave's grammar (research/synthwave-character/decided.json); ported into css/synthwave-register.css.
            { href: 'research/synthwave-character/demo.html', label: 'What makes synthwave synthwave' },
            // Decided 2026-10-07 23:52: Kenny approved all eighteen cyberpunk character questions after two updates; Channel split for curve, opening and leave, Split edge for hover, Bars with a glitch copy for the spinner (research/cyberpunk-character/decided.json); applied in css/cyberpunk-register.css.
            { href: 'research/cyberpunk-character/demo.html', label: 'What makes cyberpunk cyberpunk' },
            // Decided 2026-10-07 23:44: Kenny approved all nineteen brutalism character questions after three updates; Loading = Hoisted as a lintel, the progress bar = Ruled and labelled a lot slower (research/brutalism-character/decided.json).
            { href: 'research/brutalism-character/demo.html', label: 'What makes brutalism brutalism' },
            // Decided 2026-10-07 23:41: Kenny approved the sixteen blueprint character picks (research/blueprint-character/decided.json).
            { href: 'research/blueprint-character/demo.html', label: 'What makes blueprint blueprint' },
            // Decided 2026-10-07 23:18: Kenny approved solstice's grammar, every recommendation except the focus ring = a halo and the leave = the morning mist (research/solstice-character/decided.json); applied in css/solstice-register.css.
            { href: 'research/solstice-character/demo.html', label: 'What makes solstice solstice' },
            // Decided 2026-10-07 21:21: Kenny picked the page horizon as synthwave's anchor element (research/synthwave-anchor/decided.json).
            { href: 'research/synthwave-anchor/demo.html', label: "Synthwave's anchor element" },
            // Decided 2026-10-07 21:19: Kenny picked the tracing pen as blueprint's anchor element (research/blueprint-anchor/decided.json).
            { href: 'research/blueprint-anchor/demo.html', label: 'What anchors blueprint' },
            // Decided 2026-10-07 20:10: Kenny picked the raster as nostromo's anchor element (research/nostromo-anchor/decided.json).
            { href: 'research/nostromo-anchor/demo.html', label: "Nostromo's anchor element" },
            // Decided 2026-10-07 02:49: Kenny picked the count-down stutter as cyberpunk's live update (research/cyberpunk-live/decided.json); ported into css/cyberpunk-register.css in place of the glitch and settle.
            { href: 'research/cyberpunk-live/demo.html', label: "Cyberpunk's live update: the chromatic split" },
            // Kenny, 2026-10-07 02:55: the demos still open are no longer relevant ("doe de demos die nu nog openstaan weg"); archived, files kept.
            // Kenny, 2026-10-06 14:56: a faster way to judge, "doe een paar pogingen": three prototypes of the review surface on the open trend and graph rounds.
            { href: 'research/review-ui/demo.html', label: 'Three faster ways to judge a demo' },
            // Kenny, 2026-10-06 23:52: every component's decided pick side by side per family (loading first), one theme at a time, to pick the one the theme speaks.
            { href: 'research/families/demo.html', label: "Every component's pick, family by family" },
            // Kenny, 2026-10-07 02:54: did not work as a way to choose; replaced by a per-theme character analysis, forest first
            { href: 'research/families-applied/demo.html', label: 'The family picks, applied' },
            // Kenny, 2026-10-07 00:05: what makes titanium titanium, seventeen rules of its grammar as questions, each option a live scene, the recommendation first.
            { href: 'research/titanium-character/demo.html', label: 'What makes titanium titanium' },
            // Kenny, 2026-10-07: forest's skeleton drawn as wide light diagonal stripes "does not give forest vibes" (the tree line above it he likes); five pictures for the block, circle and lines, each on the same scene, the recommendation first and the current plot as one of them.
            { href: 'research/forest-skeleton/demo.html', label: "Forest's skeleton: five pictures" },
            // Decided 2026-10-07 20:05: Kenny approved option 1, the treeline fills in, as forest's skeleton (research/forest-skeleton/decided.json); ported into css/forest-register.css.
            // Kenny, 2026-10-07 02:54: what makes forest forest, the titanium way (the analysis in themes/forest/CHARACTER.md), seventeen rules of its grammar as questions, each option a live scene, the recommendation first; the first theme of the one-by-one series.
            { href: 'research/forest-character/demo.html', label: 'What makes forest forest' },
            // Decided 2026-10-07 17:47: Kenny approved forest's grammar, every recommendation except the corners = the leaf corner (research/forest-character/decided.json); applied in css/forest-register.css.
            // Kenny, 2026-10-06 20:59 (form v39): every titanium loading element twice, as today and in the key figure's anodising bath (r2-ti-load-1).
            { href: 'research/titanium-loading/demo.html', label: 'Titanium loading: today and the anodising bath' },
            // The character round's first component (form v18, 2026-10-05): two meters of its own per theme, all 22 in one demo.
            { href: 'research/character-meter/demo.html', label: 'A meter of its own, per theme' },
            // Decided 2026-10-07 01:33: Kenny picked the facing cut as titanium's spinner (research/titanium-spinner/decided.json); ported into css/titanium-register.css in place of the drill.
            { href: 'research/titanium-spinner/demo.html', label: 'A spinner for titanium' },
            // Decided 2026-10-06 23:41: Kenny approved the data table's busy overlay in all 22 themes (research/character-busy/decided.json); it moves into the registers at the port.
            { href: 'research/character-busy/demo.html', label: "A data table's busy overlay, of its own, per theme" },
            // Decided 2026-10-06 21:54: Kenny approved the drawer and its tour in all 22 themes (research/character-drawer/decided.json); they move into the registers at the port.
            { href: 'research/character-drawer/demo.html', label: 'A drawer and its guided tour, each of its own, per theme' },
            // Decided 2026-10-06 21:50: Kenny approved the header in all 22 themes (research/character-header/decided.json); it moves into the registers at the port.
            { href: 'research/character-header/demo.html', label: 'A page header of its own, per theme' },
            // Decided 2026-10-06 21:41: Kenny approved the state in all 22 themes (research/character-state/decided.json); it moves into the registers at the port.
            { href: 'research/character-state/demo.html', label: 'A state word of its own, per theme' },
            // Decided 2026-10-06 21:40: Kenny approved the menu button in all 22 themes (research/character-menu/decided.json); it moves into the registers at the port.
            { href: 'research/character-menu/demo.html', label: 'A menu button of its own, per theme' },
            // Decided 2026-10-06 21:37: Kenny approved the network graph in all 22 themes (research/character-graph/decided.json); it moves into the registers at the port.
            { href: 'research/character-graph/demo.html', label: 'A network graph of its own, per theme' },
            // Decided 2026-10-06 21:17: Kenny approved the key figure in all 22 themes (research/character-kpi/decided.json); it moves into the registers at the port.
            { href: 'research/character-kpi/demo.html', label: 'A key figure of its own, per theme' },
            // Decided 2026-10-06 21:02: Kenny approved the time chart in all 22 themes, one pick per aspect (research/character-chart/decided.json); it moves into the registers at the character round's port.
            { href: 'research/character-chart/demo.html', label: 'A time chart of its own, per theme' },
            // Decided 2026-10-06 21:03: Kenny approved the month heatmap in all 22 themes (research/character-calendar/decided.json); it moves into the registers at the port.
            { href: 'research/character-calendar/demo.html', label: 'A month heatmap of its own, per theme' },
            // Decided 2026-10-06 21:08: Kenny approved the trend tile in all 22 themes (research/character-trend/decided.json); it moves into the registers at the port.
            { href: 'research/character-trend/demo.html', label: 'A trend tile of its own, per theme' },
            // Decided 2026-10-06 21:11: Kenny approved the dashboard tiles in all 22 themes (research/character-tiles/decided.json); they move into the registers at the port.
            { href: 'research/character-tiles/demo.html', label: 'Dashboard tiles of their own, per theme' },
            // Decided 2026-10-06 11:50: Kenny approved the strip columns in all 22 themes, one pick per aspect (research/character-columns/decided.json); they move into the registers at the character round's port.
            { href: 'research/character-columns/demo.html', label: 'A key-figure strip of its own, per theme' },
            // Decided 2026-10-05 12:30: Kenny picked formal's checked stamp, cyberpunk's glitch and settle and titanium's heat tint; moved into the package (js/update.js, `--kp-update` in the three registers, catalogue/motion.html#update).
            { href: 'research/update-motion/demo.html', label: 'Information that updates in place' },
            // Decided 2026-10-05: Kenny approved the reverse of close in full; in formal, cyberpunk and titanium a dialog and an arriving element open as their close turned around (js/motion.js, `--kp-open: reverse-close`).
            { href: 'research/open-reverse/demo.html', label: 'Opening as the reverse of closing' },
            // Decided at scope-143 (2026-10-05): the seven components of round two, moved into the package.
            { href: 'research/dashboard-ports-2/demo.html', label: 'Dashboard components to port, round two' },
            // Decided at scope-143: the eight dashboard components, moved into the package.
            { href: 'research/dashboard-ports/demo.html', label: 'Dashboard components to port' },
            // Decided at scope-142: closing, resizing, arriving and leaving, every theme.
            { href: 'research/size-motion/demo.html', label: 'Closing, resizing and leaving per theme' },
            // Decided at scope-124: the three research demos of 2026-09-17.
            { href: 'research/jellyfin/demo.html', label: 'Jellyfin: the web client in two themes' },
            { href: 'research/vscode/demo.html', label: 'VS Code: cyberpunk as an editor theme' },
            { href: 'research/navbar/demo.html', label: 'Navigation alternatives' },
            { href: 'research/gap-9-far-edge/demo.html', label: 'The panel at the far edge, now and as proposed' },
            { href: 'research/gap-10-nested-themes/demo.html', label: 'A theme inside a theme' },
            { href: 'research/futuristic/demo.html', label: 'Futuristic layouts' },
            { href: 'research/loading/demo.html', label: 'Loading per theme' },
            { href: 'research/datatable/demo.html', label: 'Data tables' },
            { href: 'research/control-height/demo.html', label: 'Control heights' },
            { href: 'research/uniform-size/demo.html', label: 'Uniform sizes' },
            { href: 'research/intro-loading/demo.html', label: 'Intros and loading' },
            { href: 'research/review-dialog/demo.html', label: 'Review dialog' },
            { href: 'research/dividers/demo.html', label: 'Softer dividers and a shape knob' },
            { href: 'research/alarm/demo.html', label: 'The alarm: a full-screen dramatic alert' },
            { href: 'research/progress-signature/demo.html', label: 'A progress bar of its own, per theme' },
            { href: 'research/queue-look/demo.html', label: 'The look-round: five measurements waiting' },
            { href: 'research/signature-elements/demo.html', label: 'Other elements with a signature per theme' },
            { href: 'research/signature-dialog/demo.html', label: 'How a dialog opens, per theme' },
            { href: 'research/dialog-title/demo.html', label: "The dialog title: the theme's own or the fixed size" },
            { href: 'research/cyberpunk-dividers/demo.html', label: 'A new divider for cyberpunk, six options' },
            { href: 'research/laurels/demo.html', label: 'Laurels and platforms, four directions' },
            { href: 'research/scope25-gestures/demo.html', label: 'The scope-25 gestures beside what ships' },
            // Decided at scope-102: the oxide halo, painted as four fixed
            // shadows on the dialog, the card and the popover family.
            { href: 'research/dark-dialog-shadow/demo.html', label: "Dark's dialog shadow, five options" },
            { href: 'research/dark-menu-shadow/demo.html', label: "Dark's dropdown menu: the halo or not" },
            { href: 'research/theme-portraits/cyberpunk.html', label: 'Portrait: cyberpunk' },
            { href: 'research/theme-portraits/formal.html', label: 'Portrait: formal' },
            { href: 'research/theme-portraits/pastel.html', label: 'Portrait: pastel' },
        ],
    },
];

/** The component pages, in order: what the review and compare pages gather. */
export const COMPONENT_PAGES = PAGES.flatMap((group) => group.pages).filter((page) => page.component);
