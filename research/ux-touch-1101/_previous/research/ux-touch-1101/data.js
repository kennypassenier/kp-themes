// research/ux-touch-1101: the Habits app's Boards page as its data has it (research/habits-1101/data.js shapes: project, deadline,
// time against estimate, subtasks, tags), four lanes as Kenny's example reads: Inbox 4 · Doing 2 / 2 · Waiting 1 · Done 7.
// The titles, projects and tags are mock.

/** The app's projects with their categorical colour. */
const PROJECT = {
    work: { kind: 'project', text: 'Work', cat: 8 },
    home: { kind: 'project', text: 'Home', cat: 5 },
    admin: { kind: 'project', text: 'Admin', cat: 3 },
    health: { kind: 'project', text: 'Health', cat: 6 },
};
/** A tag as the app prints it, `#name`, in its colour. @param {string} name @param {number} cat */
const tag = (name, cat) => ({ kind: 'tag', text: `#${name}`, cat });

/** @typedef {import('../../js/task-row.js').TaskRowSpec} Task */
/** @typedef {{ key: string, label: string, tone: number, limit?: number, cards: Task[] }} Lane */

/** @type {Lane[]} */
export const BOARD = [
    { key: 'inbox', label: 'Inbox', tone: 1, cards: [
        { key: 'b1', title: 'Draft the newsletter', facts: [PROJECT.work, tag('writing', 10)] },
        { key: 'b2', title: 'Compare energy contracts', facts: [PROJECT.admin, { kind: 'badge', text: 'Due Friday' }] },
        { key: 'b3', title: 'Fix the garden gate', facts: [PROJECT.home] },
        { key: 'b4', title: 'Book the dentist', facts: [PROJECT.health, tag('calls', 2)] },
    ] },
    { key: 'doing', label: 'Doing', tone: 2, limit: 2, cards: [
        { key: 'b5', title: 'Write the quarterly report', priority: 'high', facts: [PROJECT.work, '◷ 1h 20m / 3h', '☑ 2/5'] },
        { key: 'b6', title: 'Sort the tax papers', facts: [PROJECT.admin, '☑ 4/9'] },
    ] },
    { key: 'waiting', label: 'Waiting', tone: 3, cards: [
        { key: 'b7', title: 'Hear back from the landlord', facts: [PROJECT.home, tag('waiting', 12)] },
    ] },
    { key: 'done', label: 'Done', tone: 4, cards: [
        { key: 'b8', title: 'Renew the passport', done: true, facts: [PROJECT.admin] },
        { key: 'b9', title: 'Water the plants', done: true, facts: [PROJECT.home] },
        { key: 'b10', title: 'Send the invoice to Acme', done: true, facts: [PROJECT.work, '◷ 15m'] },
        { key: 'b11', title: 'Review Jasper’s pull request', done: true, facts: [PROJECT.work, tag('review', 9)] },
        { key: 'b12', title: 'Buy oat milk', done: true, facts: [PROJECT.home] },
        { key: 'b13', title: 'Call the plumber about the leak', done: true, facts: [PROJECT.home] },
        { key: 'b14', title: 'Plan the team offsite', done: true, facts: [PROJECT.work, '☑ 4/4'] },
    ] },
];

/** A card's own ⋯ menu, the app's entries; the board puts "Move to" in front of them. @param {Task} task */
export const menuOf = (task) => [
    {
        group: 'Plan for',
        items: [
            { label: 'Today', value: 'today' },
            { label: 'Tomorrow', value: 'tomorrow' },
        ],
    },
    {
        group: '',
        items: [
            { label: task.done ? 'Reopen' : 'Focus on this', value: task.done ? 'reopen' : 'focus' },
            { label: 'Delete', value: 'delete', danger: true },
        ],
    },
];
