// research/app-hsb-settings: the page's own wiring. The components are the package's (js/auto.js attaches them: the key-value
// list, the meter, the flash button, the menu button, the datatable); this file feeds them sample data, presses their states
// and fakes the requests. Nothing is sent anywhere. The profile names and numbers are sample content.

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

/** @param {string} selector @param {ParentNode} [root] @returns {HTMLElement[]} */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Press a state button: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = all(`button[${attribute}]`);
    for (const button of buttons)
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    return (/** @type {string} */ value) => {
        for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
        apply(value);
    };
}

/** What the review dialog sets for a choice. @param {string} id @param {(value: string) => void} apply */
function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}

await ready;

/* ------------------------------------------------------------------ settings */

{
    const { setMeter } = await import('../../js/kpi.js');
    const stage = document.getElementById('hs-settings-stage');
    if (stage) {
        const LEASE = 60;
        /** The profiles as the service's config holds them: the numbers the budget is made of. */
        const profiles = {
            alertmanager: { timeout: 5, retries: 3 },
            'uptime-kuma': { timeout: 10, retries: 4 },
        };
        /** The retry budget: every try waits up to the timeout, and between tries the service pauses 1 s, 2 s, 4 s, doubling. @param {{ timeout: number, retries: number }} p */
        const budget = (p) => {
            const pauses = Array.from({ length: p.retries }, (_, i) => 2 ** i);
            const tries = p.timeout * (p.retries + 1);
            return { pauses, tries, total: tries + pauses.reduce((a, b) => a + b, 0) };
        };
        /** "1 s, 2 s and 4 s" @param {number[]} list */
        const say = (list) => (list.length > 1 ? `${list.slice(0, -1).map((n) => `${n} s`).join(', ')} and ${list.at(-1)} s` : `${list[0]} s`);
        /** @type {boolean} */
        let loading = false;
        /** @type {WeakMap<Element, string>} */
        const original = new WeakMap();

        const draw = () => {
            for (const card of all('[data-hs-profile]', stage)) {
                const name = /** @type {keyof typeof profiles} */ (card.getAttribute('data-hs-profile'));
                const p = profiles[name];
                const b = budget(p);
                const share = b.total / LEASE;
                const over = b.total > LEASE;
                const meter = /** @type {HTMLElement} */ (card.querySelector('[data-hs-meter]'));
                setMeter(meter, {
                    value: share,
                    mark: 1,
                    tone: over ? 'destructive' : null,
                    label: 'of the lease',
                    markLabel: 'the lease',
                    loading,
                });
                setMeter(/** @type {HTMLElement} */ (card.querySelector('[data-hs-meter-inline]')), {
                    value: share,
                    tone: over ? 'destructive' : null,
                    label: 'of the lease',
                    loading,
                });
                const words = /** @type {HTMLElement} */ (card.querySelector('[data-hs-budget-words]'));
                const pct = Math.round(share * 100);
                words.textContent = over
                    ? `${b.total} s of ${LEASE} s lease (${pct} %): ${b.total - LEASE} s over`
                    : `${b.total} s of ${LEASE} s lease (${pct} %)`;
                const sum = /** @type {HTMLElement} */ (card.querySelector('[data-hs-budget-sum]'));
                sum.textContent = p.retries
                    ? `${p.retries + 1} tries of ${p.timeout} s is ${b.tries} s, plus pauses of ${say(b.pauses)} is ${b.pauses.reduce((a, c) => a + c, 0)} s.`
                    : `1 try of ${p.timeout} s is ${b.tries} s, with no pauses.`;
                const badge = /** @type {HTMLElement} */ (card.querySelector('[data-hs-budget-badge]'));
                badge.textContent = over ? 'Over budget' : 'Within the lease';
                badge.className = `kp-badge ${over ? 'kp-badge--destructive' : 'kp-badge--success'}`;
                const retries = card.querySelector('[data-hs-retries-value]');
                if (retries) {
                    retries.textContent = String(p.retries);
                    const attempts = /** @type {HTMLElement} */ (card.querySelector('[data-hs-attempts-value]'));
                    attempts.textContent = `${p.retries + 1} (the first try${p.retries ? ` and ${p.retries} ${p.retries === 1 ? 'retry' : 'retries'}` : ' only'})`;
                }
            }
        };

        /** Loading: every value waits in a skeleton line at the final row height; the words and the sum wait too. @param {boolean} on */
        const setLoading = (on) => {
            loading = on;
            for (const dd of all('.kp-kv__row > dd', stage)) {
                if (!original.has(dd)) original.set(dd, dd.innerHTML);
                const budgetRow = dd.matches('[data-hs-budget]');
                if (on) {
                    if (budgetRow) {
                        for (const part of all('[data-hs-budget-words], [data-hs-budget-sum]', dd)) {
                            part.setAttribute('data-hs-wait', part.innerHTML);
                            part.innerHTML = '<span class="kp-kv__wait" aria-hidden="true"><span class="kp-skeleton"></span></span>';
                        }
                    } else {
                        dd.innerHTML = '<span class="kp-kv__wait" aria-hidden="true"><span class="kp-skeleton"></span></span><span class="kp-sr-only">Loading</span>';
                    }
                    dd.setAttribute('aria-busy', 'true');
                } else {
                    if (!budgetRow) dd.innerHTML = original.get(dd) ?? dd.innerHTML;
                    else for (const part of all('[data-hs-wait]', dd)) part.removeAttribute('data-hs-wait');
                    dd.removeAttribute('aria-busy');
                }
            }
            draw();
        };

        /** @param {string} value arrow | hatch | spill | break */
        const setOver = (value) => {
            // The class each sign needs is written on its button, so the page names no class of its own.
            const sign = (/** @type {string} */ v) => all(`button[data-hs-over="${v}"]`)[0]?.getAttribute('data-hs-class') ?? '';
            for (const meter of all('[data-hs-meter], [data-hs-meter-inline]', stage))
                for (const b of all('button[data-hs-over]')) {
                    const cls = b.getAttribute('data-hs-class');
                    if (cls) meter.classList.toggle(cls, sign(value) === cls);
                }
            stage.setAttribute('data-hs-over', value);
            for (const b of all('button[data-hs-over]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-over') === value));
        };
        /** @param {string} value lines | plain | stack | columns */
        const setKv = (value) => {
            const look = (/** @type {string} */ v) => all(`button[data-hs-kv="${v}"]`)[0]?.getAttribute('data-hs-class') ?? '';
            for (const list of all('[data-hs-kv-list]', stage))
                for (const b of all('button[data-hs-kv]')) {
                    const cls = b.getAttribute('data-hs-class');
                    if (cls) list.classList.toggle(cls, look(value) === cls);
                }
            stage.setAttribute('data-hs-kv', value);
            for (const b of all('button[data-hs-kv]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-kv') === value));
        };
        /** @param {string} value 0 to 5 */
        const setRetries = (value) => {
            profiles.alertmanager.retries = Number(value);
            draw();
        };

        stateButtons('data-hs-over', setOver);
        stateButtons('data-hs-kv', setKv);
        stateButtons('data-hs-retries', setRetries);
        stateButtons('data-hs-state', (value) => setLoading(value === 'loading'));
        onChoice('hs-meter-over', setOver);
        onChoice('hs-kv-look', setKv);
        setOver('spill');
        draw();
    }
}

