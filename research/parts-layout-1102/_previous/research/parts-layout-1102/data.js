// research/parts-layout-1102: the data the page fills its components with, from the apps' own shapes: Almanac's deliveries per
// day, Medicine Cabinet's Stock menu, Kitchen's main courses and side dishes. Every day, count and dish is mock.

const two = (/** @type {number} */ n) => String(n).padStart(2, '0');

/** Days with a warning: how many of the day's deliveries arrived, and which did not. */
const LATE = {
    '2026-10-07': ['8/9', 'the school calendar arrived 40 min late'],
    '2026-10-19': ['7/9', 'two club fixtures did not arrive'],
    '2026-10-28': ['8/9', 'the bin collection feed did not answer'],
};

/**
 * Almanac's deliveries per day in October 2026: all nine arrived, or a warning.
 * @returns {Record<string, { tone: 'ok' | 'warn', count: string, label: string }>}
 */
export function deliveryDays() {
    /** @type {Record<string, { tone: 'ok' | 'warn', count: string, label: string }>} */
    const days = {};
    const LAST_OCTOBER_DAY = 31;
    for (let d = 1; d <= LAST_OCTOBER_DAY; d += 1) {
        const iso = `2026-10-${two(d)}`;
        const late = /** @type {Record<string, string[]>} */ (LATE)[iso];
        days[iso] = late ? { tone: 'warn', count: late[0], label: `${late[0]} delivered; ${late[1]}` } : { tone: 'ok', count: '9/9', label: 'all 9 delivered' };
    }
    return days;
}

/** Medicine Cabinet's Stock menu: what a bar link opens, rich entries with their hints. */
export const STOCK_MENU = [
    {
        group: 'Stock',
        items: [
            { label: 'Add stock', value: 'add', hint: 'Boxes you bought today' },
            { label: 'Expiring soon', value: 'expiring', hint: '2 medicines expire within 30 days', href: '#cabinet-expiring' },
            { label: 'Low stock', value: 'low', hint: '1 medicine has less than a week left', href: '#cabinet-low' },
        ],
    },
    {
        group: 'Lists',
        items: [
            { label: 'Shopping list', value: 'shopping', hint: 'What to buy at the pharmacy', href: '#cabinet-shopping' },
            { label: 'Print the cabinet', value: 'print', hint: 'One page with every medicine and its dose' },
        ],
    },
];

/** Kitchen's main courses: the longer not eaten, the heavier. */
export const MAINS = [
    { id: 'curry', label: 'Chicken curry', weight: 3, tag: '35 min' },
    { id: 'lasagne', label: 'Lasagne', weight: 2, tag: 'Oven, 45 min' },
    { id: 'volauvent', label: 'Vol-au-vent', weight: 2, tag: '40 min' },
    { id: 'fish', label: 'Fish with leek', weight: 1, tag: '25 min' },
    { id: 'stoemp', label: 'Stoemp with sausages', short: 'Stoemp', weight: 2, tag: '30 min' },
    { id: 'bolognese', label: 'Spaghetti bolognese', short: 'Spaghetti', weight: 1, tag: '30 min' },
];

/** Kitchen's side dishes. */
export const SIDES = [
    { id: 'rice', label: 'Rice', weight: 2 },
    { id: 'fries', label: 'Fries', weight: 2 },
    { id: 'salad', label: 'Green salad', weight: 1 },
    { id: 'mash', label: 'Mashed potatoes', short: 'Mash', weight: 1 },
    { id: 'bread', label: 'Bread', weight: 1 },
];
