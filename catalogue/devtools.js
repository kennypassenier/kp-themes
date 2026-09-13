// The catalogue's developer overlay: three tools a reviewer needs while
// looking at a theme, and nothing a consumer's page ever loads.
//
//   inspect   the computed colour under the cursor AND which token it came
//             from, because "hsl(52 100% 50%)" says what is wrong and
//             "--accent" says what to change
//   timeline  pause every animation on the page, scrub it, step a frame at
//             a time, replay it from the start
//   ruler     the size of an element, and the distance between two
//
// Why not an eyedropper: EyeDropper is Chromium-only and Kenny's browser is
// a Firefox derivative, so a pixel reader would be dead here. The computed
// value is also the more useful answer — a pixel cannot tell you its token.
//
// The timeline arms its recorder BEFORE anything runs (fix-1): a finite
// animation is gone from getAnimations() the moment it ends, so a tool that
// only asks afterwards sees an empty page and reports "no animations".
import { contrast, hsl } from '../js/contrast.js';

const NS = 'kp-devtools';
let panel = null;
let mode = 'inspect';
const recorded = new Set();
let observer = null;
const ruler = { first: null, second: null };
// The document listeners of the open overlay. Each open used to add another
// set and none were removed, so after a second open one click ran the ruler
// twice and picked its element as first and second at once (Kenny,
// 2026-09-14). They now go when the overlay closes.
let listening = null;

/* ------------------------------------------------------------------ tokens */

/** Every custom property declared on the root, as {name: value}. */
function rootTokens() {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const found = {};
    // Modern engines enumerate custom properties here; where one does not,
    // the stylesheets are read instead so the tool degrades to slower
    // rather than to silent.
    for (const name of computed) {
        if (name.startsWith('--')) found[name] = computed.getPropertyValue(name).trim();
    }
    if (Object.keys(found).length) return found;
    for (const sheet of document.styleSheets) {
        let rules;
        try {
            rules = sheet.cssRules;
        } catch {
            continue; // a cross-origin sheet; nothing to read
        }
        for (const rule of rules ?? []) {
            if (!rule.selectorText || !rule.selectorText.includes(':root')) continue;
            for (const name of rule.style) {
                if (!name.startsWith('--')) continue;
                const value = computed.getPropertyValue(name).trim();
                if (value) found[name] = value;
            }
        }
    }
    return found;
}

/** A colour as the browser resolved it, in the shape tokens are written. */
function asRgb(value) {
    if (!value) return null;
    const probe = document.createElement('span');
    probe.style.color = value;
    document.body.append(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    const parts = resolved.match(/[\d.]+/g);
    return parts && parts.length >= 3 ? parts.slice(0, 3).map(Number) : null;
}

function sameColour(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

let tokenIndex = null;
function indexTokens() {
    const tokens = rootTokens();
    const index = [];
    for (const [name, value] of Object.entries(tokens)) {
        const rgb = asRgb(value.includes('%') && !value.startsWith('hsl') ? `hsl(${value})` : value);
        if (rgb) index.push({ name, value, rgb });
    }
    return index;
}

/** The token whose value the browser resolves to this same colour. */
function tokenFor(colour) {
    tokenIndex ??= indexTokens();
    const rgb = asRgb(colour);
    if (!rgb) return null;
    return tokenIndex.find((entry) => sameColour(entry.rgb, rgb))?.name ?? null;
}

/* ----------------------------------------------------------------- inspect */

function describe(element) {
    const style = getComputedStyle(element);
    const rows = [];
    const pairs = [
        ['color', style.color],
        ['background', style.backgroundColor],
        ['border', style.borderTopColor],
    ];
    for (const [label, value] of pairs) {
        if (!value || value === 'rgba(0, 0, 0, 0)') continue;
        const token = tokenFor(value);
        rows.push(`${label}: ${value}${token ? `  ←  ${token}` : ''}`);
    }
    // The one number a reviewer keeps having to work out by hand.
    try {
        const ink = hsl(style.color);
        const ground = hsl(style.backgroundColor);
        if (ink && ground) rows.push(`contrast: ${contrast(ink, ground).toFixed(2)}`);
    } catch {
        /* a colour neither module parses; the rows above still stand */
    }
    const box = element.getBoundingClientRect();
    rows.push(`box: ${Math.round(box.width)} × ${Math.round(box.height)} px`);
    const name = [element.tagName.toLowerCase(), ...[...element.classList].filter((c) => c.startsWith('kp-')).map((c) => `.${c}`)].join('');
    return { name, rows };
}

/* ---------------------------------------------------------------- timeline */

/** Remember every animation the page starts, from now on. */
function record() {
    for (const animation of document.getAnimations()) recorded.add(animation);
}

function armRecorder() {
    record();
    observer?.disconnect();
    observer = new MutationObserver(() => record());
    observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
    });
    // A transition starts without a mutation the observer would see.
    document.addEventListener('transitionrun', record, true);
    document.addEventListener('animationstart', record, true);
}

