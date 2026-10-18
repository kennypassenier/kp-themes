// The demo review kit: judge every section of a research demo in every theme
// from one dialog, and copy one structured answer back into the conversation
// (Kenny, 2026-10-03: "is er een manier om dit allemaal goed te keuren in een
// dialog zoals bij every component, one page? … kan dit vanaf nu altijd voor
// demos?" [scope-141]). Every research demo carries it from now on.
//
// A demo opts in with three attributes and one module:
//
//   <html data-review="<demo id>" data-review-themes="formal,deco">  (themes optional: default all)
//   <section data-review-item="spinner" data-review-title="Spinner">  (one per judged piece)
//     <div data-review-look><p data-for="formal">what to look at in formal</p>…</div>
//   <script type="module" src="../_review/review.js"></script>
//
// A section with useful variants lists them as a DEFAULT SET (Kenny, 2026-10-17
// 23:33: "Ik wil niet kiezen tussen A en B als beide nuttig zijn, dan moet enkel
// bepaald worden wat het default gedrag is van de component." [defaults-1017]):
// the group's `default` (else its first option) is already set and nothing is
// ticked; every other option is a real component option he may press to see it
// live, which is then recorded as "default changed to X". A set is never open
// and never blocks approving; untouched sets are not in the answer ("Defaults
// kept."):
//
//   <section data-review-item="leave" data-review-choices='[
//     { "id": "exit", "label": "Exit for this theme", "options": [{ "value": "1", "label": "Exit 1" }, …] },
//     { "id": "space", "label": "When the space closes", "once": true, "options": […] }]'>
//
// A choice is asked per theme, or with `"once": true` a single time for the
// whole demo (shown in every theme, the same answer everywhere). A group may
// carry `"default"`: one value, or { "<theme>": value }, ticked for the
// reviewer and counted as answered until he picks otherwise (an approved
// shape is not asked again; Kenny, 2026-10-05). A group may also carry
// `"fixed"`: true, or { "<theme>": true }; there its `default` is the answer
// and the choice is not shown at all, nor repeated in the answer (Kenny,
// 2026-10-06: what he did not name to change is settled and must not be a
// choice again). Pressing an option fires `review:choice` on the section
// ({ id, value }), so the demo shows it live; the default's own value is fired
// on every show too.
//
// and, optionally, catalogue blocks to judge in the same sitting, as a last
// step, each shown in its own theme through block.html:
//
//   <script type="application/json" data-review-extra>
//     [{ "page": "catalogue/field.html", "block": "choices", "theme": "deco",
//        "engine": "firefox", "title": "Fields › Choices", "look": "…" }]
//   </script>
//
// One step is one theme: every section of the demo at once, stacked, the way
// "Every component, one page" shows the catalogue. The reviewer marks only what
// is wrong, with a note, and approves the theme in one go; the dialog then
// loads the next theme's register and switches by itself. Up approves the
// step, Left/Right move between steps outside a note, Escape closes. After the
// last open step the dialog closes and the answer waits at the foot.
//
// A round that asks more than one theme walks topic by topic instead (Kenny,
// 2026-10-16): one step per group of similar sections, each section shown in
// every asked theme side by side or one after the other, so the themes
// compare directly (see "Topic steps" below). A section joins a topic with
// `data-review-topic="<id>"` (title: `data-review-topic-title`).
//
// Controls (Kenny, 2026-10-05: "Als je knoppen zet die bv loading state
// weergeven, of andere dingen zoals animation, zet die dan ook in de dialog!";
// 2026-10-18 07:09: "Die controls moeten niet gewoon meer boven staan, maar
// enkel de geschikte control per component zoals die tevoorschijn komt").
// A demo marks every container of the buttons that drive ONE component, and
// says which component that is:
//
//   <div data-review-controls data-review-controls-for="<id of the component>">
//       <div role="group" aria-label="…">…buttons…</div> …
//   </div>
//
// The container lives inside the judged section that holds the component.
// The dialog shows the demo's own container (not a copy: no mirror, no bar on
// top) directly above that component, so the controls arrive with it as the
// reviewer walks to it, and it moves the section's Expected block under the
// component. A container that names no component of its section, or sits
// outside every section, is not shown (placeControls); research/_review/
// check-kit.mjs fails such a page, and fails a component with more than
// four groups (too many rows means too many things in one section: split it).
//
// Verdicts and notes live in this browser only (localStorage, per demo id,
// under progress.js storeKey(), which the hub reads too); the answer at the
// foot of the page is what reaches the conversation.
//
// Opened from the hub (catalogue/changed.html, the one page Kenny starts
// from), the address carries `?next=<hub>` and `review=open`: the dialog opens
// by itself, the bar has a way back, and once everything is judged the dialog
// closes on the answer: one button copies it and returns to the hub. Nothing
// opens the next item by itself (Kenny, 2026-10-14: the Agenda reopened the
// same demo and its answer lost his two notes).
import { STORAGE_KEY, THEMES } from '../../js/theme-registry.js';
import { applyTheme, currentTheme } from '../../js/theme-core.js';
import {
    carriedAnswer,
    carryAnswer,
    dropReceivedAnswer,
    fingerprintOf,
    journal,
    JOURNAL_FAILED_EVENT,
    keepAnswer,
    loadUpdate,
    markAnswerCopied,
    staleKeys,
    storeKey,
} from './progress.js';
import { early, isolate, mountBlockTools } from './block-tools.js';
import { mountProgress } from './rv-progress.js'; // [kit-strip-1018] remaining line + resume

const root = document.documentElement;
const DEMO = root.dataset.review;
const STORE = storeKey(DEMO);
const params = new URLSearchParams(location.search);
/** Where to go once the demo is judged: the hub, on this site only. */
const NEXT = (() => {
    try {
        const url = new URL(params.get('next') || '', location.href);
        return params.has('next') && url.origin === location.origin ? url.href : '';
    } catch {
        return '';
    }
})();
/** The hub's name in the page's words. */
const HUB_NAME = NEXT && /\/agenda\.html$/.test(new URL(NEXT).pathname) ? 'the Agenda' : 'To judge';
/**
 * Where the end of a review goes by itself: the hub the demo was opened from, else the Agenda, the one page Kenny
 * starts from (Kenny, 2026-10-16: straight back to agenda.html, no end dialog).
 */
const AGENDA = new URL('../../catalogue/agenda.html', import.meta.url).href;
const DONE_HREF = NEXT || AGENDA;
const DONE_NAME = NEXT ? HUB_NAME : 'the Agenda';
/*
 * Embed mode (Kenny, 2026-10-06 23:52: "Misschien helpt het om alle bestaande
 * laadschermen per thema te tonen, zodat ik dan bij andere thema's ook kan
 * kiezen welke de beste zijn … Hetzelfde doen we dan per familie van
 * animaties of keuzes"). research/families/ shows one family of motion
 * (loading, arrival, …) of every component side by side, each component's
 * own demo in an iframe at `demo.html?embed=<aspect>&theme=<theme>`:
 *
 * - only the demo's combination of its picks is shown, the element marked
 *   `data-review-preview` (everything else on the page is set aside, also what
 *   the catalogue shell adds after this module);
 * - the demo's own controls for that aspect are pressed, the ones whose
 *   `data-review-plays` names it, the same buttons the dialog's autoplay
 *   presses; with `loop=1` they are pressed again whenever the motion has
 *   ended (an arrival, a live update), a looping picture is left alone;
 * - `speed=<1|0.5|0.25>` presses the demo's own speed button;
 * - the frame tells its parent its height, the picked option's name (from the
 *   demo's own "Your combination" words) and key (the preview's
 *   `data-<prefix>-<aspect>` attribute), and takes `replay` and `speed`
 *   messages back; a key pressed inside it is handed to the parent, so the
 *   review dialog's keys keep working when the focus sits in a frame.
 *
 * Without `embed` in the address nothing here runs, and the review kit
 * below (bar, dialog, answer) is built as always; with it, the kit stops
 * here, since an embedded copy is never judged on its own.
 */
const EMBED = params.get('embed');
if (EMBED) {
    embed(EMBED);
    await new Promise(() => {});
}
/*
 * Lane mode: one section of this demo, in one theme, as a frame of a topic step (see "Topic steps" below). The
 * dialog around it isolates the section and judges it; here nothing of the kit is built (no bar, no dialog, no
 * verdicts written), and the dialog's own keys that a frame would swallow are handed up: V and L (previous version,
 * play open and close, for this frame's section) and Escape when nothing of the demo is open in the frame.
 */
if (params.has('rv-lane')) {
    lane();
    await new Promise(() => {});
}

/** Hands the review dialog's own keys from a lane frame to the page around it. */
function lane() {
    // Every frame of a topic step keeps its own theme: the theme another frame stores (its head keeps `?theme=`) is
    // not taken over here, as js/theme-core.js would take a choice made in another tab. Capture listeners run first.
    addEventListener('storage', (event) => event.key === STORAGE_KEY && event.stopImmediatePropagation(), true);
    const TYPING = 'textarea, select, input:not([type="checkbox"], [type="radio"], [type="button"])';
    const OPEN = 'dialog[open], [popover]:popover-open, .kp-datepicker__panel:not([hidden]), [aria-expanded="true"]';
    addEventListener(
        'keydown',
        (event) => {
            if (parent === window || event.altKey || event.ctrlKey || event.metaKey) return;
            if (/** @type {Element} */ (event.target).matches?.(TYPING)) return;
            if (event.key === 'Escape' ? document.querySelector(OPEN) : event.code !== 'KeyV' && event.code !== 'KeyL') return;
            event.preventDefault();
            event.stopPropagation();
            parent.postMessage({ type: 'rv-lane-key', key: event.key, code: event.code }, location.origin);
        },
        true,
    );
}

