// A guided tour's start, memory, steps and card place [scope-143].
//
// The homelab port spec's checks I.3.7 1, 3, 5 and 6, without a browser:
// when a tour starts by itself (`?tour` always, a remembered or automated
// visit never), the key its memory is kept under (js/remember.js, component
// `tour`), the steps it counts (only those whose part is on the page, so the
// count is exact), and where its card goes (12 px from the target, never
// over it, 16 px inside the window). The browser half is tests/tour.spec.mjs.
//
// Run: node --test gates/tour.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_GAP, TOUR_GUTTER, forgetTour, shouldStartTour, tourCardPlace, tourMemoryKey, tourRemembered, tourStepsOnPage } from '../js/tour.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

test('a first visit by a person starts the tour, a remembered or automated one does not, and `?tour` always does (I.3.7 6) [scope-143]', () => {
    assert.equal(shouldStartTour({}), 0);
    assert.equal(shouldStartTour({ remembered: true }), null);
    assert.equal(shouldStartTour({ automated: true }), null);
    assert.equal(shouldStartTour({ search: '?theme=formal' }), 0, 'another query parameter changes nothing');

    assert.equal(shouldStartTour({ search: '?tour', remembered: true, automated: true }), 0);
    assert.equal(shouldStartTour({ search: '?tour=3', remembered: true }), 2);
    assert.equal(shouldStartTour({ search: '?tour=0' }), 0, 'counted from 1: 0 is the first step');
    assert.equal(shouldStartTour({ search: '?tour=next' }), 0, 'not a number: the first step');
    assert.equal(shouldStartTour({ search: 'tour=2' }), 1, 'without the question mark too');
});

test('the memory is js/remember.js’s, component `tour`: it reads back, and forgetting it starts the tour again (I.3.7 2) [scope-143]', () => {
    assert.equal(tourMemoryKey('network'), 'kp-remember:tour:network:done');
    assert.equal(tourMemoryKey('pump-houses'), 'kp-remember:tour:pump-houses:done');
    assert.equal(tourMemoryKey(''), '', 'no name, no memory');

    /** @type {Map<string, string>} */
    const kept = new Map();
    const storage = /** @type {Storage} */ (
        /** @type {unknown} */ ({
            getItem: (/** @type {string} */ k) => kept.get(k) ?? null,
            setItem: (/** @type {string} */ k, /** @type {string} */ v) => kept.set(k, v),
            removeItem: (/** @type {string} */ k) => kept.delete(k),
        })
    );
    assert.equal(tourRemembered('network', { storage }), false);
    kept.set(tourMemoryKey('network'), 'true');
    assert.equal(tourRemembered('network', { storage }), true);
    assert.equal(tourRemembered('readings', { storage }), false, 'another tour’s memory is its own');
    forgetTour('network', { storage });
    assert.equal(tourRemembered('network', { storage }), false);
    assert.equal(tourRemembered('network', { storage: null }), false, 'no storage: never remembered');
});

test('only the steps whose part is on the page are counted, in their order (I.3.7 1, 7) [scope-143]', () => {
    const steps = ['areas', 'search', 'readings', 'map', 'incidents', 'help'].map((name) => ({
        target: `[data-step="${name}"]`,
        title: name,
        text: '',
    }));
    const onPage = new Set(['areas', 'search', 'readings', 'incidents', 'help']);
    const live = tourStepsOnPage(steps, (step) => onPage.has(step.title));
    assert.deepEqual(
        live.map((s) => s.title),
        ['areas', 'search', 'readings', 'incidents', 'help'],
    );
    assert.equal(DEFAULT_STRINGS.tourCount(1, live.length), '1 of 5');
    assert.equal(DEFAULT_STRINGS.tourCount(live.length, live.length), '5 of 5');
    assert.deepEqual(
        tourStepsOnPage(steps, () => null),
        [],
        'no step on the page: nothing to tour',
    );
});

test('the card sits 12 px under its target, or over it in the lower half, never on it, and 16 px inside the window (I.3.7 3, 5) [scope-143]', () => {
    const view = { width: 1280, height: 800 };
    const card = { width: 352, height: 150 };
    const high = { top: 100, bottom: 140, left: 200, width: 400, height: 40 };
    const under = tourCardPlace(high, card, view);
    assert.equal(under.top - high.bottom, TOUR_GAP);
    assert.equal(under.left, 200 + 200 - 176, 'centred on the target');
    const fractional = tourCardPlace({ ...high, top: 100.13, bottom: 140.13 }, { width: 352, height: 159.6 }, view);
    assert.equal(fractional.top - 140.13, TOUR_GAP, 'not rounded: exactly 12 px from a target at a fractional position');
    const low = { top: 600, bottom: 640, left: 200, width: 400, height: 40 };
    const over = tourCardPlace(low, card, view);
    assert.equal(low.top - (over.top + card.height), TOUR_GAP);

    const atStart = tourCardPlace({ top: 10, bottom: 50, left: 0, width: 40, height: 40 }, { width: 352, height: 150 }, { width: 1280, height: 800 });
    assert.equal(atStart.left, TOUR_GUTTER);
    const atEnd = tourCardPlace(
        { top: 10, bottom: 50, left: 1240, width: 40, height: 40 },
        { width: 352, height: 150 },
        { width: 1280, height: 800 },
    );
    assert.equal(1280 - (atEnd.left + 352), TOUR_GUTTER);
    // 390 px wide: the stylesheet makes the card 390 - 2 × 16 = 358 px.
    const phone = tourCardPlace({ top: 10, bottom: 50, left: 300, width: 80, height: 40 }, { width: 358, height: 170 }, { width: 390, height: 844 });
    assert.equal(phone.left, TOUR_GUTTER);
    assert.equal(390 - (phone.left + 358), TOUR_GUTTER);
});
