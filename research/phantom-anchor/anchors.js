// Phantom's candidates for its anchor element, UPDATE 1 (Kenny, 2026-10-08:
// "I like both the card is thrown and half tone shift, make another
// attempt with those combined"). Round one's option 1 was the calling card
// thrown in from off the stage, turning, slapping down askew on its
// deep-red shadow with a dead stop; option 5 was the board's halftone
// screen slipping sideways in hard cuts (+4, −3, +2, 0 px, a photocopy
// slipping) as the card was laid under it, and locking. This update is five
// ways of being both: the throw and the screen in one gesture.
//
// The world: the calling card (black, white and one violent red, cut paper,
// a halftone screen, Barlow Condensed 900 italic capitals, everything
// skewed −8°, shadows hard and offset in `--kp-red-deep`, nothing glows,
// motion ends in a dead stop on `--kp-shove` / `--kp-cut` or in steps).
// Never two plates brought into register (grotesk's anchor), never a jitter
// in ticks (cyberpunk's): the screen SLIPS in whole cuts and LOCKS.
//
// Implementation notes for options.css: see the comment above each
// candidate. The card is round one's (`.ph-card`: white, skewed −8° on its
// plate pseudo-element with the 6px deep-red hard shadow, the title in 900
// italic caps, the red corner slash); the halftone is the register's 7px
// dot grid (white dots 0.9px on black, `.ph-h-screen` at 0.55, the `--fx-
// texture` recipe) over the board; the throw is `translate −120% 30%
// rotate(−22deg) scale(1.15)` → rest `rotate(−1.5deg)` on `--kp-shove`
// written literally (cubic-bezier(0.81, 0, 0, 1)) with the inverse written
// on the close; the slip is `steps(1)` between fixed `background-position`
// poses. Every close is its open reversed.

export const THEME = 'phantom';
export const LABEL = 'Phantom';
/** One unit of the clock, ms: phantom's register beat is 120 ms; its shove curve is `--kp-shove`, its cut `--kp-cut`. */
export const UNIT = 100;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** The calling card: a white skewed card on a deep-red hard shadow, a title in 900 italic capitals, a line, a red corner slash. */
const card = (cls = '', inner = '') =>
    `<div class="ph-card ${cls}"><p class="ph-card__title">Pump house three</p><p class="ph-card__line">Flow 1 284 l/min · pressure steady</p><span class="ph-card__slash" aria-hidden="true"></span>${inner}</div>`;

