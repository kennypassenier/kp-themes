// research/kyu-11-overview: the page's own wiring. Every component is the package's (js/auto.js attaches most of them);
// this file feeds them kyu-shaped MOCK data, presses their states and writes what they fire into a readout.

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

/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
/** @param {string} selector @param {ParentNode} [root] @returns {HTMLElement[]} */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);

/** Press one button of a group: exactly one is pressed. */
function stateButtons(attribute, apply) {
    const buttons = all(`[${attribute}]`);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            pressed(attribute, button.getAttribute(attribute) ?? '');
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}
/** Mark the pressed one of a group. */
function pressed(attribute, value) {
    for (const b of all(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}
/** What the review dialog sets for a choice (id, value), as the section hears it. */
function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await ready;

// ── 1 · command palette ─────────────────────────────────────────────────────────────────────────────────────────
if (byId('ky-pal-stage')) {
    const { attachPalettes, palette } = await import('../../js/palette.js');
    const stage = byId('ky-pal-stage');
    const log = byId('ky-pal-log');
    const opts = { match: 'intent', highlight: 'on', typo: '0', nomatch: 'plate' };
    let query = '';
    let state = 'ready';
    /** @type {number} */
    let retryTimer = 0;

    const say = (value) => {
        if (value === 'publish') return 'Publish a test message: kyu would focus the publish box of notify.kenny.';
        if (value === 'prune') return 'Prune dead letters: kyu would ask you to type the name notify.kenny first, then delete its 1 dead letter.';
        if (value === 'start-topic') return 'Start a topic: kyu would show the curl that creates one.';
        if (value === 'new-app') return 'Create an app token: kyu would open the apps page.';
        if (value.startsWith('topic-')) return `Go to topic ${value.slice(6)}: kyu would open its page.`;
        if (value.startsWith('sub-')) return `Go to subscription ${value.slice(4)}: kyu would open its backlog.`;
        return value;
    };

    function dialog() {
        return /** @type {HTMLDialogElement} */ (byId('ky-pal'));
    }

    function readFirst() {
        setTimeout(() => {
            const first = dialog().querySelector('[data-kp-option][aria-selected="true"], [data-kp-option].is-active');
            const text = first ? first.childNodes[0]?.textContent?.trim() : '';
            log.textContent = text ? `Mock: Enter would run "${text}". ${say(first?.getAttribute('data-value') ?? '')}` : 'Mock: nothing to run for this query.';
        }, 60);
    }

    function wire(el) {
        el.addEventListener('kp-palette-run', (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            log.textContent = `Mock: ${say(String(detail.value))}`;
        });
        el.addEventListener('kp-palette-retry', () => {
            setState('loading');
            clearTimeout(retryTimer);
            retryTimer = window.setTimeout(() => setState('ready'), 1400);
        });
        el.addEventListener('input', readFirst);
        // Shown open in place: when the modal use closes (Esc), the sample comes back.
        el.addEventListener('close', () => {
            if (!el.open) el.show();
        });
    }

    function setState(next) {
        state = next;
        palette(dialog())?.setState(next === 'error' ? 'error' : next, next === 'error' ? { message: 'The topics could not be read from kyu.' } : undefined);
        pressed('data-ky-pal-state', next);
    }

    function type(q) {
        query = q;
        const input = /** @type {HTMLInputElement} */ (dialog().querySelector('.kp-palette__input'));
        input.value = q;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        readFirst();
    }

    function mount() {
        const old = dialog();
        const template = document.createElement('template');
        template.innerHTML = /** @type {any} */ (window).__kyPalette;
        const fresh = /** @type {HTMLDialogElement} */ (template.content.firstElementChild);
        if (opts.match !== 'intent') fresh.setAttribute('data-kp-match', opts.match);
        fresh.setAttribute('data-kp-highlight', opts.highlight);
        fresh.setAttribute('data-kp-typo', opts.typo);
        if (opts.nomatch === 'plate') fresh.setAttribute('data-kp-nomatch', 'plate');
        else fresh.removeAttribute('data-kp-nomatch');
        old.replaceWith(fresh);
        attachPalettes(stage);
        wire(fresh);
        if (query) type(query);
        if (state !== 'ready') setState(state);
    }

    wire(dialog());
    stateButtons('data-ky-pal-state', setState);
    for (const b of all('[data-ky-query]')) b.addEventListener('click', () => type(b.getAttribute('data-ky-query') ?? ''));

    const openModal = () => {
        const el = dialog();
        const input = /** @type {HTMLInputElement} */ (el.querySelector('.kp-palette__input'));
        const q = input.value;
        el.close();
        palette(el)?.open(q);
    };
    byId('ky-pal-modal').addEventListener('click', openModal);
    window.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            openModal();
        }
    });

    onChoice('palette-match', (v) => ((opts.match = v), mount()));
    onChoice('palette-highlight', (v) => ((opts.highlight = v), mount()));
    onChoice('palette-typo', (v) => ((opts.typo = v), mount()));
    onChoice('palette-nomatch', (v) => ((opts.nomatch = v), mount()));
}

