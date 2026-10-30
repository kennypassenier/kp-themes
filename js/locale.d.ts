export { resolveLocale, weekStartsOn, collator } from './locale/resolve.js';
export { datePattern, formatDate, parseDate } from './locale/dates.js';
export { calendarNames } from './locale/calendar.js';
export { formatBytes, parseNumber } from './locale/numbers.js';
export type DateFormat = 'locale' | 'rule52';
/** How a numeric date is written: the reader's locale, or dd/mm/yyyy (rule 52). @typedef {'locale' | 'rule52'} DateFormat */
