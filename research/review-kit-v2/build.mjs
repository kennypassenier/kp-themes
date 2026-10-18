// Builds research/review-kit-v2/demo.html from options.json: one section per option of the review dialog's layout (and, as
// the other modules join the kit, of its process helpers). Edit options.json or this builder, never the page.
//
// Every section shows the real dialog, live, at a real window size (research/kpadopt56-choose opened at its first step in an
// iframe, scaled to fit), with the option switchable by the section's own controls; the default the reviewer wants is a
// choice set of the kit (DEMO_RULES ch. 7: only the default is asked, every option is real, "Remove this option" is the
// kit's own). Formal only.
//
// Run: node research/review-kit-v2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const here = new URL('./', import.meta.url);
const registry = JSON.parse(readFileSync(new URL('options.json', here), 'utf8'));
const ID = 'review-kit-v2';
const esc = (/** @type {string} */ t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
/** Keeps the round id when the page is rebuilt, so a rebuild reopens nothing. */
const round = (() => {
    try {
        return /"round":\s*"([^"]+)"/.exec(readFileSync(new URL('demo.html', here), 'utf8'))?.[1] ?? `${ID}-${randomUUID()}`;
    } catch {
        return `${ID}-${randomUUID()}`;
    }
})();

const sizes = [
    ['desktop', '1920 × 1080', 1920, 1080],
    ['laptop', '1280 × 800', 1280, 800],
    ['phone', '390 × 844', 390, 844],
];

const sections = registry.options.map((/** @type {any} */ o, /** @type {number} */ at) => {
    const group = registry.groups.find((/** @type {any} */ g) => g.id === o.group) ?? { id: o.group, title: o.group };
    const first = !registry.options.slice(0, at).some((/** @type {any} */ p) => p.group === o.group);
    const choice = [
        {
            id: `default-${o.id}`,
            label: `Default for “${o.title}” in the dialogs you open`,
            default: o.default === 'on' ? 'on' : 'off',
            options: [
                { value: 'on', label: 'On', hint: 'The dialog opens with this option switched on; you can still switch it off in the View menu.' },
                { value: 'off', label: 'Off, as it is today', hint: 'The dialog opens as it does now; you can still switch it on in the View menu.' },
            ],
        },
    ];
    const pressed = true; // the preview starts with the option on so what it does is on screen; the default is the choice below
    return `
            <section
                class="rk2-sec"
                id="${o.id}"
                data-review-item="${o.id}"
                data-review-components="review-dialog"
                data-review-title="${esc(o.title)}"
                data-review-topic="${o.group}"
                ${first ? `data-review-topic-title="${esc(group.title)}"` : ''}
                data-review-choices='${JSON.stringify(choice).replace(/'/g, '&#39;')}'
                aria-labelledby="h-${o.id}"
            >
                <div class="rk2-sec__head">
                    <h2 id="h-${o.id}">${esc(o.title)}</h2>
                    <p>${esc(o.what)} <span class="rk2-sec__why">${esc(o.why)}</span></p>
                    <p class="rk2-sec__source">${esc(o.source)}</p>
                </div>
                <div data-review-controls data-review-controls-for="${o.id}-preview">
                    <div role="group" aria-label="This option" class="rk2-actions">
                        <b>This option:</b>
                        <button type="button" class="kp-button" aria-pressed="${!pressed}" data-rk2-set="off">Off, as today</button>
                        <button type="button" class="kp-button" aria-pressed="${pressed}" data-rk2-set="on">On</button>
                    </div>
                    <div role="group" aria-label="Window size" class="rk2-actions">
                        <b>Window:</b>
                        ${sizes.map(([id, label], i) => `<button type="button" class="kp-button" aria-pressed="${i === 1}" data-rk2-size="${id}">${label}</button>`).join('\n                        ')}
                    </div>
                    <div role="group" aria-label="The other options" class="rk2-actions">
                        <b>The other options:</b>
                        <button type="button" class="kp-button" aria-pressed="true" data-rk2-others="none">Off</button>
                        <button type="button" class="kp-button" aria-pressed="false" data-rk2-others="all">All on</button>
                    </div>
                </div>
                <div class="rk2-preview" id="${o.id}-preview" data-rk2-option="${o.id}" data-rk2-default="${o.default === 'on' ? 'on' : 'off'}">
                    <div class="rk2-preview__view">
                        <iframe class="rk2-preview__frame" title="The review dialog with “${esc(o.title)}”, live" tabindex="-1" inert></iframe>
                    </div>
                </div>
                <div class="rk2-expected">
                    <p><b>Expected:</b></p>
                    <ul>
                        ${o.expected.map((/** @type {string} */ e) => `<li>${e}</li>`).join('\n                        ')}
                    </ul>
                </div>
                <div data-review-look>
                    <p data-for="formal">${esc(o.look)}</p>
                </div>
            </section>`;
});

const html = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The review dialog, v2: the component first</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <script>
            (function () {
                var d = document.documentElement;
                var t = new URLSearchParams(location.search).get('theme');
                try {
                    if (t) localStorage.setItem('theme', t);
                    t = t || localStorage.getItem('theme');
                } catch (e) {}
                if (t) d.setAttribute('data-theme', t);
                var theme = d.getAttribute('data-theme') || 'formal';
                document.write('<link rel="stylesheet" href="../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main rk2-page" data-rk2-page="${registry.previewPage}" data-rk2-registry='${JSON.stringify(Object.fromEntries(registry.options.map((/** @type {any} */ o) => [o.id, { kind: o.kind ?? 'ui', store: o.store, page: o.page, open: o.open, actions: o.actions, seed: o.seed, reveal: o.reveal }]))).replace(/'/g, "&#39;")}'>
            <header class="rk2-intro">
                <h1>The review dialog, v2: the component first</h1>
                <p class="cat-intro">
                    Kenny, 2026-10-18 15:26: "the component itself is the most important part of the screen, so it must always be clearly
                    visible and central." Each section below is one improvement to the dialog you judge in. It shows the real dialog, live, at a
                    real window size; switch the option under <b>This option</b> to see it off and on, and under <b>The other options</b> to
                    see it among the rest. The dialog's own <b>View</b> menu switches the same options in every review, and keeps them for you.
                </p>
                <p>
                    The question under each preview is only which default the dialogs should open with; every option stays switchable, and
                    nothing is asked that you must answer. Until you choose, all other reviews look as they did.
                </p>
            </header>
${sections.join('\n')}
        </main>
        <script type="application/json" data-review-round>
            { "round": "${round}", "received": [] }
        </script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
writeFileSync(new URL('demo.html', here), html);
console.log(`demo.html: ${registry.options.length} section(s), round ${round}`);
