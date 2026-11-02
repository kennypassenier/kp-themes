// Comparing two JSON values for the round-trip proof: equal as data (object keys in any order), and equal including
// the order of every object's keys.

/** Equal as data: same types, same array order, same object keys and values in any key order. @param {any} a @param {any} b @returns {boolean} */
export function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((k) => Object.hasOwn(b, k) && deepEqual(a[k], b[k]));
}

/** Equal including the order of every object's keys. @param {any} a @param {any} b */
export const orderedEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** The first path at which two values differ, for a readable report. @param {any} a @param {any} b @returns {string} */
export function firstDifference(a, b, at = '$') {
    if (deepEqual(a, b)) return '';
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b))
        return `${at}: ${JSON.stringify(a)?.slice(0, 80)} vs ${JSON.stringify(b)?.slice(0, 80)}`;
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
        const found = firstDifference(a[key], b[key], `${at}.${key}`);
        if (found) return found;
    }
    return `${at}: differs`;
}
