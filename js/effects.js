// The effects module [S45, AR34, AR35, AR44]: the reveals of the hook
// vocabulary, in one file, for both channels.
//
// A consumer marks what a passage IS — `data-kp-surface="hero"`, a
// `<mark>`, `data-kp-reveal="headline|emphasis|rule"`, `data-kp-divider`
// — and a theme decides what that looks like. This module performs the
// part a stylesheet cannot: the decipher of a headline, the clearance of
// marks one after another, the rule that draws when its heading scrolls
// into view. It toggles state classes only (STATE); the register paints.
//
// Which reveals a theme performs is the theme's answer, read from three
// custom properties on the root (`--kp-reveal-headline: decipher`, and so
// on, ROUTINES): a theme that declares none has answered quietly, and the
// module leaves the element at rest. Under formal a headline is a
// headline.
//
// Every reveal has a rest state that holds without this script: the
// register keys its start states on the root attribute `data-kp-effects`,
// which the head snippet (js/no-flash.js) sets before first paint and
// attachEffects() sets again, so a page without the module shows drawn
// rules and clear marks, and a page with it never flashes from rest to
// start [AR34].
//
// Reveals run once per session per page by default — a server-rendered
// dashboard is a full load per click, and nobody wants the heading to
// decipher on every one — and `data-kp-reveal-every="load"` opts back in
// [AR44]. The memo is sessionStorage, key per path and hook, the module's
// only storage (M4).
//
// Nothing here throws. An unknown surface or reveal value is reported
// once per page as `kp-effect-unknown` with the accepted values, and
// js/diagnostics.js lists it. Reduced motion, at attach or mid-session,
// resolves every running reveal to its rest state at once [DI7].
//
//   import { attachEffects } from '@kp-soft/themes/js/effects';
//   const effects = attachEffects(document, { threshold: 0.6 });
//   effects.observe(elementRenderedLater);
//   effects.detach();
//
// DI5: every animation the register runs has its row in TIMINGS below,
// and gates/check-motion.mjs holds the table and the keyframes in step
// and reports every rate (S42: reported, never corrected by the gate).

/** The attributes of the hook vocabulary [AR35]. Contract values. */
import { getStrings } from './strings.js';

export const HOOKS = Object.freeze({
    surface: 'data-kp-surface',
    reveal: 'data-kp-reveal',
    revealTrigger: 'data-kp-reveal-trigger',
    revealEvery: 'data-kp-reveal-every',
    divider: 'data-kp-divider',
    label: 'data-kp-label',
    navSide: 'data-kp-nav-side',
});

/** The surfaces a section can stand on [TH116]. */
export const SURFACES = Object.freeze(['hero', 'app']);

/** What an element can be revealed as [TH119, TH120, TH122]. */
export const REVEALS = Object.freeze(['headline', 'emphasis', 'rule']);

/**
 * The state classes this module toggles, and nothing else. Contract
 * values: a consumer may select on them, a register does.
 */
export const STATE = Object.freeze({
    in: 'is-in',
    cleared: 'is-cleared',
    deciphered: 'is-deciphered',
    glitching: 'is-glitching',
    noise: 'is-noise',
    // The synthwave routines [SW2]: the tracking wipe and the shine of a
    // headline, and the boot overlay switching off.
    tracking: 'is-tracking',
    shine: 'is-shine',
    off: 'is-off',
});

/**
 * The custom properties a theme declares to say which reveals it performs
 * [S45]: `--kp-reveal-headline: decipher`, `--kp-reveal-emphasis:
 * classified`, `--kp-reveal-rule: draw`. Absent or empty means quiet.
 */
export const ROUTINES = Object.freeze({
    headline: '--kp-reveal-headline',
    emphasis: '--kp-reveal-emphasis',
    rule: '--kp-reveal-rule',
    // How the page arrives, read from the root [SW2]: `boot` builds the
    // overlay below; anything else, or nothing, is quiet.
    arrival: '--kp-arrival',
});
/** The class names of the arrival overlay the module builds. */
export const ARRIVAL = Object.freeze({ root: 'kp-boot', line: 'kp-boot__line', skip: 'kp-boot__skip' });

/** Set on the root before first paint; the register keys its start states on it [AR34]. */
export const ROOT_ATTRIBUTE = 'data-kp-effects';

/** Set on the root once the reveals of a load have run. */
export const DONE_ATTRIBUTE = 'data-kp-effects-done';

