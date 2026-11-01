// research/ux-parts-1101: the seven sections of the review page, each written once: what is asked, the heading and one sentence,
// what to expect, what to look at, the default it asks (where the part is an option), the controls and the component.

import { almanacStatus, cabinet, chipToolbar, deadLetters, group, log, pair, stockTable, topicsHeader, wheelFilters, width } from './markup.mjs';

/** The one question an option section asks: which look is the default. @param {string} id @param {string} label @param {string} now @param {string} next */
const defaultOf = (id, label, now, next) => [{ id, label, default: 'now', options: [{ value: 'now', label: now }, { value: 'new', label: next }] }];

export const SECTIONS = [
    {
        id: 'chips-narrow',
        title: 'Filter chips: whole tracks, and a menu when narrow',
        topic: 'segmented',
        topicTitle: 'Filter chips',
        item: 'chips-narrow, Medicine Cabinet',
        asked: 'Medicine Cabinet&rsquo;s chips wrapped raggedly (one chip alone on a second line) and, on a phone, scrolled sideways with &ldquo;Switched off&rdquo; cut. <code>data-kp-segmented-fit="tracks"</code> lays the chips on equal tracks, the rows balanced, and under <code>data-kp-segmented-fold-at</code> (30rem) folds them into the package&rsquo;s menu button. You choose the default; the other stays an option.',
        h2: 'What the Overview shows',
        intro: 'The cabinet&rsquo;s six filters beside its search, with their exact counts.',
        expected: [
            '<b>Now</b>: the chips flow; at full width the last chips wrap under the first with a ragged edge. <b>New</b>: every chip is as wide as &ldquo;Switched off 4&rdquo;; the rows hold 3 + 3, never 5 + 1.',
            '<b>Phone</b>: <b>Now</b> wraps into three ragged rows; <b>New</b> becomes one button, &ldquo;Show: All ▾&rdquo;. Open it: the six filters with their counts, the chosen one ticked; a pick closes it, says &ldquo;Show: Due today&rdquo; and the line under the frames names the value.',
        ],
        look: 'Formal: the chips are the approved pills; the menu is the package&rsquo;s plate. Check that the tracks line up from row to row and that nothing is cut.',
        choices: defaultOf('fit', 'The default look of a chip group', 'Flow (now)', 'Whole tracks, a menu when narrow'),
        controls: width('chips-narrow-component'),
        component: `${pair(chipToolbar('pg-chips-now', ''), chipToolbar('pg-chips-new', ' data-kp-segmented-fit="tracks"'))}
        ${log('pg-chips-log')}`,
    },
    {
        id: 'tri-state-chip',
        title: 'Three-way chips: the state as a word',
        topic: 'segmented',
        topicTitle: 'Filter chips',
        item: 'tri-state-chip, Kitchen',
        asked: 'Kitchen&rsquo;s wheel filters are three-way chips: once = want, twice = not, thrice = either; the review found the state hard to read from the ring. <code>data-kp-segmented-tri-look="word"</code> writes the state after the label (&ldquo;either&rdquo;, &ldquo;want&rdquo;, &ldquo;not&rdquo;). New in every three-way group: <kbd>+</kbd> wants the focused chip, <kbd>-</kbd> leaves it out, <kbd>Delete</kbd> lets go; the event carries the state.',
        h2: 'Filters: want, not, or either way',
        intro: 'The wheel&rsquo;s meal, time and ingredient filters; Chicken is wanted and Mushrooms left out.',
        expected: [
            '<b>New</b>: each chip ends in a small word: &ldquo;EITHER&rdquo; (dashed, muted), &ldquo;WANT&rdquo; on the filled chip, &ldquo;NOT&rdquo; on red with the label struck through. A press walks either &rarr; want &rarr; not &rarr; either; the chip keeps its width; the line under each row says what is chosen; the line under the filters names the event&rsquo;s state.',
            '<b>Now</b>: the same chips with the approved ring, check and cross. <b>Phone</b>: the chips wrap; nothing is cut.',
        ],
        look: 'Formal: the word is a small capital tag on the approved chip. Check that the three states read at a glance and that no chip changes width on a press.',
        choices: defaultOf('look', 'The default look of a three-way chip', 'The ring mark (now)', 'The word'),
        controls: width('tri-state-chip-component'),
        component: `${pair(wheelFilters.replaceAll('id="pg-wheel', 'id="pg-wheel-now').replaceAll('aria-labelledby="pg-wheel', 'aria-labelledby="pg-wheel-now').replaceAll(' data-kp-segmented-tri-look="word"', ''), wheelFilters)}
        ${log('pg-wheel-log')}`,
    },
    {
        id: 'popover-form',
        title: 'Popover form: Add stock without a dialog',
        topic: 'popover-form',
        topicTitle: 'Popover form',
        item: 'popover-form, Medicine Cabinet',
        asked: 'Medicine Cabinet&rsquo;s &ldquo;Add stock&rdquo; opened a modal holding one number. <code>data-kp-popover-form</code> hangs a small form under its button, on the menu&rsquo;s plate: one field and Add, Enter accepts, Escape or a press outside closes it, and the page&rsquo;s save can refuse with its own words.',
        h2: 'The cabinet',
        intro: 'Three medicines and their stock; &ldquo;Open the first form&rdquo; shows Ibuprofen&rsquo;s form open.',
        expected: [
            'The form hangs under &ldquo;Add stock&rdquo; with &ldquo;Boxes to add&rdquo;, the box size, the number selected and Add. Type 3 and Enter: the form closes, the focus is back on the button, the stock reads &ldquo;5 boxes&rdquo; and the line names the event. 30 says why it is refused (20 at most) and stays open.',
            '<b>Save fails</b>: Add waits, then &ldquo;The cabinet did not answer; nothing was added.&rdquo; under the row, the form still open with your number. <b>Phone</b>: the form stays on the screen under its button.',
        ],
        look: 'Formal: the form is the menu&rsquo;s paper plate with the package&rsquo;s field and primary button. Check the field and Add on one line and that the problem line does not push the form around.',
        controls: group('The save', 'save', [['ok', 'Saves', true], ['fail', 'Fails']], 'pg-cabinet') + group('Open', 'open', [['first', 'Open the first form']], 'pg-cabinet') + width('popover-form-component'),
        component: `${cabinet}
        ${log('pg-cabinet-log')}`,
    },
    {
        id: 'empty-ghost-lines',
        title: 'Empty plate: without the ruled lines',
        topic: 'empty',
        topicTitle: 'The empty plate',
        item: 'empty-ghost-lines, kyu',
        asked: 'kyu read formal&rsquo;s three ruled lines under every empty message as a skeleton still loading. <code>data-kp-empty-lines="off"</code> on the plate or any element round it (the page&rsquo;s html for all) leaves them out. You choose the default.',
        h2: 'Dead letters',
        intro: 'kyu&rsquo;s dead-letter table on a good day: nothing failed.',
        expected: [
            '<b>Now</b>: &ldquo;No dead letters&rdquo; centred on the plate, three grey ruled lines at its foot. <b>New</b>: the same plate and words, no lines; the double rule along the top stays.',
            'Both plates fill the same footprint. <b>Phone</b>: the words wrap, still centred.',
        ],
        look: 'Formal: the ruled paper plate. Check that the plate without lines still reads as formal and as finished, not as loading.',
        choices: defaultOf('lines', 'The default empty plate', 'With the ruled lines (now)', 'Without them'),
        controls: width('empty-ghost-lines-component'),
        component: pair(deadLetters('pg-dead-now'), `<div data-kp-empty-lines="off">${deadLetters('pg-dead-new')}</div>`),
    },
    {
        id: 'auto-refresh-form',
        title: 'Auto-refresh: one control, no second freshness line',
        topic: 'refresh',
        topicTitle: 'Auto-refresh',
        item: 'auto-refresh-form, kyu',
        asked: 'kyu&rsquo;s refresh bar printed &ldquo;not updated yet&rdquo; beside the header&rsquo;s own &ldquo;Updated 2 min ago&rdquo;. <code>data-kp-refresh-line="off"</code> leaves the bar&rsquo;s line out, and with the menu look the control is one button and Refresh now. You choose the default.',
        h2: 'Topics',
        intro: 'kyu&rsquo;s Topics header with its refresh control.',
        expected: [
            '<b>Now</b>: the segmented bar, &ldquo;not updated yet&rdquo; and Refresh now at the far end, under a header that already says &ldquo;Updated 2 min ago&rdquo;. <b>New</b>: &ldquo;Every 30 s ▾&rdquo; with Refresh now beside it; one freshness line on the page, the header&rsquo;s.',
            'Open the menu: the choices with the current one ticked. <b>Phone</b>: both fit; nothing scrolls sideways.',
        ],
        look: 'Formal: the package&rsquo;s menu button and small button. Check that the page says how fresh it is once.',
        choices: defaultOf('form', 'The default refresh control', 'Segments and its own line (now)', 'Menu, no own line'),
        controls: width('auto-refresh-form-component'),
        component: pair(topicsHeader('pg-refresh-now', ''), topicsHeader('pg-refresh-new', ' data-kp-look="menu" data-kp-refresh-line="off"')),
    },
    {
        id: 'date-nav',
        title: 'Date navigation: one part for the month and the week',
        topic: 'date-nav',
        topicTitle: 'Date navigation',
        item: 'date-nav, Almanac',
        asked: 'Almanac&rsquo;s Status had a month navigation (Prev / Next / Today in three widths) and a week navigation (&lsaquo; Today &rsaquo;) in two styles. <code>data-kp-date-nav</code> (month, week, day) is one part: the range shown, then Previous, Today and Next on three equal tracks; it drives the calendar and the week through <code>data-kp-date-nav-for</code>.',
        h2: 'Status',
        intro: 'The month&rsquo;s deliveries and the week&rsquo;s syncs; today is Sunday 01/11/2026. The days and runs are mock.',
        expected: [
            'Both navigations read the same way: &ldquo;November 2026 current&rdquo; and &ldquo;Week 44 · 26/10 to 01/11/2026 current&rdquo;, then three buttons of one width. Next moves the calendar to December (the line names the event), Previous moves the week to week 43; Today comes back. In a navigation, PageUp and PageDown step and Home goes to today.',
            '<b>Loading</b>, <b>Empty</b> and <b>Failed</b> are the calendar&rsquo;s and the week&rsquo;s own states; the navigations stay. <b>Phone</b>: the buttons go under the label, same widths.',
        ],
        look: 'Formal: the package&rsquo;s small buttons under a plain label. Check the three buttons share one width in both, and that nothing moves when the label grows.',
        controls: group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], 'date-nav-component') + width('date-nav-component'),
        component: `${almanacStatus}
        ${log('pg-dates-log')}`,
    },
    {
        id: 'row-undo-delete',
        title: 'Delete with Undo: a row action for tables and lists',
        topic: 'undo',
        topicTitle: 'Undo',
        item: 'row-undo-delete, Medicine Cabinet',
        asked: 'The Undo toast is the right answer to a delete that can be taken back, yet apps reached for a confirm. <code>data-kp-row-delete</code> on a row&rsquo;s button deletes the row with the toast: the row goes at once, Undo brings it back, and the page hears <code>kp-row-delete-commit</code> when the window closes.',
        h2: 'Medicines in the cabinet',
        intro: 'Five medicines, each with Delete.',
        expected: [
            'Delete on Ibuprofen: its row goes at once, the table counts four, the focus is on Paracetamol&rsquo;s Delete, and the toast says &ldquo;Ibuprofen 400 mg deleted&rdquo; with its clock. Undo: the row is back where it stood with the focus on its Delete; the line names <code>kp-row-delete-undo</code>. Leave it: after the window the line names <code>kp-row-delete-commit</code>.',
            '<b>Save fails</b>: after the window the row comes back and the toast says it was not done. <b>Phone</b>: the table turns to cards; Delete stays in each.',
        ],
        look: 'Formal: the package&rsquo;s table, button and Undo toast. Check that nothing else in the table moves when a row goes and comes back.',
        controls: group('The delete', 'commit', [['ok', 'Saves', true], ['fail', 'Fails']], 'pg-stock') + group('Rows', 'rows', [['reset', 'All five again']], 'pg-stock') + width('row-undo-delete-component'),
        component: `${stockTable}
        ${log('pg-stock-log')}`,
    },
];
