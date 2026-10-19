// research/app-homelab-backups: the firewall's sample data (mock) and the reading of it, in the shapes the dashboard reads
// today (admin/web/js/fwview.js: StackFw, RuleRow, Cell). The host works the cells out from both ends' rules, first match
// wins; this file does the same sum from the rules below so the matrix, the trace and the rule table can never disagree.

/** @typedef {{ key: string, ct: number, ip: string, policyIn: 'DROP' | 'ACCEPT', policyOut: 'DROP' | 'ACCEPT', declared: boolean, enforced: boolean, matches: boolean, mgmt: string | null }} FwStack */
/** @type {FwStack[]} */
export const FW_STACKS = [
    { key: 'traefik', ct: 104, ip: '10.20.0.104', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: true, matches: true, mgmt: null },
    { key: 'jellyfin', ct: 106, ip: '10.20.0.106', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: true, matches: true, mgmt: 'web interface 8096 open to the whole LAN' },
    { key: 'vaultwarden', ct: 107, ip: '10.20.0.107', policyIn: 'DROP', policyOut: 'DROP', declared: true, enforced: true, matches: true, mgmt: null },
    { key: 'syncthing', ct: 108, ip: '10.20.0.108', policyIn: 'ACCEPT', policyOut: 'ACCEPT', declared: false, enforced: false, matches: true, mgmt: 'web interface 8384 and ssh 22 open to the whole LAN' },
    { key: 'kyu', ct: 109, ip: '10.20.0.109', policyIn: 'DROP', policyOut: 'DROP', declared: true, enforced: true, matches: true, mgmt: null },
    { key: 'immich', ct: 110, ip: '10.20.0.110', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: false, matches: false, mgmt: null },
    { key: 'paperless', ct: 111, ip: '10.20.0.111', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: true, matches: true, mgmt: null },
    { key: 'almanac', ct: 112, ip: '10.20.0.112', policyIn: 'DROP', policyOut: 'DROP', declared: true, enforced: true, matches: true, mgmt: null },
    { key: 'metrics', ct: 113, ip: '10.20.0.113', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: true, matches: false, mgmt: null },
    { key: 'inbox', ct: 118, ip: '10.20.0.118', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: true, matches: true, mgmt: null },
    { key: 'admin', ct: 120, ip: '10.20.0.120', policyIn: 'DROP', policyOut: 'ACCEPT', declared: true, enforced: true, matches: true, mgmt: null },
];
export const FW = new Map(FW_STACKS.map((s) => [s.key, s]));
export const FW_KEYS = FW_STACKS.map((s) => s.key);

/** The firewall is in force when the file declares one and pve enforces it. @param {FwStack} s */
export const inForce = (s) => s.declared && s.enforced;

/**
 * The stack's state in the dashboard's words (fwState in fwview.js).
 * @param {FwStack} s @returns {{ tone: 'ok' | 'warn' | 'bad', word: string }}
 */
export function fwState(s) {
    if (!s.declared) return { tone: 'bad', word: 'no firewall' };
    if (!s.enforced) return { tone: 'warn', word: 'declared but not in force' };
    if (!s.matches) return { tone: 'warn', word: 'live differs from files' };
    return { tone: 'ok', word: 'in force' };
}

/** @typedef {{ stack: string, ct: number, n: number, dir: 'in' | 'out', action: 'ACCEPT' | 'DROP', peer: string, peers: string[], proto: string, ports: string, note: string, enabled: boolean }} Rule */

