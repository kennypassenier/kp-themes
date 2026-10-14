// research/pastel-character, round 3: two of the four loading and spinner
// families Kenny kept (2026-10-14), each its original (variant 1, as he saw
// it) and five new variants of the same idea; the spinner with the same family
// and number is that variant in small.
//
//   De krabbel (a-doodle / a-spiral): a plum pen doodles in the margin, its
//   sky second pass 1.5 px beside the line and 120 ms behind it.
//   Het labeltje (a-tag / a-tagswing): a little paper tag on a plum string,
//   its sky pass a flat silhouette beside it.
//
// Kenny's point for this round: a picture respects each carrier's shape. The
// day circles of a month are never crossed: a line goes over and under them,
// round the whole week, from one day to the next above them; a tag hangs from
// a day, lands on it, is tied round it or rides beneath it. Skeleton lines and
// the busy bar have their own treatment too, and a tile, a panel, a menu row
// and a chart keep the same idea.
//
// pairs-a.css draws everything, scoped by `.pa-scene[data-pa-loading='a-…']`
// and `.pa-scene[data-pa-spinner='a-…']`. decorate() below adds the few
// elements a variant needs beyond the scene's own carriers (pen lines measured
// to their carrier, tags, strings), after removing what it added before.

/** @typedef {{ key: string, name: string, see: string, verdict: string }} Option */

/** @type {Option[]} */
export const LOADING_OPTIONS = [
    {
        key: 'a-doodle',
        name: 'De krabbel · 1 (jouw keuze)',
        see: 'Onderaan wat wacht tekent een pruimkleurige pen een lusjeslijn (eeeee) van begin naar eind, de hemelsblauwe tweede inkt 120 ms erachter; is de lijn af, dan wordt ze vanaf het begin weer weggegumd en begint de pen opnieuw (2400 ms). Een dag wordt omcirkeld, een skeletregel en de bezige balk worden lusjes.',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'a-doodle-2',
        name: 'De krabbel · 2 · het lintje dat erdoor weeft',
        see: 'Een stukje pruimkleurige lijn reist als een lintje: over de eerste dag heen, onder de tweede door, over de derde, en zo verder, altijd door de ruimte tussen twee dagen, nooit door een dag. Een skeletregel en de bezige balk zijn geregen: het lintje komt er boven en onder om de beurt uit, het stuk erachter zie je niet. Langs de onderrand van een tegel, paneel, menuregel en grafiek gaat het in en uit de rand (2400 ms per tocht).',
        verdict: 'Alternatief: de krabbel die om dingen heen gaat in plaats van ernaast; het enige beeld dat voor en achter de dingen langs loopt.',
    },
    {
        key: 'a-doodle-3',
        name: 'De krabbel · 3 · inkleuren',
        see: 'De pen kleurt met losse muntgroene streken in, rij voor rij heen en weer, zoals een kind binnen de lijntjes: de dagen een voor een (de cijfers blijven erboven leesbaar), elke skeletregel en de bezige balk van begin naar eind, een tegel, paneel en menuregel achter hun tekst, en bij de grafiek alleen het vlak onder de lijn. Is het af, dan wordt het in dezelfde volgorde weggegumd (2400 ms, de dagen samen 3000 ms).',
        verdict: 'Alternatief: wachten als inkleuren, binnen de vorm van elke drager; munt vult (G5), dus de enige krabbel die vult in plaats van lijnt.',
    },
    {
        key: 'a-doodle-4',
        name: 'De krabbel · 4 · het pijltje springt',
        see: 'De pen tekent een gebogen pijltje boven de dagen van de eerste naar de tweede, gumt het uit, dan van de tweede naar de derde, en zo verder; van de laatste dag gaat er één lange boog onder de week terug naar de eerste. Bij skeletregels loopt een pijltje van het eind van een regel tussen de regels door naar het begin van de volgende (zoals de terugkeertoets), boven de bezige balk springt het in drie boogjes naar het eind, en in een tegel tekent het één pijl met een lusje naar het eind.',
        verdict: 'Alternatief: de krabbel die wijst waar het naartoe gaat; springt van dag naar dag in een rondje om de week.',
    },
    {
        key: 'a-doodle-5',
        name: 'De krabbel · 5 · het sterretje',
        see: 'De pen zet een sterretje (*) in drie streepjes, het ene na het andere, en gumt het weer uit: rechtsboven naast elke dag om de beurt, zoals je een belangrijke datum aanstipt; op de eindkop van elke skeletregel na elkaar; op drie plaatsen in de bezige balk; op de hoek rechtsboven van een tegel, paneel en menuregel; en bij de grafiek op het hoogste punt van de lijn.',
        verdict: 'Alternatief: het aanstippen uit een planner, streepje voor streepje; het kleinste beeld, dat nooit iets bedekt.',
    },
    {
        key: 'a-doodle-6',
        name: 'De krabbel · 6 · de omtrek',
        see: 'De pen trekt een iets bibberige lijn rondom wat wacht, 4 px buiten de rand, met de klok mee vanaf de hoek linksboven en net voorbij het begin, staat even en wordt weggegumd (3000 ms). De dagen worden niet elk apart omcirkeld maar samen, met één lijn rond de hele week; de drie skeletregels krijgen samen één lijn, de bezige balk een eigen.',
        verdict: 'Alternatief: het groepje dat je in een planner omkringt; de rustigste krabbel, alleen langs de buitenkant.',
    },
    {
        key: 'a-tag',
        name: 'Het labeltje · 1 (jouw keuze)',
        see: 'Aan de bovenrand hangt aan een pruimkleurig touwtje een klein papieren labeltje met een verstevigd gaatje; het schommelt rustig heen en weer (±9°, 2400 ms) en zijn hemelsblauwe tweede inkt schommelt 120 ms achter hem aan. Elke skeletregel en de bezige balk dragen een eigen labeltje. Aan een dag hangt het nu onder de dag in plaats van over het cijfer.',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'a-tag-2',
        name: 'Het labeltje · 2 · de waslijn',
        see: 'Een doorhangend pruimkleurig touwtje met drie labeltjes die na elkaar schommelen als een golfje. De dagen hangen zelf aan de waslijn: het touwtje rust op hun bovenkant, elke dag heeft een knijpertje en schommelt even na zijn buur; de skeletregels hangen aan twee touwtjes als bordjes en zwaaien zachtjes; onder de bezige balk hangen de labeltjes aan de balk zelf (2400 ms).',
        verdict: 'Alternatief: het labeltje vermenigvuldigd tot een waslijn; de dagen worden zelf de was, zodat niets eroverheen hangt.',
    },
    {
        key: 'a-tag-3',
        name: 'Het labeltje · 3 · het draait om',
        see: 'Het labeltje hangt stil en draait dan één keer rond om zijn touwtje, zodat je even zijn hemelsblauwe achterkant ziet, en komt tot rust (2400 ms). Aan elke dag hangt onderaan een klein labeltje, en ze draaien na elkaar, van de eerste naar de laatste dag; aan het eind van elke skeletregel hangt er één, onder het eind van de bezige balk ook.',
        verdict: 'Alternatief: het prijskaartje dat je omdraait om te kijken; draaien in plaats van schommelen, en de enige variant met een achterkant.',
    },
    {
        key: 'a-tag-4',
        name: 'Het labeltje · 4 · vastgeknoopt',
        see: 'Het touwtje wordt rond iets gelegd en het labeltje valt eraan naar beneden met één zachte landing; even later wordt het losgemaakt en elders vastgeknoopt. Rond elke dag om de beurt (een lus om de dag, het labeltje eronder), rond de eindkop van elke skeletregel na elkaar, rond het eind van de bezige balk, en rond de hoek rechtsboven van een tegel, paneel en menuregel (1200 ms per knoop).',
        verdict: 'Alternatief: het labeltje dat je aan een cadeautje knoopt; het touwtje gaat altijd rond de vorm, van dag naar dag.',
    },
    {
        key: 'a-tag-5',
        name: 'Het labeltje · 5 · het jojo',
        see: 'Het labeltje zakt aan zijn touwtje naar beneden als een jojo, landt zacht op wat eronder ligt (één kleine doorschieter) en wordt weer opgehaald (2400 ms). Op elke dag landt er een, als een golfje over de week; boven elke skeletregel en boven de bezige balk zakt het op de regel neer; in een tegel en paneel zakt het van de bovenrand tot vlak boven de onderrand.',
        verdict: 'Alternatief: het labeltje dat op en neer gaat in plaats van heen en weer; landt óp de dagen in plaats van erdoor.',
    },
    {
        key: 'a-tag-6',
        name: 'Het labeltje · 6 · het kabelbaantje',
        see: 'Het labeltje rijdt aan zijn touwtje langs een kabel, stopt en zwaait door zoals een bakje van een kabelbaan, en rijdt verder. Onder de dagen hangt een kabel: het labeltje stopt onder elke dag om de beurt en rijdt dan terug naar de eerste; langs de bovenrand van een tegel, paneel en menuregel rijdt het heen en terug, onder elke skeletregel en onder de bezige balk van begin naar eind (2400 ms, de dagen 4500 ms).',
        verdict: 'Alternatief: het labeltje op reis; het enige dat van plaats verandert, langs de dagen en nooit erdoor.',
    },
];

