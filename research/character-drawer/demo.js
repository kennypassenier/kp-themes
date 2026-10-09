// research/character-drawer: the component that pairs the help drawer
// (`dialog.kp-drawer`, css/components.css "Drawer, help and the tour") with
// the guided tour it opens into (`js/tour.js`, `.kp-tour`), all 22 themes in
// one demo judged through the review kit. One pick per aspect, as the meter
// and the trend tile: five aspects, each picked on its own from three
// options, composed freely on every stage's wrapper
// (`data-dt-shape`, `data-dt-openclose`, `data-dt-highlight`, `data-dt-card`,
// `data-dt-next`).
//
// The stages on this page are the package's own markup for the drawer
// (head/body/foot) and the tour's card, driven by this module rather than
// by `js/tour.js` itself — comparing 22 themes times three options needs up
// to a few dozen of these open at once side by side, which `startTour()`
// is not built for (it drives one tour over the real page). Nothing here
// changes `js/tour.js` or `css/components.css`: every option is CSS only,
// in `drawer.css` and its four theme-group files, keyed by the five
// attributes above, so any combination composes.

import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'openclose' | 'highlight' | 'card' | 'next'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The drawer’s plate, its frame, the head/body/foot dividers, and the edge that says the body still scrolls. Compare them as they stand.',
    },
    {
        id: 'openclose',
        label: 'How it opens and closes',
        about: 'The drawer’s arrival from the end edge and its leave — the leave is always the arrival played backwards. Press Open, then Closed.',
    },
    {
        id: 'highlight',
        label: 'The tour’s highlight',
        about: 'The ring on the part the tour talks about, and how the rest of the stage dims around it. Press Next once to see it move.',
    },
    {
        id: 'card',
        label: 'The tour’s step card',
        about: 'The card’s plate, its frame, its title and its foot.',
    },
    {
        id: 'next',
        label: 'Moving to the next step',
        about: 'What the card and the count do when Back, Skip or Next moves the tour to another step. Press Next.',
    },
];

