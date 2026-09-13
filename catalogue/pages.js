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
        ],
    },
    {
        group: 'Research demos',
        pages: [
            { href: 'research/navbar/demo.html', label: 'Navigation alternatives' },
            { href: 'research/futuristic/demo.html', label: 'Futuristic layouts' },
            { href: 'research/loading/demo.html', label: 'Loading per theme' },
        ],
    },
];

/** The component pages, in order: what the review and compare pages gather. */
export const COMPONENT_PAGES = PAGES.flatMap((group) => group.pages).filter((page) => page.component);
