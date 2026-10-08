// Every review page, in the order the navigation shows them. Its own module
// so the review page can read the list without mounting the shell twice.
// gates/check-catalogue.mjs refuses a catalogue page or a research demo that
// is missing here, and an entry here with no page behind it.

/** @typedef {{ href: string, label: string, component?: boolean, review?: boolean, rework?: string }} Page */

/** @type {{ group: string, pages: Page[] }[]} */
export const PAGES = [
    {
        group: 'Review',
        pages: [
            { href: 'catalogue/index.html', label: 'Every component, one page' },
            { href: 'catalogue/changed.html', label: 'To judge: start here' },
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
            // Kenny, 2026-10-08: the anchor round for the nine themes without one, the grotesk way (one question, six to ten candidates, each in its own scene, as a progress bar and as a button press, the recommendation first).
            // Kenny, 2026-10-08: what makes formal, light and deco themselves, the forest way (the analysis in themes/<theme>/CHARACTER.md), the nineteen questions each, every option a live scene that follows from the theme's decided anchor, the recommendation first.
            // Kenny, 2026-10-08 (update 1): deco's grammar did not convince him ("fancy, distinguished … lots of gold accents and fancy blue backgrounds … elegance without being too in your face"); thirteen questions redrawn as thin gold on lacquer with the wallpaper, his six picks kept.
            {
                href: 'research/deco-character/demo.html',
                label: 'What makes deco deco',
                rework: 'update 2: corners, loading, bar, leave, hover and press redrawn, as Kenny asked',
            },
            // Kenny, 2026-10-08: what makes dark, retro and phantom themselves, the forest way (the analysis in themes/<theme>/CHARACTER.md), the nineteen questions each, every option a live scene that follows from the theme's decided anchor, the recommendation first.
            {
                href: 'research/dark-character/demo.html',
                label: 'What makes dark dark',
                rework: 'update 1: opening, corners, loading and spinner redrawn, as Kenny asked',
            },
            {
                href: 'research/retro-character/demo.html',
                label: 'What makes retro retro',
                rework: 'update 1: loading fitted to every waiting part, as Kenny asked',
            },
            {
                href: 'research/phantom-character/demo.html',
                label: 'What makes phantom phantom',
            },
            // The character round, sixth demo (2026-10-05): the key-figure strip with its columns in 22 themes, two characters each.
            // The character round, eighth component: the attention band, shape/arrival/leave/tone/empty/loading, one pick per aspect (formal and titanium built first).
            // The character round, ninth and tenth components: the action columns and the menu button.
            // Kenny, 2026-10-07 03:50: what makes nostromo nostromo, the same way (the analysis in themes/nostromo/CHARACTER.md), eighteen rules of its grammar as questions, each option a live scene, the recommendation first; the second theme of the one-by-one series.
            // Kenny, 2026-10-07 04:23: what makes solstice solstice, the same way (the analysis in themes/solstice/CHARACTER.md), eighteen rules of its grammar as questions, each option a live scene, the recommendation first; the fifth theme of the one-by-one series, after synthwave.
            // Kenny, 2026-10-07 04:23: what makes brutalism brutalism, the same way (the analysis in themes/brutalism/CHARACTER.md), eighteen rules of its grammar as questions, each option a live scene, the recommendation first; the sixth theme of the one-by-one series, after solstice.
            // Kenny, 2026-10-07 04:23: what makes grotesk grotesk, the same way (the analysis in themes/grotesk/CHARACTER.md), nineteen rules of its grammar as questions, each option a live scene, the recommendation first; the seventh theme of the one-by-one series, after brutalism. Questions 9 to 12 are the grotesk-only loading demo Kenny asked for on 2026-10-06 21:37, from the graph's Out of register.
        ],
    },
    {
        // Every demo here has its decision taken. A new research demo goes in
        // a 'Research to look at' group of its own, above this one, and moves
        // down here once Kenny has decided on it [scope-81].
        group: 'Archived research',
        pages: [
            // Dropped 2026-10-08: Kenny stopped the theme in the anchor round (research/high-contrast-anchor/decided.json).
            { href: 'research/high-contrast-anchor/demo.html', label: "What is high-contrast's anchor element" },
            // Dropped 2026-10-08: Kenny stopped the theme in the anchor round (research/sepia-anchor/decided.json).
            { href: 'research/sepia-anchor/demo.html', label: "What is sepia's anchor element" },
            // Decided 2026-10-08: Kenny picked the line that lays the film down, turning, as dark's anchor element, update 1 (research/dark-anchor/decided.json).
            { href: 'research/dark-anchor/demo.html', label: "What is dark's anchor element" },
            // Decided 2026-10-08: Kenny picked the Copying dialog's flying sheet as retro's anchor element, attempt 1 of 3, with the 1995 desktop around it (research/retro-anchor/decided.json).
            { href: 'research/retro-anchor/demo.html', label: "What is retro's anchor element" },
            // Decided 2026-10-08: Kenny picked the card thrown as a screen that resolves at the slap as phantom's anchor element, update 1 (research/phantom-anchor/decided.json).
            { href: 'research/phantom-anchor/demo.html', label: "What is phantom's anchor element" },
            // Decided 2026-10-08: Kenny approved formal's grammar, every recommendation except the hover = a rule under the label and the motifs = plus the seal where picked (research/formal-character/decided.json).
            { href: 'research/formal-character/demo.html', label: 'What makes formal formal' },
            // Decided 2026-10-08: Kenny approved light's grammar, every recommendation except the durations = unhurried and the busy bar = the bead orbits the line (research/light-character/decided.json).
            { href: 'research/light-character/demo.html', label: 'What makes light light' },
            // Decided 2026-10-08: Kenny picked the fan (and the progress bar is to be redone) as deco's anchor element (research/deco-anchor/decided.json).
            { href: 'research/deco-anchor/demo.html', label: "What is deco's anchor element" },
            // Decided 2026-10-08: Kenny picked the glare (overexposed) as light's anchor element (research/light-anchor/decided.json).
            { href: 'research/light-anchor/demo.html', label: "What is light's anchor element" },
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
            // Decided 2026-10-07 23:43: Kenny approved all nineteen grotesk character questions after three updates (research/grotesk-character/decided.json).
            { href: 'research/grotesk-character/demo.html', label: 'What makes grotesk grotesk' },
            // Decided 2026-10-07 23:43: Kenny approved the sixteen terminal character picks, Loading = an htop row with the cursor its head (research/terminal-character/decided.json).
            { href: 'research/terminal-character/demo.html', label: 'What makes terminal terminal' },
            // Decided 2026-10-07 23:41: Kenny approved the sixteen blueprint character picks (research/blueprint-character/decided.json).
            { href: 'research/blueprint-character/demo.html', label: 'What makes blueprint blueprint' },
            // Decided 2026-10-07 23:18: Kenny approved solstice's grammar, every recommendation except the focus ring = a halo and the leave = the morning mist (research/solstice-character/decided.json); applied in css/solstice-register.css.
            { href: 'research/solstice-character/demo.html', label: 'What makes solstice solstice' },
            // Decided 2026-10-07 21:23: Kenny picked out of register as grotesk's anchor element (research/grotesk-anchor/decided.json).
            { href: 'research/grotesk-anchor/demo.html', label: "What is grotesk's anchor element" },
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
            { href: 'research/grotesk-hover/demo.html', label: 'Grotesk hover options' },
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
            { href: 'research/retro-alarm-face/demo.html', label: "Retro's alarm headline: four faces" },
        ],
    },
];

/** The component pages, in order: what the review and compare pages gather. */
export const COMPONENT_PAGES = PAGES.flatMap((group) => group.pages).filter((page) => page.component);