/**
 * Per theme, three options for each aspect. Option 3 is always a third,
 * more inventive gamble, never a fade (no theme uses an opacity keyframe).
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The engraved plate',
                text: 'A ruled double frame in navy, the head’s title in the serif’s small capitals over a hairline, the body on faint ledger rules, the foot behind a heavier rule.',
            },
            {
                name: 'The ledger panel',
                text: 'A cream panel ruled like an open ledger: the head carries a printed running header, the body’s rules continue under the scroll, the foot is a torn perforation.',
            },
            {
                name: 'The certificate drawer',
                text: 'A navy guilloche border runs the full edge of the panel, the head sits on a brass-coloured rule, the body is plain vellum, the foot carries a ruled signature line.',
            },
        ],
        openclose: [
            {
                name: 'The drawer is drawn out',
                text: 'The panel slides in from the end edge at an even pace and settles with a short overshoot, like a drawer reaching its stop; closing draws it back the same way, in reverse.',
            },
            {
                name: 'The leaf is turned',
                text: 'The panel turns in from the end edge as if hinged on its outer corner, easing to flat; closing turns it away on the same hinge, in reverse.',
            },
            {
                name: 'Ruled open',
                text: 'The panel is ruled open where it stands: its frame rule start to end, then its head, its body and its foot 60 ms apart; closing takes the rules off, bottom first.',
            },
        ],
        highlight: [
            {
                name: 'The ruled margin note',
                text: 'A navy bracket rule is drawn around the target at each corner only, the rest of the stage behind a cream wash.',
            },
            {
                name: 'The engraved bracket',
                text: 'A double hairline frame, like an engraving’s crop marks, sits just outside the target; the stage behind darkens toward navy.',
            },
            {
                name: 'The wax seal ring',
                text: 'A round navy ring, like a pressed wax seal, centres on the target; the stage behind takes a sepia-navy wash.',
            },
        ],
        card: [
            {
                name: 'The index card',
                text: 'A cream card on a hairline frame, the title in small capitals over a rule, the foot behind a thinner rule.',
            },
            {
                name: 'The memorandum',
                text: 'A card headed like an internal memorandum, the title left-aligned in bold serif over a full-width rule, the foot right-aligned.',
            },
            {
                name: 'The certificate slip',
                text: 'A narrow navy border all round, the title centred in small capitals, a dotted rule above the foot.',
            },
        ],
        next: [
            {
                name: 'The leaf turns',
                text: 'The old text leans back and away as if turning a page while the new text turns in from the same edge; the count re-sets its digit at once.',
            },
            {
                name: 'The entry is carried forward',
                text: 'The card steps sideways toward the new target in one eased move while its text is replaced partway through the step; the count ticks up a beat later.',
            },
            {
                name: 'The seal is pressed again',
                text: 'The highlight ring tightens and releases on the new target like a seal being pressed, and the card’s text changes on that same beat.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The soft card',
                text: 'A white panel lifted on a soft shadow with a wide radius, the head and foot each a hair lighter than the body, the scroll edge a soft inner shadow.',
            },
            {
                name: 'The daylight pane',
                text: 'A pale sky wash tops the panel and fades toward the card colour by the body, the foot sits on a thin warm-grey rule.',
            },
            {
                name: 'The paper sheet',
                text: 'A sheet with a small radius and a lifted corner fold at the top of the head, faint writing rules run the body, the foot is a soft fold shadow.',
            },
        ],
        openclose: [
            {
                name: 'It slides on daylight',
                text: 'The panel slides in from the end edge while a soft highlight sweeps across its face in the same direction; closing slides it out while the sweep reverses.',
            },
            {
                name: 'It drifts in like a curtain',
                text: 'The panel eases in with a gentle overshoot and settle, as a light curtain drawn shut; closing eases it out with the same settle, reversed.',
            },
            {
                name: 'It lifts off the sheet',
                text: 'The panel rises in scale from 97% to 100% as it slides in, like a sheet lifted off a stack; closing shrinks it back to 97% as it slides out.',
            },
        ],
        highlight: [
            {
                name: 'The soft halo',
                text: 'A soft, wide halo of card-coloured light surrounds the target; the rest of the stage takes a gentle grey wash.',
            },
            {
                name: 'The daylight beam',
                text: 'A warm beam-shaped glow falls across the target from the upper corner; the rest of the stage dims to overcast grey.',
            },
            {
                name: 'The pencil circle',
                text: 'A thin, rounded pencil-like ring circles the target loosely, slightly off-centre; the stage behind takes a pale wash.',
            },
        ],
        card: [
            {
                name: 'The plain card',
                text: 'The tour card is a white card of 0.5 rem on all four corners, on the medium shadow, its title at 600.',
            },
            {
                name: 'The sunlit card',
                text: 'A white card with a warm top edge fading toward plain white by the foot, the title bold, the foot in a muted rule-free row.',
            },
            {
                name: 'The paper tab',
                text: 'A card with one corner turned up as a tab, the title set over a thin warm-grey underline, the foot airy with generous gaps.',
            },
        ],
        next: [
            {
                name: 'Re-exposed',
                text: 'On the next step the card goes into the glare for a beat and comes back into focus, in place.',
            },
            {
                name: 'The beam swings',
                text: 'The daylight beam swings like a spotlight from the old target to the new, slowing as it arrives; the card’s text changes once it stops.',
            },
            {
                name: 'The tab is peeled',
                text: 'The card lifts slightly, as a tab peeled up, moves to sit by the new target, and settles back down; the text changes at the settle.',
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The slate panel',
                text: 'A near-black slate panel with a soft inner glow at its edge, the head and foot separated by a faint luminous rule, the body plain.',
            },
            {
                name: 'The glass pane',
                text: 'A dark panel with a cool top sheen suggesting glass, a thin bright line marks the head/body join, the foot sits in deeper shadow.',
            },
            {
                name: 'The console tray',
                text: 'A charcoal panel with a thin amber-free blue rule framing the whole edge, the head carries a small status dot, the body on a subtle grid.',
            },
        ],
        openclose: [
            {
                name: 'It slides from the glow',
                text: 'A soft glow brightens at the end edge first, then the panel slides out of it to full width; closing slides the panel back into the glow, which fades last, reversed.',
            },
            {
                name: 'It rises from the floor',
                text: 'The panel rises up from the bottom edge of the viewport into place, as a console tray lifted into view; closing lowers it back down, reversed.',
            },
            {
                name: 'It unlatches',
                text: 'The panel rotates open a few degrees around its hinge edge before sliding flush, like a latch releasing; closing reverses the same two-part motion.',
            },
        ],
        highlight: [
            {
                name: 'The glow ring',
                text: 'A soft blue-white glow ring sits on the target; the rest of the stage drops several steps darker around it.',
            },
            {
                name: 'The laser outline',
                text: 'A thin bright outline traces the target’s exact edge, like a laser scan; the stage dims to near-black elsewhere.',
            },
            {
                name: 'The aperture',
                text: 'A circular dark vignette opens around the target like a camera aperture, leaving only it lit at full brightness.',
            },
        ],
        card: [
            {
                name: 'The glass tile',
                text: 'A dark tile with a faint top sheen, the title in a slightly brighter weight, the foot divided by a thin luminous rule.',
            },
            {
                name: 'The console readout',
                text: 'A near-black card with a thin blue top rule like a readout header, monospaced count, the foot right-aligned.',
            },
            {
                name: 'The aperture card',
                text: 'A dark card with rounded corners and a soft glow at its own edge, as if lit from within, the foot plain.',
            },
        ],
        next: [
            {
                name: 'The glow steps over',
                text: 'The glow ring dims on the old target and brightens on the new one a beat later, crossing in the dark between them; the card’s text changes as the new glow peaks.',
            },
            {
                name: 'The readout refreshes',
                text: 'The card’s text blinks out and back in like a readout refreshing (a hard cut, not a fade) while the count increments; the ring jumps to the new target on the same beat.',
            },
            {
                name: 'The aperture re-irises',
                text: 'The aperture closes to black and reopens on the new target, the card’s text changing while the aperture is closed.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The neon panel',
                text: 'A near-black panel edged in a thin magenta-to-cyan rule, the head carries a small glitch-glyph mark, the body on a faint scanline texture.',
            },
            {
                name: 'The holo tray',
                text: 'A holo plate on the large panels’ pair of cuts, 18 px at the top-end and bottom-start corners, a yellow rim glowing inward, scan lines at 135 degrees, a cyan rule along the head, the foot behind a dashed rule.',
            },
            {
                name: 'The data slab',
                text: 'A panel split by a thin diagonal magenta seam near the head, the body carries faint vertical data-column guides, the foot squared off hard.',
            },
        ],
        openclose: [
            {
                name: 'It glitches in',
                text: 'The panel snaps to full size in three quick jittered steps (position, not opacity) before settling; closing plays the same three steps in reverse.',
            },
            {
                name: 'It splits in',
                text: 'The panel is a yellow copy and a cyan copy until they meet: four ticks of 120 ms, 6, 4, 2, 1 px, the cuts kept at every tick, nothing travels; closing plays the same four ticks the other way round and is gone with the last.',
            },
            {
                name: 'It slots home',
                text: 'The panel arrives overshooting past its final position then snaps back, like hardware slotting into a rack; closing overshoots outward then snaps away, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The target brackets',
                text: 'Four cyan corner brackets close on the target and twitch twice as they lock; the rest of the stage drops to near-black.',
            },
            {
                name: 'The glitch bracket',
                text: 'Four corner brackets, cyan, jitter very slightly in position around the target; the stage behind takes a dark magenta tint.',
            },
            {
                name: 'The target reticle',
                text: 'A crosshair reticle with tick marks centres on the target, cyan on magenta; the stage dims hard around it.',
            },
        ],
        card: [
            {
                name: 'The holo card',
                text: 'A holo plate cut at its dossier corner, 14 px at top-end: a yellow rim glowing inward, scan lines, the title in a condensed bold, the foot split by a thin cyan rule.',
            },
            {
                name: 'The terminal popup',
                text: 'A dark card with a cyan single-pixel border, the title prefixed by a small glyph, the count in a monospaced tabular style.',
            },
            {
                name: 'The data chip',
                text: 'A small hard-edged card with a diagonal-cut top-left corner, magenta accents on the foot’s buttons, no softness anywhere.',
            },
        ],
        next: [
            {
                name: 'The reticle snaps',
                text: 'The reticle jump-cuts to the new target in one frame (no travel), and the card’s text changes on the same frame; the count flickers once before settling.',
            },
            {
                name: 'The glitch cuts over',
                text: 'The card jitters sideways in three quick steps while its text swaps mid-jitter, like a signal cutting to a new feed; the ring follows on the last step.',
            },
            {
                name: 'The step splits in',
                text: 'The card is a yellow copy and a cyan copy until they meet with every step: four ticks of 120 ms, 6, 4, 2, 1 px, as the new text appears; the brackets lock on the new target.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The outrun panel',
                text: 'A panel with a sunset-gradient top band (magenta to orange) over a near-black body, a thin neon-pink rule divides head from body.',
            },
            {
                name: 'The sunset tray',
                text: 'A panel whose body carries a faint horizon-grid pattern fading toward the foot, the head sits on a glowing pink rule.',
            },
            {
                name: 'The grid slab',
                text: 'A panel edged in a single glowing cyan line all round, perspective grid lines faintly cross the body, the foot squared.',
            },
        ],
        openclose: [
            {
                name: 'It rolls up over the horizon',
                text: 'The panel rises from below as if rolling up over a horizon line, the grid pattern scrolling with it; closing rolls it back down below the horizon, reversed.',
            },
            {
                name: 'It slides on the grid',
                text: 'The panel slides in from the end edge while its internal grid lines slide at a different rate, giving a parallax feel; closing reverses both rates.',
            },
            {
                name: 'It drops from the sun',
                text: 'The panel scales up from a small glowing point near the top, like dropping from a neon sun, to full size; closing scales back down into that point, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The neon tube ring',
                text: 'A glowing magenta tube-light ring, with a faint outer halo, surrounds the target; the stage dims toward deep purple.',
            },
            {
                name: 'The horizon beam',
                text: 'A wide pink-to-orange beam crosses behind the target like a sunset band; the rest of the stage goes near-black.',
            },
            {
                name: 'The grid cell',
                text: 'The target sits in one lit cell of the perspective grid while every other cell dims; the lit cell’s lines glow cyan.',
            },
        ],
        card: [
            {
                name: 'The neon sign',
                text: 'A dark card with a glowing magenta double-rule border, the title in a tall condensed style, the foot on a cyan underline.',
            },
            {
                name: 'The dashboard readout',
                text: 'A near-black card with a gradient top strip (pink to orange), tabular count, the foot plain and dark.',
            },
            {
                name: 'The arcade marquee',
                text: 'A card with a scalloped-looking top rule (a repeating dot pattern) in neon pink, bold centred title, cyan foot rule.',
            },
        ],
        next: [
            {
                name: 'The tube relights',
                text: 'The neon ring dims out on the old target and relights on the new one a beat later, with a brief double-flicker as it catches; the card’s text changes on the relight.',
            },
            {
                name: 'The beam sweeps',
                text: 'The horizon beam sweeps sideways from the old target’s position to the new one, the card riding along with it; the text changes once the sweep stops.',
            },
            {
                name: 'The marquee recycles',
                text: 'The card’s dot-rule border scrolls once like a marquee chase as the text changes; the grid cell highlight jumps to the new target at the same moment.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The candy card',
                text: 'A soft pastel-pink panel with a large radius, the head a slightly deeper pastel band, the foot a thin pastel-blue rule.',
            },
            {
                name: 'The bubble tray',
                text: 'A very round panel (almost pill-shaped corners) in mint, small bubble-shaped accents sit at the head’s corners, the foot plain.',
            },
            {
                name: 'The macaron slab',
                text: 'A panel in two stacked pastel tones (lilac head, cream body), a thin wavy-looking rule (a repeating soft curve) divides them.',
            },
        ],
        openclose: [
            {
                name: 'It bounces in',
                text: 'The panel slides in and overshoots past its stop before settling back, a gentle bounce; closing plays the bounce in reverse on the way out.',
            },
            {
                name: 'It unrolls like ribbon',
                text: 'The panel grows from a thin strip at the end edge up to full width, like ribbon unrolled; closing rolls it back to that thin strip, reversed.',
            },
            {
                name: 'It pops open',
                text: 'The panel scales in from 92% with a quick springy overshoot to 100%, like a bubble popping open; closing shrinks back through the same overshoot, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The bubble ring',
                text: 'A chunky, rounded pastel-pink ring with a slight wobble in its outline surrounds the target; the stage softens to a pale wash.',
            },
            {
                name: 'The crayon circle',
                text: 'A hand-drawn-looking wobbly circle in pastel-blue loops around the target; the rest of the stage dims only slightly, kept gentle.',
            },
            {
                name: 'The sticker halo',
                text: 'A soft round sticker shape with a thin white outline sits behind the target; the stage behind takes a candy-pale wash.',
            },
        ],
        card: [
            {
                name: 'The sticky-note bubble',
                text: 'A pastel-yellow rounded card tilted a couple of degrees, the title in a friendly medium weight, the foot plain.',
            },
            {
                name: 'The balloon tag',
                text: 'A very round pastel-mint card, the title centred, a small round tail shape at one bottom corner pointing at the target.',
            },
            {
                name: 'The macaron card',
                text: 'A two-tone card (lilac top half, cream bottom), a wavy divider, the count in a soft rounded numeral style.',
            },
        ],
        next: [
            {
                name: 'The bubble hops',
                text: 'The ring hops in a small arc from the old target to the new one, landing with a soft bounce; the card’s text changes on the landing.',
            },
            {
                name: 'The ribbon slides',
                text: 'The highlight slides smoothly along an invisible ribbon path between targets while the card tilts slightly during the move and settles flat on arrival, text changed.',
            },
            {
                name: 'The sticker peels',
                text: 'The old sticker shape lifts slightly and slides off while a new one slides on from the same side; the card’s text swaps as the new sticker lands.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The CRT panel',
                text: 'A black panel with a bright green single-pixel border, the head is a reverse-video bar, the body on faint scanlines, the foot a dashed rule.',
            },
            {
                name: 'The box-drawn tray',
                text: 'A panel framed in ASCII-style box-drawing corners (drawn as borders, not characters), the head/body/foot divided by single lines, monospace throughout.',
            },
            {
                name: 'The man-page slab',
                text: 'A panel styled like a terminal pager: the head bold reverse-video, the body plain black, the foot a status line in reverse-video.',
            },
        ],
        openclose: [
            {
                name: 'It types open',
                text: 'The panel’s width grows left to right in small steps as if being typed, reaching full width; closing shrinks it right to left in the same steps, reversed.',
            },
            {
                name: 'It scrolls up from the prompt',
                text: 'The panel rises from the bottom in discrete line-height steps, like terminal output scrolling up; closing drops back down in the same steps, reversed.',
            },
            {
                name: 'It is piped in',
                text: 'The panel slides in at a constant hard-edged speed with no easing, like a pipe writing fixed-rate output; closing slides out at the same constant rate, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The cursor box',
                text: 'A blocky green cursor-style rectangle outlines the target with a hard blink (on/off, not fade); the stage dims to black elsewhere.',
            },
            {
                name: 'The ASCII bracket',
                text: 'Corner brackets drawn like box-drawing characters sit at the target’s corners; the rest of the stage goes to a dim grey-green.',
            },
            {
                name: 'The grep highlight',
                text: 'The target gets a solid reverse-video block behind it, as a grep match is highlighted; everything else dims to near-black.',
            },
        ],
        card: [
            {
                name: 'The man-page box',
                text: 'A black card with a green border, reverse-video title bar, the foot a status line with the count left-aligned.',
            },
            {
                name: 'The tooltip prompt',
                text: 'A card prefixed with a `$` style glyph before the title, monospace throughout, the foot a dashed separator above the buttons.',
            },
            {
                name: 'The log line',
                text: 'A card styled like a single highlighted log entry: a left accent bar in green, the title bold, the count right-aligned in brackets.',
            },
        ],
        next: [
            {
                name: 'The cursor retypes',
                text: 'The old text clears in a block and the new text types in character-step fashion (position reveal, not opacity) as the cursor box jumps to the new target.',
            },
            {
                name: 'The prompt reprints',
                text: 'The card’s reverse-video bar flashes once (hard on/off) as the text swaps; the highlight jump-cuts to the new target on the same flash.',
            },
            {
                name: 'The grep rehighlights',
                text: 'The old reverse-video block switches off and the new one switches on a beat later at the new target, with the card’s text changing between the two.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The bark panel',
                text: 'A deep-brown panel with a rough-edged (irregular, organic) border, the head a mossy-green band, the body plain, the foot a root-like tapered rule.',
            },
            {
                name: 'The leaf-litter tray',
                text: 'A panel in warm brown with small leaf-shaped accents at the head’s corners, a thin twig-brown rule divides body from foot.',
            },
            {
                name: 'The canopy slab',
                text: 'A panel whose head carries a dappled-light pattern (soft irregular patches), the body a plain deep green, the foot a root-tangle border.',
            },
        ],
        openclose: [
            {
                name: 'It grows out from the trunk',
                text: 'The panel grows out of its edge, far side first, clipped at the edge, on forest’s growth curve in 1000 ms (never squashed); closing is that growth reversed.',
            },
            {
                name: 'It unfurls like a leaf',
                text: 'The panel rotates open from a folded quarter-width state, unfurling to flat, like a leaf opening; closing refolds it, reversed.',
            },
            {
                name: 'It is pulled from the undergrowth',
                text: 'The panel rises from below while swaying very slightly side to side as it settles, like being pulled up through undergrowth; closing lowers it with the same sway, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The lichen ring',
                text: 'An irregular, mottled green-grey ring (not a perfect circle) surrounds the target; the stage dims to a shaded-canopy green.',
            },
            {
                name: 'The knot-hole circle',
                text: 'A dark, slightly uneven wood-knot shaped ring frames the target; the rest of the stage goes to deep bark brown.',
            },
            {
                name: 'The moss halo',
                text: 'A soft, textured moss-green halo (irregular edge) glows around the target; the stage dims to forest-floor brown elsewhere.',
            },
        ],
        card: [
            {
                name: 'The leaf tag',
                text: 'A card with one corner shaped like a leaf tip, green-brown gradient edge, the title in a warm earthy weight.',
            },
            {
                name: 'The bark plaque',
                text: 'A brown card with a rough-textured top rule (an irregular pattern), the title centred, the foot plain.',
            },
            {
                name: 'The mushroom cap',
                text: 'A rounded card wider at the top than the bottom (a cap silhouette), cream body, brown-green rule at the foot.',
            },
        ],
        next: [
            {
                name: 'The ring is drawn',
                text: 'A thin growth ring is drawn once round the card, clockwise from the top, then fades, while the card’s text changes; the card itself never swells.',
            },
            {
                name: 'The leaf turns',
                text: 'The card rotates slightly as if a leaf catching a breeze while sliding to the new target, settling flat with new text.',
            },
            {
                name: 'The cap tilts',
                text: 'The mushroom-cap card tilts a few degrees and back as it moves between targets, the text swapping at the midpoint tilt.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'The stark panel',
                text: 'A pure-white panel with a 4px solid black border, the head/body/foot divided by thick black rules, nothing soft anywhere.',
            },
            {
                name: 'The block tray',
                text: 'A black panel with a thick white border and a solid white head band carrying black text, maximum contrast throughout.',
            },
            {
                name: 'The placard slab',
                text: 'A white panel with a black border only on the head and foot (not the sides), bold black rules, no shadows.',
            },
        ],
        openclose: [
            {
                name: 'It snaps open',
                text: 'The panel appears at full size in a single hard step with no easing (an instant cut) after sliding the short final distance; closing reverses the same hard step.',
            },
            {
                name: 'It slides on a hard edge',
                text: 'The panel slides in at a constant linear speed with a hard stop (no overshoot, no ease); closing slides out at the same constant speed, reversed.',
            },
            {
                name: 'It is slotted in',
                text: 'The panel’s border thickens from thin to full as it slides into place, like a frame being bolted on; closing thins the border back down as it slides out, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The thick ring',
                text: 'A heavy 6px black ring (or white on the dark stage) surrounds the target squarely; the rest of the stage goes solid grey, no gradient.',
            },
            {
                name: 'The hazard bracket',
                text: 'Thick diagonal-striped corner brackets (black/white, like hazard tape) mark the target’s corners; the stage dims to flat mid-grey elsewhere.',
            },
            {
                name: 'The crosshair',
                text: 'A bold crosshair in solid black (or white) with no gaps centres on the target; the rest of the stage is flat and dark.',
            },
        ],
        card: [
            { name: 'The placard', text: 'A white card with a 3px black border, bold black title, a thick rule above the foot.' },
            {
                name: 'The index card',
                text: 'A card with a solid black head bar (white text) and a plain white body, the foot plain with a thick top rule.',
            },
            {
                name: 'The stencil tag',
                text: 'A card with notched corners (stencil-style cuts) and a heavy black outline, bold uppercase-looking title treatment via weight.',
            },
        ],
        next: [
            {
                name: 'The ring thickens on the next',
                text: 'The ring on the old target thins to nothing in one hard step while the new target’s ring appears at full thickness in the next step; the card text swaps on the second step.',
            },
            {
                name: 'The bracket jumps',
                text: 'The corner brackets jump in a single hard cut to the new target’s corners, no travel; the card’s text changes on the same cut.',
            },
            {
                name: 'The crosshair recentres',
                text: 'The crosshair’s arms retract to a point and re-extend on the new target in two hard steps; the card’s text changes between the two steps.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The aged panel',
                text: 'A warm cream panel with a vignette darkening at its corners, the head a deeper sepia band, a faint foxing-spot texture in the body.',
            },
            {
                name: 'The parchment tray',
                text: 'A panel with a slightly uneven (deckle-edge-looking) border, the body carries faint aged creases, the foot a worn brown rule.',
            },
            {
                name: 'The daguerreotype slab',
                text: 'A panel framed like an old photograph mat, a double brown rule at the head, the body plain aged cream, the foot a thin tarnished-looking rule.',
            },
        ],
        openclose: [
            {
                name: 'It is drawn from a sleeve',
                text: 'The panel slides out from behind a slightly darker sleeve-shaped edge at the hinge side; closing slides it back behind that edge, reversed.',
            },
            {
                name: 'It unrolls like a scroll',
                text: 'The panel unrolls in height from a thin band at the top down to full height, like unrolling a scroll; closing rolls it back up to that band, reversed.',
            },
            {
                name: 'It swings on a hinge',
                text: 'The panel swings in from a vertical hinge at its outer edge with a slight settle-wobble; closing swings it back out the same way, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The ink-blot ring',
                text: 'An irregular brown ink-blot-shaped ring (not a clean circle) surrounds the target; the stage dims with a heavier vignette.',
            },
            {
                name: 'The pencil halo',
                text: 'A soft, slightly uneven pencil-sketch ring circles the target; the rest of the stage fades to a dim sepia wash.',
            },
            {
                name: 'The brass loupe circle',
                text: 'A round ring like a magnifying loupe’s rim, with a faint inner glass sheen, frames the target; the stage dims around it.',
            },
        ],
        card: [
            {
                name: 'The postcard',
                text: 'A cream card with a thin brown double rule border, the title in a warm serif, the foot carrying a small stamp-corner notch.',
            },
            {
                name: 'The index card',
                text: 'A card with a faint ruled line under the title (as a library index card), aged-paper texture, the foot plain.',
            },
            { name: 'The ticket stub', text: 'A card with notched edges on both sides and a dashed tear-line near the foot, brown ink throughout.' },
        ],
        next: [
            {
                name: 'The ink dries anew',
                text: 'The old ink-blot ring fades its edge inward (via scale, not opacity) while a new blot grows on the new target; the card’s text changes once the new blot settles.',
            },
            {
                name: 'The scroll advances',
                text: 'The card slides along a shelf-like path to the new target while a faint page-turn tilt plays, the text changing at the tilt’s peak.',
            },
            {
                name: 'The stub is stamped again',
                text: 'The card’s border flashes to a heavier weight and back (a stamp impression) as the text changes, then the loupe ring jumps to the new target.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The drafting panel',
                text: 'The drawer is an overlay sheet over the page: the popover’s ground in one steel frame, no shadow, no grid and no cyan frame; the head over a rule.',
            },
            {
                name: 'The vellum tray',
                text: 'A panel in slightly lighter navy with a thin cyan border and corner registration marks (small crosses), the foot a dashed cyan rule.',
            },
            {
                name: 'The drawing-board slab',
                text: 'A panel pinned-looking at its corners (small circular pin marks), the body on a coarser grid, the head a solid cyan-on-navy bar.',
            },
        ],
        openclose: [
            {
                name: 'It is drawn out on its rail',
                text: 'The panel slides in along a visible thin cyan rail-line at its edge, snapping to grid-aligned stops; closing slides it back along the rail, reversed.',
            },
            {
                name: 'It unrolls from the tube',
                text: 'The drawer is drawn: the pen traces its outline from its corner, along the top, down the end, back along the foot and up the start, then the panel is inked; closing is that played backwards; 5 units (800 ms).',
            },
            {
                name: 'It is pinned open',
                text: 'The panel drops in from above and is “pinned” at its top corners with a tiny settle-bounce; closing lifts it back up and away, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The dimension ring',
                text: 'What the tour talks about is pointed out: two amber witness lines at its ends and a ruler with a pointer at each end; no veil over the rest, no ring.',
            },
            {
                name: 'The compass circle',
                text: 'A thin cyan circle with a small centre cross, as drawn with a compass, frames the target; the rest of the stage dims.',
            },
            {
                name: 'The crosshair bracket',
                text: 'A cyan crosshair with corner tick brackets (like a drafting crosshair) centres on the target; the stage dims to navy elsewhere.',
            },
        ],
        card: [
            {
                name: 'The callout tag',
                text: 'The step card is an overlay sheet: one steel frame, no shadow, the title upright with no coloured edge.',
            },
            {
                name: 'The title-block card',
                text: 'A card styled like a drawing’s title block: a ruled grid of small cells behind the title, the count in a tabular cyan numeral.',
            },
            {
                name: 'The detail bubble',
                text: 'A round card (a detail-callout bubble) with a thin cyan ring border, the title centred, the foot plain.',
            },
        ],
        next: [
            {
                name: 'The leader redraws',
                text: 'A cyan leader line draws itself (via a stroke-length reveal, not opacity) from the old target to the new one, and the card’s text changes as the line completes.',
            },
            {
                name: 'The compass swings',
                text: 'The compass ring’s radius line sweeps like a compass arm from the old angle to the new target’s angle; the text changes once the sweep stops.',
            },
            {
                name: 'The callout retargets',
                text: 'The step count is read again: it is written at once and a pointer on a ruler under it slides from the old step to the new one on the plotter’s feed, 6 units; the card does not shove.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The amber panel',
                text: 'A warm amber-to-cream gradient panel, the head a deeper amber band, the body plain, a long soft shadow trails from the foot.',
            },
            {
                name: 'The sundial tray',
                text: 'A panel with a faint radiating-line pattern (like a sundial face) in the head, the body plain cream, the foot a thin amber rule.',
            },
            {
                name: 'The horizon slab',
                text: 'A panel whose body carries a low horizontal glow band near its foot, the head a solid warm amber, a long shadow stretches from one side.',
            },
        ],
        openclose: [
            {
                name: 'It rises like the sun',
                text: 'The panel rises from below the edge while its amber glow brightens as it climbs, reaching full warmth at the top of its travel; closing dims and sinks back, reversed.',
            },
            {
                name: 'It slides over the horizon',
                text: 'The panel slides in from the end edge while a glow band sweeps across it in the same direction, like light crossing a horizon; closing slides out while the glow sweeps back, reversed.',
            },
            {
                name: 'It swings on warm light',
                text: 'The panel swings in on a hinge while the long shadow it casts swings with it to the opposite angle; closing swings both back together, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The sun-ring halo',
                text: 'A warm amber ring with a soft outer glow surrounds the target; the stage dims toward dusk, the glow strongest nearest the target.',
            },
            {
                name: 'The shadow arc',
                text: 'A long, low shadow arcs away from the target like a sundial’s gnomon shadow, pointing the eye to it; the stage dims elsewhere.',
            },
            {
                name: 'The amber bracket',
                text: 'Warm amber corner brackets sit at the target’s corners, each casting a short shadow of its own; the stage dims to dusk around it.',
            },
        ],
        card: [
            {
                name: 'The sundial tag',
                text: 'A cream card with a thin amber radiating-line motif along the top, the title centred in a warm weight, the foot plain.',
            },
            {
                name: 'The horizon card',
                text: 'A card with a low amber glow band across its foot, the title bold, the count in a warm tabular numeral.',
            },
            {
                name: 'The amber plaque',
                text: 'A card with a solid amber top rule and a long soft shadow of its own beneath it, the title left-aligned.',
            },
        ],
        next: [
            {
                name: 'The arc advances',
                text: 'The shadow arc sweeps like a sundial’s shadow from the old angle to the new target’s angle, the card’s text changing as the sweep completes.',
            },
            {
                name: 'The halo swings',
                text: 'The sun-ring halo brightens on the old target, dims, then brightens again on the new target like the sun crossing between them; the text changes at the dim point.',
            },
            {
                name: 'The plaque relights',
                text: 'The card’s amber top rule dims and relights (a brightness step, not opacity) as its text changes, then the shadow arc resets toward the new target.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The concrete panel',
                text: 'A raw grey panel with a thick black border and a hard offset shadow (no blur), the head a solid black bar, the body plain unpainted-looking grey.',
            },
            {
                name: 'The shutter tray',
                text: 'A panel with a corrugated-looking head (repeating thin ridges), a heavy black foot bar, square corners throughout.',
            },
            {
                name: 'The slab of poured stock',
                text: 'A panel with visible “form-tie” marks (small square dots in a grid) faintly across the body, a thick black rule at the head only.',
            },
        ],
        openclose: [
            {
                name: 'It is forced open on its rail',
                text: 'The panel slides in with a hard, slightly jerky stepped motion (like forced machinery) and a loud final stop (a hard offset shadow snapping to size); closing reverses the same jerky steps.',
            },
            {
                name: 'It drops like a shutter',
                text: 'The panel drops down from above in one hard linear motion with no easing, like a roller shutter; closing lifts it straight back up, reversed.',
            },
            {
                name: 'It is cranked out',
                text: 'The panel extends in small ratcheting steps (several discrete positions) as if cranked out by hand; closing retracts through the same steps, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The rebar ring',
                text: 'A thick black ring with small perpendicular tick marks (like exposed rebar ends) surrounds the target; the stage flattens to grey elsewhere.',
            },
            {
                name: 'The stencil bracket',
                text: 'Heavy stencil-cut corner brackets (notched, industrial) frame the target; the rest of the stage goes flat dark grey.',
            },
            {
                name: 'The hazard frame',
                text: 'A thick black-and-yellow striped frame (hazard-marking style) outlines the target; the stage dims to flat grey around it.',
            },
        ],
        card: [
            {
                name: 'The stencilled tag',
                text: 'The tour card is a slab: a 3px black line on the 6px hard shadow, square, bold condensed title; the stencil notch is gone.',
            },
            {
                name: 'The hazard card',
                text: 'A card with a black-and-yellow striped top rule, bold black title, the count in heavy tabular digits.',
            },
            {
                name: 'The poured plaque',
                text: 'A card with visible form-tie dot texture and a thick single black rule above the foot, no rounding anywhere.',
            },
        ],
        next: [
            {
                name: 'The bracket jumps a notch',
                text: 'The stencil brackets jump in one hard step to the new target’s corners (no travel, no ease); the card’s text swaps on the same hard step.',
            },
            {
                name: 'The shutter re-drops',
                text: 'The card drops a short distance and re-rises hard at the new position, like a shutter cycling; the text changes while it is down.',
            },
            {
                name: 'The frame re-clamps',
                text: 'The frame is lifted off its footprint and set down again on the new target, 300 ms: up on the lifting curve, down on the fall; the card’s text changes at the top.',
            },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The gilt panel',
                text: 'A black panel with a thin gold double-rule border, the head carries a gold chevron motif, the body plain, the foot a gold sunburst fades into the corner.',
            },
            {
                name: 'The fan-motif tray',
                text: 'A panel with a repeating fan-pleat pattern (a series of radiating lines) along the head, lacquered black body, gold foot rule.',
            },
            {
                name: 'The lacquered slab',
                text: 'A deep lacquer-black panel with a single bold gold vertical accent at the hinge edge, geometric stepped corners (not rounded).',
            },
        ],
        openclose: [
            {
                name: 'It glides open on a gilt rail',
                text: 'The panel slides in along a gold rail-line at its edge with a smooth, confident glide; closing glides it back along the same rail, reversed.',
            },
            {
                name: 'It unfolds like a fan',
                text: 'The panel’s width expands from a folded pleat at the hinge edge to full width, like a fan opening; closing collapses it back to that pleat, reversed.',
            },
            {
                name: 'It rises behind a sunburst',
                text: 'A gold sunburst motif flashes briefly at the edge (a stroke-length reveal) just before the panel slides in from behind it; closing slides the panel away then the sunburst retreats, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The sunburst ring',
                text: 'A gold ring with short radiating lines like a sunburst surrounds the target; the stage dims to deep lacquer-black.',
            },
            {
                name: 'The chevron bracket',
                text: 'Gold chevron-shaped corner brackets (stepped, angular) frame the target; the rest of the stage dims to black.',
            },
            {
                name: 'The gilt circle',
                text: 'A simple, elegant thin gold circle with a slightly thicker inner line centres on the target; the stage dims around it.',
            },
        ],
        card: [
            {
                name: 'The marquee tag',
                text: 'A black card with a gold double-rule border and a small fan motif at one corner, the title in a tall geometric weight.',
            },
            { name: 'The lacquered card', text: 'A glossy-looking black card with a single bold gold top rule, centred title, the foot plain.' },
            {
                name: 'The fan-fold ticket',
                text: 'A card with a pleated-looking top edge (a repeating angular pattern) in gold, the count in elegant tabular digits.',
            },
        ],
        next: [
            {
                name: 'The sunburst re-rays',
                text: 'The sunburst ring’s rays retract toward the centre on the old target then extend outward again on the new one; the card’s text changes as the rays extend.',
            },
            {
                name: 'The fan refolds',
                text: 'The card folds slightly (a pleat-like skew) as it slides to the new target and unfolds flat on arrival, text changed on the unfold.',
            },
            {
                name: 'The chevron resets',
                text: 'The chevron brackets step inward then back outward onto the new target’s corners in two angular hops; the card’s text changes between the hops.',
            },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The spectral panel',
                text: 'A pale, slightly translucent-looking panel (achieved with a soft inner shadow, not opacity) with an indistinct, softly feathered border, the head barely distinguished from the body.',
            },
            {
                name: 'The fog-bank tray',
                text: 'A panel whose edges blur softly outward (a wide soft shadow standing in for fog) rather than a hard line, the body plain pale grey.',
            },
            {
                name: 'The veil slab',
                text: 'A panel with a faint, uneven wavering edge (a subtle irregular border) as if seen through a veil, the foot fading softly into the stage.',
            },
        ],
        openclose: [
            {
                name: 'It seeps in through the edge',
                text: 'The panel grows inward from a thin sliver at the end edge, its own edge staying soft throughout, like mist seeping in; closing recedes back to that sliver, reversed.',
            },
            {
                name: 'It rises like mist',
                text: 'The panel drifts upward into place with a slight waver (a gentle side-to-side sway) rather than a straight line, like rising mist; closing drifts back down with the same waver, reversed.',
            },
            {
                name: 'It is drawn by an unseen hand',
                text: 'The panel slides in slightly unevenly — pausing very briefly partway — as if drawn by an unseen hand; closing reverses the same uneven pause.',
            },
        ],
        highlight: [
            {
                name: 'The pale halo',
                text: 'A very soft, wide, pale ring (via a broad soft shadow) surrounds the target, barely distinct from the stage; the rest of the stage dims only slightly.',
            },
            {
                name: 'The vapour ring',
                text: 'A wavering, slightly uneven ring (an irregular soft outline) circles the target as if made of vapour; the stage dims to a muted grey.',
            },
            {
                name: 'The faint bracket',
                text: 'Barely-there corner brackets, pale and thin, mark the target’s corners; the stage dims only a little, kept hushed.',
            },
        ],
        card: [
            {
                name: 'The apparition tag',
                text: 'A pale, soft-edged card (a wide, gentle shadow instead of a hard border) with a faint title, the foot barely separated from the body.',
            },
            { name: 'The veiled card', text: 'A card with a subtly uneven edge and a muted title weight, the count in a soft grey, the foot plain.' },
            {
                name: 'The faint plaque',
                text: 'A card with only the faintest hint of a border (a hairline at very low contrast) and generous pale space around its title.',
            },
        ],
        next: [
            {
                name: 'The halo drifts on',
                text: 'The pale halo drifts slowly from the old target to the new one along a slightly wavering path, the card’s text changing partway through the drift.',
            },
            {
                name: 'The vapour reshapes',
                text: 'The vapour ring’s uneven outline slowly reshapes itself from the old target’s form into the new target’s form; the card’s text changes as the reshape finishes.',
            },
            {
                name: 'The veil resettles',
                text: 'The card wavers very slightly as it moves to the new target, as if a veil resettling, and its text changes once the waver stops.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The bold-type panel',
                text: 'A panel with a thick black border and a solid black head bar carrying the title in a huge bold weight, the body plain white.',
            },
            {
                name: 'The poster tray',
                text: 'A panel with an oversized, cropped-looking title that bleeds slightly past the head’s edge, the body plain, a heavy black foot rule.',
            },
            {
                name: 'The block slab',
                text: 'A panel with no border at all, relying on a hard colour block (solid black head, solid white body) for its shape, square corners.',
            },
        ],
        openclose: [
            {
                name: 'It slams open',
                text: 'The panel appears at full size with a single hard, fast slide and an abrupt stop (no easing, no overshoot); closing slides out just as abruptly, reversed.',
            },
            {
                name: 'It is printed',
                text: 'The panel does not travel: it is printed where it stands in black and its red plate falls into register on it along the closing spiral, clockwise, in 8 units; closing plays that fall backwards.',
            },
            {
                name: 'It is stamped down',
                text: 'The panel scales from 90% to 100% in one fast, hard step (no bounce) as it slides in, like a stamp striking; closing scales back down to 90% as it slides out, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The thick-rule ring',
                text: 'A very thick black ring (bold, blocky) surrounds the target with no softness; the rest of the stage goes flat and dark.',
            },
            {
                name: 'The block bracket',
                text: 'Solid black block-shaped corner brackets (filled rectangles, not lines) sit at the target’s corners; the stage dims to flat grey elsewhere.',
            },
            {
                name: 'The poster frame',
                text: 'A heavy black frame, uneven in thickness (thicker at top, like a poster’s header), surrounds the target; the stage dims flat.',
            },
        ],
        card: [
            {
                name: 'The headline tag',
                text: 'A card with a huge bold title that nearly fills its width, thick black border, the foot plain and small by contrast.',
            },
            { name: 'The poster card', text: 'A card with a solid black band behind the title (reverse video), the count in bold tabular digits.' },
            { name: 'The stamp chip', text: 'A small, square, heavily bordered card with the title set tight and bold, no decoration.' },
        ],
        next: [
            {
                name: 'The rule re-stamps',
                text: 'The thick ring vanishes in a hard cut and reappears at full thickness on the new target in the next frame; the card’s text changes on that same cut.',
            },
            {
                name: 'The block re-slams',
                text: 'The card slams a short distance toward the new target in one hard move and stops dead, text changed on the stop.',
            },
            {
                name: 'The frame re-snaps',
                text: 'The block brackets snap from the old target’s corners directly to the new ones with no travel; the card’s text changes on the snap.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The bulkhead panel',
                text: 'A dark grey panel with visible rivet-dot marks along its border, a warning-yellow thin rule at the head, the body plain gunmetal.',
            },
            {
                name: 'The rivet tray',
                text: 'A moulded plate with rivet-dots along its edge, a stencilled-looking head title, the foot ruled in the case’s ink.',
            },
            {
                name: 'The stencilled hatch slab',
                text: 'A panel shaped like a ship’s hatch (slightly bevelled corners), a stencil-cut-looking title in the head, warning stripes along the foot edge.',
            },
        ],
        openclose: [
            {
                name: 'It slides on a hatch rail with a hiss',
                text: 'The panel slides in along a visible rail groove at its edge with a mechanical, slightly uneven speed (fast then catching); closing slides back along the rail the same uneven way, reversed.',
            },
            {
                name: 'Drawn by the raster',
                text: 'The raster writes the panel from its top edge down, a quarter per 80 ms frame, a bright beam at the edge of what is written (320 ms); closing is that draw backwards, the beam climbing; nothing swings or pops.',
            },
            {
                name: 'It is cranked out by a winch',
                text: 'The panel extends in slow, even, slightly jerky increments (several small steps) as if winched out; closing retracts through the same increments, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The amber-CRT ring',
                text: 'An amber ring in an old CRT-readout style, with a faint scanline across it, surrounds the target; the stage dims to gunmetal grey.',
            },
            {
                name: 'The stencil bracket',
                text: 'The target is framed 2 px in the case’s ink; the rest of the stage dims to dark grey.',
            },
            {
                name: 'The warning-strobe halo',
                text: 'A warning-yellow ring that pulses in brightness (not opacity) like a strobe surrounds the target; the stage dims around it.',
            },
        ],
        card: [
            {
                name: 'The manifest tag',
                text: 'A moulded card with a top rule in the case’s ink and a stencilled-looking title, the foot plain.',
            },
            {
                name: 'The console card',
                text: 'A card styled like an old ship console readout: amber monospace title, tabular amber count, gunmetal body.',
            },
            {
                name: 'The stencil plate',
                text: 'A card with a stencil-cut notch at one corner and a warning-stripe accent on the foot, bold utilitarian title.',
            },
        ],
        next: [
            {
                name: 'The amber ring re-sweeps',
                text: 'A faint scanline sweeps once across the amber ring as it jumps from the old target to the new one; the card’s text changes as the sweep finishes.',
            },
            {
                name: 'The strobe re-pulses',
                text: 'The warning-yellow ring pulses twice in brightness on the old target before the whole highlight relocates to the new one; the card’s text changes on the relocation.',
            },
            {
                name: 'The stencil replate',
                text: 'The card’s stencil-cut corner flashes briefly brighter (a hard brightness step) as its text changes, then the amber ring jumps to the new target.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The brushed-metal panel',
                text: 'A cool grey panel with a fine brushed-metal texture (subtle directional streaks) across the body, a machined bevel-edge rule divides head from body, the foot squared with a small chamfer.',
            },
            {
                name: 'The machined tray',
                text: 'A panel with a precise, thin double rule at the head (like a machined groove), the body plain satin-grey, the foot a single fine rule.',
            },
            {
                name: 'The anodised slab',
                text: 'A panel with a very subtle cool-blue anodised sheen across its top edge fading to plain grey by the foot, crisp square corners throughout.',
            },
        ],
        openclose: [
            {
                name: 'It slides on a machined rail',
                text: 'The panel slides in from the end edge along a precise, perfectly even speed with a crisp final stop (a very slight bevel-edge highlight sweeping along as it moves); closing slides out at the same even speed, reversed.',
            },
            {
                name: 'It is drawn out like a drawer on its glide',
                text: 'The panel slides out with a confident, slightly weighted ease-out (as metal drawer glides settle), its bevel edge catching a brief highlight at the stop; closing eases back in the same weighted way, reversed.',
            },
            {
                name: 'It pivots on a hinge pin',
                text: 'The panel rotates in from its outer edge around a implied hinge pin, easing to flat with a crisp, precise stop; closing rotates back out the same way, reversed.',
            },
        ],
        highlight: [
            {
                name: 'The machined ring',
                text: 'A crisp, thin metallic ring with a subtle bevel-highlight on its upper edge surrounds the target; the stage dims to a cool satin grey.',
            },
            {
                name: 'The bevel bracket',
                text: 'Precise corner brackets with a small chamfered-corner look frame the target; the rest of the stage dims to flat grey.',
            },
            {
                name: 'The anodised halo',
                text: 'A faint cool-blue anodised-looking halo surrounds the target; the stage dims to grey elsewhere, the halo the only colour note.',
            },
        ],
        card: [
            {
                name: 'The machined tag',
                text: 'A satin-grey card with a crisp bevel-edge border, the title in a precise medium weight, the foot plain.',
            },
            { name: 'The bevel card', text: 'A card with a fine chamfered-corner look and a single thin rule above the foot, cool and understated.' },
            { name: 'The anodised chip', text: 'A small card with a faint cool-blue sheen along its top edge, the title centred, the foot plain.' },
        ],
        next: [
            {
                name: 'The bevel re-cuts',
                text: 'A thin highlight sweeps once along the ring’s bevel edge as it relocates smoothly to the new target; the card’s text changes as the sweep finishes.',
            },
            {
                name: 'The ring re-machines',
                text: 'The ring’s radius tightens slightly and releases back to size on the new target, a precise mechanical settle, the card’s text changing on the settle.',
            },
            {
                name: 'The chip re-anodises',
                text: 'The anodised halo’s cool-blue sheen brightens briefly (a hard brightness step) on the old target, dims, then brightens again on the new one; the card’s text changes between the two.',
            },
        ],
    },
};

/**
 * Round 1's verdicts (Kenny, 2026-10-06 20:45), in the order of ASPECTS:
 * shape, openclose, highlight, card, next. A number is settled and not asked
 * again; '' is open in round 2: light's open/close ("all three seem the
 * same"), terminal's shape ("too dark or unreadable"), and the shape,
 * open/close and highlight of high-contrast and brutalism ("not readable").
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '3', '1', '1', '2'],
    light: ['1', '3', '1', '1', '1'],
    dark: ['1', '1', '1', '2', '2'],
    cyberpunk: ['2', '2', '1', '1', '3'],
    synthwave: ['2', '2', '1', '1', '2'],
    pastel: ['3', '2', '3', '3', '2'],
    terminal: ['2', '3', '3', '3', '1'],
    forest: ['2', '1', '1', '2', '1'],
    'high-contrast': ['2', '1', '3', '1', '2'],
    sepia: ['3', '1', '1', '2', '3'],
    blueprint: ['1', '2', '1', '1', '3'],
    solstice: ['1', '2', '1', '1', '3'],
    brutalism: ['2', '2', '1', '1', '3'],
    deco: ['3', '2', '3', '1', '2'],
    phantom: ['1', '1', '1', '3', '2'],
    grotesk: ['2', '2', '1', '1', '1'],
    nostromo: ['2', '2', '2', '1', '3'],
    titanium: ['3', '1', '1', '1', '2'],
};
const keptOf = (/** @type {string} */ t, /** @type {Aspect} */ id) => PICKED[t]?.[ASPECTS.findIndex((a) => a.id === id)] ?? '';
// Round 2's new options replace an aspect's (each carries its own key, the
// attribute value its CSS answers to; round 1's are 1, 2, 3).
for (const file of [R2A, R2B])
    for (const [t, aspects] of Object.entries(file))
        for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="drawer-tour"]'));

