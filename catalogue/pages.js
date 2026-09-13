// Every review page, in the order the navigation shows them. Its own module
// so the review page can read the list without mounting the shell twice.
// gates/check-catalogue.mjs refuses a catalogue page or a research demo that
// is missing here, and an entry here with no page behind it.

/** @typedef {{ href: string, label: string, component?: boolean }} Page */

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
            { href: 'catalogue/overlays.html', label: 'Dialogs, popovers, menus, tooltips', component: true },
            { href: 'catalogue/navigation.html', label: 'Navigation', component: true },
            { href: 'catalogue/structure.html', label: 'Accordion, tree, timeline, split, reorder, wizard', component: true },
            { href: 'catalogue/data.html', label: 'Showing data', component: true },
            { href: 'catalogue/media.html', label: 'Media, grid, marquee', component: true },
            { href: 'catalogue/page.html', label: 'Footer, palette, theme menu', component: true },
        ],
    },
    {
        group: 'Research demos',
        pages: [
            { href: 'research/navbar/demo.html', label: 'Navigation alternatives' },
            { href: 'research/futuristic/demo.html', label: 'Futuristic layouts' },
            { href: 'research/loading/demo.html', label: 'Loading per theme' },
            { href: 'research/datatable/demo.html', label: 'Data tables' },
            { href: 'research/grotesk-hover/demo.html', label: 'Grotesk hover options' },
        ],
    },
];

/** The component pages, in order: what the review and compare pages gather. */
export const COMPONENT_PAGES = PAGES.flatMap((group) => group.pages).filter((page) => page.component);
