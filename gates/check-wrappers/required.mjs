// The REQUIRED table: which elements must sit inside which wrapper, with the reason for each.
import { REQUIRED_MORE } from './required-more.mjs';

/**
 * What a container name means for the markup on a page: which element
 * has to be inside the wrapper, and why it is that element.
 *
 * The list is here rather than derived, because no stylesheet says which
 * ELEMENT a consumer writes — only which selectors a query affects, and
 * those are descendants of the thing that matters. It is held honest
 * from the other side: a container name the stylesheet queries and this
 * list does not name is a failure.
 *
 * An entry marked `self` is a component that establishes its own container
 * and whose queries reach only its own parts [scope-143]: a part cannot be
 * drawn outside the component, so no page can leave it unwrapped. It is
 * listed so every container name the stylesheet queries is accounted for,
 * and held to it: the class it names must be the one establishing the
 * container.
 *
 * @type {Array<{ container: string, class: string, attribute?: string, self?: true, why: string }>}
 */
export const REQUIRED = [
    {
        container: 'kp-grid',
        class: 'kp-grid',
        why: 'The query changes `grid-template-columns` on `.kp-grid` itself, so the container has to be one element up [TH104].',
    },
    {
        container: 'kp-nav',
        class: 'kp-nav',
        why: 'The query changes the bar’s own inline padding, so the container has to be one element up [TH104].',
    },
    {
        container: 'kp-table',
        class: 'kp-table',
        attribute: 'data-kp-cards',
        // A plain table without the attribute asks for nothing: the card
        // layout is opt-in, so only a table that opted in needs a
        // container to opt in against [TH96].
        why: 'A table that asked for the card layout needs the width of its own box to decide, and the query rewrites the table itself [TH96].',
    },
    {
        container: 'kp-action-list',
        class: 'kp-action-list',
        self: true,
        why: 'The list measures its own width and moves its rows’ buttons under their text when narrow; the query reaches only its own rows [scope-143].',
    },
    {
        container: 'kp-kpi',
        class: 'kp-kpi',
        self: true,
        why: 'A tile two to a row on a phone wraps its own label; the query reaches only the tile’s own label [scope-143].',
    },
    {
        container: 'kp-page-header',
        class: 'kp-page-header',
        self: true,
        why: 'The header measures its own width and stacks its title over its buttons when narrow; the query reaches only its own parts [scope-143].',
    },
    {
        container: 'kp-list',
        class: 'kp-list',
        self: true,
        why: 'The list measures its own width and turns each row into a card when narrow; the query reaches only its own rows’ parts [mc-1030].',
    },
    {
        container: 'kp-rows',
        class: 'kp-rows',
        self: true,
        why: 'The row editor measures its own width, drops its head row and turns each row into a card when narrow; the query reaches only its own parts [mc-1030].',
    },
    {
        container: 'kp-attention',
        class: 'kp-attention',
        self: true,
        why: 'The band measures its own width and moves each problem’s fix under its words when narrow; the query reaches only its own items [scope-143].',
    },
    {
        container: 'kp-problems',
        class: 'kp-problems',
        self: true,
        why: 'The list of problems measures its own width and moves each fix under its words when narrow; the query reaches only its own alerts [kpadopt5].',
    },
    {
        container: 'kp-calendar-layout',
        class: 'kp-calendar-layout',
        self: true,
        why: 'The layout measures its own width and puts the page’s detail under the calendar when narrow; the query reaches only its own children [scope-143].',
    },
    {
        container: 'kp-bullets',
        class: 'kp-bullets',
        self: true,
        why: 'The list measures its own width and puts each bar under its row when narrow; the query reaches only its own rows [kpadopt4-data].',
    },
    {
        container: 'kp-formrows',
        class: 'kp-formrows',
        self: true,
        why: 'The form measures its own width and reads each row top to bottom when narrow; the query reaches only the rows’ parts [kpadopt4-data].',
    },
    {
        container: 'kp-formgrid',
        class: 'kp-formgrid',
        self: true,
        why: 'The form grid measures its own width and reads every row top to bottom when narrow; the queries reach only its rows, groups, refresh bar and bands [align-grid-1019].',
    },
    {
        container: 'kp-ops',
        class: 'kp-ops',
        self: true,
        why: 'The page frame measures its own width and folds its card spans and its KPI strip; the queries reach only its own parts [kpadopt5-ops].',
    },
    {
        container: 'kp-connection',
        class: 'kp-connection',
        self: true,
        why: 'The banner measures its own width and hides its second line on a phone; the query reaches only its own parts [kpadopt5-ops].',
    },
    {
        container: 'kp-question',
        class: 'kp-question',
        self: true,
        why: 'The card measures its own width and puts each consequence under its button; the query reaches only its own parts [kpadopt5-ops].',
    },
    {
        container: 'kp-rating',
        class: 'kp-rating--input',
        self: true,
        why: 'A rating you can set measures its own width and lets its five stars fill a phone-wide box; the query reaches only its own parts [kpadopt6].',
    },
    {
        container: 'kp-quote',
        class: 'kp-quote',
        self: true,
        why: 'The card measures its own width and sets Hide as a normal-size button at the end in a phone-wide box; the query reaches only its own parts [kpadopt6].',
    },
    {
        container: 'kp-focus-answer',
        class: 'kp-focus-steps__answer',
        self: true,
        why: 'The answers of a question measure their own width and stack in one full-width column in a phone-wide box; the query reaches only its own parts [kpadopt6].',
    },
    {
        container: 'kp-ack',
        class: 'kp-ack',
        self: true,
        why: 'The gate measures its own width and puts its tick under its words on a phone; the query reaches only its inner frame [kpadopt6-ops].',
    },
    {
        container: 'kp-deplist',
        class: 'kp-deplist',
        self: true,
        why: 'The list measures its own width and stacks each row on a phone; the query reaches only its rows [kpadopt6-ops].',
    },
    {
        container: 'kp-trace',
        class: 'kp-trace',
        self: true,
        why: 'The trace measures its own width and stands its hops in a column on a phone; the query reaches only the hop list [kpadopt6-ops].',
    },
    {
        container: 'kp-code',
        class: 'kp-code',
        self: true,
        why: 'The block measures its own width and puts its tools under its title when narrow; the query reaches only its head [kpadopt4-data].',
    },
    {
        container: 'kp-feed',
        class: 'kp-feed',
        self: true,
        why: 'The feed measures its own width and puts each row\u2019s actor and time on a line under its text when narrow; the query reaches only its own rows [gap-activity-feed-1019].',
    },
    ...REQUIRED_MORE,
];