/** @type {Option[]} */
export const SPINNER_OPTIONS = [
    {
        key: 'a-spiral',
        name: 'De krabbel · 1 (jouw keuze)',
        see: 'Een pruimkleurige pen tekent een spiraaltje van buiten naar binnen, het staat even en wordt daarna van buiten naar binnen weggegumd (1800 ms); de hemelsblauwe tweede inkt ligt ernaast.',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'a-spiral-2',
        name: 'De krabbel · 2 · het lintje dat erdoor weeft',
        see: 'Vier kleine rondjes in een kring, zoals dagen; een stukje pruimkleurig lintje reist er rond, buiten om het ene rondje en binnen om het volgende, zonder er een te raken (1800 ms per ronde).',
        verdict: 'Alternatief: laden 2 in het klein: het lintje weeft om de dagen.',
    },
    {
        key: 'a-spiral-3',
        name: 'De krabbel · 3 · inkleuren',
        see: 'Een pruimkleurig rondje wordt van boven naar onder, rij voor rij heen en weer, met muntgroene streken ingekleurd, staat even vol en wordt weggegumd (1800 ms).',
        verdict: 'Alternatief: laden 3 in het klein: één dag die wordt ingekleurd.',
    },
    {
        key: 'a-spiral-4',
        name: 'De krabbel · 4 · het pijltje springt',
        see: 'De pen tekent een rond pijltje (driekwart cirkel met een punt), gumt het uit, en tekent het volgende een derde verder gedraaid (1500 ms per pijltje).',
        verdict: 'Alternatief: laden 4 in het klein: het pijltje dat de ronde om de week maakt.',
    },
    {
        key: 'a-spiral-5',
        name: 'De krabbel · 5 · het sterretje',
        see: 'Een sterretje wordt in drie streepjes getekend, het ene na het andere, staat even en wordt weggegumd; het volgende staat een twaalfde slag gedraaid (1500 ms per sterretje).',
        verdict: 'Alternatief: laden 5 in het klein: streepje voor streepje, zodat het telt in plaats van draait.',
    },
    {
        key: 'a-spiral-6',
        name: 'De krabbel · 6 · de omtrek',
        see: 'Een klein papieren kaartje; de pen trekt er een bibberige lijn omheen, met de klok mee en net voorbij het begin, en gumt hem weer uit (1800 ms).',
        verdict: 'Alternatief: laden 6 in het klein: iets dat wacht, omkringd.',
    },
    {
        key: 'a-tagswing',
        name: 'Het labeltje · 1 (jouw keuze)',
        see: 'Een papieren labeltje met een verstevigd gaatje hangt aan een speldje en schommelt rustig heen en weer (±20°, 2400 ms per heen en terug), zijn hemelsblauwe tweede inkt ernaast.',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'a-tagswing-2',
        name: 'Het labeltje · 2 · de waslijn',
        see: 'Drie labeltjes aan een doorhangend touwtje schommelen na elkaar, als een golfje (2400 ms).',
        verdict: 'Alternatief: laden 2 in het klein: de waslijn.',
    },
    {
        key: 'a-tagswing-3',
        name: 'Het labeltje · 3 · het draait om',
        see: 'Een labeltje aan een speldje draait één keer rond om zijn touwtje (je ziet even de hemelsblauwe achterkant) en komt tot rust (2400 ms).',
        verdict: 'Alternatief: laden 3 in het klein: omdraaien in plaats van schommelen.',
    },
    {
        key: 'a-tagswing-4',
        name: 'Het labeltje · 4 · vastgeknoopt',
        see: 'Een pruimkleurig ringetje wordt rondgetekend, het labeltje valt eraan naar beneden met één zachte landing, hangt even en wordt weer losgemaakt (1800 ms).',
        verdict: 'Alternatief: laden 4 in het klein: het touwtje gaat rond, dan valt het labeltje.',
    },
    {
        key: 'a-tagswing-5',
        name: 'Het labeltje · 5 · het jojo',
        see: 'Een labeltje zakt aan zijn touwtje van een haakje naar beneden, landt zacht met één kleine doorschieter en wordt weer opgehaald (1800 ms).',
        verdict: 'Alternatief: laden 5 in het klein: op en neer, als een jojo.',
    },
    {
        key: 'a-tagswing-6',
        name: 'Het labeltje · 6 · het kabelbaantje',
        see: 'Een labeltje hangt aan een ring en rijdt er rond als een bakje van een reuzenrad: het blijft altijd rechtop hangen en zwaait een beetje na (2400 ms per ronde).',
        verdict: 'Alternatief: laden 6 in het klein: de kabel is een ring geworden.',
    },
];