// ── 2 · keys, the hint line and the sheet ───────────────────────────────────────────────────────────────────────
if (byId('ky-keys-stage')) {
    const { registerShortcuts, configureShortcuts, renderShortcutSheet } = await import('../../js/shortcuts.js');
    const log = byId('ky-keys-log');
    const list = byId('ky-subs');
    const sheet = byId('ky-sheet');
    const say = (text) => (log.textContent = `Mock: ${text}`);
    configureShortcuts({ unknownHint: true });

    registerShortcuts('page', [
        { keys: 'g t', what: 'Go to topics', group: 'Anywhere', run: () => say('g t: kyu would open the Topics page.') },
        { keys: 'g a', what: 'Go to apps', group: 'Anywhere', run: () => say('g a: kyu would open the Apps page.') },
        {
            keys: '/',
            what: 'Search topics and apps',
            group: 'Anywhere',
            run: () => {
                byId('ky-search').focus();
                say('/: the search field has focus.');
            },
        },
        {
            keys: 'p',
            what: 'Publish a test message',
            group: 'Anywhere',
            run: () => {
                byId('ky-publish').focus();
                say('p: the publish box has focus.');
            },
        },
    ]);

    const rows = () => all('li', list);
    const move = (by) => {
        const items = rows();
        const at = Math.max(0, items.findIndex((li) => li === document.activeElement));
        const next = items[Math.min(items.length - 1, Math.max(0, at + by))];
        for (const li of items) li.tabIndex = li === next ? 0 : -1;
        next.focus();
    };
    const selected = () => rows().filter((li) => li.getAttribute('aria-selected') === 'true');
    registerShortcuts(
        list,
        [
            { keys: 'j', what: 'Next subscription', group: 'Subscriptions', run: () => move(1) },
            { keys: 'k', what: 'Previous subscription', group: 'Subscriptions', run: () => move(-1) },
            {
                keys: 'x',
                what: 'Select the subscription',
                group: 'Subscriptions',
                run: () => {
                    const li = /** @type {HTMLElement} */ (document.activeElement?.closest('li') ?? rows()[0]);
                    li.setAttribute('aria-selected', String(li.getAttribute('aria-selected') !== 'true'));
                    renderShortcutSheet(sheet);
                },
            },
            {
                keys: 'Shift R',
                what: 'Requeue the dead letters of the selected subscription',
                group: 'Subscriptions',
                when: () => selected().length > 0,
                reason: 'Select a subscription first (x)',
                run: () => say(`Shift R: kyu would requeue the dead letters of ${selected().map((li) => li.dataset.kySub).join(', ')}.`),
            },
        ],
        { dev: false },
    );
    list.addEventListener('click', (event) => {
        const li = /** @type {HTMLElement} */ (event.target).closest('li');
        if (li) {
            for (const other of rows()) other.tabIndex = other === li ? 0 : -1;
            li.focus();
        }
    });

    const press = async (keys) => {
        for (const key of keys.split(' ')) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
            document.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
            await wait(140);
        }
    };
    for (const b of all('[data-ky-press]')) b.addEventListener('click', () => void press(b.getAttribute('data-ky-press') ?? ''));
    stateButtons('data-ky-sheet', (value) => {
        if (value === 'none') sheet.setAttribute('data-kp-shortcuts-scope', 'nothing');
        else sheet.removeAttribute('data-kp-shortcuts-scope');
        renderShortcutSheet(sheet);
    });

    onChoice('keys-cap', (v) => document.documentElement.setAttribute('data-kp-shortcuts-hint', v));
    onChoice('keys-unknown', (v) => configureShortcuts({ unknownHint: v === 'say' }));
    onChoice('keys-line', (v) => byId('ky-keys-line').classList.toggle('kp-keys--end', v === 'end'));
}

