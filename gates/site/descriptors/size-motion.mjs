// Page descriptor for the "size-motion" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const sizeMotionDescriptor = {
        id: 'size-motion',
        title: 'Closing and resizing',
        group: 'Theming',
        classes: [],
        aliases: ['size-motion', 'resizing', 'arriving', 'leaving', 'arrive', 'folding', 'gliding', 'reversing', 'settling', 'closing', 'ghost'],
        exports: [],
        intro: 'A dialog leaves the way it came, and a box that changes size eases to its new height, growing and shrinking alike. Nothing here has a speed of its own: every duration and curve is read from the theme’s dialog entrance.',
        whenToUse:
            'Nothing to do for the components: every dialog, accordion, tab set, data table, toast stack, upload list, combobox list, tree, wizard and field gets it from `js/motion.js`, which `js/auto.js` loads wherever one of them is. Mark any other box whose content changes after it is drawn with `data-kp-size-motion`: a card that fills after loading, a panel that shows its errors. Not on a box that scrolls its own content, which does not change size.',
        examples: [
            {
                title: 'A card that eases to its new height',
                why: 'The card’s children are watched, not the card: when one grows, shrinks, arrives or leaves, the card glides from its old height to the new one in four fifths of the theme’s dialog entrance, capped at `--kp-size-max`. A reader who asked for reduced motion sees it take its size at once.',
                markup: `
<div class="kp-card" data-kp-size-motion>
  <h3>Line 2 readings</h3>
  <ul id="readings"></ul>
</div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-size-motion', what: 'Ease this box to its new height whenever its content changes size.' },
            { name: '--kp-close-max', what: 'The longest a dialog may take to leave. It leaves in two thirds of its entrance, never longer than this. Default 600ms.' },
            { name: '--kp-size-max', what: 'The longest a box may take to change size. It takes four fifths of the dialog entrance, never longer than this. Default 480ms.' },
            { name: '--kp-size-step', what: 'For a theme that counts its time in steps: the length of one step (nostromo 80ms, terminal 136ms). A stepped resize, fold or unfold then takes that long per step, and a fold waits a whole number of steps. Unset, the steps share the size time.' },
            { name: 'data-kp-resizing', what: 'Written on a box while it glides to a new height, `grow` or `shrink`. A register draws its own character on it. Read it, do not set it.' },
            { name: 'data-kp-reversing', what: '`reset` then `play` on an element while its CSS entrance is played backwards to hide it (a tooltip, the tour card); the stylesheet restarts the entrance in reverse, and the mark goes when it has played. Read it, do not set it.' },
            { name: 'data-kp-closing', what: 'Written on a menu or a popover while it plays its close, its opening backwards (js/motion.js playClose). A register may draw a close of its own on it, or run its transitions to the closed state. Read it, do not set it.' },
            { name: 'data-kp-ghost', what: 'On the stand-in copy of a popover the browser just hid: it takes the popover\u2019s place in the top layer for as long as the close plays, then goes. Read it, do not set it.' },
            { name: 'data-kp-gliding', what: '`column` on a box laid out as a column of flex items while it glides: its items keep their own size and the box clips them, rather than squeezing them. Read it, do not set it.' },
            { name: 'data-kp-arriving', what: 'Written for one arrival on what arrives in a box (a row, a shown panel or message). A register may give it its own arrival; without one it plays the theme\u2019s toast entrance.' },
            { name: 'data-kp-leaving', what: 'Written on an element while `leave(el)` plays its arrival backwards and folds it shut, before it is removed. Read it, do not set it.' },
            { name: 'data-kp-folding', what: 'Written on an accordion item (`<details>`) while it folds shut; `open` goes only when the fold ends. Whatever counts only what is shown (a tile set) treats it as shut from the fold’s first frame. Read it, do not set it.' },
            { name: 'data-kp-tiles-easing', what: 'Written on the grids of a tile set while their tiles ease to the set’s new height: the rows follow the tiles, and each tile clips what it has not yet grown to show. Read it, do not set it.' },
            { name: 'data-kp-arrive', what: '`none` on a box whose rows a live view redraws: nothing in it plays an arrival, so a refresh does not replay every row.' },
            { name: 'data-kp-settling', what: 'On a root while its first render is drawn: nothing under it arrives and no box glides, it takes its size at once. js/auto.js writes it on the root of every `attachAll()` until its modules have attached and two frames are painted; set it yourself on a part a framework renders in several passes, and take it off when that part is drawn.' },
            { name: '--kp-size-ease', what: 'A theme\u2019s own curve for its size changes, held from overshooting. Default: the dialog entrance\u2019s curve.' },
            { name: '--kp-size-steps', what: '`line` moves a size one line of text at a time, growing and shrinking alike (terminal).' },
            { name: 'a close is its open, backwards', what: 'In every theme a part that closes (menu, popover, date picker, combobox, tour card and dim, alarm, side navigation, calendar and table busy layers) plays the theme\u2019s own opening in reverse, over the same time on the mirrored curve. The rows below are the knobs a theme sets for the parts that fold or leave; a theme that sets none keeps the defaults named.' },
            { name: '--kp-leave-state', what: '`leave` on a theme lets a part a script is about to remove or hide (a state\u2019s layer, an empty state, a file row, a tree\u2019s children) leave first, as `leave(el)` plays it. Unset, such a part is taken out at once.' },
            { name: '--kp-arrive-unseen', what: '`skip` lets what takes no box (display none) arrive as nothing, so its arrival does not hold back the visible parts added with it.' },
            { name: '--kp-leave-fold-grow', what: 'How long a leave\u2019s fold of space takes, as a multiple of the longer of the exit and the size glide. Default 1.25.' },
            { name: '--kp-leave-fold-start', what: 'Where the fold starts, as a share of the exit. Default one third; 0 starts it with the leave, so the space closes as long as, and with, the part.' },
            { name: '--kp-leave-fold-ease', what: 'The curve the fold runs on. Default: the theme\u2019s entrance curve; a theme that folds in whole ticks names a steps() curve, and the box then leaves at the size the fold ended on.' },
            { name: '--kp-swap-fold-ease', what: 'The fold curve for the panel that leaves while another arrives (a tab swap), so a stepped theme can offset the two by one tick and the box does not move.' },
            { name: '--kp-accordion-size', what: '`own` gives the parts that otherwise keep the entrance\u2019s curve alone (the accordion, a tree branch) the theme\u2019s own size character as well.' },
            { name: '--kp-motion-scale', what: 'On the root: plays every close and every resize slower (above 1) or faster (below 1) at once. Default 1.' },
            { name: 'pastel', what: 'Pastel caps a resize at one landing (560 ms), staggers a leave by 0.1071 of it, and folds the space of a card, a key figure or a tile from 0.6429 of its leave, after the tack is out; the side navigation’s width moves on the landing held at its value.' },
        ],
        accessibility: [
            'Built in — a reader who asked for reduced motion gets none: the dialog closes and the box takes its size at once.',
            'Built in — the dialog stays open, and modal, until its leaving motion ends; its `close` event comes then, with its return value.',
            'Yours — a box that grows under the reader’s pointer moves what is below it; keep what people click above content that arrives.',
        ],
    };