/* ------------------------------------------------- the review kit's text */

const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]));
/** The part each aspect is about, outlined in the review dialog. @type {Record<Aspect, { target: string, targetName: string }>} */
const TARGETS = {
    shape: { target: '.kp-drawer', targetName: 'the drawer panel: its plate, frame and dividers' },
    openclose: { target: '.kp-drawer', targetName: 'the drawer panel as it opens and closes' },
    highlight: { target: '[data-kp-tour-target]', targetName: 'the ring the tour draws around the part it talks about' },
    card: { target: '.kp-tour', targetName: 'the tour’s step card' },
    next: { target: '.kp-tour', targetName: 'the step card and its count as the tour moves on' },
};
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            // What the dialog outlines while this aspect is judged (Kenny,
            // 2026-10-06 19:33: "it's really not clear which parts of the demo
            // you are targeting for evaluation").
            ...TARGETS[id],
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
            default: Object.fromEntries(
                Object.keys(PICKED)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, keptOf(t, id)]),
            ),
            fixed: Object.fromEntries(
                Object.keys(PICKED)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, true]),
            ),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    const open = ASPECTS.filter(({ id }) => !keptOf(theme, id));
    p.textContent = open.length
        ? `Round 2: new options for ${open.map(({ label }) => label.toLowerCase()).join(', ')}; everything else is settled as you picked it.`
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------------- the stage markup */

