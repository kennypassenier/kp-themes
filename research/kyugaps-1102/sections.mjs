// research/kyugaps-1102: the two sections of the review page, each written once: what is asked, the heading and one
// sentence, what to expect, what to look at, the default it asks (where there is one), the controls and the component. A
// component is one or two stage frames (stage.html): each frame is a page of its own on kyu's topic page, so a sticky bar,
// a tour card fixed to the window and a phone's 390 px are real there.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (/** @type {string} */ label, /** @type {string} */ name, /** @type {[string, string, boolean?][]} */ buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;
/** The stage's width: the whole column, or a phone's 390 px. */
const width = (/** @type {string} */ target) => group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], target);
/** The state every frame of a section is put in: [value, words, pressed?]. */
const state = (/** @type {string} */ target, /** @type {[string, string, boolean?][]} */ states) => group('State', 'state', states, target);
/** One stage frame; demo.js gives it its address once the page has loaded, so a frame never holds the page's load up. */
const frame = (/** @type {string} */ id, /** @type {string} */ title, /** @type {string} */ scene, /** @type {string} */ v, /** @type {string} */ start) =>
    `<iframe class="pg-stage-frame" id="${id}" title="${title}" data-pg-src="stage.html?scene=${scene}&amp;v=${v}&amp;state=${start}" data-pg-scene="${scene}" data-pg-state="${start}" loading="lazy"></iframe>`;
/** Two frames under each other, each named, the default one wearing the Default badge. */
const pair = (/** @type {[string, string, string]} */ a, /** @type {[string, string, string]} */ b) => `<div class="pg-pair">${[a, b]
    .map(
        ([key, name, body], i) =>
            `<div class="pg-frame" data-pg-frame="${key}"${i === 0 ? ' data-pg-default' : ''}><p class="pg-frame__name"><span>${name}</span> <span class="kp-badge pg-frame__default">Default</span></p>${body}</div>`,
    )
    .join('')}</div>`;

export const SECTIONS = [
    {
        id: 'selection-room',
        title: 'Selection bar: no empty room while nothing is ticked',
        topic: 'selection',
        topicTitle: 'The selection bar',
        item: 'kyu 34',
        asked: 'kyu&rsquo;s dead letters card kept an empty band of 72 px (86 px on a phone) above its table while nothing was ticked: the selection bar holds its room so the table never jumps. New option <code>data-kp-selection-room="fold"</code>: the empty bar takes no room, and the first tick opens it. Holding the room stays the default unless you pick Fold.',
        h2: 'Dead letters of orders.created',
        intro: 'kyu&rsquo;s dead letters card, with the selection bar over its six dead letters.',
        expected: [
            '<b>Nothing ticked</b>: in <b>Hold</b> a blank band of 72 px stands between the card&rsquo;s sentence and the table. In <b>Fold</b> the table sits right under the sentence, with the usual 8 px gap of the card.',
            '<b>Two ticked</b>: both show the bar with &ldquo;2 selected&rdquo;, the two names, Requeue, Delete and Untick all. In Fold the room opens from 0 to 72 px in the theme&rsquo;s rule time (formal: 400 ms, even speed) while the bar is ruled open from its left edge, and the table moves down with it; in Hold only the bar is ruled open.',
            'Press <b>Nothing ticked</b> again: in Fold the bar is ruled closed and the room closes with it, the exact reverse. <b>Phone</b>: the same, the bar 86 px with the count on its own row.',
        ],
        look: 'Formal: the bar&rsquo;s blue start edge and hairline frame, ruled open at an even speed. Check that in Fold nothing of the empty bar is left (no line, no gap) and that the table never overlaps the opening bar.',
        choices: [{ id: 'selection-room-default', label: 'The room of an empty bar', default: 'hold', options: [{ value: 'hold', label: '<b>Hold</b>: the room stays (now)' }, { value: 'fold', label: '<b>Fold</b>: no room until a tick' }] }],
        controls: state('selection-room-component', [['none', 'Nothing ticked', true], ['two', 'Two ticked']]) + width('selection-room-component'),
        component: pair(
            ['hold', '<b>Hold</b>, as approved', frame('pg-room-hold', 'Dead letters, the bar holds its room', 'dead', 'hold', 'none')],
            ['fold', '<b>Fold</b>, the option', frame('pg-room-fold', 'Dead letters, the bar folds while empty', 'dead', 'fold', 'none')],
        ),
    },
    {
        id: 'tour-tall',
        title: 'Tour card on a part taller than the window',
        topic: 'tour',
        topicTitle: 'The tour',
        item: 'kyu 33',
        asked: 'kyu&rsquo;s tour step on the dead letters card put its card above the card&rsquo;s top, out of the window (top &minus;124 px), because the card is taller than the window; kyu pointed the step at the heading instead. The tour card now takes the other side when its own side has no room, and lies over the part, 16 px inside the window, when neither side has room. A fault fix: nothing to choose.',
        h2: 'Dead letters on a busy day',
        intro: 'kyu&rsquo;s topic page with thirty dead letters, so the card is taller than the window, and the tour standing on the whole card.',
        expected: [
            '<b>Tour on the dead letters</b>: the card is ringed and the page around it dimmed; the tour card (&ldquo;Dead letters&rdquo;, 1 of 1, Done) stands 16 px under the window&rsquo;s top edge, over the top of the ringed card, fully readable, with nothing of it cut off.',
            'Scroll the frame: the tour card stays inside the window and follows the part; it never leaves the top or the bottom edge. Esc or Done ends the tour. <b>Closed</b>: no tour.',
            '<b>Phone</b>: the same, the tour card the window&rsquo;s width less 16 px on either side.',
        ],
        look: 'Formal: the tour card on its popover plate with the focus-coloured ring round the part. Check that the card is wholly in the window and that its text never touches its edges.',
        controls: state('tour-tall-component', [['tour', 'Tour on the dead letters', true], ['closed', 'Closed']]) + width('tour-tall-component'),
        component: frame('pg-tour', 'kyu&rsquo;s topic page with the tour on the dead letters', 'tour', 'fixed', 'tour'),
    },
];