/** Runs one demo as a frame of research/families/ (see above). @param {string} aspect */
function embed(aspect) {
    root.setAttribute('data-review-embed', aspect);
    const style = document.createElement('style');
    style.textContent = `
        html[data-review-embed] body { margin: 0; padding: 1rem; min-height: 0; }
        html[data-review-embed] body :not([data-rv-embed-path], [data-rv-embed-shown], [data-rv-embed-shown] *, script, style, link) { display: none !important; }
        html[data-review-embed] [data-rv-embed-path] { display: block !important; margin: 0 !important; padding: 0 !important; border: 0 !important;
            max-width: none !important; min-height: 0 !important; inline-size: auto !important; background: none !important; box-shadow: none !important; }
        html[data-review-embed] [data-rv-embed-shown] { margin: 0 !important; }`;
    document.head.append(style);
    const preview = () => /** @type {HTMLElement | null} */ (document.querySelector('[data-review-preview]'));
    /** Marks the way from the body down to the preview, so the style above sets everything else aside. */
    const mark = () => {
        const shown = preview();
        if (!shown) return;
        for (const el of document.querySelectorAll('[data-rv-embed-path]')) if (!el.contains(shown)) el.removeAttribute('data-rv-embed-path');
        shown.setAttribute('data-rv-embed-shown', '');
        for (let el = shown.parentElement; el && el !== document.body; el = el.parentElement)
            if (!el.hasAttribute('data-rv-embed-path')) el.setAttribute('data-rv-embed-path', '');
    };
    mark();
    new MutationObserver(mark).observe(document.body, { childList: true });

    const loop = params.get('loop') === '1';
    /** The words of the buttons pressed for this aspect, told to the parent. @type {string[]} */
    let played = [];
    /** The demo's own buttons for this aspect, pressed in the page's order. */
    const press = () => {
        played = [];
        for (const b of document.querySelectorAll('[data-review-plays]'))
            if ((b.getAttribute('data-review-plays') || '').split(/\s+/).includes(aspect)) {
                /** @type {HTMLElement} */ (b).click();
                played.push((b.textContent || '').replace(/\s+/g, ' ').trim());
            }
        // Buttons only an embed presses (a state the dialog leaves to the
        // reviewer, a toggle it must not flip), pressed once: a toggle stays on.
        for (const b of document.querySelectorAll('[data-review-embed-plays]'))
            if ((b.getAttribute('data-review-embed-plays') || '').split(/\s+/).includes(aspect)) {
                if (b.getAttribute('aria-pressed') !== 'true') /** @type {HTMLElement} */ (b).click();
                played.push((b.textContent || '').replace(/\s+/g, ' ').trim());
            }
        const shown = preview();
        if (shown) requestAnimationFrame(() => restartMotion(shown));
    };
    const moving = () => (preview()?.getAnimations({ subtree: true }) || []).some((a) => a.playState === 'running');
    let quiet = 0;
    const tick = () => {
        // Pressed again once the motion has stood still for a moment (two looks, 0.8 s apart).
        quiet = moving() ? 0 : quiet + 1;
        if (quiet >= 2) {
            quiet = 0;
            press();
        }
    };

    /** @type {Element | undefined} */
    let words;
    /** The picked option's name, read from the demo's "Your combination" words ("<label>: <n>, <name> · …"). */
    const nameOf = () => {
        const choices = (() => {
            try {
                return JSON.parse(document.querySelector('[data-review-choices]')?.getAttribute('data-review-choices') || '[]');
            } catch {
                return [];
            }
        })();
        const label = choices.find((/** @type {{ id: string }} */ c) => c.id === aspect)?.label;
        words ??= [...document.querySelectorAll('p, span, div')].find((el) => [...el.attributes].some((a) => /^data-[a-z]+-picks$/.test(a.name)));
        if (!label || !words) return '';
        const part = (words.textContent || '').split(' · ').find((p) => p.startsWith(`${label}: `));
        return part
            ? part
                  .slice(label.length + 2)
                  .replace(/^\d+, /, '')
                  .replace(/ \(not ticked yet\)$/, '')
                  .trim()
            : '';
    };
    /** The picked option's key: the preview's own `data-<prefix>-<aspect>`, or the first wrapper inside it that carries one. */
    const keyOf = () => {
        const shown = preview();
        if (!shown) return '';
        const attr = new RegExp(`^data-[a-z]+-${aspect.replace(/[^a-z0-9-]/g, '')}$`);
        for (const el of [shown, ...shown.querySelectorAll('*')]) for (const a of el.attributes) if (attr.test(a.name) && a.value) return a.value;
        return '';
    };
    /*
     * The pointer, played (`point=1`, the hover family): a script cannot hover
     * or press, so every rule of the page that answers `:hover`,
     * `:focus-visible`/`:focus` or `:active` is copied with an attribute in
     * the pseudo-class's place, and the attributes walk the preview's
     * pointable parts, each in turn pointed at, focused and pressed. A demo
     * with a button of its own for the aspect alone (tiles' Pointed at) plays
     * that instead. The frame tells its parent which part is in which state.
     */
    let pointer = '';
    let pace = Number(params.get('speed')) || 1;
    const PSEUDO = /** @type {[string, RegExp][]} */ ([
        ['hover', /:hover\b/g],
        ['focus', /:focus-visible\b|:focus(?![-\w])/g],
        ['press', /:active\b/g],
    ]);
    const ANY_PSEUDO = /:hover\b|:focus-visible\b|:focus(?![-\w])|:active\b/;
    const ownButton = () =>
        [...document.querySelectorAll('[data-review-plays]')].some((b) => (b.getAttribute('data-review-plays') || '').trim() === aspect);
    const playPointer = () => {
        // The demo's own sheets (research/…) come first: an aspect's answer to
        // the pointer is drawn there, the shared components' answer after it.
        /** @type {Set<string>} */
        const own = new Set();
        /** @type {Set<string>} */
        const shared = new Set();
        /** @type {Set<string>} */
        let subjects = own;
        /** The element a pseudo-class sits on: the selector up to it, without the other states. @param {string} selectorText */
        const collect = (selectorText) => {
            let depth = 0;
            let from = 0;
            const parts = [];
            for (let i = 0; i < selectorText.length; i++) {
                const c = selectorText[i];
                if (c === '(') depth++;
                else if (c === ')') depth--;
                else if (c === ',' && depth === 0) {
                    parts.push(selectorText.slice(from, i));
                    from = i + 1;
                }
            }
            parts.push(selectorText.slice(from));
            for (const part of parts) {
                const at = part.search(ANY_PSEUDO);
                if (at < 0) continue;
                const subject = part.slice(0, at).replace(new RegExp(ANY_PSEUDO.source, 'g'), '').trim();
                if (subject && !/[>+~(&]$/.test(subject)) subjects.add(subject);
            }
        };
        const rewrite = (/** @type {string} */ text) => PSEUDO.reduce((t, [name, re]) => t.replace(re, `[data-rv-${name}]`), text);
        /** @param {CSSRuleList} rules @returns {string} */
        const walk = (rules) => {
            let css = '';
            for (const rule of rules) {
                if (rule instanceof CSSStyleRule) {
                    if (!ANY_PSEUDO.test(rule.cssText)) continue;
                    css += rewrite(rule.cssText);
                    collect(rule.selectorText);
                } else if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
                    const inner = walk(rule.cssRules);
                    if (inner) css += `@${rule instanceof CSSMediaRule ? 'media' : 'supports'} ${rule.conditionText}{${inner}}`;
                } else if (rule instanceof CSSLayerBlockRule) {
                    const inner = walk(rule.cssRules);
                    if (inner) css += `@layer ${rule.name}{${inner}}`;
                }
            }
            return css;
        };
        let css = '';
        for (const sheet of document.styleSheets)
            try {
                subjects = sheet.href && !new URL(sheet.href).pathname.includes('/research/') ? shared : own;
                css += walk(sheet.cssRules);
            } catch {
                // A sheet the page may not read is left as it is.
            }
        const played = document.createElement('style');
        played.textContent = css;
        document.head.append(played);

        const shown = preview();
        if (!shown) return;
        const visible = (/** @type {Element} */ el) => el.getClientRects().length > 0 && el.getBoundingClientRect().width > 0;
        const matches = (/** @type {Element} */ el, /** @type {Set<string>} */ set) =>
            [...set].some((s) => {
                try {
                    return el.matches(s);
                } catch {
                    return false;
                }
            });
        const pointable = () => {
            const all = [shown, ...shown.querySelectorAll('*')].filter(visible);
            const reachable = (/** @type {Element[]} */ els) =>
                els.filter((el) => el.matches('a[href], button, input, select, textarea, [tabindex], [role="button"], [role="menuitem"]'));
            const ranked = (/** @type {Set<string>} */ set) => {
                const hit = all.filter((el) => matches(el, set));
                return [...reachable(hit), ...hit.filter((el) => !reachable([el]).length)];
            };
            return [...new Set([...ranked(own), ...ranked(shared)])].slice(0, 4);
        };
        const nameOfPart = (/** @type {HTMLElement} */ el) => {
            const words = (el.getAttribute('aria-label') || el.innerText || '').split('\n').find((line) => line.trim()) || el.tagName.toLowerCase();
            return words.trim().slice(0, 32);
        };
        const STEPS = /** @type {[string, string, number][]} */ ([
            ['hover', 'pointed at', 1500],
            ['focus', 'keyboard focus', 1500],
            ['press', 'pressed', 700],
            ['', 'away', 700],
        ]);
        let part = 0;
        let step = 0;
        const next = () => {
            for (const el of document.querySelectorAll('[data-rv-hover], [data-rv-focus], [data-rv-press]'))
                for (const [name] of PSEUDO) el.removeAttribute(`data-rv-${name}`);
            const parts = pointable();
            const el = /** @type {HTMLElement | undefined} */ (parts[part % Math.max(parts.length, 1)]);
            const [state, words, ms] = STEPS[step];
            if (el && state) {
                el.setAttribute(`data-rv-${state}`, '');
                // A press is pointed at and focused as well, as a real one is.
                if (state === 'press') el.setAttribute('data-rv-hover', '');
            }
            pointer = el ? `${nameOfPart(el)}: ${words}` : 'nothing here answers the pointer';
            tell();
            step = (step + 1) % STEPS.length;
            if (step === 0) part++;
            setTimeout(next, ms / pace);
        };
        next();
    };

    let told = '';
    let telling = 0;
    /** Tells the parent what changed, at most once a frame. */
    const tell = () => {
        if (telling || parent === window) return;
        telling = requestAnimationFrame(() => {
            telling = 0;
            const shown = preview();
            if (!shown) return;
            const height = Math.ceil(shown.getBoundingClientRect().bottom + scrollY) + 16;
            const news = { type: 'rv-embed', aspect, height, name: nameOf(), key: keyOf(), pointer, played, found: true };
            if (JSON.stringify(news) === told) return;
            told = JSON.stringify(news);
            parent.postMessage(news, location.origin);
        });
    };

    addEventListener('message', (event) => {
        if (event.origin !== location.origin || event.source !== parent) return;
        const { type, value } = event.data || {};
        if (type === 'rv-embed-replay') press();
        else if (type === 'rv-embed-speed') {
            pace = Number(value) || 1;
            pressSpeed(String(value));
        }
    });
    // A key pressed in the frame belongs to the page around it (the review
    // dialog's keys, wherever the focus sits).
    addEventListener(
        'keydown',
        (event) => {
            if (parent === window) return;
            event.preventDefault();
            event.stopPropagation();
            const { key, code, shiftKey, altKey, ctrlKey, metaKey } = event;
            parent.postMessage({ type: 'rv-embed-key', key, code, shiftKey, altKey, ctrlKey, metaKey }, location.origin);
        },
        true,
    );

    /**
     * The decided picks shown, whatever the demo itself ticks by default: the
     * demo's `decided.json` (one per character demo, the preview's key per
     * theme and aspect). A key that is one of the aspect's options is played
     * the way the dialog plays a tick, a `review:choice` on the demo's
     * section, so its words follow; any other key (a later round's own key)
     * is written on the preview's `data-<prefix>-<aspect>` itself.
     */
    const applyDecided = async () => {
        try {
            const response = await fetch(new URL('decided.json', location.href));
            if (!response.ok) return;
            const picks = (await response.json()).picks?.[root.getAttribute('data-theme') || 'formal'] || {};
            const section = /** @type {HTMLElement | null} */ (document.querySelector('[data-review-item]'));
            /** @type {{ id: string, options: { value: string }[] }[]} */
            const choices = JSON.parse(section?.getAttribute('data-review-choices') || '[]');
            for (const [id, raw] of Object.entries(picks)) {
                const value = String(raw);
                if (choices.find((c) => c.id === id)?.options.some((o) => o.value === value))
                    section?.dispatchEvent(new CustomEvent('review:choice', { bubbles: true, detail: { id, value } }));
                else {
                    const shown = preview();
                    const attr = new RegExp(`^data-[a-z]+-${id.replace(/[^a-z0-9-]/g, '')}$`);
                    const carrier = shown && [shown, ...shown.querySelectorAll('*')].find((el) => [...el.attributes].some((a) => attr.test(a.name)));
                    const name = carrier && [...carrier.attributes].find((a) => attr.test(a.name))?.name;
                    if (carrier && name && carrier.getAttribute(name) !== value) carrier.setAttribute(name, value);
                }
            }
        } catch {
            // No decided picks: the demo's own ticks stand.
        }
    };

    const start = async () => {
        await applyDecided();
        mark();
        if (!preview() && parent !== window) parent.postMessage({ type: 'rv-embed', aspect, found: false }, location.origin);
        const speed = params.get('speed');
        if (speed) pressSpeed(speed);
        press();
        if (loop) setInterval(tick, 800);
        if (params.get('point') === '1' && !ownButton()) playPointer();
        const shown = preview();
        if (shown) {
            new ResizeObserver(tell).observe(shown);
            // The words change when the demo redraws the combination.
            nameOf();
            new MutationObserver(tell).observe(words || shown, { subtree: true, characterData: true, childList: true });
        }
        tell();
        setTimeout(tell, 600);
    };
    if (document.readyState === 'complete') void start();
    else addEventListener('load', () => void start(), { once: true });
}

/*
 * The other side of the embed: a key pressed inside an embedded demo arrives
 * here and is played on this page, so the dialog's keys work wherever the
 * focus sits.
 */
addEventListener('message', (event) => {
    const data = event.data || {};
    if (event.origin !== location.origin || data.type !== 'rv-embed-key') return;
    const { key, code, shiftKey, altKey, ctrlKey, metaKey } = data;
    (document.activeElement || document.body).dispatchEvent(
        new KeyboardEvent('keydown', { key, code, shiftKey, altKey, ctrlKey, metaKey, bubbles: true, cancelable: true }),
    );
});
const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const ORDER = root.dataset.reviewThemes
    ? root.dataset.reviewThemes
          .split(',')
          .map((s) => s.trim())
          // A theme dropped since the demo was made is never walked.
          .filter((name) => LABEL[name])
    : THEMES.map((t) => t.name);

/**
 * An option may say what it means (`hint`), or what it means in each theme
 * (`hints`, by theme name), shown under its label in the dialog.
 * @typedef {{ value: string, label: string, hint?: string, hints?: Record<string, string> }} Option
 * @typedef {{ id: string, label: string, once?: boolean, options: Option[] }} Choice
 */
/** @param {HTMLElement} section @returns {Choice[]} */
const choicesOf = (section) => {
    try {
        return JSON.parse(section.dataset.reviewChoices || '[]');
    } catch {
        return [];
    }
};
const items = [...document.querySelectorAll('[data-review-item]')].map((section) => ({
    id: section.dataset.reviewItem,
    title: section.dataset.reviewTitle || section.querySelector('h2, h3')?.textContent.trim() || section.dataset.reviewItem,
    section,
    choices: choicesOf(section),
    // A section that names its own `data-review-themes` is asked in those themes only (a demo of what differs per
    // theme, scope-143 all-themes); without it, in every theme the demo walks.
    themes: section.dataset.reviewThemes ? section.dataset.reviewThemes.split(/[\s,]+/).filter(Boolean) : null,
}));

/** @type {{ page: string, block: string, theme: string, engine?: string, title?: string, look?: string }[]} */
let extras = [];
try {
    extras = JSON.parse(document.querySelector('script[data-review-extra]')?.textContent || '[]');
} catch {
    extras = [];
}

/**
 * @typedef {{ key: string, label: string, title: string, look: string, theme: string, extra?: object, item?: object }} Pair
 * @typedef {{ title: string, theme: string | null, topic?: string, topicTitle?: string, laneTheme?: string, topicAt?: number, topicThemes?: number, aspect?: string, pairs: Pair[] }} Step
 */

const lookFor = (section, theme) => section.querySelector(`[data-review-look] [data-for="${theme}"]`)?.innerHTML || '';

// One aspect per page (Kenny, 2026-10-06 12:09): "Ik wil nu het element
// centraal, net zoals het bij 'your combination' al is, en per pagina één
// aspect van de demo ... als het bv over loading gaat, dan moet de loading
// animatie al afspelen. Zo gaan we door elk aspect." A section opts in with
// `data-review-mode="aspects"` and names the attribute its option rows carry
// (`data-review-rows="data-cc-aspect"`, the value the choice's id). Each
// theme then becomes one step per open choice: the dialog shows only that
// row, its options side by side, and clicks the demo's own controls marked
// `data-review-plays="<choice id> …"` (Loading for a loading aspect, Drawn
// for an arrival), so the motion is already playing. Per aspect the reviewer
// picks one option or "None of these" with a note; the theme's verdict
// follows from all its aspects (approved, or not approved with the notes).
/**
 * The demo's update, from `update.json` beside it (progress.js, loadUpdate):
 * the picks Kenny approved, which the dialog takes as answered and no longer
 * walks, and the questions the update reopens, each with his comment and the
 * session's reply (Kenny, 2026-10-07: "bij een update enkel zien wat er nog
 * beoordeeld moet worden").
 */
const UPDATE = await loadUpdate(new URL('update.json', location.href));
/** A question settled by an earlier verdict: picked in update.json and not asked again. */
const lockedFor = (theme, id) => Boolean(UPDATE?.picks?.[theme]?.[id]) && !UPDATE?.questions?.[theme]?.[id];
const ASPECT_MODE = items.length > 0 && items.every((item) => item.section.dataset.reviewMode === 'aspects');
const plainFixed = (theme, choice) => (typeof choice.fixed === 'object' && choice.fixed ? Boolean(choice.fixed[theme]) : Boolean(choice.fixed));

/** The themes a section is asked in, in the demo's order. */
const askedThemes = (item) => ORDER.filter((theme) => !item.themes || item.themes.includes(theme));
const pairOf = (item, theme) => ({ key: `${theme}|${item.id}`, label: `${item.id} · ${theme}`, title: item.title, look: '', theme, item });

/*
 * Topic steps (Kenny, 2026-10-16 16:43: "per topic/thema werken. bv een groepering van gelijksoortige componenten zoals
 * de matrix eerst voor alle thema's, dan de volgende groep etc, zo behoud ik het meeste context en kan ik het best
 * vergelijken"). A round that asks more than one theme walks topic by topic, a topic being a group of similar sections
 * (`data-review-topic="<id>"`, its title in `data-review-topic-title` on any of them; a section without one is a topic
 * of its own). Within a topic a step is one theme (Kenny, 2026-10-16 17:44: "1 item per thema per approval, want
 * terminal lijkt eindeloos lang te zijn en ik geraak niet aan items onder terminal"): the topic's sections in that
 * theme, each in a frame of its own (lane mode above) at the stage's full width, then the next theme of the same
 * topic, then the next topic. A round that asks one theme walks its topics the same way when it names two or more;
 * without topics it, and a demo of aspect pages, walk theme by theme as before.
 */
// A one-theme round whose sections name two or more topics walks them topic by topic too (2026-10-16, the one
// kpadopt4 page: 51 formal sections in nine topics would otherwise be one endless step).
const TOPIC_MODE =
    !ASPECT_MODE &&
    (new Set(items.flatMap(askedThemes)).size > 1 || new Set(items.map((item) => item.section.dataset.reviewTopic).filter(Boolean)).size > 1);

/** @type {Step[]} */
const steps = TOPIC_MODE ? topicSteps() : themeSteps();

