// research/parts-forms-1102: the mock data, in the shapes of Almanac (deliveries, retries) and Kitchen (meals). Every name is mock.

/** Almanac's deliveries of the last day: [event, status, calendar, sent]. */
export const DELIVERIES = [
    ['Dentist, Thursday', 'Failed', 'Huishouden', '02/11/2026 08:41'],
    ['Swimming lesson', 'Delivered', 'Sport', '02/11/2026 08:30'],
    ['Parents evening', 'Retrying', 'School', '02/11/2026 08:12'],
    ['Bin day: paper', 'Delivered', 'Huishouden', '02/11/2026 07:55'],
    ['Team stand-up', 'Delivered', 'Werk', '02/11/2026 07:40'],
    ['Football training', 'Retrying', 'Sport', '02/11/2026 07:02'],
    ['School trip money', 'Failed', 'School', '02/11/2026 06:48'],
    ['Car service', 'Delivered', 'Huishouden', '01/11/2026 22:10'],
    ['Quarterly review', 'Delivered', 'Werk', '01/11/2026 19:31'],
    ['Library books due', 'Retrying', 'Huishouden', '01/11/2026 17:05'],
    ['Piano recital', 'Delivered', 'School', '01/11/2026 15:20'],
    ['Gym, leg day', 'Delivered', 'Sport', '01/11/2026 12:00'],
];

/** Two more failures the Rows control adds. */
export const MORE_FAILURES = [
    ['Haircut', 'Failed', 'Huishouden', '02/11/2026 08:50'],
    ['Dinner with Ann', 'Failed', 'Werk', '02/11/2026 08:52'],
];

/** Kitchen's meals of today: [key (an id, as the app keys them), dish, meal, portions]. */
export const MEALS = [
    ['3f1c9a20-5b7e-4d0a-9e61-0c2d8a7b4e11', 'Overnight oats', 'Breakfast', 1],
    ['96890c91-2a4f-41b8-b3c5-7de0f1a29c34', 'Pasta pesto', 'Dinner', 2],
    ['b7d2e4f0-8c1a-4e95-a6b3-51f9c0d7e822', 'Apple', 'Snack', 1],
];

/** One failed delivery's next tries (ms from 02/11/2026 09:00 Brussels) with their notes. */
const BASE = Date.parse('2026-11-02T09:00:00+01:00');
export const TRIES = [
    { at: BASE + 15 * 60e3, note: '2 tries left' },
    { at: BASE + 75 * 60e3, note: '1 try left' },
    { at: BASE + 4 * 3600e3, note: 'Last try' },
];

/** The timeline's lanes, one per calendar, with the tries left of the delivery that failed last. */
export const LANES = [
    { id: 'huishouden', label: 'Huishouden', tries: 2 },
    { id: 'school', label: 'School', tries: 1 },
    { id: 'sport', label: 'Sport', tries: 0 },
    { id: 'werk', label: 'Werk' },
];

/** The runs of the last six hours, relative to now (minutes ago): [lane, label, from, to, state]. */
export const RUNS = [
    ['huishouden', 'Dentist', 300, 296, 'ok'],
    ['huishouden', 'Bin day', 180, 176, 'failed'],
    ['huishouden', 'Car service', 60, 55, 'failed'],
    ['school', 'Parents evening', 240, 234, 'ok'],
    ['school', 'Trip money', 90, 86, 'failed'],
    ['sport', 'Swimming', 200, 195, 'failed'],
    ['sport', 'Football', 40, 36, 'failed'],
    ['werk', 'Stand-up', 150, 146, 'ok'],
    ['werk', 'Review', 30, 26, 'ok'],
];
