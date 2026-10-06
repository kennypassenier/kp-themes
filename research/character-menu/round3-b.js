/* research/character-menu, round 3 (Kenny, 2026-10-06 20:54): the new options of group b.
   Only retro's "Hover, focus and a press" is open here (rounds 1 and 2 were
   rejected: "none is readable … I want the wow"). Every option keeps the
   selected entry white on a solid bar (label AND hint), keeps the disabled
   entry on the plate where it reads, and gives the menu's own button a
   state of its own while its menu is open. */
export default {
    retro: {
        interact: [
            {
                key: 'r3-re-interact-1',
                name: 'The Start menu',
                text: "A hovered entry gets the Start menu's solid navy selection bar, snapped on whole as the system drew it, label and hint in white; the keyboard focus adds the white dotted focus rectangle inside the bar and underlines the first letter as the keyboard cue; a press sinks the bar into a navy bevel in two hard steps and the words step one pixel down and right. While the menu is open its button stays pushed in with the dotted rectangle round its words, as the Start button does (echoes the menu's own 1995 dialog shape, the button's one-pixel press, and the register's navy menu highlight).",
            },
            {
                key: 'r3-re-interact-2',
                name: 'The title bar',
                text: "A hovered or focused entry lights as an active window's title bar: the register's navy-to-blue ramp, white words, switching from the grey inactive bar to the active one in two hard steps; the keyboard focus adds the white dotted rectangle; a press blinks the entry twice, as a 1995 menu flashes the command it runs, then holds the bar in its pressed navy bevel. While the menu is open its button wears the navy of the default button (echoes the trend's title bar, the Excel 97 wizard chart's caption, and Repainted, the live update picked for the trend, graph and columns).",
            },
            {
                key: 'r3-re-interact-3',
                name: 'The Office 97 menu',
                text: "Every entry gets an icon column at its start; a hovered or focused entry's icon pops out as a raised grey toolbar button beside a navy bar with white words (the destructive entry's icon is the message box's red exclamation mark); a press sinks the icon button, fills its face with the 50% dither of a latched toggle and steps its mark one pixel. While the menu is open its button latches the same way (echoes The bevel pops, the chart's new reading, the register's dither ladder, and the message box picked for the destructive entry).",
            },
        ],
    },
};
