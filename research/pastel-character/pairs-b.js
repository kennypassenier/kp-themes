// research/pastel-character, round 3 (Kenny, 2026-10-14): two of the families
// he kept from round 2, each as six matched variants of loading picture and
// spinner. Family 13, De pomponrups (b-bug / b-curl), and family 20, Het
// vouwvliegtuigje (b-plane / b-loop). Variant 1 of each is exactly what he saw
// in round 2; variants 2-6 are new, and each treats every carrier on purpose:
// Kenny's objection was that the caterpillar and the plane crossed THROUGH the
// day circles, so here they go round a day, bridge from day to day, roll over
// the tops, take a bite out of a rim, land on a day, loop round it or stick a
// tape tab on its corner; the skeleton lines, the busy bar and the plates
// (tile, panel, menu row, chart) get a treatment of their own as well.
//
// The pictures are drawn by pairs-b.css; `decorate` (called by demo.js after
// layout and on every resize) measures each carrier and adds the pieces with
// the geometry they need: a path round the carrier's outline, the day tops to
// hop or roll over, the stops of a nibble. Paths are CSS motion paths in px of
// the strip (the strip covers its carrier's padding box); where the timing
// depends on the geometry (stops, landings, throws) the keyframes are written
// here into one style element, named `pa-b-g…`. Durations stay in CSS, so the
// page's speed buttons (--pa-slow) still stretch them.

/** @typedef {{ key: string, name: string, see: string, verdict: string }} Option */

/* -------------------------------------------------------------- the texts */

const BUG = 'De pomponrups';
const PLANE_NAME = 'Het vouwvliegtuigje';

/** The loading pictures, in order: the caterpillar 1-6, then the plane 1-6. @type {Option[]} */
export const LOADING_OPTIONS = [
    {
        key: 'b-bug',
        name: `${BUG} · 1 (jouw keuze)`,
        see: 'Een rupsje van vier muntkleurige pompons met een pruimkleurig kopje en voelsprieten kruipt over de bovenrand van begin naar eind; een bultje loopt van staart naar kop door zijn lijf (1200 ms). Over de dagen, de skeletregels en de balk kruipt hetzelfde rupsje.',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'b-bug-2',
        name: `${BUG} · 2 · de rondgang`,
        see: 'Het rupsje kruipt met de klok mee rondom wat wacht, buiten tegen de rand aan, ook door de bochten van de hoeken; het bultje golft door zijn lijf. Rond elke dag van de maand kruipt een eigen klein rupsje, alle vijf tegelijk; rond elke skeletregel en rond de bezige balk ook een. Bij de menuregel kruipt het rond het hele menu.',
        verdict: 'Alternatief: de rups die om de dingen heen gaat in plaats van eroverheen; de vorm van elke drager is zijn weg.',
    },
    {
        key: 'b-bug-3',
        name: `${BUG} · 3 · de spanrups`,
        see: 'Een spanrups: hij trekt zijn staart naar zijn kop tot zijn lijf een boogje maakt, en strekt dan zijn kop naar voren (1400 ms per stap). Over de dagen maakt hij een bruggetje: staart op de ene dag, kop op de volgende, en zo stapt hij van dag naar dag, bovenop, nooit erdoor. Over de bovenrand, op elke skeletregel en op de balk stapt hij zo naar het eind.',
        verdict: 'Alternatief: dezelfde rups met een andere gang; de dagen worden stapstenen, en een spanrups meet, zoals een planner de dagen afmeet.',
    },
    {
        key: 'b-bug-4',
        name: `${BUG} · 4 · het wieltje`,
        see: 'Het rupsje rolt zich op tot een wieltje (op de zachte landing), rolt zo naar het eind en rolt zich daar weer uit (5 tot 7 s per tocht). Over de dagen rolt het wieltje over de bovenkant van elke dag en zakt het even in tussen twee dagen, zoals een knikker over hobbels; over de bovenrand, elke skeletregel en de balk rolt het rechtdoor.',
        verdict: 'Alternatief: de opgerolde rups van de spinner, nu op weg; volgt de bolling van elke dag in plaats van erdoor te gaan.',
    },
    {
        key: 'b-bug-5',
        name: `${BUG} · 5 · rupsje nooitgenoeg`,
        see: 'Het rupsje eet: op de bovenrand ligt een strookje washi tape, en het eet het met hapjes van begin naar eind op (zijn kopje kauwt), daarna ligt er een nieuw strookje. Over de dagen kruipt het van top naar top en neemt uit elke dag één hapje aan de bovenkant, het cijfer blijft heel; zijn alle dagen aangebeten, dan groeien ze weer dicht. Een skeletregel en de tape in de balk eet het van begin naar eind op.',
        verdict: 'Alternatief: Rupsje Nooitgenoeg uit het prentenboek; wachten is hier opeten wat er al ligt, en een hapje uit de rand van een dag respecteert zijn vorm.',
    },
    {
        key: 'b-bug-6',
        name: `${BUG} · 6 · alles wordt rups`,
        see: 'Wat wacht wordt zelf de rups. De vijf dagen zijn zijn lijf: ze krijgen een muntkleurig pomponrandje en pootjes, rechts komt een pruimkleurig kopje met voelsprieten, en het bultje golft door de dagen zelf (1200 ms). Elke skeletregel wordt een rij pompons met een kopje, de balk ook; een tegel, paneel, menu en grafiek krijgen een kopje op de hoek rechtsboven en pootjes onder die om de beurt stappen.',
        verdict: 'Alternatief: geen rups die over de dingen kruipt, maar dingen die rups worden; er gaat dus nooit iets door een drager heen.',
    },
    {
        key: 'b-plane',
        name: `${PLANE_NAME} · 1 (jouw keuze)`,
        see: 'Een papieren vliegtuigje zweeft over de bovenrand van begin naar eind, deint zacht op en neer en komt telkens opnieuw aan (3600 ms per vlucht); over de dagen, de skeletregels en de balk vliegt hetzelfde vliegtuigje.',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'b-plane-2',
        name: `${PLANE_NAME} · 2 · hink-stap-sprong`,
        see: 'Het vliegtuigje landt even en springt weer op, zoals een keitje over het water: het tikt de bovenkant van elke dag aan, glijdt een tikje uit op de zachte landing en springt naar de volgende dag. Over de bovenrand van een tegel en over de balk worden de sprongetjes steeds kleiner; op elke skeletregel landt het twee keer.',
        verdict: 'Alternatief: het vliegtuigje dat de dagen een voor een aantikt; landen is pastels zachte landing.',
    },
    {
        key: 'b-plane-3',
        name: `${PLANE_NAME} · 3 · gevouwen en weer open`,
        see: 'Op de rand ligt een vierkant briefje. Het vouwt dubbel (je ziet de achterkant even), wordt een vliegtuigje, vliegt in een boogje naar de volgende plek en vouwt daar weer open tot een plat briefje (1800 ms per plek). Op de dagen ligt het op de schouder rechtsboven en vliegt het van dag naar dag; op een tegel, de balk en elke skeletregel van begin naar eind.',
        verdict: 'Alternatief: je ziet het vliegtuigje gemaakt worden; het landt op elke dag als een papiertje dat erop geplakt wordt.',
    },
    {
        key: 'b-plane-4',
        name: `${PLANE_NAME} · 4 · loopings`,
        see: 'Het vliegtuigje vliegt loopings om wat wacht: rond elke dag één hele looping, dag na dag, met een rechte lijn over de toppen ertussen; rond een tegel, paneel, menu, grafiek en de balk één grote ronde langs de buitenkant; rond elke skeletregel een eigen vliegtuigje, alle drie tegelijk.',
        verdict: 'Alternatief: de looping van de spinner, nu om de dingen heen; elke dag wordt omcirkeld, niet doorkruist.',
    },
    {
        key: 'b-plane-5',
        name: `${PLANE_NAME} · 5 · het brengt de tape`,
        see: 'Het vliegtuigje sleept een strook washi tape aan en legt ze op de bovenrand (de tape die je als familie koos), de tape wappert, en bij zijn tweede vlucht trekt het ze er weer af (6000 ms). Op elke dag laat het onderweg een kort tapelipje op de hoek linksboven vallen, dat met een zachte landing vastplakt en er bij de tweede vlucht weer afgaat; elke skeletregel en de balk worden zo afgeplakt.',
        verdict: 'Alternatief: het vliegtuigje als postbode van de washi tape; de tape komt op de plek die je al koos (de hoek van een dag, de rand van een tegel).',
    },
    {
        key: 'b-plane-6',
        name: `${PLANE_NAME} · 6 · het pijltje`,
        see: 'Vliegtuigjes worden als pijltjes gegooid: elk vliegt van linksboven aan, prikt met zijn neus tegen de rand en wiebelt na (de wiebel van pastel), tot ze er allemaal zitten en samen afvallen. Eén tegen de rand van elke dag, de dagen na elkaar; drie op de bovenrand van een tegel, één op het eind van elke skeletregel, vijf op de balk.',
        verdict: 'Alternatief: het vliegtuigje dat aankomt in plaats van voorbijvliegt; de rij pijltjes telt mee zoals een voortgang.',
    },
];