/** Phantom's own progress bar: a skewed black halftone well, a red fill cut at a diagonal, a white shard at the cut. */
const bar = (cls, extra = '') =>
    `<div class="ph-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="ph-bar__well">${a('', 'ph-bar__screen')}${a('clip', 'ph-bar__fill')}<span class="ph-bar__shard an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is phantom’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Update 1. You liked “the card is thrown” and “the halftone shifts”; each candidate below is one way of making them one gesture: the throw and the screen together. They differ in what the screen does when the card lands: it jolts at the slap, it resolves into the card, it tears aside to let the card through, it is dragged by the throw, or it shuffles under the landed card.';
export const LOOK =
    'Update 1: five candidates that combine the thrown card with the halftone shift, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is phantom to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: round one's throw exactly (the card flies in 0–4 u on the shove,
    // dead stop at 4 u, rotate −1.5deg, the shadow cut in at the stop); AT
    // the slap the board's halftone screen (`.ph-a-screen` over the whole
    // stage) slips in hard cuts: +4px at 4 u, −3px at 4.5 u, +2px at 5 u,
    // 0 (locked) at 5.5 u (`steps(1)` between background-position poses),
    // the screen reacting to the throw like a slipping photocopy; the card
    // itself does not move after the stop. Out: the screen slips again (the
    // same cuts mirrored, 2.5–4 u) as the card is snatched off (4–8 u). Bar:
    // the red slab is shoved across the well (round one's) and the well's
    // screen slips the four cuts at the slab's stop. Button: press at 7 u =
    // the key cap drops onto its shadow in one cut (round one's) and the
    // button's dot screen slips one cut (+3px) and locks at 7.5 u.
    {
        key: 'jolt',
        name: 'The card is thrown, the screen jolts',
        see: 'The calling card flies in, turning, and slaps down askew on its deep-red shadow with a dead stop; at the slap the board’s halftone screen jolts, slipping sideways in four hard cuts, four, three, two pixels, and locks, a photocopy knocked in its tray. The card does not move again. Held, then the screen jolts once more as the card is snatched off. As a progress bar, the red slab is shoved across the well and the well’s screen slips at the slab’s stop. As a button press, the key cap drops onto its shadow and the button’s dot screen slips one cut and locks.',
        follows:
            'Everything arrives thrown and the screen under it jolts at the stop; everything leaves snatched with a jolt; loading is cards thrown and snatched with the screen slipping each time; a live update is the changed figure slapped again (the screen jolts, the figure stays); hover tilts the card a degree, the press drops it a cut and the screen slips once. The halftone is the board’s reaction to the thieves.',
        why: 'it keeps the throw you liked exactly and makes the halftone shift its consequence (the screen jolts because the card hit the board), so the two are one event with one dead stop; the card stays readable the whole time, the slip is four hard cuts and locks (no jitter), and nothing in it is grotesk’s register or cyberpunk’s glitch.',
        caps: [
            'In its own scene: the card slaps down, the screen jolts and locks',
            'As a progress bar: the slab shoved, the well’s screen slips',
            'As a button press: the key cap drops, the screen slips one cut',
        ],
        hero: `<div class="an-hero ph-a-hero" role="img" aria-label="A white calling card flies in and slaps down askew on a dark board; at the slap the board's halftone screen jolts sideways in hard cuts and locks"><div class="ph-a-stage">${a('', 'ph-a-screen')}${card('ph-a-card an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-a-bar')}</div>`,
        button: `<div class="an-btn"><span class="ph-a-btn">${button('Take it', 'an-press kp-button--primary ph-a-press', a('', 'ph-a-press__screen'))}</span></div>`,
    },
    // CSS: the card flies in (round one's throw, 0–4 u) but as a halftone
    // SILHOUETTE: white dots on the black board in the card's skewed shape
    // (`.ph-b-ghost`, the dot grid clipped to the card's outline, the title
    // as dots too: a copy of the card with `mask` of the dot grid), and at
    // the slap the dots resolve into the solid white card in three hard cuts
    // (the dot grid's density goes 25 → 50 → 100 % solid: three mask
    // densities, `steps(1)`, 4–5.5 u) while the shadow is cut in; the board's
    // screen itself does not move. Out: the card dissolves back into dots
    // (three cuts) and is snatched off as a silhouette. Bar: the slab is
    // shoved across as a dotted red silhouette and resolves solid at the
    // stop. Button: press at 7 u = the key cap drops onto its shadow and its
    // face resolves from dots to solid red in two cuts.
    {
        key: 'resolve',
        name: 'Thrown as a screen, resolves at the slap',
        see: 'The calling card flies in as its own halftone: a silhouette of white dots in the card’s shape, title and all; it slaps down with a dead stop and the dots resolve into the solid white card in three hard cuts, as a halftone print comes out of the screen. Held, then it dissolves back into dots and is snatched off. As a progress bar, the red slab is shoved across as a dotted silhouette and resolves solid at its stop. As a button press, the key cap drops and its face resolves from dots to solid red in two cuts.',
        follows:
            'Everything arrives as its halftone and resolves at the stop (a card, a menu, a toast, a figure), updates by the changed figure dissolving and resolving (two cuts), loads as a halftone that will not resolve (it dissolves and resolves without landing), leaves by dissolving into dots and being snatched; hover is a touch of dots at the edge, the press resolves.',
        why: 'it makes the halftone the card’s own material rather than the board’s (the card IS the screen until it lands), which is print in the truest sense, and resolving in three hard cuts is phantom’s gait; but a thing that flies as dots is hard to read in the air, and a dot screen that densifies in steps is a dither, which is retro’s way of appearing in grey.',
        caps: [
            'In its own scene: the card flies as dots, resolves at the slap',
            'As a progress bar: the dotted slab resolves at its stop',
            'As a button press: the face resolves from dots',
        ],
        hero: `<div class="an-hero ph-b-hero" role="img" aria-label="A calling card flies in as a halftone silhouette of white dots and resolves into a solid white card when it slaps down"><div class="ph-b-stage">${card('ph-b-card an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-b-bar')}</div>`,
        button: `<div class="an-btn"><span class="ph-b-btn">${button('Take it', 'an-press kp-button--primary ph-b-press')}</span></div>`,
    },
    // CSS: the board's screen (`.ph-c-screen`, the dot grid over the stage)
    // tears aside for the card: at 1 u it slips hard to one side in two cuts
    // (+6px, +12px: the dots shoved along the throw's direction, a gap
    // opening where the card will land, drawn as a second screen layer
    // clipped away from the card's footprint), the card flies in through
    // the gap (1–5 u, the throw) and slaps down, and the screen shuts behind
    // it: two cuts back (−6, 0) at 5–6 u and the card is now UNDER the
    // screen (the screen over the card at 0.3, the title still readable).
    // Out: the screen opens, the card is snatched, the screen shuts. Bar: the
    // well's screen slips aside in two cuts, the slab is shoved in, the
    // screen shuts over it. Button: press at 7 u = the button's screen opens
    // (one cut), the key cap drops, the screen shuts over it (one cut).
    {
        key: 'tear',
        name: 'The screen tears aside for the card',
        see: 'The board’s halftone screen is shoved aside in two hard cuts, the dots dragged along the throw’s line and a gap opening where the card will land; the card flies in through the gap and slaps down; and the screen shuts behind it in two cuts, so the card lies under the halftone, printed into the board. Held, then the screen opens, the card is snatched, the screen shuts. As a progress bar, the well’s screen slips aside, the slab is shoved in, the screen shuts over it. As a button press, the button’s screen opens a cut, the key cap drops, the screen shuts over it.',
        follows:
            'The board makes room for what arrives and closes over it: a card, a menu, a toast come in through a tear in the screen and lie under it; a live update is the screen opening and shutting over the changed figure; loading is a screen that keeps opening for a card that does not come; hover is the screen loosening at the control, the press shuts it; the leave is the screen opening and the card gone.',
        why: 'it makes the screen the board’s skin (it tears to let the card in and heals over it) and ends with the card printed into the board, which is the calling card as a halftone print on black; but the card ends under the dots and loses a touch of its white, and a screen that opens and shuts around every arrival is a lot of board moving for a toast.',
        caps: [
            'In its own scene: the screen tears aside, the card lands, the screen shuts',
            'As a progress bar: the well’s screen opens and shuts over the slab',
            'As a button press: the screen opens, the cap drops, it shuts',
        ],
        hero: `<div class="an-hero ph-c-hero" role="img" aria-label="A halftone screen over a dark board is shoved aside in hard cuts; a calling card flies in through the gap and the screen shuts over it"><div class="ph-c-stage">${a('', 'ph-c-screen ph-c-screen--under')}${card('ph-c-card an-a')}${a('', 'ph-c-screen ph-c-screen--over')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-c-bar', a('', 'ph-c-bar__over'))}</div>`,
        button: `<div class="an-btn"><span class="ph-c-btn">${button('Take it', 'an-press kp-button--primary ph-c-press', '', a('', 'ph-c-press__screen'))}</span></div>`,
    },
    // CSS: the card flies in (the throw, 0–4 u) and DRAGS the screen with
    // it: the board's halftone is displaced along the throw's line while
    // the card is in the air (background-position follows the card in 4
    // hard cuts, −12, −8, −4, 0 px as the card crosses, `steps(1)`), the dots
    // smeared in the card's wake (a second dot layer offset 3px, visible
    // only while the card moves), and at the slap the screen locks and the
    // wake is cut. Out: the wake returns and the screen is dragged back as
    // the card is snatched. Bar: the well's screen is dragged along by the
    // slab's shove in four cuts and locks at the stop. Button: press at 7 u
    // = the key cap drops and the button's screen is dragged one cut in the
    // drop's direction, locking.
    {
        key: 'drag',
        name: 'The throw drags the screen',
        see: 'The calling card flies in and the board’s halftone is dragged along in its wake: the dots shift in hard cuts in the throw’s direction while the card is in the air, a smear of dots behind it as a print smears when the sheet moves, and at the slap the screen locks and the smear is cut. Held, then the screen is dragged back as the card is snatched. As a progress bar, the well’s screen is dragged along by the slab’s shove and locks at the stop. As a button press, the key cap drops and the button’s screen is dragged one cut in the drop’s direction and locks.',
        follows:
            'Whatever moves drags the screen with it and the screen locks at the stop: a thrown card, a shoved slab, a dropped key cap, a slid bar; a live update is the changed figure dragging its screen a cut; loading is the screen dragged back and forth by cards that keep flying; hover is nothing, the press drags a cut; the leave drags the screen off.',
        why: 'it ties the shift to the motion itself (the screen moves because something moved over it, and locks when it stops), so every dead stop in the theme gets its lock; but a smear of dots following a moving thing reads as motion blur, which is the one effect print cannot have, and dots moving in cuts behind a flying card are close to cyberpunk’s jitter home.',
        caps: [
            'In its own scene: the card drags the screen, which locks at the slap',
            'As a progress bar: the screen dragged by the shove',
            'As a button press: the screen dragged one cut, locked',
        ],
        hero: `<div class="an-hero ph-d-hero" role="img" aria-label="A calling card flies in and drags the board's halftone screen along in hard cuts; the screen locks when the card slaps down"><div class="ph-d-stage">${a('', 'ph-d-screen')}${a('', 'ph-d-wake')}${card('ph-d-card an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-d-bar')}</div>`,
        button: `<div class="an-btn"><span class="ph-d-btn">${button('Take it', 'an-press kp-button--primary ph-d-press', a('', 'ph-d-press__screen'))}</span></div>`,
    },
    // CSS: the throw (0–4 u) and the slap; then, 4–7 u, the board's screen
    // shuffles under the landed card as a photocopier re-feeds the sheet:
    // three slips and returns (+4/0, −4/0, +2/0, `steps(1)`, 0.5 u each)
    // and a lock at 7 u, the card still; the card's own halftone (the dots
    // on its plate, `.ph-e-card .ph-e-dots` at 0.25) shuffles with it, so
    // card and board are one print being fed. Out: the shuffle (0–3 u), then
    // the card is snatched (3–7 u). Bar: the slab shoved, then the well's
    // screen shuffles three times and locks. Button: press at 7 u = the key
    // cap drops and its screen shuffles twice in the last unit and locks.
    {
        key: 'shuffle',
        name: 'Slapped down, the screen shuffles and locks',
        see: 'The calling card flies in and slaps down askew; then the board’s halftone shuffles under it, three slips and returns in hard cuts as a copier re-feeds a sheet, the card’s own faint dots shuffling with it, and locks: card and board one print, fed and settled. Held, then the shuffle and the card snatched. As a progress bar, the slab is shoved across and the well’s screen shuffles three times and locks. As a button press, the key cap drops and its screen shuffles twice and locks.',
        follows:
            'Everything that lands is fed through the screen after it lands (a card, a figure, a menu): the shuffle is the arrival’s second beat; a live update is one shuffle under the changed figure (the key figure’s and the tiles’ “halftone shuffles” picks); loading is the shuffle with nothing landing; hover is nothing, the press a shuffle; the leave shuffles then snatches.',
        why: 'it is the pick you already made for the key figure, the tiles and the header (the halftone shuffles) added to the throw, so the theme would carry both as picked; but the shuffle comes after the dead stop instead of at it, so the slap and the shuffle are two beats, and three slips and returns are the jitter home that cyberpunk owns, in dots.',
        caps: [
            'In its own scene: the slap, then the screen shuffles and locks',
            'As a progress bar: the slab, then the shuffle',
            'As a button press: the cap drops, the screen shuffles twice',
        ],
        hero: `<div class="an-hero ph-e-hero" role="img" aria-label="A calling card slaps down on a dark board; then the board's halftone screen shuffles under it in hard cuts and locks"><div class="ph-e-stage">${a('', 'ph-e-screen')}${card('ph-e-card an-a', a('', 'ph-e-dots'))}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-e-bar')}</div>`,
        button: `<div class="an-btn"><span class="ph-e-btn">${button('Take it', 'an-press kp-button--primary ph-e-press', a('', 'ph-e-press__screen'))}</span></div>`,
    },
];
