// research/app-hsb-translate: the page's own wiring. The components are the package's (js/auto.js attaches them); this file
// feeds them sample data, presses their states, and does the one thing the service would do: render a profile's template.
// Every section is wired by its own elements, so a lane that holds one section alone works.
//
// MOCK: the template engine below stands in for the service's route that renders a template without delivering anything,
// and the reload outcomes stand in for the service's reload record. Both are new in the service (rows 9 and 11 of the plan).

import { setCode, prettyJson } from '../../js/code.js';
import { jsonField } from '../../js/json-field.js';
import { setProblems } from '../../js/problems.js';
import { setCardState } from '../../js/card-state.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/** @param {string} selector @param {ParentNode} [root] */
const one = (selector, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(selector));
/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);

/** One button of a group is on (state buttons). @param {string} attribute @param {(value: string) => void} apply */
function exclusive(attribute, apply) {
    const buttons = all(`[${attribute}]`);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
    return {
        set(/** @type {string} */ value) {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other.getAttribute(attribute) === value));
        },
    };
}

/** A toggle button. @param {string} attribute @param {(on: boolean) => void} apply */
function toggles(attribute, apply) {
    for (const button of all(`[${attribute}]`)) {
        button.addEventListener('click', () => {
            const on = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', String(on));
            apply(on, button.getAttribute(attribute) ?? '');
        });
    }
}

const pretty = (/** @type {unknown} */ value) => JSON.stringify(value, null, 2);
const bytes = (/** @type {string} */ text) => `${new TextEncoder().encode(text).length} B`;

// ───────────────────────────── the profiles (mock) ─────────────────────────────

const ALERT = (/** @type {string} */ instance, /** @type {string} */ mount, /** @type {string} */ summary, /** @type {boolean} */ full = true) => ({
    status: 'firing',
    labels: {
        alertname: 'DiskAlmostFull',
        instance,
        ...(full ? { severity: 'warning' } : {}),
        job: 'node',
        mountpoint: mount,
    },
    annotations: { summary },
    startsAt: '2026-10-19T06:12:30.000Z',
    endsAt: '0001-01-01T00:00:00.000Z',
    fingerprint: instance === 'ct106:9100' ? '3f9a1c0be2d41a77' : '9be07d52a81c4f30',
});

const alertmanagerMessage = (/** @type {unknown[]} */ alerts) => ({
    receiver: 'switchboard',
    status: 'firing',
    alerts,
    groupLabels: { alertname: 'DiskAlmostFull' },
    commonLabels: { alertname: 'DiskAlmostFull', job: 'node' },
    commonAnnotations: {},
    externalURL: 'http://alertmanager.lan:9093',
    version: '4',
    groupKey: '{}:{alertname="DiskAlmostFull"}',
    truncatedAlerts: 0,
});

const kumaMessage = (/** @type {number} */ status) => ({
    heartbeat: {
        status,
        time: '2026-10-19 08:12:03.000',
        msg: status === 0 ? 'connect ECONNREFUSED 192.168.1.24:8096' : '200 - OK',
        ping: status === 0 ? null : 41,
        duration: 60,
    },
    monitor: { name: 'Jellyfin', type: 'http', url: 'http://jellyfin.lan:8096' },
    msg: status === 0 ? '[Jellyfin] [Down] connect ECONNREFUSED 192.168.1.24:8096' : '[Jellyfin] [Up] 200 - OK',
});

/** What the service raises when a template cannot be rendered. */
class TemplateError extends Error {
    /** @param {string} what @param {string} why @param {string} remedy @param {number} line */
    constructor(what, why, remedy, line) {
        super(what);
        this.why = why;
        this.remedy = remedy;
        this.line = line;
    }
}