const STAGE = `<div class="dt-mockpage">
    <nav class="dt-nav" aria-label="Areas, for the tour to point at">
        <a href="#h-drawer-tour">Overview</a>
        <a href="#h-drawer-tour">Readings</a>
        <a href="#h-drawer-tour">Incidents</a>
    </nav>
</div>
<div class="kp-tour dt-tour" role="dialog" aria-label="Tour step">
    <h3 class="kp-tour__title" data-dt-tour-title>Where things live</h3>
    <p class="kp-tour__text" data-dt-tour-text>Three areas, always in the same place: Overview, Readings and Incidents.</p>
    <footer class="kp-tour__foot">
        <span class="kp-tour__count" data-dt-tour-count>1 of 3</span>
        <span class="kp-tour__buttons">
            <button type="button" class="kp-button kp-button--sm" data-dt-back hidden>Back</button>
            <button type="button" class="kp-button kp-button--sm kp-button--ghost" data-dt-skip>Skip</button>
            <button type="button" class="kp-button kp-button--sm kp-button--primary" data-dt-nextbtn>Next</button>
        </span>
    </footer>
</div>
<div class="kp-drawer dt-drawer" role="region" aria-label="Help">
    <header class="kp-drawer__head">
        <h2 class="kp-dialog__title">Help</h2>
        <button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close Help" data-dt-closebtn>✕</button>
        <p class="kp-drawer__desc">Where things live, the words it uses, and its keys.</p>
    </header>
    <div class="kp-drawer__body">
        <section class="kp-help kp-card">
            <h3>Where things live</h3>
            <p>Three areas, one line each.</p>
            <dl class="kp-help__list">
                <dt>Overview</dt>
                <dd>What needs a look today.</dd>
                <dt>Readings</dt>
                <dd>Pressure and flow as charts.</dd>
                <dt>Incidents</dt>
                <dd>What went wrong, and who is on it.</dd>
            </dl>
        </section>
    </div>
    <footer class="kp-drawer__foot">
        <button type="button" class="kp-button kp-button--primary" disabled>Take the 1-minute tour</button>
    </footer>
</div>`;

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-dt-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'dt-aspect';
    box.setAttribute('data-dt-aspect', id);
    box.setAttribute('aria-labelledby', `h-dt-${id}`);
    const head = document.createElement('div');
    head.className = 'dt-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-dt-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'dt-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'dt-col';
        cell.setAttribute('data-dt-vary', id);
        cell.setAttribute('data-dt-option', String(at));
        cell.innerHTML =
            `<p class="dt-label"><span class="dt-label__no">${label} · ${at}</span> <span data-dt-name></span></p>` +
            `<p class="dt-desc" data-dt-desc></p><div class="dt-demo" data-dt>${STAGE}</div>`;
        trio.append(cell);
    }
    box.append(head, trio);
    rows.append(box);
}

