// Builds research/graph-1020/demo.html: the seven options of the network graph that let a page draw what the homelab Map draws
// (homelab gap 102), and the graph's three states with them, as ONE review page (DEMO_RULES ch. 1 and 6: one page, formal only, one
// section per option). The sections are written here, once, in one shape: what is asked, the heading and one sentence, what to expect,
// what to look at in formal, the controls above the component, and the component. demo.js wires them by their own elements and gives
// them the data of the homelab's real stacks; page.css is the frame. Run: node research/graph-1020/build.mjs (the page keeps its round
// id until the verdict is recorded).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'graph-1020';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (label, name, buttons) =>
    `<div role="group" aria-label="${label}">${buttons
        .map(([value, words, on]) => `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}" aria-pressed="${on ? 'true' : 'false'}">${words}</button>`)
        .join('')}</div>`;

/** The graph every section draws: the homelab's stacks, filled in by demo.js. */
const graph = (id, label, extra = '') => `<figure class="kp-graph" id="${id}" data-kp-graph data-kp-key="${id}" aria-label="${label}"${extra}></figure>`;
/** Every section but the first draws with the names under the nodes: at a phone width fourteen names beside the ring (the approved default) touch their neighbours, and the sections that show another option are not about that. */
const BELOW = ' data-kp-labels="below"';
const card = (inner, id = '') => `<div class="kp-card pg-card pg-graphcard"${id ? ` id="${id}"` : ''}>${inner}</div>`;

/** @type {{ id: string, title: string, wish: string, asked: string, h2: string, intro: string, expected: string[], look: string, controls: string, component: string }[]} */
const SECTIONS = [
    {
        id: 'labels-below',
        title: 'The name under the node, never cut',
        wish: 'homelab 102, part 1',
        asked:
            'The graph shortened a name that did not fit (<code>productiv…</code>) and put it beside, over or under the node by its angle. The Map draws every name whole, centred under its node. With the option the layout makes room instead of cutting: the ring is as wide as the box allows and the picture grows taller. It is an option (<code>data-kp-labels="below"</code>); names beside the nodes stay the default.',
        h2: 'Names that are never cut',
        intro: 'The homelab&rsquo;s stacks as a ring around the gateway. Put the names under the nodes, then try the long names, and look at the picture at a phone width.',
        expected: [
            '<b>Beside the node (before)</b>: names point away from the hub and the longest are cut with an ellipsis. <b>Under the node (new)</b>: every name is whole, centred under its node, none touches another or the edge.',
            '<b>Long names</b>: the ring narrows to the box and the picture grows taller until every name fits. It grows once, when the data or the width changes, and a hover or a pick never moves it.',
        ],
        look: 'Formal is a paper plate with quiet type. A name must never end in an ellipsis, and the gap between two names must be as even as the gap to the picture&rsquo;s edge.',
        controls: group('Names', 'lab-place', [['beside', 'Beside the node (before)'], ['below', 'Under the node (new)', true]]) + group('Stacks', 'lab-names', [['real', 'Real stack names', true], ['long', 'Long names']]),
        component: card(graph('gp-labels', 'The homelab stacks and what talks to what', BELOW)),
    },
    {
        id: 'chrome-inside',
        title: 'Show all and the hint inside the drawing',
        wish: 'homelab 102, part 2',
        asked:
            'Show all stood in a bar over the picture and the hint under it, in the page&rsquo;s flow. The Map keeps both inside the drawing. With the option (<code>data-kp-chrome="inside"</code>) Show all is the picture&rsquo;s top right and the hint its foot, and the ring keeps clear of both. The bar with the kinds stays above. Off by default.',
        h2: 'Everything about the picture in the picture',
        intro: 'Switch the controls between the bar and the picture, and pick two stacks so that Show all has something to clear.',
        expected: [
            '<b>Bar above (before)</b>: the kinds and Show all over the picture, the hint under it. <b>Inside the picture (new)</b>: Show all is at the top right of the picture and the hint at its foot, on the picture&rsquo;s own ground; the ring is smaller to keep clear of them.',
            '<b>Pick two stacks</b>: the two stacks and their links stay lit and Show all appears in its place. Show all keeps its place when there is nothing to show again, so the picture does not move.',
        ],
        look: 'The hint must be whole at a phone width (it wraps, never cut) and never lie over a node or a name. Show all must keep 8 px from the picture&rsquo;s edges.',
        controls: group('Show all and hint', 'chr-place', [['outside', 'Bar above (before)', true], ['inside', 'Inside the picture (new)']]) + group('Picked', 'chr-pick', [['none', 'Nothing picked', true], ['two', 'Pick media and downloader']]),
        component: card(graph('gp-chrome', 'The homelab stacks, with Show all and the hint', BELOW)),
    },
    {
        id: 'fixed-colour',
        title: 'A stack keeps its colour in every theme',
        wish: 'homelab 102, part 3',
        asked:
            'A node took its hue at the lightness and strength of the theme&rsquo;s first chart colour, so a stack changed colour from theme to theme and did not match the colour it has on other pages. With the option (<code>data-kp-colour="fixed"</code>) a node is its hue at one fixed lightness, the same in every theme; a node may also bring its own <code>colour</code>. Off by default.',
        h2: 'media is the same colour on every page',
        intro: 'Switch the colour mode, then the theme of this picture: with a fixed colour the nodes do not move. Then give the stacks colours of their own.',
        expected: [
            '<b>Theme colour (before)</b>: change the theme below and every node shifts with it (lighter on dark, stronger on cyberpunk). <b>Fixed colour (new)</b>: change the theme and the nodes stay put; only the ground and the links change.',
            '<b>Own colours</b>: each stack shows the colour the page gave it (a CSS colour on the node), in both modes; a stack with no colour of its own keeps its hue.',
        ],
        look: 'Formal&rsquo;s chart colours are a calm, mid-light set. With a fixed colour the ring must read on the formal ground as well as on dark: compare the two themes.',
        controls: group('Colour', 'col-mode', [['theme', 'Theme colour (before)', true], ['fixed', 'Fixed colour (new)']]) + group('Stacks bring', 'col-own', [['hue', 'A hue each', true], ['own', 'A colour each']]) + group('Theme of this picture', 'col-theme', [['formal', 'Formal', true], ['dark', 'Dark'], ['synthwave', 'Synthwave']]),
        component: card(graph('gp-colour', 'The homelab stacks, one colour each', BELOW), 'gp-colour-card'),
    },
    {
        id: 'arrows',
        title: 'Arrows that show who talks to whom',
        wish: 'homelab 102, part 4',
        asked:
            'Every link was a plain line, and the Map has to say which stack calls which. With the option (<code>data-kp-direction="arrows"</code>) every link ends in an arrowhead at the node it goes to, in the kind&rsquo;s colour; a dashed kind gets an open head. A link may point both ways. Off by default.',
        h2: 'From the caller to the stack it calls',
        intro: 'Turn the arrowheads on and hover or pick a stack: the heads follow the links they belong to.',
        expected: [
            '<b>Plain links (before)</b>: no heads. <b>Arrowheads (new)</b>: a head stops just short of the node, turns with the curve and has the colour of its kind; solid kinds have a filled head, dashed and dotted kinds an open one. kyu and almanac talk both ways and have a head at each end.',
            '<b>Pick downloader</b>: its links stay lit with their heads, the rest fade with theirs. Turning a kind off in the list hides its heads too.',
        ],
        look: 'The head must not touch the ring and must sit on the line, also on the bent link between kyu and almanac. A head must be clearly the colour of its kind.',
        controls: group('Links', 'dir-mode', [['none', 'Plain links (before)', true], ['arrows', 'Arrowheads (new)']]) + group('Picked', 'dir-pick', [['none', 'Nothing picked', true], ['downloader', 'Pick downloader']]),
        component: card(graph('gp-arrows', 'The homelab stacks, who calls whom', BELOW)),
    },
    {
        id: 'zoom-pan',
        title: 'Zoom and move the picture',
        wish: 'homelab 102, part 5',
        asked:
            'A busy map is too small to read. With the option (<code>data-kp-zoom</code>) the wheel or a pinch zooms about the pointer, a drag on the background moves the picture, <kbd>+</kbd>, <kbd>-</kbd> and <kbd>0</kbd> work from a node, and Zoom in, Zoom out and Reset view stand in the picture. A hover or a pick still only changes classes. Off by default.',
        h2: 'Look closer without losing the picture',
        intro: 'Turn zoom on, then scroll over the picture, drag the background, press the keys on a focused node, or use the three buttons.',
        expected: [
            '<b>Zoom off (before)</b>: nothing moves and there are no controls. <b>Zoom on (new)</b>: three buttons at the top left; the wheel zooms about the pointer, a drag moves, Shift with the arrows moves from a node, and a focus walk brings the node into view.',
            '<b>Zoom in, Zoom out, Reset</b> (here too, from the page): the buttons ease on the theme&rsquo;s own curve and not at all under reduced motion; Reset is dimmed when the view is already the first one. A drag never picks a stack.',
        ],
        look: 'Formal eases plainly. The picture must stay inside its frame at every zoom and the three buttons must keep 8 px from the frame.',
        controls: group('Zoom', 'zoom-mode', [['off', 'Zoom off (before)'], ['on', 'Zoom on (new)', true]]) + group('View', 'zoom-act', [['in', 'Zoom in'], ['out', 'Zoom out'], ['reset', 'Reset view']]),
        component: card(graph('gp-zoom', 'The homelab stacks, zoomable', `${BELOW} data-kp-zoom`)),
    },
    {
        id: 'detail-slot',
        title: 'Details of the picked stack, inside the drawing',
        wish: 'homelab 102, part 6',
        asked:
            'The Map shows what a stack is and does in a panel beside the picture. With the option (<code>data-kp-detail</code>) a picked node opens a details panel inside the picture; the page fills it through the <code>kp-graph-detail</code> event (or the <code>detail</code> hook of <code>attachGraphs</code>), and without either the package shows the node&rsquo;s description. Esc closes it first, the next Esc shows all. Off by default.',
        h2: 'Pick a stack, read about it',
        intro: 'Click a stack, or focus it and press Enter. Choose whether the page fills the panel or the package shows the description.',
        expected: [
            '<b>Page fills it</b>: the stack&rsquo;s name, what it talks to and what uses it, and a button of the page&rsquo;s own. <b>Package default</b>: the stack&rsquo;s description alone.',
            '<b>Esc</b> closes the panel and keeps the picks; <b>Esc again</b> shows all. The panel&rsquo;s Close button does the first. Picking a second stack shows that stack&rsquo;s details; taking a pick out closes them.',
        ],
        look: 'Formal&rsquo;s plate is a quiet card on the picture&rsquo;s ground; it must be opaque, stay inside the frame and scroll inside itself when the content is long.',
        controls: group('Details', 'det-mode', [['off', 'Details off (before)'], ['on', 'Details on (new)', true]]) + group('Filled by', 'det-fill', [['page', 'The page', true], ['package', 'Package default']]) + group('Open', 'det-open', [['none', 'Nothing open', true], ['media', 'Open media']]),
        component: card(graph('gp-detail', 'The homelab stacks, with their details', `${BELOW} data-kp-detail`)),
    },
    {
        id: 'own-radius',
        title: 'Your own ring and node sizes',
        wish: 'homelab 102, part 7',
        asked:
            'The ring and the nodes had fixed sizes (a ring of 36 % of the picture, nodes of 14 px) and the Map sizes its nodes by traffic. With the options (<code>data-kp-ring-radius</code>, <code>data-kp-node-radius</code>, and a <code>radius</code> or <code>weight</code> on a node) the page sets both. The defaults stay as they are.',
        h2: 'A tighter ring, bigger nodes, sized by traffic',
        intro: 'Change the ring, the base node size, and size the nodes by how much traffic each carries.',
        expected: [
            '<b>Ring</b>: small (0.26) pulls the stacks in towards the gateway, large (0.44) pushes them out to the edge of the picture. <b>Nodes</b>: 10 px, the default 14 px, or 20 px; the core and the flag ring follow.',
            '<b>By traffic</b>: media and the gateway are the biggest, syncthing the smallest; the base size scales them all and a node&rsquo;s own radius would win.',
        ],
        look: 'Formal&rsquo;s ring is a thin line: a bigger node must keep its stroke weight, and names must still clear their nodes.',
        controls: group('Ring', 'rad-ring', [['default', 'Default (0.36)', true], ['0.26', 'Small (0.26)'], ['0.44', 'Large (0.44)']]) + group('Nodes', 'rad-node', [['default', 'Default (14 px)', true], ['10', 'Small (10 px)'], ['20', 'Large (20 px)']]) + group('Sized by', 'rad-size', [['same', 'The same size', true], ['traffic', 'Traffic']]),
        component: card(graph('gp-radius', 'The homelab stacks, sized by traffic', BELOW)),
    },
    {
        id: 'states',
        title: 'Loading, empty and failed, with every option on',
        wish: 'homelab 102, the states',
        asked:
            'The graph&rsquo;s three states must keep the footprint and the look that were approved, with or without the options. Here every option is on at once (names under the nodes, Show all inside, fixed colour, arrows, zoom, details) and you walk the states; Approved look turns them all off again.',
        h2: 'Reading, nothing yet, could not read',
        intro: 'Press Loading, Empty and Failed, and switch between the approved look and every option on. The picture must not change size.',
        expected: [
            '<b>Loading</b>: the ghost of the network, drawn with the theme&rsquo;s own loading picture, with a sentence at the foot. <b>Empty</b> and <b>Failed</b>: the package&rsquo;s state plate fills the picture, large and centred; Failed has a Retry that brings the network back.',
            'Show all, the hint and the zoom buttons are not drawn over a plate. The picture is as tall in all four states for the same width.',
        ],
        look: 'Formal&rsquo;s plate is a quiet bordered card. Compare the height of Loading, Empty and Failed with Ready: they must be the same.',
        controls: group('State', 'st-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]) + group('Options', 'st-opts', [['approved', 'Approved look'], ['all', 'Every option on', true]]),
        component: card(graph('gp-states', 'The homelab stacks in every state', BELOW)),
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s, first) => `<section id="${s.id}" data-review-item="${s.id}" data-review-topic="graph"${first ? ' data-review-topic-title="Network graph options"' : ''} data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
    <div class="pg-asked"><p><b>What is asked</b> (${s.wish}): ${s.asked}</p></div>
    <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
    <div class="pg-expected"><p><b>Expected:</b></p><ul>${s.expected.map((e) => `<li>${e}</li>`).join('')}</ul></div>
    <div data-review-look><p data-for="formal">${s.look}</p></div>
    <div data-review-controls data-review-controls-for="${s.id}-component">${s.controls}</div>
    <div id="${s.id}-component" class="pg-component">${s.component}</div>
