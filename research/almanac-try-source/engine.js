// research/almanac-try-source: a small JavaScript port of what Almanac's dry-run does, so the demo can show real answers.
// Source of truth, read on 19/10/2026: ~/Projects/almanac/src/shell/admin.rs (dry_run), src/core/request.rs (EventRequest,
// to_google_event, timed_window, all_day_window, to_reminders), src/core/colors.rs, src/core/profile.rs (validate_timezone).
// The refusal wording is serde's and Almanac's own; the timestamp wording of chrono is approximated. This is MOCK: the demo
// never calls a server.

/** Every field of an event call, in the order serde lists them in `unknown field ..., expected one of`. */
export const EVENT_FIELDS = [
    'title', 'start', 'external_id', 'description', 'location', 'end', 'duration_minutes', 'all_day', 'duration_days', 'busy', 'color', 'status',
    'reminders', 'timezone',
];
const REMINDER_FIELDS = ['popup_minutes_before', 'email_minutes_before', 'silent'];
const TYPES = {
    title: 'string', start: 'string', external_id: 'string?', description: 'string?', location: 'string?', end: 'string?', duration_minutes: 'i64?',
    all_day: 'bool', duration_days: 'i64?', busy: 'bool?', color: 'string?', status: 'string?', reminders: 'object?', timezone: 'string?',
};
const STATUSES = ['confirmed', 'tentative', 'cancelled'];
const PALETTE = [['1', 'lavender'], ['2', 'sage'], ['3', 'grape'], ['4', 'flamingo'], ['5', 'banana'], ['6', 'tangerine'], ['7', 'peacock'], ['8', 'graphite'], ['9', 'blueberry'], ['10', 'basil'], ['11', 'tomato']];
const MAX_REMINDERS = 5;
const MAX_REMINDER_MINUTES = 4 * 7 * 24 * 60;
const EVENT_REMEDY =
    'an event carries title, start and external_id, and optionally description, location, end or duration_minutes, all_day, duration_days, busy, color, status, reminders and timezone — see docs/USER_GUIDE.md';

/** The steps a refusal leaves unreached: no verdict, so the trace shows them as not reached (or not measured). */
const AFTER = {
    profile: [{ title: 'Profile', note: 'finds the source\'s profile' }],
    event: [{ title: 'Event', note: 'checks every field of the call' }],
    calendar: [{ title: 'Calendar', note: 'where the event would go' }],
};

/** The sources. Only home-assistant is a real profile name; the others, and every calendar id, are mock (the brief's data note). */
export const SOURCES = [
    { id: 'home-assistant', real: true, calendar: 'Almanac · Huishouden', calendarId: 'huishouden-4f2a91@group.calendar.example', timezone: 'Europe/Brussels', minutes: 60 },
    { id: 'homelab', real: false, calendar: 'Almanac · Infra', calendarId: 'infra-7c03de@group.calendar.example', timezone: 'Europe/Brussels', minutes: 60 },
    { id: 'kyu', real: false, calendar: 'Almanac · Infra', calendarId: 'infra-7c03de@group.calendar.example', timezone: 'Europe/Brussels', minutes: 60 },
    { id: 'claude-sessions', real: false, calendar: 'almanac-test', calendarId: 'almanac-test-19b8c5@group.calendar.example', timezone: 'Europe/Brussels', minutes: 60 },
];
/** @param {string} id */
export const sourceById = (id) => SOURCES.find((s) => s.id === id) ?? null;
/** @param {typeof SOURCES[number]} source */
export function profileToml(source) {
    return [
        '# A profile says where one source\'s events land. What each event is',
        '# (title, start, length, colour, all-day) comes from the call itself.',
        '',
        'schema_version = 2',
        `source_id = "${source.id}"`,
        `target_calendar_id = "${source.calendarId}"`,
        `timezone = "${source.timezone}"`,
        `default_duration_minutes = ${source.minutes}`,
        '',
    ].join('\n');
}

