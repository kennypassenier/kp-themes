// Builds research/hover-wheel-1019/demo.html: two gaps found by the AuDHD recipes thread (audhd-recepten 9, 8 and 18), fixed in the package.
// They change components Kenny had approved (the hover card, the wheel), so each comes back through the review dialog with a plain
// "What changed" text. Formal only: nothing here differs per theme. The page is bundled into round-3-1019 afterwards.
//
//   1. hovercard-touch   a tap opens the card on a phone, a tap outside closes it   (js/hovercard.js)
//   2. wheel-kiosk       a wheel with no controls: the wheel is the one control     (js/wheel.js, css/components.css)
//   3. wheel-resting     a choice that rests stays on the wheel, marked, never drawn (js/wheel.js, css/components.css)
//   4. wheel-answer      a tag per choice and a built-in answer card                (js/wheel.js, css/components.css)
//
// Run: node research/hover-wheel-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'hover-wheel-1019';
const PAGE_THEMES = ['formal'];

/** One look-at line per theme asked. @param {string[]} themes @param {string} text */
const looks = (themes, text) => themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string, themes?: string[], topic?: string, topicTitle?: string }} s
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


/** A labelled box in a two-column pair. @param {string} label @param {string} inner */
const pane = (label, inner) => `<div class="hw-pane"><p class="hw-pane__label">${label}</p>${inner}</div>`;

const ING = [
    ['200 g', 'Rolled oats', 'Soak overnight, or the oats stay chewy.'],
    ['2', 'Ripe bananas', 'Spotty skins are sweetest; freeze the rest.'],
    ['1 tbsp', 'Peanut butter', 'Nut-free? Sunflower seed butter works the same.'],
    ['1 tsp', 'Cinnamon', 'Fresh-ground if you have it; it lifts the whole bowl.'],
    ['1 pinch', 'Sea salt', 'Barely a pinch: it is what makes the banana taste sweeter.'],
    ['250 ml', 'Oat milk', 'Any milk works; warm it first if you like the porridge creamy.'],
    ['1 handful', 'Walnuts', 'Toast them dry in a pan for two minutes, they stay crisp longer.'],
    ['1 tbsp', 'Honey', 'Skip it for a child under one year old.'],
];
const ingredients = ING.map(
    ([amount, name, note], i) => `        <div class="kp-formgrid__row">
            <span class="kp-formgrid__label">${amount}</span>
            <div class="kp-formgrid__control"><span class="hw-ingredient" data-kp-hovercard="${note}" data-hw-ingredient="${i}">${name}</span></div>
            <p class="kp-formgrid__value">note on tap</p>
            <div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm" data-hw-tap="${i}">Tap it like a finger</button></div>
        </div>`,
).join('\n');