/** @type {Record<string, { name: string, mock?: boolean, takes: string, template: string, render: (message: any) => { body: any, notes: { key: string, what: string, why: string }[] } }>} */
const PROFILES = {
    alertmanager: {
        name: 'alertmanager',
        takes: 'POST /alertmanager',
        template: [
            '{',
            '  "alert": {{ alerts.0.labels.alertname | tojson }},',
            '  "status": {{ alerts.0.status | tojson }},',
            '  "severity": {{ alerts.0.labels.severity | default("warning") | tojson }},',
            '  "instance": {{ alerts.0.labels.instance | default("unknown") | tojson }},',
            '  "count": {{ alerts | length }},',
            '  "summary": {{ alerts | map(attribute="annotations.summary") | join("; ") | tojson }}',
            '}',
        ].join('\n'),
        render(message) {
            const alerts = message?.alerts;
            if (!Array.isArray(alerts) || alerts.length === 0) {
                throw new TemplateError(
                    'The template could not be rendered',
                    'Line 2 reads alerts.0, but this message has no alerts, so there is nothing at position 0 to take the alert name from.',
                    'Send a message with at least one alert, or give the template a fallback with default(...) so an empty list still renders.',
                    2,
                );
            }
            const first = alerts[0];
            if (!first.labels) {
                throw new TemplateError(
                    'The template could not be rendered',
                    'Line 2 reads labels.alertname, but the first alert has no labels.',
                    'Check that the sender puts labels on every alert.',
                    2,
                );
            }
            /** @type {{ key: string, what: string, why: string }[]} */
            const notes = [];
            if (first.labels.severity === undefined) {
                notes.push({ key: 'severity', what: 'No severity in the message', why: 'The template filled in "warning" (line 4).' });
            }
            if (first.labels.instance === undefined) {
                notes.push({ key: 'instance', what: 'No instance in the message', why: 'The template filled in "unknown" (line 5).' });
            }
            return {
                body: {
                    alert: first.labels.alertname,
                    status: first.status,
                    severity: first.labels.severity ?? 'warning',
                    instance: first.labels.instance ?? 'unknown',
                    count: alerts.length,
                    summary: alerts
                        .map((/** @type {any} */ a) => a.annotations?.summary)
                        .filter((/** @type {unknown} */ s) => s !== undefined)
                        .join('; '),
                },
                notes,
            };
        },
    },
    'uptime-kuma': {
        name: 'uptime-kuma',
        mock: true,
        takes: 'POST /uptime-kuma',
        template: [
            '{',
            '  "monitor": {{ monitor.name | tojson }},',
            '  "state": {{ ("up" if heartbeat.status == 1 else "down") | tojson }},',
            '  "since": {{ heartbeat.time | tojson }},',
            '  "message": {{ heartbeat.msg | default("no message") | tojson }}',
            '}',
        ].join('\n'),
        render(message) {
            if (!message?.monitor || !message?.heartbeat) {
                throw new TemplateError(
                    'The template could not be rendered',
                    'Line 2 reads monitor.name, but this message has no monitor, so there is nothing to take the name from.',
                    'Send the message Uptime Kuma sends on a status change; it carries both a monitor and a heartbeat.',
                    2,
                );
            }
            /** @type {{ key: string, what: string, why: string }[]} */
            const notes = [];
            if (message.heartbeat.msg === undefined)
                notes.push({ key: 'msg', what: 'No message in the heartbeat', why: 'The template filled in "no message" (line 5).' });
            return {
                body: {
                    monitor: message.monitor.name,
                    state: message.heartbeat.status === 1 ? 'up' : 'down',
                    since: message.heartbeat.time,
                    message: message.heartbeat.msg ?? 'no message',
                },
                notes,
            };
        },
    },
};

/** The sample messages per profile, as text. @param {string} profile @param {string} kind */
function sample(profile, kind) {
    if (kind === 'empty') return '';
    if (profile === 'uptime-kuma') {
        if (kind === 'none') return pretty({ msg: 'Test notification' });
        if (kind === 'partial') {
            const m = kumaMessage(0);
            delete /** @type {any} */ (m.heartbeat).msg;
            return pretty(m);
        }
        const text = pretty(kumaMessage(0));
        return kind === 'broken' ? breakAt(text) : text;
    }
    if (kind === 'none') return pretty(alertmanagerMessage([]));
    if (kind === 'partial') {
        return pretty(alertmanagerMessage([withoutInstance(ALERT('x', '/var/lib/docker', 'Disk /var/lib/docker is 91% full', false))]));
    }
    const text = pretty(
        alertmanagerMessage([
            ALERT('ct106:9100', '/var/lib/docker', 'Disk /var/lib/docker on ct106 is 91% full'),
            ALERT('ct112:9100', '/', 'Disk / on ct112 is 88% full'),
        ]),
    );
    return kind === 'broken' ? breakAt(text) : text;
}