/** Loading key and spinner key per variant, in the questions' order. */
export const PAIRS = LOADING_OPTIONS.map((option, at) => [option.key, SPINNER_OPTIONS[at].key]);

/* ----------------------------------------------------------- the extra DOM */

const EXTRA = 'data-pa-extra="a"';
const f = (/** @type {number} */ n) => (Math.round(n * 10) / 10).toString();

/** The points of a polyline as an SVG attribute (rounded to a tenth). */
const points = (/** @type {[number, number][]} */ list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
/** The same points as an SVG path. */
const pathOf = (/** @type {[number, number][]} */ list) => list.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');

/* Variant 1's own shapes (unchanged from round 2). */

/**
 * A row of cursive loops (a prolate cycloid) filling a lane of w x h px:
 * the margin doodle. The loops stand on the lane's foot and loop at its top.
 */
const loops = (w = 240, h = 10) => {
    const pitch = Math.max(9, h * 1.25);
    const a = pitch / (2 * Math.PI);
    const b = a * 2.1;
    const mid = h / 2;
    const amp = h / 2 - 1.5;
    const turns = Math.max(2, Math.floor((w - 2 * b) / pitch));
    const end = turns * 2 * Math.PI + Math.PI;
    /** @type {[number, number][]} */
    const out = [];
    for (let t = Math.PI; t <= end + 0.001; t += Math.PI / 10) out.push([b + a * t - b * Math.sin(t) - a * Math.PI, mid - amp * Math.cos(t)]);
    const span = out[out.length - 1][0] || 1;
    // Stretch the run to the lane's width, so the line ends where the lane ends.
    return { w, h, pts: points(out.map(([x, y]) => [1.5 + (x * (w - 3)) / span, y])) };
};

/** A date circled by hand: a little more than one turn, slightly oval. */
const scribble = () => {
    /** @type {[number, number][]} */
    const out = [];
    for (let d = -110; d <= 300; d += 10) {
        const t = (d * Math.PI) / 180;
        const r = 45 - (d + 110) * 0.012;
        out.push([50 + r * 1.04 * Math.cos(t), 51 + r * 0.94 * Math.sin(t)]);
    }
    return points(out);
};

/** An Archimedean spiral, drawn from the outside in. */
const spiral = () => {
    /** @type {[number, number][]} */
    const out = [];
    const total = 2.25 * 2 * Math.PI;
    for (let t = 0; t <= total + 0.001; t += Math.PI / 16) {
        const r = 44 - (38 * t) / total;
        out.push([50 + r * Math.cos(t - Math.PI / 2), 50 + r * Math.sin(t - Math.PI / 2)]);
    }
    return points(out);
};

/** Variant 1's pen line, stretched to its lane: its sky pass first, the plum ink on top. */
const pen = (/** @type {string} */ viewBox, /** @type {string} */ pts, cls = '') =>
    `<svg class="pa-a-pen ${cls}" ${EXTRA} viewBox="${viewBox}" preserveAspectRatio="none" aria-hidden="true" focusable="false">` +
    `<polyline class="pa-a-pen__pass" points="${pts}" pathLength="100" vector-effect="non-scaling-stroke"/>` +
    `<polyline class="pa-a-pen__ink" points="${pts}" pathLength="100" vector-effect="non-scaling-stroke"/></svg>`;

/* Shapes of the new variants, in the px of their host. */

/**
 * @typedef {{ d: string, k?: number, part?: string }} Stroke one pen stroke;
 *   `k` its place in a sequence, `part` an extra class.
 */

/**
 * Pen strokes in px coordinates of their host's padding box, on an SVG that
 * reaches `pad` px past the host on every side (so a line can go round it).
 * Each stroke is drawn twice: the sky pass, then the plum ink.
 * @param {number} w @param {number} h @param {Stroke[]} strokes
 * @param {string} cls @param {number} pad @param {string} style
 */
const ink = (w, h, strokes, cls = '', pad = 24, style = '') => {
    const body = strokes
        .map(({ d, k = 0, part = '' }) =>
            ['pass', 'ink'].map((layer) => `<path class="pa-a-px__${layer} ${part}" d="${d}" pathLength="100" style="--k: ${k}"/>`).join(''),
        )
        .join('');
    const W = w + 2 * pad;
    const H = h + 2 * pad;
    return (
        `<svg class="pa-a-px ${cls}" ${EXTRA} viewBox="${f(-pad)} ${f(-pad)} ${f(W)} ${f(H)}" ` +
        `style="left: ${f(-pad)}px; top: ${f(-pad)}px; width: ${f(W)}px; height: ${f(H)}px;${style}" aria-hidden="true" focusable="false">${body}</svg>`
    );
};

/** The same on a spinner: a 100 x 100 drawing scaled to the spinner. */
const inkSpin = (/** @type {Stroke[]} */ strokes, cls = '', extra = '') =>
    `<svg class="pa-a-sp ${cls}" ${EXTRA} viewBox="0 0 100 100" aria-hidden="true" focusable="false">${extra}${strokes
        .map(({ d, k = 0, part = '' }) =>
            ['pass', 'ink'].map((layer) => `<path class="pa-a-px__${layer} ${part}" d="${d}" pathLength="100" vector-effect="non-scaling-stroke" style="--k: ${k}"/>`).join(''),
        )
        .join('')}</svg>`;

/** A row of half circles along y from x0 to x1, over and under in turn: the woven ribbon. */
const weave = (/** @type {number} */ x0, /** @type {number} */ x1, /** @type {number} */ y, /** @type {number} */ r) => {
    const n = Math.max(2, Math.round((x1 - x0) / (2 * r)));
    const rr = (x1 - x0) / (2 * n);
    let d = `M${f(x0)} ${f(y)}`;
    for (let i = 0; i < n; i++) d += ` A${f(rr)} ${f(rr)} 0 0 ${i % 2 ? 0 : 1} ${f(x0 + (i + 1) * 2 * rr)} ${f(y)}`;
    return d;
};

/**
 * A crayon colouring in a box: short slanted strokes back and forth, in rows
 * of `row` px, the first row start to end, the next end to start, as a hand
 * colours; each row overlaps the next a little, so no paper line is left.
 */
const zigzag = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h, row = 12, step = 4.5) => {
    const rows = Math.max(1, Math.round(h / row));
    const rh = h / rows;
    const n = Math.max(3, Math.ceil(w / step));
    /** @type {[number, number][]} */
    const out = [];
    for (let r = 0; r < rows; r++) {
        const top = y + r * rh - 1.5;
        const bottom = y + (r + 1) * rh + 1.5;
        for (let i = 0; i <= n; i++) {
            const t = r % 2 ? n - i : i;
            // A hand never comes back to the same height: a small fixed wobble.
            const j = Math.sin((i + r * 7) * 2.3) * 0.08 * rh;
            out.push([x + t * (w / n), i % 2 ? bottom + j : top - j]);
        }
    }
    return pathOf(out);
};

