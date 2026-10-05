// Information that updates in place [Kenny's picks on research/update-motion,
// 2026-10-05]: the idea a register names, the theme's timing and the mark's
// lifecycle, without a DOM (a stand-in element records what is written).
// What the browser plays is measured on catalogue/motion.html#update.
//
// Run: node --test gates/update.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UPDATE_STYLE, UPDATING_ATTRIBUTE, markUpdating, unmarkUpdating, updateIdea, updatePlays, updateTimingOf } from '../js/update.js';

/** An element that keeps its attributes and inline style, and logs the order they change in. */
function standIn(style = {}) {
    /** @type {string[]} */
    const log = [];
    const attrs = new Map();
    const props = new Map(Object.entries(style));
    return {
        log,
        attrs,
        props,
        get offsetWidth() {
            log.push('reflow');
            return 0;
        },
        setAttribute: (/** @type {string} */ k, /** @type {string} */ v) => (log.push(`set ${k}=${v}`), attrs.set(k, v)),
        removeAttribute: (/** @type {string} */ k) => (log.push(`remove ${k}`), attrs.delete(k)),
        style: {
            getPropertyValue: (/** @type {string} */ k) => props.get(k) ?? '',
            setProperty: (/** @type {string} */ k, /** @type {string} */ v) => props.set(k, v),
            removeProperty: (/** @type {string} */ k) => props.delete(k),
        },
    };
}

test('the idea is the register’s --kp-update, trimmed; none or nothing is no idea', () => {
    assert.equal(updateIdea(' stamp'), 'stamp');
    assert.equal(updateIdea('glitch '), 'glitch');
    assert.equal(updateIdea('none'), '');
    assert.equal(updateIdea(''), '');
    assert.equal(updateIdea(null), '');
});

test('the theme’s time is max(size, close) × 1.25 on its curve without overshoot; nothing plays without one or the other', () => {
    assert.deepEqual(updateTimingOf({ size: 240, close: 200, ease: 'cubic-bezier(0.2, 0, 0, 1)' }), {
        duration: 300,
        ease: 'cubic-bezier(0.2, 0, 0, 1)',
    });
    assert.equal(updateTimingOf({ size: 480, close: 600, ease: 'linear' }).duration, 750);
    assert.equal(updateTimingOf({ size: 0, close: 0, ease: 'linear' }).duration, 0);
    assert.equal(updateTimingOf({ size: 100, close: 100, ease: 'cubic-bezier(0.3, 1.6, 0.6, 1)' }).ease, 'cubic-bezier(0.3, 1, 0.6, 1)');
    assert.equal(updatePlays('stamp', { duration: 300 }), true);
    assert.equal(updatePlays('', { duration: 300 }), false, 'a register without an idea');
    assert.equal(updatePlays('stamp', { duration: 0 }), false, 'reduced motion or a theme without motion');
});

test('the mark goes on after the timing, restarted by a reflow, and comes off leaving the element as it was', () => {
    const el = standIn({ display: 'inline-block' });
    el.attrs.set(UPDATING_ATTRIBUTE, 'stamp'); // a previous update still on
    const before = markUpdating(/** @type {any} */ (el), 'stamp', { duration: 300, ease: 'ease' }, { inline: false });
    assert.deepEqual(el.log, [`remove ${UPDATING_ATTRIBUTE}`, 'reflow', `set ${UPDATING_ATTRIBUTE}=stamp`]);
    assert.equal(el.props.get('--kp-update-duration'), '300ms');
    assert.equal(el.props.get('--kp-update-ease'), 'ease');
    assert.equal(el.props.get('display'), 'inline-block', 'not inline: its display is left alone');
    unmarkUpdating(/** @type {any} */ (el), before);
    assert.equal(el.attrs.has(UPDATING_ATTRIBUTE), false);
    assert.deepEqual(Object.fromEntries(el.props), { display: 'inline-block' });
    assert.deepEqual([...UPDATE_STYLE].sort(), ['--kp-update-duration', '--kp-update-ease', 'display']);
});

test('an inline element plays as an inline-block and is inline again after', () => {
    const el = standIn();
    const before = markUpdating(/** @type {any} */ (el), 'glitch', { duration: 750, ease: 'linear' }, { inline: true });
    assert.equal(el.props.get('display'), 'inline-block');
    unmarkUpdating(/** @type {any} */ (el), before);
    assert.equal(el.props.size, 0);
});