/** @param {any} alert */
function withoutInstance(alert) {
    delete alert.labels.instance;
    return alert;
}

/** A comma that went missing, the way a hand edit loses one: the message is no longer JSON. @param {string} text */
function breakAt(text) {
    const lines = text.split('\n');
    const at = lines.findIndex((line, i) => i > 9 && line.trimEnd().endsWith(',') && !line.includes('{') && !line.includes('['));
    if (at > -1) lines[at] = lines[at].replace(/,\s*$/, '');
    return lines.join('\n');
}

// ───────────────────────────── the diff (the package ships the style, not the lines) ─────────────────────────────

/**
 * A line diff of two texts, indentation ignored when matching so a re-nested line still counts as the same line.
 * @param {string[]} a @param {string[]} b
 */
function lineOps(a, b) {
    const same = (/** @type {number} */ i, /** @type {number} */ j) => a[i].trim() === b[j].trim();
    const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) table[i][j] = same(i, j) ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
    /** @type {{ kind: 'same' | 'removed' | 'added', text: string, a: number, b: number }[]} */
    const ops = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && same(i, j)) {
            ops.push({ kind: 'same', text: b[j], a: i + 1, b: j + 1 });
            i++;
            j++;
        } else if (j < b.length && (i === a.length || table[i][j + 1] >= table[i + 1][j])) {
            ops.push({ kind: 'added', text: b[j], a: i + 1, b: j + 1 });
            j++;
        } else {
            ops.push({ kind: 'removed', text: a[i], a: i + 1, b: j + 1 });
            i++;
        }
    }
    return ops;
}

/**
 * Draw `.kp-diff`: hunks of changed lines with `context` lines around them, or the whole text with `Infinity`.
 * @param {HTMLElement} pre @param {string} before @param {string} after @param {number} context
 */
function drawDiff(pre, before, after, context) {
    const ops = lineOps(before.split('\n'), after.split('\n'));
    const keep = ops.map((op, i) => op.kind !== 'same' || ops.slice(Math.max(0, i - context), i + context + 1).some((o) => o.kind !== 'same'));
    /** @type {typeof ops[]} */
    const hunks = [];
    ops.forEach((op, i) => {
        if (!keep[i]) return;
        if (i === 0 || !keep[i - 1]) hunks.push([]);
        hunks[hunks.length - 1].push(op);
    });
    pre.replaceChildren();
    for (const hunk of hunks) {
        const removed = hunk.filter((o) => o.kind !== 'added');
        const added = hunk.filter((o) => o.kind !== 'removed');
        const header = document.createElement('div');
        header.className = 'kp-diff__hunk';
        header.append(`@@ -${removed[0]?.a ?? 0},${removed.length} +${added[0]?.b ?? 0},${added.length} @@ `);
        const where = document.createElement('span');
        where.className = 'kp-diff__hunk-context';
        where.textContent = 'received → delivered';
        header.append(where);
        pre.append(header);
        for (const op of hunk) {
            const row = document.createElement('span');
            row.className = 'kp-diff__line';
            row.dataset.kind = op.kind;
            const number = document.createElement('span');
            number.className = 'kp-diff__number';
            number.textContent = String(op.kind === 'added' ? op.b : op.a);
            const sign = document.createElement('span');
            sign.className = 'kp-diff__sign';
            sign.textContent = op.kind === 'added' ? '+' : op.kind === 'removed' ? '-' : ' ';
            const text = document.createElement('span');
            text.textContent = op.text;
            row.append(number, sign, text);
            pre.append(row);
        }
    }
    const counts = {
        removed: ops.filter((o) => o.kind === 'removed').length,
        added: ops.filter((o) => o.kind === 'added').length,
    };
    pre.setAttribute(
        'aria-label',
        `Changes from the received message to the delivered body: ${counts.removed} lines removed, ${counts.added} lines added`,
    );
    return counts;
}

// ───────────────────────────── one translation, drawn into whichever parts a section holds ─────────────────────────────

/**
 * @typedef {object} Pieces
 * @property {HTMLElement | null} area the sample box
 * @property {HTMLElement | null} problems
 * @property {HTMLElement | null} code
 * @property {HTMLElement | null} codeCard
 * @property {HTMLElement | null} diff
 * @property {HTMLElement | null} diffCard
 * @property {HTMLElement | null} diffCount
 * @property {HTMLElement | null} template
 */