/** The spinners, in the same order: variant N is loading variant N in small. @type {Option[]} */
export const SPINNER_OPTIONS = [
    {
        key: 'b-curl',
        name: `${BUG} · 1 (jouw keuze)`,
        see: 'Het pomponrupsje ligt opgerold in een kring, kop tegen staart; een bultje loopt rond door zijn lijf (1200 ms) terwijl de kring langzaam meedraait (4800 ms).',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'b-curl-2',
        name: `${BUG} · 2 · de rondgang`,
        see: 'Een rond wit plakkertje, zoals een dag; het rupsje kruipt er met de klok mee buitenom rond, met zijn bultje (2400 ms per rondje).',
        verdict: 'Alternatief: de rondgang van het laden in het klein: een rups die om een dag heen kruipt.',
    },
    {
        key: 'b-curl-3',
        name: `${BUG} · 3 · de spanrups`,
        see: 'De spanrups stapt in een kring: staart naar de kop tot een boogje, kop vooruit, drie stappen per rondje (2700 ms).',
        verdict: 'Alternatief: de spanrups van het laden; de kring draait niet, hij stapt.',
    },
    {
        key: 'b-curl-4',
        name: `${BUG} · 4 · het wieltje`,
        see: 'Het rupsje rolt als wieltje één keer rond, rolt zich dan uit tot een rechte rij met een zachte landing en rolt zich weer op (2600 ms).',
        verdict: 'Alternatief: het wieltje van het laden; oprollen en uitrollen is de lus.',
    },
    {
        key: 'b-curl-5',
        name: `${BUG} · 5 · rupsje nooitgenoeg`,
        see: 'Een rond muntkleurig blaadje; het kopje eet er met de klok mee de rand af, het blaadje groeit daarna weer aan (3000 ms).',
        verdict: 'Alternatief: rupsje nooitgenoeg in het klein; het opgegeten stuk toont hoe ver de ronde is.',
    },
    {
        key: 'b-curl-6',
        name: `${BUG} · 6 · alles wordt rups`,
        see: 'De drie bolletjes van een gewone spinner zijn pompons met een pruimkleurig kopje ervoor: het bultje golft van staart naar kop door de drie (1400 ms).',
        verdict: 'Alternatief: de bekende drie bolletjes worden zelf een rups, zoals de dagen bij het laden.',
    },
    {
        key: 'b-loop',
        name: `${PLANE_NAME} · 1 (jouw keuze)`,
        see: 'Het vouwvliegtuigje vliegt een looping, met een muntkleurig spoor achter zich (2000 ms per rondje).',
        verdict: 'Jouw keuze uit ronde 2.',
    },
    {
        key: 'b-loop-2',
        name: `${PLANE_NAME} · 2 · hink-stap-sprong`,
        see: 'Het vliegtuigje springt rond een rond wit plakkertje en tikt de rand drie keer per rondje aan, elke sprong op de zachte landing (1800 ms).',
        verdict: 'Alternatief: hink-stap-sprong in het klein; drie landingen zijn de drie sprongetjes van een spinner.',
    },
    {
        key: 'b-loop-3',
        name: `${PLANE_NAME} · 3 · gevouwen en weer open`,
        see: 'Een vierkant briefje vouwt dubbel, wordt een vliegtuigje, maakt een kwartslag en vouwt weer open tot een briefje (2400 ms per vouw).',
        verdict: 'Alternatief: vouwen en openvouwen is de lus; niets tolt.',
    },
    {
        key: 'b-loop-4',
        name: `${PLANE_NAME} · 4 · loopings`,
        see: 'Het vliegtuigje vliegt een acht rond twee kleine witte plakkertjes, een looping om elk (2400 ms).',
        verdict: 'Alternatief: loopings om iets heen in plaats van in de lucht; anders dan de looping van variant 1.',
    },
    {
        key: 'b-loop-5',
        name: `${PLANE_NAME} · 5 · het brengt de tape`,
        see: 'Het vliegtuigje vliegt rond en rolt achter zich een ring washi tape af; het tweede rondje trekt het de tape weer mee (2800 ms).',
        verdict: 'Alternatief: de taperol van ronde 1, nu door het vliegtuigje afgerold.',
    },
    {
        key: 'b-loop-6',
        name: `${PLANE_NAME} · 6 · het pijltje`,
        see: 'Een rond wit doelwit met een pruimkleurige stip; drie vliegtuigjes prikken er na elkaar in, wiebelen na en vallen samen af (2400 ms).',
        verdict: 'Alternatief: het pijltje in het klein; drie die aankomen zijn drie tellen.',
    },
];

/** The matched pairs, in order: [loading key, spinner key]. */
export const PAIRS = LOADING_OPTIONS.map((o, at) => /** @type {[string, string]} */ ([o.key, SPINNER_OPTIONS[at].key]));

/* ------------------------------------------------------------ the drawings */

/** The paper plane, side view, nose toward the end: its wing, its fold and its keel. */
const PLANE =
    '<svg class="pa-b-plane" viewBox="0 0 26 16" aria-hidden="true"><path class="pa-b-plane__wing" d="M1 2 L25 8 L8 8 Z"/><path class="pa-b-plane__keel" d="M8 8 L25 8 L11 11.5 Z"/><path class="pa-b-plane__fold" d="M8 8 L25 8 L4 14 Z"/></svg>';

/** `n` copies of a piece, each told its place. */
const many = (/** @type {number} */ n, /** @type {(k: number) => string} */ piece) => Array.from({ length: n }, (_, k) => piece(k)).join('');

/** A number for CSS, two decimals. */
const num = (/** @type {number} */ v) => String(Math.round(v * 100) / 100);
const px = (/** @type {number} */ v) => `${num(v)}px`;
const em = (/** @type {number} */ v) => `${num(v)}em`;

/** Pastel's landing (G1), written out for generated keyframes. */
const LAND =
    'linear(0, 0.014 5%, 0.052 10%, 0.112 15%, 0.189 20%, 0.28 25%, 0.38 30%, 0.486 35%, 0.594 40%, 0.7 45%, 0.8 50%, 0.891 55%, 0.968 60%, 1.028 65%, 1.066 70%, 1.08 75%, 1.072 80%, 1.052 85%, 1.028 90%, 1.008 95%, 1)';

const PI = Math.PI;

/* A path that knows its length and where a point along it lies. Every part is
   a straight line, a circular arc or a quadratic curve; `d` is the same path
   for CSS `offset-path: path()` (screen coordinates, y down, so an arc with a
   growing angle runs clockwise). */