/** The intended paths: [from, to, ports, why]. Rules on both ends are written from these. @type {[string, string, string, string][]} */
const LINKS = [
    ['traefik', 'jellyfin', '8096', 'media web'],
    ['traefik', 'paperless', '8000', 'documents web'],
    ['traefik', 'vaultwarden', '80', 'password vault web'],
    ['traefik', 'metrics', '3000', 'dashboards web'],
    ['traefik', 'kyu', '8080', 'message hub web'],
    ['traefik', 'almanac', '8090', 'calendar hub web'],
    ['traefik', 'inbox', '8025', 'inbox web'],
    ['traefik', 'admin', '8443', 'admin dashboard'],
    ['metrics', 'traefik', '8082', 'scrape the proxy'],
    ['metrics', 'jellyfin', '9102', 'scrape the exporter'],
    ['metrics', 'kyu', '9102', 'scrape the exporter'],
    ['metrics', 'almanac', '9102', 'scrape the exporter'],
    ['metrics', 'paperless', '9102', 'scrape the exporter'],
    ['metrics', 'inbox', '9102', 'scrape the exporter'],
    ['metrics', 'admin', '9102', 'scrape the exporter'],
    ['paperless', 'inbox', '993', 'read the scan mailbox'],
    ['kyu', 'almanac', '8090', 'push events to the calendar'],
    ['kyu', 'inbox', '8025', 'post a message'],
    ['almanac', 'kyu', '8080', 'ask for events'],
    ['traefik', 'immich', '2283', 'photos web'],
    ['metrics', 'immich', '9102', 'scrape the exporter'],
    ['admin', 'immich', '22', 'dashboard ssh'],
    ['admin', 'traefik', '22', 'dashboard ssh'],
    ['admin', 'jellyfin', '22', 'dashboard ssh'],
    ['admin', 'vaultwarden', '22', 'dashboard ssh'],
    ['admin', 'kyu', '22', 'dashboard ssh'],
    ['admin', 'paperless', '22', 'dashboard ssh'],
    ['admin', 'almanac', '22', 'dashboard ssh'],
    ['admin', 'metrics', '22', 'dashboard ssh'],
    ['admin', 'inbox', '22', 'dashboard ssh'],
];
/** `almanac` asks kyu for events, but the file never let it out: the stopped-at-source story. */
const UNWRITTEN_OUT = new Set(['almanac>kyu']);

/** @type {Rule[]} */
export const RULES = [];
{
    /** @type {Map<string, number>} */
    const n = new Map();
    /** @param {Omit<Rule, 'n' | 'ct' | 'enabled'>} r */
    const add = (r) => {
        const s = /** @type {FwStack} */ (FW.get(r.stack));
        if (!s.declared) return;
        const key = `${r.stack}:${r.dir}`;
        n.set(key, (n.get(key) ?? 0) + 1);
        RULES.push({ ...r, n: n.get(key) ?? 1, ct: s.ct, enabled: s.enforced });
    };
    add({ stack: 'traefik', dir: 'in', action: 'ACCEPT', peer: 'internet', peers: [], proto: 'tcp', ports: '80, 443', note: 'public web, forwarded by the router' });
    add({ stack: 'admin', dir: 'in', action: 'ACCEPT', peer: 'LAN 10.20.0.0/24', peers: [], proto: 'tcp', ports: '8443', note: 'the dashboard for people on the LAN' });
    add({ stack: 'vaultwarden', dir: 'in', action: 'DROP', peer: 'IoT VLAN 10.30.0.0/24', peers: [], proto: '', ports: '', note: 'nothing from IoT devices, whatever else says' });
    add({ stack: 'metrics', dir: 'in', action: 'DROP', peer: 'internet', peers: [], proto: '', ports: '', note: 'never reachable from outside' });
    add({ stack: 'jellyfin', dir: 'in', action: 'ACCEPT', peer: 'LAN 10.20.0.0/24', peers: [], proto: 'tcp', ports: '8096', note: 'the TV and phones stream directly' });
    add({ stack: 'syncthing', dir: 'in', action: 'ACCEPT', peer: 'LAN 10.20.0.0/24', peers: [], proto: 'tcp', ports: '8384, 22000', note: 'web interface and sync (no firewall declared: shown for reference)' });
    for (const [from, to, port, why] of LINKS) {
        const f = /** @type {FwStack} */ (FW.get(from));
        const t = /** @type {FwStack} */ (FW.get(to));
        if (f.policyOut === 'DROP' && !UNWRITTEN_OUT.has(`${from}>${to}`))
            add({ stack: from, dir: 'out', action: 'ACCEPT', peer: to, peers: [to], proto: 'tcp', ports: port, note: why });
        if (t.policyIn === 'DROP') add({ stack: to, dir: 'in', action: 'ACCEPT', peer: from, peers: [from], proto: 'tcp', ports: port, note: why });
    }
    RULES.sort((a, b) => FW_KEYS.indexOf(a.stack) - FW_KEYS.indexOf(b.stack) || (a.dir === b.dir ? a.n - b.n : a.dir === 'in' ? -1 : 1));
}