/** The text of an error as a problem. @param {TemplateError} error @param {() => void} fix */
function problemOf(error, fix) {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'kp-button kp-button--sm';
    action.textContent = 'Use the example message';
    action.addEventListener('click', fix);
    return { key: 'template', severity: /** @type {const} */ ('warning'), what: error.message, why: error.why, remedy: error.remedy, action };
}

// ═════════════════════════════ section: the whole page ═════════════════════════════

/**
 * One working "Try a translation" in `root`: the profile, the sample box, the translated body, the alert and the diff.
 * @param {HTMLElement} root
 */
function tryPage(root) {
    const profileBar = one('[data-hs-profile]', root);
    const area = /** @type {HTMLTextAreaElement | null} */ (one('textarea[data-kp-json]', root));
    const resultCard = one('[data-hs-result]', root);
    const diffCard = one('[data-hs-diffcard]', root);
    const problems = one('[data-kp-problems]', root);
    const code = one('[data-hs-body]', root);
    const template = one('[data-hs-template]', root);
    const diff = one('.kp-diff', root);
    const takes = one('[data-hs-takes]', root);
    const diffCount = one('[data-hs-diffcount]', root);
    if (!area || !resultCard || !diffCard || !problems || !code || !diff) return;
    let profile = 'alertmanager';
    let kind = 'typical';
    let answer = 'ready';
    const field = () => jsonField(area);

    const lookup = () => PROFILES[profile];

    const paintTemplate = () => {
        if (!template) return;
        setCode(template, {
            text: lookup().template,
            title: `Template of ${lookup().name}`,
            language: 'minijinja',
            lines: true,
            wrap: true,
            maxLines: 8,
            state: 'ready',
        });
        if (takes)
            takes.textContent = `Takes ${lookup().takes}${lookup().mock ? ' (mock profile)' : ''} · delivers to Home Assistant (the address is a credential and is never shown)`;
    };

    const empty = (/** @type {HTMLElement} */ card, /** @type {string} */ title, /** @type {string} */ text) => {
        if (card === diffCard) {
            diff.replaceChildren();
            if (diffCount) diffCount.textContent = '';
        }
        setCardState(card, 'empty', { title, text });
    };

    const run = () => {
        if (answer === 'loading') {
            setCardState(resultCard, 'loading', { words: 'Translating…' });
            setCardState(diffCard, 'loading', { words: 'Comparing…' });
            return;
        }
        if (answer === 'unreachable') {
            const note = {
                title: 'The service did not answer',
                text: 'Nothing could be translated and nothing was delivered. Check that HTTPSwitchboard is running, then try again.',
            };
            setCardState(resultCard, 'error', note);
            setCardState(diffCard, 'error', note);
            return;
        }
        const handle = field();
        const state = handle?.state() ?? 'empty';
        if (state === 'empty') {
            setProblems(problems, []);
            empty(resultCard, 'Nothing to translate yet', 'Paste a message into the box, or use one of the examples.');
            empty(diffCard, 'Nothing to compare yet', 'The comparison appears once a message has been translated.');
            return;
        }
        if (state !== 'valid') {
            setProblems(problems, []);
            empty(resultCard, 'The message is not JSON yet', 'Fix the line the box points at; the translation follows by itself.');
            empty(diffCard, 'Nothing to compare', 'The message has to be valid JSON before it can be compared.');
            return;
        }
        const message = handle?.value();
        setCardState(resultCard, 'ready');
        setCardState(diffCard, 'ready');
        try {
            const { body, notes } = lookup().render(message);
            const text = JSON.stringify(body);
            setProblems(
                problems,
                notes.map((n) => ({ key: n.key, severity: /** @type {const} */ ('info'), what: n.what, why: n.why, dismissible: true })),
            );
            setCode(code, {
                text,
                title: 'Translated body',
                language: 'JSON',
                size: bytes(text),
                lines: true,
                wrap: true,
                maxLines: 12,
                state: 'ready',
            });
            const counts = drawDiff(diff, pretty(message), prettyJson(text) ?? text, Infinity);
            if (diffCount) diffCount.textContent = `${counts.removed} lines removed · ${counts.added} lines added`;
        } catch (error) {
            if (!(error instanceof TemplateError)) throw error;
            setProblems(problems, [problemOf(error, () => use('typical'))]);
            setCode(code, { state: 'error', title: 'Translated body', message: 'There is no translated body: the template could not be rendered.' });
            empty(diffCard, 'Nothing to compare', 'No body was produced, so there is nothing to put next to the message.');
            if (diffCount) diffCount.textContent = '';
        }
    };

    /** @param {string} which */
    function use(which) {
        kind = which;
        samples.set(which);
        area.value = sample(profile, which);
        field()?.check();
        run();
    }

    area.addEventListener('kp-json-state', run);
    const samples = exclusive('data-hs-sample', use);
    const answers = exclusive('data-hs-answer', (value) => {
        answer = value;
        run();
    });
    resultCard.addEventListener('kp-card-retry', () => {
        answer = 'ready';
        answers.set('ready');
        run();
    });
    diffCard.addEventListener('kp-card-retry', () => {
        answer = 'ready';
        answers.set('ready');
        run();
    });
    if (profileBar) {
        profileBar.addEventListener('click', (event) => {
            const item = /** @type {HTMLElement | null} */ (/** @type {Element} */ (event.target).closest('[data-value]'));
            if (!item || !(item.getAttribute('data-value') in PROFILES)) return;
            profile = item.getAttribute('data-value') ?? profile;
            paintTemplate();
            use(kind);
        });
    }
    paintTemplate();
    use(kind);
}

