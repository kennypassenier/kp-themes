// Sepia's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Sepia is aged paper and warm brown ink
// (parchment, sienna, oxblood for the red entries; Instrument Serif italic
// for every title), a printed page that has aged well, unhurried on purpose.
// Kenny's own sentence for it (scope-25): "the ink spreading into the paper
// on a press and the rule that is thickest in the middle". Its register
// already has the ink stain on a press, the swelled rule, the burn leave,
// the dinkus bar, the open-book spinner; its picks are letterpress, the nib,
// the platen, stamps and foxing. Each candidate is one thing that happens
// to ink on paper: it spreads, a rule is drawn, the platen presses, a page
// turns, a dinkus is set, the paper burns, it foxes.
//
// The other themes' anchors steered clear of: formal's seal and signature
// (formal's round, next door: here nothing is sealed or signed; the ink is
// a liquid, the paper is old), blueprint's pen on a graticule (no nib draws
// a line here; the nib's strokes stay with the picks), solstice's embers
// (the burn is a page held to a candle, charring inward, and is not the
// recommendation), grotesk's rule under type (the swelled rule is a
// stroke with a hand's pressure in it, hairline at both ends).
//
// Implementation notes for options.css: see the comment above each
// candidate. The ink spread is the register's own device (feathered blots
// via an feTurbulence mask, `@property --kp-ink-spread`): the demo may
// re-declare a registered property of its own name (`--an-spread`) and draw
// the blot with radial gradients in `--primary` relative colours, feathered
// by an inline SVG filter in the hero's markup.

export const THEME = 'sepia';
export const LABEL = 'Sepia';
/** One unit of the clock, ms: sepia is unhurried; its hand curve is `--kp-hand` (0.785, 0.135, 0.15, 0.86). */
export const UNIT = 130;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A page of the book: popover paper, an italic serif title, two lines of text. */
const page = (cls = '', inner = '') =>
    `<div class="se-page ${cls}"><p class="se-page__title">Of the pump house</p><p class="se-page__line">The flow stood at 1 284 litres the minute, the pressure steady.</p><p class="se-page__line se-page__line--short">Entered the ninth of October.</p>${inner}</div>`;

