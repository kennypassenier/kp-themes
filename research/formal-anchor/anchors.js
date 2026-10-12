// Formal's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Formal is paper and ink (a warm stock,
// near-black ink, one navy that does every acting, bronze and gold as a
// second voice that never acts, brick red for the accountant's entries); its
// stated rule is that motion commits, it does not perform. Each candidate is
// one thing a clerk does to a document: seals it, rules the account off,
// signs it, clears a redaction, marks the place with a ribbon, squares the
// sheet on the desk, blots the ink.
//
// The other themes' anchors steered clear of: brutalism's stamp askew (a
// still), sepia's wax-seal beads and quill stroke (its picks, not its anchor;
// the seal here is pressed and lifts, the signature dries), grotesk's
// baseline rule (drawn under type; formal's rule closes an account and
// doubles), blueprint's pen on a graticule, titanium's 1 px press.

export const THEME = 'formal';
export const LABEL = 'Formal';
/** One unit of the clock, ms: formal's beat is slower than grotesk's 120 ms step and quicker than forest's growth. */
export const UNIT = 110;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A ledger line: a label and a figure on a ruled row. */
const ledger = (label, figure) =>
    `<span class="fm-ledger"><span class="fm-ledger__label">${label}</span><span class="fm-ledger__figure">${figure}</span></span>`;

/** Formal's own progress bar, as the package draws it, with room for a candidate's part. */
const bar = (cls, extra = '') =>
    `<div class="fm-bar ${cls}" role="progressbar" aria-label="Entering the minutes"><span class="fm-bar__track">${a('scale', 'fm-bar__fill')}${extra}</span></div>`;

/* 1 · the seal */
const seal = (cls = '') =>
    `<span class="fm-seal ${cls}" aria-hidden="true"><span class="fm-seal__rim an-a"></span><span class="fm-seal__disc an-a"></span></span>`;

/* 3 · the signature: one flourish, drawn by its path length */
const signature = `<svg class="fm-sign an-a" viewBox="0 0 240 64" aria-hidden="true"><path pathLength="1" d="M6 44 C 18 8, 30 10, 36 30 S 44 60, 56 40 S 74 6, 86 24 S 96 54, 112 36 S 128 10, 142 28 S 150 50, 166 38 S 190 14, 204 30 S 222 46, 234 34" /><path class="fm-sign__cross" pathLength="1" d="M70 46 C 110 30, 160 32, 206 42" /></svg>`;

/* 4 · the redaction */
const redacted = (lines) =>
    `<span class="fm-dossier">${lines.map((line) => `<span class="fm-dossier__line"><span>${line}</span>${a('scale', 'fm-dossier__bar')}</span>`).join('')}</span>`;

export const QUESTION = 'Which one element is formal’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how formal loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, blueprint its tracing pen. Each candidate below is only what formal’s world already owns (paper and ink, the clerk’s desk), and each is told apart from the other themes’ anchors.';
export const LOOK =
    'Seven candidates for formal’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is formal to you, or “None of these” with a note.';