/** The copy of a headline the register's slice pseudo-elements read. */
export const TEXT_ATTRIBUTE = 'data-kp-text';

/**
 * Dispatched once per page on an element that names a surface or a
 * reveal the vocabulary does not know, bubbling. detail:
 * `{ hook, value, accepted }`. Never thrown [AR44].
 */
export const UNKNOWN_EVENT = 'kp-effect-unknown';

/**
 * Dispatched on an element when its reveal has reached its rest state,
 * bubbling. detail: `{ reveal, routine, skipped }` — `skipped` says the
 * element went straight to rest (reduced motion, a quiet theme, or seen
 * this session) rather than through the motion.
 */
export const REVEAL_EVENT = 'kp-reveal';

/** The sessionStorage key prefix of the once-per-session memo [AR44, M4]. */
export const MEMO_PREFIX = 'kp-effects:';

/** The glyphs a headline deciphers through [AR40]: no block glyphs. */
export const GLYPHS = '01<>/\\|=+*#%@&$?!ZXKQ';

/**
 * DI5 for every animation the package runs [TH129, T20, AR40].
 *
 * One row per keyframe name: how long, how often, what moves, and the
 * opacity at each keyframe step (the luminance the gate rates). The
 * register's keyframes carry no comment of their own; this is the table
 * and gates/check-motion.mjs refuses a keyframe without a row or a row
 * whose steps drift from its keyframe. Rates are reported, never
 * corrected (S42).
 *
 * @type {Readonly<Record<string, { durationMs: number, cycles: number, property: string, luminanceSteps: number[] }>>}
 */