</section>`;

const problems = [];
const ids = SECTIONS.map((s) => s.id);
for (const id of new Set(ids)) if (ids.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
if (SECTIONS.length * THEMES.length > MAX_ITEMS) problems.push(`${SECTIONS.length * THEMES.length} items: more than ${MAX_ITEMS}`);
for (const s of SECTIONS) {
    const groups = (s.controls.match(/role="group"/g) ?? []).length;
    if (groups > 4) problems.push(`${s.id} has ${groups} control groups; four is the most`);
}
const body = SECTIONS.map((s, i) => asSection(s, i === 0)).join('\n\n');
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${ID}-${randomUUID()}`;

const title = 'The network graph can draw the homelab Map';
const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
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
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main pg-page">
            <header class="pg-head">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    The homelab admin dashboard draws its Map by hand because the network graph could not. These ${SECTIONS.length - 1} options and the states give it
                    everything the Map draws, so the dashboard can delete its own drawing. Everything is opt-in: a graph that is not given an option looks
                    and behaves as you approved it. ${SECTIONS.length} sections, ${SECTIONS.length} pairs, formal only; the data is the homelab&rsquo;s own stacks, mock.
                </p>
                <p>Every section says under <b>Expected</b> what you should see and what each control does.</p>
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
console.log(`${ID}: ${SECTIONS.length} items, round ${roundId}`);
