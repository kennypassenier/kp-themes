// research/character-shared, blueprint: the two things of blueprint's approved
// character (themes/blueprint/CHARACTER.md; research/blueprint-character/
// decided.json, Kenny 2026-10-07 23:41) that a character demo cannot get from
// the package's CSS alone, because the demo's scenes are its own markup:
//
//   arrive(parts, { units })   the part is read out on its scales: the pen set
//       down at its start corner, read along its diagonal, witness lines and
//       pointers on its two scales, each line inked as the pen passes. It is
//       the register's own picture (`[data-kp-arriving]`,
//       `kp-sig-blueprint-read` in css/blueprint-register.css): this only sets
//       the attribute the register answers to, one part after another so no
//       two pens are on the sheet at once, and takes it off when the part is
//       done. Nothing is drawn here.
//   leave(parts, { units })    the arrival played backwards, the register's
//       `[data-kp-leaving]` (the pen goes back through the parts, last first).
//   loading({ ... })           one pen over a scene that waits: the outline of
//       the scene first, then every place a reading will stand, in reading
//       order, the pen up between them (research/blueprint-character/
//       loaders.js, the route "outline"), generated from the scene's own
//       measured geometry. The route ends at 6 units, the marks stand to 15
//       and are lifted, a loop is 18 units (2880 ms); the reduced pose is the
//       marks standing and no pen.
//
// Under prefers-reduced-motion: reduce nothing animates: arrive and leave do
// nothing (the part is simply there), the loading marks stand drawn.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Only blueprint answers: another theme's register has its own picture for these attributes. */
const mine = () => document.documentElement.getAttribute('data-theme') === 'blueprint';

/** The register's unit in ms (`--fx-duration`, 160). */
const unit = () => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;transition-duration:var(--fx-duration,160ms)';
    document.body.append(probe);
    const ms = parseFloat(getComputedStyle(probe).transitionDuration) * 1000;
    probe.remove();
    return ms > 0 ? ms : 160;
};

/**
 * Sets `data-kp-arriving` (or `data-kp-leaving`) on every part, one after
 * another in the order given, each for `units` of the register's unit, and
 * takes it off at the end of the part's own animation.
 * @param {Element[]} parts
 * @param {{ units?: number, attr?: string, name?: string, from?: number }} [options]
 */
function run(parts, { units = 3, attr = 'data-kp-arriving', from = 0 } = {}) {
    if (reduced() || !mine()) return;
    const u = unit();
    parts.forEach((part, i) => {
        const el = /** @type {HTMLElement} */ (part);
        el.removeAttribute(attr);
        el.style.setProperty('--kp-sig-bp-part', `${units * u}ms`);
        el.style.animationDelay = `${(from + i * units) * u}ms`;
        void el.offsetWidth;
        el.setAttribute(attr, '');
        const done = (/** @type {AnimationEvent} */ e) => {
            if (e.target !== el || e.animationName !== 'kp-sig-blueprint-read') return;
            el.removeEventListener('animationend', done);
            el.removeAttribute(attr);
            el.style.removeProperty('--kp-sig-bp-part');
            el.style.animationDelay = '';
        };
        el.addEventListener('animationend', done);
    });
}

export const arrive = (/** @type {Element[]} */ parts, options = {}) => run(parts, { ...options, attr: 'data-kp-arriving' });

/** The leave: the arrival's keyframes played backwards, so the parts go last first. */
export const leave = (/** @type {Element[]} */ parts, options = {}) => run([...parts].reverse(), { ...options, attr: 'data-kp-leaving' });

/**
 * Arrives parts that a demo builds anew: every added node that matches
 * `selector` (or holds matches) is read out, in reading order, in one batch.
 * @param {ParentNode} root
 * @param {string} selector
 * @param {{ units?: number }} [options]
 */
export function arriveWhenAdded(root, selector, options = {}) {
    let batch = new Set();
    let queued = false;
    const flush = () => {
        queued = false;
        const parts = [...batch].filter((el) => el.isConnected);
        batch = new Set();
        parts.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        arrive(parts, options);
    };
    new MutationObserver((records) => {
        for (const r of records)
            for (const n of r.addedNodes) {
                if (!(n instanceof Element)) continue;
                if (n.matches(selector)) batch.add(n);
                for (const m of n.querySelectorAll(selector)) batch.add(m);
            }
        if (batch.size && !queued) {
            queued = true;
            queueMicrotask(flush);
        }
    }).observe(root, { childList: true, subtree: true });
}