// ── 3 · first-visit tour ────────────────────────────────────────────────────────────────────────────────────────
if (byId('ky-tour-stage')) {
    const { startTour, shouldStartTour, forgetTour, tourRemembered } = await import('../../js/tour.js');
    const NAME = 'kyu-topic-page';
    const out = byId('ky-tour-out');
    const help = /** @type {HTMLDialogElement} */ (byId('ky-help-drawer'));
    const steps = [
        { target: '[data-ky-step="snippets"]', title: 'Your commands', text: 'Four commands, one for each step: publish, receive, acknowledge, check. The secret is masked; Reveal shows it for ten seconds and Copy never shows it.' },
        { target: '[data-ky-step="subs"]', title: 'Subscriptions', text: 'Each app that reads this topic has its own place in line. Flagged means a message died or a lease ran out.' },
        { target: '[data-ky-step="dead"]', title: 'Dead letters', text: 'A message nobody could deliver. Requeue puts it back in line; Delete removes it after you type the name.' },
        { target: '[data-ky-step="publish"]', title: 'Publish a test message', text: 'Type JSON: it is checked as you type, with the line and column of a mistake. Ctrl+Enter publishes.' },
        { target: '[data-ky-step="help"]', title: 'Help', text: 'This tour again, and every key. Adding ?tour to the address starts it too.' },
    ];
    /** @type {{ end: () => void } | null} */
    let handle = null;

    const sayTour = (first) => {
        const remembered = tourRemembered(NAME);
        const auto = shouldStartTour({ search: location.search, remembered, automated: false });
        out.textContent = `${first} Taken before: ${remembered ? 'yes' : 'no'}. On a visit like this one it would start by itself: ${auto === null ? 'no, it was taken before' : 'yes'}.`;
    };
    const run = (start = 0, returnFocus) => {
        handle = startTour(steps, {
            start,
            remember: NAME,
            returnFocus: returnFocus ?? null,
            onEnd: (finished) => {
                handle = null;
                sayTour(finished ? 'The tour ran to the end (5 steps).' : 'The tour was ended early.');
            },
        });
        if (handle) sayTour(`The tour is running (mock).`);
        return handle;
    };
    const visit = (value) => {
        if (value === 'first') {
            handle?.end();
            forgetTour(NAME);
            run(1);
        } else if (value === 'again') {
            if (handle) handle.end();
            else startTour(steps, { remember: NAME })?.end();
            sayTour('A returning visit: the tour does not start.');
        } else {
            handle?.end();
            run(0);
        }
    };
    stateButtons('data-ky-visit', visit);

    const openHelp = (button) => {
        help.showModal();
        help.addEventListener('close', () => button.focus(), { once: true });
    };
    byId('ky-help').addEventListener('click', () => openHelp(byId('ky-help')));
    byId('ky-help-open').addEventListener('click', () => openHelp(byId('ky-help-open')));
    for (const b of all('[data-ky-help-close]')) b.addEventListener('click', () => help.close());
    document.querySelector('[data-ky-help-tour]')?.addEventListener('click', () => {
        help.close();
        run(0, byId('ky-help'));
        pressed('data-ky-visit', 'asked');
    });

    // The drawer as it stands when open: a copy of Help, inert, without ids.
    const copy = byId('ky-help-copy');
    copy.innerHTML = help.innerHTML;
    for (const el of all('[id]', copy)) el.removeAttribute('id');
    for (const el of all('[data-ky-help-tour], [data-ky-help-close]', copy)) {
        el.removeAttribute('data-ky-help-tour');
        el.removeAttribute('data-ky-help-close');
    }

    // The first visit, as kyu would start it: shown running at step 2 of 5, so Back is visible too.
    forgetTour(NAME);
    sayTour('Not started yet.');
    if (new URLSearchParams(location.search).has('tour')) {
        run(0);
        pressed('data-ky-visit', 'asked');
    } else visit('first');
}