// ═════════════════════════════ section: the sample box ═════════════════════════════

function sampleBox(root) {
    const area = /** @type {HTMLTextAreaElement | null} */ (one('textarea[data-kp-json]', root));
    if (!area) return;
    const set = (/** @type {string} */ name, /** @type {string | null} */ value) =>
        value === null ? area.removeAttribute(name) : area.setAttribute(name, value);
    exclusive('data-hs-box-sample', (kind) => {
        area.value = sample('alertmanager', kind);
        // Inform the field: it reads the text again when it is told that the text changed.
        jsonField(area)?.check();
    });
    area.value = sample('alertmanager', 'typical');
    jsonField(area)?.check();
    exclusive('data-hs-box-check', (value) => set('data-kp-json-check', value));
    exclusive('data-hs-box-format', (value) => set('data-kp-json-format', value));
    toggles('data-hs-box-look', (on, which) => {
        if (which === 'gutter') set('data-kp-json-gutter', on ? null : 'false');
        if (which === 'wrap') set('data-kp-json-wrap', on ? 'true' : null);
        if (which === 'indent') set('data-kp-json-indent', on ? '4' : null);
    });
}

// ═════════════════════════════ section: the translated body ═════════════════════════════

function bodyBlock(root) {
    const block = one('[data-hs-codeblock]', root);
    if (!block) return;
    const message = JSON.parse(sample('alertmanager', 'typical'));
    const text = JSON.stringify(PROFILES.alertmanager.render(message).body);
    const options = { state: 'ready', layout: 'pretty', lines: true, wrap: true, fold: false, copy: true };
    const draw = () => {
        /** @type {import('../../js/code.js').CodeSpec} */
        const spec = {
            text,
            title: 'Translated body',
            language: 'JSON',
            size: bytes(text),
            lines: options.lines,
            wrap: options.wrap,
            maxLines: options.fold ? 5 : 0,
            layout: /** @type {'pretty' | 'raw'} */ (options.layout),
            copy: options.copy,
            state: /** @type {any} */ (options.state),
        };
        if (options.state === 'empty') spec.message = 'Nothing has been translated yet.';
        if (options.state === 'error') spec.message = 'The template could not be rendered, so there is no body to show.';
        if (options.state === 'loading') spec.loadingWords = 'Translating…';
        setCode(block, spec);
        const readout = one('[data-hs-code-options]', root);
        if (readout) {
            readout.textContent = `Set: ${options.layout === 'pretty' ? 'pretty' : 'raw'}, ${options.lines ? 'line numbers' : 'no line numbers'}, ${options.wrap ? 'wrapped' : 'not wrapped'}, ${options.fold ? 'folded after 5 lines' : 'not folded'}, ${options.copy ? 'with' : 'without'} Copy button.`;
        }
    };
    exclusive('data-hs-code-state', (value) => {
        options.state = value;
        draw();
    });
    exclusive('data-hs-code-layout', (value) => {
        options.layout = value;
        draw();
    });
    toggles('data-hs-code-show', (on, which) => {
        if (which === 'lines') options.lines = on;
        if (which === 'wrap') options.wrap = on;
        if (which === 'fold') options.fold = on;
        if (which === 'copy') options.copy = on;
        draw();
    });
    draw();
}