/* ------------------------------------------------------------ loading: one pen */

const FEED = 'linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1)';
const ROUTE_END = (6 / 18) * 100;
const STAND = (15 / 18) * 100;
const LIFTED = (16 / 18) * 100;
const SVG = `<svg viewBox="-13 -13 26 26" width="17" height="17" aria-hidden="true" focusable="false"><rect x="-8" y="-8" width="16" height="16" fill="var(--background)"/><rect x="-8" y="-8" width="16" height="16" fill="none" stroke="var(--border-strong)" stroke-width="1.2"/><path d="M-13 0H-3M3 0H13M0 -13V-3M0 3V13" fill="none" stroke="var(--border-strong)" stroke-width="1.2"/><circle r="3.5" fill="none" stroke="var(--primary)" stroke-width="1.2"/><circle class="bpd-load__nib" r="3.5" fill="var(--primary)" stroke="var(--primary)" stroke-width="1.2"/></svg>`;

let serial = 0;

/** @typedef {{ down: boolean, x1: number, y1: number, x2: number, y2: number, place?: boolean }} Move */

const length = (/** @type {Move} */ m) => (Math.abs(m.x2 - m.x1) + Math.abs(m.y2 - m.y1)) / (m.down ? 1 : 3) + (m.down ? 0 : 14);
const hide = (/** @type {Move} */ m) =>
    m.x1 === m.x2 ? (m.y2 > m.y1 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)') : m.x2 > m.x1 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
const pct = (/** @type {number} */ n) => `${+n.toFixed(3)}%`;

/**
 * Builds the one-pen overlay for a scene: its outline, then each place, from
 * the scene's measured box and the places' boxes.
 * @param {HTMLElement} scene
 * @param {HTMLElement} layer
 * @param {HTMLElement[]} places
 * @param {{ outline: boolean }} options
 */