class Track {
    constructor(/** @type {number} */ x, /** @type {number} */ y) {
        this.d = `M ${num(x)} ${num(y)}`;
        /** @type {{ len: number, at: (t: number) => number[] }[]} */
        this.parts = [];
        this.length = 0;
        this.x = x;
        this.y = y;
        this.sx = x;
        this.sy = y;
    }

    /** @param {number} len @param {(t: number) => number[]} at */
    push(len, at) {
        this.parts.push({ len, at });
        this.length += len;
    }

    line(/** @type {number} */ x, /** @type {number} */ y) {
        const [ax, ay] = [this.x, this.y];
        const len = Math.hypot(x - ax, y - ay);
        if (len < 0.01) return this;
        const a = Math.atan2(y - ay, x - ax);
        this.push(len, (t) => [ax + (x - ax) * t, ay + (y - ay) * t, a]);
        this.d += ` L ${num(x)} ${num(y)}`;
        this.x = x;
        this.y = y;
        return this;
    }

    /** A circular arc round (cx, cy) from angle a0 (the current point) to a1. */
    arc(/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r, /** @type {number} */ a0, /** @type {number} */ a1) {
        const dir = Math.sign(a1 - a0) || 1;
        this.push(Math.abs(a1 - a0) * r, (t) => {
            const a = a0 + (a1 - a0) * t;
            return [cx + r * Math.cos(a), cy + r * Math.sin(a), a + (dir * PI) / 2];
        });
        const steps = Math.ceil(Math.abs(a1 - a0) / (PI * 0.95));
        for (let i = 1; i <= steps; i++) {
            const a = a0 + ((a1 - a0) * i) / steps;
            this.d += ` A ${num(r)} ${num(r)} 0 0 ${dir > 0 ? 1 : 0} ${num(cx + r * Math.cos(a))} ${num(cy + r * Math.sin(a))}`;
        }
        this.x = cx + r * Math.cos(a1);
        this.y = cy + r * Math.sin(a1);
        return this;
    }

    quad(/** @type {number} */ qx, /** @type {number} */ qy, /** @type {number} */ x, /** @type {number} */ y) {
        const [ax, ay] = [this.x, this.y];
        const pt = (/** @type {number} */ t) => [(1 - t) ** 2 * ax + 2 * (1 - t) * t * qx + t * t * x, (1 - t) ** 2 * ay + 2 * (1 - t) * t * qy + t * t * y];
        const N = 32;
        const lut = [0];
        for (let i = 1; i <= N; i++) {
            const [p0, p1] = [pt((i - 1) / N), pt(i / N)];
            lut.push(lut[i - 1] + Math.hypot(p1[0] - p0[0], p1[1] - p0[1]));
        }
        const len = lut[N];
        this.push(len, (u) => {
            const want = u * len;
            let i = 1;
            while (i < N && lut[i] < want) i++;
            const t = (i - 1 + (want - lut[i - 1]) / Math.max(1e-6, lut[i] - lut[i - 1])) / N;
            const [px0, py0] = pt(t);
            const dx = 2 * (1 - t) * (qx - ax) + 2 * t * (x - qx);
            const dy = 2 * (1 - t) * (qy - ay) + 2 * t * (y - qy);
            return [px0, py0, Math.atan2(dy, dx)];
        });
        this.d += ` Q ${num(qx)} ${num(qy)} ${num(x)} ${num(y)}`;
        this.x = x;
        this.y = y;
        return this;
    }

    close() {
        this.line(this.sx, this.sy);
        this.d += ' Z';
        return this;
    }

    /** [x, y, angle in degrees] at distance s along the path. */
    at(/** @type {number} */ s) {
        let left = Math.max(0, Math.min(s, this.length));
        for (const part of this.parts) {
            if (left <= part.len || part === this.parts[this.parts.length - 1]) {
                const [x, y, a] = part.at(part.len ? Math.min(1, left / part.len) : 0);
                return [x, y, (a * 180) / PI];
            }
            left -= part.len;
        }
        return [this.x, this.y, 0];
    }
}

/** A ring round (cx, cy), clockwise from its top. */
const ring = (/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r) => new Track(cx, cy - r).arc(cx, cy, r, -PI / 2, PI * 1.5).close();

/**
 * A rounded rectangle round a box, `o` outside its edge, clockwise from the
 * top-start corner.
 * @param {Box} b @param {number} o
 */
const roundRect = (b, o) => {
    const [x0, y0, x1, y1] = [b.x0 - o, b.y0 - o, b.x1 + o, b.y1 + o];
    const r = Math.min(b.r + o, (x1 - x0) / 2, (y1 - y0) / 2);
    return new Track(x0 + r, y0)
        .line(x1 - r, y0)
        .arc(x1 - r, y0 + r, r, -PI / 2, 0)
        .line(x1, y1 - r)
        .arc(x1 - r, y1 - r, r, 0, PI / 2)
        .line(x0 + r, y1)
        .arc(x0 + r, y1 - r, r, PI / 2, PI)
        .line(x0, y0 + r)
        .arc(x0 + r, y0 + r, r, PI, PI * 1.5)
        .close();
};

/**
 * Over the tops of a row of days, `rho` from each centre: an arc over each
 * day, dipping where two arcs meet between two days (or a short line where
 * they do not). Marks the distance at each day's top in `tops`.
 * @param {Box[]} row @param {number} rho @param {number} [from] the start angle on the first day @param {number} [to] the end angle on the last
 */
const overTops = (row, rho, from = -PI / 2, to = -PI / 2) => {
    const c = row.map(centre);
    const track = new Track(c[0].x + rho * Math.cos(from), c[0].y + rho * Math.sin(from));
    /** @type {number[]} */
    const tops = [];
    let a = from;
    for (let k = 0; k < c.length; k++) {
        const last = k === c.length - 1;
        if (a < -PI / 2) {
            track.arc(c[k].x, c[k].y, rho, a, -PI / 2);
            a = -PI / 2;
        }
        tops.push(track.length);
        if (last) {
            if (to > a) track.arc(c[k].x, c[k].y, rho, a, to);
            break;
        }
        const half = (c[k + 1].x - c[k].x) / 2;
        if (rho > half) {
            const exit = Math.atan2(-Math.sqrt(rho * rho - half * half), half);
            track.arc(c[k].x, c[k].y, rho, a, exit);
            a = Math.atan2(-Math.sqrt(rho * rho - half * half), -half);
        } else {
            track.arc(c[k].x, c[k].y, rho, a, -PI / 4);
            track.line(c[k + 1].x + rho * Math.cos(-PI * 0.75), c[k + 1].y + rho * Math.sin(-PI * 0.75));
            a = -PI * 0.75;
        }
    }
    return { track, tops };
};

/* ------------------------------------------------- generated keyframes */

/** @type {CSSStyleSheet | null} */
let generated = null;
const generatedNames = new Map();

/** Writes `@keyframes` once per distinct body and returns its name. */
const keyframes = (/** @type {string} */ body) => {
    const known = generatedNames.get(body);
    if (known) return known;
    if (!generated) {
        const el = document.createElement('style');
        el.setAttribute('data-pa-b', 'keyframes');
        document.head.append(el);
        generated = /** @type {CSSStyleSheet} */ (el.sheet);
    }
    const name = `pa-b-g${generatedNames.size}`;
    generated.insertRule(`@keyframes ${name} { ${body} }`, generated.cssRules.length);
    generatedNames.set(body, name);
    return name;
};

/** One keyframe: at `p` per cent, the declarations, and the curve to the next. */
const frame = (/** @type {number} */ p, /** @type {string} */ decl, /** @type {string} */ ease = '') =>
    `${num(Math.max(0, Math.min(100, p)))}% { ${decl}${ease ? `; animation-timing-function: ${ease}` : ''} }`;