/**
 * An arrowhead for a line that has just arrived at (x, y) at angle `a`
 * (radians): one barb, back to the tip, the other barb. It continues the
 * line's own path, because Firefox starts the dash pattern again at every
 * `M`, which would show the head before the line reaches it.
 */
const head = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ a, size = 5) => {
    const p = (/** @type {number} */ s) => `${f(x - size * Math.cos(a + s))} ${f(y - size * Math.sin(a + s))}`;
    return ` L${p(0.5)} L${f(x)} ${f(y)} L${p(-0.5)}`;
};

/** A curved arrow from (x0, y0) to (x1, y1), bulging to (cx, cy). */
const arc = (/** @type {number} */ x0, /** @type {number} */ y0, /** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ x1, /** @type {number} */ y1, size = 5) =>
    `M${f(x0)} ${f(y0)} Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}` + head(x1, y1, Math.atan2(y1 - cy, x1 - cx), size);

/**
 * An asterisk of three strokes, drawn one after the other as one path (see
 * head()): the first stroke end to end, then back to the middle, and each next
 * stroke out from the middle to one end and across to the other.
 */
const star = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ s) => {
    const ends = [90, 30, -30].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return [`${f(x + s * Math.cos(a))} ${f(y - s * Math.sin(a))}`, `${f(x - s * Math.cos(a))} ${f(y + s * Math.sin(a))}`];
    });
    const mid = `${f(x)} ${f(y)}`;
    return `M${ends[0][0]} L${ends[0][1]} L${mid} L${ends[1][0]} L${ends[1][1]} L${mid} L${ends[2][0]} L${ends[2][1]}`;
};

/**
 * A hand-drawn outline round a rounded box, clockwise from its top-start
 * corner, a little past its start (the pen's overshoot), with a slight wobble.
 */
const outline = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h, /** @type {number} */ r0) => {
    const r = Math.max(0.1, Math.min(r0, w / 2, h / 2));
    const q = (Math.PI * r) / 2;
    // Clockwise from the top-start corner: straights (start point, direction,
    // outward normal) and quarter arcs (centre, start angle).
    const segs = [
        { len: w - 2 * r, at: (/** @type {number} */ s) => [x + r + s, y, 0, -1] },
        { len: q, at: (/** @type {number} */ s) => corner(x + w - r, y + r, -Math.PI / 2, s) },
        { len: h - 2 * r, at: (/** @type {number} */ s) => [x + w, y + r + s, 1, 0] },
        { len: q, at: (/** @type {number} */ s) => corner(x + w - r, y + h - r, 0, s) },
        { len: w - 2 * r, at: (/** @type {number} */ s) => [x + w - r - s, y + h, 0, 1] },
        { len: q, at: (/** @type {number} */ s) => corner(x + r, y + h - r, Math.PI / 2, s) },
        { len: h - 2 * r, at: (/** @type {number} */ s) => [x, y + h - r - s, -1, 0] },
        { len: q, at: (/** @type {number} */ s) => corner(x + r, y + r, Math.PI, s) },
    ];
    function corner(/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ a0, /** @type {number} */ s) {
        const t = a0 + s / r;
        return [cx + r * Math.cos(t), cy + r * Math.sin(t), Math.cos(t), Math.sin(t)];
    }
    const L = segs.reduce((sum, g) => sum + g.len, 0);
    const point = (/** @type {number} */ s0) => {
        let s = s0 % L;
        for (const g of segs) {
            if (s <= g.len) return g.at(s);
            s -= g.len;
        }
        return segs[0].at(0);
    };
    /** @type {[number, number][]} */
    const out = [];
    const total = L * 1.07;
    for (let s = 0; s <= total; s += 3) {
        const [px, py, nx, ny] = point(s);
        // A slight wobble, and past the start the pen drifts 2.5 px outward.
        const off = Math.sin(s / 23 + 0.6) * 0.9 + (s > L ? ((s - L) / (total - L)) * 2.5 : 0);
        out.push([px + nx * off, py + ny * off]);
    }
    return pathOf(out);
};

/**
 * A closed loop round (cx, cy), an ellipse turned by `rot` degrees, from its
 * lowest point (the knot) round and back; also the knot's point.
 */
const loopAround = (/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ rx, /** @type {number} */ ry, rot = 0) => {
    const a = (rot * Math.PI) / 180;
    const p = (/** @type {number} */ t) => [cx + rx * Math.cos(t) * Math.cos(a) - ry * Math.sin(t) * Math.sin(a), cy + rx * Math.cos(t) * Math.sin(a) + ry * Math.sin(t) * Math.cos(a)];
    const [x0, y0] = p(Math.PI / 2);
    const [x1, y1] = p(-Math.PI / 2);
    const arcTo = (/** @type {number} */ x, /** @type {number} */ y) => ` A${f(rx)} ${f(ry)} ${rot} 0 1 ${f(x)} ${f(y)}`;
    return { d: `M${f(x0)} ${f(y0)}${arcTo(x1, y1)}${arcTo(x0, y0)}`, knot: [x0, y0] };
};

/** A tag on its string: the string, the sky pass, the paper (with a back where it twirls). */
const tag = (cls = '', style = '') =>
    `<span class="pa-a-tg ${cls}" ${EXTRA} style="${style}"><span class="pa-a-tg__string"></span>` +
    `<span class="pa-a-tg__pass"></span><span class="pa-a-tg__card"><span class="pa-a-tg__back"></span></span></span>`;

/** A nail where a string is fixed to the paper. */
const nail = (/** @type {number} */ x, /** @type {number} */ y) => `<circle class="pa-a-nail" cx="${f(x)}" cy="${f(y)}" r="2"/>`;

/* ----------------------------------------------------------- the carriers */

/** What a strip stands on: a day, a skeleton line, the busy bar, a chart or a box (tile, panel, menu entry). */
const kindOf = (/** @type {Element} */ strip) =>
    strip.closest('.pa-day') ? 'day' : strip.closest('.pa-skel__line') ? 'skel' : strip.closest('.pa-bar--busy') ? 'bar' : strip.closest('.pa-plot') ? 'plot' : 'box';

/** The rectangle of `el` in the layout px of `host`'s padding box (unaffected by a scaled stage). */
const rel = (/** @type {Element} */ el, /** @type {HTMLElement} */ host) => {
    const a = el.getBoundingClientRect();
    const b = host.getBoundingClientRect();
    const k = b.width / (host.offsetWidth || b.width || 1) || 1;
    return { x: (a.left - b.left) / k - host.clientLeft, y: (a.top - b.top) / k - host.clientTop, w: a.width / k, h: a.height / k };
};

