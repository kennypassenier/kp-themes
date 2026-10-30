// The REQUIRED table: which elements must sit inside which wrapper, with the reason for each.

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
    {
        container: 'kp-selection',
        class: 'kp-selection',
        self: true,
        why: 'The bar measures its own width and folds its names and its actions behind the Actions button when narrow; the query reaches only its own parts [kpadopt5].',
    },
    {
        container: 'kp-quiet',
        class: 'kp-quiet',
        self: true,
        why: 'The control measures its own width and puts each label over its field on a phone; the query reaches only its own parts [wish-1120].',
    },
    {
        container: 'kp-jsonfield',
        class: 'kp-jsonfield',
        self: true,
        why: 'The field measures its own width and hides its line numbers when narrow; the query reaches only its own parts [kpadopt5].',
    },
    {
        container: 'kp-inspector',
        class: 'kp-inspector',
        self: true,
        why: 'The card measures its own width and gives a request path a line of its own when narrow; the query reaches only its own parts [kpadopt5].',
    },
    {
        container: 'kp-chart',
        class: 'kp-chart',
        self: true,
        why: 'The chart measures its own width and takes the median’s words off the plot on a phone (the tooltip carries them); the query reaches only its own parts [kpadopt5-people].',
    },
    {
        container: 'kp-passkeys',
        class: 'kp-passkeys',
        self: true,
        why: 'The list measures its own width and lays each row as a card with its buttons full width when narrow; the query reaches only its own rows [kpadopt5-people].',
    },
    {
        container: 'kp-thread',
        class: 'kp-thread',
        self: true,
        why: 'The conversation measures its own width and lets a bubble take 85 % of it when narrow; the query reaches only its own bubbles [kpadopt5-people].',
    },
    {
        container: 'kp-slider',
        class: 'kp-slider',
        self: true,
        why: 'The slider measures its own width and puts the value box under the track on a phone; the query reaches only its own parts [kpadopt5-time].',
    },
    {
        container: 'kp-dated',
        class: 'kp-dated',
        self: true,
        why: 'The dated option picker measures its own width and drops the meta column under the name on a phone; the query reaches only its own parts [kpadopt5-time].',
    },
    {
        container: 'kp-diffview',
        class: 'kp-diffview',
        self: true,
        why: 'The diff view measures its own width and moves each file path under its status and counts on a phone; the query reaches only its own parts [gap-diff-view].',
    },
    {
        container: 'kp-runs',
        class: 'kp-runs',
        self: true,
        why: 'The next-times list measures its own width and turns each row into two lines on a phone; the query reaches only its own parts [kpadopt5-time].',
    },
    {
        container: 'kp-weekdays',
        class: 'kp-weekdays',
        self: true,
        why: 'The weekday picker measures its own width and shrinks its chips on a phone; the query reaches only its own parts [kpadopt5-time].',
    },
    {
        container: 'kp-checklist',
        class: 'kp-checklist',
        self: true,
        why: 'The checklist measures its own width and lays the claim cell under the label when narrow; the query reaches only its own rows [kpadopt6-social].',
    },
    {
        container: 'kp-availability',
        class: 'kp-availability',
        self: true,
        why: 'The grid measures its own width and offers a list per column on a phone; the query reaches only its own parts [kpadopt6-social].',
    },
    {
        container: 'kp-qr',
        class: 'kp-qr',
        self: true,
        why: 'The code measures its own width and puts the link and Copy first on a narrow screen when asked; the query reaches only its own parts [kpadopt6-social].',
    },
    {
        container: 'kp-console',
        class: 'kp-console',
        self: true,
        why: 'The console measures its own width and stacks the select, prompt and Run on a phone; the query reaches only its own parts [kpadopt6-social].',
    },
    {
        container: 'kp-logviewer',
        class: 'kp-logviewer',
        self: true,
        why: 'The viewer lays its search and its tools in two rows or three by its own width; the query reaches only its own parts [gap-log-viewer].',
    },
    {
        container: 'kp-range',
        class: 'kp-range',
        self: true,
        why: 'The range picker measures its own width and puts Custom… under its presets when narrow; the query reaches only its own parts [kpadopt4-ideas].',
    },
    {
        container: 'kp-matrix',
        class: 'kp-matrix',
        self: true,
        why: 'The matrix scrolls inside its own box and narrows its row headers when that box is narrow; the query reaches only its own grid [kpadopt2-grids].',
    },
    {
        container: 'kp-busy-card',
        class: 'kp-datatable__busy-card',
        self: true,
        why: 'The busy card measures the data area it covers and lays its panel flat over a short one; the query reaches only its own panel [kpadopt2].',
    },
    {
        container: 'kp-week',
        class: 'kp-week',
        self: true,
        why: 'The agenda measures its own width and turns its seven columns into seven rows when narrow; the query reaches only its own parts [kpadopt-time].',
    },
    {
        container: 'kp-gantt',
        class: 'kp-gantt',
        self: true,
        why: 'The timeline measures its own width and narrows its lane labels; the query reaches only its own parts [kpadopt-time].',
    },
    {
        container: 'kp-pipeline',
        class: 'kp-pipeline',
        self: true,
        why: 'The board measures its own width and turns its lanes into rows when narrow; the query reaches only its own parts [kpadopt4].',
    },
    {
        container: 'kp-journey',
        class: 'kp-steplist--journey',
        self: true,
        why: 'A journey measures its own width and turns its path into a column when narrow; the query reaches only its own steps [kpadopt4].',
    },
    {
        container: 'kp-gantt-run',
        class: 'kp-gantt__run',
        self: true,
        why: 'A bar measures its own width and hides its label when it is too narrow to carry one; the query reaches only its own label [kpadopt-time].',
    },
    {
        container: 'kp-help',
        class: 'kp-help',
        self: true,
        why: 'A help card measures its own width and puts each word over its meaning when narrow; the query reaches only its own lists [scope-143].',
    },
];
