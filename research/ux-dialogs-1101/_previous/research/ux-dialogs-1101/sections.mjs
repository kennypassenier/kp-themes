// research/ux-dialogs-1101: the eight sections of the review page, each written once: what is asked, the heading and one
// sentence, what to expect, what to look at, the default it asks (where Kenny lets the demo pick it), the controls and the
// component. A component is one or two stage frames (stage.html): each frame is a page of its own, so a modal dialog, a
// drawer and a phone's 390 px are real there, and two frames show "now" and "new" opened at once.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (/** @type {string} */ label, /** @type {string} */ name, /** @type {[string, string, boolean?][]} */ buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;
/** The stage's width: the whole column, or a phone's 390 px (the frames are 390 px wide, so the dialogs meet a phone's screen). */
const width = (/** @type {string} */ target) => group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], target);
/** The state every frame of a section is put in: [value, words, pressed?]. */
const state = (/** @type {string} */ target, /** @type {[string, string, boolean?][]} */ states) => group('State', 'state', states, target);
/** One stage frame; demo.js gives it its address once the page has loaded, so a frame never holds the page's load up. */
const frame = (/** @type {string} */ id, /** @type {string} */ title, /** @type {string} */ scene, /** @type {string} */ v, /** @type {string} */ start) =>
    `<iframe class="pg-stage-frame" id="${id}" title="${title}" data-pg-src="stage.html?scene=${scene}&amp;v=${v}&amp;state=${start}" data-pg-scene="${scene}" data-pg-state="${start}" loading="lazy"></iframe>`;
/** Two frames under each other, each named; `mark` puts the Default badge on them (a section that asks the default). */
const pair = (/** @type {[string, string, string]} */ a, /** @type {[string, string, string]} */ b, mark = true) => `<div class="pg-pair">${[a, b]
    .map(
        ([key, name, body], i) =>
            `<div class="pg-frame" data-pg-frame="${key}"${mark && i === 0 ? ' data-pg-default' : ''}><p class="pg-frame__name"><span>${name}</span>${mark ? ' <span class="kp-badge pg-frame__default">Default</span>' : ''}</p>${body}</div>`,
    )
    .join('')}</div>`;
/** The one question a section asks whose default the demo picks: which look is the default (now stays it until Kenny says). */
const defaultOf = (/** @type {string} */ id, /** @type {string} */ label, /** @type {string} */ now, /** @type {string} */ next) => [
    { id, label, default: 'now', options: [{ value: 'now', label: now }, { value: 'new', label: next }] },
];
const NOW = '<b>Now</b>, as approved';
const NEW = '<b>New</b>, the option';