const sections = [
    section({
        id: 'hovercard-touch',
        title: 'Hover card: reachable with a finger',
        intro: 'The ingredient list of a recipe. Each ingredient has a note that a mouse reads by pointing; on a phone there is no pointing.',
        topic: 'hovercard',
        topicTitle: 'Hover card',
        changed:
            'The hover card ignored touch altogether, so on a phone the note behind an ingredient could not be read. Now a <b>tap</b> on an ingredient opens its note, a tap on the same ingredient or <b>anywhere outside</b> the card closes it, and a tap <b>inside</b> the card keeps it open. A tap on another ingredient moves the card there. The keyboard works as before (focus opens, Escape closes), and a link or a button used as an anchor keeps its own tap unless the page asks for two taps with <code>data-kp-touch="tap"</code>.',
        expect: [
            'On a phone: tap <b>Ripe bananas</b>, its note opens under it; tap the white page, it closes; tap <b>Cinnamon</b> while it is open, the card moves there.',
            'On a desktop: the button <b>Tap it like a finger</b> at the end of each row sends the same touch tap, so you can see it without a phone. Pointing with the mouse still opens the card after a short wait.',
        ],
        look: 'a tap opens the note under the ingredient, a tap outside closes it, and the rows stay in their four columns.',
        components: 'hovercard',
        body: `<div class="hw-wide"><div class="kp-formgrid" data-kp-formgrid-lines="lines" aria-label="Ingredients">
${ingredients}
    </div></div>`,
    }),
    section({
        id: 'wheel-kiosk',
        title: 'Wheel: a page with only the wheel',
        intro: 'The wheel over a chosen list for a page that has nothing else on it: left as it was, right with the new <code>data-kp-wheel-kiosk</code> option.',
        topic: 'wheel',
        topicTitle: 'Wheel',
        changed:
            'Until now a wheel always carried its <b>Spin</b> button in the middle, which a page for someone who should only see the wheel could not remove. The new option <code>data-kp-wheel-kiosk</code> takes the button away: the <b>wheel itself</b> is the one control. Tap it, or press Enter or Space while it has the focus, and it spins. The middle stays as a quiet plate, the line under the wheel says <b>Tap the wheel to let it choose</b>, and a screen reader hears one button, &ldquo;Spin the wheel&rdquo;. Tapping the answer spins again.',
        expect: [
            'The left wheel is as you approved it (Spin in the middle). The right one has a plain middle, nothing to press but the wheel.',
            'Tap the right wheel: it turns, stops on a name, says it. Tab to it and press Space: the same. Tapping its answer spins again.',
        ],
        look: 'the right wheel has no button anywhere, its middle is a calm plate, and both wheels keep the same size and place.',
        components: 'wheel',
        body: `<div class="hw-pair">
${pane('With the Spin button (as before)', '<div class="kp-wheel" data-kp-wheel data-hw-wheel="plain" aria-label="Tonight\'s dinner"></div>')}
${pane('Kiosk: the wheel is the control', '<div class="kp-wheel" data-kp-wheel data-hw-wheel="kiosk" data-kp-wheel-kiosk aria-label="Tonight\'s dinner"></div>')}
</div>`,
    }),
    section({
        id: 'wheel-resting',
        title: 'Wheel: a choice that is resting',
        intro: 'A list where yesterday&rsquo;s dinner and the one from two days ago are on the wheel but should not come up.',
        topic: 'wheel',
        changed:
            'A choice could only be left off the wheel (it vanished) or stay on it (it could be drawn). The new item field <code>resting: true</code> is the third state: the choice <b>stays on the wheel</b> so the list is whole, but it is stepped back (faded, a dashed edge, its name in italics, &ldquo;Resting&rdquo; when you point at it) and the wheel <b>never lands on it</b> while another choice is awake. If every choice rests, they are all in play again.',
        expect: [
            '<b>Fried rice</b> and <b>Tomato soup</b> are faded with a dashed edge and italic names; the others are as before.',
            'Press <b>Spin</b> a dozen times: the wheel stops on Curry, Pasta, Wraps or Stew, never on a resting one. The slice sizes are unchanged.',
        ],
        look: 'the two resting slices read as quieter at a glance, with dashed edges, and their names are whole.',
        components: 'wheel',
        body: `<div class="hw-pair">
${pane('Two choices resting', '<div class="kp-wheel" data-kp-wheel data-hw-wheel="resting" aria-label="Tonight\'s dinner"></div>')}
<div class="hw-pane hw-pane--note"><p class="hw-pane__label">What to look for</p>
    <dl class="hw-facts">
        <dt>Faded, dashed, italic</dt><dd>Fried rice and Tomato soup: <code>resting: true</code></dd>
        <dt>Point at a slice</dt><dd>The tooltip says the name and &ldquo;Resting&rdquo;</dd>
        <dt>Spin</dt><dd>Never lands on a resting slice</dd>
    </dl></div>
</div>`,
    }),
    section({
        id: 'wheel-answer',
        title: 'Wheel: a tag and the answer card',
        intro: 'The same dinner wheel; each choice has a short line about it (&ldquo;Oven, 45 min&rdquo;), and the answer stands in a card.',
        topic: 'wheel',
        changed:
            'The answer was two bare lines under the wheel and a choice could say nothing but its name. Now an item can carry a <code>tag</code> (a short line about it), and <code>data-kp-wheel-answer</code> turns the result into a <b>built-in answer card</b>: a bordered card with the line &ldquo;The wheel chose&rdquo;, the name, and the tag under it. The card keeps one size whether or not the choice has a tag, so nothing under it moves. Without the option the result is exactly as you approved it.',
        expect: [
            'Left: the result as before. Right: the answer card; spin and it shows the name with its tag (<b>Oven, 45 min</b>).',
            'Wraps has no tag: its card keeps the empty line, the wheel and the card do not change size.',
        ],
        look: 'the right wheel&rsquo;s result is a framed card with the name and the tag in their own lines, the same height for every choice.',
        components: 'wheel',
        body: `<div class="hw-pair">
${pane('Result as before', '<div class="kp-wheel" data-kp-wheel data-hw-wheel="plain-tags" aria-label="Tonight\'s dinner"></div>')}
${pane('Answer card (data-kp-wheel-answer)', '<div class="kp-wheel" data-kp-wheel data-hw-wheel="answer" data-kp-wheel-answer aria-label="Tonight\'s dinner"></div>')}
</div>`,
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
const roundId = current && /^hoverwheel-[0-9a-f]{8}-/.test(current) ? current : `hoverwheel-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Touch for the hover card, a kiosk and an answer card for the wheel</title>
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
                <h1>Touch for the hover card, a kiosk wheel</h1>
                <p class="cat-intro">
                    The AuDHD recipes app asked for two things the package could not do: ingredient notes that a phone can open, and a wheel for a
                    page of its own, with no controls, with choices that are resting and with a card for the answer. ${pairs} pairs in all, formal
                    only (nothing here differs per theme). Each section says under <b>What changed since you approved it</b> what is different now.
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
