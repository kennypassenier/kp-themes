// research/app-homelab-backups: the Shell and host-log sample data (mock): the targets of the console, a small command
// emulator and the host log ring (2000 lines from 03:00 to 14:05 on 19/10/2026), in the shapes the dashboard reads
// (shellTargets(), act.jobs, the log ring with sources and levels). Nothing runs anywhere.

import { NOW } from './hostdata.js';
import { GUESTS } from './hostdata.js';

const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
/** @param {number} ms */
export const hms = (ms) => {
    const d = new Date(ms);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
/** @param {number} ms dd/mm/yyyy HH:mm:ss */
export const stamp = (ms) => {
    const d = new Date(ms);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${hms(ms)}`;
};

/** The targets of the console: the host first, then every container. */
export const TARGETS = [{ value: 'pve', label: 'pve (host)' }].concat(
    GUESTS.filter((g) => g.kind === 'stack').map((g) => ({ value: String(g.vmid), label: `${g.name} · CT ${g.vmid}` })),
);

// ── the host log ring ─────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ i: number, ts: number, source: string, level: 'info' | 'warn' | 'error', text: string }} Line */
export const SOURCES = ['homelab-host', 'restic', 'traefik', 'jellyfin', 'immich', 'kyu', 'almanac', 'inbox'];
const FIRST = Date.parse('2026-10-19T03:00:00+02:00');
const SPAN = NOW - FIRST;
/** @param {number} n */
const rnd = (n) => {
    let x = Math.imul(n + 0x9e3779b9, 2654435761) >>> 0;
    x ^= x >>> 15;
    x = Math.imul(x, 2246822519) >>> 0;
    return (x >>> 0) / 4294967296;
};
const MSG = {
    'homelab-host': ['nightly plan step finished', 'reading stack state', 'ping answered in 4 ms', 'doctor read complete', 'job queue empty'],
    restic: ['snapshot saved', 'repository check passed', 'pruned 3 old snapshots', 'lock refreshed'],
    traefik: ['router jellyfin@docker answered 200', 'certificate renewed for *.kp-soft.dev', 'router paperless@docker answered 200', 'config reloaded'],
    jellyfin: ['library scan finished', 'transcode session started', 'playback stopped', 'user signed in'],
    immich: ['thumbnail job finished', 'asset uploaded', 'machine learning request answered', 'sidecar written'],
    kyu: ['message delivered to almanac', 'event queued', 'pump round finished', 'message posted to inbox'],
    almanac: ['calendar synced', 'event written to Google Calendar', 'token refreshed', 'sync finished'],
    inbox: ['mail fetched', 'mailbox idle', 'message stored', 'search index updated'],
};
/** The ring, oldest first. @type {Line[]} */
export const LOG = Array.from({ length: 2000 }, (_, i) => {
    // lines thicken around the nightly round at 03:00 to 03:30
    const u = i / 2000;
    const ts = FIRST + Math.floor(SPAN * (u < 0.18 ? (u / 0.18) * 0.045 : 0.045 + ((u - 0.18) / 0.82) * 0.955));
    const m = (ts - FIRST) / 60000;
    const r = rnd(i);
    const source = m < 32 && r < 0.45 ? 'restic' : /** @type {string} */ (SOURCES[Math.floor(rnd(i + 7) * SOURCES.length)]);
    /** @type {Line['level']} */
    let level = rnd(i + 3) < 0.012 ? 'warn' : 'info';
    let text = /** @type {string} */ (MSG[/** @type {keyof typeof MSG} */ (source)][Math.floor(rnd(i + 11) * 4)]);
    if (m >= 11 && m < 17 && source === 'restic' && r < 0.7) {
        level = 'error';
        text = 'inbox: write failed, disk quota exceeded';
    } else if (m >= 100 && m < 112 && source === 'almanac' && rnd(i + 5) < 0.6) {
        level = 'warn';
        text = 'Google Calendar answered 429, retrying in 30 s';
    } else if (m >= 600 && m < 640 && source === 'traefik' && rnd(i + 9) < 0.7) {
        level = 'error';
        text = 'router grafana@docker answered 502, backend did not respond';
    } else if (level === 'warn') text = `${text} (slow: 4.1 s)`;
    return { i: i + 1, ts, source, level, text };
});

// ── the command emulator ──────────────────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} command @param {string} context
 * @param {{ rebootRefused?: boolean, execOn?: boolean }} [opts]
 * @returns {import('../../js/console.js').ConsoleJob}
 */
export function simulate(command, context, opts = {}) {
    const host = context === 'pve' ? 'pve' : (TARGETS.find((t) => t.value === context)?.label.split(' ·')[0] ?? context);
    return {
        update(handler) {
            /** @type {number[]} */
            const timers = [];
            const done = (/** @type {import('../../js/console.js').ConsoleChange} */ change, /** @type {number} */ ms) => timers.push(window.setTimeout(() => handler(change), ms));
            const c = command.trim();
            if (c === 'uptime') done({ state: 'ok', code: 0, output: ` ${hms(NOW)} up 41 days,  3:12,  1 user,  load average: 0.42, 0.38, 0.35` }, 300);
            else if (c === 'hostname') done({ state: 'ok', code: 0, output: host }, 150);
            else if (c.startsWith('df')) done({ state: 'ok', code: 0, output: 'Filesystem            Size  Used Avail Use% Mounted on\n/dev/mapper/pve-root   94G   50G   40G  56% /\n/dev/mapper/pve-data  930G  676G  254G  73% /var/lib/vz' }, 350);
            else if (c === 'pct list')
                done({ state: 'ok', code: 0, output: `VMID       Status     Lock         Name\n${GUESTS.filter((g) => g.kind === 'stack').map((g) => `${String(g.vmid).padEnd(10)} ${g.status.padEnd(10)} ${(g.lock === '—' ? '' : g.lock).padEnd(12)} ${g.name}`).join('\n')}` }, 500);
            else if (c.startsWith('ls ')) done({ state: 'failed', code: 2, output: `ls: cannot access '${c.slice(3)}': No such file or directory` }, 300);
            else if (c === 'restic snapshots') {
                handler({ state: 'running', output: 'repository 8c3a1f0e opened (version 2)\n' });
                for (let n = 1; n <= 8; n++) done({ state: 'running', append: `${stamp(NOW - n * 86400000).slice(0, 16)}  ${n === 1 ? 'last night' : `${n} nights ago`}  /srv/${host}  ${(1.2 + n / 10).toFixed(1)} GiB\n` }, n * 450);
                done({ state: 'ok', code: 0, append: '8 snapshots\n' }, 4200);
            } else if (c === 'journalctl -f') {
                handler({ state: 'running', output: '-- Logs begin at 19/10/2026 03:00:01 --\n' });
                for (let n = 1; n <= 24; n++) done({ state: 'running', append: `${hms(NOW + n * 2000)} homelab-host: ${MSG['homelab-host'][n % 5]}\n` }, n * 400);
                done({ state: 'ok', code: 0, append: '^C\n' }, 10400);
            } else if (/^(reboot|shutdown)/.test(c)) {
                if (opts.rebootRefused !== false) done({ state: 'refused', error: `${c.split(' ')[0] === 'reboot' ? 'Rebooting' : 'Shutting down'} ${host} from the dashboard is not allowed.`, remedy: 'Do it over ssh, so you can watch it come back; the guests start by themselves.' }, 400);
                else done({ state: 'ok', code: 0, output: `Broadcast message: ${host} is going down for reboot` }, 600);
            } else if (/^(rm|mkfs|dd|kill)\b/.test(c)) done({ state: 'ok', code: 0, output: c.startsWith('rm') ? '' : `${c.split(' ')[0]}: done` }, 500);
            else done({ state: 'failed', code: 127, output: `bash: ${c.split(' ')[0]}: command not found` }, 250);
            // the handler keeps the timers; a cancel would clear them
            void timers;
        },
        cancel() {},
    };
}

/** Words every console of the page offers on Tab. */
export const COMPLETE = ['uptime', 'hostname', 'df -h /', 'pct list', 'restic snapshots', 'journalctl -f', 'ls /missing', 'rm -rf /srv/tmp', 'reboot'];