function live() {
    return [...recorded].filter((a) => a.effect && a.playState !== 'idle');
}

function longest() {
    let total = 0;
    for (const animation of live()) {
        const timing = animation.effect.getComputedTiming();
        const end = (Number(timing.endTime) || 0) + (Number(timing.delay) || 0);
        if (Number.isFinite(end)) total = Math.max(total, end);
    }
    return total || 1000;
}

function pauseAll() {
    for (const animation of live()) animation.pause();
}

function playAll() {
    for (const animation of live()) animation.play();
}

function seek(ms) {
    for (const animation of live()) {
        const timing = animation.effect.getComputedTiming();
        const end = Number(timing.endTime);
        animation.pause();
        animation.currentTime = Number.isFinite(end) ? Math.min(ms, end) : ms;
    }
}

function replay() {
    for (const animation of live()) {
        animation.cancel();
        animation.play();
        animation.pause();
        animation.currentTime = 0;
    }
}

/* ------------------------------------------------------------------- ruler */

function outline(element, colour) {
    const box = element.getBoundingClientRect();
    const mark = document.createElement('div');
    mark.className = `${NS}__mark`;
    Object.assign(mark.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '2147483646',
        outline: `2px solid ${colour}`,
        insetInlineStart: `${box.left}px`,
        insetBlockStart: `${box.top}px`,
        inlineSize: `${box.width}px`,
        blockSize: `${box.height}px`,
    });
    document.body.append(mark);
    return mark;
}

function clearMarks() {
    for (const mark of document.querySelectorAll(`.${NS}__mark`)) mark.remove();
}

function gap(a, b) {
    const x = a.right < b.left ? b.left - a.right : b.right < a.left ? a.left - b.right : 0;
    const y = a.bottom < b.top ? b.top - a.bottom : b.bottom < a.top ? a.top - b.bottom : 0;
    return { x: Math.round(x), y: Math.round(y) };
}

/* ------------------------------------------------------------------- panel */

const CSS = `
.${NS} {
    position: fixed; inset-block-end: 1rem; inset-inline-end: 1rem;
    inline-size: min(26rem, calc(100vw - 2rem)); z-index: 2147483647;
    font: 12px/1.5 ui-monospace, monospace;
    background: #10131a; color: #e8ecf4; border: 1px solid #39405a;
    border-radius: 6px; box-shadow: 0 10px 30px rgb(0 0 0 / 45%);
}
.${NS}__head { display: flex; gap: .3rem; padding: .45rem; border-block-end: 1px solid #39405a; }
.${NS} button { font: inherit; background: #1b2030; color: #e8ecf4;
    border: 1px solid #39405a; border-radius: 4px; padding: .2rem .5rem; cursor: pointer; }
.${NS} button[aria-pressed='true'] { background: #2f6df6; border-color: #2f6df6; }
.${NS}__body { padding: .6rem; max-block-size: 40vh; overflow: auto; white-space: pre-wrap; }
.${NS}__row { display: flex; gap: .3rem; align-items: center; padding: 0 .6rem .6rem; }
.${NS}__row input[type='range'] { flex: 1 1 auto; }
.${NS}__hint { color: #97a1bb; padding: 0 .6rem .6rem; }
`;

