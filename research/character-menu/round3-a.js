/* research/character-menu, round 3 (Kenny, 2026-10-06 20:54): the new options of group a, cyberpunk.
   Round 1 and round 2 were sent back for shape, loading, open and tone ("none of these is cyberpunk").
   Every option below is built from what Kenny already approved for cyberpunk elsewhere: the chart's
   black ice (split glow, yellow tripwire grid), its data rain loading, its chrome wipe arrival and its
   lock-on markers; the graph's holo HUD, target lock and jacked-in arrival; the calendar's data shard,
   hazard roster and glitch-in month; the meter's HUD segment gauge and packet sync; the columns'
   decoded arrival. Every option also clears the register's '— ' entry mark, which in the rich menu
   stood on a line of its own above every label. The settled hover (round 2's surge edge) composes on
   all of them: nothing here sets an entry's box-shadow or animates the entry itself. */
export default {
    cyberpunk: {
        shape: [
            {
                key: 'r3-cy-shape-1',
                name: 'The netrunner deck',
                text: 'A void deck cut at two corners like the register’s dialog, a fine yellow frame, faint cyan scanlines, every group numbered “01 //” in cyan mono with a yellow tripwire running out to the edge (the chart’s black ice grid), a lit data pad before each entry, and a solid signal-yellow status bar along the bottom: KP//NET, SECURE LINK.',
            },
            {
                key: 'r3-cy-shape-2',
                name: 'The hazard roster',
                text: 'Hazard tape across the top of the plate and a signal-yellow rail down its side, each group named on a solid yellow tab with black capitals and a cut corner, entries in the tall display capitals over dashed tripwire rules, as the calendar’s hazard roster and the meter’s HUD segment gauge.',
            },
            {
                key: 'r3-cy-shape-3',
                name: 'The holo HUD',
                text: 'A cyan-tinted glass plate glowing at its rim, four lock-on reticle corners at its edges (the chart’s lock-on markers), dense holo scanlines, headings in spaced cyan mono behind a ◢ marker, and labels with the black ice’s faint cyan-and-yellow split, as the graph’s holo HUD.',
            },
        ],
        loading: [
            {
                key: 'r3-cy-load-1',
                name: 'The data rain',
                text: 'Columns of cyan and yellow code fall straight down through the whole entry at two speeds, behind a “Loading…” held clear by a void halo, as the chart’s data rain loading.',
            },
            {
                key: 'r3-cy-load-2',
                name: 'The breach gauge',
                text: 'The hint line becomes a sixteen-segment yellow gauge filling in hard steps while a hex counter at the entry’s end rolls through its codes, the meter’s HUD segment gauge breaching ICE.',
            },
            {
                key: 'r3-cy-load-3',
                name: 'The lock-on',
                text: 'A cyan reticle hunts across the entry in hard jumps, then snaps tight around “Loading…” and blinks its lock before hunting again, as the graph’s target lock and the chart’s lock-on markers.',
            },
            {
                key: 'r3-cy-load-4',
                name: 'The glitch tear',
                text: 'The entry tears: “Loading…” splits into cyan and red and jolts sideways while bright slabs of signal yellow and cyan jump up and down the row, as the calendar’s glitch-in month.',
            },
            {
                key: 'r3-cy-load-5',
                name: 'The jack-in prompt',
                text: 'Under “Loading…” a mono prompt types itself out, > jack_in --menu, behind a blinking yellow block cursor, then clears and types again, as the graph’s jacked-in arrival in the register’s mono voice.',
            },
            {
                key: 'r3-cy-load-6',
                name: 'The hex stream',
                text: 'A stream of hex bytes runs right to left along the hint line through a lit yellow decoder window, as the columns’ decoded arrival reading the data rain.',
            },
        ],
        open: [
            {
                key: 'r3-cy-open-1',
                name: 'Glitch in',
                text: 'The menu tears into place through six torn frames, horizontal slices of it flashing in sideways with a cyan and red split, then locks clean; it tears out the same way to close, as the calendar’s glitch-in month.',
            },
            {
                key: 'r3-cy-open-2',
                name: 'The chrome wipe',
                text: 'The menu is wiped in from the button’s side along a diagonal edge with a bright chrome glint riding on it, and wiped back out the same way to close, as the chart’s chrome wipe arrival.',
            },
            {
                key: 'r3-cy-open-3',
                name: 'Decoded',
                text: 'The plate scans down in hard steps, then every heading and entry decodes in one after another, top to bottom, sliding in with a cyan and red split that settles clean; it decodes out the same way to close, as the columns’ decoded arrival.',
            },
        ],
        tone: [
            {
                key: 'r3-cy-tone-1',
                name: 'The hostile tag',
                text: 'The destructive entry is tagged hostile: a red wash fading from a hazard-striped edge, a solid red notch in its corner (the register’s cut corner), its hint opened by HOSTILE //; the disabled entry’s reason reads LOCKED // in amber mono, as the calendar’s hazard roster tones.',
            },
            {
                key: 'r3-cy-tone-2',
                name: 'The irreversible daemon',
                text: 'The destructive label carries the black ice’s split glow in red and cyan, its hint opens with ⚠ IRREVERSIBLE in red mono, and red hazard tape crawls along its foot; the disabled reason opens with REQ ▸ in cyan mono, a requirement unmet, as the chart’s black ice and the calendar’s hazard roster.',
            },
            {
                key: 'r3-cy-tone-3',
                name: 'Target locked',
                text: 'Red lock-on reticle corners frame the whole destructive entry and pulse as they hold, with a small TARGET tag at its end, as the chart’s lock-on markers and the graph’s target lock; the disabled reason opens with OFFLINE // over a yellow tripwire.',
            },
        ],
    },
};