/* ------------------------------------------------------- the carriers */

/** @typedef {{ x0: number, y0: number, x1: number, y1: number, r: number }} Box */
/**
 * @typedef {{ kind: 'plate' | 'menu' | 'day' | 'skel' | 'bar', em: number, box: Box, out: Box,
 *   index: number, sibs: Box[], row: Box[] }} Geo
 */

const centre = (/** @type {Box} */ b) => ({ x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2, r: (b.x1 - b.x0) / 2 });

/** The corner radius of an element in px. */
const radiusOf = (/** @type {Element} */ el, /** @type {number} */ w, /** @type {number} */ h) => {
    const raw = getComputedStyle(el).borderTopLeftRadius;
    const r = raw.endsWith('%') ? (parseFloat(raw) / 100) * Math.min(w, h) : parseFloat(raw) || 0;
    return Math.min(r, w / 2, h / 2);
};

/**
 * Where a strip sits, in its own px: the strip covers its carrier's padding
 * box, so the carrier's border box runs from minus its border. A menu row's
 * outline is its menu's; a day and a skeleton line also know their siblings.
 * Layout offsets, not rectangles, so the review dialog's scaling and a
 * carrier's own animation (variant 6 moves the days) do not count.
 * @param {HTMLElement} strip @returns {Geo | null}
 */
const measure = (strip) => {
    const carrier = /** @type {HTMLElement} */ (strip.parentElement);
    if (!carrier || !carrier.offsetWidth) return null;
    const kind = carrier.classList.contains('pa-day')
        ? 'day'
        : carrier.classList.contains('pa-skel__line')
          ? 'skel'
          : carrier.classList.contains('kp-progressbar__track')
            ? 'bar'
            : carrier.classList.contains('kp-menu__item')
              ? 'menu'
              : 'plate';
    // The strip's own place in its carrier: the key figure lays its children
    // out in a grid column, so an absolute strip starts at its padding there.
    const bw = carrier.clientLeft + strip.offsetLeft;
    const bh = carrier.clientTop + strip.offsetTop;
    const boxOf = (/** @type {HTMLElement} */ el, dx = 0, dy = 0) => ({
        x0: dx - bw,
        y0: dy - bh,
        x1: dx - bw + el.offsetWidth,
        y1: dy - bh + el.offsetHeight,
        r: radiusOf(el, el.offsetWidth, el.offsetHeight),
    });
    const box = boxOf(carrier);
    let out = box;
    if (kind === 'menu') {
        const pop = /** @type {HTMLElement | null} */ (carrier.closest('.kp-popover'));
        if (pop) {
            const k = carrier.offsetWidth / Math.max(1, carrier.getBoundingClientRect().width);
            const [p, c] = [pop.getBoundingClientRect(), carrier.getBoundingClientRect()];
            out = {
                x0: (p.left - c.left) * k - bw,
                y0: (p.top - c.top) * k - bh,
                x1: (p.right - c.left) * k - bw,
                y1: (p.bottom - c.top) * k - bh,
                r: radiusOf(pop, pop.offsetWidth, pop.offsetHeight),
            };
        }
    }
    /** @type {Box[]} */
    let sibs = [box];
    let index = 0;
    if (kind === 'day' || kind === 'skel') {
        const all = /** @type {HTMLElement[]} */ ([...(carrier.parentElement?.children || [])].filter((e) => e.classList.contains(carrier.classList[0])));
        index = all.indexOf(carrier);
        sibs = all.map((s) => boxOf(s, s.offsetLeft - carrier.offsetLeft, s.offsetTop - carrier.offsetTop));
    }
    // The days on the first's line (they never wrap at the page's widths, but a narrow dialog could).
    const row = sibs.filter((s) => Math.abs(s.y0 - sibs[0].y0) < 2);
    return { kind, em: parseFloat(getComputedStyle(strip).fontSize) || 8, box, out, index, sibs, row };
};

/* ---------------------------------------------------- the caterpillar */

/** A pom-pom, or the head when `face`; `style` places it. */
const pom = (/** @type {string} */ style, face = false) => `<i class="${face ? 'pa-b-face' : 'pa-b-pom'}" style="${style}"></i>`;

/** A train of `n` pom-poms and the head, each `gap` behind the next along a path. */
const train = (/** @type {number} */ n, /** @type {number} */ gap) =>
    many(n, (k) => pom(`--k: ${k}; --lag: ${px((n - k) * gap + gap * 0.15)}`)) + pom(`--k: ${n}; --lag: 0px`, true);

/** Variant 2: round each carrier's outline, every day its own. */
const roundTheEdge = (/** @type {Geo} */ g) => {
    const q = g.em;
    const out = q * 0.5 + 0.5;
    let track;
    let t;
    if (g.kind === 'day') {
        const c = centre(g.box);
        track = ring(c.x, c.y, c.r + out);
        t = 5200;
    } else {
        track = roundRect(g.out, out);
        t = (track.length / (g.kind === 'skel' ? 46 : 62)) * 1000;
    }
    const n = g.kind === 'day' ? 3 : g.kind === 'skel' ? 4 : 5;
    return `<span class="pa-b-orbit" style="--pa-b-path: path('${track.d}'); --pa-b-t: ${Math.round(t)}ms">${train(n, q * 0.74)}</span>`;
};

/**
 * Variant 3: the inchworm. Six pieces (tail 0 … head 5); each inch the tail
 * comes up to the head in an arch, then the head reaches one stride forward.
 * `x0/y0` the stretched pose, `x1/y1` the arch, `x2` the next stretched pose
 * (one stride on); the wrapper steps one stride per inch, so the loop is
 * seamless.
 */
const inchworm = (/** @type {Geo} */ g) => {
    const q = g.em;
    let p;
    let n;
    let x;
    let y;
    if (g.kind === 'day') {
        if (g.index !== 0 || g.row.length < 2) return '';
        p = centre(g.row[1]).x - centre(g.row[0]).x;
        n = Math.max(1, g.row.length - 2);
        x = centre(g.row[0]).x;
        y = g.row[0].y0;
    } else {
        const e = g.out;
        p = q * 4.2;
        const from = e.x0 + e.r + q;
        n = Math.max(1, Math.floor((e.x1 - e.r - q - from - p) / p));
        x = from;
        y = e.y0;
    }
    const b = Math.min(q * 3, p * 0.4);
    const H = Math.min(q * 1.4, 14 - q);
    const pieces = many(6, (i) => {
        const x0 = (i * p) / 5;
        const x1 = p - b / 2 + (b * (1 - Math.cos((PI * i) / 5))) / 2;
        const y1 = -q / 2 - H * Math.sin((PI * i) / 5);
        return pom(`--k: ${i}; --x0: ${px(x0)}; --y0: ${px(-q / 2)}; --x1: ${px(x1)}; --y1: ${px(y1)}; --x2: ${px(x0 + p)}`, i === 5);
    });
    return `<span class="pa-b-inch" style="left: ${px(x)}; top: ${px(y)}; --pa-b-n: ${n}; --pa-b-go: ${px(n * p)}"><span class="pa-b-inch__go">${pieces}</span></span>`;
};

/** Six pieces in a ring of radius `R` (the head last), and in a line lying `lie` below the ring's centre. */
const coil = (/** @type {number} */ R, /** @type {number} */ gap, /** @type {number} */ lie, /** @type {(v: number) => string} */ unit) =>
    many(6, (i) => {
        const a = -PI / 2 + (i * PI) / 3;
        return pom(
            `--k: ${i}; --lx: ${unit((i - 2.5) * gap)}; --ly: ${unit(lie)}; --rx: ${unit(R * Math.cos(a))}; --ry: ${unit(R * Math.sin(a))}`,
            i === 5,
        );
    });