// ═════════════════════════════ section: the alert ═════════════════════════════

function problemStage(root) {
    const host = one('[data-hs-problems]', root);
    if (!host) return;
    let which = 'error';
    const paint = () => {
        const action = document.createElement('button');
        action.type = 'button';
        action.className = 'kp-button kp-button--sm';
        action.textContent = 'Use the example message';
        action.addEventListener('click', () => {
            which = 'notes';
            cases.set('notes');
            paint();
        });
        const error = new TemplateError(
            'The template could not be rendered',
            'Line 2 reads alerts.0, but this message has no alerts, so there is nothing at position 0 to take the alert name from.',
            'Send a message with at least one alert, or give the template a fallback with default(...) so an empty list still renders.',
            2,
        );
        const items = [];
        if (which === 'error' || which === 'both')
            items.push({
                key: 'template',
                severity: /** @type {const} */ ('warning'),
                what: error.message,
                why: error.why,
                remedy: error.remedy,
                action,
            });
        if (which === 'notes' || which === 'both') {
            items.push({
                key: 'severity',
                severity: /** @type {const} */ ('info'),
                what: 'No severity in the message',
                why: 'The template filled in "warning" (line 4).',
                dismissible: true,
            });
            items.push({
                key: 'instance',
                severity: /** @type {const} */ ('info'),
                what: 'No instance in the message',
                why: 'The template filled in "unknown" (line 5).',
                dismissible: true,
            });
        }
        if (which === 'both') {
            items.push({
                key: 'summary',
                severity: /** @type {const} */ ('info'),
                what: 'The second alert has no summary',
                why: 'It is left out of the joined summary (line 7).',
                dismissible: true,
            });
        }
        setProblems(host, items);
        const none = one('[data-hs-none]', root);
        if (none) none.hidden = items.length > 0;
    };
    const cases = exclusive('data-hs-problem-case', (value) => {
        which = value;
        paint();
    });
    exclusive('data-hs-problem-mode', (value) => host.setAttribute('data-kp-problems-mode', value));
    paint();
}

// ═════════════════════════════ section: the diff ═════════════════════════════

function diffStage(root) {
    const card = one('[data-hs-diffcard]', root);
    const pre = one('.kp-diff', root);
    const count = one('[data-hs-diffcount]', root);
    if (!card || !pre) return;
    let kind = 'typical';
    let state = 'ready';
    let context = Infinity;
    const paint = () => {
        // The lines are drawn whatever the card shows, so the next state finds them in place (and stale data stays readable).
        const message = JSON.parse(sample('alertmanager', kind));
        const { body } = PROFILES.alertmanager.render(message);
        const counts = drawDiff(pre, pretty(message), pretty(body), context);
        if (count) count.textContent = `${counts.removed} lines removed · ${counts.added} lines added`;
        if (state === 'loading') return setCardState(card, 'loading', { words: 'Comparing…' });
        if (state === 'empty')
            return setCardState(card, 'empty', { title: 'Nothing to compare yet', text: 'Translate a message first; the comparison appears here.' });
        if (state === 'error') {
            return setCardState(card, 'error', {
                title: 'The service did not answer',
                text: 'The comparison needs a translation and nothing could be translated. Try again.',
            });
        }
        setCardState(card, 'ready');
    };
    exclusive('data-hs-diff-state', (value) => {
        state = value;
        paint();
    });
    exclusive('data-hs-diff-sample', (value) => {
        kind = value;
        paint();
    });
    exclusive('data-hs-diff-context', (value) => {
        context = value === 'all' ? Infinity : Number(value);
        paint();
    });
    card.addEventListener('kp-card-retry', () => {
        state = 'ready';
        all('[data-hs-diff-state]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-diff-state') === 'ready')));
        paint();
    });
    paint();
}