function topicSteps() {
    /** @type {Map<string, typeof items>} */
    const topics = new Map();
    for (const item of items) {
        const id = item.section.dataset.reviewTopic || `item:${item.id}`;
        topics.set(id, [...(topics.get(id) || []), item]);
    }
    return [...topics].flatMap(([id, members]) => {
        const named = members.map((item) => item.section.dataset.reviewTopicTitle).find(Boolean);
        const topicTitle = named || (members.length === 1 ? members[0].title : id);
        // One step per theme of the topic (Kenny, 2026-10-16 17:44: "per group, maar dan 1 item per thema per
        // approval"), in the demo's theme order; a theme none of the topic's sections is asked in is no step.
        const themed = ORDER.map((theme) => ({
            theme,
            pairs: members.filter((item) => askedThemes(item).includes(theme)).map((item) => pairOf(item, theme)),
        })).filter((entry) => entry.pairs.length);
        return themed.map(({ theme, pairs: stepPairs }, at) => ({
            title: `${topicTitle} · ${LABEL[theme] || theme}`,
            theme: null,
            topic: id,
            topicTitle,
            laneTheme: theme,
            topicAt: at + 1,
            topicThemes: themed.length,
            pairs: stepPairs,
        }));
    });
}

function themeSteps() {
    return ORDER.flatMap((theme) => {
        const themePairs = items.filter((item) => !item.themes || item.themes.includes(theme)).map((item) => pairOf(item, theme));
        // A theme with no section asked in it is no step: a re-review that asks a few pairs counts and walks only those.
        if (!themePairs.length) return [];
        if (!ASPECT_MODE) return [{ title: LABEL[theme] || theme, theme, pairs: themePairs }];
        const aspectSteps = themePairs.flatMap((pair) =>
            pair.item.choices
                .filter((choice) => !choice.once && !plainFixed(theme, choice) && !lockedFor(theme, choice.id))
                .map((choice) => ({ title: `${LABEL[theme] || theme} · ${choice.label}`, theme, aspect: choice.id, pairs: [pair] })),
        );
        return aspectSteps.length ? aspectSteps : [{ title: LABEL[theme] || theme, theme, pairs: themePairs }];
    });
}
if (extras.length) {
    steps.push({
        title: 'Catalogue blocks',
        theme: null,
        pairs: extras.map((extra) => {
            const slug = extra.page.replace(/^.*\//, '').replace(/\.html$/, '');
            const id = `${slug}--${extra.block}`;
            const engine = extra.engine || 'firefox';
            return {
                key: `catalogue|${id}|${extra.theme}|${engine}`,
                label: `${id} · ${extra.theme} · ${engine}`,
                title: `${extra.title || id} · ${LABEL[extra.theme] || extra.theme}`,
                look: extra.look || '',
                theme: extra.theme,
                extra,
            };
        }),
    });
}
const pairs = [...new Set(steps.flatMap((step) => step.pairs))];

/* ------------------------------------------------------------- storage */

function load() {
    try {
        return JSON.parse(localStorage.getItem(STORE) || '{}') || {};
    } catch {
        return {};
    }
}
let state = load();
/** This version of the demo (progress.js, fingerprintOf), once read. @type {string | null} */
let fingerprint = null;
function save() {
    // Every verdict carries the version and the round it was given on.
    if (fingerprint)
        for (const [key, entry] of Object.entries(state))
            if (!key.startsWith('__') && entry?.verdict && !entry.fingerprint) {
                entry.fingerprint = fingerprint;
                entry.round = round?.round || '';
            }
    try {
        localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
        /* a private window: the answer on the page still holds everything */
    }
}

// A later round reopens, once per browser, every pair rejected in the rounds
// before it, plus any pair it names as redrawn:
//   <script type="application/json" data-review-round>{"round": "<id>", "reopen": ["<theme>|<item>", …]}</script>
// `reopen` is optional: a new round id alone reopens the rejected pairs. Every
// approved verdict stands, and the dialog walks only what is open again
// (Kenny, 2026-10-04, review-rereview-M1: a second round walked all 176 pairs
// and needed the stored answer cleared by hand before it walked at all).
let round = null;
try {
    round = JSON.parse(document.querySelector('script[data-review-round]')?.textContent || 'null');
} catch {
    round = null;
}
// The pairs a round reopened stay listed under `__reopened`, so the hub
// (progress.js) still calls the demo updated, in those themes, once its
// verdicts are gone (Kenny, 2026-10-07: "Not started" read as a new demo).
/**
 * Opens a judged pair again. Judged per aspect, only its "None of these"
 * aspects and the ones named open again, and every other pick stands; the
 * notes it had are kept under `earlier`, shown beside the reopened question.
 * @param {string} key @param {string[]} [aspects]
 */
function reopenPair(key, aspects = []) {
    const entry = state[key];
    if (entry?.verdict || entry?.note || entry?.redo) wiped = true;
    if (!ASPECT_MODE || !entry) {
        delete state[key];
        return;
    }
    const choices = { ...entry.choices };
    for (const aspect of aspects) delete choices[aspect];
    // The earlier words are wiped, only the fact that the question was open stays (Kenny, 2026-10-13:
    // "wis de vorige commentaar").
    const earlier = Object.fromEntries(Object.keys({ ...entry.earlier, ...entry.redo }).map((aspect) => [aspect, 'not approved']));
    state[key] = { choices, earlier };
}
/** Words of a verdict wiped on this load: the answer not yet copied is carried along (progress.js, carryAnswer). */
let wiped = false;
if (round?.round && state.__round !== round.round) {
    const reopened = [];
    for (const [key, entry] of Object.entries(state)) {
        if (entry?.verdict === 'rejected') {
            reopenPair(key);
            reopened.push(key);
        }
    }
    for (const key of round.reopen || []) {
        if (state[key]?.verdict) wiped = true;
        delete state[key];
        reopened.push(key);
    }
    state.__reopened = [...new Set(reopened)];
    state.__round = round.round;
    save();
}
// A demo republished under the same round (progress.js, staleKeys): the
// verdicts given on its earlier files are open again, and listed with the
// round's own so "To judge" calls the demo updated.
fingerprint = await fingerprintOf(location.href);
{
    const stale = staleKeys({ id: DEMO, round, fingerprint }, state);
    for (const key of stale) reopenPair(key);
    if (stale.length) state.__reopened = [...new Set([...(state.__reopened || []), ...stale])];
    save();
}
// An update (update.json): its picks are answered, and once per update the
// questions it names open again, Kenny's earlier note kept beside them.
if (UPDATE && ASPECT_MODE) {
    const fresh = (Number(state.__update) || 0) < UPDATE.update;
    const reopened = [];
    for (const pair of pairs) {
        if (!pair.item) continue;
        const asked = Object.keys(UPDATE.questions[pair.theme] || {});
        const entry = { ...state[pair.key] };
        entry.choices = { ...entry.choices };
        for (const [id, value] of Object.entries(UPDATE.picks[pair.theme] || {})) if (!asked.includes(id)) entry.choices[id] = value;
        state[pair.key] = entry;
        if (fresh && asked.length) {
            reopenPair(pair.key, asked);
            reopened.push(pair.key);
        }
    }
    if (fresh) {
        state.__update = UPDATE.update;
        state.__reopened = [...new Set([...(state.__reopened || []), ...reopened])];
    }
    save();
}
// An answer Claude already received (VERDICTS.json, the round's "received") is not carried into this round.
dropReceivedAnswer(DEMO, round);
if (wiped) carryAnswer(DEMO);
// A demo page shows only what is not approved yet (Kenny, 2026-10-13: "toon je wel geen al goedgekeurde
// elementen meer"): a section whose every pair is approved is hidden behind one line, and ?review=all
// brings it back. The dialog already walks only what is open.
{
    const all = new URLSearchParams(location.search).get('review') === 'all';
    const approvedItems = [...new Set(pairs.filter((pair) => pair.item).map((pair) => pair.item))].filter((item) =>
        pairs.filter((pair) => pair.item === item).every((pair) => state[pair.key]?.verdict === 'approved'),
    );
    if (!all && approvedItems.length) {
        for (const item of approvedItems) item.section.hidden = true;
        const note = document.createElement('p');
        note.className = 'rv-hidden-note';
        note.textContent = `${approvedItems.length} approved section(s) hidden. Add ?review=all to the address to see them again.`;
        approvedItems[0].section.before(note);
    }
}
const verdictOf = (pair) => state[pair.key]?.verdict;
const noteOf = (pair) => state[pair.key]?.note || '';

/*
 * The journal (progress.js, journal): every verdict, note and tick set here is appended to an append-only log per demo,
 * which nothing removes (lost-answer-1017). A note is written after a short pause in the typing, and at once when the
 * row loses the focus, the step changes or the page is left.
 */
const NOTE_PAUSE_MS = 600;
/** Notes typed and not yet in the journal, per pair key. @type {Map<string, { timer: ReturnType<typeof setTimeout>, write: () => void }>} */
const pendingNotes = new Map();
/** Writes one change of a pair to the journal. @param {Pair} pair @param {{ verdict?: string | null, note?: string, choice?: { id: string, value: string, label?: string } | null, key?: string }} change */
function record(pair, change) {
    const key = change.key || pair.key;
    pendingNotes.get(key) && clearTimeout(/** @type {any} */ (pendingNotes.get(key)).timer);
    pendingNotes.delete(key);
    journal(DEMO, {
        round: round?.round || '',
        pair: key,
        verdict: /** @type {any} */ (change.verdict ?? null),
        note: change.note ?? '',
        choice: change.choice ?? null,
        label: key === pair.key ? pair.label : undefined,
    });
}
/** A note being typed: into the journal after a pause. @param {Pair} pair @param {() => { verdict: string | null, note: string }} read */
function recordSoon(pair, read) {
    const before = pendingNotes.get(pair.key);
    if (before) clearTimeout(before.timer);
    const write = () => record(pair, read());
    pendingNotes.set(pair.key, { timer: setTimeout(write, NOTE_PAUSE_MS), write });
}
/** Every note still waiting for its pause, written now. */
function flushNotes() {
    for (const { timer, write } of [...pendingNotes.values()]) {
        clearTimeout(timer);
        write();
    }
    pendingNotes.clear();
}
addEventListener('pagehide', flushNotes);
// Storage full or refused: said at once, on the page and in the dialog, never in silence.
document.addEventListener(JOURNAL_FAILED_EVENT, () => {
    const message = 'This browser refused to save your last verdict in the journal (storage full or blocked). Copy the answer now.';
    foot.querySelector('[data-rv-status]').textContent = message;
    refused.textContent = message;
    refused.hidden = false;
});
document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flushNotes());
/** Where a choice's answer is kept: on the pair, or once for the demo. */
const onceKey = (item, choice) => `once|${item.id}|${choice.id}`;
/**
 * A choice set only asks for the DEFAULT of the component (Kenny, 2026-10-17 23:33: "Ik wil niet kiezen tussen A en B als
 * beide nuttig zijn, dan moet enkel bepaald worden wat het default gedrag is van de component." [defaults-1017]). Its
 * `default` (a value, or { theme: value }; without one the first option) is already set; the other options are real
 * component options he may switch to and look at. The set is never open and never blocks approving.
 */
const defaultOf = (pair, choice) =>
    (typeof choice.default === 'object' && choice.default ? choice.default[pair.theme] : choice.default) || choice.options[0]?.value || '';
const choiceOf = (pair, choice) =>
    (choice.once ? state[onceKey(pair.item, choice)]?.value : state[pair.key]?.choices?.[choice.id]) || defaultOf(pair, choice);
/** A settled choice: answered by its `default`, not shown, not repeated in the answer. */
const fixedFor = (pair, choice) => (typeof choice.fixed === 'object' && choice.fixed ? Boolean(choice.fixed[pair.theme]) : Boolean(choice.fixed));
/** The option values Kenny marked "Remove" in a set, for this pair (nothing is ever required: the default is Keep). */
const removedOf = (pair, choice) => state[pair.key]?.removed?.[choice.id] || [];
/** Whether the reviewer switched a per-theme set away from its default. */
const changedFrom = (pair, choice) => {
    const value = state[pair.key]?.choices?.[choice.id];
    return Boolean(value) && value !== defaultOf(pair, choice);
};
const optionLabel = (choice, value) => choice.options.find((o) => o.value === value)?.label || value;
const isOpen = (pair) => !verdictOf(pair);
/** An aspect step is answered once its option is picked, or "None of these" is noted. */
const aspectDone = (pair, aspect) => Boolean(state[pair.key]?.choices?.[aspect] || state[pair.key]?.redo?.[aspect]);
const stepOpen = (step) => (step.aspect ? step.pairs.some((p) => isOpen(p) && !aspectDone(p, step.aspect)) : step.pairs.some(isOpen));
/** Every theme that has a step, once. */
const themesOf = (list) =>
    [...new Set(list.flatMap((s) => s.pairs.filter((p) => !p.extra).map((p) => p.theme)))].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

/* --------------------------------------------------------------- theme */

const registerUrl = (theme) => new URL(`../../css/${theme}-register.css`, import.meta.url).href;

/** Switches the theme, loading its register first so nothing paints unstyled. */
async function switchTheme(theme) {
    if (currentTheme() === theme) return;
    const present = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href === registerUrl(theme));
    if (!present) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = registerUrl(theme);
        link.setAttribute('data-kp-register', theme);
        const loaded = new Promise((resolve) => {
            link.onload = link.onerror = resolve;
        });
        (document.querySelector('link[data-kp-register]') || document.head.lastElementChild).after(link);
        await loaded;
    }
    applyTheme(theme);
}

/* ---------------------------------------------------------------- page */

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = new URL('review.css', import.meta.url).href;
document.head.append(style);

const main = document.querySelector('main') || document.body;
const bar = document.createElement('div');
bar.className = 'rv-bar';
bar.innerHTML = `
    <span class="rv-bar__count" data-rv-count></span>
    <span class="rv-bar__spacer"></span>
    <button type="button" class="kp-button kp-button--primary" data-rv-open>Review in a dialog</button>
    <button type="button" class="kp-button" data-rv-copy>Copy answer</button>`;
if (NEXT) {
    const back = document.createElement('a');
    back.className = 'kp-button kp-button--ghost';
    back.href = NEXT;
    back.setAttribute('data-rv-hub', '');
    back.textContent = /\/agenda\.html$/.test(new URL(NEXT).pathname) ? '← Agenda' : '← To judge';
    back.title = 'Back to the list of everything waiting for a verdict';
    bar.prepend(back);
}
// Inside the page's main column: on a page the catalogue shell wraps, the body
// is a grid and a bar beside main would become a cell of its own.
main.prepend(bar);

const foot = document.createElement('section');
foot.className = 'rv-answer';
foot.setAttribute('aria-labelledby', 'rv-answer-title');
foot.innerHTML = `
    <h2 id="rv-answer-title">Your answer</h2>
    <p class="rv-meta" data-rv-answer-about>Every verdict and note from the dialog, as one answer to paste into the conversation. It stays in this browser until you clear it.</p>
    <pre class="rv-answer__text" data-rv-answer></pre>
    <p class="rv-answer__actions">
        <button type="button" class="kp-button" data-rv-copy>Copy answer</button>
        <button type="button" class="kp-button kp-button--primary" data-rv-next hidden>Back to the list</button>
        <button type="button" class="kp-button kp-button--ghost" data-rv-clear>Clear all verdicts</button>
        <span class="rv-meta" role="status" aria-live="polite" data-rv-status></span>
    </p>`;