/** Variant 4: curled into a wheel, rolled along (over the day tops), uncurled. */
const wheel = (/** @type {Geo} */ g) => {
    const q = g.em;
    const gap = q * 0.74;
    const R = q * 1.05;
    const rolling = R + q / 2 + 0.5;
    let track;
    if (g.kind === 'day') {
        if (g.index !== 0 || g.row.length < 2) return '';
        track = overTops(g.row, centre(g.row[0]).r + rolling).track;
    } else {
        const e = g.out;
        const from = e.x0 + e.r + gap * 3;
        track = new Track(from, e.y0 - rolling).line(Math.max(from + q, e.x1 - e.r - gap * 3), e.y0 - rolling);
    }
    const turns = Math.max(1, Math.round(track.length / (2 * PI * rolling)));
    const t = Math.min(9000, Math.max(4200, (track.length / 52 / 0.52) * 1000));
    return `<span class="pa-b-wheel" style="--pa-b-path: path('${track.d}'); --pa-b-spin: ${turns * 360}deg; --pa-b-t: ${Math.round(t)}ms"><span class="pa-b-wheel__roll">${coil(R, gap, rolling - q / 2 - 0.5, px)}</span></span>`;
};

/** Variant 5 on a strip of something to eat: the tape on a plate's top edge, the skeleton line itself, the tape in the bar. */
const nibble = (/** @type {Geo} */ g) => {
    const q = g.em;
    let L;
    let T;
    let W;
    let H;
    if (g.kind === 'skel') {
        [L, T, W, H] = [g.box.x0, g.box.y0, g.box.x1 - g.box.x0, g.box.y1 - g.box.y0];
    } else if (g.kind === 'bar') {
        const inset = 3;
        [L, T, W, H] = [inset, inset, g.box.x1 - g.box.x0 - 2 * (inset - g.box.x0), g.box.y1 - g.box.y0 - 2 * (inset - g.box.y0)];
    } else {
        const e = g.out;
        H = q * 1.05;
        W = (e.x1 - e.x0) * 0.8;
        L = e.x0 + (e.x1 - e.x0) * 0.1;
        T = e.y0 - H / 2;
    }
    const t = g.kind === 'skel' ? 4800 : 6400;
    return `<span class="pa-b-meal" style="left: ${px(L)}; top: ${px(T)}; inline-size: ${px(W)}; block-size: ${px(H)}; --pa-b-t: ${t}ms"><i class="pa-b-leaf"></i><span class="pa-b-eater">${many(4, (k) => pom(`--k: ${k}`))}${pom('--k: 4', true)}</span></span>`;
};

/**
 * Variant 5 on the days: the caterpillar crawls from top to top, stops on
 * each and takes a bite out of its rim; the bites heal together at the end.
 * Generated keyframes: the stops depend on the days' spacing.
 */
const feast = (/** @type {Geo} */ g) => {
    if (g.index !== 0 || g.row.length < 2) return '';
    const q = g.em;
    const rd = centre(g.row[0]).r;
    const { track, tops } = overTops(g.row, rd + q / 2 + 0.5, -PI * 0.86, -PI * 0.16);
    const m = tops.length;
    const enter = 6;
    const hold = Math.min(10, 64 / m - 6);
    const move = Math.min(8, (72 - m * hold) / Math.max(1, m - 1));
    const at = (/** @type {number} */ k) => enter + k * (hold + move);
    const leave = at(m - 1) + hold;
    const dist = (/** @type {number} */ s) => `offset-distance: calc(${px(s)} - var(--lag))`;
    let body = frame(0, `${dist(Math.max(0, tops[0] - q * 3))}; opacity: 0`, 'ease-out');
    for (let k = 0; k < m; k++) {
        body += frame(at(k), `${dist(tops[k])}; opacity: 1`);
        body += frame(at(k) + hold, `${dist(tops[k])}; opacity: 1`, 'ease-in-out');
    }
    body += frame(leave + 7, `${dist(track.length)}; opacity: 0`);
    body += frame(100, `${dist(track.length)}; opacity: 0`);
    const crawl = keyframes(body);
    const bites = g.row
        .map((d, k) => {
            const c = centre(d);
            const b = at(k) + hold * 0.25;
            const name = keyframes(
                frame(0, 'scale: 0') +
                    frame(b, 'scale: 0', LAND) +
                    frame(b + hold * 0.3, 'scale: 0.62', LAND) +
                    frame(b + hold * 0.65, 'scale: 1') +
                    frame(90, 'scale: 1', 'ease-in-out') +
                    frame(97, 'scale: 0') +
                    frame(100, 'scale: 0'),
            );
            return `<i class="pa-b-bite" style="left: ${px(c.x)}; top: ${px(d.y0)}; --pa-b-kf: ${name}; --pa-b-still: ${k < 2 ? 1 : 0}"></i>`;
        })
        .join('');
    return `<span class="pa-b-feast" style="--pa-b-path: path('${track.d}'); --pa-b-kf: ${crawl}; --pa-b-still: ${px(tops[Math.min(2, m - 1)])}">${bites}<span class="pa-b-train">${train(4, q * 0.74)}</span></span>`;
};

/** Variant 6: the carrier becomes the caterpillar (its head, its legs; on lines and the bar a row of pom-poms). */
const becomes = (/** @type {Geo} */ g) => {
    const q = g.em;
    if (g.kind === 'day') {
        const c = centre(g.box);
        const legs = `<i class="pa-b-leg" style="left: ${px(c.x - q * 0.9)}; top: ${px(g.box.y1)}"></i><i class="pa-b-leg pa-b-leg--b" style="left: ${px(c.x + q * 0.9)}; top: ${px(g.box.y1)}"></i>`;
        const head = g.index === g.sibs.length - 1 ? `<i class="pa-b-face pa-b-face--day" style="left: ${px(g.box.x1 + q * 0.7)}; top: ${px(c.y - q * 0.5)}"></i>` : '';
        return legs + head;
    }
    if (g.kind === 'skel' || g.kind === 'bar') {
        const inset = g.kind === 'bar' ? 3 : 0;
        const [x0, y0] = [g.kind === 'bar' ? inset : g.box.x0, g.kind === 'bar' ? inset : g.box.y0];
        const H = g.kind === 'bar' ? g.box.y1 - g.box.y0 - 2 * (inset - g.box.y0) : g.box.y1 - g.box.y0;
        const W = g.kind === 'bar' ? g.box.x1 - g.box.x0 - 2 * (inset - g.box.x0) : g.box.x1 - g.box.x0;
        const step = H * 0.78;
        const n = Math.max(3, Math.floor((W - H * 1.1) / step));
        const beads = many(n, (k) => `<i class="pa-b-bead" style="left: ${px(x0 + k * step)}; top: ${px(y0)}; --s: ${px(H)}; --k: ${k}"></i>`);
        return `<span class="pa-b-body" style="--n: ${n}">${beads}<i class="pa-b-face pa-b-face--line" style="left: ${px(x0 + n * step - H * 0.05)}; top: ${px(y0 - H * 0.08)}; --s: ${px(H * 1.16)}; --k: ${n}"></i></span>`;
    }
    const e = g.out;
    const reach = e.x1 - e.x0 - 2 * e.r;
    const n = Math.max(3, Math.floor(reach / (q * 3.4)));
    const legs = many(n, (k) => `<i class="pa-b-leg" style="left: ${px(e.x0 + e.r + ((k + 0.5) * reach) / n)}; top: ${px(e.y1)}; --k: ${k}"></i>`);
    const head = `<i class="pa-b-face pa-b-face--lead" style="left: ${px(e.x1 - e.r * 0.29)}; top: ${px(e.y0 + e.r * 0.29)}"></i>`;
    return `<span class="pa-b-body" style="--n: ${n}">${legs}${head}</span>`;
};

/* -------------------------------------------------------------- the plane */

