// Builds research/graph-loading-1019/demo.html: the network graph's decided loading picture, one section per theme (twelve). Kenny
// decided them in research/character-graph (decided.json, 2026-10-06 21:37) but only a generic pulse reached the package; kyu's overview
// showed it and Kenny rejected it (2026-10-19 02:38). Each is now drawn by css/<theme>-register.css from a ghost network that js/graph.js
// lays into the loading picture. They are approved pictures put into the package, so each comes back through the review dialog with a
// plain "What changed" text (DEMO_RULES ch. 7 and 9).
//
// Run: node research/graph-loading-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'graph-loading-1019';
const PAGE_THEMES = [
    'formal',
    'dark',
    'cyberpunk',
    'synthwave',
    'pastel',
    'forest',
    'blueprint',
    'solstice',
    'brutalism',
    'deco',
    'nostromo',
    'titanium',
];

/** One look-at line per theme asked. @param {string[]} themes @param {string | ((theme: string) => string)} text */
const looks = (themes, text) =>
    themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${typeof text === 'function' ? text(t) : text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string | ((theme: string) => string), body: string, components: string, themes?: string[], topic?: string, topicTitle?: string }} s
 */
const section = (s) => {
    const themes = s.themes ?? ['formal'];
    const topic = s.topic ? ` data-review-topic="${s.topic}"${s.topicTitle ? ` data-review-topic-title="${s.topicTitle}"` : ''}` : '';
    return `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="${themes.join(',')}"${topic}
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed since you approved it:</b> ${s.changed}</p></div>
    <div class="kc-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="kc-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
${looks(themes, s.look)}
    </div>
${s.body}
</section>`;
};

const NETWORK =
    '{"hub":"hub","nodes":[{"id":"hub","label":"Control centre","description":"where every reading arrives"},{"id":"a","label":"Pump house 1","description":"west ring main"},{"id":"b","label":"Pump house 2","description":"the old town"},{"id":"c","label":"Pump house 3","description":"north ring main"},{"id":"d","label":"Reservoir North","description":"level sensor"},{"id":"e","label":"Reservoir South","description":"inlet valve"},{"id":"f","label":"Weather service","description":"outside the network"}],"edges":[{"from":"a","to":"hub","kind":"telemetry"},{"from":"b","to":"hub","kind":"telemetry"},{"from":"c","to":"hub","kind":"telemetry"},{"from":"d","to":"hub","kind":"telemetry"},{"from":"e","to":"hub","kind":"telemetry"},{"from":"f","to":"hub","kind":"telemetry"}],"kinds":[{"kind":"telemetry","label":"Telemetry","hint":"Readings sent every minute","style":"solid","colour":"var(--chart-1)"}]}';

const THEMES = [
    [
        'formal',
        'The courier’s round',
        'A small pulse runs out along every link from the hub to its site, one after another round the ring, like a courier making the morning round from desk to desk.',
        'a small pulse leaves the hub along each link in turn, round the ring',
    ],
    [
        'dark',
        'A packet runs the bus',
        'A bright pulse runs out along every link from the hub to its site, one after another round the ring, like a packet running the bus.',
        'a bright pulse runs out along each link in turn',
    ],
    [
        'cyberpunk',
        'The packet race',
        'A bright packet runs out along every link at once, continuously, from the hub to the rim, over and over.',
        'a bright packet races along every link at once',
    ],
    [
        'synthwave',
        'The outrun pulse',
        'A streak of light runs out along every link at once, like headlights streaking down an outrun highway.',
        'a long streak of light runs along every link at once',
    ],
    [
        'pastel',
        'The sprinkle drift',
        'A soft dot drifts along every link at once, like sprinkles sliding down a row of candy strings.',
        'a soft dot drifts along every link at once',
    ],
    [
        'forest',
        'Fireflies trace the clearing',
        'A firefly spark runs the length of every link at once, each a little behind the last; the node it reaches glows warm for a moment.',
        'a spark runs along each link and the ring of the node it reaches glows',
    ],
    [
        'blueprint',
        'Current finds the circuit',
        'A short pulse of current runs the length of every wire at once, each a little behind the last, and the pad it reaches glows.',
        'a short pulse runs along each link and the core of the node it reaches glows',
    ],
    [
        'solstice',
        'Embers catching',
        'A small bright coal races outward along every link from the hub, and each node it reaches glows hot amber for a moment before cooling back.',
        'an amber coal races out along each link and each node it reaches flares',
    ],
    [
        'brutalism',
        'The site is taped off',
        'The picture goes black like a closed building site; every link becomes yellow-and-black hazard tape that crawls and jerks taut, every site a warning lamp whose dashed yellow ring turns in hard ticks while its light flashes orange and red.',
        'the box goes black, the links are hazard tape and the nodes warning lamps',
    ],
    [
        'deco',
        'The engraving is cut',
        'Each link is cut from a few sparse strokes into a fine, close-set line, as if a burin were engraving it, and the medallion at its far end catches a hard bevelled glint when its line is finished.',
        'each link fills from sparse strokes to a fine line and its medallion flashes a bevel',
    ],
    [
        'nostromo',
        'Blips surface round the scope',
        'Each site blinks into view and out again, one after another round the ring, the hub holding a slow steady pulse beneath them, like contacts surfacing on an old radar scope.',
        'the sites blink in turn round the ring while the hub breathes slowly',
    ],
    [
        'titanium',
        'The signal runs the harness',
        'A bright pulse runs out along every link from the hub to its part, one after another round the ring, like a signal running the wiring harness.',
        'a bright pulse runs out along each link in turn',
    ],
];

