// Phantom's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Phantom is the calling card: black,
// white and one violent red, cut paper, a halftone screen, Barlow Condensed
// 900 italic capitals, everything skewed -8°, shadows hard and offset,
// nothing glows and nothing eases that is not cut (`--kp-cut`), shoved
// (`--kp-shove`) or snapped. "Cyberpunk emits light; phantom is print."
// Its register already has the red bar that slides behind every pointed-at
// item, the skewed key-cap button that drops onto its deep-red shadow, the
// slanted progress bar with its white shard, the star that snaps, the
// stamp-slammed tick; its picks are cards thrown, stamps, red string, the
// slash, the halftone shifted. Each candidate is one thing the Phantom
// Thieves do: throw the card, slide the red bar, slash it, pull the string,
// shift the screen, stamp it, snap the star.
//
// The other themes' anchors steered clear of, above all, GROTESK: its red
// plate that falls into register on skeleton text is finished, so phantom's
// off-register second plate (the deep red copy 3 px off) is NEVER the
// anchor here and no candidate brings two plates into register; cyberpunk's
// glitch and jitter (phantom cuts and slaps, it never shivers in ticks);
// brutalism's slab and shadow (phantom's shadow is deep red and its box is
// skewed and thrown, never dropped onto a footprint).
//
// Implementation notes for options.css: see the comment above each
// candidate. The card is white, skewed -8°, with a 6px deep-red hard
// shadow (`--kp-red-deep`), its title in 900 italic caps; the red is
// `--primary` as a plate with black ink; motion ends in a dead stop.

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

/** A line of capitals with the red bar behind it: the white text, the bar, and a black copy of the text clipped to the bar's shape, so the ink flips exactly where the red passes. */
const ink = (cls, text) =>
    `<p class="${cls}"><span class="an-a ph-r-text">${text}</span>${a('', 'ph-r-bar')}<span class="an-a ph-r-ink" aria-hidden="true">${text}</span></p>`;

