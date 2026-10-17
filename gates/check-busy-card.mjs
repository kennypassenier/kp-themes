// A data area that loads shows the busy card [kpadopt2, Kenny 2026-10-16].
//
// Kenny, on the matrix and the run timeline in formal: "ik zie geen loading icoon? moet hier ook zoals bij een table
// zijn waar het icoon in het midden van de matrix staat en lijkt te laden", and then: "direct al twee fouten die ik
// niet overal wil tegenkomen, dus fix ze nu". Both drew their loading state as waiting cells and lanes only: no
// animated loading picture in the middle of the data, which the busy data table has had for a long time.
//
// The fix is one shared piece: js/busy-card.js lays the data table's own loading card (`.kp-datatable__busy-overlay` >
// `.kp-datatable__busy-panel` > `.kp-spinner` + `.kp-datatable__busy-words`) centred over a component's data area, and
// every theme dresses it as it dresses its busy table. This gate keeps the next data component from shipping a loading
// state without it. It reads every module in js/ and finds the ones that take a loading state (a `'loading'` state,
// `aria-busy`, `data-kp-loading` or skeleton parts). Each must be listed below:
//
//   CARD     a data component: its loading state lays the busy card, so the module must import js/busy-card.js or
//            build the card's markup itself (js/datatable.js and js/week.js do, from before the shared piece);
//   OWN      a component approved before 2026-10-16 with its own central loading picture, left as Kenny approved it
//            ("de rest heb ik toch al goedgekeurd"), with what that picture is;
//   NOT_DATA a module whose loading is not a data area's (a button's or a row's own spinner, the motion or the pieces
//            that dress a loading state), with why.
//
// A module that loads and is in none of the three is refused: decide, and a data component takes the card. A module in
// CARD that no longer lays it is refused too.
//
// Usage: node gates/check-busy-card.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** Data components whose loading state lays the busy card. */
export const CARD = [
    'js/datatable.js',
    'js/week.js',
    'js/heat.js',
    'js/gantt.js',
    'js/bullets.js',
    'js/code.js',
    'js/card-state.js',
    'js/pipeline.js',
    'js/checklist.js',
    'js/focus-steps.js',
    'js/wheel.js',
    'js/uptime.js',
    'js/compare.js',
    'js/passkeys.js',
];

/** Approved before the rule, each with its own central loading picture. @type {Record<string, string>} */
export const OWN = {
    'js/calendar.js': "the busy month's own card over the days (`.kp-calendar__busy`, --busy-whole) or every day's loading tone",
    'js/chart.js': "the plot's loading plate (`.kp-chart__state` as a skeleton block) over the whole plot",
    'js/graph.js': "the graph's loading note over the plot, at its final height",
    'js/kpi.js': "a KPI tile's own skeleton figure and meter: one figure, not a data area",
};

/** Modules whose loading is not a data area's. @type {Record<string, string>} */
export const NOT_DATA = {
    'js/action-tiles.js': "a tile is a button: its spinner stands in the tile's own mark",
    'js/statusrow.js': 'each row carries its own spinner while that one item is read; the list stays usable',
    'js/actions.js': "a row's own action at work (setRowBusy: the pressed button's spinner); the list stays usable",
    'js/facets.js': 'only the counts wait (quiet bars); the rows stay usable to filter with',
    'js/idmark.js': "a mark is one small plate: a loading mark is the plate's own skeleton",
    'js/stackbar.js': "one figure, as a meter is: its bar shows the meter's own loading picture (js/kpi.js setMeter) and the legend keeps its rows",
    'js/tick.js': 'a number counting to its value, no loading state of its own',
    'js/barcell.js': 'a cell of a data table, which lays the card over its rows (`dataTable().busy({ overlay: true })`)',
    'js/forms.js': "a submit button's busy state",
    'js/menu-button.js': "a menu's loading items, inside the menu's own plate",
    'js/segmented.js': "a segment's busy mark",
    'js/tabbar.js': "a tab's busy mark",
    'js/patterns.js': "a secret field's own one-line spinner while its one value is read (`.kp-secret`) [kpadopt4]",
    'js/auto.js': 'the loader that attaches the modules',
    'js/effects.js': "the effects' timing table",
    'js/motion.js': 'the motion a loading state arrives and leaves with',
    'js/loading-pieces.js': 'the pieces a theme dresses a waiting part with (the card included)',
    'js/busy-card.js': 'the busy card itself',
};

/** What makes a module one that takes a loading state. */
const LOADS = /=== 'loading'|aria-busy|data-kp-loading|kp-skeleton/;
/** What makes a module one that lays the busy card. */
const LAYS = /from '\.\/busy-card\.js'|kp-datatable__busy-overlay[\s\S]*kp-datatable__busy-panel/;

/**
 * The faults of a set of modules.
 * @param {Record<string, string>} modules source by path (`js/<name>.js`)
 * @returns {string[]}
 */
export function busyCardFaults(modules) {
    const faults = [];
    for (const [path, source] of Object.entries(modules)) {
        const loads = LOADS.test(source);
        if (CARD.includes(path)) {
            if (!LAYS.test(source))
                faults.push(`${path}: a data component whose loading state must lay the busy card (import js/busy-card.js and openBusyCard())`);
            continue;
        }
        if (!loads || path in OWN || path in NOT_DATA) continue;
        faults.push(
            `${path}: takes a loading state but is not classified. A data area that loads lays the busy card (js/busy-card.js ` +
                `openBusyCard(), and add it to CARD); a loading state that is not a data area's goes in NOT_DATA with why`,
        );
    }
    for (const path of [...CARD, ...Object.keys(OWN), ...Object.keys(NOT_DATA)])
        if (!(path in modules)) faults.push(`${path}: listed in gates/check-busy-card.mjs but not in js/`);
    return faults;
}

function main() {
    /** @type {Record<string, string>} */
    const modules = {};
    for (const name of readdirSync(`${ROOT}js`)) if (name.endsWith('.js')) modules[`js/${name}`] = readFileSync(`${ROOT}js/${name}`, 'utf8');
    const faults = busyCardFaults(modules);
    if (faults.length) {
        console.error(
            `check-busy-card: ${faults.length} fault(s) (Kenny, 2026-10-16: a data area that loads shows the table's loading card in its middle)\n  ${faults.join('\n  ')}`,
        );
        process.exit(1);
    }
    console.log(
        `check-busy-card: ${CARD.length} data components lay the busy card; ${Object.keys(OWN).length + Object.keys(NOT_DATA).length} other loading modules classified.`,
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
