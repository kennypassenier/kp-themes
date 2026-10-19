// research/chassis-kit-pages/sample.js: the rows the capture does not hold, in the shape the service answers.
//
// The running example service (chassis-rs 3.8.0) had 3 clients, 3 requests, no problems, no passkeys (a passkey needs HTTPS and
// a real authenticator) and keeps no uptime history. A page cannot be judged on three rows, so these are MORE rows of the same
// shape, with sample values. Every section that shows them says so; nothing here is a new field except where a section's
// "What the implementation needs" names it (a passkey's `current`, an uptime history).

/** The demo's clock: the moment every "ago" and "idle for" is counted from, so nothing here reads the real clock. */
export const NOW = Date.parse('2026-10-19T09:41:00+02:00');

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
/** @param {number} back */
const at = (back) => new Date(NOW - back).toISOString().replace(/\.\d+Z$/, 'Z');

/**
 * @param {string} id @param {string} name @param {string} topic @param {number} issuedDaysAgo
 * @param {number | null} usedAgo milliseconds ago, or null for never @param {number} uses @param {{ revokedDaysAgo?: number, messages?: number }} [o]
 */
function client(id, name, topic, issuedDaysAgo, usedAgo, uses, { revokedDaysAgo, messages = uses } = {}) {
    return {
        id: `${id}0000-0000-4000-8000-000000000000`.slice(0, 36),
        name,
        active: revokedDaysAgo === undefined,
        issued_at: at(issuedDaysAgo * DAY),
        revoked_at: revokedDaysAgo === undefined ? null : at(revokedDaysAgo * DAY),
        last_used_at: usedAgo === null ? null : at(usedAgo),
        uses,
        fields: { topic },
        declared: [topic],
        extra: [String(messages)],
        actions: [],
    };
}

/** The shape of passkeys: `PasskeyView` of chassis-rs, plus `current` (the proposal: which one is this browser's). */
const passkey = (/** @type {string} */ id, /** @type {string} */ label, /** @type {number} */ createdDaysAgo, /** @type {number | null} */ usedAgo, current = false) => ({
    id,
    label,
    created_at: at(createdDaysAgo * DAY),
    last_used_at: usedAgo === null ? null : at(usedAgo),
    current,
});

const HOURS = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', hour: '2-digit', hourCycle: 'h23' });

/** 48 hourly periods, oldest first: up, one degraded hour, the hour of the restart, then up since the service started. */
function uptime() {
    const periods = [];
    for (let back = 47; back >= 0; back--) {
        const hour = HOURS.format(new Date(NOW - back * HOUR));
        const label = `${hour}:00`;
        const state = back === 8 ? 'down' : back === 30 ? 'degraded' : back > 40 ? 'none' : 'up';
        periods.push({ key: `h${back}`, label, state });
    }
    return periods;
}

export const SAMPLE = {
    clients: [
        client('a1c3f6d2', 'almanac', 'calendar', 61, 2 * MIN, 1842, { messages: 1790 }),
        client('b7e91c04', 'kyu', 'notices', 58, 14_000, 5120, { messages: 5031 }),
        client('c2d58a1b', 'http-switchboard', 'alerts', 40, 3 * HOUR, 310, { messages: 308 }),
        client('d9f04b77', 'homelab-dashboard', 'alerts', 33, 26 * HOUR, 88),
        client('e41a7c90', 'jellyfin-hook', 'media', 20, 9 * DAY, 12),
        client('f08b2d35', 'grafana-alerts', 'alerts', 120, 48 * DAY, 412, { messages: 397 }),
        client('0a6e9b12', 'old-script', 'alerts', 71, null, 0),
        client('1b7fa3c8', 'ntfy-bridge', 'notices', 90, 30 * DAY, 77, { revokedDaysAgo: 29 }),
    ],
    passkeys: [
        passkey('pk-4f21', 'Work laptop, Firefox', 78, 1 * HOUR, true),
        passkey('pk-90ac', 'Phone, Bitwarden', 121, 9 * DAY),
        passkey('pk-31de', 'Old tablet', 140, null),
    ],
    problems: [
        {
            what: 'The webhook address cannot be used',
            why: 'It does not start with https://, so no notification is sent.',
            remedy: 'Correct the address in the service’s environment file and restart it.',
            command: 'sudo systemctl restart inbox',
        },
        {
            what: 'The state directory is almost full',
            why: 'It holds 1.9 GB of 2 GB, and new messages are refused at the limit.',
            remedy: 'Clear old messages, or give the service a larger directory.',
        },
    ],
    uptime: uptime(),
};
