// research/app-homelab-activity: the sample data (mock). The shapes follow the dashboard's own: a feed row has a stack, an
// action, an actor, a state and a start and end; a job has queued_at, started_at and finished_at. Everything is built from
// the clock at load, so "today" is always today and a running operation grows for real.

export const HOUR = 3_600_000;
export const MIN = 60_000;
export const ZONE = 'Europe/Brussels';

/** The 20 stacks of the fleet, with the container they live in when they have one. */
export const STACKS = [
    { name: 'jellyfin', ct: 106, backup: true },
    { name: 'sonarr', ct: 106, backup: true },
    { name: 'radarr', ct: 106, backup: true },
    { name: 'qbittorrent', ct: 106, backup: false },
    { name: 'immich', ct: 107, backup: true },
    { name: 'paperless', ct: 107, backup: true },
    { name: 'vaultwarden', ct: 107, backup: true },
    { name: 'syncthing', ct: 108, backup: true },
    { name: 'kyu', ct: 109, backup: true },
    { name: 'almanac', ct: 112, backup: true },
    { name: 'metrics', ct: 113, backup: false },
    { name: 'prometheus', ct: 113, backup: true },
    { name: 'grafana', ct: 113, backup: true },
    { name: 'loki', ct: 113, backup: false },
    { name: 'inbox', ct: 118, backup: true },
    { name: 'admin', ct: 120, backup: false },
    { name: 'traefik', ct: 104, backup: false },
    { name: 'crowdsec', ct: 104, backup: false },
    { name: 'uptime-kuma', ct: 110, backup: false },
    { name: 'mosquitto', ct: 111, backup: false },
];

const wallFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
});

/** The wall clock of a moment in Brussels. @param {number} ms */
export function wall(ms) {
    /** @type {Record<string, number>} */
    const p = {};
    for (const part of wallFmt.formatToParts(new Date(ms))) if (part.type !== 'literal') p[part.type] = Number(part.value);
    return { y: p.year, m: p.month, d: p.day, H: p.hour, M: p.minute, S: p.second };
}

const two = (/** @type {number} */ n) => String(n).padStart(2, '0');
/** dd/mm/yyyy HH:mm, 24-hour, Brussels. @param {number} ms */
export function when(ms) {
    const w = wall(ms);
    return `${two(w.d)}/${two(w.m)}/${w.y} ${two(w.H)}:${two(w.M)}`;
}
/** dd/mm/yyyy. @param {number} ms */
export function dayText(ms) {
    const w = wall(ms);
    return `${two(w.d)}/${two(w.m)}/${w.y}`;
}
/** The day as a sortable key, yyyy-mm-dd. @param {number} ms */
export function dayKeyOf(ms) {
    const w = wall(ms);
    return `${w.y}-${two(w.m)}-${two(w.d)}`;
}
/** A wall time the browser's Date.parse reads the same for every row (filter values). @param {number} ms */
export function isoWall(ms) {
    const w = wall(ms);
    return `${w.y}-${two(w.m)}-${two(w.d)}T${two(w.H)}:${two(w.M)}`;
}
/** Midnight (Brussels) of the day that holds `ms`. @param {number} ms */
export function midnight(ms) {
    const w = wall(ms);
    const asUtc = Date.UTC(w.y, w.m - 1, w.d, w.H, w.M, w.S);
    return Date.UTC(w.y, w.m - 1, w.d) - (asUtc - Math.floor(ms / 1000) * 1000);
}
/** 4 min 12 s, 1 h 05 min, 38 s. @param {number} s */
export function took(s) {
    const r = Math.round(s);
    if (r < 60) return `${r} s`;
    const m = Math.floor(r / 60);
    if (m < 60) return `${m} min ${two(r % 60)} s`;
    return `${Math.floor(m / 60)} h ${two(m % 60)} min`;
}