/** What runs on pve but is in no file: a rule somebody added by hand. @type {Rule[]} */
const LIVE_ONLY = [
    { stack: 'metrics', ct: 113, n: 9, dir: 'in', action: 'ACCEPT', peer: 'admin', peers: ['admin'], proto: 'tcp', ports: '9090', note: 'added by hand on 12/10/2026, in no file', enabled: true },
];

/** @param {Rule} r the ports as tcp-prefixed words */
const portsOf = (r) => r.ports.split(/,\s*/).filter(Boolean).map((p) => `${r.proto || 'tcp'} ${p}`);

/**
 * What can `from` open on `to`: both ends' rules, first match wins. Pure.
 * @typedef {{ from: string, to: string, state: 'open' | 'some' | 'none', allowed: string[], stoppedAtSource: string[] }} Cell
 * @param {string} from @param {string} to @returns {Cell}
 */
export function cellOf(from, to, mode = 'live') {
    const f = /** @type {FwStack} */ (FW.get(from));
    const t = /** @type {FwStack} */ (FW.get(to));
    // "live" is what pve enforces now; "files" is what the stack files declare (every declared firewall in force, nothing added by hand)
    const on = (/** @type {FwStack} */ s) => (mode === 'files' ? s.declared : inForce(s));
    const rules = mode === 'files' ? RULES : RULES.concat(LIVE_ONLY);
    if (!on(t)) return { from, to, state: 'open', allowed: [], stoppedAtSource: [] };
    const into = rules.filter((r) => r.dir === 'in' && r.stack === to && r.action === 'ACCEPT' && r.peers.includes(from)).flatMap(portsOf);
    if (!on(f) || f.policyOut === 'ACCEPT') return { from, to, state: into.length ? 'some' : 'none', allowed: into, stoppedAtSource: [] };
    const out = rules.filter((r) => r.dir === 'out' && r.stack === from && r.action === 'ACCEPT' && r.peers.includes(to)).flatMap(portsOf);
    const allowed = into.filter((p) => out.includes(p));
    const stopped = into.filter((p) => !out.includes(p));
    return { from, to, state: allowed.length ? 'some' : 'none', allowed, stoppedAtSource: stopped };
}

export const CELLS = FW_KEYS.flatMap((from) => FW_KEYS.filter((to) => to !== from).map((to) => cellOf(from, to)));
export const CELL = new Map(CELLS.map((c) => [`${c.from}>${c.to}`, c]));
/** The same pairs read from the stack files. */
export const FILE_CELLS = FW_KEYS.flatMap((from) => FW_KEYS.filter((to) => to !== from).map((to) => cellOf(from, to, 'files')));
export const FILE_CELL = new Map(FILE_CELLS.map((c) => [`${c.from}>${c.to}`, c]));
/** Whether the live reading of a pair differs from the files'. @param {string} from @param {string} to */
export const differs = (from, to) => {
    const a = /** @type {Cell} */ (CELL.get(`${from}>${to}`));
    const b = /** @type {Cell} */ (FILE_CELL.get(`${from}>${to}`));
    return a.state !== b.state || a.allowed.join() !== b.allowed.join();
};

/** The text inside a matrix square: the ports, "all" for a target without a firewall. @param {Cell} c */
export const cellText = (c) => (c.state === 'some' ? c.allowed.map((p) => p.replace(/^tcp /, '')).join(', ') : c.state === 'open' ? 'all' : '');

/** A cell as one sentence. @param {Cell} c */
export function cellWords(c) {
    if (c.state === 'open') return `${c.from} may open every port on ${c.to}: ${c.to} has no firewall in force.`;
    if (c.state === 'some')
        return `${c.from} may open ${c.allowed.join(', ')} on ${c.to}${c.stoppedAtSource.length ? `; ${c.stoppedAtSource.join(', ')} is dropped on the way out of ${c.from}` : ''}.`;
    return c.stoppedAtSource.length
        ? `${c.to} would let ${c.from} in on ${c.stoppedAtSource.join(', ')}, but ${c.from} drops it on the way out.`
        : `${c.from} is blocked on every port to ${c.to}.`;
}