// The preview and the reference get the same stage markup as the rows.
for (const host of section.querySelectorAll('[data-dt]')) if (!host.firstElementChild) host.innerHTML = STAGE;

/* ------------------------------------------------------- the picks */

/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () =>
    /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? (keptOf(theme(), id) || '1')])));

/** Writes the five aspects on every stage: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-dt-preview]');
    for (const { id } of ASPECTS) {
        const key = keyOf(theme(), id, now[id]);
        if (preview?.getAttribute(`data-dt-${id}`) !== key) preview?.setAttribute(`data-dt-${id}`, key);
    }
    for (const cell of section.querySelectorAll('[data-dt-vary]')) {
        const vary = cell.getAttribute('data-dt-vary');
        const option = cell.getAttribute('data-dt-option') ?? '1';
        const stage = cell.querySelector('[data-dt]');
        for (const { id } of ASPECTS) {
            const value = keyOf(theme(), id, id === vary ? option : now[id]);
            if (stage?.getAttribute(`data-dt-${id}`) !== value) stage?.setAttribute(`data-dt-${id}`, value);
        }
        cell.classList.toggle('dt-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-dt-picks]');
    const idea = IDEAS[theme()];
    if (words && idea)
        words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1]?.name ?? ''}`).join(' · ');
}

section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* --------------------------------------------------------- the stages */