/**
 * Variant 2: touch and go. Touch points on the surface; a curve in from the
 * upper start, a short skid on each touch (on the landing), a hop to the next
 * (lower each time on a plate and the bar, like a skipped stone), then up
 * and away. Generated keyframes: the times follow the path's lengths.
 */
const hops = (/** @type {Geo} */ g) => {
    const q = g.em;
    const lift = q * 0.55;
    /** @type {number[][]} */
    let touch;
    /** @type {number[]} */
    let apex;
    if (g.kind === 'day') {
        if (g.index !== 0 || g.row.length < 2) return '';
        touch = g.row.map((d) => [centre(d).x - q * 0.6, d.y0 - lift]);
        apex = touch.map(() => 9);
    } else if (g.kind === 'skel') {
        const b = g.box;
        touch = [0.3, 0.66].map((f) => [b.x0 + (b.x1 - b.x0) * f, b.y0 - lift]);
        apex = [6, 5];
    } else {
        const e = g.out;
        const fr = g.kind === 'bar' ? [0.18, 0.4, 0.58, 0.72, 0.82] : [0.26, 0.5, 0.68, 0.8];
        touch = fr.map((f) => [e.x0 + (e.x1 - e.x0) * f, e.y0 - lift]);
        apex = touch.map((_, k) => Math.max(2, 7 - k * 1.6));
    }
    const skid = q * 0.9;
    const first = touch[0];
    const track = new Track(first[0] - q * 5, first[1] - 12);
    /** @type {{ s: number, ms: number, ease: string }[]} */
    const stops = [{ s: 0, ms: 0, ease: 'ease-in' }];
    const fly = (/** @type {number} */ len) => (len / 95) * 1000;
    track.quad(first[0] - q * 2, first[1] - 4, first[0], first[1]);
    stops.push({ s: track.length, ms: stops[0].ms + fly(track.length), ease: LAND });
    touch.forEach(([x, y], k) => {
        track.line(x + skid, y);
        const last = stops[stops.length - 1];
        stops.push({ s: track.length, ms: last.ms + 300, ease: 'ease-in-out' });
        const next = touch[k + 1];
        const before = track.length;
        if (next) {
            track.quad((x + skid + next[0]) / 2, Math.min(y, next[1]) - apex[k] * 2, next[0], next[1]);
            stops.push({ s: track.length, ms: stops[stops.length - 1].ms + fly(track.length - before) * 1.15, ease: LAND });
        } else {
            track.quad(x + skid + q * 3, y - 2, x + skid + q * 5, y - 13);
            stops.push({ s: track.length, ms: stops[stops.length - 1].ms + fly(track.length - before), ease: 'linear' });
        }
    });
    const total = stops[stops.length - 1].ms + 700;
    let body = '';
    stops.forEach((st, k) => {
        const p = (st.ms / total) * 100;
        const op = k === 0 || k === stops.length - 1 ? 0 : 1;
        body += frame(p, `offset-distance: ${px(st.s)}; opacity: ${op}`, st.ease);
    });
    body += frame(100, `offset-distance: ${px(track.length)}; opacity: 0`);
    const still = stops[Math.min(stops.length - 2, 5)].s;
    return `<span class="pa-b-hop" style="--pa-b-path: path('${track.d}'); --pa-b-kf: ${keyframes(body)}; --pa-b-t: ${Math.round(total)}ms; --pa-b-still: ${px(still)}">${PLANE}</span>`;
};

/**
 * Variant 3: folded and opened again. Rest points where the sheet lies (half
 * on the edge, or on a day's top-end shoulder); each period of 1800 ms the
 * sheet folds into a plane, flies a small arc to the next rest point and
 * opens there; after the last it flies off. The mover's keyframes are
 * generated (positions and turns along each arc); the folding is one
 * keyframes for every period (pairs-b.css).
 */
const folds = (/** @type {Geo} */ g) => {
    const q = g.em;
    /** @type {number[][]} [x, y, turn] */
    let rest;
    if (g.kind === 'day') {
        if (g.index !== 0 || g.row.length < 2) return '';
        rest = g.row.map((d) => {
            const c = centre(d);
            return [c.x + c.r * Math.cos(-PI / 4), c.y + c.r * Math.sin(-PI / 4), 45];
        });
    } else if (g.kind === 'skel') {
        const b = g.box;
        rest = [
            [b.x0 + q * 2.2, b.y0, -4],
            [b.x1 - q * 2.2, b.y0, 4],
        ];
    } else {
        const e = g.out;
        rest = [0.12, 0.5, 0.86].map((f, k) => [e.x0 + (e.x1 - e.x0) * f, e.y0, k % 2 ? 4 : -4]);
    }
    const m = rest.length;
    const last = rest[m - 1];
    const away = [last[0] + q * 6, last[1] - 14, 0];
    let body = '';
    const at = (/** @type {number} */ j, /** @type {number} */ f) => ((j + f) / m) * 100;
    const place = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ turn, op = 1) => `translate: ${px(x)} ${px(y)}; rotate: ${num(turn)}deg; opacity: ${op}`;
    rest.forEach((r, j) => {
        const next = rest[j + 1] || away;
        const arcTrack = new Track(r[0], r[1]).quad((r[0] + next[0]) / 2, Math.min(r[1], next[1]) - 22, next[0], next[1]);
        const [, , a0] = arcTrack.at(0);
        body += frame(at(j, 0), place(r[0], r[1], r[2], j === 0 ? 0 : 1), 'linear');
        if (j === 0) body += frame(at(0, 0.06), place(r[0], r[1], r[2]));
        body += frame(at(j, 0.36), place(r[0], r[1], r[2]), 'ease-in-out');
        body += frame(at(j, 0.47), place(r[0], r[1], a0), 'ease-in');
        for (let i = 1; i <= 6; i++) {
            const [x, y, a] = arcTrack.at((arcTrack.length * i) / 6);
            const end = i === 6;
            const op = j === m - 1 && end ? 0 : 1;
            body += frame(at(j, 0.47 + (0.31 * i) / 6), place(x, y, a, op), end ? 'ease-out' : 'linear');
        }
        if (j < m - 1) body += frame(at(j, 0.86), place(next[0], next[1], next[2]), 'linear');
    });
    body += frame(100, place(away[0], away[1], 0, 0));
    return `<span class="pa-b-fold" style="--pa-b-kf: ${keyframes(body)}; --pa-b-m: ${m}; translate: ${px(rest[Math.min(1, m - 1)][0])} ${px(rest[Math.min(1, m - 1)][1])}; rotate: ${rest[Math.min(1, m - 1)][2]}deg"><span class="pa-b-sheet"><i></i><i></i></span>${PLANE}</span>`;
};

/**
 * Variant 4: loopings round things. A whole looping round each day, along the
 * tops in between; one big round outside a plate, a menu and the bar; a
 * plane of its own round each skeleton line.
 */
const loopings = (/** @type {Geo} */ g) => {
    const q = g.em;
    let track;
    let t;
    let open = false;
    if (g.kind === 'day') {
        if (g.index !== 0 || g.row.length < 1) return '';
        const c = g.row.map(centre);
        const rho = c[0].r + q * 0.95;
        track = new Track(c[0].x - rho - q * 4, c[0].y - rho).line(c[0].x, c[0].y - rho);
        c.forEach((d, k) => {
            track.arc(d.x, d.y, rho, -PI / 2, PI * 1.5);
            const next = c[k + 1];
            track.line(next ? next.x : d.x + rho + q * 5, (next || d).y - rho);
        });
        t = (track.length / 70) * 1000;
        open = true;
    } else {
        track = roundRect(g.out, q * 0.85);
        t = g.kind === 'skel' ? 3600 : (track.length / 150) * 1000;
    }
    return `<span class="pa-b-looper${open ? ' pa-b-looper--open' : ''}" style="--pa-b-path: path('${track.d}'); --pa-b-t: ${Math.round(t)}ms">${PLANE}</span>`;
};