/** The days of a row as circles in the row's px: centre and outer radius. */
const dayCircles = (/** @type {HTMLElement} */ row) =>
    [...row.querySelectorAll('.pa-day')].map((day) => {
        const b = rel(day, row);
        return { cx: b.x + b.w / 2, cy: b.y + b.h / 2, r: b.w / 2, top: b.y, bottom: b.y + b.h, left: b.x, right: b.x + b.w };
    });

/** The chart's line in the chart's px, read from its own polyline. */
const plotLine = (/** @type {HTMLElement} */ plot) => {
    const svg = plot.querySelector('svg:not([data-pa-extra])');
    const line = svg?.querySelector('polyline');
    if (!svg || !line) return [];
    const box = rel(svg, plot);
    const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') || '0 0 120 40').split(/\s+/).map(Number);
    return (line.getAttribute('points') || '')
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(',').map(Number))
        .map(([px, py]) => /** @type {[number, number]} */ ([box.x + ((px - vx) / vw) * box.w, box.y + ((py - vy) / vh) * box.h]));
};

const radiusOf = (/** @type {Element} */ el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;

/* ----------------------------------------------------------- decorate */

/** @param {Element} scene */
const eachStrip = (scene) =>
    [...scene.querySelectorAll('.pa-strip')].map((strip) => {
        const host = /** @type {HTMLElement} */ (strip.parentElement);
        return { strip, host, kind: kindOf(strip), w: host.clientWidth, h: host.clientHeight };
    });

/** The krabbel variants, loading: what each carrier gets. */
const DOODLE = {
    'a-doodle-2'(/** @type {Element} */ scene) {
        for (const { strip, kind, w, h } of eachStrip(scene)) {
            if (kind === 'day') continue;
            if (kind === 'skel' || kind === 'bar') {
                // Threaded through the line: the part behind it is masked out.
                const r = h / 2 + 3.5;
                const pad = 24;
                const mask = `mask: linear-gradient(#000 0 ${pad}px, transparent ${pad}px ${pad + h}px, #000 ${pad + h}px) no-repeat;`;
                strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: weave(Math.min(6, w / 8), w - Math.min(6, w / 8), h / 2, r) }], 'pa-a-ribbon', pad, mask));
                continue;
            }
            // In and out of the bottom edge (its border's middle).
            strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: weave(12, w - 12, h + 0.5, 5.5) }], 'pa-a-ribbon'));
        }
        for (const row of scene.querySelectorAll('.pa-days')) {
            const days = dayCircles(/** @type {HTMLElement} */ (row));
            let d = '';
            /** @type {typeof days[number] | null} */
            let prev = null;
            days.forEach((c, i) => {
                const R = c.r + 3.5;
                const fresh = !prev || Math.abs(prev.cy - c.cy) > 2;
                d += fresh ? ` M${f(c.cx - R - 8)} ${f(c.cy)} L${f(c.cx - R)} ${f(c.cy)}` : ` L${f(c.cx - R)} ${f(c.cy)}`;
                d += ` A${f(R)} ${f(R)} 0 0 ${i % 2 ? 0 : 1} ${f(c.cx + R)} ${f(c.cy)}`;
                prev = c;
            });
            if (prev) d += ` l8 0`;
            const el = /** @type {HTMLElement} */ (row);
            row.insertAdjacentHTML('beforeend', ink(el.clientWidth, el.clientHeight, [{ d: d.trim() }], 'pa-a-ribbon pa-a-ribbon--days'));
        }
    },
    'a-doodle-3'(/** @type {Element} */ scene) {
        for (const { strip, host, kind, w, h } of eachStrip(scene)) {
            const pad = 8;
            if (kind === 'day') {
                const k = [...host.parentElement.children].indexOf(host);
                strip.insertAdjacentHTML(
                    'beforeend',
                    ink(w, h, [{ d: zigzag(1, 1, w - 2, h - 2, 11, 4), k }], 'pa-a-crayon', pad, `clip-path: circle(${f(w / 2 - 1)}px at ${f(pad + w / 2)}px ${f(pad + h / 2)}px);`),
                );
                continue;
            }
            if (kind === 'plot') {
                const line = plotLine(host);
                if (line.length < 2) continue;
                const area = [...line, [line[line.length - 1][0], h - 4], [line[0][0], h - 4]].map(([x, y]) => `${f(x + pad)}px ${f(y + pad)}px`).join(', ');
                const top = Math.min(...line.map(([, y]) => y));
                strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: zigzag(line[0][0], top, line[line.length - 1][0] - line[0][0], h - 4 - top, 11, 4.5) }], 'pa-a-crayon', pad, `clip-path: polygon(${area});`));
                continue;
            }
            const inset = kind === 'box' ? 5 : 0;
            const r = kind === 'box' ? Math.max(0, radiusOf(host) - 1 - inset) : h / 2;
            strip.insertAdjacentHTML(
                'beforeend',
                ink(w, h, [{ d: zigzag(inset, inset, w - 2 * inset, h - 2 * inset, 14, 4.5) }], 'pa-a-crayon', pad, `clip-path: inset(${pad + inset}px round ${f(r)}px);`),
            );
        }
    },
    'a-doodle-4'(/** @type {Element} */ scene) {
        for (const { strip, kind, w, h } of eachStrip(scene)) {
            if (kind === 'day' || kind === 'skel') continue;
            if (kind === 'bar') {
                // Three hops above the bar, start to end.
                const xs = [0.08, 0.36, 0.64, 0.92].map((t) => t * w);
                const strokes = xs.slice(0, 3).map((x, k) => ({ d: arc(x + 2, -2, (x + xs[k + 1]) / 2, -15, xs[k + 1] - 2, -2, 4), k, part: 'pa-a-hop3' }));
                strip.insertAdjacentHTML('beforeend', ink(w, h, strokes, 'pa-a-arrow'));
                continue;
            }
            // One arrow with a loop, along the foot, pointing to the end.
            const y = h - 9;
            const x0 = Math.min(14, w * 0.06);
            const xm = w * 0.42;
            const x1 = w - Math.min(18, w * 0.08);
            const d = `M${f(x0)} ${f(y)} Q${f((x0 + xm) / 2)} ${f(y + 3)} ${f(xm)} ${f(y)} A6 6 0 1 0 ${f(xm)} ${f(y - 12)} A6 6 0 1 0 ${f(xm + 0.1)} ${f(y)} Q${f((xm + x1) / 2)} ${f(y - 3)} ${f(x1)} ${f(y)}${head(x1, y, Math.atan2(3, x1 - (xm + x1) / 2), 5)}`;
            strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d }], 'pa-a-arrow pa-a-arrow--one'));
        }
        for (const row of scene.querySelectorAll('.pa-days')) {
            const el = /** @type {HTMLElement} */ (row);
            const days = dayCircles(el);
            /** @type {Stroke[]} */
            const strokes = [];
            for (let i = 0; i + 1 < days.length; i++) {
                const a = days[i];
                const b = days[i + 1];
                if (Math.abs(a.cy - b.cy) > 2) continue;
                strokes.push({ d: arc(a.cx + 2, a.top - 3, (a.cx + b.cx) / 2, a.top - 18, b.cx - 2, b.top - 3, 4) });
            }
            const first = days[0];
            const last = days[days.length - 1];
            if (first && last && last !== first) {
                // The way back: one long bow under the whole week.
                strokes.push({ d: arc(last.cx, last.bottom + 3, (first.cx + last.cx) / 2, Math.max(last.bottom, first.bottom) + 22, first.cx, first.bottom + 3, 5) });
            }
            strokes.forEach((s, k) => Object.assign(s, { k, part: `pa-a-hop${strokes.length}` }));
            el.insertAdjacentHTML('beforeend', ink(el.clientWidth, el.clientHeight, strokes, 'pa-a-arrow'));
        }
        for (const skel of scene.querySelectorAll('.pa-skel')) {
            // The return key: from a line's end, between the lines, to the next line's start.
            const el = /** @type {HTMLElement} */ (skel);
            const lines = [...el.querySelectorAll('.pa-skel__line')].map((line) => rel(line, el));
            /** @type {Stroke[]} */
            const strokes = [];
            for (let i = 0; i + 1 < lines.length; i++) {
                const a = lines[i];
                const b = lines[i + 1];
                const ym = (a.y + a.h + b.y) / 2;
                const xe = a.x + a.w;
                const turn = Math.min(xe + 6, el.clientWidth + 4);
                const d =
                    `M${f(xe - 6)} ${f(a.y - 3)} Q${f(turn)} ${f(a.y - 3)} ${f(turn)} ${f(a.y + a.h / 2)} Q${f(turn)} ${f(ym)} ${f(xe - 10)} ${f(ym)} ` +
                    `L${f(b.x + 14)} ${f(ym)} Q${f(b.x + 4)} ${f(ym)} ${f(b.x + 4)} ${f(b.y - 2)}` +
                    head(b.x + 4, b.y - 2, Math.PI / 2, 4);
                strokes.push({ d, k: i, part: `pa-a-hop${lines.length - 1}` });
            }
            el.insertAdjacentHTML('beforeend', ink(el.clientWidth, el.clientHeight, strokes, 'pa-a-arrow'));
        }
    },
    'a-doodle-5'(/** @type {Element} */ scene) {
        for (const { strip, host, kind, w, h } of eachStrip(scene)) {
            if (kind === 'day') {
                const k = [...host.parentElement.children].indexOf(host);
                const off = w / 2 + 6;
                const c = Math.SQRT1_2 * off;
                strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: star(w / 2 + c, h / 2 - c, 4.5), k, part: 'pa-a-hop5' }], 'pa-a-star'));
                continue;
            }
            if (kind === 'skel') {
                const k = [...host.parentElement.children].indexOf(host);
                strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: star(w - h / 2 - 1, h / 2, h / 2 - 0.5), k, part: 'pa-a-hop3' }], 'pa-a-star'));
                continue;
            }
            if (kind === 'bar') {
                const strokes = [0.2, 0.5, 0.8].map((t, k) => ({ d: star(t * w, h / 2, h / 2 - 1), k, part: 'pa-a-hop3' }));
                strip.insertAdjacentHTML('beforeend', ink(w, h, strokes, 'pa-a-star'));
                continue;
            }
            if (kind === 'plot') {
                // The pen stars the line's highest point.
                const line = plotLine(host);
                if (!line.length) continue;
                const [px, py] = line.reduce((best, p) => (p[1] < best[1] ? p : best));
                strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: star(px, py - 9, 5.5), part: 'pa-a-hop1' }], 'pa-a-star'));
                continue;
            }
            // On the top-end corner itself, half on the paper.
            strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: star(w - 5, 3, kind === 'box' && h < 40 ? 5.5 : 7), part: 'pa-a-hop1' }], 'pa-a-star'));
        }
    },
    'a-doodle-6'(/** @type {Element} */ scene) {
        for (const { strip, host, kind, w, h } of eachStrip(scene)) {
            if (kind === 'day' || kind === 'skel') continue;
            const g = kind === 'bar' ? 3.5 : 4.5;
            const r = (kind === 'bar' ? h / 2 : radiusOf(host)) + g;
            strip.insertAdjacentHTML('beforeend', ink(w, h, [{ d: outline(-g - 1, -g - 1, w + 2 * g + 2, h + 2 * g + 2, r) }], 'pa-a-trace'));
        }
        // Round a group: the whole week, the three skeleton lines together.
        for (const group of scene.querySelectorAll('.pa-days, .pa-skel')) {
            const el = /** @type {HTMLElement} */ (group);
            const parts = [...el.querySelectorAll(':scope > .pa-day, :scope > .pa-skel__line')].map((p) => rel(p, el));
            if (!parts.length) continue;
            const x0 = Math.min(...parts.map((p) => p.x)) - 5;
            const y0 = Math.min(...parts.map((p) => p.y)) - 5;
            const x1 = Math.max(...parts.map((p) => p.x + p.w)) + 5;
            const y1 = Math.max(...parts.map((p) => p.y + p.h)) + 5;
            const r = group.classList.contains('pa-days') ? (y1 - y0) / 2 : 14;
            el.insertAdjacentHTML('beforeend', ink(el.clientWidth, el.clientHeight, [{ d: outline(x0, y0, x1 - x0, y1 - y0, r) }], 'pa-a-trace'));
        }
    },
};

