// research/parts-habits-1102: the Habits app's data as its pages have it. Today's timeline (web/js/features/today/timeline.js:
// tasks with a planned time and an estimate, calendar events read-only, the all-day events in a strip), Today's list with the
// app's swipe actions and ⋯ menu, the overdue banner's chord, and the twelve colour names of a project. Titles, times and events
// are mock.

/** The day the page stands on: Monday 2 November 2026, the clock frozen at 10:40 (the demo never reads the real clock). */
export const NOW = '10:40';

/** Today's timed tasks and the calendar's timed events, in the shape setDaylineItems takes. */
export const DAY = [
    { id: 't1', label: 'Morning pages', start: '07:00', minutes: 30, done: true },
    { id: 't2', label: 'Write the quarterly report', start: '09:00', minutes: 90, tone: 'warning' },
    { id: 'e1', label: 'Dentist (Dr. Peeters)', start: '10:00', minutes: 45, readonly: true, tone: 'muted' },
    { id: 't3', label: 'Call the plumber about the leak', start: '11:15', minutes: 15 },
    { id: 'e2', label: 'Lunch with Sara', start: '12:30', minutes: 60, readonly: true, tone: 'muted' },
    { id: 't4', label: 'Review Jasper’s pull request', start: '14:00', minutes: 60, tone: 8 },
    { id: 't5', label: 'Run, 8 km', start: '18:00', minutes: 50, tone: 4 },
];

/** The calendar's all-day events of the day. */
export const ALL_DAY = [
    { id: 'e3', label: 'Mum’s birthday', readonly: true },
    { id: 'e4', label: 'Bin day: paper', readonly: true },
];

/** Today's tasks without a time, beside the day: each can be dropped onto an hour. */
export const UNTIMED = [
    { key: 'u1', title: 'Pay the energy bill', facts: [{ kind: 'project', text: 'Admin', cat: 3 }, { kind: 'badge', text: 'Due today', tone: 'warning' }] },
    { key: 'u2', title: 'Book the train to Ghent', facts: [{ kind: 'project', text: 'Travel', cat: 7 }] },
    { key: 'u3', title: 'Water the plants', facts: [{ kind: 'project', text: 'Home', cat: 5 }, '↻'] },
];

/** Today's list as the app draws it. */
export const TODAY = [
    { key: 'c1', title: 'Call the plumber about the leak', priority: 'medium', facts: [{ kind: 'project', text: 'Home', cat: 5 }, { kind: 'badge', text: 'Due today', tone: 'warning' }] },
    { key: 'c2', title: 'Review Jasper’s pull request', facts: [{ kind: 'project', text: 'Work', cat: 8 }, { kind: 'tag', text: '#review', cat: 9 }] },
    { key: 'c3', title: 'Book the dentist', facts: [{ kind: 'project', text: 'Health', cat: 6 }, { kind: 'tag', text: '#calls', cat: 2 }] },
    { key: 'c4', title: 'Water the plants', facts: [{ kind: 'project', text: 'Home', cat: 5 }, '↻'] },
];

/** The Inbox, for the settled rows: one row has already left (deleted while the page was open). */
export const INBOX = [
    { key: 'i1', title: 'Renew the passport', priority: 'medium', facts: [{ kind: 'project', text: 'Admin', cat: 3 }, { kind: 'badge', text: 'Due in 3 days' }] },
    { key: 'i2', title: 'Buy oat milk', facts: [{ kind: 'project', text: 'Inbox', cat: 12 }, { kind: 'tag', text: '#errands', cat: 4 }], settled: 'Deleted' },
    { key: 'i3', title: 'Send the invoice to Acme', facts: [{ kind: 'project', text: 'Work', cat: 8 }] },
    { key: 'i4', title: 'Fix the garden gate', facts: [{ kind: 'project', text: 'Home', cat: 5 }] },
    { key: 'i5', title: 'Read “The Overstory”', facts: [{ kind: 'project', text: 'Reading', cat: 9 }, { kind: 'tag', text: '#books', cat: 9 }] },
];

/** The app's twelve colour names in kp's order (src/rules/grouping.rs PALETTE). */
export const COLOURS = ['Red', 'Orange', 'Amber', 'Lime', 'Green', 'Teal', 'Cyan', 'Blue', 'Indigo', 'Violet', 'Pink', 'Slate'].map((label, i) => ({
    value: label.toLowerCase(),
    label,
    colour: i + 1,
}));

/** The ⋯ menu of a task on Today, with the swipe's two actions first (a swipe is a shortcut, never the only way). */
export const TODAY_MENU = [
    { group: 'Swipe actions', items: [{ label: 'Done', value: 'done' }, { label: 'Tomorrow', value: 'tomorrow' }] },
    { group: '', items: [{ label: 'Delete', value: 'delete', danger: true }] },
];

/** The ⋯ menu of an Inbox task, whose picks settle the row. */
export const INBOX_MENU = [
    { group: 'Move to', items: [{ label: 'Work', value: 'move:Work' }, { label: 'Home', value: 'move:Home' }] },
    { group: '', items: [{ label: 'Delete', value: 'delete', danger: true }] },
];