/* ------------------------------------------------------------------ recheck */

{
    const stage = document.getElementById('hs-recheck-stage');
    if (stage) {
        const { runFlashButton } = await import('../../js/flash.js');
        const { toast } = await import('../../js/overlays.js');
        const { setMenu, openMenu } = await import('../../js/menu-button.js');
        const region = /** @type {HTMLElement} */ (document.getElementById('hs-toasts'));
        const rows = all('[data-hs-row-profile]', stage);
        const { setMeter } = await import('../../js/kpi.js');
        for (const m of all('[data-hs-row-meter]', stage)) {
            const share = Number(m.getAttribute('data-hs-row-meter'));
            setMeter(m, { value: share, tone: share > 1 ? 'destructive' : null, label: 'of the lease' });
            // The same sign as the settings section's default; the inline meter is only a glance.
            if (share > 1) m.classList.add('kp-meter--over-spill');
        }
        /** @type {Record<string, 'working' | 'starting' | 'rechecking'>} */
        const state = { alertmanager: 'working', 'uptime-kuma': 'working' };
        let outcome = 'ok';
        const FAILED = 'Could not reach HTTPSwitchboard. Check that the service is running, then try again.';
        const FACES = {
            working: ['Working', 'kp-badge kp-badge--success'],
            starting: ['Starting', 'kp-badge kp-badge--info'],
            rechecking: ['Rechecking…', 'kp-badge kp-badge--warning'],
        };

        const entries = (/** @type {string} */ name) => [
            {
                group: name,
                items: [
                    {
                        label: 'Recheck this profile',
                        hint: 'Puts it back to starting',
                        value: 'recheck',
                        disabled: state[name] === 'working' ? null : state[name] === 'starting' ? 'It is already starting.' : 'It is being rechecked now.',
                    },
                    { label: 'Copy test command', hint: 'A curl line that sends one sample message', value: 'copy' },
                ],
            },
        ];
        const draw = () => {
            for (const row of rows) {
                const name = row.getAttribute('data-hs-row-profile') ?? '';
                const badge = /** @type {HTMLElement} */ (row.querySelector('[data-hs-state-badge]'));
                const [text, cls] = FACES[state[name]];
                badge.textContent = text;
                badge.className = cls;
                const wrapper = row.querySelector('[data-kp-menu-button]');
                if (wrapper) setMenu(wrapper, entries(name));
            }
            const opened = document.getElementById('hs-menu-open');
            if (opened) setMenu(opened, [{ group: 'alertmanager', items: entries('alertmanager')[0].items.map((i) => ({ ...i, disabled: i.value === 'recheck' ? null : i.disabled })) }]);
        };

        /** The success toast, with its close button; it waits while it is read. @param {string} text */
        const done = (text) => toast(text, { region, className: 'kp-toast kp-toast--success', ms: 6000, close: true });
        /** The error toast stays until it is closed and offers to try again. @param {string} text @param {() => void} again */
        const failed = (text, again) => {
            if (stage.getAttribute('data-hs-error') !== 'toast') return;
            toast(text, { region, className: 'kp-toast kp-toast--error', sticky: true, action: { label: 'Try again', onClick: again } });
        };

        /** The faked request. @param {string[]} names @returns {Promise<{ error: string, remedy?: string } | string>} */
        const request = async (names) => {
            for (const n of names) state[n] = 'rechecking';
            draw();
            await sleep(1400);
            if (outcome === 'fail') {
                for (const n of names) state[n] = 'working';
                draw();
                return { error: FAILED };
            }
            for (const n of names) state[n] = 'starting';
            draw();
            return 'Done';
        };

        const allButton = /** @type {HTMLButtonElement} */ (document.getElementById('hs-recheck-all'));
        const recheckAll = async () => {
            const names = Object.keys(state);
            const result = await runFlashButton(allButton, () => request(names));
            if (!result) return;
            if (result.ok) done(`${names.length} profiles back to starting`);
            else failed(result.line, () => void recheckAll());
        };
        allButton.addEventListener('click', () => void recheckAll());

        /** @param {string} name @param {HTMLButtonElement | null} button */
        const recheckOne = async (name, button) => {
            const work = () => request([name]);
            const result = button ? await runFlashButton(button, work) : await work().then((r) => (typeof r === 'string' ? { ok: true, line: '' } : { ok: false, line: r.error }));
            if (!result) return;
            if (result.ok) done(`${name} back to starting`);
            else {
                // The menu has no face of its own to show a refusal, so the line under the Recheck profiles button carries it.
                const line = document.getElementById('hs-line');
                if (!button && line && stage.getAttribute('data-hs-error') === 'line') {
                    line.textContent = result.line;
                    line.hidden = false;
                }
                failed(result.line, () => void recheckOne(name, button));
            }
        };
        for (const b of all('[data-hs-recheck-one]', stage)) b.addEventListener('click', () => void recheckOne(b.getAttribute('data-hs-recheck-one') ?? '', /** @type {HTMLButtonElement} */ (b)));
        stage.addEventListener('kp-menu-select', (event) => {
            const detail = /** @type {CustomEvent} */ (event).detail;
            const name = detail?.item?.closest('[data-hs-row-profile]')?.getAttribute('data-hs-row-profile');
            if (!name) return;
            if (detail.value === 'recheck') void recheckOne(name, null);
            else if (detail.value === 'copy') done('Test command copied');
        });

        const reset = () => {
            for (const n of Object.keys(state)) state[n] = 'working';
            for (const line of all('#hs-line')) {
                line.hidden = true;
                line.textContent = '';
            }
            draw();
        };
        document.querySelector('[data-hs-reset]')?.addEventListener('click', reset);

        /** @param {string} value ok | fail */
        const setOutcome = (value) => {
            outcome = value;
        };
        /** @param {string} value toast | line */
        const setError = (value) => {
            stage.setAttribute('data-hs-error', value);
            const line = document.getElementById('hs-line');
            if (line && value === 'toast') line.hidden = false;
            for (const b of all('button[data-hs-error]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-error') === value));
        };
        /** @param {string} value menu | button */
        const setRow = (value) => {
            stage.setAttribute('data-hs-row', value);
            for (const b of all('button[data-hs-row]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-row') === value));
        };
        stateButtons('data-hs-outcome', setOutcome);
        stateButtons('data-hs-error', setError);
        stateButtons('data-hs-row', setRow);
        onChoice('hs-error-place', setError);
        onChoice('hs-row-action', setRow);

        // The error sentence stays in the page for a screen reader; only the "line" option draws it.
        const line = document.getElementById('hs-line');
        if (line) line.hidden = false;
        allButton.addEventListener('kp-flash', (event) => {
            const d = /** @type {CustomEvent} */ (event).detail;
            if (d.state === 'busy' && line) line.textContent = '';
        });
        draw();

        // The opened sample: held open, and opened again if something closed it.
        const opened = document.getElementById('hs-menu-open');
        if (opened) {
            const open = () => openMenu(opened, { focus: 'none' });
            opened.addEventListener('kp-menu-close', () => setTimeout(open, 400));
            open();
        }
    }
}
