import { useSyncExternalStore } from 'react';

// Whether the visitor has asked for less motion — and, unlike reading
// matchMedia once at mount, it keeps listening [DI7].
//
// The four effect components each queried the preference on their first
// render and never again, so someone who turned the setting on mid-session
// kept the animation until they reloaded the page. That is the half of DI7
// that is easy to miss, because the code looks correct and works in every
// test that mounts a component after setting the preference.
//
// A shared external store rather than a hook with local state: every effect
// on the page then flips on the same event, and the value is read straight
// from the browser rather than mirrored into React.

const QUERY = '(prefers-reduced-motion: reduce)';

/** @param {() => void} onChange */
function subscribe(onChange) {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};
    const mq = window.matchMedia(QUERY);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;

// Server rendering has no preference to read. Assuming "reduce" would ship
// a still first paint to everyone; assuming "no-preference" would start an
// animation for someone who asked for none. The still frame is the safer
// wrong answer, and the client corrects it on the first render.
const getServerSnapshot = () => true;

/** @returns {boolean} */
export function useReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
