// What makes retro retro: the nineteen questions, as data. The designer's
// text, verbatim; demo.js wires each aspect's scene and options.css draws
// each option by `data-rt-<id>="<key>"` on the scene. The grammar is
// themes/retro/CHARACTER.md (G1–G21); the anchor is the Copying dialog
// (research/retro-anchor, update 1, attempt 1 of 3, Kenny 2026-10-08): a
// sheet of paper flies out of one folder, over, and into the other in eight
// whole frames while the segmented bar gains a block per landing; Kenny
// added that the 1995 desktop drawn around it (teal ground, icons, taskbar
// with Start and the clock, window chrome) is retro's world.
// Update 1 (2026-10-09-r2): the questions Kenny did not approve are redrawn (his comments are in update.json); his picks stay as they were.

export const THEME = 'retro';
export const LABEL = 'Retro';
export const TITLE = 'What makes retro retro';
export const STORY = {
    what: 'Retro is the 1995 desktop: a teal ground with its icons, a taskbar with Start and the clock, windows of grey chrome with a navy title bar, bevels for what you press and sunken wells for what you read, a 16-colour palette, and a clock that ticks in whole frames because nothing in 1995 eased. The anchor you picked says what the desktop does: it copies. A sheet of paper flies out of one folder, over, and into the other in eight whole frames, and the segmented bar gains a block each time a sheet lands.',
    so: 'So everything that happens on screen is copied in or out: a part flies in as a sheet and lands whole (arriving, opening), is copied over when it changes (a live update), waits while sheets fly and blocks fill (loading, the busy bar), and flies back to its folder when it goes (leaving). Every motion is whole frames, the bevel presses in one, and nothing fades, eases or blinks; the desktop you liked (the taskbar, the icons, the pointer, the window chrome) is the world every part lives in.',
    decided:
        'Already decided by you: the anchor = the Copying dialog’s flying sheet (the anchor round, attempt 1 of 3), with the 1995 desktop around it; the network graph changes in no theme. The questions below turn the anchor into rules for every other component; where a decided pick is at odds with the rule, the pick is on the page as an option named “the pick” or “today”. The full analysis is in themes/retro/CHARACTER.md.',
};