main.append(foot);

function answer() {
    const judged = pairs.filter((p) => !isOpen(p));
    const rejected = pairs.filter((p) => verdictOf(p) === 'rejected');
    const lines = [
        `Demo review · ${DEMO} · ${judged.length} of ${pairs.length} judged, ${judged.length - rejected.length} approved, ${rejected.length} not approved, ${pairs.length - judged.length} open`,
    ];
    const themesDone = themesOf(steps).filter((t) => pairs.filter((p) => p.theme === t && !p.extra).every((p) => verdictOf(p) === 'approved'));
    if (themesDone.length) lines.push('', `Approved in full: ${themesDone.join(', ')}`);
    const extraDone = pairs.filter((p) => p.extra && verdictOf(p) === 'approved');
    if (extraDone.length) lines.push('', 'Catalogue pairs approved:', ...extraDone.map((p) => `- ${p.label}`));
    if (rejected.length) lines.push('', 'Not approved:', ...rejected.map((p) => `- ${p.label}: ${noteOf(p)}`));
    const notes = pairs.filter((p) => verdictOf(p) === 'approved' && noteOf(p));
    if (notes.length) lines.push('', 'Approved, with a note:', ...notes.map((p) => `- ${p.label}: ${noteOf(p)}`));
    const picked = pairs.flatMap((p) =>
        (p.item?.choices || [])
            .filter((c) => !c.once && !fixedFor(p, c) && changedFrom(p, c))
            .map((c) => `- ${p.label}: ${c.label}: default changed to ${optionLabel(c, choiceOf(p, c))}`),
    );
    if (picked.length) lines.push('', 'Default changed per theme:', ...picked);
    const once = items.flatMap((item) =>
        item.choices
            .filter((c) => c.once && state[onceKey(item, c)]?.value && state[onceKey(item, c)].value !== defaultOf({ theme: '' }, c))
            .map((c) => `- ${item.id}: ${c.label}: default changed to ${optionLabel(c, state[onceKey(item, c)].value)}`),
    );
    if (once.length) lines.push('', 'Default changed, for every theme:', ...once);
    const removed = pairs.flatMap((p) =>
        (p.item?.choices || []).flatMap((c) => removedOf(p, c).map((v) => `- ${p.label}: ${c.label}: remove option ${optionLabel(c, v)}`)),
    );
    if (removed.length) lines.push('', 'Options to remove:', ...removed);
    if (!picked.length && !once.length && !removed.length && items.some((item) => item.choices.length)) lines.push('', 'Defaults kept.');
    const openSteps = steps.filter(stepOpen);
    if (openSteps.length) lines.push('', `Still open: ${[...new Set(openSteps.map((s) => s.theme || s.title))].join(', ')}`);
    // An answer not yet copied whose words a reopening wiped goes first, until the answer is copied.
    const carried = carriedAnswer(DEMO);
    if (carried) lines.unshift('Earlier answer, not copied before the demo opened its questions again:', carried, '', 'Now:');
    return { text: lines.join('\n'), judged: judged.length, rejected: rejected.length };
}

function render() {
    const { text, judged, rejected } = answer();
    foot.querySelector('[data-rv-answer]').textContent = text;
    const done = steps.filter((s) => !stepOpen(s)).length;
    bar.querySelector('[data-rv-count]').textContent =
        `${done} of ${steps.length} steps judged (${judged} of ${pairs.length} pairs)${rejected ? ` · ${rejected} not approved` : ''}`;
    bar.querySelector('[data-rv-open]').textContent = judged
        ? judged === pairs.length
            ? 'Look again in the dialog'
            : 'Continue in the dialog'
        : 'Review in a dialog';
    nextButton.hidden = !NEXT || judged < pairs.length;
    // Kept for the Agenda, which offers every answer not yet copied when the demo was left without copying it.
    keepAnswer(DEMO, text, judged, round?.round || '');
}

/**
 * The last open pair judged: the kit goes straight back to the hub the demo was opened from, else to the Agenda, with
 * no choice to make (Kenny, 2026-10-16: no end dialog, no copy option). The answer is already kept for the Agenda's
 * "Answers to paste" (render() keepAnswer, run before this), so leaving loses nothing. Nothing opens the next item, or
 * this one again, by itself (Kenny, 2026-10-14: auto-next reopened the same demo and his two notes left the prompt).
 */
function finished() {
    dialog.close();
    say(`Everything is judged. This answer waits in the prompt on ${DONE_NAME}; going there now.`);
    location.assign(DONE_HREF);
}

const say = (message) => {
    foot.querySelector('[data-rv-status]').textContent = message;
};

/**
 * Copy the answer; true when it reached the clipboard, else it is selected. Opened from a hub, the answer also stays
 * in the hub's prompt until that one is copied: the prompt there gathers every demo judged on the way, and only its
 * own copy passes them on (Kenny, 2026-10-14: "zeker zijn dat de prompts blijven/aangevuld worden tot dat ik
 * effectief iets naar jou toe paste"). A demo opened on its own passes its answer on here.
 */
async function copyAnswer() {
    const { text } = answer();
    try {
        await navigator.clipboard.writeText(text);
        if (!NEXT) markAnswerCopied(DEMO);
        say(
            NEXT
                ? `Copied this demo's answer. It also stays in the prompt on ${HUB_NAME} until you copy that one.`
                : 'Copied. Paste it into the conversation.',
        );
        return true;
    } catch {
        const pre = foot.querySelector('[data-rv-answer]');
        pre.scrollIntoView({ block: 'center' });
        const range = document.createRange();
        range.selectNodeContents(pre);
        getSelection()?.removeAllRanges();
        getSelection()?.addRange(range);
        say('Selected. Press Ctrl+C to copy.');
        return false;
    }
}
for (const copy of document.querySelectorAll('[data-rv-copy]')) copy.addEventListener('click', copyAnswer);

// The way back to the hub, shown once nothing is open. It copies nothing: the answer is already kept (keepAnswer)
// and waits in the hub's prompt, added to by every demo judged after it, until that prompt is copied.
const nextButton = foot.querySelector('[data-rv-next]');
if (NEXT) {
    nextButton.textContent = `Back to ${HUB_NAME}`;
    foot.querySelector('[data-rv-answer-about]').textContent =
        `Every verdict and note from the dialog. It is kept in this browser and added to the prompt on ${HUB_NAME}, which gathers every demo you judge until you copy it there.`;
}
nextButton.addEventListener('click', () => location.assign(NEXT));

foot.querySelector('[data-rv-clear]').addEventListener('click', () => {
    if (!confirm('Clear every verdict and note on this demo, in every theme?')) return;
    state = {};
    save();
    render();
    say('Cleared.');
});

/* -------------------------------------------------------------- dialog */

const dialog = document.createElement('dialog');
dialog.className = 'kp-dialog rv-dialog';
dialog.setAttribute('aria-labelledby', 'rv-dialog-title');
dialog.innerHTML = `
    <div class="rv-dialog__head">
        <p class="rv-dialog__position" data-rv-position></p>
        <h2 class="kp-dialog__title" id="rv-dialog-title" data-rv-title></h2>
        <span class="kp-badge" data-rv-state></span>
        <button type="button" class="kp-button kp-button--ghost rv-dialog__close" aria-label="Close (Escape)" data-rv-close>✕</button>
    </div>
    <div class="rv-dialog__grid">
        <div class="rv-dialog__view">
            <div class="rv-flip" data-rv-flip>
                <button type="button" class="rv-flip__arrow rv-flip__arrow--left" data-rv-flip-prev aria-label="Previous option (←)" hidden>←</button>
                <div class="rv-dialog__stage" data-rv-stage></div>
                <button type="button" class="rv-flip__arrow rv-flip__arrow--right" data-rv-flip-next aria-label="Next option (→)" hidden>→</button>
            </div>
            <div class="rv-flip__bar" data-rv-flip-bar hidden>
                <div class="rv-flip__dots" data-rv-flip-dots></div>
                <p class="rv-flip__label" data-rv-flip-label></p>
                <div class="rv-flip__tools" role="group" aria-label="Motion, for the option shown">
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-replay>⟲ Replay (R)</button>
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-pause aria-pressed="false">Pause (Space)</button>
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-speed>Speed: Full (E)</button>
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-tour aria-pressed="false">Tour the states (A)</button>
                </div>
            </div>
        </div>
        <div class="rv-dialog__side">
            <p class="rv-meta" data-rv-intro>Everything on the left is approved together. Tick only what is wrong, and say why.</p>
            <div class="rv-update" data-rv-update></div>
            <p class="kp-alert kp-alert--destructive rv-integrity" role="alert" data-rv-integrity hidden></p>
            <ol class="rv-dialog__list" data-rv-list></ol>
            <p class="kp-field__error" role="alert" data-rv-refused hidden></p>
            <div class="rv-dialog__actions">
                <button type="button" class="kp-button" data-rv-go="-1">← Previous</button>
                <button type="button" class="kp-button" data-rv-go="1">Next →</button>
                <button type="button" class="kp-button kp-button--primary rv-dialog__wide" data-rv-approve>↑ Approve this theme</button>
            </div>
            <p class="rv-meta" id="rv-keys">Up approves the step, Left/Right move between steps, Escape closes. The theme switches by itself.</p>
        </div>
    </div>`;
document.body.append(dialog);
const $ = (selector) => /** @type {HTMLElement} */ (dialog.querySelector(selector));
const stage = $('[data-rv-stage]');
const list = $('[data-rv-list]');
const refused = $('[data-rv-refused]');
const approveButton = $('[data-rv-approve]');
const integrityBox = $('[data-rv-integrity]');
const flipWrap = $('[data-rv-flip]');
const flipPrev = $('[data-rv-flip-prev]');
const flipNext = $('[data-rv-flip-next]');
const flipBar = $('[data-rv-flip-bar]');
const flipDots = $('[data-rv-flip-dots]');
const flipLabel = $('[data-rv-flip-label]');
const flipPauseBtn = $('[data-rv-flip-pause]');
const flipSpeedBtn = $('[data-rv-flip-speed]');
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let index = 0;
/** The pairs on screen: the open ones of the step, or all of it once it is judged. */
let shownPairs = [];
/** @type {[Comment, HTMLElement][]} */
let moved = [];
/** True while a theme loads: a key pressed then would judge a step not yet on screen. */
let busy = false;

/* ------------------------------------------------------- aspect flip ---
 * One aspect page shows one option at a time, large (Kenny, form v32,
 * 2026-10-06: Flip, "er moeten wel opties zijn om bv animaties terug te
 * starten bv"). Every demo names its option cards the same way (an
 * attribute ending in "-option", e.g. data-cc-option/data-tr-option): no
 * per-demo class names are hard-coded here, so this works for every
 * character-* demo in aspect mode without touching the demos themselves.
 */
let flipRow = null;
let flipCells = [];
let flipTrio = null;
let flipChoice = null;
let flipPair = null;
let flipAt = 0;
let motionPaused = false;
let motionSpeed = '1';

const optionIndexOf = (el) => {
    for (const attr of el.attributes) if (/-option$/.test(attr.name)) return Number(attr.value);
    return null;
};
/** The row's option cards, in order, however the demo names its own attribute. */
const cellsOf = (row) =>
    [...row.querySelectorAll('*')]
        .map((el) => /** @type {[Element, number | null]} */ ([el, optionIndexOf(el)]))
        .filter(([, n]) => n != null && !Number.isNaN(n))
        .sort((a, b) => a[1] - b[1])
        .map(([el]) => el);

/** Re-presses the demo's own data-review-plays controls for one aspect (outside the mirrored copy). */
function playAspect(section, aspectId) {
    const mine = kept[DEMO] || {};
    for (const b of section.querySelectorAll('[data-review-plays]')) {
        if (!b.getAttribute('data-review-plays').split(/\s+/).includes(aspectId)) continue;
        // A state the reviewer set in this group stands; the autoplay leaves
        // it, unless the aspect is that state itself (data-review-forces):
        // the failed state is judged failed, the loading picture loading.
        const group = b.closest('[role="group"]');
        if (b.hasAttribute('aria-pressed') && group && groupName(group) in mine && !forces(b, aspectId)) continue;
        /** @type {HTMLElement} */ (b).click();
    }
}
/** Whether a button shows the state an aspect is about (data-review-forces="failure"). */
const forces = (/** @type {Element} */ b, /** @type {string} */ aspectId) =>
    (b.getAttribute('data-review-forces') || '').split(/\s+/).includes(aspectId);

/**
 * The state buttons the reviewer pressed, per demo: the group's name and
 * the button's place in it, kept across options, aspects, themes and visits
 * until the reviewer presses another (Kenny, 2026-10-06 20:48: "Open" still
 * did not stay on every screen, when it was kept per aspect) (Kenny, 2026-10-06 20:12: "als ik bv open als state had gekozen via
 * de knop, dan wil ik dat die state blijft staan bij de volgende optie …
 * onthoudt de state hiervan"). Only toggles (aria-pressed) count; actions
 * like Live update or Draw, and the speed, do not.
 */
const KEPT_STORE = `${STORE}:kept`;
/** @type {Record<string, Record<string, number>>} */
let kept = {};
try {
    kept = JSON.parse(localStorage.getItem(KEPT_STORE) || '{}') || {};
} catch {
    kept = {};
}
const groupName = (/** @type {Element} */ group) => group.getAttribute('aria-label') || '';
function keepPress(/** @type {Element | null | undefined} */ button) {
    const step = steps[index];
    const group = button?.closest('[role="group"]');
    if (!step?.aspect || !group || !button?.hasAttribute('aria-pressed')) return;
    if (!group.closest('[data-review-controls]') || /speed/i.test(groupName(group))) return;
    if (Object.keys(/** @type {HTMLElement} */ (button).dataset).some((k) => /speed$/i.test(k))) return;
    (kept[DEMO] ??= {})[groupName(group)] = [...group.querySelectorAll('button')].indexOf(/** @type {HTMLButtonElement} */ (button));
    try {
        localStorage.setItem(KEPT_STORE, JSON.stringify(kept));
    } catch {
        // No storage: kept for this visit only.
    }
}
/** Presses the reviewer's own states again, after the demo redrew (a flip, a theme change). */
function restoreKept(section, aspectId) {
    const mine = kept[DEMO];
    if (!mine || !aspectId) return;
    for (const group of section.querySelectorAll('[data-review-controls] [role="group"]')) {
        if (!(groupName(group) in mine)) continue;
        // The aspect's own state wins on its own page (see playAspect).
        if ([...group.querySelectorAll('button')].some((b) => forces(b, aspectId))) continue;
        const button = /** @type {HTMLElement | undefined} */ ([...group.querySelectorAll('button')][mine[groupName(group)]]);
        // A radio-like group (several pressable buttons) is pressed again even
        // when it still reads as pressed: a redraw (a theme change) can reset
        // what the button set, such as an open menu, without telling it. A
        // lone toggle is only pressed when it reads as off, or it would flip.
        const radio = group.querySelectorAll('button[aria-pressed]').length > 1;
        if (button && (radio || button.getAttribute('aria-pressed') !== 'true')) button.click();
    }
}

