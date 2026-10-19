// research/chassis-kit-pages/kit-pages.js: the bodies of the kit's pages (status, clients, passkeys, login, error), data in, markup out.
// kit.js holds the shell around them. Nothing here draws a control of its own: every control is a kp-themes 11.0.0 part.
import { DATA, NOW, NAV, agoStamp, esc, fmt, agoWords, span, clientState, clientCounts, idleDays, app, header, flashButton } from './kit.js';

const json = (/** @type {unknown} */ v) => esc(JSON.stringify(v));

/** @param {string} word @param {number} n */
const plural = (word, n) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** The info a card heading needs: a heading and the sentence under it (UI principles: every section says what it does). */
const cardHead = (/** @type {string} */ id, /** @type {string} */ title, /** @type {string} */ about) =>
    `<h2 class="kp-card__title" id="${id}">${esc(title)}</h2><p class="kp-lede" data-kp-lede-measure="full">${esc(about)}</p>`;

/* --------------------------------------------------------------------------------------------------- STATUS -- */

/**
 * The status page.
 * @param {string} uid
 * @param {{ state?: 'healthy' | 'degraded' | 'failed' | 'loading', update?: 'off' | 'current' | 'available', problems?: 'each' | 'list' | 'fold', open?: boolean }} o
 */
export function statusPage(uid, { state = 'healthy', update = 'off', problems = 'each', open = false } = {}) {
    const st = DATA.status;
    const degraded = state === 'degraded';
    const parts = Object.entries(st.health.subsystems).map(([name, sub]) => ({ name, ok: degraded && name === 'store' ? false : sub.ok, detail: degraded && name === 'store' ? 'The state directory refused a write' : sub.detail }));
    // A degraded service shows the capture's one part failing and one more part the sample adds, so the strip has a row to count.
    if (degraded) parts.push({ name: 'notifications', ok: false, detail: 'The webhook answered 502 twice in a row' });
    else parts.push({ name: 'notifications', ok: true, detail: 'Delivered 3 of 3' });
    const failing = parts.filter((p) => !p.ok).length;
    const upMs = NOW - new Date(st.started_at).getTime();
    const latest = update === 'available' ? '0.2.0' : update === 'current' ? '0.1.0' : null;
    const loading = state === 'loading';
    const opsState = state === 'failed' ? ' data-kp-state="error"' : loading ? ' data-kp-state="loading"' : '';

    const kpis = `<div class="kp-kpis" role="group" aria-label="This service at a glance" data-kp-kpis-columns="all 4 2 1">
      <div class="kp-kpi"${degraded ? ' data-kp-tone="destructive"' : ''}><span class="kp-kpi__label">Health</span><span class="kp-kpi__value">${degraded ? 'Degraded' : 'Healthy'}<small>${parts.length - failing} of ${parts.length} parts</small></span><span class="kp-kpi__trend">${degraded ? `${plural('part', failing)} failing; the health check answers 503` : 'Every part can do its work'}</span><span class="kp-kpi__meter" role="meter" aria-label="Parts that can do their work" aria-valuenow="${parts.length - failing}" aria-valuemin="0" aria-valuemax="${parts.length}" style="--kp-value: ${(parts.length - failing) / parts.length}"></span></div>
      <div class="kp-kpi"><span class="kp-kpi__label">Running</span><span class="kp-kpi__value">${esc(st.version)}</span><span class="kp-kpi__trend">${latest && latest !== st.version ? `<span class="kp-badge kp-badge--version" data-kp-version-from="${esc(st.version)}" data-kp-version-to="${latest}" data-kp-version-href="https://github.com/kennypassenier/chassis-rs/releases/tag/v{to}"></span> is out` : latest ? 'The latest release' : 'Updates are switched off'}</span></div>
      <div class="kp-kpi"><span class="kp-kpi__label">Up for</span><span class="kp-kpi__value">${esc(span(upMs))}</span><span class="kp-kpi__trend">since <time datetime="${esc(st.started_at)}">${fmt(st.started_at)}</time></span></div>
      <a class="kp-kpi" href="#clients"><span class="kp-kpi__label">Clients</span><span class="kp-kpi__value">${clientCounts(DATA.clients).active}<small>of ${DATA.clients.length}</small></span><span class="kp-kpi__trend">active; open the list</span></a>
    </div>`;

    const healthRows = parts
        .map(
            (p) =>
                `<li class="kp-statusrow" data-state="${p.ok ? 'ok' : 'failed'}" data-kp-status-id="${esc(p.name)}"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">${esc(p.name)}</span><span class="kp-statusrow__detail">${esc(p.detail)}</span></span></li>`,
        )
        .join('');

    const updatesBody =
        update === 'off'
            ? `<dl class="kp-kv kp-kv--lines"><div class="kp-kv__row"><dt>Mode</dt><dd>Off</dd></div><div class="kp-kv__row"><dt>Running</dt><dd><span class="mono">${esc(st.version)}</span></dd></div><div class="kp-kv__row"><dt>Latest release</dt><dd><span class="kp-kv__none">—<span class="kp-sr-only">not checked</span></span></dd></div><div class="kp-kv__row"><dt>Last check</dt><dd>Never</dd></div></dl>
               <p class="kp-lede" data-kp-lede-measure="full">Updates are switched off in this service’s settings, so it never looks for a new release.</p>`
            : `<dl class="kp-kv kp-kv--lines"><div class="kp-kv__row"><dt>Mode</dt><dd>Checks every night</dd></div><div class="kp-kv__row"><dt>Running</dt><dd><span class="mono">${esc(st.version)}</span></dd></div><div class="kp-kv__row"><dt>Latest release</dt><dd>${update === 'available' ? `<span class="kp-badge kp-badge--version" data-kp-version-from="${esc(st.version)}" data-kp-version-to="0.2.0" data-kp-version-href="https://github.com/kennypassenier/chassis-rs/releases/tag/v{to}"></span>` : 'You are on it'}</dd></div><div class="kp-kv__row"><dt>Last check</dt><dd><time class="kp-ago" data-kp-ago data-kp-ago-verb="checked" datetime="${agoStamp(7260)}">checked 2 h ago</time></dd></div></dl>`;

    const own = DATA.status.sections
        .map(
            (s, i) => `<section class="kp-card" data-kp-span="12" aria-labelledby="${uid}-s${i}">${cardHead(`${uid}-s${i}`, s.title, s.explain)}
        <dl class="kp-kv kp-kv--lines">${s.rows.map((r) => `<div class="kp-kv__row"><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>
        <div class="kp-row ck-actions">${s.actions
            .map(
                (a) =>
                    `<button type="button" class="kp-button kp-button--destructive" data-kp-flash-button data-kp-flash-words="Cleared,Refused" data-ck-toast="Cleared ${st.sections[0].rows[0][1]} messages" data-kp-destructive data-kp-confirm="${esc(a.confirm)}">${esc(a.label)}</button>`,
            )
            .join('')}</div></section>`,
        )
        .join('') +
        `<section class="kp-card" data-kp-span="12" aria-labelledby="${uid}-del">${cardHead(`${uid}-del`, 'Deliveries', 'What is waiting to be sent on, and when it was last tried. A second service’s section, with an action that does not reload the page.')}
        <dl class="kp-kv kp-kv--lines"><div class="kp-kv__row"><dt>Waiting</dt><dd>12</dd></div><div class="kp-kv__row"><dt>Last attempt</dt><dd>${fmt(NOW - 600000)}</dd></div></dl>
        <div class="kp-row ck-actions">${flashButton('Retry failed deliveries', { words: 'Retried,Refused', attrs: 'data-ck-toast="Retried 12 entries"' })}</div></section>`;

    const failedPlate = `<div class="kp-ops__attention kp-attention"><div class="kp-alert kp-alert--destructive kp-attention__item" role="alert" data-kp-severity="critical"><span class="kp-attention__icon" aria-hidden="true">!</span><div class="kp-attention__text"><strong><span class="kp-sr-only">Critical: </span>The status could not be read</strong><span>The service did not answer in 10 s. What now: check that it is running, then try again.</span></div><div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm" data-ck-retry>Try again</button></div></div></div>`;

    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none" data-kp-ops-failed="plate"${opsState} data-ck-state="${state}">
  ${header(uid, {
      title: 'Status',
      about: 'What this service is running, and whether each part of it is doing its job right now.',
      fresh: true,
      actions: `${flashButton('Check for updates', { words: 'Up to date,Update found,Refused', attrs: update === 'off' ? 'disabled data-kp-disabled-reason="Updates are switched off in this service’s settings"' : '' })}`,
      more: ['Copy the health address|The address monitoring reads, /healthz', 'Download the status as JSON|Everything on this page, for a script'],
  })}
  <div class="kp-ops__kpis">${kpis}</div>
  <div class="kp-ops__attention"><div class="kp-problems" id="${uid}-problems" data-kp-problems data-kp-problems-mode="${problems}" data-kp-problems-fold-from="2" aria-label="Problems" data-ck-problems="${degraded ? json(DATA.problems) : '[]'}"></div></div>
  ${state === 'failed' ? failedPlate : ''}
  <div class="kp-ops__body">
    <section class="kp-card" data-kp-span="4" aria-labelledby="${uid}-svc">${cardHead(`${uid}-svc`, 'Service', 'What is running here, and since when.')}
      <dl class="kp-kv kp-kv--lines">
        <div class="kp-kv__row"><dt>Name</dt><dd>${esc('inbox')}</dd></div>
        <div class="kp-kv__row"><dt>Version</dt><dd><span class="mono">${esc(st.version)}</span></dd></div>
        <div class="kp-kv__row"><dt>Built on</dt><dd>chassis 3.8.0 <span class="kp-badge">kp-themes 11.0.0</span></dd></div>
        <div class="kp-kv__row"><dt>Up since</dt><dd><time datetime="${esc(st.started_at)}">${fmt(st.started_at)}</time> <time class="kp-ago" data-kp-ago data-kp-ago-verb="started" datetime="${agoStamp(Math.round(upMs / 1000))}">started ${esc(agoWords(st.started_at))}</time></dd></div>
        <div class="kp-kv__row"><dt>Listening</dt><dd><span class="kp-copyable"><span class="kp-copyable__value" id="${uid}-listen">${esc(st.listen)}</span><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-copyable__button" data-kp-copy="${uid}-listen">Copy</button></span></dd></div>
      </dl></section>
    <section class="kp-card" data-kp-span="4" aria-labelledby="${uid}-health">${cardHead(`${uid}-health`, 'Health', 'Each part says whether it can do its work. One failing part makes the whole service degraded.')}
      <ul class="kp-statuslist" aria-label="Parts of this service">${healthRows}</ul></section>
    <section class="kp-card" data-kp-span="4" aria-labelledby="${uid}-upd">${cardHead(`${uid}-upd`, 'Updates', 'How this service gets new versions, and where it stands.')}${updatesBody}</section>
    <section class="kp-card" data-kp-span="12" aria-labelledby="${uid}-up">${cardHead(`${uid}-up`, 'Availability, last 48 hours', 'One cell per hour. Hover a cell for the hour’s figures; the gap is the restart.')}
      <div class="kp-uptime" id="${uid}-uptime" data-kp-uptime data-kp-uptime-label="inbox" data-kp-uptime-count="48" data-kp-uptime-open="info" data-ck-uptime="${json(DATA.uptime)}"></div>
      <p class="kp-text-muted ck-mock">Sample values: the example service keeps no history yet. The strip needs the service to record one state per hour.</p></section>
    ${own}
  </div>
</div>`;
}

/**
 * A service's own sections: the same card in three bodies, each in the four states of a data card.
 * @param {string} uid @param {{ state?: 'ready' | 'loading' | 'empty' | 'error' }} o
 */
export function sectionsPage(uid, { state = 'ready' } = {}) {
    const msgs = DATA.status.sections[0].rows.slice(1).map((r) => ({ id: r[0], text: r[1] }));
    const card = (/** @type {string} */ key, /** @type {string} */ title, /** @type {string} */ about, /** @type {string} */ data, /** @type {number} */ spanCols) =>
        `<section class="kp-card" data-kp-span="${spanCols}" data-kp-state="${state}" data-ck-card="${key}" aria-labelledby="${uid}-${key}-t">
      <div class="kp-card__header"><h2 class="kp-card__title" id="${uid}-${key}-t">${esc(title)}</h2></div>
      <p class="kp-card__body">${esc(about)}</p>
      <div class="kp-card__stage"><div class="kp-card__data">${data}</div></div></section>`;
    const table = `<div class="kp-datatable" data-kp-datatable data-kp-page-size="5" data-kp-remember="${uid}-messages"><div class="kp-table-wrap"><table class="kp-table"><caption class="kp-sr-only">The newest messages</caption><thead><tr><th scope="col" data-kp-sort="text">Message</th><th scope="col" data-kp-sort="text">From</th><th scope="col" data-kp-sort="text">Body</th></tr></thead><tbody>${msgs
        .map((m) => {
            const [from, body] = m.text.split(' → ');
            return `<tr data-kp-row-key="${esc(m.id)}"><td class="kp-numeric">${esc(m.id)}</td><td>${esc(from)}</td><td><code class="kp-id">${esc(body)}</code></td></tr>`;
        })
        .join('')}</tbody></table></div></div>`;
    const figures = `<div class="kp-kpis" role="group" aria-label="Delivery"><div class="kp-kpi"><span class="kp-kpi__label">Received</span><span class="kp-kpi__value">${msgs.length}</span><span class="kp-kpi__trend">since the service started</span></div><div class="kp-kpi"><span class="kp-kpi__label">Refused</span><span class="kp-kpi__value">0</span><span class="kp-kpi__trend">wrong token or bad body</span></div><div class="kp-kpi"><span class="kp-kpi__label">Waiting</span><span class="kp-kpi__value">0</span><span class="kp-kpi__trend">to be delivered</span></div></div>
      <ul class="kp-statuslist" aria-label="Checks of this section"><li class="kp-statusrow" data-state="ok" data-kp-status-id="store"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Message store</span><span class="kp-statusrow__detail">writable</span></span></li><li class="kp-statusrow" data-state="ok" data-kp-status-id="webhook"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">Webhook</span><span class="kp-statusrow__detail">answered 200, 3 s ago</span></span></li></ul>`;
    const feed = `<dl class="kp-kv kp-kv--lines" data-ck-feed><div class="kp-kv__row"><dt>Store</dt><dd>${esc(DATA.healthz.subsystems.store.detail)}</dd></div><div class="kp-kv__row"><dt>Status</dt><dd><span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> ${esc(DATA.healthz.status)}</span></dd></div><div class="kp-kv__row"><dt>Version</dt><dd><span class="mono">${esc(DATA.healthz.version)}</span></dd></div><div class="kp-kv__row"><dt>Read</dt><dd><time class="kp-ago" data-kp-ago data-kp-ago-verb="read" datetime="${agoStamp(4)}">read 4 s ago</time></dd></div></dl><div class="kp-row ck-actions">${flashButton('Read again', { words: 'Read,Refused' })}</div>`;
    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none">
  ${header(uid, { title: 'Status', about: 'The sections below belong to this service. Each says what it shows.', fresh: false })}
  <div class="kp-ops__body">
    ${card('table', 'Messages', 'Everything clients posted since the service started; the newest are listed. A table, so it sorts and searches.', table, 12)}
    ${card('figures', 'Delivery', 'Key figures and the checks behind them, written by the service as plain rows.', figures, 8)}
    ${card('feed', 'Store, read live', 'A card that reads its own address and shows its state while it waits: /healthz, as the service answers it.', feed, 4)}
  </div>
</div>`;
}

/* --------------------------------------------------------------------------------------------------- CLIENTS -- */

/** @param {any} c */
function stateBadge(c) {
    const s = clientState(c);
    if (s === 'revoked') return `<span class="kp-badge">revoked ${esc(fmt(c.revoked_at).slice(0, 10))}</span>`;
    if (s === 'new') return `<span class="kp-badge">not used yet</span>`;
    if (s === 'idle') return `<span class="kp-badge kp-badge--warning">idle ${idleDays(c)} days</span>`;
    return `<span class="kp-badge kp-badge--success">active</span>`;
}

/**
 * The clients page.
 * @param {string} uid
 * @param {{ state?: 'ready' | 'empty' | 'loading' | 'error', filter?: string, cards?: boolean }} o
 */
export function clientsPage(uid, { state = 'ready', filter = '', cards = false } = {}) {
    const rows = state === 'empty' ? [] : DATA.clients;
    const n = clientCounts(rows);
    const info = DATA.clientsInfo;
    const toggle = (/** @type {string} */ key, /** @type {string} */ label, /** @type {number} */ count, /** @type {string} */ note, tone = '') =>
        `<button type="button" class="kp-kpi kp-kpi--toggle" data-ck-filter="${key}" aria-pressed="${filter === key}"${tone && count ? ` data-kp-tone="${tone}"` : ''}><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${count}</span><span class="kp-kpi__trend">${note}</span></button>`;
    const kpis = `<div class="kp-kpis" role="group" aria-label="Clients by state" data-kp-kpis-columns="all 4 2">${toggle('in use', 'In use', n.inUse, 'called in the last 30 days')}${toggle('idle', 'Idle', n.idle, '30 days or more without a call', 'warning')}${toggle('new', 'Not used yet', n.fresh, 'issued in the last 30 days')}${toggle('revoked', 'Revoked', n.revoked, 'their token no longer works')}</div>`;

    const head = `<tr><th scope="col" data-kp-sort="text" data-kp-filter="choice">Client</th><th scope="col" data-kp-sort="text">State</th><th scope="col" data-kp-sort="date">Last used</th><th scope="col" data-kp-sort="number">Requests</th>${info.declared_columns.map((c) => `<th scope="col" data-kp-sort="text" data-kp-filter="choice">${esc(c.title)}</th>`).join('')}${info.extra_columns.map((c) => `<th scope="col" data-kp-sort="number">${esc(c.title)}</th>`).join('')}<th scope="col" class="text-end ck-fit"><span class="kp-sr-only">Actions</span></th></tr>`;
    const body = rows
        .map(
            (c) => `<tr data-kp-row-key="${esc(c.id)}" data-ck-state="${esc(clientState(c))}">
      <td data-label="Client"><span class="kp-idmark-name"><span class="kp-idmark kp-idmark--sm" data-kp-idmark="${esc(c.name)}" aria-hidden="true"></span><a class="kp-fw-medium" href="#manage-${esc(c.id)}" data-kp-hovercard="Issued ${esc(fmt(c.issued_at))} · topic ${esc(c.fields.topic)} · ${c.uses} requests" data-ck-manage="${esc(c.id)}">${esc(c.name)}</a></span></td>
      <td class="state-cell" data-label="State" data-kp-sort-value="${esc(clientState(c))}">${stateBadge(c)}</td>
      <td class="kp-timestamp" data-label="Last used" data-kp-sort-value="${esc(c.last_used_at ?? '')}">${c.last_used_at ? `${esc(fmt(c.last_used_at))} <span class="kp-text-muted">${esc(agoWords(c.last_used_at))}</span>` : '<span class="kp-text-muted">never</span>'}</td>
      <td class="kp-numeric" data-label="Requests">${c.uses}</td>
      ${c.declared.map((/** @type {string} */ d, /** @type {number} */ i) => `<td data-label="${esc(info.declared_columns[i].title)}">${esc(d)}</td>`).join('')}${c.extra.map((/** @type {string} */ d, /** @type {number} */ i) => `<td class="kp-numeric" data-label="${esc(info.extra_columns[i].title)}">${esc(d)}</td>`).join('')}
      <td class="text-end ck-fit"><button type="button" class="kp-button" data-ck-manage="${esc(c.id)}" aria-label="Manage ${esc(c.name)}">Manage</button></td></tr>`,
        )
        .join('');

    const table = `<div class="kp-datatable" data-kp-datatable data-kp-remember="${uid}-clients" data-kp-page-size="10"${cards ? ' data-kp-cards' : ''}${state === 'loading' ? ' data-kp-state="loading"' : ''}${state === 'error' ? ' data-kp-state="failed"' : ''}>
    <div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the clients" placeholder="Search by name or topic" /></div>
    <div class="kp-table-wrap"><table class="kp-table"><caption class="kp-sr-only">Registered clients</caption><thead>${head}</thead><tbody>${body}</tbody></table></div>
    ${state === 'error' ? `<div class="kp-alert kp-alert--destructive" data-kp-datatable-failed role="alert"><p class="kp-alert__label">The clients could not be read</p><p>The service did not answer. Nothing was changed.</p><button type="button" class="kp-button" data-kp-datatable-retry>Try again</button></div>` : ''}
    ${state === 'empty' ? `<div class="kp-empty" data-kp-datatable-empty><p class="kp-empty__title">No clients yet</p><p class="kp-empty__body">Issue the first one, then give its token to the program that will call this service.</p><button type="button" class="kp-button kp-button--primary" data-kp-dialog="${uid}-issue-dialog">Issue a client</button></div>` : ''}
  </div>`;

    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none" data-ck-state="${state}">
  ${header(uid, {
      title: 'Clients',
      about: 'Every program that calls this service has its own token, so you can switch one off without touching the rest.',
      fresh: true,
      actions: `<button type="button" class="kp-button kp-button--primary" data-kp-dialog="${uid}-issue-dialog" aria-keyshortcuts="n">Issue a client</button>`,
  })}
  <div class="kp-ops__kpis">${kpis}</div>
  <div class="kp-ops__attention"><div class="kp-problems" id="${uid}-problems" data-kp-problems data-kp-problems-mode="each" aria-label="Clients that need a look" data-ck-idle="${json(rows.filter((c) => clientState(c) === 'idle').map((c) => c.name))}"></div></div>
  <div class="kp-ops__body"><section class="kp-card" data-kp-span="12" aria-labelledby="${uid}-list">${cardHead(`${uid}-list`, `Registered clients (${rows.length})`, 'Open a client to see its token, copy a ready-made command, send a test and read what it sent.')}<div data-kp-idmark-set>${table}</div></section></div>
</div>`;
}

/** The token as the page knows it: never in the markup. This stand-in is shown only after Reveal answers. */
export const SAMPLE_TOKEN = '9f2c41d07be85a63c7a1f0e4d28b9a56731ce04f8d2b6a9051c7e3fa48d0b26e';

/**
 * The manage dialog of one client, open (a dialog the page keeps in the page).
 * @param {string} uid
 * @param {{ client?: any, requests?: 'ready' | 'loading' | 'empty' | 'error', open?: boolean }} o
 */
export function manageDialog(uid, { client = DATA.clients[0], requests = 'ready', open = true } = {}) {
    const c = client;
    const active = c.active;
    const state = active ? '<span class="kp-badge kp-badge--success">active</span>' : `<span class="kp-badge">revoked ${esc(fmt(c.revoked_at))}</span>`;
    const lost = `<ul class="kp-type-confirm__list"><li>the token, which stops working at once</li><li>${plural('request', c.uses)} of history</li></ul>`;
    return `<dialog class="kp-dialog kp-dialog--wide ck-manage" id="${uid}-dialog" aria-labelledby="${uid}-title"${open ? ' open' : ''}>
  <div class="kp-dialog__head"><span class="kp-idmark kp-idmark--lg" data-kp-idmark="${esc(c.name)}" aria-hidden="true"></span><h2 class="kp-dialog__title" id="${uid}-title">${esc(c.name)}</h2>${state}
    <p class="kp-dialog__description">Issued ${esc(fmt(c.issued_at))} · ${c.last_used_at ? `last used ${esc(fmt(c.last_used_at))} (${c.uses} ${c.uses === 1 ? 'request' : 'requests'})` : 'never used'}</p></div>
  <div class="kp-dialog__body">
    ${
        active
            ? `<section class="kp-dialog__section"><h3 class="kp-dialog__heading">Token</h3>
      <div class="kp-secret" data-kp-secret data-kp-secret-ttl="10" data-kp-secret-label="Token of ${esc(c.name)}" data-ck-secret="${esc(c.id)}"></div>
      <p class="kp-dialog__note">The token is not in this page: it is read from the service when you press Reveal or Copy, and hides again after 10 seconds.</p></section>
    <section class="kp-dialog__section"><h3 class="kp-dialog__heading">Use it</h3>
      <div class="kp-command" data-kp-command="bash" data-kp-command-where="the machine that calls this service"><pre class="kp-command__code"><code>export CLIENT_TOKEN='…'
curl -sS -X POST http://127.0.0.1:8080/v1/messages \\
  -H "Authorization: Bearer $CLIENT_TOKEN" \\
  -H 'Content-Type: application/json' -d '{}'</code></pre></div>
      <div class="kp-row ck-actions">${flashButton('Copy with the token filled in', { words: 'Copied,Copy failed', attrs: `data-ck-copy-full="${esc(c.id)}"` })}</div>
      <p class="kp-dialog__note">The block above is safe to paste into a chat. The button copies the same command with the real token in it.</p></section>
    <section class="kp-dialog__section"><h3 class="kp-dialog__heading">Test it</h3>
      <div class="kp-field"><label class="kp-field__label" for="${uid}-body">Body of the test request</label><textarea class="kp-field__input kp-field__input--multiline" id="${uid}-body" data-kp-json="strict" rows="3">{"hello":"from the dashboard"}</textarea></div>
      <div class="kp-row ck-actions">${flashButton('Send test', { kind: 'primary', words: 'Sent,Refused', attrs: `data-ck-send="${esc(c.id)}"` })}</div>
      <p class="kp-dialog__note">One request with this client’s token to the service’s own test route, so you see the round trip before the real program is wired.</p></section>`
            : `<section class="kp-dialog__section"><h3 class="kp-dialog__heading">Token</h3><div class="kp-alert kp-alert--info" role="status"><span class="kp-alert__what">This token no longer works</span><span class="kp-alert__why">It was revoked on ${esc(fmt(c.revoked_at))}; every call with it is refused.</span><span class="kp-alert__remedy"><span class="kp-alert__remedy-label">What now</span> Issue a new client if the program should call again.</span></div></section>`
    }
    <section class="kp-dialog__section"><h3 class="kp-dialog__heading">Requests</h3>
      <div class="kp-card kp-inspector" data-kp-requests data-kp-requests-open="failed" id="${uid}-requests" data-ck-requests="${requests}" data-kp-requests-max="5"></div>
      <p class="kp-dialog__note">Secrets are masked, bodies are cut at ${DATA.clientsInfo.capture_body_bytes} bytes, requests are kept ${DATA.clientsInfo.capture_ttl_minutes} minutes.</p></section>
    <section class="kp-dialog__section kp-dialog__section--danger"><h3 class="kp-dialog__heading">Danger zone</h3>
      <div class="kp-row ck-actions">
        ${active ? `<button type="button" class="kp-button" data-kp-destructive data-kp-confirm="Re-issue the token of ${esc(c.name)}?" data-kp-confirm-label="Re-issue" data-kp-confirm-loses="${uid}-lost-reissue">Re-issue</button><button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Revoke the token of ${esc(c.name)}?" data-kp-confirm-label="Revoke">Revoke</button>` : ''}
        <button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete ${esc(c.name)} and its history?" data-kp-confirm-type="${esc(c.name)}" data-kp-confirm-loses="${uid}-lost-delete" data-kp-confirm-label="Delete for good">Delete</button></div>
      <template id="${uid}-lost-reissue"><ul class="kp-type-confirm__list"><li>The current token stops working at once; the program must be given the new one.</li></ul></template>
      <template id="${uid}-lost-delete">${lost}</template>
      <p class="kp-dialog__note">Revoking keeps the row and its history; deleting does not. Re-issuing keeps the name and the history.</p></section>
  </div>
  <div class="kp-dialog__actions"><button type="button" class="kp-button" data-kp-dialog-close>Close</button></div>
</dialog>`;
}

/**
 * The issue dialog: a form, and then the new token on the spot.
 * @param {string} uid @param {{ step?: 'form' | 'taken' | 'issued', open?: boolean }} o
 */
export function issueDialog(uid, { step = 'form', open = true } = {}) {
    const topics = [...new Set(DATA.clients.map((c) => c.fields.topic))];
    const usual = JSON.stringify(topics.slice(0, 3));
    const taken = step === 'taken';
    const f = DATA.clientsInfo.form_fields[0];
    const field = `<div class="kp-field"><label class="kp-field__label" for="${uid}-topic">${esc(f.label)} <span class="kp-field__required">required</span></label>
      <div class="kp-combobox kp-usual" data-kp-combobox data-kp-usual='${esc(usual)}' data-kp-add="inline" data-kp-usual-label="Used before" data-kp-all="open"><input class="kp-combobox__input kp-field__input" id="${uid}-topic" name="topic" type="text" role="combobox" aria-expanded="false" aria-controls="${uid}-topic-list" autocomplete="off" placeholder="${esc(f.placeholder)}" value="${step === 'form' ? '' : 'alerts'}" />
      <ul class="kp-combobox__list" id="${uid}-topic-list" role="listbox" hidden>${topics.map((t) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${esc(t)}">${esc(t)}</li>`).join('')}</ul>
      <p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p></div>
      <p class="kp-field__help">${esc('What this client’s messages are about. Pick one used before, or type a new one.')}</p></div>`;
    if (step === 'issued') {
        return `<dialog class="kp-dialog ck-issue" id="${uid}-dialog" aria-labelledby="${uid}-title"${open ? ' open' : ''}>
  <div class="kp-dialog__head"><h2 class="kp-dialog__title" id="${uid}-title">kyu-runner is ready</h2><span class="kp-badge kp-badge--success">active</span><p class="kp-dialog__description">Copy the token now and give it to the program; it stays available on the client’s page.</p></div>
  <div class="kp-dialog__body"><section class="kp-dialog__section"><h3 class="kp-dialog__heading">Token</h3><div class="kp-secret" data-kp-secret data-kp-secret-ttl="0" data-kp-secret-label="Token of kyu-runner" data-kp-secret-value="${SAMPLE_TOKEN}"></div></section>
  <section class="kp-dialog__section"><h3 class="kp-dialog__heading">First call</h3><div class="kp-command" data-kp-command="bash" data-kp-command-where="the machine that will call this service"><pre class="kp-command__code"><code>curl -sS -X POST http://127.0.0.1:8080/v1/messages \\
  -H "Authorization: Bearer $CLIENT_TOKEN" -d '{}'</code></pre></div>
  <p class="kp-dialog__note">The client’s page will say “first request seen” as soon as it calls.</p></section></div>
  <div class="kp-dialog__actions"><button type="button" class="kp-button" data-kp-dialog-close>Done</button><button type="button" class="kp-button kp-button--primary">Open the client</button></div>
</dialog>`;
    }
    return `<dialog class="kp-dialog ck-issue" id="${uid}-dialog" aria-labelledby="${uid}-title"${open ? ' open' : ''}>
  <form class="kp-form" data-kp-form novalidate id="${uid}-form">
  <div class="kp-dialog__head"><h2 class="kp-dialog__title" id="${uid}-title">Issue a client</h2><p class="kp-dialog__description">Give the program a name you will recognise in the logs, such as home-assistant.</p></div>
  <div class="kp-dialog__body">
    <div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
    <div class="kp-field"><label class="kp-field__label" for="${uid}-name">Name <span class="kp-field__required">required</span></label><input class="kp-field__input" type="text" id="${uid}-name" name="name" required pattern="[A-Za-z0-9._\\-]{1,64}" value="${taken ? 'home-assistant' : ''}" placeholder="home-assistant"${taken ? ' aria-invalid="true"' : ''} /><p class="kp-field__help">Letters, digits, dots, underscores and hyphens; 1 to 64 characters.</p><span class="kp-field__error" data-kp-field-error${taken ? '' : ' hidden'}>${taken ? 'A client named home-assistant already exists. Pick another name, or open that client.' : ''}</span></div>
    ${field}
  </div>
  <div class="kp-dialog__actions"><button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>${flashButton('Issue token', { kind: 'primary', words: 'Issued,Refused', attrs: 'type="submit" data-kp-submit' })}</div>
  </form>
</dialog>`;
}

/**
 * The first client: what to do, step by step, and what the service has seen.
 * @param {string} uid @param {{ step?: 1 | 2 | 3 | 4 }} o
 */
export function onboardingPage(uid, { step = 1 } = {}) {
    const st = (/** @type {number} */ i) => (i < step ? 'done' : i === step ? 'running' : 'pending');
    const items = [
        ['Issue a client', 'A name for the program, and what its messages are about.', '8 s'],
        ['Give it the token', 'Copy the command or the token and run it where the program lives.', ''],
        ['Wait for its first request', step >= 3 ? 'Listening… this page looks every 5 seconds.' : 'This page looks for the first call by itself.', ''],
    ];
    const list = `<ol class="kp-steplist" aria-label="Wiring up the first client" data-ck-steps>${items
        .map(
            ([title, note, time], i) =>
                `<li class="kp-steplist__item" data-state="${step === 4 ? 'done' : st(i + 1)}" data-kp-step-id="s${i + 1}"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">${esc(title)}</span><span class="kp-steplist__note">${esc(i === 2 && step === 4 ? 'home-assistant called 8 s ago: 202 Accepted' : note)}</span></span>${time && step > i + 1 ? `<time class="kp-steplist__time">${esc(time)}</time>` : ''}</li>`,
        )
        .join('')}</ol>`;
    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none">
  ${header(uid, { title: 'Clients', about: 'Every program that calls this service has its own token, so you can switch one off without touching the rest.', fresh: false, actions: `<button type="button" class="kp-button kp-button--primary" data-kp-dialog="${uid}-issue-dialog">Issue a client</button>` })}
  <div class="kp-ops__body">
    <section class="kp-card" data-kp-span="6" aria-labelledby="${uid}-t1">${cardHead(`${uid}-t1`, 'Wire up your first client', 'Three steps. The last one finishes by itself when the program calls.')}${list}
      ${step === 4 ? '<div class="kp-row ck-actions"><a class="kp-button kp-button--primary" href="#clients">Open the list</a></div>' : ''}</section>
    <section class="kp-card" data-kp-span="6" aria-labelledby="${uid}-t2">${cardHead(`${uid}-t2`, 'What a client is', 'The same token never goes to two programs.')}
      <div class="kp-empty" data-kp-art="${step === 4 ? 'done' : 'nomatch'}"><p class="kp-empty__title">${step === 4 ? 'Connected' : 'No clients yet'}</p><p class="kp-empty__body">${step === 4 ? 'The first request arrived. The list shows the client, when it last called and how often.' : 'A client is one program with its own token. Switch one off without touching the others.'}</p></div></section>
  </div>
</div>`;
}

/* -------------------------------------------------------------------------------------------------- PASSKEYS -- */

/**
 * The passkeys page.
 * @param {string} uid
 * @param {{ state?: 'list' | 'empty' | 'one' | 'http', confirm?: 'dialog' | 'type-name' }} o
 */
export function passkeysPage(uid, { state = 'list', confirm = 'dialog' } = {}) {
    const https = state !== 'http';
    const rows = state === 'empty' ? [] : state === 'one' ? [DATA.passkeys[0]] : DATA.passkeys;
    const guard = https
        ? ''
        : `<div class="kp-ops__attention"><div class="kp-alert kp-alert--warning" role="alert"><span class="kp-alert__what">This page is not on HTTPS</span><span class="kp-alert__why">The browser will not create or use a passkey on plain HTTP.</span><span class="kp-alert__remedy"><span class="kp-alert__remedy-label">What now</span> Open the dashboard at https://inbox.example.lan, the address the service was told to expect.</span><span class="kp-alert__actions"><a class="kp-button" href="#https">Open the HTTPS address</a></span></div></div>`;
    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none" data-ck-state="${state}">
  ${header(uid, {
      title: 'Passkeys',
      about: 'Sign in from your password manager or your phone instead of typing the login token.',
      actions: `<button type="button" class="kp-button kp-button--primary" data-kp-dialog="${uid}-register"${https ? '' : ' disabled data-kp-disabled-reason="Passkeys only work on HTTPS"'}>Register this device</button>`,
      more: ['Register on another device|Scan a code with your phone'],
  })}
  ${guard}
  <div class="kp-ops__body"><section class="kp-card" data-kp-span="12" aria-labelledby="${uid}-ways">${cardHead(`${uid}-ways`, 'Ways to sign in', 'Every way into this dashboard. The login token always works, so you cannot lock yourself out.')}
    <div class="kp-passkeys" id="${uid}-list" data-kp-passkeys data-kp-protect-last="off" data-kp-confirm="${confirm}" data-kp-never-used-after="90" data-ck-passkeys="${json({ rows })}"></div>
    <p class="kp-lede ck-token-note" data-kp-lede-measure="full">The login token always works. It is set in the service’s settings, not here, so it is not a row you can remove.</p></section></div>
  <dialog class="kp-dialog ck-register" id="${uid}-register" aria-labelledby="${uid}-register-title">
    <div class="kp-dialog__head"><h2 class="kp-dialog__title" id="${uid}-register-title">Register this device</h2><p class="kp-dialog__description">Your browser will ask for a fingerprint, a face or a security key.</p></div>
    <div class="kp-dialog__body"><div class="kp-field"><label class="kp-field__label" for="${uid}-label">Name</label><input class="kp-field__input" id="${uid}-label" type="text" maxlength="64" value="Firefox on Linux" /><p class="kp-field__help">So you can tell your devices apart in the list.</p></div></div>
    <div class="kp-dialog__actions"><button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>${flashButton('Register', { kind: 'primary', words: 'Registered,Refused' })}</div>
  </dialog>
</div>`;
}

/** The other-device card: a QR code of this dashboard's own address and the three steps. @param {string} uid @param {{ state?: 'ready' | 'loading' | 'expired' }} o */
export function qrPage(uid, { state = 'ready' } = {}) {
    const steps = `<ol class="kp-steplist" aria-label="Register on a phone"><li class="kp-steplist__item" data-state="done"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Scan the code</span><span class="kp-steplist__note">It opens this dashboard on your phone.</span></span></li><li class="kp-steplist__item" data-state="pending"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Log in once with the token</span><span class="kp-steplist__note">The phone is not signed in yet.</span></span></li><li class="kp-steplist__item" data-state="pending"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">Press Register this device</span><span class="kp-steplist__note">From then on it signs in with its fingerprint or face.</span></span></li></ol>`;
    const qr =
        state === 'loading'
            ? '<div class="kp-qr" data-kp-qr data-kp-qr-state="loading" data-kp-qr-label="Address of this dashboard"></div>'
            : `<div class="kp-qr" data-kp-qr data-kp-qr-value="https://inbox.example.lan/passkeys" data-kp-qr-label="Address of this dashboard" data-kp-qr-caption="link" data-kp-qr-size="lg"${state === 'expired' ? ' data-kp-qr-expires="2020-01-01T00:00:00Z"' : ''}></div>`;
    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none">
  ${header(uid, { title: 'Passkeys', about: 'Sign in from your password manager or your phone instead of typing the login token.', actions: '' })}
  <div class="kp-ops__body">
    <section class="kp-card" data-kp-span="6" aria-labelledby="${uid}-q">${cardHead(`${uid}-q`, 'Register on another device', 'A passkey belongs to the device that made it, so register from that device.')}${qr}</section>
    <section class="kp-card" data-kp-span="6" aria-labelledby="${uid}-s">${cardHead(`${uid}-s`, 'What happens next', 'Three steps on the other device.')}${steps}</section>
  </div>
</div>`;
}

/* ---------------------------------------------------------------------------------------------- LOGIN, ERROR -- */

/**
 * The login page: a brand, a card, no navigation, and what the service says about itself before anyone is in.
 * @param {string} uid
 * @param {{ state?: 'ready' | 'wrong' | 'busy', passkeys?: boolean }} o
 */
export function loginPage(uid, { state = 'ready', passkeys = true } = {}) {
    const wrong = state === 'wrong';
    const busy = state === 'busy';
    const healthy = DATA.healthz.status === 'ok';
    const body = `<div class="ck-login">
  <section class="ck-login__intro" aria-labelledby="${uid}-t">
    <h1 id="${uid}-t" class="kp-page-header__title">Log in to inbox</h1>
    <p class="kp-lede" data-kp-lede-measure="normal">Paste the login token once; this browser then keeps you signed in. Programs that call the service do not log in: each has its own token on the Clients page.</p>
    <p class="ck-login__state"><span class="kp-health" data-state="${healthy ? 'ok' : 'down'}"><span class="kp-health__dot" aria-hidden="true"></span> The service is ${healthy ? 'healthy' : 'degraded'}</span> <span class="kp-text-muted">· version ${esc(DATA.healthz.version)} · up <time class="kp-ago" data-kp-ago data-kp-ago-verb="since" datetime="${agoStamp(28920)}">since 8 h ago</time></span></p>
  </section>
  <section class="kp-card ck-login__card" aria-labelledby="${uid}-c">
    <h2 class="kp-card__title" id="${uid}-c">Sign in</h2>
    ${wrong ? `<div class="kp-alert kp-alert--destructive" role="alert"><span class="kp-alert__what">That token is not right</span><span class="kp-alert__why">It does not match the service’s login token.</span><span class="kp-alert__remedy"><span class="kp-alert__remedy-label">What now</span> Copy it again from the service’s environment file, without spaces around it.</span></div>` : ''}
    ${passkeys ? `<div class="ck-login__passkey">${flashButton('Log in with a passkey', { kind: 'primary', words: 'Signed in,Refused' })}<p class="kp-field__help">Uses your password manager, your phone or a security key.</p></div><p class="ck-or" aria-hidden="true"><span>or with the token</span></p>` : ''}
    <form method="post" action="/login" class="kp-form" id="${uid}-form">
      <div class="kp-field"><label class="kp-field__label" for="${uid}-token">Login token</label>
        <div class="ck-token"><input class="kp-field__input" type="password" id="${uid}-token" name="token" required autocomplete="current-password" placeholder="Paste the token" ${wrong ? 'aria-invalid="true" aria-describedby="' + uid + '-err" value="wrong-token-value"' : ''} /><button type="button" class="kp-button kp-button--ghost" data-ck-peek aria-pressed="false">Show</button></div>
        <p class="kp-field__help" id="${uid}-caps" data-ck-caps hidden>Caps Lock is on.</p></div>
      <label class="kp-switch ck-remember"><input class="kp-switch__input" type="checkbox" role="switch" name="remember" value="1" /><span class="kp-switch__state" aria-hidden="true"></span><span>Keep me signed in on this browser for 30 days</span></label>
      <div class="kp-row ck-actions"><button type="submit" class="kp-button ${passkeys ? '' : 'kp-button--primary'}"${busy ? ' aria-busy="true" disabled' : ''}>${busy ? 'Logging in…' : 'Log in'}</button></div>
    </form>
  </section>
</div>`;
    return app(uid, 'login', body, { anonymous: true });
}

/** @type {Record<number, { reason: string, message: string, remedy: string, art: string, why: string }>} */
export const ERRORS = {
    403: { reason: 'Forbidden', message: 'You are not allowed to do that', remedy: 'Log in again, or ask whoever runs this service for access.', art: 'locked', why: 'The request came from an address this service does not trust.' },
    404: { reason: 'Not found', message: 'That passkey no longer exists', remedy: 'Open the Passkeys page to see the ones that are left.', art: 'nomatch', why: 'It was removed, perhaps from another browser.' },
    500: { reason: 'Internal server error', message: 'The service could not finish that', remedy: 'Try again in a moment. Nothing was changed.', art: 'error', why: 'Something went wrong on the service’s side.' },
    503: { reason: 'Service unavailable', message: 'The service is not ready', remedy: 'Wait a minute and reload; the health check on the status page says which part is down.', art: 'offline', why: 'A part it needs did not answer.' },
};

/**
 * The error page: one centred plate, the way back, and what to copy into a bug report.
 * @param {string} uid @param {{ status?: 403 | 404 | 500 | 503 }} o
 */
export function errorPage(uid, { status = 403 } = {}) {
    const e = ERRORS[status];
    const rid = `req-${status}-7f3a91c2`;
    const body = `<div class="kp-ops ck-ops" data-kp-ops-sticky="none">
  ${header(uid, { title: `${status} · ${e.reason}`, about: 'The request was refused before it reached the page you were on. Nothing was changed.', actions: '<a class="kp-button kp-button--primary" href="#top">Back to the dashboard</a>' })}
  <div class="kp-ops__body"><section class="kp-card ck-error" data-kp-span="12" aria-labelledby="${uid}-e">
    <div class="kp-empty" data-kp-art="${e.art}"><h2 class="kp-empty__title" id="${uid}-e">${esc(e.message)}</h2><p class="kp-empty__body">${esc(e.why)} ${esc(e.remedy)}</p>
      <div class="kp-row ck-actions"><button type="button" class="kp-button" data-ck-back>Go back</button><a class="kp-button" href="#status">Open the status page</a></div></div>
    <dl class="kp-kv kp-kv--lines ck-error__facts"><div class="kp-kv__row"><dt>Request</dt><dd><span class="kp-copyable"><span class="kp-copyable__value" id="${uid}-rid">${rid}</span><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-copyable__button" data-kp-copy="${uid}-rid">Copy</button></span></dd></div><div class="kp-kv__row"><dt>When</dt><dd>${esc(fmt(NOW))}</dd></div></dl>
  </section></div>
</div>`;
    return app(uid, status === 404 ? 'passkeys' : 'status', body);
}

export { NAV };
