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
            { href: 'catalogue/media.html', label: 'Media, grid, marquee', component: true },
            { href: 'catalogue/page.html', label: 'Footer, palette, theme menu', component: true },
            { href: 'catalogue/page-effects.html', label: 'Page effects', component: true },
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
        pages: [],
    },
    {
        // Every demo here has its decision taken. A new research demo goes in
        // a 'Research to look at' group of its own, above this one, and moves
        // down here once Kenny has decided on it [scope-81].
        group: 'Archived research',
        pages: [
            // Decided at scope-124: the three research demos of 2026-09-17.
            { href: 'research/jellyfin/demo.html', label: 'Jellyfin: the web client in two themes' },
            { href: 'research/jellyfin-dark/demo.html', label: 'Jellyfin in dark, the paste for 10.11.11' },
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