/** Variant 5 on a strip: the plane lays the tape along it and later pulls it off again. */
const tapeRun = (/** @type {Geo} */ g) => {
    const q = g.em;
    let L;
    let T;
    let W;
    let H;
    if (g.kind === 'skel') {
        [L, T, W, H] = [g.box.x0, g.box.y0, g.box.x1 - g.box.x0, g.box.y1 - g.box.y0];
    } else if (g.kind === 'bar') {
        [L, T, W, H] = [3, 3, g.box.x1 - g.box.x0 - 2 * (3 - g.box.x0), g.box.y1 - g.box.y0 - 2 * (3 - g.box.y0)];
    } else {
        const e = g.out;
        H = q * 1.05;
        W = (e.x1 - e.x0) * 0.8;
        L = e.x0 + (e.x1 - e.x0) * 0.1;
        T = e.y0 - H / 2;
    }
    return `<span class="pa-b-lay" style="left: ${px(L)}; top: ${px(T)}; inline-size: ${px(W)}; block-size: ${px(H)}"><i class="pa-b-tape"></i><span class="pa-b-lay__plane">${PLANE}</span></span>`;
};

/** Variant 5 on the days: the plane drops a tab of tape on each day's top-start corner, and takes them off on its second pass. */
const tapeTabs = (/** @type {Geo} */ g) => {
    if (g.index !== 0 || g.row.length < 1) return '';
    const q = g.em;
    const first = g.row[0];
    const lastDay = g.row[g.row.length - 1];
    const from = first.x0 - q * 2;
    const to = lastDay.x1 + q * 2;
    const span = to - from;
    // pa-b-lay-plane: out at 0 % at -8 % of the span, over 100 % at 40 %; back from -8 % at 70 % to 100 % at 92 %.
    const pass1 = (/** @type {number} */ f) => (40 * (f * 100 + 8)) / 108;
    const pass2 = (/** @type {number} */ f) => 70 + (22 * (f * 100 + 8)) / 108;
    const tabs = g.row
        .map((d) => {
            const c = centre(d);
            const x = c.x + c.r * Math.cos(-PI * 0.75);
            const y = c.y + c.r * Math.sin(-PI * 0.75);
            const f = (x - from) / span;
            const on = pass1(f);
            const off = pass2(f);
            const name = keyframes(
                frame(0, 'opacity: 0; translate: 0 -0.5em; scale: 1.3') +
                    frame(on, 'opacity: 0; translate: 0 -0.5em; scale: 1.3', LAND) +
                    frame(on + 1, 'opacity: 1; translate: 0 -0.35em; scale: 1.2', LAND) +
                    frame(on + 7, 'opacity: 1; translate: 0 0; scale: 1') +
                    frame(off, 'opacity: 1; translate: 0 0; scale: 1', 'ease-in') +
                    frame(off + 5, 'opacity: 0; translate: 0.6em -0.8em; scale: 1.1') +
                    frame(100, 'opacity: 0; translate: 0.6em -0.8em; scale: 1.1'),
            );
            return `<i class="pa-b-tab" style="left: ${px(x)}; top: ${px(y)}; --pa-b-kf: ${name}"></i>`;
        })
        .join('');
    return `${tabs}<span class="pa-b-lay pa-b-lay--over" style="left: ${px(from)}; top: ${px(first.y0 - q * 1.6)}; inline-size: ${px(span)}; block-size: ${px(q)}"><span class="pa-b-lay__plane">${PLANE}</span></span>`;
};

/**
 * Variant 6: thrown darts. Each target is a nose point and the angle the
 * plane sticks at; they arrive one after another, wobble (G9) and all fall
 * off together. Generated keyframes per dart.
 * @param {number[][]} targets [x, y, angle in degrees]
 */
const throwAt = (targets, gapMs = 640) => {
    const n = targets.length;
    const total = n * gapMs + 900 + 1100 + 700;
    const P = (/** @type {number} */ ms) => (ms / total) * 100;
    const fall = n * gapMs + 900 + 1100;
    return targets
        .map(([x, y, a], k) => {
            const t0 = k * gapMs;
            const rad = (a * PI) / 180;
            const back = `translate: ${em(-2.6 * Math.cos(rad))} ${em(-2.6 * Math.sin(rad))}`;
            const name = keyframes(
                frame(0, `${back}; rotate: ${a}deg; opacity: 0`) +
                    frame(P(t0), `${back}; rotate: ${a}deg; opacity: 0`, 'ease-in') +
                    frame(P(t0 + 60), `translate: ${em(-2 * Math.cos(rad))} ${em(-2 * Math.sin(rad))}; rotate: ${a}deg; opacity: 1`, 'ease-in') +
                    frame(P(t0 + 260), `translate: 0 0; rotate: ${a + 10}deg; opacity: 1`, 'ease-out') +
                    frame(P(t0 + 260 + 260), `translate: 0 0; rotate: ${a - 7}deg; opacity: 1`, 'ease-in-out') +
                    frame(P(t0 + 260 + 530), `translate: 0 0; rotate: ${a + 3}deg; opacity: 1`, 'ease-in-out') +
                    frame(P(t0 + 260 + 800), `translate: 0 0; rotate: ${a}deg; opacity: 1`) +
                    frame(P(fall), `translate: 0 0; rotate: ${a}deg; opacity: 1`, 'ease-in') +
                    frame(P(fall + 520), `translate: 0.4em 1.4em; rotate: ${a + 28}deg; opacity: 0`) +
                    frame(100, `translate: 0.4em 1.4em; rotate: ${a + 28}deg; opacity: 0`),
            );
            return `<span class="pa-b-dart" style="left: ${px(x)}; top: ${px(y)}; --pa-b-kf: ${name}; --pa-b-t: ${Math.round(total)}ms; rotate: ${a}deg">${PLANE}</span>`;
        })
        .join('');
};

const darts = (/** @type {Geo} */ g) => {
    if (g.kind === 'day') {
        if (g.index !== 0) return '';
        return throwAt(
            g.row.map((d) => {
                const c = centre(d);
                return [c.x + (c.r + 0.5) * Math.cos(-PI * 0.75), c.y + (c.r + 0.5) * Math.sin(-PI * 0.75), 45];
            }),
        );
    }
    if (g.kind === 'skel') {
        if (g.index !== 0) return '';
        return throwAt(g.sibs.map((b) => [b.x1 - (b.y1 - b.y0) * 0.75, b.y0 + 0.5, 38]), 760);
    }
    const e = g.out;
    const fr = g.kind === 'bar' ? [0.16, 0.33, 0.5, 0.67, 0.84] : g.kind === 'menu' ? [0.45, 0.78] : [0.3, 0.56, 0.82];
    return throwAt(fr.map((f) => [e.x0 + (e.x1 - e.x0) * f, e.y0 + 0.5, g.kind === 'bar' ? 32 : 40]));
};

/* ----------------------------------------------------- the spinners */

/** Spinner 3's inchworm on a ring of radius 0.3em: three inches a lap (em, independent of the size). */
const RING_INCH = (() => {
    const R = 0.27;
    const stride = (PI * 2) / 3;
    const b = 1.1;
    return many(5, (i) => {
        const pos = (/** @type {number} */ a, /** @type {number} */ r) => [r * Math.sin(a), -r * Math.cos(a)];
        const [x0, y0] = pos(-stride / 2 + (i * stride) / 4, R);
        const lift = 0.17 * Math.sin((PI * i) / 4);
        const [x1, y1] = pos(stride / 2 - b / 2 + (b * i) / 4, R + lift);
        const [x2, y2] = pos(stride / 2 + (i * stride) / 4, R);
        return pom(`--k: ${i}; --x0: ${em(x0)}; --y0: ${em(y0)}; --x1: ${em(x1)}; --y1: ${em(y1)}; --x2: ${em(x2)}; --y2: ${em(y2)}`, i === 4);
    });
})();

