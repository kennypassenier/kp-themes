// research/trace-diff-1019: the page's own wiring. The components are the package's; this file gives the traces their hops and the
// diff its lines.
import { setTrace } from '../../js/path-trace.js';

const HOPS = [
    { title: 'Sender: alertmanager', note: 'Posts to the hub', verdict: 'allowed', ports: 'tcp 443' },
    { title: 'Hub: kyu', note: 'Checks the profile', verdict: 'allowed', rule: 'profile-ok' },
    { title: 'Router: translate', note: 'Wants a rewritten body', verdict: 'refused', rule: 'Block unknown bodies' },
    { title: 'Destination: Home Assistant', note: 'Receives the webhook', verdict: 'allowed', ports: 'tcp 8123' },
];

for (const el of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-td-trace]')])) setTrace(el, HOPS);

// A diff whose text column has a token that cannot break at a space.
const TOKEN = 'https://hub.example.internal/v1/messages/9f3c1e52-7d4a-4b8e-a6f0-2c91d5e3b7a4/attachments/nightly-snapshot-2026-10-19.tar.zst';
const lines = [
    { kind: 'removed', n: 12, text: `    "url": "${TOKEN}",` },
    { kind: 'added', n: 12, text: `    "url": "${TOKEN}?download=1",` },
    { kind: 'removed', n: 13, text: '    "topic": "backup.done",' },
    { kind: 'added', n: 13, text: '    "topic": "backup.finished",' },
    { kind: 'added', n: 14, text: '    "retry": 3' },
];
const diff = document.querySelector('[data-td-diff]');
if (diff) {
    diff.replaceChildren(
        ...lines.map((r) => {
            const line = document.createElement('span');
            line.className = 'kp-diff__line';
            line.setAttribute('data-kind', r.kind);
            for (const [cls, text] of [
                ['kp-diff__number', String(r.n)],
                ['kp-diff__sign', r.kind === 'added' ? '+' : '-'],
                ['', r.text],
            ]) {
                const cell = document.createElement('span');
                if (cls) cell.className = cls;
                cell.textContent = text;
                line.append(cell);
            }
            return line;
        }),
    );
}