const stages = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-dt]')]);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The three tour steps; the second points at the areas, the third at the drawer's own close button. */
const STEPS = [
    { title: 'Where things live', text: 'Three areas, always in the same place: Overview, Readings and Incidents.', target: 'nav' },
    { title: 'The areas', text: 'Pressure, flow and incidents each live on their own area; this list never moves.', target: 'nav' },
    { title: 'Closing it', text: 'Esc, or this ✕, closes the drawer and gives the focus back to the button that opened it.', target: 'close' },
];

let step = 1;
const log = section.querySelector('[data-dt-log]');

function paintStep() {
    const s = STEPS[step - 1];
    for (const stage of stages()) {
        stage.setAttribute('data-dt-step', String(step));
        const nav = stage.querySelector('.dt-nav');
        const closeBtn = stage.querySelector('[data-dt-closebtn]');
        nav?.toggleAttribute('data-kp-tour-target', s.target === 'nav');
        closeBtn?.toggleAttribute('data-kp-tour-target', s.target === 'close');
        const title = stage.querySelector('[data-dt-tour-title]');
        const text = stage.querySelector('[data-dt-tour-text]');
        const count = stage.querySelector('[data-dt-tour-count]');
        const back = /** @type {HTMLButtonElement | null} */ (stage.querySelector('[data-dt-back]'));
        const skip = /** @type {HTMLButtonElement | null} */ (stage.querySelector('[data-dt-skip]'));
        const next = /** @type {HTMLButtonElement | null} */ (stage.querySelector('[data-dt-nextbtn]'));
        if (title) title.textContent = s.title;
        if (text) text.textContent = s.text;
        if (count) count.textContent = `${step} of ${STEPS.length}`;
        if (back) back.hidden = step === 1;
        if (skip) skip.hidden = step === STEPS.length;
        if (next) next.textContent = step === STEPS.length ? 'Done' : 'Next';
        if (!stage.hasAttribute('data-dt-playing')) {
            stage.removeAttribute('data-dt-playing');
            void stage.getBoundingClientRect();
            stage.setAttribute('data-dt-playing', 'next');
        }
    }
    if (reduced()) for (const stage of stages()) stage.removeAttribute('data-dt-playing');
}