/** The two payloads of ~/Projects/almanac/fixtures/payloads, byte for byte, and the refusals built from the first. */
const HA = { external_id: 'switch.wasmachine', title: 'Wasmachine klaar', description: 'Cyclus voltooid', start: '2026-08-28T09:00:00+00:00' };
const EVERYTHING = {
    external_id: 'kobo/chapter/2026-09-03', title: 'Week weg', description: 'Alles wat een bron per event kan zeggen', location: 'Ardennen',
    start: '2026-09-07', all_day: true, duration_days: 5, busy: false, color: 'tomato', status: 'tentative',
    reminders: { popup_minutes_before: [30], email_minutes_before: [1440] },
};
const pretty = (v) => JSON.stringify(v, null, 2);
export const SAMPLES = {
    home: { label: 'Home Assistant sample', text: pretty(HA), real: 'fixtures/payloads/home-assistant_sample.json' },
    everything: { label: 'Everything sample', text: pretty(EVERYTHING), real: 'fixtures/payloads/everything_sample.json' },
    unknown: { label: 'Unknown field', text: pretty({ external_id: HA.external_id, title: HA.title, start: HA.start, allDay: true }) },
    notitle: { label: 'Missing title', text: pretty({ external_id: HA.external_id, description: HA.description, start: HA.start }) },
    broken: { label: 'Broken JSON', text: '{\n  "external_id": "switch.wasmachine",\n  "title": "Wasmachine klaar",\n  "start":\n}' },
    empty: { label: 'Empty', text: '' },
};

const typeName = (v) => (v === null ? 'null' : Array.isArray(v) ? 'sequence' : typeof v === 'object' ? 'map' : typeof v);
/** serde_json's wording of "what was found" in `invalid type: <found>, expected <wanted>`. */
function found(v) {
    if (v === null) return 'null';
    if (typeof v === 'string') return `string ${JSON.stringify(v)}`;
    if (typeof v === 'boolean') return `boolean \`${v}\``;
    if (typeof v === 'number') return Number.isInteger(v) ? `integer \`${v}\`` : `floating point \`${v}\``;
    return typeName(v);
}
const list = (names) => names.map((n) => `\`${n}\``).join(', ');
/** @returns {string | null} the serde wording of a wrong type, or null */
function typeFault(value, wanted) {
    const optional = wanted.endsWith('?');
    const kind = wanted.replace('?', '');
    if (value === null && optional) return null;
    if (kind === 'string' && typeof value === 'string') return null;
    if (kind === 'bool' && typeof value === 'boolean') return null;
    if (kind === 'i64' && Number.isInteger(value)) return null;
    if (kind === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value)) return null;
    if (kind === 'array' && Array.isArray(value)) return null;
    const expected = { string: 'a string', bool: 'a boolean', i64: 'i64', object: 'struct ReminderRequest', array: 'a sequence' }[kind];
    return `invalid type: ${found(value)}, expected ${expected}`;
}

/**
 * EventRequest::parse: serde_json::from_value with deny_unknown_fields. Map keys come in sorted order (serde_json without
 * preserve_order); a missing field is reported after the keys, `title` before `start`.
 * @returns {{ ok: true, request: any } | { ok: false, why: string, rule: string }}
 */
export function parseRequest(payload) {
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
        return { ok: false, why: `invalid type: ${found(payload)}, expected struct EventRequest`, rule: 'field types' };
    }
    for (const key of Object.keys(payload).sort()) {
        if (!EVENT_FIELDS.includes(key)) return { ok: false, why: `unknown field \`${key}\`, expected one of ${list(EVENT_FIELDS)}`, rule: 'no unknown fields' };
        const wrong = typeFault(payload[key], TYPES[key]);
        if (wrong) return { ok: false, why: wrong, rule: 'field types' };
        if (key === 'reminders' && payload[key] !== null) {
            const block = payload[key];
            for (const inner of Object.keys(block).sort()) {
                if (!REMINDER_FIELDS.includes(inner)) return { ok: false, why: `unknown field \`${inner}\`, expected one of ${list(REMINDER_FIELDS)}`, rule: 'no unknown fields' };
                const innerWrong = inner === 'silent' ? typeFault(block[inner], 'bool') : typeFault(block[inner], 'array');
                if (innerWrong) return { ok: false, why: innerWrong, rule: 'field types' };
                if (inner !== 'silent') {
                    const item = block[inner].find((n) => !Number.isInteger(n));
                    if (item !== undefined) return { ok: false, why: typeFault(item, 'i64'), rule: 'field types' };
                }
            }
        }
    }
    for (const required of ['title', 'start']) {
        if (!(required in payload)) return { ok: false, why: `missing field \`${required}\``, rule: 'title and start are required' };
    }
    return { ok: true, request: payload };
}

