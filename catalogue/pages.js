// Every review page, in the order the navigation shows them. Its own module
// so the review page can read the list without mounting the shell twice.
// gates/check-catalogue.mjs refuses a catalogue page or a research demo that
// is missing here, and an entry here with no page behind it.

/** @typedef {{ href: string, label: string, component?: boolean, review?: boolean }} Page */

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
        // once he has decided on it [scope-81].
        group: 'Research to look at',
        pages: [
            // Kenny, 2026-10-06 14:56: a faster way to judge, "doe een paar pogingen": three prototypes of the review surface on the open trend and graph rounds.
            { href: 'research/review-ui/demo.html', label: 'Three faster ways to judge a demo' },
            // The character round's first component (form v18, 2026-10-05): two meters of its own per theme, all 22 in one demo.
            { href: 'research/character-meter/demo.html', label: 'A meter of its own, per theme' },
            // The character round, sixth demo (2026-10-05): the key-figure strip with its columns in 22 themes, two characters each.
            // The character round, eighth component: the attention band, shape/arrival/leave/tone/empty/loading, one pick per aspect (formal and titanium built first).
            // The character round, ninth and tenth components: the action columns and the menu button.
            // The character round, twelfth component: the state word, shape/tone/change, one pick per aspect (formal and titanium built first).
            { href: 'research/character-state/demo.html', label: 'A state word of its own, per theme' },
            // The character round, thirteenth component: the page header, shape/menu-open-close/interactive, one pick per aspect (formal and titanium built first).
            { href: 'research/character-header/demo.html', label: 'A page header of its own, per theme' },
            // The character round, fourteenth component: the data table's busy overlay, shape/loading/arrival/failure/phone, one pick per aspect (formal and titanium built first).
            { href: 'research/character-busy/demo.html', label: "A data table's busy overlay, of its own, per theme" },
            // The character round, fifteenth component: the help drawer and its guided tour, shape/open-close/highlight/card/next-step, one pick per aspect (formal and titanium built first).
            { href: 'research/character-drawer/demo.html', label: 'A drawer and its guided tour, each of its own, per theme' },
        ],
    },
    {
        // Every demo here has its decision taken. A new research demo goes in
        // a 'Research to look at' group of its own, above this one, and moves
        // down here once Kenny has decided on it [scope-81].
        group: 'Archived research',
        pages: [
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