/**
 * A state pressed in a topic step's frame stays across themes and visits (DEMO_RULES ch. 7, fix-112, fix-115): the group's
 * name and the button's place in it are kept per section, and pressed again when that section's frame loads in the next theme.
 */
function keepLanePress(/** @type {string} */ item, /** @type {Element | null | undefined} */ button) {
    const group = button?.closest('[role="group"]');
    if (!group || !button?.hasAttribute('aria-pressed') || !group.closest('[data-review-controls]') || /speed/i.test(groupName(group))) return;
    (kept[DEMO] ??= {})[`${item}\u241f${groupName(group)}`] = [...group.querySelectorAll('button')].indexOf(/** @type {HTMLButtonElement} */ (button));
    try {
        localStorage.setItem(KEPT_STORE, JSON.stringify(kept));
    } catch {
        // No storage: kept for this visit only.
    }
}
function restoreLanePresses(/** @type {HTMLElement} */ section, /** @type {string} */ item) {
    const mine = kept[DEMO];
    if (!mine) return;
    for (const group of section.querySelectorAll('[data-review-controls] [role="group"]')) {
        const at = mine[`${item}\u241f${groupName(group)}`];
        const button = /** @type {HTMLElement | undefined} */ ([...group.querySelectorAll('button')][at]);
        if (button && button.getAttribute('aria-pressed') !== 'true') button.click();
    }
}

/** Forces every CSS animation under `root` to restart from its first frame. */
function restartMotion(root) {
    const els = [root, ...root.querySelectorAll('*')];
    for (const el of els) /** @type {HTMLElement} */ (el).style.animation = 'none';
    void (/** @type {HTMLElement} */ (root).offsetWidth); // reflow, so the clear below is not coalesced with the set above
    for (const el of els) /** @type {HTMLElement} */ (el).style.removeProperty('animation');
}

/** Finds the demo's own speed button (its attribute ends in "-speed") carrying this value, and clicks it. */
function pressSpeed(value) {
    for (const el of document.querySelectorAll('button')) {
        for (const attr of el.attributes)
            if (/-speed$/.test(attr.name) && attr.value === value) {
                /** @type {HTMLElement} */ (el).click();
                return;
            }
    }
}

/** Injects/updates the "every animation paused" rule the P key and button toggle. */
function applyPauseStyle() {
    let style = document.getElementById('rv-flip-pause');
    if (!style) {
        style = document.createElement('style');
        style.id = 'rv-flip-pause';
        document.head.append(style);
    }
    style.textContent = motionPaused ? '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }' : '';
    flipPauseBtn.setAttribute('aria-pressed', String(motionPaused));
    flipPauseBtn.textContent = motionPaused ? 'Resume (Space)' : 'Pause (Space)';
}

/*
 * The pointer, played in the dialog (Kenny, 2026-10-07: the hover question
 * of brutalism and solstice showed nothing move). A character demo draws the
 * part pointed at with its own `<prefix>-pointed` class (`-pointed-<part>`
 * for a part of its own), standing still. On
 * an aspect about the pointer (`hover`, or the ids the section lists in
 * `data-review-point`) the dialog takes that class away and gives it back on
 * a loop, so every option's hover plays as the pointer arrives and leaves, at
 * the dialog's speed; Replay starts it over, Pause holds it, reduced motion
 * keeps the still frame.
 */
const POINTED = /^[a-z][a-z0-9]*-pointed(-[a-z]+)?$/;
/** @type {[Element, string][]} the parts the loop toggles, with their class */
let pointedParts = [];
let pointerTimer = 0;
function stopPointer() {
    clearTimeout(pointerTimer);
    for (const [el, cls] of pointedParts) el.classList.add(cls);
    pointedParts = [];
}
function playPointer(step, /** @type {HTMLElement | undefined} */ shown) {
    stopPointer();
    const aspects = (flipPair?.item?.section?.dataset.reviewPoint || 'hover').split(/\s+/);
    if (!shown || !step?.aspect || !aspects.includes(step.aspect) || prefersReducedMotion()) return;
    pointedParts = [...shown.querySelectorAll('[class*="-pointed"]')].flatMap((el) =>
        [...el.classList].filter((cls) => POINTED.test(cls)).map((cls) => /** @type {[Element, string]} */ ([el, cls])),
    );
    if (!pointedParts.length) return;
    let pointed = false; // the loop starts with the pointer away, then it arrives
    const tick = () => {
        if (!motionPaused) {
            for (const [el, cls] of pointedParts) el.classList.toggle(cls, pointed);
            pointed = !pointed;
        }
        // Pointed at long enough to read the hover, away long enough to see it go.
        pointerTimer = setTimeout(tick, (pointed ? 900 : 1800) / (Number(motionSpeed) || 1));
    };
    tick();
}

/** Leaves the demo exactly as focusAspect found it: every cell shown again, no leftover sizing. */
function teardownFlip() {
    stopPointer();
    if (flipTrio) flipTrio.removeAttribute('data-rv-flip-trio');
    for (const cell of flipCells) {
        /** @type {HTMLElement} */ (cell).hidden = false;
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-kpi-spark-height');
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-graph-height');
    }
    flipRow = null;
    flipCells = [];
    flipTrio = null;
    flipChoice = null;
    flipPair = null;
    flipWrap.classList.remove('rv-flip--active');
    flipPrev.hidden = flipNext.hidden = true;
    flipBar.hidden = true;
}

/** Finds the aspect's row and its option cards, and the flip's starting position (the pick already on file, else the first). */
function setupFlip(step, pair) {
    const section = pair.item.section;
    const rowsAttr = section.dataset.reviewRows;
    const row = rowsAttr ? section.querySelector(`[${rowsAttr}="${CSS.escape(step.aspect)}"]`) : null;
    // Only the options this theme has: a choice lists as many options as the
    // theme with the most, and a theme with three must not flip on to cells
    // 4–6, which draw no option of its own (Kenny picked "6" for retro's and
    // grotesk's key-figure loading, 2026-10-06 20:59, on such an empty cell).
    // A theme's own options carry a hint under its name.
    const base = pair.item.choices.find((c) => c.id === step.aspect) || null;
    flipChoice = base ? { ...base, options: base.options.filter((o) => !o.hints || !Object.keys(o.hints).length || o.hints[pair.theme]) } : null;
    flipPair = pair;
    flipRow = row;
    flipCells = row ? cellsOf(row).slice(0, flipChoice?.options.length || 0) : [];
    flipTrio = flipCells[0]?.parentElement || null;
    if (flipTrio) flipTrio.setAttribute('data-rv-flip-trio', '');
    const already = flipChoice ? choiceOf(pair, flipChoice) : '';
    const at = already ? flipChoice.options.findIndex((o) => o.value === already) : 0;
    flipAt = at >= 0 ? at : 0;
    flipWrap.classList.add('rv-flip--active');
    flipPrev.hidden = flipNext.hidden = false;
    flipBar.hidden = false;
}

/** Shows only flipCells[flipAt], large; its number, name and one-line note once; plays and restarts its motion. */
/** The option shown, counted in the head beside the step, so the reviewer sees
 *  which one is up without scrolling to the words under the stage (Kenny,
 *  2026-10-08). Cleared when no option is flipped. */
function writeFlipPosition() {
    const position = $('[data-rv-position]');
    position.querySelector('[data-rv-flip-pos]')?.remove();
    if (!flipChoice || !flipWrap.classList.contains('rv-flip--active')) return;
    const span = document.createElement('span');
    span.setAttribute('data-rv-flip-pos', '');
    span.textContent = ` · option ${flipAt + 1}/${flipChoice.options.length}`;
    position.append(span);
}

function paintFlip(step) {
    if (!flipRow) return;
    stopPointer();
    flipCells.forEach((cell, i) => {
        /** @type {HTMLElement} */ (cell).hidden = i !== flipAt;
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-kpi-spark-height');
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-graph-height');
    });
    const shown = /** @type {HTMLElement} */ (flipCells[flipAt]);
    if (shown) {
        shown.style.setProperty('--kp-kpi-spark-height', '16rem');
        shown.style.setProperty('--kp-graph-height', '26rem');
    }
    const option = flipChoice?.options[flipAt];
    writeFlipPosition();
    flipLabel.replaceChildren();
    if (option) {
        const b = document.createElement('b');
        b.textContent = `${flipAt + 1}/${flipChoice.options.length} · ${option.label}`;
        flipLabel.append(b);
        const hint = option.hints?.[flipPair.theme] || option.hint || '';
        if (hint) {
            const small = document.createElement('small');
            small.textContent = hint;
            flipLabel.append(small);
        }
    }
    flipDots.replaceChildren(
        ...(flipChoice?.options || []).map((_, i) => {
            const dot = document.createElement('span');
            if (i === flipAt) dot.className = 'rv-flip__dot--active';
            return dot;
        }),
    );
    const reduced = prefersReducedMotion();
    if (reduced) {
        const note = document.createElement('small');
        note.className = 'rv-flip__reduced';
        note.textContent = 'Reduced motion: still frame, no autoplay.';
        flipLabel.append(note);
    } else {
        playAspect(flipPair.item.section, step.aspect);
    }
    restoreKept(flipPair.item.section, step.aspect);
    playPointer(step, shown);
    markTarget(shown);
    if (shown)
        requestAnimationFrame(() => {
            fitShown(shown);
            restartMotion(shown);
        });
    applyPauseStyle();
    pressSpeed(motionSpeed);
    flipSpeedBtn.textContent = `Speed: ${motionSpeed === '1' ? 'Full' : motionSpeed === '0.5' ? '½' : '¼'} (E)`;
}

/** Scales the shown option down, to three quarters at most, so as much of it as can stay readable fits the stage's height. */
function fitShown(/** @type {HTMLElement} */ shown) {
    shown.style.removeProperty('zoom');
    stage.scrollTop = 0;
    const top = shown.getBoundingClientRect().top - stage.getBoundingClientRect().top;
    const room = stage.clientHeight - top - 8;
    const need = shown.getBoundingClientRect().height;
    // Never below three quarters: a tall scene shrunk to fit (blueprint's
    // and brutalism's Motifs at about half size) read as an empty stage
    // (Kenny, 2026-10-07: "nothing is showing here"); the stage scrolls for
    // the rest.
    if (need > room && room > 0) shown.style.setProperty('zoom', String(Math.max(MIN_ZOOM, room / need)));
}
const MIN_ZOOM = 0.75;

/**
 * Outlines the part of the demo the aspect is about, when the demo names it
 * (a choice's `target` selector and `targetName` words), and says so under
 * the option's name (Kenny, 2026-10-06 19:33: "it's really not clear which
 * parts of the demo you are targeting for evaluation"). A part that only
 * appears later (the tour's ring after Next) is outlined when it does.
 */
let targetWatch = null;
function markTarget(/** @type {HTMLElement | undefined} */ shown) {
    targetWatch?.disconnect();
    targetWatch = null;
    for (const el of document.querySelectorAll('[data-rv-target]')) el.removeAttribute('data-rv-target');
    const selector = flipChoice?.target;
    if (!shown || !selector) return;
    const mark = () => {
        for (const el of document.querySelectorAll('[data-rv-target]'))
            if (!shown.contains(el) || !el.matches(selector)) el.removeAttribute('data-rv-target');
        for (const el of shown.querySelectorAll(selector)) if (!el.hasAttribute('data-rv-target')) el.setAttribute('data-rv-target', '');
    };
    mark();
    targetWatch = new MutationObserver(mark);
    targetWatch.observe(shown, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['data-kp-tour-target', 'class', 'open', 'hidden'],
    });
    if (flipChoice.targetName) {
        const small = document.createElement('small');
        small.className = 'rv-flip__target';
        small.textContent = `Judge only what the dashed outline marks: ${flipChoice.targetName}.`;
        flipLabel.append(small);
    }
}

/** ←/→ and the on-screen arrows: the next or previous option, its motion restarted; never leaves the page. */
function flip(step, dir) {
    if (!flipChoice || !step?.aspect) return;
    flipAt = (flipAt + dir + flipChoice.options.length) % flipChoice.options.length;
    paintFlip(step);
}

/** Replay (R / the button): restarts the shown option's motion from the start, without flipping away. */
/**
 * The demo's own control groups, in order, without the speed group (the
 * dialog has its own): the state words first, then the tone, then any
 * further set (Kenny, 2026-10-06 17:14: "I would like to be able to not
 * have to take my hands off the keyboard ... left hand on the normal
 * position and the right hand on the arrow keys").
 */
function controlGroups() {
    const section = flipPair?.item?.section;
    if (!section) return [];
    return [...section.querySelectorAll('[data-review-controls] [role="group"]')]
        .filter(
            (g) =>
                !/speed/i.test(g.getAttribute('aria-label') || '') &&
                !g.querySelector('[data-cc-speed], [data-ct-speed], [data-tl-speed]'),
        )
        .map((g) => {
            const all = /** @type {HTMLElement[]} */ (
                [...g.querySelectorAll('button')].filter((b) => !/speed/i.test(Object.keys(b.dataset).join(' ')))
            );
            // Q/S walk the states only: an action in the same group (busy's
            // Draw) is not a state and would stall the walk on it.
            const states = all.filter((b) => b.hasAttribute('aria-pressed'));
            return states.length > 1 ? states : all;
        })
        .filter((buttons) => buttons.length);
}
/** Presses the next (or previous) button of control group n, as the demo's own click would. */
function stepGroup(n, dir = 1) {
    const buttons = controlGroups()[n];
    if (!buttons) return;
    const pressed = buttons.findIndex((b) => b.getAttribute('aria-pressed') === 'true');
    const last = Number(buttons[0].closest('[role="group"]')?.getAttribute('data-rv-last') ?? (pressed >= 0 ? pressed : -1));
    const at = ((pressed >= 0 ? pressed : last) + dir + buttons.length) % buttons.length;
    buttons[0].closest('[role="group"]')?.setAttribute('data-rv-last', String(at));
    buttons[at].click();
    keepPress(buttons[at]);
    const shown = /** @type {HTMLElement} */ (flipCells[flipAt]);
    if (shown) requestAnimationFrame(() => fitShown(shown));
}
/** A: tours the first group's states by itself, then the next tone, over and over, until pressed again or the page changes. */
let tourTimer = 0;
let tourCount = 0;
const tourButton = $('[data-rv-flip-tour]');
function stopTour() {
    clearInterval(tourTimer);
    tourTimer = 0;
    tourButton?.setAttribute('aria-pressed', 'false');
}
function toggleTour() {
    if (tourTimer) return stopTour();
    tourCount = 0;
    tourButton?.setAttribute('aria-pressed', 'true');
    const tick = () => {
        const groups = controlGroups();
        if (!groups.length) return stopTour();
        stepGroup(0);
        tourCount += 1;
        if (groups[1] && tourCount % groups[0].length === 0) stepGroup(1);
    };
    tick();
    tourTimer = setInterval(tick, 3000);
}
tourButton?.addEventListener('click', () => toggleTour());