/**
 * The question's candidates, recommended first. `follows` says what the
 * rest of the theme would be (hover, press, arrival, live, leave); `why`
 * is the verdict's reason (the first is "Recommended: … because", the others
 * "Not recommended, because").
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    {
        key: 'seal',
        name: 'The seal is pressed',
        see: 'A minute on ruled paper. A navy seal comes down on it from above, lands with a dead stop, and its rim spreads a hair into the paper as it is pressed; it is held there for the dwell, then lifted the way it came, and the paper is bare again. As a progress bar, the navy band is entered across the hairline and, when the account is full, the seal is pressed at its end. As a button press, the button itself is the seal: the face goes grey under the press and a ring spreads out of its edge into the paper.',
        follows:
            'Every arrival is sealed (it lands, dead stop, a rim spreads once); a live update is re-sealed; loading is the seal pressed and lifted until the reading is there; a press is the rim spreading from the control; hover is the seal held just above the paper (a hairline ring at 2 px); the leave is the seal lifted. Your busy, kpi and state picks (the seal is pressed, re-sealed) already say it.',
        why: 'it is what your own picks keep reaching for in formal (the seal pressed, re-sealed, the raised seal, the voided stamp), it says “official” in one gesture, it gives hover, press, arrival, live and loading without a new idea, and no finished theme owns it: brutalism’s stamp is a still, sepia’s seal is a bead in a row, titanium presses by dropping a pixel.',
        caps: [
            'In its own scene: the seal pressed on the minute',
            'As a progress bar: sealed when the account is full',
            'As a button press: the rim spreads from the button',
        ],
        hero: `<div class="an-hero fm-s-hero" role="img" aria-label="A minute on ruled paper; a navy seal comes down on it, is pressed, and lifted again"><div class="fm-sheet">${ledger('Minute 14', 'Carried')}${ledger('Accounts received', '1 284,00')}${ledger('Resolved', 'Approved')}</div>${seal('fm-s-hero__seal')}</div>`,
        bar: `<div class="an-bar">${bar('fm-s-bar', seal('fm-s-bar__seal'))}</div>`,
        button: `<div class="an-btn"><span class="fm-s-btn">${button('Approve', 'an-press fm-s-press')}</span></div>`,
    },
    {
        key: 'rule',
        name: 'The account is closed: the double rule',
        see: 'A ledger line with its figure. A navy rule is ruled under it from the start at an even pace, and the moment it reaches the end a second, thinner rule is ruled under the first: the bookkeeper’s double rule, the account closed. It is held, then taken off in the same order backwards. As a progress bar, the band is ruled across and the second rule closes it at the end. As a button press, the rule formal already draws inside a hovered button is drawn first, and the press doubles it.',
        follows:
            'Hover rules the single line (as formal’s controls already do), the press doubles it, an arrival is ruled in from the start, a finished thing is closed with the double rule, a live update is ruled again, the leave is the rules taken off. Loading is a rule being ruled under what is coming.',
        why: 'it is the one gesture formal’s controls already make (the rule doubles 2 px inside a hovered button) and the mark the ledger graph, the diary and the engraved plates all carry, so it holds the theme together at once; but it is a line being drawn, and grotesk owns the drawn line under type (its baseline), so side by side the two read as cousins.',
        caps: [
            'In its own scene: the account ruled off, then closed',
            'As a progress bar: ruled across, closed at the end',
            'As a button press: the inner rule, then doubled',
        ],
        hero: `<div class="an-hero fm-r-hero" role="img" aria-label="A ledger line; a navy rule is ruled under it and a second, thinner rule closes it"><div class="fm-sheet fm-sheet--one">${ledger('Balance carried forward', '1 284,00')}${a('scale', 'fm-r-rule')}${a('scale', 'fm-r-rule fm-r-rule--second')}</div></div>`,
        bar: `<div class="an-bar">${bar('fm-r-bar', a('scale', 'fm-r-bar__second'))}</div>`,
        button: `<div class="an-btn"><span class="fm-r-btn">${button('Approve', 'an-press fm-r-press')}</span></div>`,
    },
    {
        key: 'signature',
        name: 'Countersigned: the signature dries',
        see: 'A minute, and under it a signature written in one flourish by a pen, at a pen’s pace: it is wet as it is written (a touch darker, a hair blurred) and dries to crisp navy ink in the last beat. Held, then unwritten backwards. As a progress bar, the pen writes the band and a nib runs at its head. As a button press, a short stroke is signed beside the label when the press lands.',
        follows:
            'What arrives is written in by the pen (the trend line, the figures, a rule); a live update is initialled; the press signs; hover is the pen held over the control (its underline); loading is the pen writing a leader; the leave is the stroke lifted. Your chart pick (written in by hand) and the tiles’ engraved title already say it.',
        why: 'it is the most personal of the seven and the richest motion (a pen’s pace, the ink drying), but a pen drawing a line is blueprint’s anchor (the tracing pen on its graticule) and sepia’s quill stroke, so the signature reads as formal only through its ink and its paper, not through the gesture itself.',
        caps: [
            'In its own scene: the minute countersigned',
            'As a progress bar: the pen writes the band',
            'As a button press: a stroke signed beside the label',
        ],
        hero: `<div class="an-hero fm-g-hero" role="img" aria-label="A minute; a signature is written under it in one flourish and dries"><div class="fm-sheet fm-sheet--one">${ledger('Minutes of the fourteenth meeting', 'Read')}<span class="fm-g-line">${signature}</span></div></div>`,
        bar: `<div class="an-bar">${bar('fm-g-bar', a('move', 'fm-g-nib'))}</div>`,
        button: `<div class="an-btn"><span class="fm-g-btn">${button('Approve', 'an-press fm-g-press', '', `<svg class="fm-g-tick an-a" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M4 13 L 10 19 L 21 6" /></svg>`)}</span></div>`,
    },
    {
        key: 'redaction',
        name: 'Cleared: the redaction is lifted',
        see: 'A paragraph of the minutes, every line under an ink-black redaction bar. The bars are cleared toward the start, one line a beat after the other, and the text stands released; held, then barred again in the same order backwards. As a progress bar, the band is the bar being cleared: what is done is released, what is still to come stays black. As a button press, a black bar strikes under the label when the press lands.',
        follows:
            'Everything arrives from under its bar (released), leaves under it (classified again), loads as a bar that is not yet cleared; a live update is a bar lifted and laid again over the changed figure; hover is a hairline where the bar would lie, the press strikes the bar. The dossier card already does it on the page.',
        why: 'it is the boldest picture of the seven and the only one no other theme can touch (black bars are the dossier’s alone), but it hides what it announces: a figure that arrives is unreadable until the bar is off, and a bar under every press is heavy for a theme whose rule is that motion commits, it does not perform.',
        caps: [
            'In its own scene: the minutes released line by line',
            'As a progress bar: the bar cleared toward the start',
            'As a button press: a bar strikes under the label',
        ],
        hero: `<div class="an-hero fm-d-hero" role="img" aria-label="Lines of the minutes under black redaction bars; the bars are cleared toward the start, line by line"><div class="fm-sheet">${redacted(['Resolved that the quarterly accounts be received and filed.', 'The treasurer reported a balance of 1 284,00 carried forward.', 'The chair closed the meeting at a quarter past nine.'])}</div></div>`,
        bar: `<div class="an-bar">${bar('fm-d-bar', a('scale', 'fm-d-bar__black'))}</div>`,
        button: `<div class="an-btn"><span class="fm-d-btn">${button('Approve', 'an-press fm-d-press', '', a('scale', 'fm-d-strike'))}</span></div>`,
    },
    {
        key: 'ribbon',
        name: 'The ribbon marks the place',
        see: 'A page of the bound volume, ruled. The gold ribbon of the bookmark drops in from the top edge at a steady pace, its swallowtail last, and settles beside the line it marks, which takes the navy; held, then drawn out the way it came. As a progress bar, the ribbon is the head of the band, hanging under the hairline as the meter’s ribbon does. As a button press, a short ribbon drops over the button’s end when the press lands.',
        follows:
            'What is current is marked by the ribbon (the chosen row, today, the open tab); an arrival is the page the ribbon drops into; loading is the ribbon dropping in and out until the page is there; the press lays the ribbon; the leave draws it out. The bound-volume meter already carries it.',
        why: 'it is the richest drawn object formal owns (the meter’s swallowtail ribbon on buckram) and no finished theme has a ribbon, but formal’s own rule keeps gold out of every action (bronze and gold are the second voice, never a control), so a ribbon dropping on every press breaks the theme’s colour rule to become its anchor.',
        caps: [
            'In its own scene: the ribbon drops into the page',
            'As a progress bar: the ribbon hangs at the head',
            'As a button press: a ribbon drops over the end',
        ],
        hero: `<div class="an-hero fm-b-hero" role="img" aria-label="A ruled page; a gold bookmark ribbon drops in from the top and settles beside the line it marks"><div class="fm-sheet fm-sheet--page">${ledger('Minute 12', 'Noted')}${ledger('Minute 13', 'Noted')}${ledger('Minute 14', 'Approved')}${ledger('Minute 15', '')}${a('move', 'fm-b-ribbon')}</div></div>`,
        bar: `<div class="an-bar">${bar('fm-b-bar', a('move', 'fm-b-bar__ribbon'))}</div>`,
        button: `<div class="an-btn"><span class="fm-b-btn">${button('Approve', 'an-press fm-b-press', '', a('move', 'fm-b-tab'))}</span></div>`,
    },
    {
        key: 'squared',
        name: 'Squared up on the desk',
        see: 'A sheet is laid on the desk a couple of degrees off, the way a hand lays it down, slows and stops; then it is tapped square in one short move and lies true. Held, then picked up the way it was laid. As a progress bar, the band is laid in at a slight tilt along the hairline and squared at the end. As a button press, the press lands on one corner (the face tilts a degree and goes grey) and the release squares it.',
        follows:
            'Every panel, dialog and toast is laid down and squared (two beats: laid, tapped); a live update is a sheet re-laid; loading is a sheet not yet squared; the press is the corner pressed; the leave is the sheet picked up. Hover stays the rule.',
        why: 'it is the only candidate that makes formal’s plain fade-and-rise mean something (a sheet laid by a hand, then squared), and nothing else turns a part to square it; but it is a dialog’s gesture more than a control’s, the tilt on a button is small enough to be missed, and brutalism already owns the stamp askew as a still.',
        caps: [
            'In its own scene: the sheet laid, then squared',
            'As a progress bar: the band laid in, squared',
            'As a button press: pressed on a corner, squared',
        ],
        hero: `<div class="an-hero fm-q-hero" role="img" aria-label="A ruled sheet is laid on the desk a little askew and tapped square"><div class="fm-sheet fm-sheet--card fm-q-sheet an-a">${ledger('Minute 14', 'Carried')}${ledger('Accounts received', '1 284,00')}${ledger('Resolved', 'Approved')}</div></div>`,
        bar: `<div class="an-bar">${bar('fm-q-bar')}</div>`,
        button: `<div class="an-btn"><span class="fm-q-btn">${button('Approve', 'an-press fm-q-press')}</span></div>`,
    },
    {
        key: 'blotted',
        name: 'Blotted: the wet ink dries under the blotter',
        see: 'A figure is written wet: the ink is darker and spread a hair into the paper. The blotter, a pale sheet, is rocked across it from the start and lifts, and what it has passed stands crisp and dry. Held, then the blotter passes back and the ink is wet again. As a progress bar, the wet band is blotted dry across the hairline. As a button press, the press is the blotter laid on the face: the face goes to the blotter’s grey and the label dries crisp.',
        follows:
            'What arrives is written wet and blotted (figures, lines, a toast); a live update is the figure written again, wet; loading is a line of wet ink waiting for the blotter; the press is the blotter laid on; hover is the ink still wet (a touch darker); the leave is the ink lifted off the paper.',
        why: 'it is the most paper-and-ink of the seven and its press has a reason (a blotter is laid on), but ink that spreads into paper is sepia’s press (its ink stain), and wet ink is a blur, which formal’s anatomy forbids on text; the gesture belongs to the warmer paper next door.',
        caps: [
            'In its own scene: the figure blotted dry',
            'As a progress bar: the wet band blotted',
            'As a button press: the blotter laid on the face',
        ],
        hero: `<div class="an-hero fm-t-hero" role="img" aria-label="A figure written in wet ink; a blotter is rocked across it and the ink dries crisp"><div class="fm-sheet fm-sheet--one"><span class="fm-t-line"><span class="fm-t-wet an-a">${ledger('Balance carried forward', '1 284,00')}</span><span class="fm-t-dry an-a">${ledger('Balance carried forward', '1 284,00')}</span>${a('move', 'fm-t-blotter')}</span></div></div>`,
        bar: `<div class="an-bar">${bar('fm-t-bar', `${a('clip', 'fm-bar__dry')}${a('move', 'fm-t-bar__blotter')}`)}</div>`,
        button: `<div class="an-btn"><span class="fm-t-btn">${button('Approve', 'an-press fm-t-press', a('move', 'fm-t-press__blotter'))}</span></div>`,
    },
];
