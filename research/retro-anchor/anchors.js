// Retro's candidates for its anchor element, UPDATE 1 (Kenny, 2026-10-08:
// "None of these, I want 3 more attempts at this, redesign it completely
// from the ground up, based on an old windows UI. It needs to feel really
// retro and oldschool. This theme has the potential to be one of the most
// distinct ones we have, so it needs to feel professionally done.")
//
// Round one drew mechanics (an outline zoom, a selection bar, a dither, a
// bevel) on a neutral window. This round draws 1995 itself: every scene is
// the desktop (teal ground, a taskbar with its Start button and clock, a
// window with its title-bar ramp, its menu bar File Edit View Help, its
// status bar), drawn in the chrome palette with the 16-colour feel the
// tokens allow, and the anchor is a MOMENT everyone who sat at that desktop
// remembers: the sheet of paper flying between two folders in the Copying
// dialog, the cards cascading when Solitaire is won, Defrag reading and
// writing its blocks, the Start menu sliding up, the error box with its
// ding, Minesweeper's face, the starfield screensaver, a window dragged by
// its outline. Nothing eases; everything moves in the whole frames of a
// 1995 machine (`steps()`), and every close is its open played backwards.
//
// The other themes' anchors steered clear of: terminal's block cursor and
// typed lines (the DOS prompt is not a candidate), nostromo's raster and
// CRT (no scanlines; this is a desktop on a monitor seen as pixels, not
// as phosphor), brutalism's slab (the bevel is 1995's, grey on grey),
// high-contrast's hard steps as signage (dropped in any case).
//
// Implementation notes for options.css: see the comment above each
// candidate. The window chrome is the register's own: `--kp-raised`,
// `--kp-pressed`, `--kp-sunken` bevel stacks, `--kp-ramp` for an active
// title bar, `--kp-groove-line`, `--kp-brush` (the 50 % dither),
// `--kp-dd-*`/`--kp-dm-*` densities, `--kp-drop-hard`. Chrome text (titles,
// menu bar, buttons, labels, dialog text) is set in 'Pixelify Sans' at
// 12–13 px (the bitmap sans of 1995; the body face stays for the page
// around the scenes); DOS text in `--kp-dos` (VT323). The 16-colour feel
// comes from the tokens and their relative colours only (DI9): teal
// `--kp-desktop`, navy `--primary`, chrome `--background`/`--card`/
// `--popover`, ink `--foreground`, yellow `--warning`, maroon
// `--destructive`, green `--success`, blue `--info`, purple `--chart-4`;
// a brighter red/green/blue is `hsl(from var(--destructive) h 100% 50%)`
// and the like. Icons (folder, sheet, computer, bin, cards, the smiley)
// are drawn with CSS boxes, borders and gradients on a 2 px grid, never
// an image.

export const THEME = 'retro';
export const LABEL = 'Retro';
/** One unit of the clock, ms: 1995 drew in frames of about 70 ms; the clock keeps whole frames. */
export const UNIT = 90;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** The 1995 desktop every hero stands on: teal ground, two icons at the top-left, the taskbar with its Start button and clock. */
const desktop = (cls = '', inner = '') =>
    `<div class="rt-desk ${cls}"><div class="rt-desk__icons" aria-hidden="true"><span class="rt-icon rt-icon--pc"><i></i><b>My Computer</b></span><span class="rt-icon rt-icon--bin"><i></i><b>Recycle Bin</b></span></div>${inner}<div class="rt-taskbar" aria-hidden="true"><span class="rt-start"><i></i>Start</span><span class="rt-taskbar__tray"><span class="rt-taskbar__clock">9:41 AM</span></span></div></div>`;

/** A 1995 window: raised bevel, a title bar (navy ramp, three controls), a menu bar, a body, a status bar. */
const win = (cls = '', title = 'Pump house 3', body = '<p>Flow: 1284 l/min</p><p>Pressure: steady</p>', menu = true) =>
    `<div class="rt-win ${cls}"><div class="rt-win__title"><span class="rt-win__sysicon" aria-hidden="true"></span><span>${title}</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div>${
        menu
            ? '<div class="rt-win__menu" aria-hidden="true"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></div>'
            : ''
    }<div class="rt-win__body">${body}</div><div class="rt-win__status" aria-hidden="true"><span>Ready</span><span class="rt-win__grip"></span></div></div>`;