function setStep(/** @type {number} */ to) {
    step = Math.min(STEPS.length, Math.max(1, to));
    paintStep();
}

let drawerOpen = true;

function paintDrawer() {
    const target = drawerOpen ? 'opening' : 'closing';
    for (const stage of stages()) stage.setAttribute('data-dt-state', target);
    if (reduced()) for (const stage of stages()) stage.setAttribute('data-dt-state', drawerOpen ? 'open' : 'closed');
}

document.addEventListener(
    'animationend',
    (event) => {
        const target = /** @type {Element} */ (event.target);
        const drawerEl = target.closest?.('.dt-drawer');
        if (drawerEl) {
            const stage = drawerEl.closest('[data-dt]');
            const st = stage?.getAttribute('data-dt-state');
            if (st === 'opening') stage?.setAttribute('data-dt-state', 'open');
            if (st === 'closing') stage?.setAttribute('data-dt-state', 'closed');
        }
        const tourEl = target.closest?.('.dt-tour');
        if (tourEl) tourEl.closest('[data-dt]')?.removeAttribute('data-dt-playing');
    },
    true,
);

for (const b of section.querySelectorAll('[data-dt-drawer]'))
    b.addEventListener('click', () => {
        drawerOpen = b.getAttribute('data-dt-drawer') === 'open';
        for (const other of section.querySelectorAll('[data-dt-drawer]')) other.setAttribute('aria-pressed', String(other === b));
        paintDrawer();
        if (log) log.textContent = drawerOpen ? 'Opening every stage below.' : 'Closing every stage below.';
    });

