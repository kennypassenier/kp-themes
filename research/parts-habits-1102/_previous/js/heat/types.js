// The types of the heat grid and the matrix: specs, cells, options and decorate info.

/**
 * @typedef {'ok' | 'warn' | 'bad' | 'muted' | 'future' | 'before' | 'none' | 'level' | 'loading' | 'self' | 'logged' | 'quiet' | 'paused'} GridTone
 */

/**
 * @typedef {object} HeatCell
 * @property {GridTone} [tone]  default `muted`
 * @property {number} [level]   0 to 1, for tone `level`: the darker, the more
 * @property {number} [share]   0 to 1, summary row only: how much of the cell the tone fills, from the bottom
 * @property {string} label     what the cell says in words ("backed up", "missed"); the row and the column are put in front of it
 * @property {string} [aria]    the whole accessible name, when the default is not right
 * @property {string | true} [tip]  the hover card's text; `true` leaves it to a `fill` the page gave attachHoverCards()
 * @property {boolean} [disabled]   a cell that cannot be pressed
 */

/**
 * @typedef {object} HeatRow
 * @property {string} key
 * @property {string} label
 * @property {string} [mark]    a CSS colour: a small square before the label
 * @property {boolean} [muted]  the label is quiet (a row that keeps no data)
 * @property {boolean} [pressed] the label is pressed (when labels are toggles)
 * @property {readonly HeatCell[]} cells  one per column
 */

/**
 * @typedef {object} HeatSpec
 * @property {readonly { key: string, label: string, minor?: boolean }[]} [columns]  `minor: true` draws no name, `minor: false` always does
 * @property {HeatRow} [summary]
 * @property {readonly HeatRow[]} [rows]
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]  default ready
 * @property {string} [message]  the words of the empty and error states (the plate's heading)
 * @property {string} [text]  the plate's sentence under the heading (an error says the package's own when none is given)
 * @property {Node | string | null} [art]  a picture over the heading of the empty and error plates
 * @property {{ rows: number, columns: number }} [skeleton]  the shape of the loading state when there is no data yet
 * @property {number} [every]    every how many columns the axis names one (default 3; the last always); columns with `minor` set do not count
 * @property {'start' | 'end'} [axis]  where the column axis stands (default start)
 * @property {boolean} [toggle]  row labels are buttons that toggle (else `data-kp-heat-toggle` on the grid)
 * @property {string | null} [picked]  the key of the picked column
 * @property {string} [label]  the grid's accessible name, when the element has none
 * @property {readonly HeatLegendEntry[] | false} [legend]  the legend under the grid (setHeatLegend); `false` takes it away
 * @property {HeatLegendOptions['keys']} [legendKeys]  the key line at the end of the legend
 * @property {HeatPaging | false} [paging]  the Earlier / Today / Later bar before the grid (setHeatPaging); `false` takes it away [wish-1120]
 */

/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes. `kind` is `row-label`
 * (a row's toggle button; `value` is the row key) or `cell` (a cell button; `value` is `rowKey/colKey`, `index` the column); `host`
 * is the grid and `key` its `data-kp-key` [wish-1120, homelab 65, 114].
 * @typedef {{ kind: 'row-label' | 'cell' | 'pager-earlier' | 'pager-today' | 'pager-later', host: HTMLElement, key?: string, index?: number, value?: string, label?: string }} HeatDecorateInfo
 */

/**
 * @typedef {object} HeatPaging
 * @property {number} [offset]  how many pages back from today: 0 is now, 1 is the page before (default: the grid's `data-kp-heat-offset`, else 0)
 * @property {string} [label]  the words between the buttons: the window the grid shows ("13 to 19 October")
 * @property {number} [min]  the lowest offset: Later stops here (default 0, nothing after today; a negative one lets a plan read into the future)
 * @property {number} [max]  the highest offset: Earlier stops here (default none, Earlier never ends)
 */

/**
 * One entry of a legend: a tone and its words, or a value ramp.
 * @typedef {object} HeatLegendEntry
 * @property {GridTone} [tone]  a swatch of this tone (with `label`)
 * @property {string} [label]  its words
 * @property {boolean} [ramp]  instead of a tone: the value scale, `less` then `steps` swatches of rising level then `more`
 * @property {number} [steps]  how many swatches the ramp has (default 5, 2 to 9)
 * @property {string} [less]  the ramp's low end (default "Less")
 * @property {string} [more]  the ramp's high end (default "More")
 */

/**
 * @typedef {object} HeatLegendOptions
 * @property {boolean | readonly import('../keys.js').KeyPair[]} [keys]  `true`: the keys of a heat grid (move, pick a column, drop the pick, earlier or later); or the pairs to show; at the end of the legend
 * @property {string} [label]  the legend's name for a screen reader (default "Legend")
 */

/**
 * @typedef {object} MatrixCell
 * @property {GridTone} [tone]
 * @property {string} [text]    what the cell shows (a count, "open"); without it a glyph for the tone stands there
 * @property {string} [label]   what the cell says in words, for a screen reader and the card
 * @property {string} [aria]    the whole accessible name, when the default is not right
 * @property {string | true} [tip]
 * @property {boolean} [ringed]  a red ring on top of the tone (stopped on the way)
 * @property {boolean} [mark]    a dashed primary outline (what a rule being read touches)
 * @property {boolean} [disabled]
 */

/**
 * @typedef {object} MatrixSpec
 * @property {string} [corner]  the words in the corner ("from ↓ to →")
 * @property {readonly (import('../uses-map.js').UsesNode)[]} [rows]  the sources, in the lines view with their node content (`sub`, `glyph`, `href`, `ghost`, `dashed`)
 * @property {readonly (import('../uses-map.js').UsesNode)[]} [columns]  the things that use them
 * @property {(row: string, column: string) => MatrixCell | null | undefined} [cell]  null: unknown; the same key on both axes with nothing given: itself
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message]  the plate's heading in the empty and error states
 * @property {string} [text]  the plate's sentence under the heading
 * @property {Node | string | null} [art]  a picture over the heading of the empty and error plates
 * @property {number} [skeleton]  the size of the loading state when there are no names yet
 * @property {{ row: string, column: string } | null} [picked]
 * @property {readonly string[]} [lit]  the header keys that are lit
 * @property {string} [label]
 * @property {'grid' | 'lines'} [view]  `lines`: the two columns joined by lines (js/uses-map.js); default `grid`
 * @property {(count: number) => string} [countLabel]  lines view: the words after the number of uses ("2 applications")
 * @property {string} [sourcesLabel]  lines view: the sources column's name for a screen reader
 * @property {string} [usersLabel]  lines view: the users column's name
 */

export {};