/** Sepia's own progress bar: a dotted track, a 3 px sienna rule over a hairline clipped to the value, a diamond at its head. */
const bar = (cls, extra = '') =>
    `<div class="se-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="se-bar__track">${a('clip', 'se-bar__fill')}<span class="se-bar__head an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is sepia’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how sepia loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, blueprint its tracing pen. Each candidate below is only what sepia’s world already owns (old paper, brown ink, the press, the book), and each is told apart from the other themes’ anchors, formal’s seal next door first of all.';
export const LOOK =
    'Seven candidates for sepia’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is sepia to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: a drop of sienna ink (`.se-i-blot`, four offset radial blots in
    // `--primary` relative colours, `mix-blend-mode: multiply`, feathered by
    // an SVG filter `#se-feather` (feTurbulence + feDisplacementMap) declared
    // once in the hero's markup) lands on the page at the title's end at 1 u
    // and spreads into the paper over 5 u on cubic-bezier(0.2, 0.7, 0.3, 1)
    // (the register's spread-in): scale 0.2 → 1 and its alpha 0.9 → 0.55 as
    // it feathers; the title's ink darkens a shade under it (color →
    // `--accent-foreground`). Out: the stain draws back into the drop on
    // `--kp-hand` (the register's settle). Bar: the fill is ink soaking along
    // the dotted track: a clip block whose leading edge is feathered (a mask
    // gradient over the last 1.5rem), 7 u on the spread curve. Button: press
    // at 7 u = the register's own stain: blots grow from the press point
    // (centre) 12px past the button in the last unit (`--an-spread` 0 → 1),
    // held, and settle slowly on the out.
    {
        key: 'ink',
        name: 'The ink spreads into the paper',
        see: 'A page with a title. A drop of brown ink lands at the end of the title and spreads into the paper fibres, feathered and uneven the way ink spreads into old paper, and the title’s ink darkens under it; the stain is left. Held, then the ink draws back into its drop. As a progress bar, the rule is ink soaking along the dotted track, its front edge feathered. As a button press, the stain sepia’s buttons already leave: ink spreads from the press point past the button and settles slowly after the finger lifts.',
        follows:
            'Everything is ink meeting paper: an arrival is the figure soaking in (it comes up out of the paper darkening, not sliding), a live update is a fresh drop on the changed figure, loading is ink spreading and drawing back (the columns’ blot, the chart’s foxing already say it), hover is the ink a shade wetter, the press the stain, the leave the ink drawing back into the paper until the page is bare.',
        why: 'it is Kenny’s own sentence for the theme (“the ink spreading into the paper on a press”), it is already in the register on every button and in the picks for the columns, the key figure and the busy table, it is a liquid and not a line (so it is nothing of blueprint’s pen, grotesk’s rule or formal’s seal next door), and it gives arrival, loading, live, press and leave from one act.',
        caps: [
            'In its own scene: a drop of ink spreads into the page',
            'As a progress bar: ink soaks along the track',
            'As a button press: the stain spreads from the press point',
        ],
        hero: `<div class="an-hero se-i-hero" role="img" aria-label="A drop of brown ink lands at the end of a title and spreads into the paper"><svg class="se-i-defs" aria-hidden="true" width="0" height="0"><filter id="se-feather" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="7" /></filter></svg>${page('se-i-page', a('', 'se-i-blot'))}</div>`,
        bar: `<div class="an-bar">${bar('se-i-bar')}</div>`,
        button: `<div class="an-btn"><span class="se-i-btn">${button('Enter the reading', 'an-press se-i-press', a('', 'se-i-stain'))}</span></div>`,
    },
    // CSS: the swelled rule (`.se-r-rule`, an SVG path or a CSS mask: a 6rem
    // stroke that is 0.5px at both ends and 3px in the middle, the register's
    // `--kp-swell`) is drawn left to right under the title over 6 u on
    // `--kp-hand` (clip block); out: drawn back. Bar: the fill IS the swelled
    // stroke growing: the mask stretches with the clip so the thick middle
    // stays in the middle of what is drawn (an SVG with
    // preserveAspectRatio="none" scaled by the scale block). Button: press at
    // 7 u = a short swelled stroke (2.4rem) is drawn under the label in the
    // last unit, face `--card`.
    {
        key: 'rule',
        name: 'The rule that is thickest in the middle',
        see: 'A title on the page. Under it a rule is drawn by hand from the start: a hairline where the pen touches, swelling to 3 px in the middle where the hand presses, thinning to a hairline where it lifts; the swelled rule every sepia heading and divider already carries. Held, then drawn back. As a progress bar, the rule itself is the fill, its swell in the middle of what is drawn. As a button press, a short swelled stroke is drawn under the label.',
        follows:
            'Every rule, underline, frame and edge is drawn with a hand’s pressure in it (hairline ends, a swell): hover underlines the control with the stroke, the press draws it heavier, an arrival is the part’s rule drawn in, a live update is the changed figure underlined again, loading is a stroke drawn and lifted, the leave is the stroke drawn back.',
        why: 'it is Kenny’s other sentence for the theme and the register’s strongest static mark (every divider and heading rule), and a stroke with pressure in it is nothing of grotesk’s even baseline or blueprint’s plotter line; but it is a line being drawn, and lines being drawn are the anchor of two finished themes already, so sepia would stand in that company by its hand only, where the ink is sepia’s alone.',
        caps: [
            'In its own scene: the swelled rule drawn under the title',
            'As a progress bar: the stroke itself is the fill',
            'As a button press: a short stroke under the label',
        ],
        hero: `<div class="an-hero se-r-hero" role="img" aria-label="A swelled rule, hairline at both ends and thick in the middle, is drawn by hand under a title">${page('se-r-page se-page--one', a('clip', 'se-r-rule'))}</div>`,
        bar: `<div class="an-bar">${bar('se-r-bar', a('scale', 'se-r-bar__swell'))}</div>`,
        button: `<div class="an-btn"><span class="se-r-btn">${button('Enter the reading', 'an-press se-r-press', '', a('clip', 'se-r-stroke'))}</span></div>`,
    },
    // CSS: the platen presses the page: the page scales 1.03 → 1 and a blind
    // impression appears (inset shadow `inset 0 1px 2px ink/0.35, inset 0 -1px
    // 0 paper`) over 2 u (3–5 u) with a dead stop (cubic-bezier(0.4, 0, 1,
    // 1)); the title goes from a blind impression (text-shadow emboss,
    // colour = paper a shade darker) to inked (`--foreground`) at the press,
    // with a speckle (a dotted mask at 8 %) left in the ink; a shadow of the
    // platen (`.se-p-platen`, a wide pale plate above the page) comes down
    // 0–3 u and lifts 5–7 u. Bar: the fill is pressed in segment by segment?
    // No: the fill is pressed in once at 4 u (scale 1 0 → 1 1 with the
    // emboss) after growing blind 0–4 u. Button: press at 7 u = the face is
    // pressed in (inset shadow, the label a shade darker and 1px down).
    {
        key: 'platen',
        name: 'Pressed by the platen',
        see: 'The platen comes down over the page and presses: the title, which stood as a blind impression, takes the ink with the speckle of a letterpress bite, the page gives a hair under the press and stops dead, and the platen lifts. Held, then the platen presses once more and lifts the ink out. As a progress bar, the rule grows blind and is pressed into ink at once. As a button press, the face is pressed into the paper: a bite at its edge, the label a shade darker.',
        follows:
            'Everything printed is pressed (the chart, the calendar, the menu and the tiles already say “pressed”): an arrival is a blind impression inked by the press, a live update the changed figure pressed again, loading the platen coming down and lifting on an empty line, hover the platen a hair closer (the paper warms), the press the bite, the leave the ink lifted out and the paper bare.',
        why: 'it is the picture Kenny picked most often for sepia (pressed, letterpress, the platen: chart, calendar, menu, trend, key figure, state) and a bite with a dead stop is unlike formal’s seal that drops and lifts or titanium’s engraving; but a thing pressed into paper is seen in the result and hardly in the motion (a 3 % scale and a shadow), so on a phone it reads as a fade with a bump.',
        caps: [
            'In its own scene: the platen presses, the title takes the ink',
            'As a progress bar: the rule pressed into ink',
            'As a button press: the face bitten into the paper',
        ],
        hero: `<div class="an-hero se-p-hero" role="img" aria-label="A platen comes down over a page and presses a blind title into brown ink, then lifts"><div class="se-p-stage">${a('', 'se-p-platen')}${page('se-p-page an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('se-p-bar')}</div>`,
        button: `<div class="an-btn"><span class="se-p-btn">${button('Enter the reading', 'an-press se-p-press')}</span></div>`,
    },
    // CSS: a leaf turns down from the top edge: the page rotates
    // `perspective(700px) rotateX(-85deg)` → 0 from `transform-origin: 50% 0`
    // over 6 u on `--kp-hand`, with the curl's shadow (`drop-shadow(0 8px 5px
    // ink/0.35)`) fading as it lies flat (the register's size-turn); the back
    // of the leaf is paper a shade darker. Out: lifted the same way. Bar: the
    // fill turns in as a leaf from the hairline (rotateX from the top, scaled
    // by the clip, 7 u). Button: press at 7 u = the face turns a few degrees
    // (rotateX 14deg from the top edge, the label on it) and lies flat on
    // release.
    {
        key: 'leaf',
        name: 'The page turns',
        see: 'A leaf of the book turns down from its top edge, its curl casting a shadow on the page under it, and lies flat: the next page. Held, then lifted the same way. As a progress bar, the rule turns in from the hairline like a leaf. As a button press, the face turns a few degrees from its top edge under the finger and lies flat when it lifts.',
        follows:
            'Everything arrives by a page turning (the dialog, a toast, a tile, a new line in a growing box, which already turns so) and leaves by the leaf lifted; loading is the book’s pages leafed through (the spinner already leafs); a live update is the changed figure’s leaf turned once; hover lifts the leaf’s corner, the press turns it.',
        why: 'it is the book, sepia’s one object (the spinner is an open book, a new line already turns down as a leaf), and no finished theme turns a page; but a leaf turning is a 3-D move on a flat theme, it needs a top edge to turn from (so a figure, a rule or a dot cannot turn), and on a button it is a tilt where the ink stain says “pressed” in sepia’s own words.',
        caps: [
            'In its own scene: the leaf turns down and lies flat',
            'As a progress bar: the rule turns in as a leaf',
            'As a button press: the face turns under the finger',
        ],
        hero: `<div class="an-hero se-l-hero" role="img" aria-label="A leaf of the book turns down from its top edge and lies flat"><div class="se-l-stage">${page('se-l-page an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('se-l-bar')}</div>`,
        button: `<div class="an-btn"><span class="se-l-btn">${button('Enter the reading', 'an-press se-l-press')}</span></div>`,
    },
    // CSS: three sienna diamonds (`.se-d-dinkus i`, clip-path rhombi, 0.55em)
    // are set one by one under the title, the middle one first then the
    // outer two, each landing from scale 1.6 at 0 opacity in one quick move
    // (0.8 u each, `--kp-hand`), 2.5–5.5 u; the title's first letter takes
    // the sienna at 6 u. Bar: the register's busy dinkus: the three diamonds
    // slide along the dotted track to the head position over 7 u and sit as
    // the head. Button: press at 7 u = a ◆ is set beside the label (scale
    // 1.6 → 1, last unit), face `--card`.
    {
        key: 'dinkus',
        name: 'The dinkus is set',
        see: 'A title on the page, and under it the printer’s ornament: three sienna diamonds set one after the other, the middle one first, each dropped into place from a little above; the title’s initial takes the sienna as the last is set. Held, then taken up in reverse. As a progress bar, the three diamonds slide along the dotted track, the way sepia’s busy bar already runs, and sit as the head. As a button press, a diamond is set beside the label.',
        follows:
            'Every section, every finished thing, every chosen row is marked by the ornament (the alt divider already carries a ◆, the sidenav submenu, the progress head); an arrival ends with its dinkus set, a live update re-sets it, loading is the dinkus travelling (the busy bar), hover shows the first diamond, the press sets it, the leave takes the ornaments up.',
        why: 'it is typographic furniture no other theme owns (deco’s lozenge is a jewel, not a printer’s ornament) and it is already the busy bar; but an ornament is set after a thing is done, so it says “finished” and little else, it is small, and on a plate or a chart it is decoration rather than the motion of the plate itself.',
        caps: [
            'In its own scene: three diamonds set under the title',
            'As a progress bar: the dinkus runs the track',
            'As a button press: a diamond set beside the label',
        ],
        hero: `<div class="an-hero se-d-hero" role="img" aria-label="Three sienna diamonds are set one by one under a title">${page('se-d-page se-page--one', '<span class="se-d-dinkus" aria-hidden="true"><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i></span>')}</div>`,
        bar: `<div class="an-bar">${bar('se-d-bar', a('', 'se-d-bar__dinkus'))}</div>`,
        button: `<div class="an-btn"><span class="se-d-btn">${button('Enter the reading', 'an-press se-d-press', '', a('', 'se-d-mark'))}</span></div>`,
    },
    // CSS: the register's burn, reversed for an arrival: the page starts
    // charred (inset box-shadow `inset 0 0 40px 60px var(--foreground)`,
    // opacity 1 held) and the char draws back to the edges (40 %: sienna glow
    // + hairline, 100 %: none) over 6 u ease-out; out: the burn itself (the
    // register's 700 ms, ease-in). Bar: the fill is uncharred from the start.
    // Button: press at 7 u = the face chars at its edge for the last unit
    // (inset sienna glow 8px) and holds a hairline of char.
    {
        key: 'burn',
        name: 'Burned at the edge',
        see: 'A page held to a candle: it arrives out of its own char, the black drawing back from the middle to the edges until a hairline of brown is left, and leaves by burning inward until nothing is left, the way everything in sepia already leaves. As a progress bar, the rule is uncharred from the start. As a button press, the face chars at its edge under the finger and keeps a hairline of it.',
        follows:
            'Every leave burns and every arrival is the burn drawn back (the register already says so); loading is a page charring and recovering; a live update is the changed figure singed at its edge; hover is a warm edge; the press the char. One picture in both directions.',
        why: 'it is already sepia’s leave, Kenny picked it over eight rounds, and nothing else in the set burns; but a burn is a loss: a figure that arrives out of its own char says it was nearly lost, and on every hover and press a singed edge is a warning, so it is the right leave and the wrong anchor, and solstice’s embers sit next to it.',
        caps: [
            'In its own scene: the page comes out of its char',
            'As a progress bar: the rule uncharred',
            'As a button press: the face singed at the edge',
        ],
        hero: `<div class="an-hero se-b-hero" role="img" aria-label="A page arrives out of its own char, the black drawing back to the edges">${page('se-b-page an-a')}</div>`,
        bar: `<div class="an-bar">${bar('se-b-bar')}</div>`,
        button: `<div class="an-btn"><span class="se-b-btn">${button('Enter the reading', 'an-press se-b-press')}</span></div>`,
    },
    // CSS: foxing: age spots (`.se-f-spots`, 7 radial blots of ochre/sienna
    // at 25 %, multiply) bloom across the page one after another 0–5 u
    // (each scale 0 → 1, 0.8 u, staggered) and the title's ink comes up
    // from `--muted-foreground` to `--foreground` as if the page were read
    // through them; held with the spots; out: the spots fade back, the title
    // greys. Bar: the fill arrives foxed (spots on the track) then clean.
    // Button: press at 7 u = a spot blooms at the press point (centre) in the
    // last unit, face `--card`.
    {
        key: 'foxed',
        name: 'The page foxes',
        see: 'A page ages before you: spots of ochre and sienna bloom across it one after another, the foxing of old paper, and the title’s ink darkens with age as they come; the spots stay. Held, then they fade and the page is young again. As a progress bar, the rule arrives on a foxed track. As a button press, one spot blooms under the finger.',
        follows:
            'Age is the theme’s texture: an arrival ages into place, loading is a page foxing and clearing (the chart already loads so), a live update foxes the changed figure once, hover is a warm spot under the pointer, the press a spot, the leave the spots gone and the paper bare.',
        why: 'it is the one picture that is only sepia’s (no other theme ages) and Kenny picked it for the chart’s loading; but foxing is a stain of neglect, not a mark a hand makes, it is slow to read on a small part, and it says “waiting” better than it says “here” or “pressed”.',
        caps: [
            'In its own scene: the page foxes, the ink ages',
            'As a progress bar: the rule on a foxed track',
            'As a button press: a spot under the finger',
        ],
        hero: `<div class="an-hero se-f-hero" role="img" aria-label="Spots of ochre and sienna bloom across a page one after another">${page('se-f-page', '<span class="se-f-spots" aria-hidden="true"><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i></span>')}</div>`,
        bar: `<div class="an-bar">${bar('se-f-bar', a('', 'se-f-bar__spots'))}</div>`,
        button: `<div class="an-btn"><span class="se-f-btn">${button('Enter the reading', 'an-press se-f-press', a('', 'se-f-spot'))}</span></div>`,
    },
];
