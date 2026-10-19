// research/app-homelab-backups: the Host and System sample data (mock), in the shapes admin/web/js/host.js, doctor.js and
// systemview.js read: guests (GuestRow), doctor checks with a remedy, the thin pool, recent pings and the versions.

export const NOW = Date.parse('2026-10-19T14:05:00+02:00');
/** @param {number} gb */
export const gb = (gb) => `${gb.toLocaleString('en-GB', { maximumFractionDigits: 1, minimumFractionDigits: gb < 10 && gb % 1 ? 1 : 0 })} GB`;
/** @param {number} mb */
export const gib = (mb) => `${(mb / 1024).toLocaleString('en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} GiB`;

/** @typedef {{ vmid: number, name: string, stack: string | null, kind: 'stack' | 'template' | 'unmanaged', status: 'running' | 'stopped', lock: string, ramUsed: number | null, ramMax: number, cpuPct: number | null, diskWritten: number, diskSize: number }} Guest */
/** @type {Guest[]} */
export const GUESTS = [
    { vmid: 100, name: 'opnsense', stack: null, kind: 'unmanaged', status: 'running', lock: '—', ramUsed: 2140, ramMax: 4096, cpuPct: 6, diskWritten: 32, diskSize: 64 },
    { vmid: 101, name: 'home-assistant', stack: null, kind: 'unmanaged', status: 'running', lock: '—', ramUsed: 2890, ramMax: 4096, cpuPct: 9, diskWritten: 38, diskSize: 64 },
    { vmid: 104, name: 'traefik', stack: 'traefik', kind: 'stack', status: 'running', lock: '—', ramUsed: 210, ramMax: 1024, cpuPct: 2, diskWritten: 1.6, diskSize: 8 },
    { vmid: 106, name: 'jellyfin', stack: 'jellyfin', kind: 'stack', status: 'running', lock: '—', ramUsed: 3050, ramMax: 4096, cpuPct: 31, diskWritten: 188, diskSize: 400 },
    { vmid: 107, name: 'vaultwarden', stack: 'vaultwarden', kind: 'stack', status: 'running', lock: '—', ramUsed: 96, ramMax: 512, cpuPct: 1, diskWritten: 1.8, diskSize: 8 },
    { vmid: 108, name: 'syncthing', stack: 'syncthing', kind: 'stack', status: 'running', lock: '—', ramUsed: 140, ramMax: 1024, cpuPct: 1, diskWritten: 0.9, diskSize: 8 },
    { vmid: 109, name: 'kyu', stack: 'kyu', kind: 'stack', status: 'running', lock: '—', ramUsed: 88, ramMax: 512, cpuPct: 1, diskWritten: 6.4, diskSize: 16 },
    { vmid: 110, name: 'immich', stack: 'immich', kind: 'stack', status: 'running', lock: '—', ramUsed: 6420, ramMax: 8192, cpuPct: 18, diskWritten: 241, diskSize: 300 },
    { vmid: 111, name: 'paperless', stack: 'paperless', kind: 'stack', status: 'running', lock: 'backup', ramUsed: 1480, ramMax: 2048, cpuPct: 12, diskWritten: 41, diskSize: 80 },
    { vmid: 112, name: 'almanac', stack: 'almanac', kind: 'stack', status: 'running', lock: '—', ramUsed: 74, ramMax: 512, cpuPct: 1, diskWritten: 2.1, diskSize: 8 },
    { vmid: 113, name: 'metrics', stack: 'metrics', kind: 'stack', status: 'running', lock: '—', ramUsed: 3310, ramMax: 4096, cpuPct: 14, diskWritten: 96, diskSize: 120 },
    { vmid: 118, name: 'inbox', stack: 'inbox', kind: 'stack', status: 'running', lock: '—', ramUsed: 260, ramMax: 1024, cpuPct: 2, diskWritten: 22, diskSize: 32 },
    { vmid: 120, name: 'admin', stack: 'admin', kind: 'stack', status: 'running', lock: '—', ramUsed: 190, ramMax: 1024, cpuPct: 3, diskWritten: 4.2, diskSize: 16 },
    { vmid: 996, name: 'debian-13-homelab-v4', stack: null, kind: 'template', status: 'stopped', lock: 'template', ramUsed: null, ramMax: 1024, cpuPct: null, diskWritten: 1.2, diskSize: 8 },
];
export const PROMISED_GB = GUESTS.reduce((a, g) => a + g.diskSize, 0);
export const WRITTEN_GB = GUESTS.reduce((a, g) => a + g.diskWritten, 0);
export const POOL_GB = 930;

export const ROOT = { total: 94, parts: [['System and packages', 18.4], ['LXC templates and ISO images', 11.2], ['Logs', 6.1], ['Restic cache', 9.8], ['Docker layers on the host', 4.6]] };

/** @typedef {{ id: string, label: string, state: 'ok' | 'warn' | 'failed', detail: string, fix?: string }} Check */
/** @type {Check[]} */
export const DOCTOR = [
    { id: 'api', label: 'Proxmox API', state: 'ok', detail: 'answered in 38 ms' },
    { id: 'root', label: 'Root disk', state: 'ok', detail: '50.1 GB of 94 GB used (53 %)' },
    { id: 'pool', label: 'Thin pool', state: 'warn', detail: `${PROMISED_GB.toLocaleString('en-GB')} GB promised on a ${POOL_GB} GB pool (${Math.round((PROMISED_GB / POOL_GB) * 100)} %)`, fix: 'Shrink or move the 400 GB disk of jellyfin, or add a disk to the pool, before it fills.' },
    { id: 'time', label: 'Clock', state: 'ok', detail: 'in step with the time server (0.02 s)' },
    { id: 'thermal', label: 'Temperature', state: 'ok', detail: 'CPU 54 °C, limit 85 °C' },
    { id: 'restic', label: 'Backup repositories', state: 'ok', detail: '16 repositories answered, the newest 03:26' },
    { id: 'firewall', label: 'Firewalls', state: 'warn', detail: '8 of 11 stacks have one in force', fix: 'Declare a firewall for syncthing and put the one of immich in force.' },
    { id: 'upgrades', label: 'Unattended upgrades', state: 'failed', detail: 'apt has been locked for 3 days by process 4411', fix: 'Run "dpkg --configure -a" on pve, then read the doctor again.' },
];

/** The last 12 pings of the line from the dashboard to the host, newest last: milliseconds, or null for no answer. */
export const PINGS = [4, 4, 5, 4, 4, 38, 4, 5, null, 4, 4, 4];
/** @param {number} i */
export const pingTime = (i) => {
    const t = new Date(NOW - (PINGS.length - 1 - i) * 30000);
    return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}`;
};

/** @type {{ key: string, label: string, from: string, to: string, note: string, app?: string }[]} */
export const VERSIONS = [
    { key: 'daemon', label: 'Host daemon (homelab-host on pve)', from: '3.74.2', to: '3.75.0', note: 'Release notes: nightly rounds report per stack.' },
    { key: 'dashboard', label: 'Dashboard (CT 120)', from: '3.75.0', to: '3.75.0', note: 'Up to date.' },
    { key: 'themes', label: 'Look and feel (kp-themes)', from: '10.1.1', to: '11.0.0', note: 'Twelve themes; four were removed.' },
    { key: 'proxmox', label: 'Proxmox VE', from: '8.4.1', to: '9.0.3', note: 'A new Debian base.' },
    { key: 'immich', label: 'immich in CT 110', from: '1.118.2', to: '1.119.0', app: 'immich', note: 'A minor release of an app whose second number counts.' },
];
