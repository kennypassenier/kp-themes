// Sections 6 to 9: finding a setting, remembered groups, the "This browser" card, the working copy.
import { attachAll } from '../../js/auto.js';
import { attachCalm } from '../../js/calm.js';
import { attachThemePickers, themeOptionsMarkup, themeMenuMarkup } from '../../js/theme-picker.js';
import { startTour, forgetTour } from '../../js/tour.js';
import { refreshOf } from '../../js/auto-refresh.js';
import { REMEMBER_PREFIX } from '../../js/remember.js';
import { ready, byId, say, stateButtons, pressed, esc } from './common.js';
import { FIELDS, GROUPS } from './settings-form.js';

const slug = (/** @type {string} */ s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** @param {import('./settings-form.js').Field} f */
const valueText = (f) => (f.editor === 'bool' ? (f.value === 'on' ? 'on' : 'off') : f.editor === 'table' ? '3 tiers' : f.editor === 'tags' ? f.value.split(',').join(', ') : f.editor === 'window' ? `${f.value}h` : f.value);
/** A closed disclosure's body is not exposed to anyone: say so, so nothing measures or reads it while folded. @param {HTMLElement} root */
function syncBodies(root) {
    for (const d of root.querySelectorAll('details')) {
        const body = d.querySelector('.kp-accordion__body');
        if (body) body.toggleAttribute('aria-hidden', !d.open);
        if (body && d.open) body.removeAttribute('aria-hidden');
        else body?.setAttribute('aria-hidden', 'true');
    }
}
const keysOf = (/** @type {string} */ g) => FIELDS.filter((f) => f.group === g);

/** One group as a disclosure, its keys as a list of rows (each row can carry an anchor). */
function groupHtml(/** @type {string} */ g, /** @type {{ open: boolean, remember: string | null, anchors: boolean }} */ o) {
    const rows = keysOf(g)
        .map((f) => `<div class="kp-kv__row"${o.anchors ? ` data-kp-anchor="${f.key}"` : ''}><dt class="kp-kv__key">${esc(f.label)} <code class="hl-key">${f.key}</code></dt><dd class="kp-kv__value">${esc(valueText(f))}</dd></div>`)
        .join('');
    return `<details class="kp-accordion__item hl-group-item" id="grp-${slug(g)}"${o.open ? ' open' : ''}${o.remember ? ` data-kp-remember="${o.remember}"` : ''}><summary class="kp-accordion__summary hl-group-item__sum"><h3 class="hl-group-item__title" id="h-${slug(g)}">${esc(g)}</h3><span class="kp-badge">${keysOf(g).length} ${keysOf(g).length === 1 ? 'key' : 'keys'}</span></summary><div class="kp-accordion__body"${o.open ? "" : " aria-hidden=\"true\""}><dl class="kp-kv hl-keylist">${rows}</dl></div></details>`;
}

// ── 6 · anchors ───────────────────────────────────────────────────────────────────────────────────────────────────
async function anchorsSection() {
    const main = byId('hl-anchors-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const draw = () => {
        off?.();
        const copy = pressed('data-hl-anchors-copy') || 'url';
        const show = pressed('data-hl-anchors-show') || 'hover';
        main.innerHTML = `<div class="hl-keys" data-kp-anchors="both" data-kp-anchor-levels="3" data-kp-anchor-open="on" data-kp-anchor-copy="${copy}" data-kp-anchor-show="${show}"><div class="kp-accordion">${GROUPS.map((g) => groupHtml(g, { open: g === 'Nightly round and backups', remember: null, anchors: true })).join('')}</div></div>`;
        off = attachAll(main);
        syncBodies(main);
        const toc = byId('hl-anchors-toc');
        if (toc)
            toc.innerHTML = GROUPS.map((g) => `<li><a class="hl-toc__link" href="#grp-${slug(g)}" data-hl-toc="${slug(g)}"><span>${esc(g)}</span><span class="hl-toc__n">${keysOf(g).length}</span></a></li>`).join('');
    };
    main.addEventListener('toggle', () => syncBodies(main), true);
    main.addEventListener('kp-anchor-copy', (e) => say('hl-anchors-log', `Copied: ${/** @type {CustomEvent} */ (e).detail.text ?? /** @type {CustomEvent} */ (e).detail.url}`));
    byId('hl-anchors-toc')?.addEventListener('click', (e) => {
        const a = /** @type {HTMLElement} */ (e.target).closest('a[data-hl-toc]');
        if (!a) return;
        e.preventDefault();
        const d = /** @type {HTMLDetailsElement | null} */ (main.querySelector(`#grp-${a.getAttribute('data-hl-toc')}`));
        if (d) {
            d.open = true;
            d.scrollIntoView({ block: 'nearest' });
        }
        for (const x of document.querySelectorAll('[data-hl-toc]')) x.toggleAttribute('aria-current', x === a);
        say('hl-anchors-log', `Opened ${a.querySelector('span')?.textContent}.`);
    });
    byId('hl-anchors-open')?.addEventListener('click', () => {
        const d = /** @type {HTMLDetailsElement | null} */ (main.querySelector('#grp-logging'));
        if (d) d.open = false;
        const row = main.querySelector('[data-kp-anchor="log_level"]');
        if (d) d.open = true;
        row?.setAttribute('data-kp-anchor-landed', '');
        row?.scrollIntoView({ block: 'nearest' });
        setTimeout(() => row?.removeAttribute('data-kp-anchor-landed'), 2000);
        say('hl-anchors-log', 'Opened settings#log_level: the group Logging unfolded and the row is marked.');
    });
    stateButtons('data-hl-anchors-copy', draw);
    stateButtons('data-hl-anchors-show', draw);
    draw();
}

// ── 7 · remembered groups ─────────────────────────────────────────────────────────────────────────────────────────
async function groupsSection() {
    const main = byId('hl-groups-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const prefix = `${REMEMBER_PREFIX}:disclosure:hl-g-`;
    const stored = () => {
        try {
            return Object.keys(localStorage).filter((k) => k.startsWith(prefix)).map((k) => `${k.slice(prefix.length - 5).replace(/:open$/, '')} = ${localStorage.getItem(k)}`);
        } catch {
            return [];
        }
    };
    const report = () => say('hl-groups-log', stored().length ? stored().join('\n') : 'Nothing is remembered yet.');
    const draw = () => {
        off?.();
        const remember = pressed('data-hl-groups-memory') !== 'off';
        const first = pressed('data-hl-groups-first') || 'two';
        main.innerHTML = `<div class="kp-accordion hl-groups">${GROUPS.map((g, i) => groupHtml(g, { open: first === 'two' && i < 2, remember: remember ? `hl-g-${slug(g)}` : null, anchors: false })).join('')}</div>`;
        off = attachAll(main);
        syncBodies(main);
        report();
    };
    main.addEventListener('toggle', () => { syncBodies(main); setTimeout(report, 50); }, true);
    byId('hl-groups-reload')?.addEventListener('click', draw);
    byId('hl-groups-forget')?.addEventListener('click', () => {
        try {
            for (const k of Object.keys(localStorage)) if (k.startsWith(prefix)) localStorage.removeItem(k);
        } catch {}
        draw();
    });
    stateButtons('data-hl-groups-memory', draw);
    stateButtons('data-hl-groups-first', draw);
    draw();
}

// ── 8 · This browser ──────────────────────────────────────────────────────────────────────────────────────────────
async function browserSection() {
    const main = byId('hl-browser-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    /** @type {Array<() => void>} */
    let extra = [];
    let live = 'follow';
    const themes = (/** @type {boolean} */ menu) =>
        menu
            ? themeMenuMarkup({ id: 'hl-browser-menu', label: 'Choose a theme', grouped: true, groupLabels: { light: 'Light', dark: 'Dark' } })
            : `<ul class="hl-themes" data-kp-theme-picker aria-label="Theme">${themeOptionsMarkup({ grouped: true, groupLabels: { light: 'Light', dark: 'Dark' } })}</ul>`;
    const draw = () => {
        off?.();
        for (const f of extra.splice(0)) f();
        const slim = pressed('data-hl-browser-size') === 'slim';
        const menu = slim || pressed('data-hl-browser-picker') === 'menu';
        const sw = (/** @type {string} */ id, /** @type {string} */ word, /** @type {boolean} */ on) => `<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" id="${id}"${on ? ' checked' : ''} /><span>${word}</span></label>`;
        const rows = [
            ['Theme', 'The look of the dashboard on this device.', themes(menu)],
            ['Calm mode', 'Turns movement and effects off; loading keeps breathing slowly.', `<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" id="hl-calm" /><span>Calm</span></label>`],
            ['Live view default', 'What the Live view page opens in.', `<div class="kp-segmented" data-kp-segmented role="radiogroup" aria-label="Live view default"><button type="button" role="radio" aria-checked="${live === 'follow'}" data-kp-value="follow">Follow</button><button type="button" role="radio" aria-checked="${live === 'pause'}" data-kp-value="pause">Paused</button></div>`],
            ['Follow my system', 'Light by day, dark by night, as the system decides.', sw('hl-follow', 'Follow', false)],
            ['The tour', 'The short walk over this page.', '<button type="button" class="kp-button" id="hl-tour">Replay the tour</button>'],
            ['Remembered here', 'Open groups, sort orders, folded sections.', '<button type="button" class="kp-button kp-button--destructive" id="hl-forget">Forget what this browser remembers</button>'],
        ];
        const shown = slim ? rows.filter((r) => ['Theme', 'Calm mode', 'The tour'].includes(r[0])) : rows;
        main.innerHTML = `<section class="kp-card hl-browser" id="hl-browser-card" aria-labelledby="hl-browser-h"><header class="kp-card__header"><h3 class="kp-card__title" id="hl-browser-h">This browser</h3><p class="kp-lede">${slim ? 'Only this device.' : 'These choices stay on this device; the host never sees them.'}</p></header><div class="kp-card__stage"><div class="kp-formrows kp-formrows--lines">${shown.map(([n, d, c]) => `<div class="kp-formrow"><div class="kp-formrow__label">${n}${slim ? '' : `<small>${d}</small>`}</div><div class="kp-formrow__control">${c}</div><div class="kp-formrow__aside"></div></div>`).join('')}</div></div></section>`;
        off = attachAll(main);
        // Theme: not stored here, so a pick in the review never changes the reviewer's own theme.
        extra.push(attachThemePickers(main, { persist: false }));
        const calm = main.querySelector('#hl-calm');
        if (calm) {
            calm.setAttribute('data-kp-calm-switch', '');
            extra.push(attachCalm(main, { remember: false }));
        }
        main.querySelector('#hl-forget')?.addEventListener('click', (e) => {
            openForget(/** @type {HTMLElement} */ (e.currentTarget));
        });
        main.querySelector('#hl-tour')?.addEventListener('click', (e) => {
            forgetTour('homelab');
            const button = /** @type {HTMLElement} */ (e.currentTarget);
            const steps = [
                { target: '#hl-browser-h', title: 'This browser', text: 'Everything here stays on this device.' },
                { target: '#hl-browser-card [data-kp-theme-picker], #hl-browser-card .kp-theme-menu', title: 'Theme', text: 'Pick the look; the host never sees it.' },
                { target: '#hl-calm', title: 'Calm mode', text: 'Turns movement and effects off.' },
            ];
            startTour(steps, { remember: 'homelab', returnFocus: button, onEnd: () => say('hl-browser-log', 'The tour ended; it is remembered as seen.') });
            say('hl-browser-log', 'Tour replayed from step 1.');
        });
    };
    /** @param {HTMLElement} from */
    async function openForget(from) {
        const { openConfirmation } = await import('../../js/components.js');
        const n = (() => {
            try {
                return Object.keys(localStorage).filter((k) => k.startsWith(`${REMEMBER_PREFIX}:`)).length;
            } catch {
                return 0;
            }
        })();
        openConfirmation(from, {
            phrase: 'Forget what this browser remembers?',
            loses: [`${n} remembered choices: open groups, sort orders, folded sections`, 'The tour starts again on the next visit', 'The theme and calm mode stay'],
            acceptLabel: 'Forget them',
            onAccept: () => {
                try {
                    for (const k of Object.keys(localStorage)) if (k.startsWith(`${REMEMBER_PREFIX}:`) && !k.includes(':calm:')) localStorage.removeItem(k);
                } catch {}
                say('hl-browser-log', 'Forgot the remembered choices; the theme and calm mode stay.');
            },
        });
    }
    main.addEventListener('kp-theme-pick', (e) => say('hl-browser-log', `Theme ${/** @type {CustomEvent} */ (e).detail.theme} (not stored in this demo).`));
    main.addEventListener('kp-calm-change', (e) => say('hl-browser-log', `Calm mode ${/** @type {CustomEvent} */ (e).detail?.on ? 'on' : 'off'}.`));
    main.addEventListener('kp-segmented-change', (e) => {
        live = /** @type {CustomEvent} */ (e).detail?.value ?? live;
        say('hl-browser-log', `Live view opens ${live === 'follow' ? 'following' : 'paused'}.`);
    });
    stateButtons('data-hl-browser-size', draw);
    stateButtons('data-hl-browser-picker', draw);
    draw();
}

// ── 9 · working copy ──────────────────────────────────────────────────────────────────────────────────────────────
async function workingSection() {
    const main = byId('hl-working-main');
    if (!main) return;
    await ready;
    /** @type {(() => void) | null} */
    let off = null;
    const draw = () => {
        off?.();
        const same = pressed('data-hl-working-versions') === 'same';
        main.innerHTML = `<div class="hl-working__row"><div class="hl-working__what"><b>Settings read from pve</b><span class="hl-line">host.toml, 15 keys shown, read by the host</span><span class="hl-line hl-working__note">The next read will work.</span></div><div class="kp-refresh" data-kp-refresh="30" data-kp-remember="hl-working"></div></div><div class="hl-working__row"><div class="hl-working__what"><b>Versions</b><span class="hl-line">${same ? 'Dashboard and host run the same version.' : 'Dashboard 3.75.0 and host 3.74.2: the host is one minor behind.'}</span></div><span class="kp-badge kp-badge--version" id="hl-working-ver" data-kp-version-scheme="numbers" data-kp-version-from="3.74.2" data-kp-version-to="${same ? '3.74.2' : '3.75.0'}" data-kp-version-app="homelab" data-kp-version-href="https://github.com/kennypassenier/homelab/releases"></span></div>`;
        off = attachAll(main);
    };
    main.addEventListener('kp-refresh', (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        const ok = (pressed('data-hl-working-fetch') || 'works') === 'works';
        say('hl-working-log', `GET /api/host/config (${d.reason})`);
        setTimeout(() => {
            d.done?.(ok);
            say('hl-working-log', ok ? `Read ok (${d.reason}).` : `Read failed (${d.reason}): the data stays, the line says why.`);
        }, 600);
    });
    stateButtons('data-hl-working-versions', draw);
    stateButtons('data-hl-working-fetch', () => {
        const r = main.querySelector('[data-kp-refresh]');
        const works = pressed('data-hl-working-fetch') !== 'fails';
        main.setAttribute('data-hl-fetch', works ? 'works' : 'fails');
        const note = main.querySelector('.hl-working__note');
        if (note) note.textContent = works ? 'The next read will work.' : 'The next read will fail.';
        if (r) refreshOf(r)?.now('now');
    });
    draw();
}

export async function initSettingsB() {
    await Promise.all([anchorsSection(), groupsSection(), browserSection(), workingSection()]);
}
