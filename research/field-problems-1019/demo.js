// research/field-problems-1019: the page's own wiring. The components are the package's; this file gives the problem lists their data.
import { setProblems } from '../../js/problems.js';

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
await ready;

const fix = (/** @type {string} */ label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kp-button';
    b.textContent = label;
    return b;
};
const problems = () => [
    {
        key: 'backup',
        severity: 'critical',
        what: 'The backups of immich failed two nights in a row',
        why: 'restic says the repository is locked by another process.',
        remedy: 'Unlock the repository on pve, then run the backup again.',
        action: fix('Run the backup now'),
    },
    {
        key: 'cert',
        severity: 'warning',
        what: 'The certificate of kp-soft.dev expires in 9 days',
        why: 'Traefik could not renew it: the Cloudflare token is read-only.',
        action: fix('Open Secrets'),
    },
    {
        key: 'loki',
        severity: 'warning',
        what: 'Loki has not received logs from kyu for 3 h',
        remedy: 'Restart Alloy on CT 109.',
        action: fix('Restart Alloy'),
        dismissible: true,
    },
    { key: 'cal', severity: 'info', what: 'The almanac calendar is not shared', why: 'Almanac cannot read it.', action: fix('Share') },
];
for (const el of document.querySelectorAll('[data-fp-problems]')) if (el instanceof HTMLElement) setProblems(el, problems(), { mode: 'each' });

// The field kinds of the form-field section: the text fields (the demo) and the check and error kinds the package also has.
for (const button of /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[data-fp-kind]')])) {
    button.addEventListener('click', () => {
        const kind = button.getAttribute('data-fp-kind');
        for (const other of document.querySelectorAll('[data-fp-kind]')) other.setAttribute('aria-pressed', String(other === button));
        for (const panel of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-fp-kind-panel]'))) {
            panel.hidden = panel.getAttribute('data-fp-kind-panel') !== kind;
        }
    });
}