/** The rules that decide one pair: the source's outbound rules naming the target, the target's inbound rules naming the source. @param {string} from @param {string} to */
export const rulesFor = (from, to) =>
    RULES.filter((r) => (r.dir === 'out' && r.stack === from && r.peers.includes(to)) || (r.dir === 'in' && r.stack === to && r.peers.includes(from)));

/** The KPI figures. */
export function kpis() {
    const protectedN = FW_STACKS.filter((s) => fwState(s).tone === 'ok').length;
    return {
        protected: protectedN,
        total: FW_STACKS.length,
        none: FW_STACKS.filter((s) => !s.declared).map((s) => s.key),
        differs: FW_STACKS.filter((s) => s.declared && (!s.enforced || !s.matches)).map((s) => s.key),
        openTargets: [...new Set(CELLS.filter((c) => c.state === 'open').map((c) => c.to))],
        open: CELLS.filter((c) => c.state === 'open').length,
        rules: RULES.length,
        drop: RULES.filter((r) => r.action === 'DROP').length,
    };
}

/**
 * The pair as the packet meets it: out of the source, in at the target. Hops for js/path-trace.js.
 * @param {string} from @param {string} to @param {string} port 'any' or 'tcp 22'
 * @returns {import('../../js/path-trace.js').TraceHop[]}
 */
export function hopsOf(from, to, port) {
    const f = /** @type {FwStack} */ (FW.get(from));
    const t = /** @type {FwStack} */ (FW.get(to));
    const c = cellOf(from, to);
    const probe = port === 'any' ? 'every port' : port;
    const hit = (/** @type {string[]} */ ps) => (port === 'any' ? ps.length > 0 : ps.includes(port));
    /** @type {import('../../js/path-trace.js').TraceHop[]} */
    const hops = [{ title: from, note: `source, ${f.ip}`, verdict: 'allowed' }];
    // out of the source
    if (!inForce(f) || f.policyOut === 'ACCEPT') {
        hops.push({ title: `Firewall out of ${from}`, note: `${probe}: nothing holds it back`, verdict: 'allowed', rule: `${from} out policy ${inForce(f) ? 'ACCEPT' : '(no firewall)'}` });
    } else {
        const outs = RULES.filter((r) => r.dir === 'out' && r.stack === from && r.action === 'ACCEPT' && r.peers.includes(to));
        const ok = hit(outs.flatMap(portsOf));
        hops.push({
            title: `Firewall out of ${from}`,
            note: ok ? `${probe}: let out` : `${probe}: no outbound rule lets it out`,
            verdict: ok ? 'allowed' : 'refused',
            rule: ok ? `${from} out #${outs[0]?.n ?? 1}` : `${from} out policy DROP`,
        });
    }
    // in at the target
    if (!inForce(t)) {
        hops.push({ title: `Firewall in at ${to}`, note: `${probe}: ${to} has no firewall in force, everything is let in`, verdict: 'allowed', rule: `${to} in (no firewall)` });
    } else {
        const ins = RULES.filter((r) => r.dir === 'in' && r.stack === to && r.action === 'ACCEPT' && r.peers.includes(from));
        const ok = hit(ins.flatMap(portsOf));
        hops.push({
            title: `Firewall in at ${to}`,
            note: ok ? `${probe}: let in` : `${probe}: no inbound rule lets it in`,
            verdict: ok ? 'allowed' : 'refused',
            rule: ok ? `${to} in #${ins[0]?.n ?? 1}` : `${to} in policy DROP`,
        });
    }
    hops.push({ title: to, note: `target, ${t.ip}`, verdict: 'allowed' });
    return hops;
}

/** Every port the rules mention, for the port picker. */
export const ALL_PORTS = [...new Set(CELLS.concat(FILE_CELLS).flatMap((c) => c.allowed))].sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