function build(scene, layer, places, { outline }) {
    // The layer fills the scene's padding box: every number is measured from it.
    const box = layer.getBoundingClientRect();
    const w = box.width;
    const h = box.height;
    const id = `bpd-l${++serial}`;
    /** @type {Move[]} */
    const moves = [];
    const move = (
        /** @type {boolean} */ down,
        /** @type {number} */ x1,
        /** @type {number} */ y1,
        /** @type {number} */ x2,
        /** @type {number} */ y2,
        place = false,
    ) => moves.push({ down, x1, y1, x2, y2, place });
    if (outline) {
        move(true, 0, 0, w, 0);
        move(true, w, 0, w, h);
        move(true, w, h, 0, h);
        move(true, 0, h, 0, 0);
    }
    /** @type {number[] | null} */
    let at = outline ? [0, 0] : null;
    const spots = places
        .map((el) => {
            const r = el.getBoundingClientRect();
            return {
                x0: Math.max(4, r.left - box.left + 2),
                x1: Math.min(w - 4, r.right - box.left - 2),
                y: Math.min(h - 5, r.bottom - box.top - 3),
            };
        })
        .filter((p) => p.x1 - p.x0 > 6);
    for (const p of spots) {
        if (at && (at[0] !== p.x0 || at[1] !== p.y)) move(false, at[0], at[1], p.x0, p.y);
        move(true, p.x0, p.y, p.x1, p.y, true);
        at = [p.x1, p.y];
    }
    const total = moves.reduce((sum, m) => sum + length(m), 0) || 1;
    const room = ROUTE_END - 1.2;
    let t = 0.6;
    const timed = moves.map((m) => {
        const span = (length(m) / total) * room;
        const out = { ...m, t0: t, t1: t + span };
        t += span;
        return out;
    });
    const marks = [];
    // Every drawn stroke is a 1 px line, horizontal or vertical, revealed along itself.
    let css = '';
    let n = 0;
    for (const m of timed) {
        if (!m.down) continue;
        const horizontal = m.y1 === m.y2;
        const x = Math.min(m.x1, m.x2);
        const y = Math.min(m.y1, m.y2);
        const style = horizontal
            ? `left:${x}px;top:${Math.min(Math.max(y, 0), h - 1)}px;width:${Math.abs(m.x2 - m.x1)}px;height:1px`
            : `left:${Math.min(Math.max(x, 0), w - 1)}px;top:${y}px;width:1px;height:${Math.abs(m.y2 - m.y1)}px`;
        marks.push(`<i class="bpd-load__g" style="${style};animation-name:${id}-${n}"></i>`);
        css += `@keyframes ${id}-${n}{0%{visibility:hidden;clip-path:${hide(m)}}${pct(m.t0)}{visibility:visible;clip-path:${hide(m)};animation-timing-function:${FEED}}${pct(m.t1)}{clip-path:inset(0)}${pct(STAND)}{visibility:visible;clip-path:inset(0)}${pct(LIFTED)},100%{visibility:hidden;clip-path:inset(0)}}\n`;
        n += 1;
    }
    // The dimension ticks at both ends of a place, standing from its stroke on.
    const ticks = [];
    timed
        .filter((m) => m.place)
        .forEach((m, k) => {
            for (const x of [m.x1, m.x2])
                ticks.push(`<i class="bpd-load__tick" style="left:${x}px;top:${m.y1 - 8}px;animation-name:${id}-t${k}"></i>`);
            css += `@keyframes ${id}-t${k}{0%,${pct(m.t0)}{visibility:hidden}${pct(m.t0 + 0.01)}{visibility:visible}${pct(STAND)}{visibility:visible}${pct(LIFTED)},100%{visibility:hidden}}\n`;
        });
    // The pen: a position at every boundary, the feed inside each move.
    const f = timed[0];
    if (f) {
        let pen = `@keyframes ${id}-pen{0%{opacity:0;translate:${f.x1}px ${f.y1}px}${pct(f.t0 - 0.05)}{opacity:1}`;
        let nib = `@keyframes ${id}-nib{0%{opacity:0}`;
        timed.forEach((m, i) => {
            pen += `${pct(m.t0)}{translate:${m.x1}px ${m.y1}px;animation-timing-function:${FEED}}`;
            nib += `${pct(m.t0)}{opacity:${m.down ? 1 : 0}}${pct(m.t1 - 0.05)}{opacity:${m.down ? 1 : 0}}`;
            if (i === timed.length - 1) pen += `${pct(m.t1)}{translate:${m.x2}px ${m.y2}px}`;
        });
        const end = timed[timed.length - 1];
        pen += `${pct(end.t1 + 0.7)}{opacity:1}${pct(end.t1 + 1.4)},100%{opacity:0;translate:${end.x2}px ${end.y2}px}}\n`;
        nib += `${pct(end.t1 + 0.7)},100%{opacity:0}}\n`;
        css += pen + nib;
    }
    const pen = f
        ? `<span class="bpd-load__pen" style="animation-name:${id}-pen"><span class="bpd-load__car">${SVG.replace('bpd-load__nib"', `bpd-load__nib" style="animation-name:${id}-nib"`)}</span></span>`
        : '';
    return `<style>@media (prefers-reduced-motion:no-preference){${css}}</style>${marks.join('')}${ticks.join('')}${pen}`;
}

/**
 * One pen over every scene that waits.
 * @param {{ root?: ParentNode, scene: string, busy: string, places: string, outline?: boolean, outside?: boolean }} spec
 *   `scene` the part that waits, `busy` the selector the scene matches while it waits, `places` where the readings will stand
 */