// ═════════════════════════════ section: the reload history ═════════════════════════════

/** @typedef {{ id: number, at: string, when: string, outcome: 'applied' | 'restart' | 'invalid', headline: string, detail: string }} Reload */

/** @type {Reload[]} */
const RELOADS = [
    {
        id: 8,
        at: '2026-10-19T08:47',
        when: '19/10/2026 08:47',
        outcome: 'invalid',
        headline: 'Refused: the profile file is not valid',
        detail: 'Line 14, column 5: the template of alertmanager has an unclosed quote. Nothing changed; the version of 19/10/2026 08:41 keeps running.',
    },
    {
        id: 7,
        at: '2026-10-19T08:41',
        when: '19/10/2026 08:41',
        outcome: 'applied',
        headline: 'Changed: alertmanager',
        detail: 'Its template and its retry limit. The next message already uses them.',
    },
    {
        id: 6,
        at: '2026-10-18T21:03',
        when: '18/10/2026 21:03',
        outcome: 'restart',
        headline: 'Nothing changed',
        detail: 'A new profile, uptime-kuma (mock), was added. Adding a profile needs a restart of the service.',
    },
    {
        id: 5,
        at: '2026-10-17T22:15',
        when: '17/10/2026 22:15',
        outcome: 'applied',
        headline: 'Changed: alertmanager',
        detail: 'Its delivery timeout, from 5 s to 10 s.',
    },
    {
        id: 4,
        at: '2026-10-16T02:46',
        when: '16/10/2026 02:46',
        outcome: 'applied',
        headline: 'No profile changed',
        detail: 'The file was read again and holds the same profiles as before.',
    },
    {
        id: 3,
        at: '2026-10-12T19:30',
        when: '12/10/2026 19:30',
        outcome: 'invalid',
        headline: 'Refused: the profile file ended too soon',
        detail: 'Line 22: the profile alertmanager is not closed. The file was probably still being saved. Nothing changed.',
    },
    {
        id: 2,
        at: '2026-10-10T07:58',
        when: '10/10/2026 07:58',
        outcome: 'restart',
        headline: 'Nothing changed',
        detail: 'The hub section changed. A different hub address needs a restart of the service.',
    },
    {
        id: 1,
        at: '2026-10-05T20:12',
        when: '05/10/2026 20:12',
        outcome: 'applied',
        headline: 'Changed: alertmanager',
        detail: 'Its lease, from 30 s to 45 s.',
    },
];

const OUTCOME = {
    applied: { badge: 'kp-badge kp-badge--success', word: 'Applied' },
    restart: { badge: 'kp-badge kp-badge--warning', word: 'Needs a restart' },
    invalid: { badge: 'kp-badge kp-badge--destructive', word: 'Invalid' },
};

/** The reloads that arrive while the page is open (mock). */
const ARRIVALS = {
    applied: [
        { outcome: 'applied', headline: 'Changed: uptime-kuma (mock)', detail: 'Its template. The next message already uses it.' },
        { outcome: 'applied', headline: 'Changed: alertmanager, uptime-kuma (mock)', detail: 'Their delivery timeouts, from 10 s to 15 s.' },
        { outcome: 'applied', headline: 'Changed: alertmanager', detail: 'Its retry limit, from 3 to 5.' },
    ],
    restart: [
        { outcome: 'restart', headline: 'Nothing changed', detail: 'A profile was renamed. Renaming a profile needs a restart of the service.' },
        {
            outcome: 'restart',
            headline: 'Nothing changed',
            detail: 'A new source was added to alertmanager. A new source needs a restart of the service.',
        },
    ],
    invalid: [
        {
            outcome: 'invalid',
            headline: 'Refused: the profile file is not valid',
            detail: 'Line 9, column 1: a profile has no destination. Nothing changed.',
        },
        {
            outcome: 'invalid',
            headline: 'Refused: the profile file is not valid',
            detail: 'Line 31, column 12: the timeout "10 secs" is not a duration. Nothing changed.',
        },
    ],
};