// ── 4 · anchors on headings ─────────────────────────────────────────────────────────────────────────────────────
{
    const { refreshAnchors } = await import('../../js/anchors.js');
    for (const button of all('[data-ky-go]')) {
        button.addEventListener('click', () => {
            // From no address to the link, so the same link can be opened again.
            history.replaceState(null, '', `${location.pathname}${location.search}`);
            location.hash = button.getAttribute('data-ky-go') ?? '';
        });
    }
    const say = (id) => (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        byId(id).textContent = `Mock: copied ${JSON.stringify(d.text)} for #${d.id}.`;
    };
    const doc = document.getElementById('ky-head-doc');
    doc?.addEventListener('kp-anchor-copy', say('ky-head-log'));
    document.getElementById('ky-dead')?.addEventListener('kp-anchor-copy', say('ky-dead-log'));
    const set = (name) => (value) => {
        if (!doc) return;
        doc.setAttribute(name, value);
        refreshAnchors(doc);
    };
    onChoice('anchor-position', set('data-kp-anchor-position'));
    onChoice('anchor-show', set('data-kp-anchor-show'));
    onChoice('anchor-copy', set('data-kp-anchor-copy'));
    onChoice('anchor-target', set('data-kp-anchor-target'));
}

// ── 5 · anchors on dead-letter rows ─────────────────────────────────────────────────────────────────────────────
if (byId('ky-dead-stage')) {
    const { dataTable } = await import('../../js/datatable.js');
    const { refreshAnchors } = await import('../../js/anchors.js');
    const DEAD = [
        { id: '3b71', sub: 'notify.kenny / desktop', why: 'Refused three times: the payload has no "text"', died: '28/09/2026 19:32' },
        { id: '9c1e', sub: 'ha.events / kyu-runner', why: 'Lease expired five times', died: '17/10/2026 11:20' },
        { id: 'b7d0', sub: 'almanac.sync / almanac', why: 'Consumer timed out', died: '16/10/2026 22:41' },
        { id: 'e358', sub: 'jobtracker.mail / desktop', why: 'Consumer refused: quota exceeded for this subscription', died: '16/10/2026 09:03' },
    ];
    let requeued = false;
    let rowsState = 'ready';
    const table = byId('ky-dead');
    const body = byId('ky-dead-body');
    const wrap = byId('ky-dead-dt');
    const handle = () => dataTable(wrap);

    function render() {
        const rows = rowsState === 'empty' ? [] : DEAD.filter((r) => !(requeued && r.id === '3b71'));
        body.replaceChildren(
            ...rows.map((r) => {
                const tr = document.createElement('tr');
                tr.setAttribute('data-kp-anchor', `dead-${r.id}`);
                tr.setAttribute('data-kp-anchor-label', `Dead letter ${r.id}`);
                tr.innerHTML = `<th scope="row">${r.id}</th><td>${r.sub}</td><td>${r.why}</td><td>${r.died}</td>`;
                return tr;
            }),
        );
        byId('ky-dead-count').textContent = `${rows.length} dead letter${rows.length === 1 ? '' : 's'} across 5 topics (mock data). notify.kenny holds 142 messages.`;
        handle()?.refresh();
        refreshAnchors(table);
    }
    stateButtons('data-ky-rows', (value) => {
        rowsState = value;
        if (value === 'loading') handle()?.state('loading');
        else if (value === 'failed') handle()?.state('failed');
        else {
            handle()?.state('ready');
            render();
        }
    });
    byId('ky-requeue').addEventListener('click', () => {
        requeued = true;
        if (rowsState !== 'ready') {
            rowsState = 'ready';
            pressed('data-ky-rows', 'ready');
            handle()?.state('ready');
        }
        render();
    });
    byId('ky-reset').addEventListener('click', () => {
        requeued = false;
        rowsState = 'ready';
        pressed('data-ky-rows', 'ready');
        handle()?.state('ready');
        render();
    });
    wrap.addEventListener('kp-datatable-retry', () => {
        handle()?.state('loading');
        pressed('data-ky-rows', 'loading');
        setTimeout(() => {
            rowsState = 'ready';
            handle()?.state('ready');
            pressed('data-ky-rows', 'ready');
            render();
        }, 1400);
    });
    render();
}