/** Z (AZERTY): presses the demo's own live-update control, whatever the demo calls it. */
function liveUpdate() {
    const section = flipPair?.item?.section;
    if (!section) return;
    const live = [...section.querySelectorAll('[data-review-controls] button')].find(
        (b) => (Object.keys(b.dataset).some((k) => /live$/i.test(k)) || /^\s*live update/i.test(b.textContent || '')),
    );
    if (live) return live.click();
    // A demo without a live update (busy, drawer, header …) says so instead
    // of doing nothing (Kenny, 2026-10-06 19:29: "when I press Z … what's
    // supposed to happen here?").
    flipLabel.querySelector('.rv-flip__nokey')?.remove();
    const note = document.createElement('small');
    note.className = 'rv-flip__nokey';
    note.textContent = 'This component has no live update, so Z does nothing here.';
    flipLabel.append(note);
    setTimeout(() => note.remove(), 2500);
}

function replay(step) {
    if (!step?.aspect || !flipPair) return;
    const shown = /** @type {HTMLElement} */ (flipCells[flipAt]);
    if (!prefersReducedMotion()) playAspect(flipPair.item.section, step.aspect);
    // Replay plays the option again in the reviewer's own states, never back
    // to the page's default (Kenny, 2026-10-06 20:49: "als ik op r druk, dan
    // gaat die altijd terug naar loading").
    restoreKept(flipPair.item.section, step.aspect);
    playPointer(step, shown);
    if (shown) requestAnimationFrame(() => restartMotion(shown));
}

/** P / the button: pauses or resumes every animation and transition on the page. */
function togglePause() {
    motionPaused = !motionPaused;
    applyPauseStyle();
}

/** S / the button: cycles the demo's own speed control through full, ½ and ¼. */
function cycleSpeed() {
    motionSpeed = motionSpeed === '1' ? '0.5' : motionSpeed === '0.5' ? '0.25' : '1';
    pressSpeed(motionSpeed);
    flipSpeedBtn.textContent = `Speed: ${motionSpeed === '1' ? 'Full' : motionSpeed === '0.5' ? '½' : '¼'} (E)`;
}
/**
 * Resolves once the page's own scripts have run. The catalogue shell
 * (catalogue/catalogue.js, a module after this one) moves every child of the
 * body into its column; a dialog moved while open leaves the top layer and
 * stays open as a plain, non-modal box placed after the answer at the foot,
 * so every approval that lengthened the answer pushed it a little further
 * down, and only closing and reopening made it modal again (Kenny,
 * 2026-10-05, fix-102). Every module script has run by DOMContentLoaded, so
 * the dialog opens after it, once the shell has placed it for good.
 */
const booted = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
        window.addEventListener('load', resolve, { once: true });
    }
});

/**
 * Shows only one aspect's row of a section: every sibling on the way from
 * that row up to the section is set aside, except what holds the demo's
 * controls or its look-at line. `null` shows the whole section again.
 * @param {HTMLElement} section @param {string | null} aspect
 */
function focusAspect(section, aspect) {
    for (const el of section.querySelectorAll('[data-review-off]')) el.removeAttribute('data-review-off');
    section.removeAttribute('data-review-focus');
    const attr = section.dataset.reviewRows;
    if (!aspect || !attr) return;
    const row = section.querySelector(`[${attr}="${CSS.escape(aspect)}"]`);
    if (!row) return;
    section.setAttribute('data-review-focus', aspect);
    for (let el = row; el && el !== section; el = el.parentElement)
        for (const sib of el.parentElement?.children || [])
            if (
                sib !== el &&
                !sib.matches('script, style') &&
                !sib.querySelector('[data-review-controls]') &&
                !sib.matches('[data-review-controls]') &&
                !sib.matches('[data-review-look]')
            )
                sib.setAttribute('data-review-off', '');
}

/** The tools over each section on stage (block-tools.js): previous version, play open and close, speed. */
let tools = [];

function putBack() {
    for (const tool of tools) tool.teardown();
    tools = [];
    markTarget(undefined);
    stopTour();
    teardownFlip();
    for (const [, section] of moved) focusAspect(section, null);
    for (const [placeholder, section] of moved) placeholder.replaceWith(section);
    moved = [];
    laneWatch?.disconnect();
    laneWatch = null;
    lanes = [];
    stage.replaceChildren();
}

/* ------------------------------------------------------------ controls */
/*
 * A component's controls stand AT the component (Kenny, 2026-10-18 07:09: "Die controls moeten niet gewoon meer boven
 * staan, maar enkel de geschikte control per component zoals die tevoorschijn komt"). A demo declares which
 * component a group of buttons drives, `data-review-controls-for="<id of the component>"`; the dialog shows the
 * demo's own container, never a copy, directly above the component it drives, inside the section that holds both,
 * so the controls arrive with the component as the reviewer walks to it. There is no bar on top, and a container
 * outside every section (or one that names no component of its section) is not shown at all.
 */
/** The block of the section that holds `target`, a direct child of the section. */
function blockOf(/** @type {HTMLElement} */ section, /** @type {Element} */ target) {
    let top = target;
    while (top.parentElement && top.parentElement !== section) top = top.parentElement;
    return top.parentElement === section ? top : null;
}
/** Puts every container of the section's own controls directly above the component it drives; the Expected block goes under the component. */
function placeControls(/** @type {HTMLElement} */ section) {
    for (const box of /** @type {NodeListOf<HTMLElement>} */ (section.querySelectorAll('[data-review-controls]'))) {
        const id = box.getAttribute('data-review-controls-for');
        // A page that names no component (an older demo) still shows its controls: at the stage that follows them.
        let target = id ? section.querySelector(`#${CSS.escape(id)}`) : null;
        if (!id)
            for (let el = box.nextElementSibling; el && !target; el = el.nextElementSibling)
                if (/^(div|section|form|figure|ul|ol|table|article|dl)$/i.test(el.tagName) && !el.matches('[data-review-look], .cat-judge') && !/(readout|label|note|log|-expect(ed)?)\b/.test(el.className)) target = el;
        const block = target && !box.contains(target) ? blockOf(section, target) : null;
        box.classList.add('rv-ctl');
        box.toggleAttribute('data-rv-orphan', !block);
        if (!block) continue;
        if (box.nextElementSibling !== block) block.before(box);
        box.setAttribute('data-rv-ctl-title', 'Controls of this component');
    }
    // The component first: what the reviewer should see under the heading is the component with its controls, then the
    // Expected block (a demo's own `*-expect`/`*-expected` box that sits directly in the section).
    const expected = /** @type {HTMLElement | null} */ ([...section.children].find((el) => /-expect(ed)?$/.test(el.className)));
    if (expected) section.insertBefore(expected, [...section.children].find((el) => el.matches('.cat-judge')) ?? null);
}

/* ---------------------------------------------------------- topic steps ---
 * A topic step shows each of its sections in the step's one theme, one frame per pair (the demo itself in lane mode,
 * at `?theme=<theme>&rv-lane=<item>`, isolated to that one section the way the previous version is): the heat grid in
 * cyberpunk, then the matrix in cyberpunk. The frames load as they come near the view. The demo's controls are
 * mirrored once on top, as on a theme step, and a press acts on the page's own control and on the same control in
 * every frame; a frame that loads later replays the presses made before it. V and L act on the frame most in view, or
 * the one the key was pressed in.
 */
/** @type {{ pair: Pair, frame: HTMLIFrameElement, section: HTMLElement, tool: ReturnType<typeof mountBlockTools> }[]} */
let lanes = [];
/** @type {IntersectionObserver | null} */
let laneWatch = null;
/** Whether the reviewer moved the dialog's view since the topic step was shown; until then it stays at its top. */
let laneMoved = false;

/** The theme this browser keeps, read before the first frame stored its own (undefined: not read yet). */
let keptTheme = /** @type {string | null | undefined} */ (undefined);
const storedTheme = () => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};
/** Puts the kept theme back after a frame's head stored its own. */
function restoreTheme() {
    try {
        if (keptTheme === undefined || storedTheme() === keptTheme) return;
        if (keptTheme === null) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, keptTheme);
    } catch {
        /* a private window */
    }
}
// While a topic step is on screen, the themes its frames store are no choice of the reviewer's: the page keeps its own.
addEventListener('storage', (event) => event.key === STORAGE_KEY && laneWatch !== null && event.stopImmediatePropagation(), true);

/** The lane frame a message came from, by its window. */
const laneOf = (/** @type {MessageEventSource | null} */ source) => lanes.find((lane) => lane.frame.contentWindow === source);
addEventListener('message', (event) => {
    const data = event.data || {};
    if (event.origin !== location.origin || data.type !== 'rv-lane-key' || !dialog.open) return;
    if (data.key === 'Escape') return dialog.close();
    laneOf(event.source)?.tool.key(data.code);
});

/** One section in one theme, in a frame of its own, under a head naming the theme. @param {Pair} pair */
function laneFor(pair) {
    const label = LABEL[pair.theme] || pair.theme;
    const card = document.createElement('article');
    card.className = 'rv-lane';
    card.dataset.rvPair = pair.key;
    card.classList.toggle('rv-lane--rejected', verdictOf(pair) === 'rejected');
    card.setAttribute('aria-label', `${pair.title}, in ${label}`);
    card.innerHTML = `
        <header class="rv-lane__head">
            <p class="rv-lane__name"><b class="rv-lane__theme"></b><span class="rv-lane__section"></span></p>
        </header>
        <iframe class="rv-lane__frame"></iframe>`;
    /** @type {HTMLElement} */ (card.querySelector('.rv-lane__theme')).textContent = label;
    /** @type {HTMLElement} */ (card.querySelector('.rv-lane__section')).textContent = pair.title;
    const frame = /** @type {HTMLIFrameElement} */ (card.querySelector('iframe'));
    frame.title = `${pair.title}, in ${label}`;
    const src = new URL(location.pathname, location.href);
    src.search = new URLSearchParams({ theme: pair.theme, 'rv-lane': pair.item.id }).toString();
    /** @type {any} */ (card).rvLoad = () => {
        frame.addEventListener(
            'load',
            async () => {
                // The demo's head keeps a theme from its address as the stored theme; the one kept before is put back.
                restoreTheme();
                const doc = frame.contentDocument;
                if (!doc || !card.isConnected) return;
                await isolate(frame, pair.item.id, pair.theme);
                const sheet = doc.createElement('link');
                sheet.rel = 'stylesheet';
                sheet.href = new URL('review.css', import.meta.url).href;
                doc.head.append(sheet);
                const own = doc.createElement('style');
                // The section's own controls stay in the frame, at their component (placeControls); the page's judge panel does not.
                own.textContent = '.cat-judge { display: none !important; } body { background: var(--background); }';
                doc.head.append(own);
                const section = /** @type {HTMLElement | null} */ (doc.querySelector(`[data-review-item="${CSS.escape(pair.item.id)}"]`));
                if (!section || !card.isConnected) return;
                const tool = mountBlockTools({ section, item: pair.item.id, theme: pair.theme, themeLabel: label, title: pair.title });
                card.querySelector('.rv-lane__head')?.append(tool.bar);
                tools.push(tool);
                lanes.push({ pair, frame, section, tool });
                placeControls(section);
                restoreLanePresses(section, pair.item.id);
                doc.addEventListener('click', (event) => event.isTrusted && keepLanePress(pair.item.id, /** @type {Element} */ (event.target).closest?.('button')), true);
                const View = doc.defaultView?.CustomEvent ?? CustomEvent;
                section.dispatchEvent(new View('review:show', { bubbles: true }));
                for (const choice of pair.item.choices) {
                    const value = choiceOf(pair, choice);
                    if (value) section.dispatchEvent(new View('review:choice', { bubbles: true, detail: { id: choice.id, value } }));
                }
                // The other frames of this section take its height until they load, so the page does not jump.
                const group = card.closest('.rv-topic');
                if (group && !group.style.getPropertyValue('--rv-lane-guess')) group.style.setProperty('--rv-lane-guess', frame.style.blockSize);
                // A frame that loads does not move the view: the step keeps its top until the reviewer scrolls.
                if (!laneMoved) for (const box of [stage, stage.closest('.rv-dialog__view')]) if (box) box.scrollTop = 0;
            },
            { once: true },
        );
        frame.src = src.href;
        early(frame, pair.item.id);
    };
    return card;
}

/** The stage of a topic step: per section a heading and its frame, in the step's one theme. @param {Pair[]} shown */
function paintTopic(shown) {
    if (keptTheme === undefined) keptTheme = storedTheme();
    const view = /** @type {HTMLElement} */ (stage.closest('.rv-dialog__view'));
    laneMoved = false;
    const moved = () => {
        laneMoved = true;
    };
    for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) view.addEventListener(type, moved, { once: true, passive: true });
    laneWatch = new IntersectionObserver(
        (entries) => {
            for (const entry of entries)
                if (entry.isIntersecting) {
                    laneWatch?.unobserve(entry.target);
                    /** @type {any} */ (entry.target).rvLoad?.();
                }
        },
        { root: view, rootMargin: '150% 0px' },
    );
    for (const item of [...new Set(shown.map((pair) => pair.item))]) {
        const own = shown.filter((pair) => pair.item === item);
        const group = document.createElement('section');
        group.className = 'rv-topic';
        group.innerHTML = `<h3 class="rv-topic__title"></h3><div class="rv-topic__lanes"></div>`;
        /** @type {HTMLElement} */ (group.querySelector('.rv-topic__title')).textContent = item.title;
        const box = /** @type {HTMLElement} */ (group.querySelector('.rv-topic__lanes'));
        for (const pair of own) {
            const card = laneFor(pair);
            box.append(card);
            laneWatch.observe(card);
        }
        stage.append(group);
    }
}

function frameFor(pair) {
    const { page, block, theme } = pair.extra;
    const box = document.createElement('section');
    box.className = 'rv-extra';
    box.dataset.rvPair = pair.key;
    const src = new URL('block.html', import.meta.url);
    src.search = new URLSearchParams({ page, block, theme }).toString();
    box.innerHTML = `<h2 class="rv-extra__title"></h2><iframe class="rv-extra__frame"></iframe>`;
    box.querySelector('h2').textContent = pair.title;
    const frame = box.querySelector('iframe');
    frame.title = pair.title;
    // Same origin, so the frame takes its block's own height once the block
    // is in, and follows it when the block grows (an opened menu, a step).
    frame.addEventListener('load', () => {
        const doc = frame.contentDocument;
        if (!doc) return;
        const fit = () => {
            frame.style.blockSize = `${doc.documentElement.scrollHeight}px`;
        };
        new ResizeObserver(fit).observe(doc.body);
        fit();
    });
    frame.src = src.href;
    return box;
}

