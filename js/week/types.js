// The types of the week agenda: event states and decorate info.

/**
 * @typedef {'next' | 'off' | 'skipped' | 'reference'} WeekEventState
 * @typedef {object} WeekEvent
 * @property {string} id what the page calls the item; reported by `kp-week-open`
 * @property {number | string} start the moment: epoch ms, or an ISO string with its offset
 * @property {string} label what it is, one line (clipped with an ellipsis)
 * @property {1 | 2 | 3 | 4 | 5} [series] the colour, from `--chart-1`; 1 when absent
 * @property {WeekEventState} [state] absent for a plain item
 * @property {string} [detail] the hover card's words, and the end of the item's accessible name
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} WeekState
 * @typedef {import('../strings.js').Strings} Strings
 */

/**
 * What `decorate` is told about the control it is handed.
 * `kind` is `pill`, `more`, `prev`, `next` or `today`; `id` is the item's (a pill) or the day's `YYYY-MM-DD` (`more`).
 * @typedef {{ kind: 'pill' | 'more' | 'prev' | 'next' | 'today', host: HTMLElement, key?: string, id?: string }} WeekDecorateInfo
 *
 * @typedef {object} WeekOptions
 * @property {string} [timeZone] the IANA zone that decides which day an item is on; else `data-kp-time-zone`, else `Europe/Brussels`
 * @property {string} [locale] the weekday names; else `data-kp-locale`, else the nearest `lang`
 * @property {() => number} [now] the clock, `Date.now` by default
 * @property {Partial<Strings>} [strings] any of the dictionary's words, for these agendas only
 * @property {(part: HTMLElement, info: WeekDecorateInfo) => void} [decorate]
 *
 * @typedef {{ event: WeekEvent, ms: number, at: number, hhmm: string, button: HTMLButtonElement, day: string }} WeekItem
 * @typedef {{ iso: string, cell: HTMLElement, head: HTMLElement, track: HTMLElement, items: WeekItem[], now: HTMLElement,
 *   more: HTMLElement | null, moreButton: HTMLButtonElement | null, hidden: WeekItem[] }} WeekDay
 * @typedef {{ el: HTMLElement, zone: string, locale: string, now: () => number, strings: Strings, decorate?: WeekOptions['decorate'],
 *   start: string, days: number, events: WeekEvent[], state: WeekState, active: string | null, grid: HTMLElement,
 *   axis: HTMLElement, cols: WeekDay[], frame: HTMLElement, busy: HTMLElement | null, leaving: Promise<unknown> | null, held: number[] | null, stateLine: HTMLElement, plate: HTMLElement, plateKey: string, plateText: string, plateArt: Node | string | null, title: HTMLElement | null, today: HTMLButtonElement | null, legend: HTMLElement,
 *   motion: { gone: boolean, stop: (() => void) | null, asked: boolean },
 *   pills: Map<string, HTMLButtonElement>, timer: number, observer: ResizeObserver | null, mode: 'grid' | 'list',
 *   upcoming: { n: number, on: boolean, list: HTMLOListElement | null, rows: Map<string, HTMLLIElement>, items: WeekItem[] } }} WeekModel
 */

export {};
