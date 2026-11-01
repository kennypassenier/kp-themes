// research/ux-parts-1101, round 2: the two sections Kenny did not approve in round 1 (2026-11-01 23:22), each written once: what
// is asked, the heading and one sentence, what changed, what to expect, what to look at, the default it asks, the controls and the
// component. The five approved sections left the page (DEMO_RULES ch. 6); round 1 is in _previous/ and in git history.

import { chipToolbar, log, pair, topicsHeader, width } from './markup.mjs';

/** The one question an option section asks: which look is the default. @param {string} id @param {string} label @param {string} now @param {string} next */
const defaultOf = (id, label, now, next) => [{ id, label, default: 'now', options: [{ value: 'now', label: now }, { value: 'new', label: next }] }];

export const SECTIONS = [
    {
        id: 'chips-narrow',
        title: 'Filter chips: whole tracks, and a calm grid on a phone',
        topic: 'segmented',
        topicTitle: 'Filter chips',
        item: 'chips-narrow, Medicine Cabinet',
        asked: 'Kenny, 2026-11-01: &ldquo;the phone version is unwatchable&rdquo;. <b>Why it was:</b> the toolbar kept the search and the filters side by side at a phone&rsquo;s width (it only stacks on the window&rsquo;s width, not its own), so the filters got 28 px and &ldquo;Show: All ▾&rdquo; broke one letter per line; and the menu hid every filter and count behind one button. <b>What changed:</b> under 30rem of the toolbar&rsquo;s own width (<code>data-kp-segmented-fold-at</code>) the chips take a row of their own under the search and share its whole width: two balanced columns, both edges on the search&rsquo;s edges, every chip 44 px high with its name at the start and its count at the end, the chosen one filled. The menu stays an option for a long list (<code>data-kp-segmented-fold="menu"</code>). The desktop look is as before.',
        h2: 'What the Overview shows',
        intro: 'The cabinet&rsquo;s six filters beside its search, with their exact counts.',
        expected: [
            '<b>Phone</b>: <b>New</b> is the search, then the six filters on three rows of two, all 44 px high, the counts in one column per side, nothing cut, nothing scrolls. A press on a chip fills it and the line under the frames names the values. <b>Now</b> shows the approved chips as a phone shows them: one line that scrolls sideways.',
            '<b>Full width</b>: <b>New</b> is as you saw it, the chips on equal tracks beside the search, the rows balanced; <b>Now</b> wraps raggedly. <b>On a phone</b> (in the verdict panel) sets what a narrow group does: the grid, or the menu button of round 1.',
        ],
        look: 'Formal: the approved pills on two equal columns. Check that both edges of the grid line up with the search, that every row is full and that the chosen filter is found at a glance.',
        choices: [
            ...defaultOf('fit', 'The default look of a chip group', 'Flow (now)', 'Whole tracks, a grid on a phone'),
            { id: 'narrow', label: 'On a phone, a group on tracks', default: 'grid', options: [{ value: 'grid', label: 'A grid of whole chips' }, { value: 'menu', label: 'One menu button' }] },
        ],
        controls: width('chips-narrow-component'),
        component: `${pair(chipToolbar('pg-chips-now', ''), chipToolbar('pg-chips-new', ' data-kp-segmented-fit="tracks"'))}
        ${log('pg-chips-log')}`,
    },
    {
        id: 'auto-refresh-form',
        title: 'Auto-refresh: no second freshness line, every choice in reach on a phone',
        topic: 'refresh',
        topicTitle: 'Auto-refresh',
        item: 'auto-refresh-form, kyu',
        asked: 'Kenny, 2026-11-01: &ldquo;the phone version is unusable, the options with paused and every x.. should be on their own line and maybe even scrollable&rdquo;. <b>What changed:</b> under 30rem of the control&rsquo;s own width, <code>data-kp-refresh-line="off"</code> lays the control on two rows: &ldquo;Refresh automatically&rdquo; with Refresh now on the first, and every choice, Paused to Other&hellip;, on a row of its own under them. That row scrolls sideways when it does not fit, fades on the side that has more and opens with the current choice in view; every target is 44 px high. The menu look turns into that row on a phone, so every choice is one tap away. The desktop look is as before.',
        h2: 'Topics',
        intro: 'kyu&rsquo;s Topics header with its refresh control.',
        expected: [
            '<b>Phone</b>: <b>New</b> has &ldquo;Refresh automatically&rdquo; and Refresh now on one row, then Paused, Every 15 s, Every 30 s (chosen), Every 1 min, Every 5 min and Other&hellip; on their own row; swipe or Tab along it: the edge fades only where more choices wait. A press chooses at once. One freshness line on the page, the header&rsquo;s. <b>Now</b> is the approved bar as a phone folds it: segments, &ldquo;not updated yet&rdquo; and Refresh now under each other.',
            '<b>Full width</b>: <b>New</b> is as you saw it, &ldquo;Every 30 s ▾&rdquo; with Refresh now beside it; <b>Now</b> is the approved bar.',
        ],
        look: 'Formal: the package&rsquo;s segmented track and small button. Check that the choices have their own row, that the current one is visible without scrolling and that the fade says there is more.',
        choices: defaultOf('form', 'The default refresh control', 'Segments and its own line (now)', 'No own line; a menu, every choice on its own row on a phone'),
        controls: width('auto-refresh-form-component'),
        component: pair(topicsHeader('pg-refresh-now', ''), topicsHeader('pg-refresh-new', ' data-kp-look="menu" data-kp-refresh-line="off"')),
    },
];