function build() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.append(style);

    panel = document.createElement('div');
    panel.className = NS;
    panel.setAttribute('role', 'complementary');
    panel.setAttribute('aria-label', 'Catalogue developer tools');
    panel.innerHTML = `
        <div class="${NS}__head">
            <button type="button" data-tool="inspect" aria-pressed="true">Inspect</button>
            <button type="button" data-tool="timeline" aria-pressed="false">Timeline</button>
            <button type="button" data-tool="ruler" aria-pressed="false">Ruler</button>
            <button type="button" data-tool="close" style="margin-inline-start:auto">✕</button>
        </div>
        <div class="${NS}__body" data-out>Move the pointer over the page.</div>
        <div class="${NS}__row" hidden data-timeline>
            <button type="button" data-act="replay">⏮</button>
            <button type="button" data-act="step-back">◀</button>
            <button type="button" data-act="play">▶</button>
            <button type="button" data-act="step">▶∣</button>
            <input type="range" min="0" max="1000" value="0" data-seek aria-label="Animation time">
        </div>
        <div class="${NS}__hint">Alt+D closes · Ruler: click two elements</div>`;
    document.body.append(panel);

    const out = panel.querySelector('[data-out]');
    const row = panel.querySelector('[data-timeline]');
    const range = panel.querySelector('[data-seek]');

    panel.addEventListener('click', (event) => {
        const tool = event.target.closest('[data-tool]')?.dataset.tool;
        if (tool === 'close') return closeDevtools();
        if (tool) {
            mode = tool;
            for (const button of panel.querySelectorAll('[data-tool]')) {
                if (button.dataset.tool !== 'close') {
                    button.setAttribute('aria-pressed', String(button.dataset.tool === tool));
                }
            }
            row.hidden = tool !== 'timeline';
            clearMarks();
            ruler.first = ruler.second = null;
            if (tool === 'timeline') {
                pauseAll();
                range.max = String(Math.round(longest()));
                out.textContent = `${live().length} animation(s) held. Scrub, or step 16 ms at a time.`;
            }
            if (tool === 'ruler') out.textContent = 'Click one element, then another.';
            return;
        }
        const act = event.target.closest('[data-act]')?.dataset.act;
        if (!act) return;
        const now = Number(range.value);
        if (act === 'play') playAll();
        if (act === 'replay') {
            replay();
            range.value = '0';
        }
        if (act === 'step' || act === 'step-back') {
            const next = Math.max(0, now + (act === 'step' ? 16 : -16));
            range.value = String(next);
            seek(next);
        }
        out.textContent = `${live().length} animation(s) · ${range.value} of ${range.max} ms`;
    });

    range.addEventListener('input', () => {
        seek(Number(range.value));
        out.textContent = `${live().length} animation(s) · ${range.value} of ${range.max} ms`;
    });

    listening?.abort();
    listening = new AbortController();
    const { signal } = listening;

    document.addEventListener(
        'pointermove',
        (event) => {
            if (mode !== 'inspect' || !panel) return;
            const element = event.target;
            if (!(element instanceof Element) || panel.contains(element)) return;
            const { name, rows } = describe(element);
            out.textContent = [name, ...rows].join('\n');
        },
        { signal },
    );

    document.addEventListener(
        'click',
        (event) => {
            if (mode !== 'ruler' || !panel || panel.contains(event.target)) return;
            event.preventDefault();
            const element = event.target;
            if (!(element instanceof Element)) return;
            if (!ruler.first || ruler.second) {
                clearMarks();
                ruler.first = element;
                ruler.second = null;
                outline(element, '#2f6df6');
                const box = element.getBoundingClientRect();
                out.textContent = `first: ${Math.round(box.width)} × ${Math.round(box.height)} px\nclick a second element`;
                return;
            }
            ruler.second = element;
            outline(element, '#f6a02f');
            const a = ruler.first.getBoundingClientRect();
            const b = element.getBoundingClientRect();
            const { x, y } = gap(a, b);
            out.textContent = [
                `first:  ${Math.round(a.width)} × ${Math.round(a.height)} px`,
                `second: ${Math.round(b.width)} × ${Math.round(b.height)} px`,
                `gap:    ${x} px across, ${y} px down`,
            ].join('\n');
        },
        { capture: true, signal },
    );
}

export function openDevtools() {
    if (panel) return closeDevtools();
    armRecorder();
    tokenIndex = null; // the theme may have changed since the last open
    build();
    document.addEventListener(
        'kp-theme-change',
        () => {
            tokenIndex = null;
        },
        { signal: listening?.signal },
    );
}

export function closeDevtools() {
    listening?.abort();
    listening = null;
    clearMarks();
    playAll();
    observer?.disconnect();
    panel?.remove();
    panel = null;
}
