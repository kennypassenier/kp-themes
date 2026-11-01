// research/habits-1101: the Habits app's data as its pages have it, in the shapes buildTaskRow takes (web/js/ui/task-row.js's facts:
// project, deadline, planned, time against estimate, subtasks, repeat, tags). The titles, projects and tags are mock.

/** The app's projects with their categorical colour (src/rules/grouping.rs PALETTE: blue 8, green 5, amber 3, teal 6, slate 12). */
const PROJECT = {
    work: { kind: 'project', text: 'Work', cat: 8 },
    home: { kind: 'project', text: 'Home', cat: 5 },
    admin: { kind: 'project', text: 'Admin', cat: 3 },
    health: { kind: 'project', text: 'Health', cat: 6 },
    inbox: { kind: 'project', text: 'Inbox', cat: 12 },
};
/** A tag as the app prints it, `#name`, in its colour. @param {string} name @param {number} cat */
const tag = (name, cat) => ({ kind: 'tag', text: `#${name}`, cat });
const repeat = { text: '↻', label: 'Repeating task' };

/** @typedef {import('../../js/task-row.js').TaskRowSpec & { running?: boolean, planned?: boolean }} Task */

/** @type {Record<string, Task[]>} The Planner's three days, by date. */
export const PLANNER = {
    '2026-11-02': [
        { key: 'p1', title: 'Call the plumber about the leak', priority: 'medium', facts: [PROJECT.home, { kind: 'badge', text: 'Due today', tone: 'warning' }, '◷ 0m / 30m'], planned: true },
        { key: 'p2', title: 'Review Jasper’s pull request', facts: [PROJECT.work, tag('review', 9)], planned: true },
        { key: 'p3', title: 'Water the plants', facts: [PROJECT.home, repeat], planned: true },
    ],
    '2026-11-03': [
        { key: 'p4', title: 'Write the quarterly report', priority: 'high', facts: [PROJECT.work, { kind: 'badge', text: 'Due Thursday' }, '◷ 1h 20m / 3h', '☑ 2/5', tag('writing', 10)], planned: true },
        { key: 'p5', title: 'Renew the passport', facts: [PROJECT.admin, 'Planned Tue'], planned: true },
    ],
    '2026-11-04': [
        { key: 'p6', title: 'Book the dentist', facts: [PROJECT.health, tag('calls', 2)], planned: true },
        { key: 'p7', title: 'Plan the team offsite', facts: [PROJECT.work, '☑ 1/4'], planned: true },
    ],
};

/** The Boards page's lanes (a tag each) and their cards. */
export const BOARD = [
    { key: 'todo', label: 'To do', tone: 1, cards: [
        { key: 'b1', title: 'Draft the newsletter', facts: [PROJECT.work, tag('writing', 10)] },
        { key: 'b2', title: 'Compare energy contracts', facts: [PROJECT.admin, { kind: 'badge', text: 'Due Friday' }] },
        { key: 'b3', title: 'Fix the garden gate', facts: [PROJECT.home] },
    ] },
    { key: 'doing', label: 'Doing', tone: 2, limit: 3, cards: [
        { key: 'b4', title: 'Write the quarterly report', priority: 'high', facts: [PROJECT.work, '◷ 1h 20m / 3h', '☑ 2/5'] },
        { key: 'b5', title: 'Sort the tax papers', facts: [PROJECT.admin, '☑ 4/9'] },
        { key: 'b6', title: 'Plan the team offsite', facts: [PROJECT.work] },
    ] },
    { key: 'waiting', label: 'Waiting', tone: 3, cards: [
        { key: 'b7', title: 'Hear back from the landlord', facts: [PROJECT.home, tag('waiting', 12)] },
    ] },
];

/** The Today page. */
export const TODAY = [
    { key: 'c1', title: 'Call the plumber about the leak', priority: 'medium', facts: [PROJECT.home, { kind: 'badge', text: 'Due today', tone: 'warning' }], planned: true },
    { key: 'c2', title: 'Review Jasper’s pull request', facts: [PROJECT.work, tag('review', 9)], planned: true },
    { key: 'c3', title: 'Book the dentist', facts: [PROJECT.health, tag('calls', 2)], planned: true },
    { key: 'c4', title: 'Water the plants', facts: [PROJECT.home, repeat], planned: true },
];

/** The Inbox, with every kind of fact the app shows; one done, one with its timer running. */
export const INBOX = [
    { key: 'i1', title: 'Write the quarterly report for the board meeting on Thursday', priority: 'high', facts: [PROJECT.work, { kind: 'badge', text: 'Overdue · yesterday', tone: 'destructive' }, '◷ 1h 20m / 3h', '☑ 2/5', tag('writing', 10)], running: true },
    { key: 'i2', title: 'Renew the passport', priority: 'medium', facts: [PROJECT.admin, { kind: 'badge', text: 'Due in 3 days' }, 'Planned Tue'], planned: true },
    { key: 'i3', title: 'Buy oat milk', facts: [PROJECT.inbox, tag('errands', 4)] },
    { key: 'i4', title: 'Water the plants', facts: [PROJECT.home, repeat, { text: '▦', label: 'Shown in your calendar' }] },
    { key: 'i5', title: 'Send the invoice to Acme', done: true, facts: [PROJECT.work, '◷ 15m'] },
];

/** The app's twelve colour names in kp's order, with a project and a tag that might carry each. */
export const CATS = [
    ['red', 'Urgent fixes', 'bugs'],
    ['orange', 'Garden', 'outside'],
    ['amber', 'Admin', 'paperwork'],
    ['lime', 'Fitness', 'run'],
    ['green', 'Home', 'house'],
    ['teal', 'Health', 'doctor'],
    ['cyan', 'Travel', 'trips'],
    ['blue', 'Work', 'meetings'],
    ['indigo', 'Reading', 'books'],
    ['violet', 'Writing', 'drafts'],
    ['pink', 'Family', 'birthdays'],
    ['slate', 'Someday', 'maybe'],
];

/** The notes of "Plan the team offsite", in Markdown. */
export const NOTES = `## Goal
Two days away with the whole team to **agree the plan for next year**.

## Still open
- [x] Pick the dates
- [ ] Book the venue
- [ ] Send the agenda
- [ ] Ask _Mia_ about the budget

See [the venue shortlist](#venues) before Friday.`;

/**
 * The app's ⋯ menu of a task (web/js/ui/task-row.js menuItems).
 * @param {Task} task
 * @returns {import('../../js/menu-button.js').MenuGroup[]}
 */
export const menuOf = (task) => [
    {
        group: 'Plan for',
        items: [
            { label: 'Today', value: 'today' },
            { label: 'Tomorrow', value: 'tomorrow' },
            { label: 'Next week', value: 'week' },
            { label: 'Unplan', value: 'unplan', disabled: task.planned ? null : 'Not planned' },
        ],
    },
    {
        group: '',
        items: [
            { label: 'Focus on this', value: 'focus' },
            { label: 'Duplicate', value: 'duplicate' },
            { label: 'Delete', value: 'delete', danger: true },
        ],
    },
];