/** The krabbel variants, spinner: a 100 x 100 drawing. */
const DOODLE_SPIN = {
    'a-spiral-2': () => {
        /** @type {[number, number][]} */
        const out = [];
        for (let t = 0; t <= 360; t += 6) {
            const a = (t * Math.PI) / 180;
            const r = 30 + 13 * Math.cos(2 * a);
            out.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
        }
        const dots = [0, 90, 180, 270].map((deg) => {
            const a = (deg * Math.PI) / 180;
            return `<circle class="pa-a-sp__day" cx="${f(50 + 30 * Math.cos(a))}" cy="${f(50 + 30 * Math.sin(a))}" r="5" vector-effect="non-scaling-stroke"/>`;
        });
        return inkSpin([{ d: `${pathOf(out)} Z` }], 'pa-a-ribbon', dots.join(''));
    },
    'a-spiral-3': () =>
        inkSpin([{ d: zigzag(12, 12, 76, 76, 15, 9), part: 'pa-a-sp__fill' }], 'pa-a-crayon', '<circle class="pa-a-sp__ring" cx="50" cy="50" r="40" vector-effect="non-scaling-stroke"/>'),
    'a-spiral-4': () => {
        const r = 36;
        const a0 = (-80 * Math.PI) / 180;
        const a1 = (200 * Math.PI) / 180;
        const p = (/** @type {number} */ a) => [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
        const [sx, sy] = p(a0);
        const [ex, ey] = p(a1);
        return inkSpin([{ d: `M${f(sx)} ${f(sy)} A${r} ${r} 0 1 1 ${f(ex)} ${f(ey)}${head(ex, ey, a1 + Math.PI / 2, 16)}` }], 'pa-a-arrow');
    },
    'a-spiral-5': () => inkSpin([{ d: star(50, 50, 38) }], 'pa-a-star'),
    'a-spiral-6': () =>
        inkSpin([{ d: outline(14, 14, 72, 72, 18) }], 'pa-a-trace', '<rect class="pa-a-sp__card" x="27" y="27" width="46" height="46" rx="10" vector-effect="non-scaling-stroke"/><path class="pa-a-sp__line" d="M37 42 H63 M37 55 H54" vector-effect="non-scaling-stroke"/>'),
};

/** The labeltje variants, loading. */
const TAG = {
    'a-tag-2'(/** @type {Element} */ scene) {
        for (const { strip, kind, w, h } of eachStrip(scene)) {
            if (kind === 'day' || kind === 'skel') continue;
            if (kind === 'bar') {
                // The bar is the line: three tags pegged under it.
                strip.insertAdjacentHTML('beforeend', [0.25, 0.5, 0.75].map((t, k) => tag('pa-a-tg--wave', `left: ${f(t * w)}px; top: ${f(h)}px; --k: ${k}`)).join(''));
                continue;
            }
            // A sagging string across the top's free half, three tags on it.
            const x0 = w * 0.46;
            const x1 = w - 10;
            const sag = Math.min(10, h * 0.18);
            const at = (/** @type {number} */ t) => [x0 + (x1 - x0) * t, 4 * t * (1 - t) * sag + 1];
            const string = `<svg class="pa-a-line" ${EXTRA} viewBox="0 0 ${f(w)} ${f(h)}" style="width: ${f(w)}px; height: ${f(h)}px" aria-hidden="true" focusable="false"><path d="M${f(x0)} 1 Q${f((x0 + x1) / 2)} ${f(2 * sag + 1)} ${f(x1)} 1"/>${nail(x0, 1)}${nail(x1, 1)}</svg>`;
            const tags = [0.2, 0.5, 0.8].map((t, k) => {
                const [x, y] = at(t);
                return tag('pa-a-tg--wave', `left: ${f(x)}px; top: ${f(y)}px; --k: ${k}`);
            });
            strip.insertAdjacentHTML('beforeend', string + tags.join(''));
        }
        for (const row of scene.querySelectorAll('.pa-days')) {
            // The line rests on the days' tops and sags a little between them.
            const el = /** @type {HTMLElement} */ (row);
            const days = dayCircles(el);
            let d = '';
            days.forEach((c, i) => {
                const prev = days[i - 1];
                if (!prev || Math.abs(prev.cy - c.cy) > 2) d += ` M${f(c.left - 6)} ${f(c.top + 3)} Q${f(c.left)} ${f(c.top)} ${f(c.cx)} ${f(c.top - 0.5)}`;
                else d += ` Q${f((prev.right + c.left) / 2)} ${f(c.top + 5)} ${f(c.cx)} ${f(c.top - 0.5)}`;
                const next = days[i + 1];
                if (!next || Math.abs(next.cy - c.cy) > 2) d += ` Q${f(c.right)} ${f(c.top)} ${f(c.right + 6)} ${f(c.top + 3)}`;
            });
            el.insertAdjacentHTML(
                'beforeend',
                `<svg class="pa-a-line" ${EXTRA} viewBox="0 0 ${f(el.clientWidth)} ${f(el.clientHeight)}" style="width: ${f(el.clientWidth)}px; height: ${f(el.clientHeight)}px" aria-hidden="true" focusable="false"><path d="${d.trim()}"/></svg>`,
            );
        }
    },
    'a-tag-3'(/** @type {Element} */ scene) {
        for (const { strip, host, kind, w, h } of eachStrip(scene)) {
            const k = kind === 'day' || kind === 'skel' ? [...host.parentElement.children].indexOf(host) : 0;
            const where =
                kind === 'day'
                    ? `left: ${f(w / 2)}px; top: ${f(h)}px`
                    : kind === 'skel'
                      ? `left: ${f(w - h / 2)}px; top: ${f(h)}px`
                      : kind === 'bar'
                        ? `left: ${f(w - h / 2 - 4)}px; top: ${f(h)}px`
                        : `left: ${f(w * 0.74)}px; top: -1px`;
            strip.insertAdjacentHTML('beforeend', tag('pa-a-tg--twirl', `${where}; --k: ${k}`));
        }
    },
    'a-tag-4'(/** @type {Element} */ scene) {
        for (const { strip, host, kind, w, h } of eachStrip(scene)) {
            const k = kind === 'day' || kind === 'skel' ? [...host.parentElement.children].indexOf(host) : 0;
            const seq = kind === 'day' ? 'pa-a-tie5' : kind === 'skel' ? 'pa-a-tie3' : 'pa-a-tie1';
            // Day: once round it. Skeleton line, bar: round the end cap. Box: across the top-end corner.
            const { d: loop, knot } =
                kind === 'day'
                    ? loopAround(w / 2, h / 2, w / 2 + 3, w / 2 + 3)
                    : kind === 'skel' || kind === 'bar'
                      ? loopAround(w - h / 2, h / 2, h / 2 + 4, h / 2 + 3)
                      : loopAround(w - 6, 6, 15, 4.5, 45);
            strip.insertAdjacentHTML(
                'beforeend',
                ink(w, h, [{ d: loop, k, part: `pa-a-knot ${seq}` }], 'pa-a-tie') + tag(`pa-a-tg--tie ${seq}`, `left: ${f(knot[0])}px; top: ${f(knot[1])}px; --k: ${k}`),
            );
        }
    },
    'a-tag-5'(/** @type {Element} */ scene) {
        for (const { strip, host, kind, w, h } of eachStrip(scene)) {
            if (kind === 'skel') continue;
            const k = kind === 'day' ? [...host.parentElement.children].indexOf(host) : 0;
            // The hook it hangs from, and how far the tag drops to land on what lies under it.
            const fs = kind === 'box' || kind === 'plot' ? 12 : kind === 'bar' ? 9 : 7.5;
            const card = 1.95 * fs;
            let x = w * 0.84;
            let y = 0;
            let drop = Math.max(4, h - card - 7);
            if (kind === 'day') {
                x = w / 2;
                y = -card - 14;
                drop = 12;
            } else if (kind === 'bar') {
                x = w - h / 2 - 8;
                y = -card - 12;
                drop = 11;
            }
            strip.insertAdjacentHTML('beforeend', tag('pa-a-tg--yoyo', `left: ${f(x)}px; top: ${f(y)}px; --k: ${k}; --pa-a-drop: ${f(drop)}px; font-size: ${fs}px`));
        }
        for (const skel of scene.querySelectorAll('.pa-skel')) {
            // Each tag is let down out of the line above (out of the group's top
            // edge for the first) onto its own line's end cap: the part above
            // the hook is clipped, so it comes out from under that line.
            const el = /** @type {HTMLElement} */ (skel);
            const lines = [...el.querySelectorAll('.pa-skel__line')].map((line) => rel(line, el));
            const fs = 6;
            const card = 1.95 * fs;
            const tags = lines.map((line, k) => {
                const hook = k ? lines[k - 1].y + lines[k - 1].h : 0;
                const drop = line.y - 0.5 - hook - card;
                const x = line.x + line.w - line.h / 2 - 4;
                return tag('pa-a-tg--yoyo pa-a-tg--emerge', `left: ${f(x)}px; top: ${f(hook)}px; --k: ${k}; --pa-a-drop: ${f(drop)}px; --pa-a-up: ${f(-card)}px; font-size: ${fs}px`);
            });
            el.insertAdjacentHTML('beforeend', tags.join(''));
        }
    },
    'a-tag-6'(/** @type {Element} */ scene) {
        for (const { strip, kind, w, h } of eachStrip(scene)) {
            if (kind === 'day') continue;
            const below = kind === 'skel' || kind === 'bar';
            const y = below ? h : 7;
            const x0 = below ? h / 2 + 4 : w * 0.46;
            const x1 = below ? w - h / 2 - 4 : w - 16;
            const cable = below
                ? ''
                : `<svg class="pa-a-line" ${EXTRA} viewBox="0 0 ${f(w)} ${f(h)}" style="width: ${f(w)}px; height: ${f(h)}px" aria-hidden="true" focusable="false"><path d="M${f(x0 - 9)} 7 L${f(x1 + 9)} 7"/>${nail(x0 - 9, 7)}${nail(x1 + 9, 7)}</svg>`;
            strip.insertAdjacentHTML('beforeend', cable + tag('pa-a-tg--ride pa-a-ride2', `left: 0; top: ${f(y)}px; --pa-a-x0: ${f(x0)}px; --pa-a-x1: ${f(x1)}px`));
        }
        for (const row of scene.querySelectorAll('.pa-days')) {
            // A cable under the week; the tag stops under each day in turn.
            const el = /** @type {HTMLElement} */ (row);
            const days = dayCircles(el).filter((c, i, all) => Math.abs(c.cy - all[0].cy) < 2);
            if (!days.length) continue;
            const y = Math.max(...days.map((c) => c.bottom)) + 4;
            const xs = days.map((c) => c.cx);
            while (xs.length < 5) xs.push(xs[xs.length - 1]);
            const vars = xs
                .slice(0, 5)
                .map((x, i) => `--pa-a-x${i}: ${f(x)}px`)
                .join('; ');
            el.insertAdjacentHTML(
                'beforeend',
                `<svg class="pa-a-line" ${EXTRA} viewBox="0 0 ${f(el.clientWidth)} ${f(el.clientHeight + 30)}" style="width: ${f(el.clientWidth)}px; height: ${f(el.clientHeight + 30)}px" aria-hidden="true" focusable="false"><path d="M${f(days[0].left - 4)} ${f(y)} L${f(days[days.length - 1].right + 4)} ${f(y)}"/></svg>` +
                    tag('pa-a-tg--ride pa-a-ride5', `left: 0; top: ${f(y)}px; ${vars}`),
            );
        }
    },
};

/** The labeltje variants, spinner: tags built in the spinner's own box. */
const TAG_SPIN = {
    'a-tagswing-2': () =>
        `<svg class="pa-a-line" ${EXTRA} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 14 Q50 34 96 14" vector-effect="non-scaling-stroke"/></svg>` +
        [
            [20, 20.5],
            [50, 24],
            [80, 20.5],
        ]
            .map(([x, y], k) => tag('pa-a-tg--wave', `left: ${x}%; top: ${y}%; --k: ${k}`))
            .join(''),
    'a-tagswing-3': () => `<span class="pa-a-pin" ${EXTRA}></span>${tag('pa-a-tg--twirl', 'left: 50%; top: 8%')}`,
    'a-tagswing-4': () =>
        inkSpin([{ d: loopAround(50, 28, 16, 16).d, part: 'pa-a-knot pa-a-tie1' }], 'pa-a-tie') + tag('pa-a-tg--tie pa-a-tie1', 'left: 50%; top: 44%'),
    'a-tagswing-5': () => `<span class="pa-a-pin" ${EXTRA}></span>${tag('pa-a-tg--yoyo', 'left: 50%; top: 8%')}`,
    'a-tagswing-6': () =>
        `<svg class="pa-a-line pa-a-line--ring" ${EXTRA} viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="42" r="22" vector-effect="non-scaling-stroke"/></svg>` +
        `<span class="pa-a-wheel" ${EXTRA}>${tag('pa-a-tg--gondola', 'left: 50%; top: 20%')}</span>`,
};

/**
 * Adds what an option needs beyond pairs-a.css inside the scene's own
 * carriers, after removing what it added before.
 * @param {Element} scene the `.pa-scene` element
 * @param {string} aspectId 'loading' or 'spinner'
 * @param {string} key the option's key
 */
export function decorate(scene, aspectId, key) {
    for (const old of scene.querySelectorAll('[data-pa-extra="a"]')) old.remove();
    if (aspectId === 'loading' && key === 'a-doodle') {
        for (const strip of scene.querySelectorAll('.pa-strip')) {
            if (strip.closest('.pa-day')) {
                strip.insertAdjacentHTML('beforeend', pen('0 0 100 100', scribble(), 'pa-a-pen--ring'));
                continue;
            }
            const box = strip.getBoundingClientRect();
            const { w, h, pts } = loops(Math.round(box.width) || 240, Math.round(box.height) || 10);
            strip.insertAdjacentHTML('beforeend', pen(`0 0 ${w} ${h}`, pts));
        }
        return;
    }
    if (aspectId === 'spinner' && key === 'a-spiral') {
        for (const spinner of scene.querySelectorAll('.kp-spinner')) spinner.insertAdjacentHTML('beforeend', pen('0 0 100 100', spiral(), 'pa-a-pen--spiral'));
        return;
    }
    if (aspectId === 'loading') {
        const draw = DOODLE[/** @type {keyof typeof DOODLE} */ (key)] || TAG[/** @type {keyof typeof TAG} */ (key)];
        if (draw) draw(scene);
        return;
    }
    const make = DOODLE_SPIN[/** @type {keyof typeof DOODLE_SPIN} */ (key)] || TAG_SPIN[/** @type {keyof typeof TAG_SPIN} */ (key)];
    if (make) for (const spinner of scene.querySelectorAll('.kp-spinner')) spinner.insertAdjacentHTML('beforeend', make());
}