export const SECTIONS = [
    {
        id: 'drawer-beside',
        title: 'Drawer beside the list: the list stays in sight',
        topic: 'drawer',
        topicTitle: 'The drawer',
        item: 'drawer-modal, Kitchen',
        asked: 'Kitchen&rsquo;s drawer always opened over an opaque backdrop, so the list it edits was gone. You answered &ldquo;As an option&rdquo;: <code>data-kp-drawer-mode="beside"</code> opens it without a backdrop, the list stays usable with its open row marked, and Escape still closes it. The modal drawer stays the default.',
        h2: 'Dish categories',
        intro: 'Kitchen&rsquo;s six dish categories, with Soups open in the drawer.',
        expected: [
            '<b>Now</b>: the drawer at the right over the whole page, the list hidden under the backdrop. <b>New</b>: no backdrop; the list stands to its left, narrower, every column whole, the Soups row marked with a grey plate and a dark edge at its start.',
            'In <b>New</b>, press Edit on Pasta: the drawer moves to Pasta and the mark goes with it. Escape (in the drawer or in the list) closes it, the mark goes and the focus is back on the row&rsquo;s Edit. <b>Phone</b>: there is no room beside anything, so the drawer opens over the page as now.',
        ],
        look: 'Formal: the approved drawer with its double rule; beside, a soft shadow along its edge instead of a backdrop. Check that no part of the list stands under the drawer.',
        controls: state('drawer-beside-component', [['edit', 'Soups open', true], ['add', 'Add a category'], ['closed', 'Closed']]) + width('drawer-beside-component'),
        component: pair(
            ['now', NOW, frame('pg-beside-now', 'Dish categories, the modal drawer', 'categories', 'now', 'edit')],
            ['new', `${NEW}: beside`, frame('pg-beside-new', 'Dish categories, the drawer beside the list', 'categories', 'beside', 'edit')],
            false,
        ),
    },
    {
        id: 'drawer-width',
        title: 'Drawer widths: narrow for a few fields, wide for an editor',
        topic: 'drawer',
        topicTitle: 'The drawer',
        item: 'drawer-modal, Kitchen',
        asked: 'Kitchen&rsquo;s Add category drawer had one width whether it held three fields or the recipe editor. You answered &ldquo;As an option&rdquo;: <code>data-kp-drawer-width</code> is <code>narrow</code> (22rem) for two or three fields or <code>wide</code> (48rem) for an editor; without it the drawer keeps its 28rem.',
        h2: 'Add a category, and the recipe editor',
        intro: 'The same drawer twice: three fields in the narrow one, a whole recipe in the wide one.',
        expected: [
            '<b>Narrow</b>: Add a category in a 352 px drawer, the three fields and their labels whole. <b>Wide</b>: Edit Pasta carbonara in a 768 px drawer; the steps field is wide enough to read a step on one line.',
            'Both are the approved drawer otherwise: the same head, close, foot and slide. <b>Phone</b>: either width is the whole window.',
        ],
        look: 'Formal: the approved drawer at two widths. Check that the narrow one wraps nothing it should not and the wide one leaves no empty band.',
        controls: state('drawer-width-component', [['open', 'Open', true], ['closed', 'Closed']]) + width('drawer-width-component'),
        component: pair(
            ['narrow', '<b>Narrow</b>, Add a category', frame('pg-width-narrow', 'Add a category in a narrow drawer', 'categories', 'narrow', 'add')],
            ['wide', '<b>Wide</b>, the recipe editor', frame('pg-width-wide', 'The recipe editor in a wide drawer', 'recipe', 'wide', 'open')],
            false,
        ),
    },
    {
        id: 'dialog-guard',
        title: 'Close guard: a changed form asks before it closes',
        topic: 'guard',
        topicTitle: 'The close guard',
        item: 'close-guard, Kitchen',
        asked: 'Cancel, ✕, Escape and a press beside the drawer closed Kitchen&rsquo;s recipe editor silently, edit and all. You answered &ldquo;As an option&rdquo;: <code>data-kp-dialog-guard</code> on a dialog or drawer asks &ldquo;Keep editing / Discard&rdquo; on every way out once its form changed. Off by default.',
        h2: 'The recipe editor',
        intro: 'Edit Pasta carbonara with its English name changed to &ldquo;Spaghetti carbonara&rdquo;, and Cancel pressed.',
        expected: [
            '<b>The question</b>: &ldquo;Discard your changes?&rdquo;, &ldquo;What you changed here is not saved yet.&rdquo;, Keep editing (it takes the focus when the question opens) and Discard in red. Keep editing goes back to the editor with the change; Discard closes it.',
            '<b>Changed</b>: try every way out: Cancel, ✕, Escape and a press on the page beside the drawer; each asks. <b>Unchanged</b>: each closes at once. Save closes without a question.',
        ],
        look: 'Formal: the package&rsquo;s confirmation over the drawer. Check that the question names what happens and that the safe answer has the focus.',
        controls: state('dialog-guard-component', [['asking', 'The question', true], ['changed', 'Changed'], ['open', 'Unchanged']]) + width('dialog-guard-component'),
        component: frame('pg-guard', 'The recipe editor with the close guard', 'recipe', 'guard', 'asking'),
    },
    {
        id: 'dialog-backdrop',
        title: 'Dialog backdrop: a translucent scrim',
        topic: 'dialog',
        topicTitle: 'The dialog',
        item: 'dialog-backdrop, Medicine Cabinet',
        asked: 'The opaque backdrop hid the list behind Medicine Cabinet&rsquo;s Add symptom. <code>data-kp-backdrop="scrim"</code> on a dialog or round it (the page&rsquo;s html for all) dims the page instead. You choose the default; the other stays an option.',
        h2: 'Add a symptom',
        intro: 'The symptoms list with Add symptom open.',
        expected: [
            '<b>Now</b>: the dialog on formal&rsquo;s paper-grey backdrop; nothing of the list shows. <b>New</b>: the list reads through a dark, see-through scrim; the dialog is unchanged.',
            'Both close and open the approved way. <b>Phone</b>: the same at 390 px.',
        ],
        look: 'Formal: the approved dialog with its double rule. Check that the list under the scrim reads at a glance and the dialog still stands out.',
        choices: defaultOf('backdrop', 'The default backdrop', 'Opaque (now)', 'Translucent scrim'),
        controls: state('dialog-backdrop-component', [['open', 'Open', true], ['closed', 'Closed']]) + width('dialog-backdrop-component'),
        component: pair(['now', NOW, frame('pg-bd-now', 'Add a symptom on the opaque backdrop', 'symptoms', 'now', 'open')], ['new', NEW, frame('pg-bd-new', 'Add a symptom on the scrim', 'symptoms', 'scrim', 'open')]),
    },
    {
        id: 'dialog-phone-sheet',
        title: 'Dialog on a phone: a sheet at the foot',
        topic: 'dialog',
        topicTitle: 'The dialog',
        item: 'dialog-phone-sheet, Medicine Cabinet',
        asked: 'On a phone the dialog stood in the middle, its Add button far from the thumb. <code>data-kp-dialog-phone="sheet"</code> anchors it to the foot of the screen as a sheet, the whole width, with its buttons side by side. You choose the default.',
        h2: 'Add a symptom on a phone',
        intro: 'The same dialog in a 390 px window.',
        expected: [
            '<b>Now</b>: the dialog in the middle of the screen, 1rem from each side. <b>New</b>: the dialog on the foot of the screen, edge to edge, square at the bottom; Cancel and Add symptom share one row of two equal buttons.',
            'Above 40rem the sheet is the ordinary dialog again.',
        ],
        look: 'Formal: the approved dialog; as a sheet its double rule runs along the top. Check that the buttons are where a thumb is and nothing is cut at the bottom.',
        choices: defaultOf('phone', 'The default dialog on a phone', 'In the middle (now)', 'A sheet at the foot'),
        controls: state('dialog-phone-sheet-component', [['open', 'Open', true], ['closed', 'Closed']]),
        component: `<div class="pg-phone">${pair(['now', NOW, frame('pg-sheet-now', 'Add a symptom on a phone, in the middle', 'symptoms', 'now', 'open')], ['new', NEW, frame('pg-sheet-new', 'Add a symptom on a phone, as a sheet', 'symptoms', 'sheet', 'open')])}</div>`,
    },
    {
        id: 'dialog-stacking',
        title: 'A confirmation inside a dialog: one level, with Back',
        topic: 'dialog',
        topicTitle: 'The dialog',
        item: 'dialog-stacking, HTTPSwitchboard',
        asked: 'Delete profile opened a second modal over HTTPSwitchboard&rsquo;s Manage profiles. <code>data-kp-dialog-stack="replace"</code> puts the confirmation in the dialog&rsquo;s place instead, with Back. You choose the default.',
        h2: 'Manage profiles',
        intro: 'Manage profiles with Delete pressed on Travel.',
        expected: [
            '<b>Now</b>: the confirmation in its own dialog over Manage profiles. <b>New</b>: Manage profiles keeps its place and size; its rows step aside for &ldquo;Delete profile Travel?&rdquo;, Back and Delete Travel. Back (or Escape) brings the rows back with the focus on Travel&rsquo;s Delete; Delete Travel does the same after the delete.',
            'The sentence says &ldquo;Back leaves everything as it is.&rdquo; in New. <b>Phone</b>: the same, at 390 px.',
        ],
        look: 'Formal: the approved dialog and confirmation. Check that one dialog is on screen in New and that nothing jumps when it swaps.',
        choices: defaultOf('stack', 'The default for a confirmation inside a dialog', 'A second dialog over it (now)', 'In its place, with Back'),
        controls: state('dialog-stacking-component', [['confirm', 'Delete asked', true], ['manage', 'Manage profiles'], ['closed', 'Closed']]) + width('dialog-stacking-component'),
        component: pair(['now', NOW, frame('pg-stack-now', 'Delete profile over Manage profiles', 'profiles', 'now', 'confirm')], ['new', NEW, frame('pg-stack-new', 'Delete profile in the place of Manage profiles', 'profiles', 'replace', 'confirm')]),
    },
    {
        id: 'confirm-text',
        title: 'Confirmation words: the button says what the question asks',
        topic: 'confirm',
        topicTitle: 'The confirmation',
        item: 'confirm-text, kyu',
        asked: 'kyu&rsquo;s Prune said &ldquo;This cannot be undone.&rdquo; twice and confirmed with &ldquo;Yes, do it&rdquo;. You answered &ldquo;The label comes from the sentence&rdquo;: the dictionary&rsquo;s sentence drops what the phrase already says, and Confirm takes the phrase&rsquo;s verb and object. A page&rsquo;s own words still win.',
        h2: 'Dead letters',
        intro: 'kyu&rsquo;s dead letters with Prune pressed: &ldquo;Prune 8 dead letters? This cannot be undone.&rdquo;',
        expected: [
            '<b>Before</b>: &ldquo;This cannot be undone.&rdquo; in the title and again in the sentence; the red button says &ldquo;Yes, do it&rdquo;. <b>After</b>: the sentence is only &ldquo;Cancel leaves everything as it is.&rdquo;; the red button says &ldquo;Prune 8 dead letters&rdquo;.',
            'Cancel keeps the focus first in both. <b>Phone</b>: the buttons wrap whole, never mid-word.',
        ],
        look: 'Formal: the approved confirmation. Check that the red button alone says what will happen.',
        controls: state('confirm-text-component', [['confirm', 'Prune asked', true], ['closed', 'Closed']]) + width('confirm-text-component'),
        component: pair(['now', '<b>Before</b>', frame('pg-words-now', 'Prune with the words of before', 'prune', 'now', 'confirm')], ['new', '<b>After</b>', frame('pg-words-new', 'Prune with the words from the sentence', 'prune', 'new', 'confirm')], false),
    },
    {
        id: 'typed-confirm-font',
        title: 'Typed confirmation: what is lost, in the body font',
        topic: 'confirm',
        topicTitle: 'The confirmation',
        item: 'typed-confirm, kyu',
        asked: 'The &ldquo;This deletes, for good&rdquo; list was set in the code font. You answered &ldquo;Docs and the font&rdquo;: the list is set in the body font; the name to type keeps its code chip. The docs now keep a typed confirmation for mass or irreversible deletes.',
        h2: 'Delete a subscription',
        intro: 'kyu&rsquo;s subscription orders-to-ha with Delete pressed.',
        expected: [
            '<b>Before</b>: the three lines under &ldquo;This deletes, for good:&rdquo; in small monospace. <b>After</b>: the same lines in the body font at the small size; &ldquo;orders-to-ha&rdquo; to type still in its code chip.',
            'Type the name and Delete turns on. <b>Phone</b>: the lines wrap whole.',
        ],
        look: 'Formal: the approved typed confirmation. Check that the list reads as sentences and the name to type still stands out.',
        controls: state('typed-confirm-font-component', [['confirm', 'Delete asked', true], ['closed', 'Closed']]) + width('typed-confirm-font-component'),
        component: pair(['now', '<b>Before</b>', frame('pg-typed-now', 'The typed confirmation with its list in the code font', 'typed', 'now', 'confirm')], ['new', '<b>After</b>', frame('pg-typed-new', 'The typed confirmation with its list in the body font', 'typed', 'new', 'confirm')], false),
    },
];