export const TIMINGS = Object.freeze({
    // The 5.0.0 register [S41, C2]: the navbar strip entering, the hover
    // glitch (two steps, once), the headline's slice burst (one burst of
    // six bands, once) and the charge sweep (a transform, no luminance).
    // The synthwave register [SW1]: the tracking wipe and the shine of the
    // chrome headline, the tube that switches on (one dip), the sun cut on
    // a button, the bar entering, the floor's drift and the CRT switching
    // the boot overlay off — every one once, except the drift, which moves
    // a pattern and never changes luminance.
    'kp-tracking': { durationMs: 700, cycles: 1, property: 'opacity', luminanceSteps: [1, 0] },
    'kp-shine': { durationMs: 1400, cycles: 1, property: 'background-position', luminanceSteps: [] },
    'kp-tube-on': { durationMs: 1100, cycles: 1, property: 'color', luminanceSteps: [0, 1, 0, 1] },
    'kp-sun-cut': { durationMs: 360, cycles: 1, property: 'opacity', luminanceSteps: [1, 1, 0] },
    'kp-bar-in': { durationMs: 520, cycles: 1, property: 'opacity', luminanceSteps: [0, 1] },
    'kp-floor-drift': { durationMs: 6000, cycles: Infinity, property: 'background-position', luminanceSteps: [] },
    'kp-crt-off': { durationMs: 550, cycles: 1, property: 'opacity', luminanceSteps: [1, 0] },
    'kp-strip-in': { durationMs: 520, cycles: 1, property: 'opacity', luminanceSteps: [0, 1] },
    'kp-strip-in-end': { durationMs: 520, cycles: 1, property: 'opacity', luminanceSteps: [0, 1] },
    'kp-slice-a': { durationMs: 320, cycles: 1, property: 'opacity', luminanceSteps: [1, 1, 0] },
    'kp-slice-1': { durationMs: 600, cycles: 1, property: 'opacity', luminanceSteps: [1, 0, 0] },
    'kp-slice-2': { durationMs: 600, cycles: 1, property: 'opacity', luminanceSteps: [1, 0, 0] },
    'kp-charge': { durationMs: 520, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-slide-in': { durationMs: 140, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-rule-in': { durationMs: 420, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-settle': { durationMs: 140, cycles: 1, property: 'transform', luminanceSteps: [] },
    'kp-blink': { durationMs: 1000, cycles: Infinity, property: 'opacity', luminanceSteps: [1, 1, 0, 0] },
    'kp-drift': { durationMs: 40000, cycles: Infinity, property: 'background-position', luminanceSteps: [] },
    'kp-ember': { durationMs: 840, cycles: 1, property: 'box-shadow', luminanceSteps: [] },
    'kp-spin': { durationMs: 900, cycles: Infinity, property: 'transform', luminanceSteps: [] },
    'kp-pulse': { durationMs: 1600, cycles: Infinity, property: 'opacity', luminanceSteps: [1, 0.6, 1] },
});

/**
 * @typedef {object} EffectsOptions
 * @property {boolean} [reduceMotion] override the media query (a test, or a consumer's own switch)
 * @property {number} [threshold] IntersectionObserver ratio for the rule (default: `--kp-reveal-threshold`, 0.6)
 * @property {number} [cps] decipher characters per second (default: `--kp-decipher-cps`, 26)
 * @property {number} [stagger] ms between one mark clearing and the next (default: `--kp-reveal-stagger`, 260)
 * @property {number} [delay] ms before the first mark clears on load (default: `--kp-classified-delay`, 1500)
 * @property {boolean} [manageRoot] set and, on detach, remove the root attribute (default true; a wrapper around one element passes false)
 */

/**
 * @typedef {object} EffectsHandle
 * @property {() => void} detach stop everything the module started and remove the root attribute; safe to call twice
 * @property {(element: Element) => void} observe start an element rendered after attach, and its subtree [AR34]
 */

/** Elements this module has started, so a second attach does not start them again [AR34]. */
const started = new WeakSet();

/** The unknown hook values reported on this page, `hook=value`, for the diagnostics [AR44]. */
const unknownReported = new Set();

/** What has been reported as unknown on this page, for js/diagnostics.js. */
export function unknownEffects() {
    return [...unknownReported];
}

/**
 * Attach the reveals under `root` and return a handle.
 *
 * @param {Document | Element} [root]
 * @param {EffectsOptions} [options]
 * @returns {EffectsHandle}
 */
export function attachEffects(root = document, options = {}) {
    const doc = root.ownerDocument ?? /** @type {Document} */ (root);
    const html = doc.documentElement;
    const manageRoot = options.manageRoot ?? true;
    const view = doc.defaultView;
    const query = view && typeof view.matchMedia === 'function' ? view.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const reduced = () => options.reduceMotion ?? (query ? query.matches : false);
    const rootStyle = view ? view.getComputedStyle(html) : null;
    /** @param {string} name @param {number} fallback */
    const knob = (name, fallback) => {
        const n = rootStyle ? parseFloat(rootStyle.getPropertyValue(name)) : NaN;
        return Number.isFinite(n) ? n : fallback;
    };
    // The knobs are read once per attach, not per element [AR43].
    const cfg = {
        threshold: options.threshold ?? knob('--kp-reveal-threshold', 0.6),
        cps: options.cps ?? knob('--kp-decipher-cps', 26),
        lead: knob('--kp-decipher-lead', 260),
        swap: knob('--kp-decipher-swap', 0.5),
        stagger: options.stagger ?? knob('--kp-reveal-stagger', 260),
        delay: options.delay ?? knob('--kp-classified-delay', 1500),
    };
    if (manageRoot) html.setAttribute(ROOT_ATTRIBUTE, '');

    let detached = false;
    /** @type {Set<ReturnType<typeof setTimeout>>} */
    const timers = new Set();
    /** @type {Set<number>} */
    const frames = new Set();
    /** @type {Array<() => void>} */
    const cleanups = [];
    /** @type {Array<() => void>} */
    const finishers = [];
    /** @type {IntersectionObserver | null} */
    let io = null;
    let pending = 0;

    const done = () => {
        if (detached || pending > 0) return;
        html.setAttribute(DONE_ATTRIBUTE, '');
    };
    /** @param {Element} el @param {string} reveal @param {string} routine @param {boolean} skipped */
    const announce = (el, reveal, routine, skipped) => {
        el.dispatchEvent(new CustomEvent(REVEAL_EVENT, { bubbles: true, detail: { reveal, routine, skipped } }));
    };
    /** @param {() => void} fn @param {number} ms */
    const later = (fn, ms) => {
        const id = setTimeout(() => {
            timers.delete(id);
            if (!detached) fn();
        }, ms);
        timers.add(id);
    };
    /** @param {Element} el @param {'headline' | 'emphasis' | 'rule' | 'arrival'} reveal */
    const routineOf = (el, reveal) => (view ? view.getComputedStyle(el).getPropertyValue(ROUTINES[reveal]).trim() : '');
    /**
     * The memo key: the path, the hook, and the element's position among
     * its kind — so the hero's marks and the dossier's are two memos, and
     * a second headline on the page is its own [AR44].
     *
     * @param {Element} el @param {string} reveal
     */
    const memoKey = (el, reveal) => {
        const kind = reveal === 'emphasis' && el.matches('mark') ? 'loose' : [...doc.querySelectorAll(`[${HOOKS.reveal}='${reveal}']`)].indexOf(el);
        return `${MEMO_PREFIX}${view?.location.pathname ?? ''}:${reveal}:${kind}`;
    };
    /** @param {Element} el @param {string} reveal @returns {boolean} true when this page already ran the reveal this session */
    const seen = (el, reveal) => {
        if (el.getAttribute(HOOKS.revealEvery) === 'load') return false;
        try {
            const key = memoKey(el, reveal);
            const storage = view?.sessionStorage;
            if (!storage) return false;
            if (storage.getItem(key)) return true;
            storage.setItem(key, '1');
            return false;
        } catch {
            return false;
        }
    };

    // ── Unknown values [AR44] ─────────────────────────────────────────
    /** @param {Element} el */
    const checkValues = (el) => {
        /** @type {[string, readonly string[]][]} */
        const pairs = [
            [HOOKS.surface, SURFACES],
            [HOOKS.reveal, REVEALS],
        ];
        for (const [hook, accepted] of pairs) {
            const value = el.getAttribute(hook);
            if (value === null || accepted.includes(value)) continue;
            const key = `${hook}=${value}`;
            if (unknownReported.has(key)) continue;
            unknownReported.add(key);
            el.dispatchEvent(new CustomEvent(UNKNOWN_EVENT, { bubbles: true, detail: { hook, value, accepted: [...accepted] } }));
        }
    };

    // ── The headline: decipher, then one slice burst [TH119] ───────────
    /** @param {Element} el */
    const headline = (el) => {
        const text = el.textContent ?? '';
        el.setAttribute(TEXT_ATTRIBUTE, text);
        if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
        const routine = routineOf(el, 'headline');
        /** @param {boolean} skipped */
        const rest = (skipped) => {
            el.textContent = text;
            el.classList.add(STATE.deciphered);
            announce(el, 'headline', routine, skipped);
        };
        if (routine === '' || reduced() || seen(el, 'headline')) {
            rest(true);
            return;
        }
        if (routine === 'tracking') {
            // The synthwave headline [SW2]: the text stays whole; one tracking
            // wipe crosses it, then one shine. The register animates the
            // classes; without an animation the classes come off by the
            // table's durations, so nothing waits on an event that never comes.
            pending++;
            let ended = false;
            const shine = () => {
                if (ended) return;
                ended = true;
                el.classList.remove(STATE.tracking);
                el.classList.add(STATE.shine);
                const off = () => el.classList.remove(STATE.shine);
                el.addEventListener('animationend', off, { once: true });
                later(off, TIMINGS['kp-shine'].durationMs + 50);
                rest(false);
                pending--;
                done();
            };
            finishers.push(shine);
            el.classList.add(STATE.tracking);
            const onEnd = (/** @type {Event} */ e) => {
                if (/** @type {AnimationEvent} */ (e).animationName !== 'kp-tracking') return;
                el.removeEventListener('animationend', onEnd);
                shine();
            };
            el.addEventListener('animationend', onEnd);
            later(shine, TIMINGS['kp-tracking'].durationMs + 50);
            return;
        }
        pending++;
        const chars = [...text];
        const spans = chars.map((ch) => {
            const span = doc.createElement('span');
            span.setAttribute('data-glyph', '');
            span.setAttribute('aria-hidden', 'true');
            if (/\s/.test(ch)) span.textContent = ch;
            else {
                span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                span.classList.add(STATE.noise);
            }
            return span;
        });
        el.replaceChildren(...spans);
        const perChar = 1000 / Math.max(1, cfg.cps);
        let start = 0;
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            rest(false);
            el.classList.add(STATE.glitching);
            const off = () => el.classList.remove(STATE.glitching);
            el.addEventListener('animationend', off, { once: true });
            // No animation (a quiet register, or reduced motion switched on
            // mid-run): the class comes off on its own.
            later(off, TIMINGS['kp-slice-1'].durationMs + 50);
            pending--;
            done();
        };
        finishers.push(finish);
        /** @param {number} now */
        const tick = (now) => {
            frames.delete(id);
            if (detached || finished) return;
            if (start === 0) start = now;
            const t = now - start;
            let all = true;
            spans.forEach((span, i) => {
                const ch = chars[i] ?? '';
                if (/\s/.test(ch)) return;
                if (t > cfg.lead + i * perChar) {
                    if (span.classList.contains(STATE.noise)) {
                        span.textContent = ch;
                        span.classList.remove(STATE.noise);
                    }
                } else {
                    all = false;
                    if (Math.random() < cfg.swap) span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                }
            });
            if (all) finish();
            else id = schedule();
        };
        let id = 0;
        const schedule = () => {
            const next = view ? view.requestAnimationFrame(tick) : 0;
            frames.add(next);
            return next;
        };
        id = schedule();
    };

    // ── Emphasis: marks clear themselves, or on a trigger [TH120] ──────
    /** @param {Element[]} marks @param {number} first @param {number} step @param {Element} on @param {string} routine */
    const clearInSteps = (marks, first, step, on, routine) => {
        if (marks.length === 0) return;
        pending++;
        finishers.push(() => {
            for (const mark of marks) mark.classList.add(STATE.cleared);
        });
        marks.forEach((mark, i) => {
            later(
                () => {
                    mark.classList.add(STATE.cleared);
                    if (i === marks.length - 1) {
                        pending--;
                        announce(on, 'emphasis', routine, false);
                        done();
                    }
                },
                first + i * step,
            );
        });
    };
    /** @param {Element} container an element carrying data-kp-reveal="emphasis" */
    const emphasis = (container) => {
        const marks = [...container.querySelectorAll('mark')];
        const routine = routineOf(container, 'emphasis');
        const trigger = container.querySelector(`[${HOOKS.revealTrigger}]`);
        // A container with nothing to clear (a button that carries the hook
        // for its own reveal) touches neither the marks nor the memo.
        if (marks.length === 0) {
            announce(container, 'emphasis', routine, true);
            return;
        }
        const atRest = () => {
            for (const mark of marks) mark.classList.add(STATE.cleared);
            announce(container, 'emphasis', routine, true);
        };
        if (routine === '' || reduced()) {
            atRest();
            if (trigger) wireTrigger(trigger, marks, container, routine);
            return;
        }
        if (trigger) {
            // The dossier: the marks stay covered until the trigger opens the
            // file; the register staggers the lift. A second press closes it.
            wireTrigger(trigger, marks, container, routine);
            trigger.setAttribute('aria-pressed', 'false');
            return;
        }
        if (seen(container, 'emphasis')) {
            atRest();
            return;
        }
        clearInSteps(marks, cfg.delay, cfg.stagger, container, routine);
    };
    /** @param {Element} trigger @param {Element[]} marks @param {Element} container @param {string} routine */
    const wireTrigger = (trigger, marks, container, routine) => {
        const onClick = () => {
            const open = trigger.getAttribute('aria-pressed') !== 'true';
            trigger.setAttribute('aria-pressed', String(open));
            for (const mark of marks) mark.classList.toggle(STATE.cleared, open);
            announce(container, 'emphasis', routine, false);
        };
        trigger.addEventListener('click', onClick);
        cleanups.push(() => trigger.removeEventListener('click', onClick));
    };
    /** The marks outside any emphasis container clear on load, one after another. */
    /** @param {ParentNode} scope */
    const looseMarks = (scope) => {
        const marks = [...scope.querySelectorAll('mark')].filter((m) => m.closest(`[${HOOKS.reveal}='emphasis']`) === null && !started.has(m));
        if (marks.length === 0) return;
        for (const m of marks) started.add(m);
        const first = marks[0];
        const routine = routineOf(first, 'emphasis');
        if (routine === '' || reduced() || seen(first, 'emphasis')) {
            for (const mark of marks) mark.classList.add(STATE.cleared);
            announce(first, 'emphasis', routine, true);
            return;
        }
        clearInSteps(marks, cfg.delay, cfg.stagger, first, routine);
    };

    // ── The rule: drawn when its heading enters the viewport [TH122] ───
    /** @param {Element} el */
    const rule = (el) => {
        const routine = routineOf(el, 'rule');
        /** @param {boolean} skipped */
        const draw = (skipped) => {
            el.classList.add(STATE.in);
            announce(el, 'rule', routine, skipped);
        };
        if (routine === '' || reduced() || seen(el, 'rule') || !view || typeof view.IntersectionObserver !== 'function') {
            draw(true);
            return;
        }
        pending++;
        finishers.push(() => draw(false));
        io ??= new view.IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    io?.unobserve(entry.target);
                    entry.target.classList.add(STATE.in);
                    announce(entry.target, 'rule', routine, false);
                    pending--;
                    done();
                }
            },
            { threshold: cfg.threshold },
        );
        io.observe(el);
    };

    // ── Dispatch ──────────────────────────────────────────────────────
    /** @param {Element} el */
    const startOne = (el) => {
        if (started.has(el)) return;
        checkValues(el);
        const reveal = el.getAttribute(HOOKS.reveal);
        if (reveal === null || !REVEALS.includes(reveal)) return;
        started.add(el);
        if (reveal === 'headline') headline(el);
        else if (reveal === 'emphasis') emphasis(el);
        else rule(el);
    };
    /** @param {ParentNode | Element} scope */
    const scan = (scope) => {
        if (scope instanceof Element && scope.hasAttribute(HOOKS.reveal)) startOne(scope);
        if (scope instanceof Element && scope.hasAttribute(HOOKS.surface)) checkValues(scope);
        for (const el of scope.querySelectorAll(`[${HOOKS.surface}], [${HOOKS.reveal}]`)) startOne(el);
        looseMarks(scope);
        done();
    };

    // Reduced motion switched on mid-session: every running reveal
    // resolves to its rest state at once [DI7].
    const onPreference = () => {
        if (!reduced()) return;
        for (const id of timers) clearTimeout(id);
        timers.clear();
        for (const id of frames) view?.cancelAnimationFrame(id);
        frames.clear();
        io?.disconnect();
        io = null;
        for (const finish of finishers.splice(0)) finish();
        pending = 0;
        done();
    };
    if (query) {
        query.addEventListener('change', onPreference);
        cleanups.push(() => query.removeEventListener('change', onPreference));
    }

    scan(root);

    // ── The arrival [SW2]: how the page comes on ───────────────────────
    // A theme answers `--kp-arrival` on the root; `boot` is synthwave's:
    // a diegetic line counting up in the overlay the register paints, a
    // Skip button, and the CRT switching the overlay off. Once per session,
    // never under reduced motion, and every word from the dictionary [KT5].
    const arrival = () => {
        const routine = rootStyle ? rootStyle.getPropertyValue(ROUTINES.arrival).trim() : '';
        if (routine !== 'boot' || !doc.body) return;
        if (reduced() || seen(html, 'arrival')) {
            announce(html, 'arrival', routine, true);
            return;
        }
        const words = getStrings();
        const overlay = doc.createElement('div');
        overlay.className = ARRIVAL.root;
        const line = doc.createElement('pre');
        line.className = ARRIVAL.line;
        line.setAttribute('aria-live', 'polite');
        const skip = doc.createElement('button');
        skip.type = 'button';
        skip.className = ARRIVAL.skip;
        skip.textContent = words.arrivalSkip;
        overlay.append(line, skip);
        doc.body.append(overlay);
        pending++;
        let ended = false;
        let pct = 0;
        const remove = () => {
            overlay.remove();
            announce(html, 'arrival', routine, false);
            pending--;
            done();
        };
        const end = () => {
            if (ended) return;
            ended = true;
            if (reduced()) {
                remove();
                return;
            }
            overlay.classList.add(STATE.off);
            overlay.addEventListener('animationend', remove, { once: true });
            later(remove, TIMINGS['kp-crt-off'].durationMs + 50);
        };
        const step = () => {
            if (ended) return;
            pct = Math.min(100, pct + 7 + Math.floor(Math.random() * 9));
            line.textContent = [words.arrivalLine, words.arrivalProgress + ' ' + pct + '%', pct === 100 ? words.arrivalReady : '']
                .filter(Boolean)
                .join('\n');
            if (pct === 100) later(end, 220);
            else later(step, 110);
        };
        skip.addEventListener('click', end);
        finishers.push(end);
        cleanups.push(() => overlay.remove());
        step();
    };
    arrival();

    return {
        detach() {
            if (detached) return;
            detached = true;
            for (const id of timers) clearTimeout(id);
            timers.clear();
            for (const id of frames) view?.cancelAnimationFrame(id);
            frames.clear();
            io?.disconnect();
            io = null;
            for (const cleanup of cleanups.splice(0)) cleanup();
            if (manageRoot) html.removeAttribute(ROOT_ATTRIBUTE);
        },
        observe(element) {
            if (detached) return;
            scan(element);
        },
    };
}
