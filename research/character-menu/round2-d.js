/* research/character-menu, round 2 (Kenny, 2026-10-06 12:59): the new
   options of group d. Only retro's "Hover, focus and a press" is open here
   (round 1's three were rejected); phantom's menu keeps its round-1
   interact options once its shape-2 fault is fixed in menu-c.css — nothing
   new is written for it. */
export default {
    retro: {
        interact: [
            {
                key: 'r2-retro-interact-1',
                name: 'The dotted marquee',
                text: "A hovered or focused entry gets the dotted keyboard-focus rectangle traced inside it, as a Win95 dialog's default button; a press repaints it solid for as long as it is held, the system's own instant redraw (echoes the menu's shape, The 1995 dialog, and retro's repainted live updates in the trend tile, graph and strip columns).",
            },
            {
                key: 'r2-retro-interact-2',
                name: 'The marching ants',
                text: "A dashed selection line marches along the foot of a hovered or focused entry, the 1995 network diagram's own marching-ants select; a press freezes it into one solid rule, a selection let go (echoes retro's marching ants, picked for the graph, and the menu's own hard, stepped progress blocks).",
            },
            {
                key: 'r2-retro-interact-3',
                name: 'The inverted frame',
                text: "A hovered or focused entry inverts whole, the system's own select-all text inversion; a press holds the inversion and draws a hard 1px frame round it, the message box's own framed look (echoes the menu's tone, The message box, and the Task Manager's own highlighted row picked for the meter's How the share arrives).",
            },
        ],
    },
};