// ── 6 · who reads what: the line diagram ────────────────────────────────────────────────────────────────────────
if (byId('ky-uses')) {
    const { setMatrix } = await import('../../js/heat.js');
    const el = byId('ky-uses');
    const topics = [
        { key: 'notify.kenny', label: 'notify.kenny', sub: '142 messages', href: '#topic-notify-kenny' },
        { key: 'ha.events', label: 'ha.events', sub: '8 messages', href: '#topic-ha-events' },
        { key: 'almanac.sync', label: 'almanac.sync', sub: '23 messages', href: '#topic-almanac-sync' },
        { key: 'jobtracker.mail', label: 'jobtracker.mail', sub: '57 messages', href: '#topic-jobtracker-mail' },
        { key: 'newsflash.items', label: 'newsflash.items', sub: '0 messages', href: '#topic-newsflash-items' },
    ];
    const apps = ['desktop', 'phone', 'kyu-runner', 'almanac', 'archive'].map((name) => ({ key: name, label: name, href: `#app-${name}` }));
    const edges = {
        'notify.kenny|desktop': { tone: 'bad', label: 'flagged: 1 dead letter' },
        'notify.kenny|phone': { tone: 'ok', label: 'active' },
        'ha.events|kyu-runner': { tone: 'bad', label: 'flagged: 1 dead letter' },
        'ha.events|archive': { tone: 'muted', label: 'archived' },
        'almanac.sync|almanac': { tone: 'bad', label: 'flagged: 1 dead letter' },
        'almanac.sync|archive': { tone: 'muted', label: 'archived' },
        'jobtracker.mail|desktop': { tone: 'bad', label: 'flagged: 1 dead letter' },
        'jobtracker.mail|archive': { tone: 'muted', label: 'archived' },
        'newsflash.items|phone': { tone: 'warn', label: 'flagged: lease expired' },
        'newsflash.items|archive': { tone: 'muted', label: 'archived' },
    };
    const spec = {
        corner: 'Topic ↓ app →',
        rows: topics,
        columns: apps,
        cell: (row, column) => /** @type {any} */ (edges)[`${row}|${column}`] ?? null,
        countLabel: (n) => `${n} ${n === 1 ? 'subscription' : 'subscriptions'}`,
        sourcesLabel: 'Topics',
        usersLabel: 'Apps',
    };
    let view = 'lines';
    let state = 'ready';
    /** @type {number} */
    let timer = 0;
    const draw = () => {
        clearTimeout(timer);
        if (state === 'ready') setMatrix(el, { ...spec, view });
        else if (state === 'loading') setMatrix(el, { ...spec, view: 'lines', state: 'loading', skeleton: 5 });
        else if (state === 'empty') setMatrix(el, { view: 'lines', rows: [], columns: [], state: 'empty', message: 'No topic has a subscription yet' });
        else setMatrix(el, { view: 'lines', rows: [], columns: [], state: 'error', message: 'The subscriptions could not be read from kyu' });
        pressed('data-ky-uses-view', view);
        pressed('data-ky-uses-state', state);
    };
    draw();
    stateButtons('data-ky-uses-view', (v) => {
        view = v === 'grid' ? 'grid' : 'lines';
        state = 'ready';
        draw();
    });
    stateButtons('data-ky-uses-state', (v) => {
        state = v;
        draw();
    });
    el.addEventListener('kp-uses-retry', () => {
        state = 'loading';
        draw();
        timer = window.setTimeout(() => {
            state = 'ready';
            draw();
        }, 1400);
    });
    const attr = (name) => (value) => {
        el.setAttribute(name, value);
        draw();
    };
    onChoice('uses-shape', attr('data-kp-lines-shape'));
    onChoice('uses-side', attr('data-kp-lines-side'));
    onChoice('uses-light', attr('data-kp-lines-light'));
    onChoice('uses-count', attr('data-kp-lines-count'));
    const log = byId('ky-uses-log');
    el.addEventListener('kp-uses-pin', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        log.textContent = `Mock: ${d.pinned ? 'pinned' : 'let go of'} ${d.key} (${d.side}); related: ${d.related.join(', ') || 'none'}.`;
    });
}