/** @param {HTMLElement} root */
function history(root) {
    const card = one('[data-hs-history]', root);
    const list = /** @type {HTMLElement | null} */ (one('.kp-timeline', root));
    const alert = one('[data-kp-problems]', root);
    const counts = one('[data-hs-counts]', root);
    if (!card || !list || !alert) return;
    const model = RELOADS.map((r) => ({ ...r }));
    let nextId = 9;
    let minute = 52;
    const served = { applied: 0, restart: 0, invalid: 0 };

    /** @param {Reload} r */
    const row = (r) => {
        const li = document.createElement('li');
        li.className = 'kp-timeline__item';
        li.dataset.hsReload = String(r.id);
        li.dataset.hsOutcome = r.outcome;
        const marker = document.createElement('span');
        marker.className = 'kp-timeline__marker';
        marker.setAttribute('aria-hidden', 'true');
        const body = document.createElement('span');
        body.className = 'hs-reload';
        const time = document.createElement('time');
        time.className = 'kp-timeline__when';
        time.dateTime = r.at;
        time.textContent = r.when;
        const outcome = document.createElement('span');
        outcome.className = 'hs-reload__outcome';
        const badge = document.createElement('span');
        badge.className = OUTCOME[r.outcome].badge;
        badge.textContent = OUTCOME[r.outcome].word;
        outcome.append(badge);
        const what = document.createElement('span');
        what.className = 'hs-reload__what';
        const head = document.createElement('span');
        head.textContent = r.headline;
        const detail = document.createElement('span');
        detail.textContent = r.detail;
        what.append(head, detail);
        body.append(time, outcome, what);
        li.append(marker, body);
        return li;
    };

    const paintAlert = () => {
        const latest = model[0];
        if (latest?.outcome !== 'invalid') return setProblems(alert, []);
        setProblems(alert, [
            {
                key: 'reload-invalid',
                severity: 'warning',
                what: `The latest reload (${latest.when}) was refused`,
                why: `${latest.detail.replace(/ Nothing changed.*$/, '')} The service keeps running on the last good version, so nothing is lost.`,
                remedy: 'Correct the profile file, then reload again.',
                command: 'systemctl reload http-switchboard',
            },
        ]);
    };

    const paintCounts = () => {
        if (!counts) return;
        const n = (/** @type {string} */ o) => model.filter((r) => r.outcome === o).length;
        counts.textContent = `${model.length} reloads · ${n('applied')} applied · ${n('restart')} need a restart · ${n('invalid')} invalid`;
    };

    const first = () => {
        list.replaceChildren(...model.map(row));
        paintAlert();
        paintCounts();
    };

    /** @param {'applied' | 'restart' | 'invalid'} kind */
    const arrive = (kind) => {
        const pool = ARRIVALS[kind];
        const pick = pool[served[kind]++ % pool.length];
        const at = `2026-10-19T09:${String(minute).padStart(2, '0')}`;
        const when = `19/10/2026 09:${String(minute).padStart(2, '0')}`;
        minute += 3;
        const reload = { id: nextId++, at, when, ...pick };
        model.unshift(reload);
        list.prepend(row(reload));
        paintAlert();
        paintCounts();
    };

    first();
    for (const button of all('[data-hs-arrive]'))
        button.addEventListener('click', () => arrive(/** @type {any} */ (button.getAttribute('data-hs-arrive'))));
    for (const button of all('[data-hs-older]')) {
        button.addEventListener('click', () => {
            list.scrollTop = list.scrollHeight;
        });
    }
    exclusive('data-hs-history-state', (value) => {
        if (value === 'loading') setCardState(card, 'loading', { words: 'Reading the reload history…' });
        else if (value === 'empty')
            setCardState(card, 'empty', { title: 'No reloads yet', text: 'The profile file has not been read again since the service started.' });
        else if (value === 'error')
            setCardState(card, 'error', { title: 'The reload history could not be read', text: 'The service did not answer. Nothing was changed.' });
        else setCardState(card, 'ready');
    });
    card.addEventListener('kp-card-retry', () => {
        all('[data-hs-history-state]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-history-state') === 'ready')));
        setCardState(card, 'ready');
    });
}

await ready;
for (const root of all('[data-hs-try]')) tryPage(root);
for (const root of all('[data-hs-box]')) sampleBox(root);
for (const root of all('[data-hs-codestage]')) bodyBlock(root);
for (const root of all('[data-hs-problemstage]')) problemStage(root);
for (const root of all('[data-hs-diffstage]')) diffStage(root);
for (const root of all('[data-hs-historystage]')) history(root);