export function loading({ root = document, scene, busy, places, outline = true, outside = false }) {
    let queued = false;
    let count = 0;
    const sync = () => {
        queued = false;
        for (const el of /** @type {NodeListOf<HTMLElement>} */ (root.querySelectorAll(scene))) {
            const on = mine() && el.matches(busy) && el.offsetWidth > 0;
            // A scene whose own children are counted (a grid of tiles) is drawn over from its parent.
            const host = outside ? el.parentElement : el;
            if (!host) continue;
            const id = (el.dataset.bpdId ??= String(++count));
            let layer = /** @type {HTMLElement | null} */ (host.querySelector(`:scope > .bpd-load[data-for="${id}"]`));
            if (!on) {
                layer?.remove();
                continue;
            }
            const spots = [...el.querySelectorAll(places)].filter((p) => !p.closest('.bpd-load')).map((p) => /** @type {HTMLElement} */ (p));
            const frame = outside ? `${el.offsetLeft},${el.offsetTop}` : '';
            const key = `${el.offsetWidth}x${el.offsetHeight}@${frame}:${spots.map((p) => `${p.offsetLeft},${p.offsetTop},${p.offsetWidth}`).join(';')}`;
            if (layer && layer.dataset.key === key) continue;
            if (!layer) {
                layer = document.createElement('span');
                layer.className = 'bpd-load';
                layer.dataset.for = id;
                layer.setAttribute('aria-hidden', 'true');
                host.append(layer);
            }
            if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
            if (outside) {
                const h = host.getBoundingClientRect();
                const r = el.getBoundingClientRect();
                layer.style.cssText = `inset:auto;left:${r.left - h.left - host.clientLeft + host.scrollLeft}px;top:${r.top - h.top - host.clientTop + host.scrollTop}px;width:${r.width}px;height:${r.height}px`;
            }
            layer.dataset.key = key;
            layer.innerHTML = build(el, layer, spots, { outline });
        }
    };
    const queue = () => {
        if (!queued) {
            queued = true;
            requestAnimationFrame(sync);
        }
    };
    new MutationObserver((records) => {
        if (records.every((r) => /** @type {Element} */ (r.target).closest?.('.bpd-load'))) return;
        queue();
    }).observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), { subtree: true, childList: true, attributes: true });
    new ResizeObserver(queue).observe(document.documentElement);
    queue();
}

/* ------------------------------------------------------------ read again */

/**
 * A value that changed in place is read again: the register's own picture
 * (`[data-kp-updating='read']`, css/blueprint-register.css): a short ruler is
 * set under the value with a pointer standing on the old reading, which slides
 * to the new one on the feed and stands; ruler and pointer are lifted at the
 * end of 6 units. `from` and `to` are the two readings on the scale, 0 to 1.
 * @param {Element} el
 * @param {{ from?: number, to?: number }} [readings]
 */
export function read(el, { from = 0.2, to = 0.8 } = {}) {
    if (reduced() || !mine()) return;
    const node = /** @type {HTMLElement} */ (el);
    node.removeAttribute('data-kp-updating');
    node.style.setProperty('--kp-bp-from', String(from));
    node.style.setProperty('--kp-bp-to', String(to));
    void node.offsetWidth;
    node.setAttribute('data-kp-updating', 'read');
    const done = (/** @type {AnimationEvent} */ e) => {
        if (e.animationName !== 'kp-sig-blueprint-update-read') return;
        node.removeEventListener('animationend', done);
        node.removeAttribute('data-kp-updating');
        node.style.removeProperty('--kp-bp-from');
        node.style.removeProperty('--kp-bp-to');
    };
    node.addEventListener('animationend', done);
}

/** Where a sparkline's last reading stands on its own range, 0 (the lowest reading) to 1 (the highest). @param {Element | null} svg */
export function lastReading(svg) {
    const d = svg?.querySelector('.kp-kpi__spark-line')?.getAttribute('d') ?? '';
    const ys = [...d.matchAll(/[-\d.]+[ ,]+([-\d.]+)/g)].map((m) => Number(m[1])).filter((y) => !Number.isNaN(y));
    if (ys.length < 2) return 0.5;
    const low = Math.min(...ys);
    const high = Math.max(...ys);
    return high === low ? 0.5 : 1 - /** @type {number} */ (ys.at(-1) - low) / (high - low);
}

/**
 * A reading on a vertical scale is read again: an amber pointer on the plot's
 * own scale waits at the old reading, slides to the new one and stands, with a
 * witness line from the scale to the reading; both are lifted at the end of 6
 * units. `from` and `to` are fractions of the plot's height from its top.
 * @param {Element} plot
 * @param {{ from: number, to: number }[]} readings
 */
export function readY(plot, readings) {
    if (reduced() || !mine()) return;
    const host = /** @type {HTMLElement} */ (plot);
    for (const old of host.querySelectorAll(':scope > .bpd-yread')) old.remove();
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    for (const { from, to } of readings) {
        const layer = document.createElement('span');
        layer.className = 'bpd-yread';
        layer.setAttribute('aria-hidden', 'true');
        layer.style.setProperty('--bpd-from', String(from));
        layer.style.setProperty('--bpd-to', String(to));
        layer.innerHTML = '<span class="bpd-yread__at"></span>';
        layer.addEventListener('animationend', () => layer.remove());
        host.append(layer);
    }
}