const sections = [
    section({
        id: 'graph-loading',
        title: 'Network graph while loading',
        intro: 'The network graph while its data is read, in the picture you chose for each theme.',
        themes: PAGE_THEMES,
        changed: `Before, every theme showed the same plain network fading in and out, not the picture you chose; kyu&rsquo;s overview showed it. Now each theme draws its own: ${THEMES.map(([theme, name]) => `${theme[0].toUpperCase()}${theme.slice(1)} &ldquo;${name}&rdquo;`).join('; ')}. The sentence that says it is loading stands at the foot, under the picture, so the middle stays clear.`,
        expect: [
            'The network is drawn faintly and moves in the theme&rsquo;s own way (see the line for the theme); it keeps moving as long as the page is open.',
            'The words &ldquo;Reading the network&hellip;&rdquo; stand at the foot of the box, clear of the hub and of every node, and the box is as tall as the drawn network.',
        ],
        look: (theme) => {
            const row = THEMES.find((r) => r[0] === theme);
            return `&ldquo;${row?.[1]}&rdquo;: ${row?.[3]}; the words at the foot are readable and touch nothing.`;
        },
        components: 'graph',
        body: `<div class="gl-stack"><figure class="kp-graph" data-kp-graph data-gl-graph aria-label="Pump network, loading"><script type="application/json" data-kp-graph-data>${NETWORK}</script></figure></div>`,
    }),
];

const body = sections.join('\n');
const pairs = sections.reduce((n, s) => n + (/data-review-themes="([^"]+)"/.exec(s)?.[1].split(',').length ?? 1), 0);

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^graphloading-[0-9a-f]{8}-/.test(current) ? current : `graphloading-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The network graph while it loads: the decided picture in twelve themes</title>
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
                    // A theme in the link is kept, so the catalogue's own
                    // boot, which reads the stored theme, does not undo it.
                    if (t) localStorage.setItem('theme', t);
                    t = t || localStorage.getItem('theme');
                } catch (e) {}
                if (t) d.setAttribute('data-theme', t);
                var theme = d.getAttribute('data-theme') || 'formal';
                document.write('<link rel="stylesheet" href="../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="../kpadopt56/part.css" />
        <link rel="stylesheet" href="../kpadopt56/src/kpadopt6-calm/page.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>The network graph while it loads</h1>
                <p class="cat-intro">
                    You decided a loading picture for the network graph in every theme (character-graph, 2026-10-06), but the package only had one
                    generic pulse for all of them, and kyu&rsquo;s overview showed it. Now each theme draws its own: ${pairs} pairs, one section per
                    theme. Each section says under <b>What changed since you approved it</b> which picture you chose and how the graph looked before.
                </p>
            </header>
${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
console.log(`${ID}: ${sections.length} sections, ${pairs} pairs, round ${roundId}`);
