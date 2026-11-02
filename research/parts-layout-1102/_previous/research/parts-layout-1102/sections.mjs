// research/parts-layout-1102: the eight sections of the review page, each written once: what is asked, the heading and one
// sentence, what to expect, what to look at, the controls and the component. Kenny approved every part and option on 2026-11-02
// 00:41 (opt-in, default off), so no section asks for a default.

import { group, log, option, width } from './helpers.mjs';
import { calendarsTable, deliveriesMonth, medicinesHeader, settingsWithBand } from './markup-layout.mjs';
import { cabinetBar, inbox, kitchenBar, kitchenWheels, overviewCards } from './markup-parts.mjs';

const LAYOUT = { topic: 'layout-wishes', topicTitle: 'Layout options' };

export const SECTIONS = [
    {
        id: 'cards-tracks',
        ...LAYOUT,
        title: 'Table cards on a phone: label and value on two tracks',
        item: 'layout-wishes, Almanac 21',
        asked: 'Almanac wrote page CSS to line up the label and the value in every card of a table on a phone. The track layout (<code>data-kp-cards</code>: each card two tracks, label | value, every cell a subgrid) is already the package&rsquo;s card look since datatable-r5-1019; <code>data-kp-cards="spread"</code> keeps the earlier look. Checked here on Almanac&rsquo;s Calendars, nothing new to build.',
        h2: 'Calendars',
        intro: 'The four calendars Almanac delivers from, with their last sync.',
        expected: [
            '<b>Full width</b>: a table. <b>Phone, 390 px</b>: each row is a card. <b>Tracks</b>: every value of a card starts on one edge, after the longest label (&ldquo;Last sync&rdquo;), and that edge is the same in every card. <b>Spread</b>: each value is pushed to the card&rsquo;s right edge',
            'Sync now stands on the card&rsquo;s start edge in every card. Nothing is cut and nothing scrolls sideways.',
        ],
        look: 'Formal: the package&rsquo;s table and cards. Check that the values of one card share one edge, and that every card has the same edge.',
        controls: option('cards-tracks-component', [['', 'Tracks (the default)', true], ['spread', 'Spread, the earlier look']]) + width('cards-tracks-component'),
        component: calendarsTable('pg-cards', ''),
    },
    {
        id: 'calendar-spread',
        ...LAYOUT,
        title: 'Calendar navigation on the days&rsquo; seven tracks',
        item: 'layout-wishes, Almanac 21',
        asked: 'Almanac wanted the month&rsquo;s Previous, title, Next and Today on the days&rsquo; own columns. <code>data-kp-calendar-nav="spread"</code> exists (gapform-1019); checked here on Almanac&rsquo;s deliveries month.',
        h2: 'Deliveries per day',
        intro: 'How many of Almanac&rsquo;s nine deliveries arrived each day of October 2026.',
        expected: [
            '<b>Spread</b> at full width: Previous over Monday, the month centred over Wednesday to Friday, Next over Saturday and Today over Sunday; every button edge is a day&rsquo;s edge. <b>Phone</b>: the month on a row of its own, the three buttons over two, three and two days. <b>Default</b>: the four in a run from the start edge.',
            '<b>Loading</b>, <b>Empty</b> and <b>Failed</b> are the calendar&rsquo;s own states; the navigation stays where it is.',
        ],
        look: 'Formal: the package&rsquo;s calendar. Check that the buttons line up with the day columns under them.',
        controls: option('calendar-spread-component', [['spread', 'Spread', true], ['start', 'Start (the default)']]) + group('State', 'cal', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], 'calendar-spread-component') + width('calendar-spread-component'),
        component: deliveriesMonth('pg-month', 'spread'),
    },
    {
        id: 'header-equal',
        ...LAYOUT,
        title: 'Page header on a phone: two actions on two equal tracks',
        item: 'layout-wishes, Almanac 21',
        asked: 'On a phone the header&rsquo;s two actions stood as a wide primary and a short secondary. <code>data-kp-header-actions="equal"</code> on <code>.kp-page-header</code> puts two actions on two equal tracks at phone width. New, off by default.',
        h2: 'Medicines',
        intro: 'Medicine Cabinet&rsquo;s Medicines header with Add medicine and Import a list.',
        expected: [
            '<b>Full width</b>: the actions beside the title, either way. <b>Phone</b>, <b>Equal tracks</b>: Add medicine and Import a list are one width and fill the row together; <b>Auto</b>: the two stand under each other, full width, in the 340 px of this stage',
            'The words stay whole; a long label wraps inside its button, never mid-word.',
        ],
        look: 'Formal: the package&rsquo;s header and buttons. Check at 390 px that the two buttons are exactly one width.',
        controls: option('header-equal-component', [['equal', 'Equal tracks', true], ['auto', 'Auto (the default)']]) + width('header-equal-component'),
        component: medicinesHeader('equal'),
    },
    {
        id: 'attention-formgrid',
        ...LAYOUT,
        title: 'The attention band on a form grid&rsquo;s tracks',
        item: 'layout-wishes, Almanac 21',
        asked: 'Almanac placed the attention band between its Settings rows by hand. With <code>data-kp-subgrid</code> on <code>.kp-attention</code> inside a <code>.kp-formgrid</code> the band takes the grid&rsquo;s tracks (gapform-1019): the mark in the label column, the words on the controls&rsquo; edge, the fix in the actions column. Checked here; nothing new to build.',
        h2: 'Settings',
        intro: 'Almanac&rsquo;s Google account and school feed, and the two problems between them.',
        expected: [
            '<b>On the grid&rsquo;s tracks</b>: the words of both problems start where the fields start, the marks stand in the label column, and Sign in again and Test the feed stand in the column of Sign out and Test. <b>A band of its own</b>: the band spans the grid with tracks of its own (before this round it fell into the label column and broke after every word)',
            '<b>No problems</b>: the band takes no room and the rows close up. <b>Phone</b>: the fix goes under the words, full width.',
        ],
        look: 'Formal: the package&rsquo;s band and form grid. Check that the band&rsquo;s words and buttons continue the grid&rsquo;s columns.',
        controls: option('attention-formgrid-component', [['', 'On the grid&rsquo;s tracks', true], ['off', 'A band of its own (the default)']]) + group('Problems', 'band', [['two', 'Two problems', true], ['none', 'No problems']], 'attention-formgrid-component') + width('attention-formgrid-component'),
        component: settingsWithBand('pg-settings', true),
    },
    {
        id: 'nav-more',
        topic: 'nav-more',
        topicTitle: 'Nav: the More menu',
        title: 'Links that always sit behind More, and a menu that is one of the bar&rsquo;s links',
        item: 'nav-more, Kitchen (chassis-rs 25) and Medicine Cabinet 28',
        asked: 'Kitchen built its own More item for six pages that always live there; Medicine Cabinet dressed a menu button as a bar link by hand. <code>data-kp-nav-more</code> on a list item pins it behind the folding bar&rsquo;s More whatever the width (a value names its group, <code>data-kp-nav-hint</code> its hint); a <code>.kp-menu-button</code> in <code>.kp-nav__links</code> is now a documented bar link with a rich menu.',
        h2: 'Kitchen and Medicine Cabinet',
        intro: 'Kitchen&rsquo;s bar: five daily places and More. Medicine Cabinet&rsquo;s bar: Stock opens a menu.',
        expected: [
            'Kitchen shows Today, Week, Shopping list 7, Recipes, Pantry and More, at every width where the bar is a row. More opens Wheel, Timers, Freezer stock and Saved menus, each with its hint, then &ldquo;SETTINGS&rdquo; over Household and Settings. <b>Current: Timers</b>: More reads as the current link and Timers is marked in the menu. A pick moves the current page; the line names it.',
            'Medicine Cabinet&rsquo;s Stock is a bar link with a caret; it opens the rich menu under it. <b>Phone</b>: both bars fold into their toggle; Kitchen&rsquo;s open list holds all eleven links.',
        ],
        look: 'Formal: the bar&rsquo;s links and the menu&rsquo;s plate. Check that More and Stock look like the other links and that the menus hang under them.',
        controls: group('Current page', 'page', [['today', 'Today', true], ['timers', 'Timers']], 'pg-kitchen-nav') + group('Open', 'navopen', [['more', 'Open More'], ['stock', 'Open Stock']], 'nav-more-component') + width('nav-more-component'),
        component: `<div class="pg-bars">${kitchenBar}
            ${cabinetBar}</div>
        ${log('pg-nav-log')}`,
    },
    {
        id: 'snooze-popover',
        topic: 'popover-form',
        topicTitle: 'Popover form',
        title: 'Snooze until a day and a time, in a popover form',
        item: 'snooze-popover, Homelab',
        asked: 'Homelab&rsquo;s &ldquo;Snooze &rarr; Pick a time&rdquo; was a menu and then the old dialog. The popover form now carries a date picker and a time field side by side: the calendar and the list of times open inside it, Escape closes them first, Enter snoozes.',
        h2: 'Inbox',
        intro: 'Two alerts that need you, each with &ldquo;Snooze until&hellip;&rdquo;.',
        expected: [
            'The form hangs under its button: &ldquo;Snooze until&rdquo;, Day and Time on one line, the Brussels line, Snooze under Time and as wide. Open the calendar: it lies over the form; pick 05/11 and it closes, the form stays. Escape in the calendar or the time list closes only that; a second Escape closes the form. Enter snoozes: the badge reads &ldquo;Snoozed until 05/11/2026 09:00&rdquo;.',
            '&ldquo;31/02&rdquo; or a day after 30/11 is refused on the problem line; <b>Save fails</b>: Snooze waits, then &ldquo;Homelab did not answer; the alert is not snoozed.&rdquo; <b>Phone</b>: the form stays on screen.',
        ],
        look: 'Formal: the menu&rsquo;s paper plate, the package&rsquo;s date picker and time field. Check that Day and Time start and end on one line and Snooze ends on the fields&rsquo; edge.',
        controls: group('The save', 'snoozesave', [['ok', 'Saves', true], ['fail', 'Fails']], 'pg-inbox') + group('Open', 'snoozeopen', [['nas', 'Open the first form']], 'pg-inbox') + width('snooze-popover-component'),
        component: `${inbox}
        ${log('pg-snooze-log')}`,
    },
    {
        id: 'card-empty',
        topic: 'empty',
        topicTitle: 'The empty plate',
        title: 'The one-line empty plate for a small card',
        item: 'card-empty, Homelab',
        asked: 'Homelab&rsquo;s small Overview cards drew the full empty plate (heading size, the art, the whole footprint) for &ldquo;nothing here&rdquo;. <code>data-kp-empty="compact"</code> is one line: a mark and the words, in every theme with its own mark.',
        h2: 'Overview',
        intro: 'Three small cards: open alerts, pending updates and today&rsquo;s restarts.',
        expected: [
            '<b>Compact</b>: each card says &ldquo;&check; No open alerts&rdquo; on one line, the mark in a hairline ring, the words in the body type; the three cards stay one height. <b>The full plate</b>: the same cards with the prominent plate, its ruled lines and the heading-size words',
            '<b>With items</b>: the lists replace the plates. <b>Phone</b>: the cards stack; the line wraps under its own words, the mark stays beside them.',
        ],
        look: 'Formal: the seal mark in a hairline ring and the italic words, under the card&rsquo;s own rule. Check that the line reads as finished, not as a loading or error line.',
        controls: option('card-empty-component', [['compact', 'Compact', true], ['full', 'The full plate (the default)']]) + group('Cards', 'cards', [['empty', 'Nothing in them', true], ['items', 'With items']], 'card-empty-component') + width('card-empty-component'),
        component: overviewCards('compact'),
    },
    {
        id: 'coupled-wheels',
        topic: 'wheel',
        topicTitle: 'The wheel',
        title: 'Two wheels that spin together',
        item: 'coupled-wheels, Kitchen 15',
        asked: 'Kitchen spun the side dish from the main course&rsquo;s spin event by hand. <code>data-kp-wheel-follows="&lt;id&gt;"</code> makes a wheel turn when the one it names turns, for the same time, so both settle together; each keeps its own outcome and its own events.',
        h2: 'What do we eat tonight',
        intro: 'Six main courses and five side dishes; the side dish follows the main course.',
        expected: [
            'Spin the main course: both wheels turn and stop at the same moment; each answer card shows its own pick, and the line names both <code>kp-wheel-result</code> events. Spin the side dish alone: only it turns.',
            '<b>Not coupled</b>: the side dish stands still when the main course spins. <b>Phone</b>: the wheels stack, both whole.',
        ],
        look: 'Formal: the package&rsquo;s wheels. Check that the two settle together and that neither wheel jumps when the other ends.',
        controls: group('Coupling', 'couple', [['on', 'Side dish follows', true], ['off', 'Not coupled']], 'pg-wheel-side') + width('coupled-wheels-component'),
        component: `${kitchenWheels}
        ${log('pg-wheel-log')}`,
    },
];