/** A 1995 dialog box: no menu bar, a message with an icon, OK with the dotted focus rectangle. */
const dialog = (cls = '', title, icon, text, buttons = ['OK']) =>
    `<div class="rt-dlg ${cls}"><div class="rt-win__title"><span>${title}</span><span class="rt-win__controls rt-win__controls--one" aria-hidden="true"><i></i></span></div><div class="rt-dlg__body"><span class="rt-dlg__icon rt-dlg__icon--${icon}" aria-hidden="true"></span><p>${text}</p></div><div class="rt-dlg__buttons">${buttons
        .map((b, i) => `<span class="rt-btn${i === 0 ? ' rt-btn--default' : ''}">${b}</span>`)
        .join('')}</div></div>`;

/** Retro's own progress bar: a sunken well with navy blocks that fill whole, block by block. */
const bar = (cls, extra = '') =>
    `<div class="rt-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="rt-bar__well">${a('clip', 'rt-bar__blocks')}${extra}</span></div>`;

export const QUESTION = 'Which one element is retro’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how retro loads, arrives, points, presses, updates and leaves. Update 1: every candidate is now a moment of the 1995 desktop itself, drawn as it was (the teal desktop, the taskbar, the window with its menu bar and status bar, the dialog box with its icon), in whole frames and never eased; none of round one’s mechanics returns.';
export const LOOK =
    'Update 1: eight new candidates for retro’s anchor, each a moment of the 1995 desktop, shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Nothing eases. Pick the one that is retro to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the Copying dialog (a dialog box titled "Copying…" with two
    // folder icons `.rt-folder` 2.5rem wide, yellow `--warning` body, darker
    // tab, drawn with borders on a 2px grid, 5rem apart; a sheet `.rt-sheet`
    // (white 1rem × 1.3rem with a folded corner and three ink lines) that
    // flies from the left folder to the right in an arc of 8 frames
    // (`steps(1)` between 8 fixed translate poses, 1 u each: up out of the
    // folder, over the top, down into the other); at the 8th frame it drops
    // in and the dialog's segmented bar gains one block; the text under the
    // folders reads "pumps.dat" then "From 'Pump house 3' to 'Backup'". Out:
    // the sheet flies back the same arc, the block is taken away. Bar: the
    // Copying dialog's bar, a block per sheet: 7 blocks over 7 u, the sheet's
    // arc above it in 7 small flights. Button: press at 7 u = the register's
    // bevel press (face `--kp-pressed`, label 1px down and right), one step.
    {
        key: 'copy',
        name: 'Copying…: the sheet flies between the folders',
        see: 'The Copying dialog of 1995: two folders, and a sheet of paper that flies out of the left one, over, and down into the right one in eight whole frames, again and again, while the segmented bar underneath gains a block each time a sheet lands. Held with the sheet in the folder, then it flies back and the block is taken away. As a progress bar, it is that dialog’s bar with the sheet’s flight above it. As a button press, the bevel is pressed in one step and the label moves a pixel, as 1995 pressed every button.',
        follows:
            'Everything that arrives is copied in: it flies in as a sheet in frames and lands whole; everything that leaves flies out to the Recycle Bin; loading is sheets flying between folders with the bar filling under them; a live update is one sheet landing on the changed figure; the press is the bevel; hover is nothing, as in 1995; a menu is dealt from its edge in frames.',
        why: 'it is the single most remembered animation of that desktop (nobody who waited for a copy forgets the flying sheet), it is only retro’s (no other theme flies paper between folders), it moves in frames by nature, and it gives arrival, loading, live and leave as one picture, where the bevel press and the segmented bar it already carries decide the rest.',
        caps: [
            'In its own scene: the Copying dialog, the sheet flies',
            'As a progress bar: a block per sheet',
            'As a button press: the bevel pressed, the label a pixel over',
        ],
        hero: `<div class="an-hero rt-c-hero" role="img" aria-label="A 1995 desktop with a Copying dialog: a sheet of paper flies from one folder to the other in whole frames and the segmented bar gains a block">${desktop(
            'rt-c-desk',
            `<div class="rt-dlg rt-c-dlg"><div class="rt-win__title"><span>Copying…</span><span class="rt-win__controls rt-win__controls--one" aria-hidden="true"><i></i></span></div><div class="rt-c-stage" aria-hidden="true"><span class="rt-folder rt-folder--from"></span>${a(
                '',
                'rt-sheet',
            )}<span class="rt-folder rt-folder--to"></span></div><p class="rt-c-text">pumps.dat<br />From ’Pump house 3’ to ’Backup’</p><div class="rt-c-bar"><span class="rt-bar__well">${a('clip', 'rt-bar__blocks rt-c-blocks')}</span></div><div class="rt-dlg__buttons"><span class="rt-btn">Cancel</span></div></div>`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-c-bar-p', a('', 'rt-sheet rt-sheet--small'))}</div>`,
        button: `<div class="an-btn"><span class="rt-c-btn">${button('OK', 'an-press rt-c-press')}</span></div>`,
    },
    // CSS: Solitaire won: a window titled "Solitaire" with the green felt
    // (`hsl(from var(--success) h 100% 25%)`) and four foundation stacks at
    // the top; a card (`.rt-card`, white 2.2rem × 3rem, 2px ink frame, a red
    // heart `♥` glyph in `hsl(from var(--destructive) h 100% 45%)` top-left
    // and bottom-right) bounces out of the first stack: it falls, hits the
    // window's foot, bounces lower each time while travelling right (6
    // frames, 1 u each, `steps(1)` between fixed poses), and every pose it
    // leaves STAYS painted (a trail of card copies: 6 copies `.rt-card--trail`
    // revealed one per frame behind it, the famous painting artefact); the
    // last card lands at the foot. Out: the trail is erased copy by copy
    // and the card bounces back up into its stack. Bar: the fill is cards
    // laid along the track one per step (7 small cards, `steps(7)`) each
    // overlapping the last. Button: press at 7 u = the card is flipped: the
    // button's face flips through 0 width to its back (a navy card back with
    // a dither pattern) in 2 frames; release flips it face up.
    {
        key: 'solitaire',
        name: 'Solitaire is won: the cards cascade',
        see: 'A Solitaire window on the felt. The game is won: a card bounces out of its stack, hits the window’s foot, bounces lower and lower as it travels across, and every place it has been stays painted, the trail of cards nobody who won a game in 1995 forgets. Held with the trail across the felt, then the trail is erased copy by copy and the card bounces back. As a progress bar, the cards are laid along the track one per step. As a button press, the card is flipped to its back in two frames.',
        follows:
            'What is done cascades (a finished export, a closed incident bounces out and leaves its trail for a beat); an arrival bounces in in frames; loading is a card bouncing with its trail; a live update is the changed figure’s card flipped; the press flips; the leave bounces off; the bevel and the dither stay.',
        why: 'it is the one piece of joy that desktop had and the most quoted animation of it, it is only retro’s, and bouncing in whole frames with a painted trail is a 1995 fact (the screen was not cleared); but it is a celebration, so a plain arrival or a wait wears a party hat, and a card flipping on every press says “game” where the Copying dialog says “work”.',
        caps: [
            'In its own scene: the won game, a card cascades leaving its trail',
            'As a progress bar: cards laid one per step',
            'As a button press: the card flipped to its back',
        ],
        hero: `<div class="an-hero rt-s-hero" role="img" aria-label="A Solitaire window: a card bounces across the green felt in whole frames and leaves a trail of painted copies">${desktop(
            'rt-s-desk',
            `<div class="rt-win rt-s-win"><div class="rt-win__title"><span class="rt-win__sysicon" aria-hidden="true"></span><span>Solitaire</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="rt-win__menu" aria-hidden="true"><span><u>G</u>ame</span><span><u>H</u>elp</span></div><div class="rt-s-felt" aria-hidden="true"><span class="rt-s-stacks"><i></i><i></i><i></i><i></i></span>${[
                1, 2, 3, 4, 5, 6,
            ]
                .map((n) => `<span class="rt-card rt-card--trail an-a" data-rt-pose="${n}">♥</span>`)
                .join('')}<span class="rt-card rt-card--live an-a">♥</span></div></div>`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-s-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-s-btn">${button('Deal', 'an-press rt-s-press')}</span></div>`,
    },
    // CSS: Defrag: a window titled "Disk Defragmenter" whose body is a grid
    // of 14 × 6 blocks (`.rt-d-grid i`, 0.6rem squares with a 1px lighter
    // top-left edge), at `gap` a scatter of used (blue `--info`), free (white)
    // and bad (maroon) blocks; the head reads a block (it turns to the
    // reading colour, green `hsl(from var(--success) h 100% 35%)`) and
    // writes it at the first free slot from the start (that slot turns
    // blue, the read one turns white), one block per half unit, `steps(1)`,
    // so the used blocks gather at the front over 7 u; a legend under the
    // grid ("■ Used ■ Free ■ Reading ■ Writing ■ Bad"). Out: the blocks are
    // scattered back the same way. Bar: the fill is the defrag bar (the
    // window's own blocks walking to the front, one per step). Button: press
    // at 7 u = the face reads (goes the reading green for one frame) and
    // writes (pressed bevel), one step.
    {
        key: 'defrag',
        name: 'Defrag: the blocks are read and written',
        see: 'The Disk Defragmenter of 1995: a grid of coloured blocks, used ones scattered among free ones. One block at a time is read (it lights green) and written to the first free place from the start (it turns blue there, white where it was), so the used blocks gather at the front, block by block, with the legend underneath. Held with the disk tidy, then it is scattered back the same way. As a progress bar, the blocks walk to the front one per step. As a button press, the face is read for a frame and written pressed.',
        follows:
            'Loading is blocks being read and written (the bar, the busy table, the strip, the tiles, the menu: every waiting surface is a small grid gathering itself); an arrival is the part’s blocks written to their place; a live update is the changed figure’s blocks re-written; the press reads and writes; the leave scatters the blocks; nothing eases.',
        why: 'it is the screen people watched for an hour and could not look away from, it is counting in whole blocks (retro’s own law), and it decides loading, arrival and live at once; but it is a grid, so a dialog, a toast or a menu has to carry a little grid to arrive, and brutalism’s ruled bar and high-contrast’s cells already count in hard steps.',
        caps: [
            'In its own scene: the blocks are read and written to the front',
            'As a progress bar: the blocks walk to the front',
            'As a button press: read for a frame, written pressed',
        ],
        hero: `<div class="an-hero rt-d-hero" role="img" aria-label="A Disk Defragmenter window: scattered blue blocks are read one by one and written to the front of the grid">${desktop(
            'rt-d-desk',
            win(
                'rt-d-win',
                'Disk Defragmenter',
                `<div class="rt-d-grid" aria-hidden="true">${'<i class="an-a"></i>'.repeat(84)}</div><p class="rt-d-legend" aria-hidden="true"><span class="rt-d-key rt-d-key--used">Used</span><span class="rt-d-key rt-d-key--free">Free</span><span class="rt-d-key rt-d-key--read">Reading</span><span class="rt-d-key rt-d-key--write">Writing</span><span class="rt-d-key rt-d-key--bad">Bad</span></p>`,
                false,
            ),
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-d-bar', `<span class="rt-d-bar__grid" aria-hidden="true">${'<i class="an-a"></i>'.repeat(14)}</span>`)}</div>`,
        button: `<div class="an-btn"><span class="rt-d-btn">${button('Defragment', 'an-press rt-d-press')}</span></div>`,
    },
    // CSS: the taskbar's Start button is pressed (sunken, one step at 1 u)
    // and the Start menu (`.rt-m-menu`: a raised panel with the vertical
    // navy banner down its left edge reading "Windows 95" rotated -90deg in
    // the display face, and six entries with 1rem icons: Programs,
    // Documents, Settings, Find, Help, Run…, Shut Down… with a groove above
    // the last) slides up out of the taskbar in 6 hard frames (clip-path
    // inset from the bottom, `steps(6)`, 2–5 u), then the pointer (a 1995
    // arrow `.rt-pointer`, white with an ink outline, drawn with clip-path)
    // moves down the entries in 3 frames and the third entry takes the
    // navy selection bar (6–7 u). Out: the selection off, the pointer back,
    // the menu slides down into the taskbar, Start released. Bar: the blocks
    // fill one per step. Button: press at 7 u = the Start-style press: the
    // bevel sunken and held (the register's), the label 1px over.
    {
        key: 'start',
        name: 'Start: the menu slides up',
        see: 'The Start button is pressed and the Start menu slides up out of the taskbar in six whole frames, the navy banner down its side, its entries with their little icons; the pointer walks down and an entry takes the navy selection bar. Held open, then the entry is released, the menu slides down into the taskbar and Start pops out. As a progress bar, a block per step. As a button press, the bevel sinks and stays sunk while the menu is open, as Start did.',
        follows:
            'Every menu, list and panel slides out of its edge in frames (the Start menu up from the taskbar, a dropdown down from its bar, a drawer in from its side) and slides back; the pressed thing stays sunk while what it opened is open; arrival is a slide-in, loading the hourglass, a live update the selection bar passing over the changed row; nothing fades.',
        why: 'it is the first thing every 1995 user did and the one the desktop was named for, it opens from its edge in frames (so every menu and panel of the theme follows without a new idea), and the stay-sunk press is a true 1995 manner; but it is an opening, not an object, so loading and live updates must come from the hourglass and the selection bar, and sliding a panel out of its edge is titanium’s drawer and toast in grey.',
        caps: [
            'In its own scene: Start pressed, the menu slides up, an entry selected',
            'As a progress bar: a block per step',
            'As a button press: sunk and held, as Start',
        ],
        hero: `<div class="an-hero rt-m-hero" role="img" aria-label="A 1995 desktop: the Start button is pressed and the Start menu slides up out of the taskbar in whole frames">${desktop(
            'rt-m-desk',
            `<div class="rt-m-menu an-a" aria-hidden="true"><span class="rt-m-banner">Windows<b>95</b></span><ul><li><i class="rt-m-ico rt-m-ico--programs"></i>Programs<span class="rt-m-arrow">▸</span></li><li><i class="rt-m-ico rt-m-ico--documents"></i>Documents<span class="rt-m-arrow">▸</span></li><li class="rt-m-pick an-a"><i class="rt-m-ico rt-m-ico--settings"></i>Settings<span class="rt-m-arrow">▸</span></li><li><i class="rt-m-ico rt-m-ico--find"></i>Find<span class="rt-m-arrow">▸</span></li><li><i class="rt-m-ico rt-m-ico--help"></i>Help</li><li><i class="rt-m-ico rt-m-ico--run"></i>Run…</li><li class="rt-m-sep"><i class="rt-m-ico rt-m-ico--off"></i>Shut Down…</li></ul></div>${a(
                '',
                'rt-pointer rt-m-pointer',
            )}`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-m-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-m-btn">${button('Start', 'an-press rt-m-press', '<span class="rt-m-flag" aria-hidden="true"></span>')}</span></div>`,
    },
    // CSS: a message box (`dialog()` with the `--warn` icon: a yellow
    // `--warning` triangle with an ink "!" drawn with borders/clip-path, or
    // the `--stop` icon: a red circle with a white X) titled "Pump house 3"
    // pops up centred over the desktop in ONE frame at 2 u (clip inset 100%
    // → 0 in `steps(1)`), its OK button carrying the dotted focus
    // rectangle; then the ding: the title bar flashes three times (ramp →
    // inactive grey → ramp, `steps(1)`, 0.5 u per flash, 3–6 u), the way
    // 1995 flashed a modal's title bar when the user clicked elsewhere; the
    // text reads "Pressure dropped below 1.0 bar." Out: the flashes, then the
    // box vanishes in one frame. Bar: the message box's own segmented bar
    // (a block per step). Button: press at 7 u = OK pressed (the register's
    // bevel press) with the dotted focus rectangle drawn inside the face.
    {
        key: 'ding',
        name: 'The message box dings',
        see: 'A message box pops up in one frame, centred, with its yellow warning triangle, its line of text and an OK button wearing the dotted focus rectangle; and it dings: the title bar flashes three times, grey, navy, grey, navy, the way 1995 called you back to a dialog you had to answer. Held, then it flashes again and is gone in one frame. As a progress bar, the message box’s own segmented bar. As a button press, OK is pressed with the focus rectangle inside its face.',
        follows:
            'Everything that needs you is a message box: it pops in one frame and dings; a live update is the title bar flashing on the changed window; loading is a dialog with its bar and its Cancel; arrival is a window popped in one frame (no slide, no zoom); the leave is one frame; the press is OK; focus is the dotted rectangle, as 1995 drew it.',
        why: 'it is the moment that desktop interrupted you (the triangle, the ding, the flashing title bar) and nobody else flashes a title bar; it keeps every 1995 manner (one-frame pops, the dotted focus, the default button’s ring); but a flash is the one motion the flash gate counts, three in a second is its limit, and a box that pops in one frame has no way of arriving that reads as motion at all.',
        caps: [
            'In its own scene: the box pops, the title bar flashes',
            'As a progress bar: the box’s segmented bar',
            'As a button press: OK pressed, the focus rectangle inside',
        ],
        hero: `<div class="an-hero rt-g-hero" role="img" aria-label="A 1995 desktop: a message box with a yellow warning triangle pops up in one frame and its title bar flashes three times">${desktop(
            'rt-g-desk',
            `<div class="rt-dlg rt-g-dlg an-a"><div class="rt-win__title an-a"><span>Pump house 3</span><span class="rt-win__controls rt-win__controls--one" aria-hidden="true"><i></i></span></div><div class="rt-dlg__body"><span class="rt-dlg__icon rt-dlg__icon--warn" aria-hidden="true"></span><p>Pressure dropped below 1.0 bar.</p></div><div class="rt-dlg__buttons"><span class="rt-btn rt-btn--default rt-btn--focus">OK</span></div></div>`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-g-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-g-btn">${button('OK', 'an-press rt-g-press', '', a('', 'rt-g-focus'))}</span></div>`,
    },
    // CSS: Minesweeper: a window titled "Minesweeper" with the sunken
    // counter panel (two red 7-segment LED displays `.rt-w-led` on black,
    // "010" and "000", digits drawn with VT323 or seven CSS bars; the one on
    // the right counts up a digit per unit as the timer) and the smiley
    // button between them (`.rt-w-face`, a 1.6rem raised bevel with a yellow
    // disc, two ink eyes and a smile drawn with borders); the field is 9 × 6
    // raised cells; at 2 u the pointer presses a cell: the face goes "o"
    // (round mouth) for the frame the cell is held, the cell sinks (pressed
    // bevel); at 3 u the reveal floods: empty cells open outward from the
    // pressed one in rings, one ring per frame (`steps(1)`), each opened cell
    // flat with a number in its colour (1 blue `--info`, 2 green, 3 red) at
    // the ring's edge; at 7 u the field is cleared and the face puts on
    // sunglasses (two ink rectangles over the eyes). Out: the glasses off,
    // the cells close ring by ring, the counter counts back. Bar: the fill
    // is cells opening left to right one per step with the numbers. Button:
    // press at 7 u = the face's "o" on a small smiley beside the label, and
    // the cell-like bevel pressed; release = the smile.
    {
        key: 'mines',
        name: 'Minesweeper: the face reacts, the field floods open',
        see: 'A Minesweeper window: the red LED counters, the smiley between them, a field of raised cells. A cell is pressed and the face goes “o” for the frame it is held; the field floods open from that cell outward in rings, one ring per frame, the numbers in their colours at the edge; the timer counts; and when the field is clear the face puts on its sunglasses. Held, then the glasses come off and the field closes ring by ring. As a progress bar, the cells open left to right one per step. As a button press, a small face beside the label goes “o” and the cell bevel sinks.',
        follows:
            'Arrival is a flood reveal in rings from where you clicked (a panel, a tile grid, a menu opens outward in frames); the press is the “o” and the sunken cell; a live update is the LED counter ticking; done is the sunglasses; loading is the timer counting with the face watching; the leave closes ring by ring. Every figure is an LED, every cell a bevel.',
        why: 'it is the most played program of that desktop and the one with a face, so the theme would answer every press with a reaction no other theme has, and the flood reveal in rings is a real 1995 arrival in frames; but a smiley is a joke on a dashboard of pump readings, and the LED counter is nostromo’s and terminal’s dialect in red.',
        caps: [
            'In its own scene: the cell pressed, the field floods open, sunglasses',
            'As a progress bar: cells open one per step',
            'As a button press: the face goes “o”, the cell sinks',
        ],
        hero: `<div class="an-hero rt-w-hero" role="img" aria-label="A Minesweeper window: a cell is pressed, the smiley reacts, the field floods open in rings and the face puts on sunglasses">${desktop(
            'rt-w-desk',
            `<div class="rt-win rt-w-win"><div class="rt-win__title"><span class="rt-win__sysicon" aria-hidden="true"></span><span>Minesweeper</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="rt-win__menu" aria-hidden="true"><span><u>G</u>ame</span><span><u>H</u>elp</span></div><div class="rt-w-panel" aria-hidden="true"><span class="rt-w-led">010</span><span class="rt-w-face an-a"><i></i></span><span class="rt-w-led rt-w-led--timer an-a">000</span></div><div class="rt-w-field" aria-hidden="true">${[
                ...Array(54).keys(),
            ]
                .map((i) => `<i class="an-a" data-rt-cell="${i}"></i>`)
                .join('')}</div>${a('', 'rt-pointer rt-w-pointer')}</div>`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-w-bar', `<span class="rt-w-bar__cells" aria-hidden="true">${'<i class="an-a"></i>'.repeat(12)}</span>`)}</div>`,
        button: `<div class="an-btn"><span class="rt-w-btn">${button('Sweep', 'an-press rt-w-press', '<span class="rt-w-face rt-w-face--small an-a" aria-hidden="true"><i></i></span>')}</span></div>`,
    },
    // CSS: the screensaver kicks in: the desktop goes black in one frame at
    // 1 u (a `.rt-f-space` black plate over the desktop) and the starfield
    // ("Flying Through Space") runs: 24 white dots (`.rt-f-star i`, 2–4 px
    // squares) stream from the centre outward in 6-frame runs (`steps(6)`,
    // each star on its own radial, translate from 0 to its edge, staggered
    // 0.25 u, looping through the hold), the way the 1995 screensaver flew;
    // at 7 u a key is pressed (the pointer appears) and the desktop is back
    // in one frame with the window on it. Out: black again, the stars run,
    // the desktop returns. Bar: the fill is a black well with stars
    // streaming right and the blocks appearing in front of them, one per
    // step. Button: press at 7 u = the face goes black with three stars for
    // one frame, then the pressed bevel.
    {
        key: 'stars',
        name: 'The screensaver: flying through space',
        see: 'Nothing was touched for a while: the desktop goes black in one frame and the stars fly, white squares streaming from the centre to the edges in whole frames, the Flying Through Space screensaver; then a key is pressed and the desktop is back in one frame with the window on it. Held with the window, then black again, the stars, and back. As a progress bar, the blocks appear in front of a star stream. As a button press, the face goes to space for one frame and is pressed.',
        follows:
            'Waiting is the screensaver (a loading surface goes black and the stars fly until the reading is there); an arrival is the desktop coming back in one frame; a live update is a star burst behind the changed figure; the leave is the screen going black; the press is one frame of space; everything else is the 1995 window chrome as it stands.',
        why: 'it is the one 1995 motion that was pure spectacle (every unattended monitor flew through space), it moves in frames with nothing eased, and black with white stars is nobody else’s loading; but a screen going black is the opposite of a page answering you, so every arrival begins with a blackout, and a starfield is synthwave’s and cyberpunk’s neighbourhood in the dark.',
        caps: [
            'In its own scene: black, the stars fly, the desktop is back',
            'As a progress bar: the blocks in front of the stars',
            'As a button press: one frame of space, then pressed',
        ],
        hero: `<div class="an-hero rt-f-hero" role="img" aria-label="A 1995 desktop goes black and white squares stream from the centre like the Flying Through Space screensaver, then the desktop returns">${desktop(
            'rt-f-desk',
            `${win('rt-f-win')}<div class="rt-f-space an-a" aria-hidden="true"><span class="rt-f-star">${'<i class="an-a"></i>'.repeat(24)}</span></div>`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-f-bar', `<span class="rt-f-bar__space" aria-hidden="true">${'<i class="an-a"></i>'.repeat(10)}</span>`)}</div>`,
        button: `<div class="an-btn"><span class="rt-f-btn">${button('Resume', 'an-press rt-f-press', a('', 'rt-f-press__space'))}</span></div>`,
    },
    // CSS: a window is dragged: the pointer grabs its title bar at 1 u; from
    // 2 u only the window's OUTLINE moves (a 2px dotted ink/paper XOR-style
    // frame `.rt-x-frame`, `background` of four dashed edges), stepping
    // across the desktop in 5 frames (translate, `steps(5)`, 2–6 u) while the
    // window itself stays where it was; at 7 u the frame lands and the
    // window is painted at the new place in one frame (the old place is
    // erased: a teal patch). Out: the frame drags back, the window is
    // painted at the old place. Bar: the fill's edge is the dotted frame
    // moving in steps, the blocks painted behind it. Button: press at 7 u =
    // the button's outline is drawn (the dotted frame, grabbed) and the
    // bevel pressed.
    {
        key: 'drag',
        name: 'Dragged by its outline',
        see: '1995 could not move a window whole: the title bar is grabbed and only the window’s dotted outline moves, stepping across the desktop in five frames while the window stays put; when the mouse lets go, the window is painted at the new place in one frame and the old place is wiped. Held, then the outline is dragged back and the window painted where it was. As a progress bar, the dotted frame steps ahead and the blocks are painted behind it. As a button press, the button is grabbed: its dotted outline drawn, the bevel pressed.',
        follows:
            'Everything moves as its outline and is painted at the drop (a tile reordered, a drawer, a dialog placed, a card moved); arrival is the outline arriving then the paint; the leave is the outline dragged to the Recycle Bin and the thing wiped; loading is the hourglass; a live update is the changed figure wiped and repainted; the press grabs.',
        why: 'it is a true 1995 fact that no other theme can claim (the XOR outline that moved while the window waited), it is frames by nature and it keeps the desktop honest (nothing moves whole); but it is close to round one’s outline zoom, which you rejected, and it says how things move, not how they wait or update.',
        caps: [
            'In its own scene: the outline dragged, the window painted at the drop',
            'As a progress bar: the dotted frame ahead of the blocks',
            'As a button press: grabbed, outlined, pressed',
        ],
        hero: `<div class="an-hero rt-x-hero" role="img" aria-label="A 1995 desktop: a window's dotted outline is dragged across in whole frames while the window stays, then the window is painted at the new place">${desktop(
            'rt-x-desk',
            `${win('rt-x-win an-a')}${a('', 'rt-x-frame')}${a('', 'rt-pointer rt-x-pointer')}`,
        )}</div>`,
        bar: `<div class="an-bar">${bar('rt-x-bar', a('', 'rt-x-bar__frame'))}</div>`,
        button: `<div class="an-btn"><span class="rt-x-btn">${button('Move', 'an-press rt-x-press', '', a('', 'rt-x-press__frame'))}</span></div>`,
    },
];