const RFC3339 = /^(\d{4})-(\d{2})-(\d{2})[Tt ](\d{2}):(\d{2}):(\d{2})(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/;
/** @returns {{ ms: number, offset: string } | { error: string }} */
function parseRfc3339(text) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return { error: 'premature end of input' };
    const m = RFC3339.exec(text);
    if (!m) return { error: 'input contains invalid characters' };
    const [, y, mo, d, h, mi, s, , zone] = m;
    if (+mo < 1 || +mo > 12 || +d < 1 || +d > 31 || +h > 23 || +mi > 59 || +s > 60) return { error: 'input is out of range' };
    const offset = /^[Zz]$/.test(zone) ? '+00:00' : zone;
    const sign = offset[0] === '-' ? -1 : 1;
    const offMin = sign * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6)));
    const ms = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s) - offMin * 60000;
    return { ms, offset };
}
/** chrono's to_rfc3339 with the same offset. */
function formatRfc3339(ms, offset) {
    const sign = offset[0] === '-' ? -1 : 1;
    const offMin = sign * (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6)));
    const t = new Date(ms + offMin * 60000);
    const p = (n) => String(n).padStart(2, '0');
    return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}T${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())}${offset}`;
}
const addDays = (date, days) => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};
const validDate = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text) && new Date(`${text}T00:00:00Z`).toISOString().slice(0, 10) === text;

/**
 * to_google_event. `fail(rule, message, remedy)` mirrors AlmanacError::ProfileValidation.
 * @returns {{ ok: true, event: any } | { ok: false, message: string, remedy: string, rule: string }}
 */
export function toGoogleEvent(request, source, origin) {
    const fail = (rule, message, remedy) => ({ ok: false, rule, message: `${origin}: ${message}`, remedy });
    if (request.title.trim() === '') return fail('title is not empty', '"title" is empty', 'send a title — an untitled calendar entry tells nobody anything');
    if (request.external_id != null && request.external_id.trim() === '') {
        return fail('external_id is not empty', '"external_id" is empty', 'send a stable id for this thing, or leave the field out and send an Idempotency-Key header instead');
    }
    const timezone = request.timezone ?? source.timezone;
    try {
        new Intl.DateTimeFormat('en', { timeZone: timezone });
    } catch {
        return fail('known time zone', `${JSON.stringify(timezone)} is not an IANA timezone name`, 'use a name like Europe/Brussels or UTC');
    }
    let start;
    let end;
    if (request.all_day) {
        const day = validDate(request.start) ? request.start : parseRfc3339(request.start).error ? null : request.start.slice(0, 10);
        if (!day) {
            return fail('start is a date', `"start" (${JSON.stringify(request.start)}) is neither a date nor a timestamp: input contains invalid characters`, 'for an all-day event send 2026-09-01, or a full timestamp on that day');
        }
        const days = request.duration_days ?? 1;
        if (days <= 0) return fail('at least one day', `"duration_days" is ${days}`, 'an all-day event covers at least one day');
        start = { date: day };
        end = { date: addDays(day, days) };
    } else {
        const from = parseRfc3339(request.start);
        if (from.error) {
            return fail('start is RFC3339', `"start" (${JSON.stringify(request.start)}) is not a valid RFC3339 timestamp: ${from.error}`, 'send an RFC3339 timestamp, e.g. 2026-09-03T21:00:00+02:00 — or set all_day = true and send a date');
        }
        let to;
        if (request.end != null) {
            to = parseRfc3339(request.end);
            if (to.error) return fail('end is RFC3339', `"end" (${JSON.stringify(request.end)}) is not a valid RFC3339 timestamp: ${to.error}`, 'send an RFC3339 timestamp, or use duration_minutes instead');
            if (to.ms <= from.ms) {
                return fail('end is after start', `"end" (${JSON.stringify(request.end)}) is at or before "start" (${JSON.stringify(request.start)})`, 'send an end after the start — Google accepts an inverted event and then shows it on no calendar at all');
            }
            to = { ms: to.ms, offset: to.offset };
        } else {
            const minutes = request.duration_minutes ?? source.minutes ?? 60;
            if (minutes <= 0) return fail('duration above zero', `"duration_minutes" is ${minutes}`, 'send a duration greater than zero, or an explicit end');
            to = { ms: from.ms + minutes * 60000, offset: from.offset };
        }
        start = { dateTime: formatRfc3339(from.ms, from.offset), timeZone: timezone };
        end = { dateTime: formatRfc3339(to.ms, to.offset), timeZone: timezone };
    }
    let colorId;
    if (request.color != null) {
        const wanted = request.color.trim().toLowerCase();
        const hit = PALETTE.find(([id, name]) => id === wanted || name === wanted);
        if (!hit) {
            return fail('Google colour', `"color": ${JSON.stringify(request.color)} is not a Google colour`, `use one of: ${PALETTE.map(([, n]) => n).join(', ')}, or a colour id 1-11`);
        }
        colorId = hit[0];
    }
    if (request.status != null && !STATUSES.includes(request.status)) {
        return fail('Google status', `"status": ${JSON.stringify(request.status)} is not a Google event status`, `use one of: ${STATUSES.join(', ')}`);
    }
    let reminders;
    if (request.reminders != null) {
        const asked = request.reminders;
        const popup = asked.popup_minutes_before ?? [];
        const email = asked.email_minutes_before ?? [];
        const count = popup.length + email.length;
        if (asked.silent && count > 0) return fail('reminder limits', '"reminders" is silent and also lists reminders', 'either set silent = true, or give the minutes — not both');
        if (count > MAX_REMINDERS) return fail('reminder limits', `"reminders" asks for ${count}; Google allows ${MAX_REMINDERS}`, `keep at most ${MAX_REMINDERS} reminders across popup and email`);
        const bad = [...popup, ...email].find((m) => m < 0 || m > MAX_REMINDER_MINUTES);
        if (bad !== undefined) return fail('reminder limits', `"reminders" asks for ${bad} minutes before`, `Google allows 0 to ${MAX_REMINDER_MINUTES} minutes (four weeks) before the start`);
        reminders = {
            useDefault: false,
            overrides: [...popup.map((minutes) => ({ method: 'popup', minutes })), ...email.map((minutes) => ({ method: 'email', minutes }))],
        };
    }
    // Same key order as the pinned fixtures/expected files; absent options are left out, as serde skips them.
    const event = { summary: request.title };
    if (request.description != null) event.description = request.description;
    if (request.location != null) event.location = request.location;
    event.start = start;
    event.end = end;
    if (colorId) event.colorId = colorId;
    if (request.busy === false) event.transparency = 'transparent';
    if (request.status != null) event.status = request.status;
    if (reminders) event.reminders = reminders;
    if (request.external_id != null) event.extendedProperties = { private: { almanac_source_id: `${source.id}:${request.external_id}` } };
    return { ok: true, event };
}

/**
 * POST /v1/debug/dry-run/{source_id} as the handler answers it.
 * `as` is 'client' to see the 403 of a client token. The 422 body carries `message` = "<message> — <remedy>" and `remedy`,
 * because the handler passes e.to_string() as the message.
 * @param {string} sourceId
 * @param {unknown} payload
 * @param {{ as?: 'admin' | 'client' }} [options]
 */
export function dryRun(sourceId, payload, { as = 'admin' } = {}) {
    const hops = [{ title: 'Call', note: `POST /v1/debug/dry-run/${sourceId}`, verdict: 'allowed' }];
    const reply = (http, body, tail) => ({ http, body, hops: [...hops, ...tail] });
    if (as === 'client') {
        hops[0] = { ...hops[0], verdict: 'refused', rule: 'admin only' };
        return {
            http: 403,
            body: { status: 'error', message: 'this needs the admin, not a client token', remedy: 'send the service\'s login token (ALMANAC_TOKEN) as `Authorization: Bearer <token>`' },
            hops: [...hops, ...AFTER.profile, ...AFTER.event, ...AFTER.calendar],
        };
    }
    const source = sourceById(sourceId);
    if (!source) {
        return reply(404, { status: 'error', message: `no profile with source_id "${sourceId}"`, remedy: 'check the loaded profiles at /v1/debug/status' }, [
            { title: 'Profile', note: `no profile with source_id "${sourceId}"`, verdict: 'refused', rule: 'known source' },
            ...AFTER.event,
            ...AFTER.calendar,
        ]);
    }
    const profile = { title: 'Profile', note: `${source.id} writes to ${source.calendar}`, verdict: 'allowed' };
    const origin = `profile ${sourceId}`;
    const parsed = parseRequest(payload);
    let refusal = null;
    let event = null;
    if (!parsed.ok) refusal = { rule: parsed.rule, message: `${origin}: ${parsed.why}`, remedy: EVENT_REMEDY };
    else {
        const made = toGoogleEvent(parsed.request, source, origin);
        if (made.ok) event = made.event;
        else refusal = made;
    }
    if (refusal) {
        return reply(
            422,
            { status: 'error', message: `${refusal.message} — ${refusal.remedy}`, remedy: refusal.remedy },
            [profile, { title: 'Event', note: refusal.message.replace(`${origin}: `, '').replace(/, expected one of .*$/, ''), verdict: 'refused', rule: refusal.rule }, ...AFTER.calendar],
        );
    }
    return reply(200, { status: 'ok', would_write_to_calendar: source.calendarId, event }, [
        profile,
        { title: 'Event', note: `${event.summary}, ${event.start.date ? 'all day' : 'timed'}`, verdict: 'allowed' },
        { title: 'Calendar', note: `${source.calendar}: would be written, nothing was`, verdict: 'allowed' },
    ]);
}

/** What the mock calendar already holds under a marker (sample data; Almanac's dry-run does not look this up, see README). */
export function calendarHolds(marker, kind) {
    if (kind === 'none') return null;
    const base = {
        summary: 'Wasmachine klaar',
        description: 'Cyclus voltooid',
        start: { dateTime: '2026-08-28T09:00:00+00:00', timeZone: 'Europe/Brussels' },
        end: { dateTime: '2026-08-28T10:00:00+00:00', timeZone: 'Europe/Brussels' },
        extendedProperties: { private: { almanac_source_id: marker } },
    };
    if (kind === 'same') return base;
    return { ...base, description: 'Cyclus gestart', end: { dateTime: '2026-08-28T09:30:00+00:00', timeZone: 'Europe/Brussels' } };
}

/** A line diff of two JSON documents (LCS), as kp-diff rows: `{ kind, oldNo, newNo, text }`. */
export function diffLines(before, after) {
    const a = before == null ? [] : JSON.stringify(before, null, 2).split('\n');
    const b = JSON.stringify(after, null, 2).split('\n');
    const n = a.length;
    const m = b.length;
    const table = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    const rows = [];
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
        if (a[i] === b[j]) rows.push({ kind: 'same', oldNo: ++i, newNo: ++j, text: b[j - 1] });
        else if (table[i + 1][j] >= table[i][j + 1]) rows.push({ kind: 'removed', oldNo: ++i, newNo: null, text: a[i - 1] });
        else rows.push({ kind: 'added', oldNo: null, newNo: ++j, text: b[j - 1] });
    }
    while (i < n) rows.push({ kind: 'removed', oldNo: ++i, newNo: null, text: a[i - 1] });
    while (j < m) rows.push({ kind: 'added', oldNo: null, newNo: ++j, text: b[j - 1] });
    return rows;
}

/** The rows grouped in hunks with `context` lines around each change, with their `@@ -a,b +c,d @@` headers. */
export function hunksOf(rows, context = 2) {
    const keep = rows.map((r, i) => r.kind !== 'same' || rows.slice(Math.max(0, i - context), i + context + 1).some((x) => x.kind !== 'same'));
    const hunks = [];
    for (let i = 0; i < rows.length; i++) {
        if (!keep[i]) continue;
        if (i > 0 && keep[i - 1] && hunks.length) hunks.at(-1).rows.push(rows[i]);
        else hunks.push({ rows: [rows[i]] });
    }
    return hunks.map((h) => {
        const old = h.rows.filter((r) => r.oldNo != null);
        const nu = h.rows.filter((r) => r.newNo != null);
        const from = (list, key) => (list.length ? list[0][key] : 0);
        return { ...h, header: `@@ -${from(old, 'oldNo')},${old.length} +${from(nu, 'newNo')},${nu.length} @@` };
    });
}

/** The calendar spec of an event as label/value rows, in the words a person reads (dd/mm/yyyy HH:MM, 24 h). */
export function specRows(event, source) {
    const rows = [];
    const stamp = (point) => {
        if (point.date) return point.date.split('-').reverse().join('/');
        const parts = Object.fromEntries(
            new Intl.DateTimeFormat('en-GB', { timeZone: point.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
                .formatToParts(new Date(point.dateTime)).map((p) => [p.type, p.value]),
        );
        return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
    };
    rows.push(['Title', event.summary]);
    if (event.start.date) {
        const last = addDays(event.end.date, -1);
        const days = (Date.parse(event.end.date) - Date.parse(event.start.date)) / 86400000;
        rows.push(['When', `${stamp(event.start)}${days > 1 ? ` to ${stamp({ date: last })}` : ''} (all day, ${days} ${days === 1 ? 'day' : 'days'})`]);
    } else {
        rows.push(['When', `${stamp(event.start)} to ${stamp(event.end).slice(11)} (${event.start.timeZone})`]);
    }
    rows.push(['Calendar', source.calendar]);
    if (event.location) rows.push(['Location', event.location]);
    if (event.description) rows.push(['Description', event.description]);
    rows.push(['Shows as', event.transparency === 'transparent' ? 'Free (does not block your time)' : 'Busy']);
    if (event.colorId) rows.push(['Colour', `${PALETTE.find(([id]) => id === event.colorId)?.[1] ?? event.colorId} (id ${event.colorId})`]);
    if (event.status) rows.push(['Status', event.status]);
    if (event.reminders) {
        const o = event.reminders.overrides;
        const mins = (m) => (m % 1440 === 0 ? `${m / 1440} ${m === 1440 ? 'day' : 'days'}` : m % 60 === 0 ? `${m / 60} h` : `${m} min`);
        rows.push(['Reminders', o.length ? o.map((r) => `${r.method} ${mins(r.minutes)} before`).join(', ') : 'None (silent)']);
    } else rows.push(['Reminders', "The calendar's defaults"]);
    if (event.extendedProperties) rows.push(['Marker', event.extendedProperties.private.almanac_source_id]);
    return rows;
}

/** @param {string} sourceId @param {unknown} payload @param {boolean} jq */
export function curlFor(sourceId, payload, jq) {
    const body = JSON.stringify(payload).replaceAll("'", "'\\''");
    return [
        `curl -sS -X POST "$ALMANAC_URL/v1/debug/dry-run/${sourceId}" \\`,
        '  -H "Authorization: Bearer $ALMANAC_TOKEN" \\',
        '  -H "Content-Type: application/json" \\',
        `  -d '${body}'${jq ? ' |' : ''}`,
        ...(jq ? ['  jq .'] : []),
    ].join('\n');
}

/** A refusal in two plain parts for an alert: what is wrong, and what to do (the API repeats the remedy inside `message`). */
export function refusalWords(body) {
    const what = body.message.endsWith(` — ${body.remedy}`) ? body.message.slice(0, -(body.remedy.length + 3)) : body.message;
    return `${what.replace(/, expected one of .*$/, '')}. ${body.remedy[0].toUpperCase()}${body.remedy.slice(1)}`;
}