// ── 7 · who reads what: hub and ring ────────────────────────────────────────────────────────────────────────────
if (byId('ky-graph')) {
    const { setGraphData, setGraphState, GRAPH_CHANGE_EVENT } = await import('../../js/graph.js');
    const el = byId('ky-graph');
    const stage = byId('ky-graph-stage');
    const out = byId('ky-graph-out');
    const KINDS = [
        { kind: 'active', label: 'Active', hint: 'The app is reading and acknowledging', style: 'solid', colour: 'var(--chart-1)' },
        { kind: 'flagged', label: 'Flagged', hint: 'A message died or a lease ran out on this subscription', style: 'dash', colour: 'var(--destructive)' },
        { kind: 'archived', label: 'Archived', hint: 'No longer reading; kept for its backlog', style: 'dot', colour: 'var(--muted-foreground)' },
    ];
    /** [topic, app, kind, waiting messages, note] */
    const SUBS = [
        ['notify.kenny', 'desktop', 'flagged', 142, '1 dead letter'],
        ['notify.kenny', 'phone', 'active', 12, 'caught up'],
        ['ha.events', 'kyu-runner', 'flagged', 8, '1 dead letter'],
        ['ha.events', 'archive', 'archived', 0, 'archived'],
        ['almanac.sync', 'almanac', 'flagged', 23, '1 dead letter'],
        ['almanac.sync', 'archive', 'archived', 0, 'archived'],
        ['jobtracker.mail', 'desktop', 'flagged', 57, '1 dead letter'],
        ['jobtracker.mail', 'archive', 'archived', 0, 'archived'],
        ['newsflash.items', 'phone', 'flagged', 3, 'lease expired'],
        ['newsflash.items', 'archive', 'archived', 0, 'archived'],
    ];
    let weights = false;
    let live = false;
    let state = 'ready';
    const data = () => {
        const subs = SUBS.map(([topic, app, kind, waiting, note]) => {
            const flip = live && topic === 'notify.kenny' && app === 'phone';
            return { topic, app, kind: flip ? 'flagged' : kind, waiting: flip ? 96 : waiting, note: flip ? 'lease expired' : note };
        });
        return {
            hub: 'kyu',
            kinds: KINDS,
            nodes: [
                { id: 'kyu', label: 'kyu', description: 'the message hub', weight: weights ? 1 : null },
                ...subs.map((s) => ({
                    id: `${s.topic}/${s.app}`,
                    label: `${s.topic} / ${s.app}`,
                    description: `${s.waiting} waiting, ${s.note}`,
                    weight: weights ? Math.max(0.12, s.waiting / 142) : null,
                    flag: null,
                })),
            ],
            edges: subs.map((s) => ({ from: 'kyu', to: `${s.topic}/${s.app}`, kind: s.kind, detail: `${s.waiting} waiting, ${s.note}` })),
        };
    };
    const draw = () => {
        if (state === 'ready') setGraphData(el, data());
        else if (state === 'loading') setGraphState(el, 'loading', 'Reading the subscriptions…');
        else if (state === 'empty') setGraphState(el, 'empty', 'Nothing to draw yet: no topic has a subscription.');
        else setGraphState(el, 'error', 'The subscriptions could not be read from kyu.');
        pressed('data-ky-graph-state', state);
    };
    draw();
    stateButtons('data-ky-graph-state', (v) => {
        state = v;
        draw();
    });
    byId('ky-graph-live').addEventListener('click', () => {
        live = !live;
        state = 'ready';
        draw();
    });
    el.addEventListener(GRAPH_CHANGE_EVENT, (event) => {
        const { selected, hiddenKinds } = /** @type {CustomEvent} */ (event).detail;
        const kind = (k) => KINDS.find((x) => x.kind === k)?.label ?? k;
        out.textContent =
            (selected.length ? `Picked: ${selected.join(', ')}.` : 'Nothing picked.') +
            (hiddenKinds.length ? ` Hidden: ${hiddenKinds.map(kind).join(', ')}.` : ' Every kind of link is shown.');
    });
    onChoice('graph-size', (v) => {
        weights = v === 'backlog';
        draw();
    });
}