/**
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
export const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'A dialog, a menu and a tile are copied in. In how many frames, and does anything ease?',
        why: 'In every option every part arrives the same way (a sheet flies in from the top-left and the part lands whole) over the same 720 ms, so only the frames differ. Beside the parts a small sheet flies next to one that moves smoothly, so the frames are seen on their own.',
        kind: 'cycle',
        scene: 'moving',
        options: [
            {
                key: 'frames',
                name: 'Whole frames, eight a flight',
                see: 'The sheet flies in eight whole frames (steps(8), 90 ms each): it is in one place, then the next, nothing between; a short motion takes four frames, a repaint one; the close is the same frames backwards. Nothing eases, ever.',
                verdict:
                    'Recommended: this one, because it is how 1995 drew (the Copying dialog had eight frames and no in-betweens), it is the anchor’s own clock, and whole frames in grey, navy and teal are retro’s alone: terminal and nostromo step in phosphor and amber.',
            },
            {
                key: 'four',
                name: 'Four frames',
                see: 'The same flight in four frames (steps(4), 180 ms each): coarser, the sheet jumps half the way at once.',
                verdict: 'Not recommended, because four frames is a flicker-book; the flight is not read as a flight.',
            },
            {
                key: 'sixteen',
                name: 'Sixteen frames',
                see: 'The same flight in sixteen frames (45 ms each): nearly smooth.',
                verdict: 'Not recommended, because at sixteen frames the stepping is lost and it reads as a choppy ease; 1995 had eight.',
            },
            {
                key: 'smooth',
                name: 'Smooth (as 2026 would)',
                see: 'The sheet flies on a curve, cubic-bezier(0.2, 0, 0, 1), with no frames at all.',
                verdict: 'Not recommended, because smooth motion is every other theme; the moment it eases it is not 1995.',
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'From where is a part copied in, and in what order does a group come?',
        why: 'A week of days, a tile and a trend line arrive. Every option takes 720 ms and the same frames; only where the sheet comes from and the order of the group differ.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'folder',
                name: 'Copied in from the folder, top-left',
                see: 'A part flies in from the top-left of its container, where the source folder stands, along an arc of whole frames and lands whole; a group of days is copied one sheet after another, one frame apart, in reading order; the trend line is drawn left to right block by block, as the segmented bar fills.',
                verdict:
                    'Recommended: this one, because everything on this desktop comes from a folder, so every part has one origin; a group copied one by one is the Copying dialog with several sheets; a line drawn in blocks is its bar.',
            },
            {
                key: 'dragged',
                name: 'Dragged in from above (the picks)',
                see: 'The tiles’ pick: tile after tile drops from above in hard steps; a group top to bottom; the trend line appears at once.',
                verdict: 'Not recommended, because a drop from above is a window being dragged, not copied; and the trend at once is no arrival.',
            },
            {
                key: 'painted',
                name: 'Painted left to right (the picks)',
                see: 'The columns’ and the menu’s pick: every part is painted in from the left in four to six hard steps; a group all at once; the trend line painted.',
                verdict: 'Not recommended, because a paint wipe is how a window repaints, not how a thing arrives; and nothing flies.',
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open, and how does it close?',
        why: 'A menu opens under its button, a dialog opens on the desktop, a toast and a tooltip appear. Every option moves in whole frames; only what is drawn differs. Every close is the open backwards.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'dealt',
                name: 'Dealt from its edge, the dialog zooms in outline',
                see: 'The menu slides out of its button’s edge in six frames, clipped at the edge, the Start menu’s way; the dialog opens as 1995’s window zoom: four outline rectangles growing from its centre, then the window whole; the tooltip waits and appears in one frame; the toast drops from its edge in three frames. The close is the frames backwards.',
                verdict:
                    'Recommended: this one, because each is what 1995 actually did for that part (the Start menu slid, a window zoomed in outlines, a tip waited, a notice dropped), so a reader who was there knows every one; the register already has the zoom and the drop.',
            },
            {
                key: 'painted',
                name: 'Painted from the edge (the picks)',
                see: 'The menu’s and the header’s pick: drawn in from the left or the top in six hard steps, erased the same way; the dialog painted too.',
                verdict: 'Not recommended, because a paint wipe for everything makes a menu and a dialog the same thing; 1995 told them apart.',
            },
            {
                key: 'pops',
                name: 'Pops whole (today)',
                see: 'The register’s menu: there at once, no frames; the dialog zooms; the toast drops.',
                verdict: 'Not recommended, because a menu that is simply there is the one 1995 thing nobody remembers; the Start menu slid.',
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long are a frame, a flight, a short motion, a group and a loop?',
        why: 'Every option shows the same picture (a dialog zoomed, a sheet flying, a group copied, the busy bar hopping); only the times differ, printed under each part.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'flight',
                name: 'One flight: 90 ms a frame, 8 frames, a loop of 2520 ms',
                see: 'A frame is 90 ms; a flight is 8 frames (720 ms); a short motion 4 to 6 frames (360 to 540 ms); a group one frame apart; a loop (sheets flying while loading, the busy hop) 28 frames (2.52 s), the Copying dialog’s rhythm; a bevel presses at once.',
                verdict:
                    'Recommended: this one, because it is the anchor’s own clock (the Copying dialog at 90 ms a frame), fast enough for a menu and slow enough that each frame is seen.',
            },
            {
                key: 'quick',
                name: 'Quick: 60 ms a frame',
                see: 'A frame is 60 ms: a flight 480 ms, a short motion 240 to 360, the loop 1.68 s.',
                verdict: 'Not recommended, because at 60 ms the frames blur into a flicker; a 486 did not draw that fast.',
            },
            {
                key: 'slow',
                name: 'Slow: 120 ms a frame',
                see: 'A frame is 120 ms: a flight 960 ms, a short motion 480 to 720, the loop 3.36 s.',
                verdict: 'Not recommended, because a menu that takes three quarters of a second to slide is a slow machine, not a retro one.',
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'Which colours may a part use?',
        why: 'The same window, buttons, a switch, a month, a key figure, a meter and a failed export in every option; only the colour rule differs.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'palette',
                name: 'The 16-colour palette',
                see: 'Chrome grey for every surface, title-bar navy for what is selected and for title bars, teal for the desktop, white for a well’s paper, black ink; warnings yellow, failure dark red, success green, as the VGA palette had them; no other hue, no tint, no gradient but the title-bar ramp and the dither.',
                verdict:
                    'Recommended: this one, because sixteen colours is what the machine had, and grey, navy and teal together are the one palette nobody else in the set uses.',
            },
            {
                key: 'led',
                name: 'The LED console (the picks)',
                see: 'The meter’s and the state’s pick: black wells with lit green and red LED segments, a scope grid, lamps before words.',
                verdict:
                    'Not recommended, because a black LED well is a hi-fi, nostromo’s and terminal’s world; 1995 drew its monitor in a grey window.',
            },
            {
                key: 'navygrey',
                name: 'Navy and grey only',
                see: 'No teal, no yellow, no green: the desktop grey, warnings and failures told by the message box icon alone.',
                verdict: 'Not recommended, because without the teal the desktop is gone, and a warning with no yellow is not 1995’s.',
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How are the corners drawn?',
        why: 'The same window, menu panel, key figure, button, tag, chip, tooltip and bar head in every option; only the corners and edges differ.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'bevel',
                name: 'Square, bevelled',
                see: 'Radius 0 everywhere; a raised bevel for what you press, a sunken well for what you read, a groove for a divider; nothing cut, nothing rounded, no notch. As the register has it.',
                verdict:
                    'Recommended: this one, because 1995 had one edge, the bevel, and one corner, the square; the bevel says what is pressable and the well what is read.',
            },
            {
                key: 'notch',
                name: 'The floppy notch on plates (the picks)',
                see: 'The busy table’s and the calendar’s pick: every plate with its top-right corner cut as a floppy disk’s shutter notch, days as disk labels.',
                verdict: 'Not recommended, because a floppy notch on every plate makes every plate a disk; it stays where it was picked.',
            },
            {
                key: 'flat',
                name: 'Square and flat',
                see: 'Radius 0 and no bevel: a 1 px ink line round every part.',
                verdict: 'Not recommended, because flat and square is brutalism; the bevel is the whole look.',
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is on the screen before anything happens?',
        why: 'A dialog with its title, a key figure, a trend tile, a menu with headings and the state word in every option; only the surface differs.',
        kind: 'still',
        scene: 'surface',
        options: [
            {
                key: 'desktop',
                name: 'The desktop behind, every surface a window part',
                see: 'The teal desktop with its icons and the taskbar is the ground; every surface is a window part: a raised plate, a sunken well, a title bar with the ramp, a menu strip, a status bar with the grip; the 4 % checker dither on the chrome; a hard 3 to 4 px drop under a window or a menu, never a blur.',
                verdict:
                    'Recommended: this one, because the environment you liked, kept: a part is a window on the desktop, and nothing in the set has a desktop with icons and a taskbar.',
            },
            {
                key: 'wells',
                name: 'The LED wells and scopes (the picks)',
                see: 'The meter’s and the state’s pick: black sunken wells with LED segments and a green scope grid behind the state word and the warning.',
                verdict: 'Not recommended, because a black well with a green grid is a terminal in a window; the desktop was grey.',
            },
            {
                key: 'woodgrain',
                name: 'The woodgrain console (the drawer’s pick)',
                see: 'The drawer’s pick: a warm brown woodgrain tray, cream and orange, CRT scanlines and hi-fi dials.',
                verdict: 'Not recommended, because a 1970s hi-fi; the one off-theme pick in the set, and it contradicts the desktop entirely.',
            },
        ],
    },
    {
        id: 'warning',
        label: 'A warning',
        rule: 'G8',
        question: 'How does a figure that needs attention look?',
        why: 'A warning key figure, a failed trend tile, a destructive menu entry and a warning alert in every option.',
        kind: 'still',
        scene: 'warning',
        options: [
            {
                key: 'messagebox',
                name: 'The message box',
                see: 'A warning or failed figure is framed as a 1995 message box: its title bar in the tone, the yellow triangle for a warning, the red X for a failure, beside the figure; a destructive menu entry has the red X before it; the plate stays chrome.',
                verdict:
                    'Recommended: this one, because the icon everybody who used that desktop knows at a glance; the tone is in the icon and the title bar, and the chrome stays grey.',
            },
            {
                key: 'led',
                name: 'The LED and the scope (the picks)',
                see: 'The meter’s and the state’s pick: a lit red LED, a yellow segment, the scope grid tinted in the tone.',
                verdict: 'Not recommended, because an LED is a hi-fi’s warning, not a desktop’s.',
            },
            {
                key: 'tinted',
                name: 'The tinted plate',
                see: 'The whole plate takes the tone’s colour with its ink; no icon.',
                verdict: 'Not recommended, because a tinted plate is every default theme’s warning; 1995 never tinted a window.',
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a figure changes?',
        why: 'A key figure, a state word, a trend line, a strip column and a tile change in every option, in whole frames; the value changes on the way in and again on the way out.',
        kind: 'cycle',
        scene: 'live',
        options: [
            {
                key: 'copied',
                name: 'A sheet copied over',
                see: 'A small sheet flies from the top-left onto the changed figure in four frames and the figure repaints in one frame as it lands; the figure never swells, blinks or steps on its own. The trend line is redrawn block by block; the tile’s footer repaints.',
                verdict:
                    'Recommended: this one, because it is the anchor on a figure: a new copy delivered, so the eye sees where the change landed; and the figure itself never moves.',
            },
            {
                key: 'pops',
                name: 'The bevel pops (the picks)',
                see: 'The chart’s pick: the lines swell to a raised-bevel weight for a beat and settle; the state’s tag inverts once and back.',
                verdict: 'Not recommended, because a swell is an ease in disguise; a bevel that pops is a button, not a figure.',
            },
            {
                key: 'repainted',
                name: 'Repainted in jumps (the picks)',
                see: 'The kpi’s, the trend’s and the columns’ pick: the figure repaints in two hard jumps, or is painted in from the left in steps.',
                verdict: 'Not recommended, because a figure that repaints twice with nothing delivered is a flicker; the reader does not see why.',
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting surface show, on each kind of part?',
        why: 'A tile, a panel, a menu entry, a month of days, a chart’s plot and skeleton lines, waiting. Every option loops at 2.52 s. The Copying dialog is your pick: the options differ in how it fits a skeleton line, a day and a plot.',
        kind: 'loop',
        scene: 'loading',
        options: [
            {
                key: 'fitted',
                name: 'The Copying dialog, fitted to each part',
                see: 'A box (tile, panel, menu entry) shows two small folders and a sheet flying between them in eight frames with a short segmented bar under them that gains a block per landing and empties when full. A skeleton line is a sunken groove with one sheet hopping along its own length in eight frames and a block gained behind it, then emptied. A month of days passes one sheet from day to day, the day it lands on pressed in for a frame, one block gained per day along a bar under the month. The chart’s plot is crossed by one sheet flying along its baseline, the blocks filling the plot’s foot behind it.',
                verdict:
                    'Recommended: this one, because the one picture is kept and every part gets the form of it that fits it: a line is crossed, a row of days is walked, a plot is traversed, a box is copied into; nothing is stretched over a shape it does not fit.',
            },
            {
                key: 'bars',
                name: 'The Copying bar on every part',
                see: 'Every waiting part, whatever its shape, carries the Copying dialog’s own segmented bar along its foot, with one small sheet hopping ahead of the blocks (the busy bar’s picture); a month’s days each carry a one-block bar under their number; a skeleton line is its bar; the plot has the bar under it.',
                verdict:
                    'Not recommended, because it fits every shape by using the bar only, and the flying sheet between folders, the picture you liked, is gone from most parts.',
            },
            {
                key: 'folders',
                name: 'Folders at the part’s ends',
                see: 'On every part a small folder stands at its start and another at its end, and the sheet flies from one to the other along the part in eight frames (along a line, across a plot, over the days, diagonally over a box), the blocks filling a bar under or in the part.',
                verdict:
                    'Not recommended, because the flight is the whole part’s length, so it is big on a plot and tiny on a day; the fitted version sizes it to each.',
            },
            {
                key: 'blocks',
                name: 'The progress blocks (the picks)',
                see: 'The picks’ loading on seven components: navy blocks fill the part’s foot block by block, clear, and restart; no sheet.',
                verdict: 'Not recommended, because the bar without the sheet is half the dialog.',
            },
        ],
    },
    {
        id: 'busybar',
        label: 'The busy progress bar',
        rule: 'G11',
        question: 'What does the progress bar do while no share is known?',
        why: 'The register’s sunken well with navy blocks stays: with a share known the blocks fill whole, block by block. Every option is shown at three sizes busy, in a busy button, and beside a bar with a share (62 %), which is the same in every option.',
        kind: 'loop',
        scene: 'busybar',
        options: [
            {
                key: 'hops',
                name: 'The sheet hops ahead',
                see: 'Busy: a small sheet hops along the empty well two blocks a hop, seven hops, and the blocks fill behind it, then empty, 2.52 s, and again.',
                verdict:
                    'Recommended: this one, because the anchor’s own bar as the demo drew it: the sheet leads and the blocks follow, so busy is a copy whose end is not known; the still dither says nothing.',
            },
            {
                key: 'dither',
                name: 'The blocks stand in the dither (today)',
                see: 'The register’s busy bar: every block drawn in the dither brush, standing still.',
                verdict: 'Not recommended, because a bar that stands still does not say busy; it says broken.',
            },
            {
                key: 'fillempty',
                name: 'The blocks fill and empty',
                see: 'The blocks fill block by block to the end, then empty at once, and again; no sheet.',
                verdict: 'Not recommended, because close, but the sheet is the anchor; without it the bar is every install wizard’s.',
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G12',
        question: 'What does the spinner draw?',
        why: 'Three sizes, a busy button and a busy panel in every option; every option loops in whole frames.',
        kind: 'loop',
        scene: 'spinner',
        options: [
            {
                key: 'hourglass',
                name: 'The hourglass (today)',
                see: 'The register’s 1995 hourglass cursor: the sand drains through the glass in frames and the glass turns over, 2.6 s a loop; the busy button carries it before its label.',
                verdict:
                    'Recommended: this one, because the one object everyone remembers from that desktop, already drawn and already in frames; the sheet is for copying, the hourglass is for waiting on the spot.',
            },
            {
                key: 'sheet',
                name: 'The sheet flies round',
                see: 'A small sheet flies round a square path in eight frames, again and again.',
                verdict: 'Not recommended, because a sheet with no folders is a scrap of paper; the hourglass says wait.',
            },
            {
                key: 'flashlight',
                name: 'The Find flashlight',
                see: 'The Find dialog’s flashlight sweeping left and right over a magnifying glass, in frames.',
                verdict: 'Not recommended, because the flashlight meant searching, not waiting; and it is a second icon to draw.',
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G13',
        question: 'How does a part arrive, and how does it leave?',
        why: 'An alert, a card and a key figure arrive and leave in every option, in whole frames; the leave is the arrival backwards.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'copied',
                name: 'Copied in, copied back out',
                see: 'Arriving: the part flies in from the top-left as a sheet in eight frames and lands whole. Leaving: the same eight frames backwards, the sheet flying back up to the top-left and into its folder; no fade, nothing shrinks.',
                verdict:
                    'Recommended: this one, because arriving is the anchor and leaving is the anchor played backwards, the rule every theme keeps (a close is its open reversed); the sheet goes back to the folder it came from, which is what a cancelled copy did.',
            },
            {
                key: 'bin',
                name: 'Flies to the Recycle Bin',
                see: 'Arriving: the sheet flies in from the top-left in eight frames. Leaving: the part shrinks in four outline frames toward the bottom-left, where the Recycle Bin stands, and is gone; no fade.',
                verdict:
                    'Not recommended, because the Bin is the stronger memory, but then the leave is not the arrival backwards: two paths for one part, which breaks the one rule of motion every theme keeps.',
            },
            {
                key: 'centre',
                name: 'Shrunk to the centre (today)',
                see: 'The register’s leave: the part shrinks to a tenth of its size at its own centre in four steps and fades; arriving is the zoom from a quarter.',
                verdict:
                    'Not recommended, because a fade to nothing was not possible in 1995, and the open (from 0.25) and the close (to 0.1) do not mirror.',
            },
            {
                key: 'dissolve',
                name: 'The dissolve (the picks)',
                see: 'The calendar’s pick: each part appears in a chequer dissolve of four hard densities and leaves the same way.',
                verdict: 'Not recommended, because the dissolve is the boot screen’s exit; on every card it is a screensaver.',
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G14',
        question: 'Is a button inside a header, a menu, a tile or a drawer retro’s own button?',
        why: 'Retro’s own button stands alone for reference; then the same button inside a page header, a menu, a tile, a drawer and a key figure. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Exactly retro’s own',
                see: 'Every button inside a composite is the raised bevel as it stands alone and presses exactly the same; a menu entry takes the navy selection bar; a link is navy underlined; wherever it stands.',
                verdict: 'Recommended: this one, because one bevel for every button on the desktop; 1995 had one Button class.',
            },
            {
                key: 'sunken',
                name: 'Retro’s own on a sunken panel',
                see: 'The same manners, and the header’s actions and the drawer’s buttons stand together on a sunken well.',
                verdict: 'Not recommended, because a well under buttons says “read me”, and buttons are pressed.',
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s pick rules a line under a hovered button and dashes round it; the tiles’ bevel inverts on hover; the kpi’s bevel catches a highlight: three hovers on one page.',
                verdict: 'Not recommended, because three hovers on one page, on a desktop that had none.',
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G15',
        question: 'What happens where the pointer rests?',
        why: 'A button, a menu’s entries, a tile with its Open link, a link in running text, two key figures and a month of days, the first of each pointed at. Use State: Hover to see the pointer arrive and leave.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'nothing',
                name: 'Nothing, as in 1995',
                see: 'A button does not change (the accelerator’s underline only); a menu entry takes the navy selection bar at once; a link’s pointer is the hand; a tile does not lift; a day does not change.',
                verdict:
                    'Recommended: this one, because 1995 had no hover; the pointer itself was the feedback, and the menu bar was the one thing that answered. Every other theme marks hover; retro is the one that does not.',
            },
            {
                key: 'selection',
                name: 'The selection bar on everything',
                see: 'Every pointed-at thing takes the navy selection bar with white ink, at once: buttons, days, tiles, links.',
                verdict: 'Not recommended, because a navy bar on a button says selected, not pointed at; the bar belongs to lists and menus.',
            },
            {
                key: 'raises',
                name: 'The bevel raises (the picks)',
                see: 'The tiles’ and the kpi’s pick: the bevel inverts or catches a highlight on hover; the header’s rules a line under the button.',
                verdict: 'Not recommended, because a bevel that changes under the pointer is a press without a press.',
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G16',
        question: 'What marks the control the keyboard is on?',
        why: 'A button, a header action, a key figure as a link, a menu entry, a calendar day and a tile’s link, each focused. DI2 fixes the two-channel ring for every theme; the question is only what retro adds. Use State: Focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'dotted',
                name: 'The two-channel ring with the dotted rectangle inside',
                see: 'DI2’s ring outside the bevel (navy outside, ink inside), and inside the button the 1 px dotted focus rectangle of 1995 round the label, as the anchor drew it; a menu entry gets the dotted rectangle on its selection bar.',
                verdict:
                    'Recommended: this one, because the system’s ring for contrast and 1995’s own mark for memory; the dotted rectangle is the one focus mark everyone who used that desktop recognises.',
            },
            {
                key: 'ring',
                name: 'The two-channel ring alone (today)',
                see: 'The register’s focus: DI2’s ring outside the bevel; nothing inside.',
                verdict: 'Not recommended, because correct and anonymous; nothing of 1995 in it.',
            },
            {
                key: 'dottedonly',
                name: 'The dotted rectangle alone',
                see: 'Only the dotted rectangle inside the button, no ring outside.',
                verdict: 'Not recommended, because one channel at 1 px fails DI2’s contrast; the ring is not optional.',
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G17',
        question: 'What does a press do?',
        why: 'A button, a primary button, a menu entry, a calendar day and a key figure as a filter, each at rest and pressed. Use State: Press.',
        kind: 'still',
        scene: 'press',
        options: [
            {
                key: 'bevel',
                name: 'The bevel pressed in one frame (today)',
                see: 'The bevel inverts to the pressed stack in one step and the label moves a pixel down and right; the box and its neighbours never move; release restores it in one step. The register’s own press.',
                verdict:
                    'Recommended: this one, because the one press 1995 had, already in the register and already approved (the box never moves); the anchor drew it.',
            },
            {
                key: 'sinks',
                name: 'The bevel sinks in two frames (the picks)',
                see: 'The menu’s pick: the selection bar sinks into a navy bevel in two steps; the kpi’s bevel sinks.',
                verdict: 'Not recommended, because two frames for a press is a press that lags; 1995 pressed at once.',
            },
            {
                key: 'label',
                name: 'The label only',
                see: 'The label moves a pixel; the bevel stays raised.',
                verdict: 'Not recommended, because without the bevel inverting nothing says pressed.',
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G18',
        question: 'In which face are the window chrome, the words, the figures and the labels set?',
        why: 'A window with its title, a line of prose, a figure, a label and a status line in every option.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'three',
                name: 'Pixelify for chrome, Instrument Sans for words, VT323 for DOS',
                see: 'Window titles, headings and the brand in Pixelify Sans; prose, figures and the alarm’s headline in Instrument Sans; labels, help, status lines, tags and identifiers in VT323. As the register has it.',
                verdict:
                    'Recommended: this one, because three voices with three jobs (the chrome, the document, the DOS box), which is how that desktop read; the pixel face on figures was “te grof” (Kenny, scope-108).',
            },
            {
                key: 'pixelfigures',
                name: 'Pixelify for figures too',
                see: 'Figures and the key figure’s number in Pixelify Sans.',
                verdict: 'Not recommended, because a pixel figure cannot be read as a number at a glance; it was rejected for the alarm already.',
            },
            {
                key: 'dos',
                name: 'VT323 everywhere',
                see: 'Everything in VT323, the DOS face.',
                verdict: 'Not recommended, because VT323 everywhere is terminal’s voice; the desktop was Windows, not DOS.',
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G19',
        question: 'Which marks may retro draw, and where?',
        why: 'A window with its title, a meter with its mark, a chart’s events, a button and a list, an empty state and a divider in every option; only the marks differ.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'desktop',
                name: 'The bevel, the ramp, the selection bar, the dither, the blocks, the drop, the desktop',
                see: 'The bevel on what you press, the title-bar ramp on a title, the navy bar on a selection, the dither on what is disabled or waiting, the navy blocks for a share, the hard drop under a window, and the desktop’s icons, taskbar and pointer where the desktop is shown. No woodgrain, scanlines, CRT glow, hi-fi dials, marching ants or floppy labels as a general shape.',
                verdict:
                    'Recommended: this one, because seven marks that are one desktop; the drawer’s console is a different decade, and the floppies and LEDs stay where they were picked.',
            },
            {
                key: 'floppies',
                name: 'Plus the floppies and the LEDs (the picks)',
                see: 'The same seven, and the picks’ floppy labels and shutter notches, LED wells and scope grids, marching ants.',
                verdict: 'Not recommended, because two desktops on one page: the one with windows and the one with hi-fi parts.',
            },
            {
                key: 'all',
                name: 'As today (everything)',
                see: 'Every mark the register and the picks carry: the desktop, the floppies, the LEDs, the woodgrain tray, the scanlines, the dials.',
                verdict: 'Not recommended, because 1995, 1985 and 1975 at once.',
            },
        ],
    },
];
