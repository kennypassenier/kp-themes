// The types of the usual picker: its items, its model and the handle a page gets.

/**
 * @typedef {object} UsualItem
 * @property {string} value
 * @property {string} label
 * @property {HTMLElement} el
 */

/**
 * @typedef {object} UsualModel
 * @property {HTMLElement} box
 * @property {HTMLInputElement} input
 * @property {HTMLElement} list
 * @property {HTMLElement | null} status
 * @property {import('../combobox.js').ComboboxHandle} handle
 * @property {UsualItem[]} items
 * @property {{ value: string, uses?: number }[] | null} given the band set from a script
 * @property {boolean} expanded
 * @property {string | null} nextFrom
 * @property {Set<string>} notToday
 * @property {HTMLElement} panel
 * @property {import('../busy-card.js').BusyCard | null} busy
 * @property {HTMLElement} hintEl
 * @property {HTMLElement} noteEl the line under the field after an add, with its Undo
 * @property {HTMLElement | null} check the usual choices' own check (Not today), when the picker has one
 * @property {string} checkKey what the check was drawn for (its look and the band), so a sync redraws only on a change
 * @property {() => void} checkOff detaches the three-way chips of the check
 * @property {boolean} silent a change made by the check itself: no pick event
 */

/**
 * @typedef {object} UsualHandle
 * @property {HTMLElement} element
 * @property {(values: readonly (string | { value: string, uses?: number })[]) => void} setUsual hand over the band (`{ value, uses }` with the source `counts`)
 * @property {() => string[]} usual the band as drawn
 * @property {() => string[]} notToday the values marked "Not today"
 * @property {(state: 'ready' | 'loading' | 'empty' | 'error') => void} setState
 * @property {(text: string) => void} setHint
 * @property {() => void} refresh read the options again after the page changed them
 */

export {};
