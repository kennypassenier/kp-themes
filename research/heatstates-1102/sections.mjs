// research/heatstates-1102: one section per visible change of this batch (DEMO_RULES ch. 1 and 6), formal only, on the Habits app's
// counters history (data.js). The heat grid's empty and failed plates, the code view's and the progress bar's states were measured
// and are already the package's (README.md), so they are not asked again.
import { group, historyCard, log, width } from './markup.mjs';

const ITEM = 'Habits gap of 01/11/2026';

export const SECTIONS = [
    {
        id: 'heat-days',
        title: 'A tap on a row opens its days',
        topic: 'heat',
        topicTitle: 'The heat grid',
        item: `${ITEM}, heat grid cells on a phone`,
        asked:
            'On a phone 30 days in a row are cells of 4 by 22 px, which no finger hits. A tap on a row now opens that row&rsquo;s days, one line a day.',
        h2: 'The Counters history, 30 days, on a phone',
        intro: 'The Habits history card. Opened shows a tap, because a mouse is not a finger.',
        expected: [
            '<b>Opened</b>: Walk&rsquo;s 30 days on the menu plate at its row, swatch, day and value in columns; Thu 15/10 focused.',
            'Choosing a day marks its column; Escape or a tap outside closes the list.',
            '<b>Auto</b> (default): a touch on small cells; <b>Always</b>: every click; <b>Off</b>: cells only.',
        ],
        look: 'Check that the list reads as the theme&rsquo;s own menu and stays whole on the screen.',
        controls: [
            group('Opened', 'days-open', [['closed', 'Closed', true], ['open', 'Opened']], 'heat-days-component'),
            group('When a row opens its days', 'days-mode', [['auto', 'Auto (default)', true], ['always', 'Always'], ['off', 'Off']], 'heat-days-component'),
            width('heat-days-component'),
        ].join(''),
        component: `${historyCard('pg-heat-days')}${log('pg-heat-days-log')}`,
        phone: true,
    },
    {
        id: 'heat-states',
        title: 'A loading heat grid keeps its rows&rsquo; height',
        topic: 'heat',
        topicTitle: 'The heat grid',
        item: `${ITEM}, state plates of the heat grid`,
        asked:
            'Loading, each row stood 3 px taller in formal (the grid jumped 12 px). The waiting name now stays inside its row.',
        h2: 'The Counters history in its four states',
        intro: 'The line under the card says the grid&rsquo;s height against its loaded height.',
        expected: [
            '<b>Loading</b>: the busy card over the cells, the grid as high as loaded.',
            '<b>Empty</b>, <b>Failed</b>: the package plate, centred, Failed with a normal Retry (at least 12rem high, as every plate).',
        ],
        look: 'Check that Loaded to Loading moves nothing under the grid.',
        controls: [
            group('State', 'heat-state', [['ready', 'Loaded', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], 'heat-states-component'),
            width('heat-states-component', false),
        ].join(''),
        component: `${historyCard('pg-heat-states')}${log('pg-heat-states-log')}`,
        phone: false,
    },
];