/** A seeded random: the same fleet history every load, so a number never changes between looks. @param {number} seed */
function random(seed) {
    let a = seed;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** The steps of each operation, with the share of the time each takes. */
export const STEPS = {
    'Nightly backup': [
        ['snapshot', 'Snapshot the volumes', 'Freezes the data so the copy is consistent', 0.18],
        ['upload', 'Upload to the repository', 'Sends the changed blocks to the restic repository', 0.55],
        ['verify', 'Verify the snapshot', 'Reads a sample back and compares it', 0.2],
        ['forget', 'Forget old snapshots', 'Keeps 7 daily, 4 weekly, 6 monthly', 0.07],
    ],
    'Update images': [
        ['pull', 'Pull the images', 'Fetches what changed from the registry', 0.45],
        ['stop', 'Stop the containers', 'Waits for a clean shutdown', 0.12],
        ['start', 'Start the containers', 'Recreates them on the new images', 0.2],
        ['health', 'Wait for the health check', 'The stack has to answer before this counts', 0.23],
    ],
    'Apply changes': [
        ['render', 'Render the compose file', 'Writes the stack from its settings', 0.1],
        ['validate', 'Validate', 'docker compose config must pass', 0.1],
        ['recreate', 'Recreate the containers', 'Only the services that changed', 0.5],
        ['health', 'Wait for the health check', 'The stack has to answer before this counts', 0.3],
    ],
    'Restart stack': [
        ['stop', 'Stop the containers', 'Waits for a clean shutdown', 0.3],
        ['start', 'Start the containers', 'Starts them in dependency order', 0.4],
        ['health', 'Wait for the health check', 'The stack has to answer before this counts', 0.3],
    ],
};

/** The reason a failed operation gives, per action. */
const ERRORS = {
    'Nightly backup': ['repository is already locked by another process', 'no space left on device while writing to /mnt/backup/immich'],
    'Update images': ['manifest for ghcr.io/grafana/grafana:latest not found', 'container did not become healthy within 120 s'],
    'Apply changes': ['services.web.ports contains an invalid port range'],
    'Restart stack': ['container exited with code 137 (out of memory)'],
};

/**
 * One operation of the feed.
 * @typedef {{ key: string, start: number, end: number | null, stack: string, ct: number, action: keyof typeof STEPS, by: string,
 *   state: 'done' | 'failed' | 'running', lane: 'ops' | 'nightly', series: 1 | 2 | 3, error?: string, failedAt?: string }} Op
 */

/**
 * The last 30 days of the fleet. Day 0 is today. Failures are planted so the grid has something to say: immich fails its backup
 * four nights running, paperless and vaultwarden once or twice, grafana an update.
 * @param {number} now
 * @returns {{ ops: Op[], today: number }}
 */
export function build(now) {
    const today = midnight(now);
    const rnd = random(1019);
    /** @type {Op[]} */
    const ops = [];
    let n = 1000;
    const stackOf = (/** @type {string} */ name) => STACKS.find((s) => s.name === name) ?? STACKS[0];
    /** @param {Partial<Op> & Pick<Op, 'start' | 'stack' | 'action' | 'by' | 'lane' | 'series'>} o @param {number} seconds */
    const push = (o, seconds) => {
        const failed = FAIL.has(`${o.stack}|${o.action}|${Math.round((today - midnight(o.start)) / (24 * HOUR))}`);
        const end = o.start + seconds * 1000;
        const running = end > now;
        const messages = ERRORS[o.action];
        const state = running ? 'running' : failed ? 'failed' : 'done';
        n += 1;
        ops.push({
            key: `op-${n}`,
            ct: stackOf(o.stack).ct,
            end: running ? null : end,
            state,
            ...(failed && !running
                ? { error: messages[o.stack === 'immich' ? 1 : 0] ?? messages[0], failedAt: STEPS[o.action][failedStep(o.action)][0] }
                : {}),
            ...o,
        });
    };
    /** @param {keyof typeof STEPS} action */
    const failedStep = (action) => (action === 'Nightly backup' ? 1 : action === 'Update images' ? 0 : action === 'Apply changes' ? 1 : 2);

    const FAIL = new Set([
        'immich|Nightly backup|1',
        'immich|Nightly backup|2',
        'immich|Nightly backup|3',
        'immich|Nightly backup|4',
        'vaultwarden|Nightly backup|7',
        'paperless|Nightly backup|9',
        'paperless|Nightly backup|2',
        'grafana|Update images|5',
        'admin|Apply changes|3',
        'radarr|Nightly backup|12',
        'kyu|Restart stack|0',
    ]);

    const backups = STACKS.filter((s) => s.backup);
    for (let d = 29; d >= 0; d -= 1) {
        const day = today - d * 24 * HOUR;
        // The nightly round: every stack with a backup, one after the other, from about 02:00.
        let t = day + 2 * HOUR + Math.floor(rnd() * 12) * MIN;
        for (const s of backups) {
            const seconds = 90 + Math.floor(rnd() * 380) + (s.name === 'immich' ? 420 : s.name === 'jellyfin' ? 240 : 0);
            if (t + seconds * 1000 < now || d > 0) push({ start: t, stack: s.name, action: 'Nightly backup', by: 'schedule', lane: 'nightly', series: 1 }, seconds);
            t += (seconds + 20) * 1000;
        }
        // Scheduled image updates on Tuesday and Friday at 04:30.
        const dow = new Date(Date.UTC(wall(day + 12 * HOUR).y, wall(day + 12 * HOUR).m - 1, wall(day + 12 * HOUR).d)).getUTCDay();
        if (dow === 2 || dow === 5) {
            let u = day + 4 * HOUR + 30 * MIN;
            for (const name of ['traefik', 'crowdsec', 'prometheus', 'grafana', 'loki'].slice(0, dow === 2 ? 5 : 3)) {
                const seconds = 60 + Math.floor(rnd() * 150);
                push({ start: u, stack: name, action: 'Update images', by: 'schedule', lane: 'nightly', series: 2 }, seconds);
                u += (seconds + 15) * 1000;
            }
        }
        // What Kenny did by hand, in the evening mostly.
        const count = Math.floor(rnd() * 4);
        for (let i = 0; i < count; i += 1) {
            const at = day + (8 + Math.floor(rnd() * 14)) * HOUR + Math.floor(rnd() * 60) * MIN;
            if (at > now - 5 * MIN) continue;
            const action = /** @type {keyof typeof STEPS} */ (['Update images', 'Apply changes', 'Restart stack', 'Update images'][Math.floor(rnd() * 4)]);
            const stack = STACKS[Math.floor(rnd() * STACKS.length)].name;
            const seconds = 40 + Math.floor(rnd() * 420);
            push({ start: at, stack, action, by: 'kenny', lane: 'ops', series: 3 }, seconds);
        }
    }
    // The planted ones are made sure to exist.
    const plant = (/** @type {number} */ d, /** @type {string} */ stack, /** @type {keyof typeof STEPS} */ action, /** @type {number} */ hour, /** @type {number} */ seconds) => {
        if (!ops.some((o) => o.stack === stack && o.action === action && Math.round((today - midnight(o.start)) / (24 * HOUR)) === d))
            push({ start: today - d * 24 * HOUR + hour * HOUR, stack, action, by: 'kenny', lane: 'ops', series: 3 }, seconds);
    };
    plant(5, 'grafana', 'Update images', 21.25, 96);
    plant(3, 'admin', 'Apply changes', 19.5, 74);
    // Right now: an update is running, and a kyu restart just failed.
    push({ start: now - 3 * MIN - 20_000, stack: 'prometheus', action: 'Update images', by: 'kenny', lane: 'ops', series: 3 }, 600);
    push({ start: now - 38 * MIN, stack: 'kyu', action: 'Restart stack', by: 'kenny', lane: 'ops', series: 3 }, 51);
    ops.sort((a, b) => b.start - a.start);
    return { ops, today };
}

/**
 * The steps of an operation as they ran: each with its seconds, state and note. A running one has the first steps done.
 * @param {Op} op @param {number} now
 */
export function stepsOf(op, now) {
    const plan = STEPS[op.action];
    const total = ((op.end ?? op.start + 600_000) - op.start) / 1000;
    const failedAt = op.failedAt ? plan.findIndex((p) => p[0] === op.failedAt) : -1;
    const doneBy = op.state === 'running' ? Math.floor(((now - op.start) / ((op.end ?? op.start + 600_000) - op.start)) * plan.length) : plan.length;
    return plan.map((p, i) => {
        const seconds = Math.max(2, Math.round(total * Number(p[3])));
        /** @type {'done' | 'failed' | 'pending' | 'running' | 'skipped'} */
        let state = 'done';
        if (failedAt >= 0) state = i < failedAt ? 'done' : i === failedAt ? 'failed' : 'skipped';
        else if (op.state === 'running') state = i < doneBy ? 'done' : i === doneBy ? 'running' : 'pending';
        return { id: String(p[0]), title: String(p[1]), note: String(p[2]), seconds, state };
    });
}

/**
 * The jobs queue of the Jobs page: a job is queued, then started, then finished.
 * @typedef {{ job: number, stack: string, action: string, by: string, queued: number, started: number | null, finished: number | null,
 *   state: 'queued' | 'running' | 'done' | 'failed', error?: string }} Job
 * @param {number} now @returns {Job[]}
 */
export function jobs(now) {
    const rnd = random(77);
    /** @type {Job[]} */
    const list = [];
    let job = 1030;
    const names = ['jellyfin', 'immich', 'paperless', 'vaultwarden', 'grafana', 'kyu'];
    const actions = ['Update images', 'Apply changes', 'Restart stack', 'Nightly backup'];
    for (let i = 0; i < 60; i += 1) {
        const queued = now - (22 * HOUR - i * 22 * MIN) + Math.floor(rnd() * 8 * MIN);
        if (queued > now - 14 * MIN) break;
        const wait = Math.floor(rnd() * (i % 4 === 0 ? 12 : 4) * MIN) + 8_000;
        const run = (50 + Math.floor(rnd() * 300)) * 1000;
        const stack = names[Math.floor(rnd() * names.length)];
        const failed = i === 22 || i === 41;
        job += 1;
        list.push({
            job,
            stack,
            action: actions[Math.floor(rnd() * actions.length)],
            by: i % 3 === 0 ? 'schedule' : 'kenny',
            queued,
            started: queued + wait,
            finished: queued + wait + run,
            state: failed ? 'failed' : 'done',
            ...(failed ? { error: 'container did not become healthy within 120 s' } : {}),
        });
    }
    job += 1;
    list.push({ job, stack: 'immich', action: 'Update images', by: 'kenny', queued: now - 9 * MIN, started: now - 6 * MIN - 10_000, finished: null, state: 'running' });
    job += 1;
    list.push({ job, stack: 'paperless', action: 'Apply changes', by: 'kenny', queued: now - 70_000, started: null, finished: null, state: 'queued' });
    return list;
}