function rowFor(pair, only = null, name = '') {
    const li = document.createElement('li');
    li.className = 'rv-row';
    // The row's own pair: every verdict and note is filed by this key, never by the row's place in the list.
    li.dataset.rvKey = pair.key;
    const id = `rv-${pair.key.replace(/[^a-z0-9-]/gi, '-')}`;
    li.innerHTML = `
        <div class="rv-row__head">
            <button type="button" class="rv-row__jump" data-rv-jump></button>
            <span class="kp-field kp-field--check rv-row__check">
                <input class="kp-field__check" type="checkbox" id="${id}" data-rv-reject />
                <label class="kp-field__label" for="${id}">${only ? 'None of these' : 'Not approved'}</label>
            </span>
        </div>
        <p class="rv-row__look" data-rv-row-look></p>
        <div class="rv-row__choices" data-rv-choices></div>
        <textarea class="kp-field__input kp-field__input--multiline rv-row__note" rows="2" placeholder="What should change" data-rv-row-note hidden></textarea>`;
    li.querySelector('[data-rv-jump]').textContent = name || pair.title;
    const look = pair.item ? lookFor(pair.item.section, pair.theme) : pair.look;
    const lookBox = li.querySelector('[data-rv-row-look]');
    if (look && !only) lookBox.innerHTML = look;
    else lookBox.remove();
    const choiceBox = li.querySelector('[data-rv-choices]');
    // In aspect mode the option itself is picked by flipping it large in the stage
    // (flip()/paintFlip()), not by a radio here, so the sidebar carries only the
    // "None of these" checkbox and note for this one aspect.
    for (const choice of only ? [] : pair.item?.choices || []) {
        if (fixedFor(pair, choice)) continue;
        const set = document.createElement('fieldset');
        set.className = 'rv-choice rv-choice--default';
        set.dataset.rvChoice = choice.id;
        const legend = document.createElement('legend');
        legend.textContent = choice.once ? `${choice.label} (once, for every theme)` : choice.label;
        set.append(legend);
        // Only the default is asked: it is already set, the others are switches to look at (defaults-1017).
        const intro = document.createElement('p');
        intro.className = 'rv-choice__intro';
        intro.textContent = 'The default is set, nothing to tick. Press another option to see it live; it then becomes the default.';
        set.append(intro);
        for (const option of choice.options) {
            const label = document.createElement('label');
            label.className = 'rv-choice__option';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `${id}-${choice.id}`;
            input.value = option.value;
            input.checked = choiceOf(pair, choice) === option.value;
            const isDefault = defaultOf(pair, choice) === option.value;
            input.addEventListener('change', () => {
                if (choice.once) state[onceKey(pair.item, choice)] = { value: option.value };
                else state[pair.key] = { ...state[pair.key], choices: { ...state[pair.key]?.choices, [choice.id]: option.value } };
                save();
                record(pair, {
                    key: choice.once ? onceKey(pair.item, choice) : pair.key,
                    choice: { id: choice.id, value: option.value, label: option.label, changed: !isDefault },
                });
                render();
                pair.item.section.dispatchEvent(new CustomEvent('review:choice', { bubbles: true, detail: { id: choice.id, value: option.value } }));
                const lane = lanes.find((l) => l.pair === pair);
                const View = lane?.frame.contentWindow?.CustomEvent;
                if (lane && View)
                    lane.section.dispatchEvent(new View('review:choice', { bubbles: true, detail: { id: choice.id, value: option.value } }));
            });
            const text = document.createElement('span');
            const name = document.createElement('b');
            name.textContent = option.label;
            text.append(name);
            const tag = document.createElement('span');
            tag.className = 'rv-choice__tag';

            text.append(tag);
            const hint = option.hints?.[pair.theme] || option.hint;
            if (hint) {
                const small = document.createElement('span');
                small.className = 'rv-choice__hint';
                small.textContent = hint;
                text.append(small);
            }
            label.append(input, text);
            // Besides the default, every other option may be kept as an option or removed (Kenny, 2026-10-17 23:36:
            // "ik wil de optie om dingen als optie aan te houden, maar ook om ze te verwijderen"). Keep needs no click.
            const row = document.createElement('div');
            row.className = 'rv-choice__row';
            const drop = document.createElement('label');
            drop.className = 'rv-choice__remove';
            const dropBox = document.createElement('input');
            dropBox.type = 'checkbox';
            dropBox.setAttribute('data-rv-remove', `${choice.id}:${option.value}`);
            dropBox.checked = removedOf(pair, choice).includes(option.value);
            const dropText = document.createElement('span');
            dropText.textContent = 'Remove this option (otherwise kept)';
            drop.append(dropBox, dropText);
            const syncRemove = () => {
                const current = choiceOf(pair, choice) === option.value;
                dropBox.disabled = current;
                drop.hidden = current;
                tag.textContent = current ? 'The default' : 'Also available, switch to see it';
            };
            syncRemove();
            set.addEventListener('change', syncRemove);
            dropBox.addEventListener('change', () => {
                const left = removedOf(pair, choice).filter((v) => v !== option.value);
                const now = dropBox.checked ? [...left, option.value] : left;
                state[pair.key] = { ...state[pair.key], removed: { ...state[pair.key]?.removed, [choice.id]: now } };
                save();
                record(pair, {
                    key: pair.key,
                    choice: { id: choice.id, value: option.value, label: option.label, removed: dropBox.checked },
                });
                render();
            });
            row.append(label, drop);
            set.append(row);
        }
        choiceBox.append(set);
    }
    if (!choiceBox.childElementCount) choiceBox.remove();
    const box = /** @type {HTMLInputElement} */ (li.querySelector('[data-rv-reject]'));
    const note = /** @type {HTMLTextAreaElement} */ (li.querySelector('[data-rv-row-note]'));
    note.setAttribute('aria-label', `What should change in ${pair.title}`);
    // The note names its own section, so a note can only be typed where it belongs.
    note.placeholder = `What should change in ${pair.title}`;
    box.checked = only ? Boolean(state[pair.key]?.redo?.[only]) : verdictOf(pair) === 'rejected';
    note.value = only ? state[pair.key]?.redo?.[only] || '' : noteOf(pair);
    if (only) note.placeholder = `What should change in this aspect of ${pair.title}`;
    note.hidden = !box.checked && !note.value;
    li.classList.toggle('rv-row--rejected', box.checked);
    box.addEventListener('change', () => {
        note.hidden = !box.checked && !note.value;
        li.classList.toggle('rv-row--rejected', box.checked);
        stage.querySelector(`.rv-lane[data-rv-pair="${CSS.escape(pair.key)}"]`)?.classList.toggle('rv-lane--rejected', box.checked);
        if (box.checked) note.focus();
        if (!only) {
            state[pair.key] = {
                ...state[pair.key],
                verdict: box.checked ? 'rejected' : 'approved',
                note: note.value.trim(),
                at: new Date().toISOString(),
            };
            save();
            record(pair, { verdict: box.checked ? 'rejected' : 'approved', note: note.value.trim() });
            render();
        } else
            record(pair, {
                verdict: null,
                note: `${only}: ${box.checked ? 'none of these' : 'picked'}${note.value.trim() ? ` · ${note.value.trim()}` : ''}`,
            });
        updateApprove();
    });
    note.addEventListener('input', () => {
        if (only) {
            // kept in the verdicts when the step is answered, with the aspect's name; in the journal as it is typed
            recordSoon(pair, () => ({ verdict: null, note: `${only}: ${note.value.trim()}` }));
            return;
        }
        state[pair.key] = {
            ...state[pair.key],
            verdict: box.checked ? 'rejected' : state[pair.key]?.verdict || 'approved',
            note: note.value.trim(),
            at: new Date().toISOString(),
        };
        save();
        recordSoon(pair, () => ({ verdict: box.checked ? 'rejected' : state[pair.key]?.verdict || 'approved', note: note.value.trim() }));
        render();
    });
    note.addEventListener('blur', () => pendingNotes.get(pair.key)?.write());
    li.querySelector('[data-rv-jump]').addEventListener('click', () => {
        stage.querySelector(`[data-rv-pair="${CSS.escape(pair.key)}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    return li;
}

/** The rows of a topic step: under the step's theme, one row per section, in the order of the frames. */
function topicRows(/** @type {Pair[]} */ shown) {
    const head = document.createElement('li');
    head.className = 'rv-list__group';
    head.textContent = LABEL[shown[0]?.theme] || shown[0]?.theme || '';
    return [head, ...shown.map((pair) => rowFor(pair, null, pair.title))];
}

/*
 * The step's integrity (lost-answer-1017: a step showed a section without its row, and a note landed under another
 * section). On every step, and whenever its rows or its sections change: every section shown has exactly one row, with
 * its "Not approved" box, its note and its choice ticks; every row belongs to a section shown. Anything off blocks the
 * step with a banner that names it, and Approve refuses, instead of letting a verdict be filed under the wrong pair.
 */
/** What is off on the step on screen, in words; [] when it holds. */
function checkIntegrity() {
    const step = steps[index];
    if (!dialog.open || !step) return [];
    /** @type {string[]} */
    const problems = [];
    const top = /** @type {HTMLElement[]} */ ([...stage.querySelectorAll('[data-rv-pair]')]).filter(
        (el) => !el.parentElement?.closest('[data-rv-pair]'),
    );
    const rows = /** @type {HTMLElement[]} */ ([...list.querySelectorAll('.rv-row')]);
    const keys = new Set(shownPairs.map((pair) => pair.key));
    for (const pair of shownPairs) {
        const shown = top.filter((el) => el.dataset.rvPair === pair.key).length;
        if (shown !== 1) problems.push(`“${pair.title}” is shown ${shown} times on the left`);
        const own = rows.filter((row) => row.dataset.rvKey === pair.key);
        if (own.length !== 1) {
            problems.push(`“${pair.title}” has ${own.length ? `${own.length} rows` : 'no row'} on the right`);
            continue;
        }
        if (!own[0].querySelector('input[type="checkbox"][data-rv-reject]')) problems.push(`the row of “${pair.title}” has no “Not approved” box`);
        if (!own[0].querySelector('textarea[data-rv-row-note]')) problems.push(`the row of “${pair.title}” has no note`);
        if (step.aspect) continue;
        for (const choice of pair.item?.choices || []) {
            if (fixedFor(pair, choice)) continue;
            const set = own[0].querySelector(`fieldset[data-rv-choice="${CSS.escape(choice.id)}"]`);
            const ticks = set ? set.querySelectorAll('input[type="radio"]').length : 0;
            if (ticks !== choice.options.length)
                problems.push(`the row of “${pair.title}” shows ${ticks} of the ${choice.options.length} ticks of “${choice.label}”`);
        }
    }
    for (const row of rows)
        if (!keys.has(row.dataset.rvKey || ''))
            problems.push(`the row “${row.querySelector('[data-rv-jump]')?.textContent || '?'}” belongs to no section shown`);
    for (const el of top) if (!keys.has(el.dataset.rvPair || '')) problems.push(`a section on the left (${el.dataset.rvPair}) has no row`);
    integrityBox.hidden = !problems.length;
    integrityBox.textContent = problems.length
        ? `Approve is blocked on this step: ${problems.join('; ')}. Close the dialog and tell Claude. Every verdict and note you set so far is kept, also in Saved verdicts on the Agenda.`
        : '';
    approveButton.setAttribute('aria-disabled', String(problems.length > 0));
    return problems;
}
/** Checks again once a frame, whenever the step's rows or sections change. */
let integrityQueued = false;
const integrityWatch = new MutationObserver(() => {
    if (integrityQueued) return;
    integrityQueued = true;
    requestAnimationFrame(() => {
        integrityQueued = false;
        checkIntegrity();
    });
});
integrityWatch.observe(list, { childList: true, subtree: true });
integrityWatch.observe(stage, { childList: true });

function updateApprove() {
    const step = steps[index];
    const rejecting = list.querySelectorAll('[data-rv-reject]:checked').length;
    if (step?.aspect) {
        approveButton.textContent = rejecting ? '↑ None of these, on to the next' : '↑ Pick this one, on to the next';
        return;
    }
    approveButton.textContent = rejecting
        ? `↑ Approve the rest, ${rejecting} not approved`
        : step.topic
          ? `↑ Approve ${LABEL[step.laneTheme] || step.laneTheme} for this topic`
          : step.theme
            ? '↑ Approve this theme'
            : '↑ Approve these blocks';
}

/**
 * Beside a question an update reopened: which update, Kenny's comment from
 * the round before and the session's reply, what it changed or proposes.
 */
function paintUpdate(step) {
    const box = /** @type {HTMLElement} */ ($('[data-rv-update]'));
    const pair = step.pairs[0];
    const asked = step.aspect && pair ? UPDATE?.questions?.[pair.theme]?.[step.aspect] : null;
    const earlier = step.aspect && pair ? state[pair.key]?.earlier?.[step.aspect] : '';
    box.replaceChildren();
    if (!asked && !earlier) return;
    const head = document.createElement('p');
    head.className = 'rv-update__head';
    head.textContent = UPDATE ? `Update ${UPDATE.update} · open again` : 'Open again';
    box.append(head);
    // Kenny's earlier comment is not repeated (2026-10-13): the answer says what changed.
    for (const [label, text] of [['Answer', asked?.reply || 'No answer recorded for this update.']]) {
        const p = document.createElement('p');
        const b = document.createElement('b');
        b.textContent = `${label}: `;
        p.append(b, text);
        box.append(p);
    }
}

async function show(at) {
    if (busy) return;
    flushNotes();
    busy = true;
    try {
        await booted;
        const step = steps[(at + steps.length) % steps.length];
        if (step.theme) await switchTheme(step.theme);
        index = steps.indexOf(step);
        putBack();
        // Only an approved pair leaves the list: a pair Kenny marked not approved stays in it, with its tick and its
        // note, until a new round reopens it (kpadopt-nav, 2026-10-16: "option 2 disappeared from the list when I reopened
        // the page" was the pair he had rejected, dropped because it was no longer 'open').
        shownPairs = stepOpen(step) ? step.pairs.filter((p) => isOpen(p) || verdictOf(p) === 'rejected') : step.pairs;
        if (step.topic) paintTopic(shownPairs);
        for (const pair of step.topic ? [] : shownPairs) {
            if (pair.item) {
                const placeholder = document.createComment('review');
                pair.item.section.replaceWith(placeholder);
                pair.item.section.dataset.rvPair = pair.key;
                moved.push([placeholder, pair.item.section]);
                const tool = mountBlockTools({
                    section: pair.item.section,
                    item: pair.item.id,
                    theme: pair.theme,
                    themeLabel: LABEL[pair.theme] || pair.theme,
                    title: pair.item.title,
                });
                tools.push(tool);
                stage.append(tool.bar, pair.item.section);
            } else {
                stage.append(frameFor(pair));
            }
        }
        stage.scrollTop = 0;
        if (!step.topic) for (const pair of shownPairs) if (pair.item) placeControls(pair.item.section);
        list.replaceChildren(...(step.topic ? topicRows(shownPairs) : shownPairs.map((pair) => rowFor(pair, step.aspect ?? null))));
        paintUpdate(step);
        $('[data-rv-intro]').textContent = step.topic
            ? "One topic, one theme per step: the topic's sections in this theme, then the same topic in the next theme. Everything on the left is approved together. Tick only what is wrong, and say why."
            : step.aspect
              ? 'One option at a time, large, its motion already playing. ←/→ flips, ↑ picks it and goes on, ↓ is None of these. Left hand (AZERTY): Q/S step the state, D the tone, F the next set, Z a live update, R replays, E speed, A tours the states by itself, Space pauses.'
              : 'Everything on the left is approved together. Tick only what is wrong, and say why.';
        $('#rv-keys').textContent = step.topic
            ? 'Up approves this theme for the topic and goes on to the next open theme, Left/Right move between steps, V the previous version and L open and close of the section most in view, Escape closes. The controls of each component stand right above it.'
            : step.aspect
              ? 'Right hand: ←/→ flip · ↑ pick · ↓ none of these. Left hand (AZERTY home row): Q/S state back/on · D tone · F next set · Z live update · R replay · E speed · A tour · Space pause. PageUp/PageDown move between pages · Escape closes.'
              : 'Up approves the step and goes on to the next open one, Left/Right move between steps, V the previous version, L plays open and close, Escape closes. The theme switches by itself.';
        if (!step.topic) for (const pair of shownPairs) if (pair.item) focusAspect(pair.item.section, step.aspect ?? null);
        if (step.aspect) setupFlip(step, shownPairs[0]);
        const judgedHere = step.pairs.filter((p) => verdictOf(p) === 'approved' && !shownPairs.includes(p)).length;
        const shownSections = new Set(shownPairs.map((p) => p.item)).size;
        $('[data-rv-position]').textContent =
            `Step ${index + 1}/${steps.length} · ` +
            (step.topic
                ? `${step.topicAt} of ${step.topicThemes} themes · ${shownSections} section(s)`
                : `${shownPairs.length} ${step.theme ? 'section(s)' : 'block(s)'}`) +
            (judgedHere ? ` · ${judgedHere} already approved, not shown` : '');
        writeFlipPosition();
        $('[data-rv-title]').textContent = step.title;
        const badge = $('[data-rv-state]');
        const rejected = step.pairs.filter((p) => verdictOf(p) === 'rejected').length;
        badge.textContent = stepOpen(step) ? 'Open' : rejected ? `${rejected} not approved` : 'Approved';
        badge.className = `kp-badge${stepOpen(step) ? '' : rejected ? ' kp-badge--destructive' : ' kp-badge--success'}`;
        refused.hidden = true;
        updateApprove();
        if (!dialog.open) dialog.showModal();
        checkIntegrity();
        approveButton.focus({ preventScroll: true });
        // Every page starts at its top, the demo on the left and the rows on the right (Kenny, 2026-10-13: "als ik van
        // één dialog pagina naar de andere ga, scroll dan naar boven en doe hetzelfde voor de items rechts").
        for (const box of [stage, stage.closest('.rv-dialog__view'), dialog.querySelector('.rv-dialog__side')]) if (box) box.scrollTop = 0;
        // A demo can act when its section comes on screen (signature-dialog
        // opens its dialog, so the entrance plays without a click).
        if (!step.topic) for (const pair of shownPairs) pair.item?.section.dispatchEvent(new CustomEvent('review:show', { bubbles: true }));
        // Every pick already on file goes to the demo before the next aspect is
        // shown: the shape picked one step earlier is the shape every later
        // option is drawn in (Kenny, 2026-10-06 18:50). A pick made by flipping
        // never passed through the radio's change handler, so the demo kept
        // drawing its default.
        for (const pair of step.topic ? [] : shownPairs)
            for (const choice of pair.item?.choices || []) {
                const value = choiceOf(pair, choice);
                if (value) pair.item.section.dispatchEvent(new CustomEvent('review:choice', { bubbles: true, detail: { id: choice.id, value } }));
            }
        // The shown option's own motion plays at once: its controls are pressed for the reviewer.
        if (step.aspect) requestAnimationFrame(() => paintFlip(step));
    } finally {
        busy = false;
    }
}

function nextOpenStep(from) {
    for (let step = 1; step <= steps.length; step++) {
        const at = (from + step) % steps.length;
        if (stepOpen(steps[at])) return at;
    }
    return -1;
}

function approveStep() {
    if (busy) return;
    const current = steps[index];
    flushNotes();
    // Nothing is judged on a step whose rows do not match its sections (lost-answer-1017): the banner says what is off.
    const problems = checkIntegrity();
    if (problems.length) return;
    if (current?.aspect) return answerAspect(current);
    /** The row of a pair, found by its own key. */
    const rowOf = (/** @type {Pair} */ pair) => /** @type {HTMLElement} */ (list.querySelector(`.rv-row[data-rv-key="${CSS.escape(pair.key)}"]`));
    // A rejection needs no note (Kenny, 2026-10-06 23:09: "ik wil de eis dat
    // een afkeuring een text heeft ook afschaffen … je moet zelf weten dat je
    // veel beter moet doen"); a note stays welcome.
    const unpicked = shownPairs.filter(
        (pair) =>
            !rowOf(pair).querySelector('[data-rv-reject]').checked &&
            (pair.item?.choices || []).some((c) => !fixedFor(pair, c) && !choiceOf(pair, c)),
    );
    if (unpicked.length) {
        const names = unpicked.flatMap((pair) =>
            pair.item.choices.filter((c) => !fixedFor(pair, c) && !choiceOf(pair, c)).map((c) => `${pair.title}: ${c.label}`),
        );
        refused.textContent = `Pick before approving: ${names.join('; ')}.`;
        refused.hidden = false;
        return;
    }
    const at = new Date().toISOString();
    for (const pair of shownPairs) {
        const row = rowOf(pair);
        const rejected = /** @type {HTMLInputElement} */ (row.querySelector('[data-rv-reject]')).checked;
        const note = /** @type {HTMLTextAreaElement} */ (row.querySelector('[data-rv-row-note]')).value.trim();
        state[pair.key] = { ...state[pair.key], verdict: rejected ? 'rejected' : 'approved', note, at };
        record(pair, { verdict: rejected ? 'rejected' : 'approved', note });
    }
    save();
    render();
    const next = nextOpenStep(index);
    if (next < 0) finished();
    else show(next);
}

/** Records one aspect step: its pick, or "None of these" with a note; the theme's verdict once every aspect is answered. */
function answerAspect(step) {
    const row = list.querySelector('.rv-row');
    const pair = step.pairs[0];
    if (!row || !pair) return;
    const none = /** @type {HTMLInputElement} */ (row.querySelector('[data-rv-reject]')).checked;
    const note = /** @type {HTMLTextAreaElement} */ (row.querySelector('[data-rv-row-note]')).value.trim();
    // The pick comes from the flip stage (flipAt), not a radio here: one option is
    // shown at a time, large, and ←/→ (or the on-screen arrows) choose it.
    const choice = flipChoice || pair.item.choices.find((c) => c.id === step.aspect);
    const value = choice?.options[flipAt]?.value || '';
    if (!none && !value) {
        refused.textContent = `Pick one of the options, or tick None of these.`;
        refused.hidden = false;
        return;
    }
    const entry = { ...state[pair.key] };
    entry.choices = { ...entry.choices };
    entry.redo = { ...entry.redo };
    if (none) {
        entry.redo[step.aspect] = note || 'not approved';
        delete entry.choices[step.aspect];
    } else {
        entry.choices[step.aspect] = value;
        delete entry.redo[step.aspect];
    }
    state[pair.key] = entry;
    const choiceLabel = choice?.options[flipAt]?.label || value;
    record(pair, {
        verdict: null,
        note: none ? note : '',
        choice: { id: step.aspect, value: none ? 'none of these' : value, label: none ? 'None of these' : choiceLabel },
    });
    const themeSteps = steps.filter((s) => s.aspect && s.pairs[0] === pair);
    if (themeSteps.every((s) => aspectDone(pair, s.aspect))) {
        const redo = themeSteps.filter((s) => entry.redo[s.aspect]);
        const label = (id) => pair.item.choices.find((c) => c.id === id)?.label || id;
        state[pair.key] = {
            ...entry,
            verdict: redo.length ? 'rejected' : 'approved',
            note: redo.map((s) => `${label(s.aspect)}: ${entry.redo[s.aspect]}`).join(' · '),
            at: new Date().toISOString(),
        };
        record(pair, { verdict: state[pair.key].verdict, note: state[pair.key].note });
    }
    save();
    render();
    const next = nextOpenStep(index);
    if (next < 0) finished();
    else show(next);
}

dialog.addEventListener('click', (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    if (target.closest('[data-rv-close]')) return dialog.close();
    const go = target.closest('[data-rv-go]');
    if (go) return show(index + Number(go.getAttribute('data-rv-go')));
    const step = steps[index];
    if (target.closest('[data-rv-flip-prev]')) return flip(step, -1);
    if (target.closest('[data-rv-flip-next]')) return flip(step, 1);
    if (target.closest('[data-rv-flip-replay]')) return replay(step);
    if (target.closest('[data-rv-flip-pause]')) return togglePause();
    if (target.closest('[data-rv-flip-speed]')) return cycleSpeed();
    if (target.closest('[data-rv-approve]')) approveStep();
});

// Listened for on the document, not the dialog: when the focused option is
// flipped away its element hides, the focus falls back to <body>, and a key
// from there never reached a listener on the dialog (Kenny, 2026-10-06 18:50:
// a click on the middle hover tile, then the arrows did nothing).
document.addEventListener(
    'keydown',
    (event) => {
        if (!dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
        // Closed here rather than by the browser's own cancel: Chromium dropped
        // the Escape after the dialog had switched the theme a few times.
        if (event.key === 'Escape') {
            // A part the demo opened on stage (a dialog, the palette, a popover, a picker, the tour, an open side
            // navigation, the phone bar) takes its own Escape first (Kenny, 2026-10-13: Escape on the palette closed the
            // review dialog as well); the review dialog closes on the next one.
            const inner = [
                ...document.querySelectorAll(
                    'dialog[open], [popover]:popover-open, .kp-datepicker__panel:not([hidden]), .kp-sidenav[data-kp-sidenav-open="true"], .kp-nav[data-kp-nav-open]',
                ),
            ].some((el) => el !== dialog && dialog.contains(el.closest('[data-review-item]') ?? el) && !el.closest('.cat-bar'));
            if (inner) return;
            event.preventDefault();
            dialog.close();
            return;
        }
        // Inside a note the arrows move the caret. Inside the demo on stage and
        // its mirrored controls they scroll, walk a chart or move a day; there
        // the step keys stay off, so a key meant for the demo never approves or
        // switches the theme [fix-103].
        const from = /** @type {HTMLElement} */ (event.target);
        if (from.matches('textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="button"])')) return;
        // V and L act on the section most in view: its previous version, its open and close on a loop.
        if ((event.code === 'KeyV' || event.code === 'KeyL') && tools.length) {
            const view = stage.closest('.rv-dialog__view')?.getBoundingClientRect();
            const ordered = tools
                .filter((tool) => !tool.bar.hidden)
                .sort((a, b) => (a.bar.compareDocumentPosition(b.bar) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
            const inView = ordered.find((tool) => tool.bar.getBoundingClientRect().bottom > (view?.top ?? 0) + 8) ?? ordered[0];
            if (inView?.key(event.code)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        }
        // On an aspect page every shortcut acts wherever the focus sits: on a tile
        // clicked in the demo, a link, a control or a dialog button (Kenny,
        // 2026-10-06 18:50: "alle shortcuts moeten altijd blijven werken"). The
        // listener runs in the capture phase and keeps the key from the demo, so a
        // focused demo element can neither swallow it nor act on it as well.
        if (steps[index]?.aspect) {
            if (/^(Arrow(Left|Right|Up|Down)|Enter|NumpadEnter|Space|Page(Up|Down)|Key[A-Z])$/.test(event.code)) event.stopPropagation();
        } else if (stage.contains(from)) {
            // Off the aspect pages the demo keeps its own keys [fix-103].
            if (!/^Key[A-Z]$/.test(event.code)) return;
        }
        const step = steps[index];
        // ←/→ flip the option shown on an aspect page; on a page without aspects
        // they still move between steps, as before. Moving between pages always
        // works via PageUp/PageDown now that ←/→ can mean "flip" [form v32].
        if (event.key === 'PageUp' || event.key === 'PageDown') {
            event.preventDefault();
            show(index + (event.key === 'PageDown' ? 1 : -1));
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            if (step?.aspect) flip(step, event.key === 'ArrowRight' ? 1 : -1);
            else show(index + (event.key === 'ArrowRight' ? 1 : -1));
        } else if (event.key === 'ArrowUp' || (event.key === 'Enter' && (step?.aspect || !from.matches('button, a, summary')))) {
            // On an aspect page Enter always picks; elsewhere a focused button or
            // link keeps its own Enter.
            event.preventDefault();
            approveStep();
        } else if (step?.aspect && (event.key === 'ArrowDown' || event.key.toLowerCase() === 'n')) {
            event.preventDefault();
            const box = /** @type {HTMLInputElement} */ (list.querySelector('[data-rv-reject]'));
            if (box && !box.checked) {
                box.checked = true;
                box.dispatchEvent(new Event('change'));
            }
        } else if (step?.aspect) {
            // The left hand on its home row: physical keys (event.code), so they sit
            // under the same fingers on AZERTY (labels Q S D F, A Z E R) and QWERTY.
            const act = {
                KeyA: () => stepGroup(0, -1), // AZERTY Q: the state before
                KeyS: () => stepGroup(0, 1), // S: the next state
                KeyD: () => stepGroup(1, 1), // D: the next tone
                KeyF: () => stepGroup(2, 1), // F: the next value of the third set
                KeyR: () => replay(step), // R: replay
                KeyE: () => cycleSpeed(), // E: speed
                KeyQ: () => toggleTour(), // AZERTY A: tour the states by itself
                KeyW: () => liveUpdate(), // AZERTY Z: a live update (Kenny, 2026-10-06 17:21)
                Space: () => togglePause(), // the thumb: pause
                KeyP: () => togglePause(),
            }[event.code];
            // Space always pauses on an aspect page, also when a button has the
            // focus: the approve button holds the focus after every page change,
            // and Space on it picked and moved on (Kenny, 2026-10-06 17:27).
            if (act) {
                event.preventDefault();
                act();
            }
        }
    },
    true,
);

dialog.addEventListener('close', putBack);
dialog.addEventListener('close', flushNotes);
// A state button pressed on the demo itself counts as the reviewer's own too.
document.addEventListener(
    'click',
    (event) => {
        if (dialog.open && event.isTrusted) keepPress(/** @type {Element} */ (event.target).closest?.('button'));
    },
    true,
);

bar.querySelector('[data-rv-open]').addEventListener('click', () => {
    const first = nextOpenStep(-1);
    show(first < 0 ? 0 : first);
});

window.addEventListener('storage', (event) => {
    if (event.key === STORE) {
        state = load();
        render();
    }
});

render();
// [kit-strip-1018] rv-progress.js: the remaining line and resume (the hook is this one call).
mountProgress({ demo: DEMO, dialog, steps, getIndex: () => index, stepOpen, show, stage, openFirst: () => bar.querySelector('[data-rv-open]').click() });
// From the hub, the dialog opens at the first open step by itself.
if (NEXT && params.get('review') === 'open' && pairs.some(isOpen)) bar.querySelector('[data-rv-open]').click();
