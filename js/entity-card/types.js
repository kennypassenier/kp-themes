// The types of the entity card: its data and the empty options.

/**
 * @typedef {object} EntityData
 * @property {string} key a stable id, for selection, undo and a live refresh
 * @property {string} name
 * @property {string} [vmid] a small id beside the name
 * @property {{ label: string, tone?: 'success' | 'warning' | 'destructive' | 'info' }} [state]
 * @property {{ value: string, label: string }[]} [figures]
 * @property {{ label: string, tone?: 'success' | 'warning' | 'destructive' | 'info' }[]} [flags]
 * @property {{ label: string, value: number | null, mark?: number, tone?: 'success' | 'neutral' | 'warning' | 'destructive', text?: string }[]} [meters]
 * @property {{ id: string, label: string, danger?: boolean, disabled?: string }[]} [actions]
 * @property {number[]} [trend] the readings of the trend row, oldest first (a 24-hour CPU line); fewer than two say "no line yet"
 * @property {string} [trendLabel] the trend row's label ("CPU 24 h"); the package's word "Trend" when absent
 * @property {string} [trendText] the current value beside the line ("34%"); the last reading when absent
 * @property {string} [href] a tile's link: the whole card opens it
 * @property {boolean} [external] the link opens a new tab (a glyph shows, and a screen reader is told)
 * @property {string} [description] a tile's description; it wraps whole
 * @property {string[]} [lines] a tile's small facts, one per line, at the foot
 * @property {string} [match] a tile's typed search: its first occurrence in the name (any case) is wrapped in a `<mark class="kp-entity__match">`; the rest is plain text, and nothing is parsed as HTML [wish-1120]
 * @property {boolean} [starred] the favourite star is on; a refill with it changes the star in place
 * @property {'ready' | 'loading' | 'empty' | 'error'} [status]
 * @property {string} [error] why a card in `error` failed
 */

/**
 * @typedef {object} EntityEmptyOptions
 * @property {string} [title] the plate's heading
 * @property {string} [message] the line under it
 * @property {string} [actionLabel] the action's words
 * @property {'none'} [action] `none`: the plate has no action
 * @property {(event: MouseEvent) => void} [onAction] what the action does, in place of firing `kp-entity-new`
 */

export {};