section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const action = target?.closest('[data-dt-tour]')?.getAttribute('data-dt-tour');
    if (action === 'back') setStep(step - 1);
    else if (action === 'next') setStep(step === STEPS.length ? 1 : step + 1);
    else if (action === 'skip') setStep(STEPS.length);
    else if (target?.closest('[data-dt-back]')) setStep(step - 1);
    else if (target?.closest('[data-dt-skip]')) setStep(STEPS.length);
    else if (target?.closest('[data-dt-nextbtn]')) setStep(step === STEPS.length ? 1 : step + 1);
    else if (target?.closest('[data-dt-closebtn]')) {
        drawerOpen = false;
        for (const other of section.querySelectorAll('[data-dt-drawer]'))
            other.setAttribute('aria-pressed', String(other.getAttribute('data-dt-drawer') === 'closed'));
        paintDrawer();
        if (log) log.textContent = 'Closed from the drawer’s own ✕.';
        return;
    }
    if (action || target?.closest('[data-dt-back], [data-dt-skip], [data-dt-nextbtn]'))
        if (log) log.textContent = `Tour step ${step} of ${STEPS.length}.`;
});

paintDrawer();
paintStep();
compose();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-dt-theme-name]')) el.textContent = LABEL[now] ?? now;
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row.
    for (const box of section.querySelectorAll('[data-dt-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-dt-aspect'))));
    for (const cell of section.querySelectorAll('[data-dt-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-dt-vary'))]?.[Number(cell.getAttribute('data-dt-option')) - 1];
        const name = cell.querySelector('[data-dt-name]');
        const desc = cell.querySelector('[data-dt-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

if (reduced()) document.querySelector('[data-dt-motion]')?.removeAttribute('hidden');

let rate = 1;
try {
    const kept = Number(localStorage.getItem('dt-speed'));
    if (kept > 0) rate = kept;
} catch {
    // No storage: full speed.
}
const slowNow = () => {
    for (const a of document.getAnimations()) if (a.playbackRate !== rate) a.playbackRate = rate;
};
const slowEachFrame = () => {
    slowNow();
    requestAnimationFrame(slowEachFrame);
};
document.addEventListener('animationstart', slowNow, { capture: true });
requestAnimationFrame(slowEachFrame);
const speedButtons = [...document.querySelectorAll('[data-dt-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-dt-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-dt-speed'));
        try {
            localStorage.setItem('dt-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