/** Spinner 4's figure of eight round two dots, as keyframes in em (one sample every 1/24). */
const EIGHT = () => {
    let body = '';
    let prev = null;
    let turn = 0;
    const N = 24;
    for (let i = 0; i <= N; i++) {
        const t = (i / N) * PI * 2;
        const s = Math.sin(t);
        const c = Math.cos(t);
        const d = 1 + s * s;
        const x = (0.42 * c) / d;
        const y = (0.42 * s * c) / d;
        const dx = (-0.42 * s * (1 + s * s) - 0.42 * c * 2 * s * c) / (d * d);
        const dy = (0.42 * (c * c - s * s) * d - 0.42 * s * c * 2 * s * c) / (d * d);
        let a = (Math.atan2(dy, dx) * 180) / PI;
        if (prev !== null) {
            while (a - prev > 180) a -= 360;
            while (a - prev < -180) a += 360;
        }
        prev = a;
        turn = a;
        body += frame((i / N) * 100, `translate: ${em(x)} ${em(y)}; rotate: ${num(turn)}deg`, 'linear');
    }
    return keyframes(body);
};

/** Spinner 6: three darts thrown at the target's rim, 120 degrees apart (placed in per cent, moved in the dart's own em). */
const TARGET_DARTS = () =>
    [-150, -30, 90]
        .map((deg, k) => {
            const rad = (deg * PI) / 180;
            const r = 0.25;
            const x = 0.5 + r * Math.cos(rad);
            const y = 0.5 + r * Math.sin(rad);
            const a = deg + 180;
            const ar = (a * PI) / 180;
            const total = 2400;
            const P = (/** @type {number} */ ms) => (ms / total) * 100;
            const t0 = k * 360;
            const back = `translate: ${em(-2.4 * Math.cos(ar))} ${em(-2.4 * Math.sin(ar))}`;
            const name = keyframes(
                frame(0, `${back}; rotate: ${a}deg; opacity: 0`) +
                    frame(P(t0), `${back}; rotate: ${a}deg; opacity: 0`, 'ease-in') +
                    frame(P(t0 + 40), `${back}; rotate: ${a}deg; opacity: 1`, 'ease-in') +
                    frame(P(t0 + 200), `translate: 0 0; rotate: ${a + 10}deg; opacity: 1`, 'ease-out') +
                    frame(P(t0 + 380), `translate: 0 0; rotate: ${a - 7}deg; opacity: 1`, 'ease-in-out') +
                    frame(P(t0 + 560), `translate: 0 0; rotate: ${a + 3}deg; opacity: 1`, 'ease-in-out') +
                    frame(P(t0 + 760), `translate: 0 0; rotate: ${a}deg; opacity: 1`) +
                    frame(P(1880), `translate: 0 0; rotate: ${a}deg; opacity: 1`, 'ease-in') +
                    frame(P(2200), `translate: 0.3em 1.5em; rotate: ${a + 25}deg; opacity: 0`) +
                    frame(100, `translate: 0.3em 1.5em; rotate: ${a + 25}deg; opacity: 0`),
            );
            return `<span class="pa-b-dart" style="left: ${num(x * 100)}%; top: ${num(y * 100)}%; --pa-b-kf: ${name}; rotate: ${a}deg">${PLANE}</span>`;
        })
        .join('');

/* --------------------------------------------------- what goes where */

/** What each loading picture adds inside a strip (variant 1 of each family draws as in round 2). */
const LOADING_EXTRA = /** @type {Record<string, (g: Geo) => string>} */ ({
    'b-bug': () => `<span class="pa-b-bug">${many(4, (k) => `<i style="--k: ${k}"></i>`)}<i class="pa-b-head" style="--k: 4"></i></span>`,
    'b-bug-2': roundTheEdge,
    'b-bug-3': inchworm,
    'b-bug-4': wheel,
    'b-bug-5': (g) => (g.kind === 'day' ? feast(g) : nibble(g)),
    'b-bug-6': becomes,
    'b-plane': () => `<span class="pa-b-flight">${PLANE}</span>`,
    'b-plane-2': hops,
    'b-plane-3': folds,
    'b-plane-4': loopings,
    'b-plane-5': (g) => (g.kind === 'day' ? tapeTabs(g) : tapeRun(g)),
    'b-plane-6': darts,
});

/** What each spinner adds inside the `.kp-spinner`. */
const SPINNER_EXTRA = /** @type {Record<string, () => string>} */ ({
    'b-curl': () => `<span class="pa-b-ring">${many(8, (k) => `<i style="--k: ${k}"${k === 7 ? ' class="pa-b-head"' : ''}><b></b></i>`)}</span>`,
    'b-curl-2': () => `<i class="pa-b-dish"></i><span class="pa-b-orbit">${many(3, (k) => pom(`--k: ${k}; --lag: ${em((3 - k) * 0.13)}`))}${pom('--k: 3; --lag: 0em', true)}</span>`,
    'b-curl-3': () => `<span class="pa-b-inch__go">${RING_INCH}</span>`,
    'b-curl-4': () => `<span class="pa-b-wheel__roll">${coil(0.27, 0.15, 0, em)}</span>`,
    'b-curl-5': () => `<i class="pa-b-cookie"></i><span class="pa-b-muncher"><i class="pa-b-pom" style="--k: 0"></i><i class="pa-b-pom" style="--k: 1"></i>${pom('--k: 2', true)}</span>`,
    'b-curl-6': () => `<span class="pa-b-dots">${many(3, (k) => pom(`--k: ${k}`))}${pom('--k: 3', true)}</span>`,
    'b-loop': () => `<span class="pa-b-loop">${PLANE}</span>`,
    'b-loop-2': () => `<i class="pa-b-dish"></i><span class="pa-b-hopper"><span class="pa-b-hopper__lift">${PLANE}</span></span>`,
    'b-loop-3': () => `<span class="pa-b-fold"><span class="pa-b-sheet"><i></i><i></i></span>${PLANE}</span>`,
    'b-loop-4': () => `<i class="pa-b-dish pa-b-dish--a"></i><i class="pa-b-dish pa-b-dish--b"></i><span class="pa-b-eight" style="--pa-b-kf: ${EIGHT()}">${PLANE}</span>`,
    'b-loop-5': () => `<i class="pa-b-reel"></i><span class="pa-b-circler">${PLANE}</span>`,
    'b-loop-6': () => `<i class="pa-b-dish pa-b-dish--target"></i>${TARGET_DARTS()}`,
});

/**
 * Called by demo.js after layout, on a resize and when an option changes:
 * removes what this file added earlier and adds what the option `key` needs
 * inside the existing carriers, measured.
 * @param {Element} scene the `.pa-scene`
 * @param {string} aspectId 'loading' or 'spinner'
 * @param {string} key the option's key
 */
export function decorate(scene, aspectId, key) {
    for (const old of scene.querySelectorAll('[data-pa-extra="b"]')) old.remove();
    const wrap = (/** @type {string} */ inner) => `<span class="pa-b-x" data-pa-extra="b" aria-hidden="true">${inner}</span>`;
    if (aspectId === 'loading') {
        const make = LOADING_EXTRA[key];
        if (!make) return;
        for (const strip of /** @type {NodeListOf<HTMLElement>} */ (scene.querySelectorAll('.pa-strip'))) {
            const g = measure(strip);
            if (!g) continue;
            const inner = make(g);
            if (inner) strip.insertAdjacentHTML('beforeend', wrap(inner));
        }
    } else if (aspectId === 'spinner') {
        const make = SPINNER_EXTRA[key];
        if (!make) return;
        for (const spinner of scene.querySelectorAll('.kp-spinner')) spinner.insertAdjacentHTML('beforeend', wrap(make()));
    }
}