/** Phantom's own progress bar: a skewed black halftone well, a red fill cut at a diagonal, a white shard at the cut. */
const bar = (cls, extra = '') =>
    `<div class="ph-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="ph-bar__well">${a('clip', 'ph-bar__fill')}<span class="ph-bar__shard an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is phantom’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how phantom loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, cyberpunk its glitch. Each candidate below is only what phantom’s world already owns (the calling card, cut paper, the red plate, the halftone, the evidence board), and each is told apart from the other themes’ anchors, grotesk’s plate falling into register and cyberpunk’s glitch first of all.';
export const LOOK =
    'Seven candidates for phantom’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is phantom to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the card is thrown in from off the stage's start: translate
    // -120% 30% rotate(-22deg) scale(1.15) → 0 0 rotate(-1.5deg) scale(1)
    // over 4 u on `--kp-shove` (it flies, turns, slaps down with a dead stop),
    // its deep-red shadow appearing at the stop (drop-shadow 0 0 → 6px 6px)
    // and the stage's halftone jolting 2px at the slap (a 1-frame translate on
    // the stage at 4 u); the title is on the card from the start. Out: snatched
    // off the way it came. Bar: the red slab is shoved across the well and
    // slaps to the value (translate -105% → 0 on `--kp-shove`, 5 u, the busy
    // shove), the shard lands at the cut. Button: press at 7 u = the register's
    // press: the key cap drops onto its deep-red shadow (translate 5px 5px,
    // shadow gone) in one cut, held.
    {
        key: 'thrown',
        name: 'The card is thrown',
        see: 'The calling card comes flying in from off the stage, turning as it flies, and slaps down on the board with a dead stop, a degree and a half askew on its deep-red shadow; the board jolts under it. Held, then it is snatched off the way it came. As a progress bar, the red slab is shoved across the well and slaps to the value with the white shard at its cut. As a button press, the key cap drops onto its shadow in one cut, as phantom’s buttons already do.',
        follows:
            'Everything arrives thrown and leaves snatched (the tiles’, the busy table’s and the graph’s picks already say “thrown”, “pinned”, “snatched off the board”); loading is a card thrown and snatched, again and again; a live update is the changed figure slapped down again; hover tilts the card a degree, the press slaps it flat; a menu is dealt from the deck.',
        why: 'it is the calling card itself, the one object the theme is named for and already draws (the intro, the dialog, the tooltip, the toast are all thrown or shoved cards), it gives every state a throw or a slap with a dead stop and nothing glows, shivers or eases in it, and no finished theme throws: brutalism drops onto a footprint, grotesk falls into register, cyberpunk tears; phantom deals.',
        caps: [
            'In its own scene: the card flies in, slaps down askew',
            'As a progress bar: the slab shoved across, the shard at the cut',
            'As a button press: the key cap drops onto its shadow',
        ],
        hero: `<div class="an-hero ph-t-hero" role="img" aria-label="A white calling card flies in from the side, turning, and slaps down askew on a dark halftone board"><div class="ph-t-stage an-a">${card('ph-t-card an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-t-bar')}</div>`,
        button: `<div class="an-btn"><span class="ph-t-btn">${button('Take it', 'an-press kp-button--primary ph-t-press')}</span></div>`,
    },
    // CSS: the red parallelogram (`.ph-r-bar`, `--primary`, skewX(-16deg))
    // slides out from behind the title from its start: width 0 → 106 % over
    // 3 u on `--kp-cut` (the register's hover bar), and the title's ink flips
    // to black as the bar passes under it (a clipped black copy of the title
    // in step with the bar); the line below follows 1 u later with its own
    // bar. Out: the bars slide back. Bar: the fill is the red parallelogram
    // sliding across the skewed well (the clip on `--kp-cut`, 5 u). Button:
    // press at 7 u = the register's fill: the red bar fills the outline button
    // from its start in one cut and the label flips black.
    {
        key: 'redbar',
        name: 'The red bar slides behind it',
        see: 'A title in white capitals on the black board. A red parallelogram slides out from behind it from the start, cut at phantom’s slant, and the capitals flip to black as the red passes under them; the line below gets its own bar a beat later. Held, then the bars slide back and the ink is white again. As a progress bar, the fill is the red parallelogram sliding across the well. As a button press, the red bar fills the button from its start in one cut and the label flips black, as phantom’s buttons already do.',
        follows:
            'Pointing is the red bar (every nav link, tab, footer link and button already does it), the press fills it, what is chosen keeps it, an arrival is the title revealed as the bar slides out and back, a live update is the bar sliding under the changed figure once, loading is a bar sliding with no words on it yet, the leave is the bar sliding over the words and taking them.',
        why: 'it has the widest reach of anything in the register (nav, tabs, footer, buttons, sidenav), it is one idea and uniquely phantom’s, and a plate sliding under ink that flips is print, not light; but it is a state under the pointer first, so a dialog, a chart or a card needs the card thrown to arrive, and the thrown card then decides more of the theme than the bar.',
        caps: [
            'In its own scene: the red bar slides behind the title, the ink flips',
            'As a progress bar: the red parallelogram slides across',
            'As a button press: the bar fills the button in one cut',
        ],
        hero: `<div class="an-hero ph-r-hero" role="img" aria-label="A red parallelogram slides out from behind a title in white capitals and the capitals flip to black"><div class="ph-r-stage">${ink('ph-r-title', 'Pump house three')}${ink('ph-r-line', 'Flow 1 284 l/min')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-r-barp')}</div>`,
        button: `<div class="an-btn"><span class="ph-r-btn">${button('Take it', 'an-press ph-r-press')}</span></div>`,
    },
    // CSS: a red slash (`.ph-s-slash`, a 0.6rem band at -32deg across the
    // card, `--primary`) cuts across the card from top-end to foot-start in
    // 2 u on `--kp-cut` (clip along its own length), and behind the cut the
    // card is torn in at an angle: the card's clip-path is a jagged diagonal
    // edge (polygon) that sweeps from the slash's line across the card 2–5 u
    // (the chart's "torn in at an angle"), the slash itself staying as the
    // corner slash the cards carry. Out: the tear closes, the slash is cut
    // back. Bar: the fill's diagonal cut (the register's) sweeps across with
    // a slash at its head. Button: press at 7 u = a red slash cuts across the
    // face corner to corner in the last unit (clip, `--kp-cut`), label black
    // where the slash passes? No: label stays white; the slash passes behind.
    {
        key: 'slash',
        name: 'Slashed: torn in at an angle',
        see: 'A red slash cuts across the black board in one stroke, and behind the cut the calling card is torn in: a jagged diagonal edge sweeps across from the slash and the card is there, the slash left on its corner. Held, then the tear closes and the slash is cut back. As a progress bar, the diagonal cut sweeps the well with a slash at its head, as phantom’s bar is already cut. As a button press, a red slash cuts across the face corner to corner.',
        follows:
            'Everything is cut in and cut out (the chart arrives torn in, the calendar loads under a red cut, the skeleton is slashed: all picked); a live update is one slash across the changed figure; hover is the slash’s edge at the corner, the press the slash across; loading is the slash cutting again and again; the leave is the tear closing.',
        why: 'it is the hero’s red slash silhouette and the corner slash every card carries, so it is already the theme’s mark, and a cut is print (a knife, cut paper) where cyberpunk’s tear is light; but a slash is violent on every press and every hover, it hides what it cuts for a beat, and a diagonal reveal behind a jagged edge is cyberpunk’s bands torn in with the colours swapped.',
        caps: [
            'In its own scene: the slash, then the card torn in',
            'As a progress bar: the cut sweeps with a slash at its head',
            'As a button press: a slash across the face',
        ],
        hero: `<div class="an-hero ph-s-hero" role="img" aria-label="A red slash cuts across a dark board and a calling card is torn in behind a jagged diagonal edge"><div class="ph-s-stage">${card('ph-s-card an-a')}${a('', 'ph-s-slash')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-s-bar', a('', 'ph-s-bar__slash'))}</div>`,
        button: `<div class="an-btn"><span class="ph-s-btn">${button('Take it', 'an-press ph-s-press', '', a('', 'ph-s-press__slash'))}</span></div>`,
    },
    // CSS: a red pin (`.ph-p-pin`, a 0.9rem red disc with a black centre and
    // a 2px deep-red shadow) is pushed into the board at the stage's start
    // corner in one cut at 1 u (scale 1.8 → 1); a red string (`.ph-p-string`,
    // a 2px `--primary` line, rotated to run from the pin to the card's
    // corner) is pulled taut from the pin over 3 u on `--kp-cut` (scaleX
    // 0 → 1 from the pin, with a 3px sag that snaps straight at the end:
    // rotate +4deg → 0 at 4 u), and the card is pinned at its end at 4 u (a
    // second pin, scale 1.8 → 1) with a jolt (translate 2px for 1 frame).
    // Out: the string goes slack and is pulled back, the pins out. Bar: a
    // red string is pulled across the well from a pin at the start to the
    // shard (the fill as string, 5 u). Button: press at 7 u = a pin is pushed
    // into the button's corner in one cut, face pressed.
    {
        key: 'string',
        name: 'Pinned with red string',
        see: 'The evidence board. A red pin is pushed into the corner; a red string is pulled from it across the board, sagging as it comes, and snaps taut as the calling card is pinned at its end with a jolt: a lead on the board. Held, then the string goes slack and is pulled back, the pins come out. As a progress bar, a string is pulled across the well from a pin to the shard. As a button press, a pin is pushed into the button’s corner.',
        follows:
            'Everything is pinned and strung (the graph’s tags and string, the menu’s string pulled, the key figure’s string that twangs, the state word pinned: all picked); an arrival is pinned at a string’s end, loading is a string pulled and pulled again (the menu), a live update is the string twanged at the changed figure, hover is the pin glinting, the press pushes it in, the leave pulls the pin and the string goes slack.',
        why: 'it is the evidence board of the picks (string, pins, tags, targets) made into one gesture, it is cut paper and thread and nothing of cyberpunk’s or grotesk’s; but it brings two objects (a pin and a string) to everything that moves, which is a lot of board on a toast or a menu, and a line pulled taut across a surface is blueprint’s pen and forest’s walked trail in red.',
        caps: [
            'In its own scene: the pin, the string pulled taut, the card pinned',
            'As a progress bar: a string pulled to the shard',
            'As a button press: a pin pushed into the corner',
        ],
        hero: `<div class="an-hero ph-p-hero" role="img" aria-label="A red pin is pushed into a board, a red string is pulled from it and a calling card is pinned at its end with a jolt"><div class="ph-p-stage">${a('', 'ph-p-pin ph-p-pin--start')}${a('', 'ph-p-string')}${card('ph-p-card an-a', a('', 'ph-p-pin ph-p-pin--card'))}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-p-bar', `${a('', 'ph-p-bar__pin')}${a('scale', 'ph-p-bar__string')}`)}</div>`,
        button: `<div class="an-btn"><span class="ph-p-btn">${button('Take it', 'an-press ph-p-press', '', a('', 'ph-p-press__pin'))}</span></div>`,
    },
    // CSS: the board's halftone screen (`.ph-h-screen`, the register's 7px
    // dot grid at 0.55 over black) is shifted one dot-step sideways and back
    // in hard cuts (`steps(1)`, 4 cuts over 1–4 u: +4px, -3px, +2px, 0, a
    // slipping photocopy) as the card is laid under it (the card's clip
    // inset 0 100% → 0 at 2 u in one cut); at 4 u the screen locks and the
    // card's title ink goes from halftone-grey to white. Out: the screen
    // slips again and the card is cut out. Bar: the well's halftone shifts a
    // step as the fill cuts in. Button: press at 7 u = the button's halftone
    // (a dot grid over the face) shifts one step and locks, face pressed.
    {
        key: 'halftone',
        name: 'The halftone shifts',
        see: 'The board’s dot screen slips: it shifts one dot-step sideways and back in hard cuts, a photocopy slipping in the machine, as the calling card is laid under it, and locks with the card’s title in full white. Held, then it slips again and the card is cut out. As a progress bar, the well’s halftone shifts a step as the fill cuts in. As a button press, the button’s dot screen shifts one step and locks.',
        follows:
            'Every surface has the screen (the page, the hero, the well, the skeleton, the backdrop), so the screen slipping and locking is every arrival, every hover (the menu’s pick: hover shifts the halftone, the press locks it), every live update (the key figure’s and the tiles’ picks: the halftone shuffles), loading the screen slipping and slipping (the header’s pick); the leave is the screen slipping the card away.',
        why: 'it is phantom’s texture made into its motion and Kenny picked it for the menu, the key figure, the tiles and the header, and a screen slipping in hard cuts is print and not light; but a few pixels of dot grid shifting is subtle on a phone and under a thumb, and a copy that slips sideways in ticks is a hair from cyberpunk’s jitter home, which Kenny keeps at arm’s length.',
        caps: [
            'In its own scene: the screen slips, the card is laid under it, locks',
            'As a progress bar: the halftone shifts as the fill cuts in',
            'As a button press: the screen shifts a step, locks',
        ],
        hero: `<div class="an-hero ph-h-hero" role="img" aria-label="A halftone dot screen over a dark board slips sideways in hard cuts as a calling card is laid under it, then locks"><div class="ph-h-stage">${card('ph-h-card an-a')}${a('', 'ph-h-screen')}</div></div>`,
        bar: `<div class="an-bar">${bar('ph-h-bar', a('', 'ph-h-bar__screen'))}</div>`,
        button: `<div class="an-btn"><span class="ph-h-btn">${button('Take it', 'an-press ph-h-press', a('', 'ph-h-press__screen'))}</span></div>`,
    },
    // CSS: a red stamp ring (`.ph-m-stamp`, a 3rem ring of 3px `--primary`
    // with "TAKEN" in 0.7rem 900 italic caps inside, rotated -12deg) is
    // slammed onto the card: scale(2.6) rotate(-18deg) opacity 0 → scale(0.86)
    // → 1.08 → 1 (the checkbox's `stick`), 3 u on the register's two curves,
    // at 3–6 u, after the card is cut in at 1 u in one cut; the card jolts
    // 2px at the slam. Out: the stamp lifts. Bar: a stamp ring lands at the
    // head when the fill lands (5–7 u). Button: press at 7 u = a small stamp
    // ring is slammed beside the label (scale 2.2 → 1, last unit), face
    // pressed.
    {
        key: 'stamped',
        name: 'Stamped askew',
        see: 'The calling card is cut in, then a red stamp ring is slammed onto it askew, TAKEN inside it in italic capitals: it comes down from large, bites, bounces a hair and sticks, and the card jolts under it. Held, then the stamp lifts and the card is cut out. As a progress bar, a stamp ring lands at the head when the fill lands. As a button press, a small stamp ring is slammed beside the label.',
        follows:
            'What is done is stamped (the chart’s, the trend’s, the calendar’s, the key figure’s and the state word’s picks all stamp); an arrival ends with its stamp, a live update re-stamps the changed figure, loading is a stamp slammed again and again (the trend’s pick), hover is a faint ring (the header’s pick), the press slams it, the leave lifts the stamp and cuts the card out.',
        why: 'it is already the tick in the register (slammed on with the same bite and bounce) and the picks reach for a stamp six times, and a stamp ring slammed askew with a word in it is the Phantom Thieves’ mark; but a stamp is brutalism’s, formal’s and sepia’s device as well (askew, framed, red), so phantom would own it by its slant and its bounce only, and the bounce is the one overshoot in a theme that otherwise stops dead.',
        caps: [
            'In its own scene: the stamp slammed askew, the card jolts',
            'As a progress bar: a stamp lands at the head',
            'As a button press: a stamp beside the label',
        ],
        hero: `<div class="an-hero ph-m-hero" role="img" aria-label="A red stamp ring reading TAKEN is slammed askew onto a calling card">${card('ph-m-card an-a', a('', 'ph-m-stamp'))}</div>`,
        bar: `<div class="an-bar">${bar('ph-m-bar', a('', 'ph-m-bar__stamp'))}</div>`,
        button: `<div class="an-btn"><span class="ph-m-btn">${button('Take it', 'an-press ph-m-press', '', a('', 'ph-m-press__stamp'))}</span></div>`,
    },
    // CSS: a five-point star (`.ph-x-star`, a white star 3rem over a red
    // star offset 2px, the spinner's) snaps in 72° at a time at the card's
    // corner, five hard turns with holds (`steps(1)` between the five
    // rotations, 1 u each, 1–6 u, the register's `snap`), the card cut in at
    // 1 u; the star stops upright at 6 u. Out: it snaps back the other way.
    // Bar: the shard is a small star that snaps a fifth of a turn at each
    // fifth of the fill (`steps(5)` on the fill's clip). Button: press at
    // 7 u = a star snaps in at the button's corner in one cut (scale 2 → 1,
    // rotate 72deg → 0).
    {
        key: 'star',
        name: 'The star snaps',
        see: 'The calling card is cut in and a five-point star, white over red, snaps in at its corner: five hard turns of a fifth each, a hold between, and it stops upright. Held, then it snaps back the other way. As a progress bar, the shard is a small star that snaps a fifth of a turn at each fifth of the fill. As a button press, a star snaps in at the button’s corner in one cut.',
        follows:
            'The star is the mark of the thieves: loading is the star snapping round (the spinner already does), an arrival ends with its star snapped in, a live update is one fifth of a turn beside the changed figure, hover shows the star, the press snaps it, the leave snaps it out; the radio already slams one.',
        why: 'it is the spinner and the radio already, and a star that snaps in fifths is nobody else’s; but a star is an ornament and a small one, so a plate, a chart or a menu needs the thrown card to arrive, and a turning mark with holds reads like a loading spinner wherever it appears, which says “wait” on a press.',
        caps: [
            'In its own scene: the star snaps in at the corner',
            'As a progress bar: the star snaps at each fifth',
            'As a button press: a star snaps in at the corner',
        ],
        hero: `<div class="an-hero ph-x-hero" role="img" aria-label="A white five-point star over a red one snaps in at a calling card's corner, a fifth of a turn at a time">${card('ph-x-card an-a', a('', 'ph-x-star'))}</div>`,
        bar: `<div class="an-bar">${bar('ph-x-bar')}</div>`,
        button: `<div class="an-btn"><span class="ph-x-btn">${button('Take it', 'an-press ph-x-press', '', a('', 'ph-x-press__star'))}</span></div>`,
    },
];
