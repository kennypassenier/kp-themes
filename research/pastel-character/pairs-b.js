// research/pastel-character, pairs 12-21: ten out-of-the-box pairs for the
// questions "Laden" (loading) and "De spinner". Each pair is one craft idea from
// a school craft table (felt, clay, googly eyes, pom-poms, knitting, cut paper,
// origami, a paper spring, a paper plane, a pinwheel), drawn in pastel's three
// inks (plum acts, mint fills, sky is only the flat second pass beside a part),
// round, no blur, no flicker, calm loops of 1.2 s or more. The loading picture
// lives inside every waiting part's `.pa-strip` (tile, panel, menu row, days,
// chart, skeleton lines, busy bar); the spinner inside every `.kp-spinner` of
// the spinner scene (three sizes, busy button, busy panel). pairs-b.css draws
// them; `decorate` adds the few elements CSS alone cannot draw.

/** The loading pictures, in pair order. */
export const LOADING_OPTIONS = [
    {
        key: 'b-eyes',
        name: 'Wiebeloogjes',
        see: 'Boven elk wachtend onderdeel gluren twee wiebeloogjes over de rand: de pupillen kijken naar het begin, dan naar het eind, en vallen dan los naar beneden; één keer per ronde knippert een muntkleurig ooglid (3200 ms). In elke dag zit een paartje, aan het eind van elke skeletregel ook.',
        verdict:
            'Alternatief: wiebeloogjes zijn het bekendste knutselmateriaal dat er is; het wachten wordt een diertje dat meekijkt, in pruim en munt, met zijn blauwe tweede inkt ernaast.',
    },
    {
        key: 'b-bug',
        name: 'De pomponrups',
        see: 'Een rupsje van vier muntkleurige pompons met een pruimkleurig kopje en voelsprieten kruipt over de bovenrand van begin naar eind; een bultje loopt van staart naar kop door zijn lijf (1200 ms). Over de dagen, de skeletregels en de balk kruipt hetzelfde rupsje.',
        verdict:
            'Alternatief: een pomponrups is het klassieke knutselwerkje van de kleuterklas; hij kruipt in leesrichting en zijn bultje is de rustige golf van een lus.',
    },
    {
        key: 'b-stitch',
        name: 'Naald en draad',
        see: 'Over de bovenrand ligt een strook munt vilt; een naald rijgt er een pruimkleurige rijgsteek in van begin naar eind, en haalt de draad daarna weer terug (2400 ms). Skeletregels en de balk worden zelf de vilt strook.',
        verdict:
            'Alternatief: vilt en een rijgsteek zijn zacht en met de hand gemaakt; de steek komt er een voor een bij, zoals gegevens binnenkomen.',
    },
    {
        key: 'b-knit',
        name: 'Er wordt gebreid',
        see: 'Over de bovenrand groeit een gebreid muntkleurig bandje, steek voor steek van begin naar eind, met het bolletje wol dat rollend voorop gaat; daarna wordt het weer uitgehaald en rolt het bolletje terug (3600 ms heen en terug).',
        verdict: 'Alternatief: breien is wachten dat iets oplevert; het bolletje dat meerolt maakt het levendig zonder druk te worden.',
    },
    {
        key: 'b-clay',
        name: 'Kleibolletjes',
        see: 'Drie bolletjes klei (munt, pruim, munt) liggen op de bovenrand; een onzichtbare duim drukt ze een voor een plat en ze veren rond terug, op de landingscurve (2400 ms). In elke dag ligt één bolletje, de dagen na elkaar.',
        verdict:
            'Alternatief: boetseerklei is het zachtste knutselmateriaal; het platdrukken en terugveren is de zachte landing van pastel in een ander materiaal.',
    },
    {
        key: 'b-dolls',
        name: 'Papieren poppetjes',
        see: 'Een slinger papieren poppetjes die elkaars hand vasthouden vouwt zich als een harmonica open over de bovenrand, van begin naar eind, en vouwt daarna weer dicht; het dichtgevouwen pakje schuift voorop mee (3200 ms).',
        verdict:
            'Alternatief: de poppetjesslinger is knippen en vouwen tegelijk; de poppetjes om en om munt en pruim, zoals de voor- en achterkant van gevouwen papier.',
    },
    {
        key: 'b-fortune',
        name: 'Happertjes',
        see: 'Een rijtje gevouwen happertjes (vier vakjes, pruim en munt) gaat om de beurt open en dicht, eerst naar links en rechts, dan naar boven en onder, van begin naar eind als een golf (2400 ms). In elke dag zit er één.',
        verdict: 'Alternatief: het happertje kent iedereen van de speelplaats; een vouwwerkje dat telt, en het tellen is wat wachten is.',
    },
    {
        key: 'b-ladder',
        name: 'De heksentrap',
        see: 'Over de bovenrand ligt een heksentrap van pruim en munt papier, aan het begin vastgehouden; hij veert uit tot over de hele breedte met één zachte doorschieter en trekt zich weer samen (2400 ms). De skeletregels en de balk veren zelf.',
        verdict:
            'Alternatief: de heksentrap is een klassiek knutselwerk uit de lagere school; het veren is een lus die je meteen herkent, zonder pijl of balk.',
    },
    {
        key: 'b-plane',
        name: 'Per vouwvliegtuigje',
        see: 'Een papieren vliegtuigje zweeft over de bovenrand van begin naar eind, deint zacht op en neer en komt telkens opnieuw aan (3600 ms per vlucht); over de dagen, de skeletregels en de balk vliegt hetzelfde vliegtuigje.',
        verdict: 'Alternatief: de gegevens komen per vouwvliegtuigje; een knipoog die elk kind snapt, in leesrichting en zonder haast.',
    },
    {
        key: 'b-pinwheel',
        name: 'Papieren molentjes',
        see: 'Drie papieren molentjes op een stokje staan in de bovenrand geprikt; een windvlaag draait ze om de beurt één keer rond, van begin naar eind, en ze komen zacht tot stilstand (2400 ms). In elke dag draait één molentje.',
        verdict: 'Alternatief: een molentje vouw je uit één blaadje; het draait alleen als er iets aankomt, en dat is precies wat laden zegt.',
    },
];

/** The spinners: each the same idea in small, in the same order. */
export const SPINNER_OPTIONS = [
    {
        key: 'b-eye',
        name: 'Het wiebeloog',
        see: 'Eén groot wiebeloog; zijn pruimkleurige pupil rolt in drie losse sprongetjes per ronde langs de rand, elk op de landingscurve (1800 ms), met het glimpje erop dat stil blijft staan.',
        verdict: 'Alternatief: het wiebeloog van het laden in het klein; een pupil die rondtolt is een spinner die je toelacht.',
    },
    {
        key: 'b-curl',
        name: 'De opgerolde rups',
        see: 'Het pomponrupsje ligt opgerold in een kring, kop tegen staart; een bultje loopt rond door zijn lijf (1200 ms) terwijl de kring langzaam meedraait (4800 ms).',
        verdict: 'Alternatief: dezelfde rups als bij het laden, opgerold; de bult die rondgaat is de spinner.',
    },
    {
        key: 'b-button',
        name: 'Een knoop aannaaien',
        see: 'Een muntkleurige vilten knoop met vier gaatjes; de naald naait er een pruimkleurige rijgsteek rondom in en haalt hem daarna terug (2400 ms).',
        verdict: 'Alternatief: dezelfde naald en draad als bij het laden, in een rondje; de steek die rondloopt is een spinner zonder iets dat tolt.',
    },
    {
        key: 'b-yarn',
        name: 'Het bolletje wol',
        see: 'Een muntkleurig bolletje wol met een los draadje wordt in drie rukjes per ronde verder getrokken, elk op de landingscurve (1800 ms), alsof er ergens gebreid wordt.',
        verdict:
            'Alternatief: het bolletje dat bij het laden meerolt, hier alleen; de rukjes zijn de sprongetjes van de taperol in een ander materiaal.',
    },
    {
        key: 'b-knead',
        name: 'Klei kneden',
        see: 'Eén muntkleurig bolletje klei wordt drie keer per ronde platgedrukt en draait daarbij een derde verder, waarna het rond terugveert (1800 ms); het glimlichtje laat zien dat het draait.',
        verdict: 'Alternatief: het kleibolletje van het laden, nu gekneed; platdrukken en terugveren op de landingscurve.',
    },
    {
        key: 'b-unfold',
        name: 'Het poppetjespakje',
        see: 'Drie papieren poppetjes hand in hand: de twee buitenste (munt) vouwen achter het middelste (pruim) vandaan open op de landingscurve, blijven even staan en vouwen weer dicht (2400 ms).',
        verdict: 'Alternatief: dezelfde poppetjesslinger als bij het laden, in het klein; openvouwen en dichtvouwen is wachten dat nog niet af is.',
    },
    {
        key: 'b-happer',
        name: 'Het happertje',
        see: 'Eén happertje telt: het gaat open naar links en rechts, dicht, open naar boven en onder, dicht, elke beweging op de landingscurve (2400 ms).',
        verdict: 'Alternatief: hetzelfde happertje als bij het laden, alleen; het telt in plaats van te draaien.',
    },
    {
        key: 'b-jack',
        name: 'Duveltje uit een doosje',
        see: 'Uit een pruimkleurig doosje veert een heksentrap op met een rond papieren kopje, schiet één keer zacht door en zakt weer in (1800 ms).',
        verdict: 'Alternatief: de heksentrap van het laden, rechtop; een duveltje uit een doosje is wachten dat ergens op uitloopt.',
    },
    {
        key: 'b-loop',
        name: 'De looping',
        see: 'Het vouwvliegtuigje vliegt een looping, met een muntkleurig spoor achter zich (2000 ms per rondje).',
        verdict: 'Alternatief: hetzelfde vliegtuigje als bij het laden, maar nu in een rondje; een looping is een spinner die vliegt.',
    },
    {
        key: 'b-gust',
        name: 'Het molentje',
        see: 'Eén papieren molentje met pruim en munt wiekjes; een windvlaag draait het één keer rond en het komt zacht tot stilstand, dan de volgende vlaag (2000 ms).',
        verdict: 'Alternatief: het molentje van het laden, groot; draaien is wat een molentje doet, dus de spinner hoeft niets te verzinnen.',
    },
];

/** The matched pairs, in order: [loading key, spinner key]. */
export const PAIRS = LOADING_OPTIONS.map((o, at) => /** @type {[string, string]} */ ([o.key, SPINNER_OPTIONS[at].key]));

/* ---------------------------------------------------------------- the extras */

/** Which waiting part a strip sits on: it decides how many pieces are drawn. */
const carrierOf = (/** @type {Element} */ strip) =>
    strip.closest('.pa-day') ? 'day' : strip.closest('.pa-skel__line') ? 'skel' : strip.closest('.pa-bar--busy') ? 'bar' : 'plate';

/** `n` copies of a piece, each told its place as `--k` (0-based). */
const many = (/** @type {number} */ n, /** @type {(k: number) => string} */ piece) => Array.from({ length: n }, (_, k) => piece(k)).join('');

/** The paper plane, side view, nose toward the end: its wing, its fold and its keel. */
const PLANE =
    '<svg class="pa-b-plane" viewBox="0 0 26 16" aria-hidden="true"><path class="pa-b-plane__wing" d="M1 2 L25 8 L8 8 Z"/><path class="pa-b-plane__keel" d="M8 8 L25 8 L11 11.5 Z"/><path class="pa-b-plane__fold" d="M8 8 L25 8 L4 14 Z"/></svg>';

/** One fortune teller seen from above: four petals, each with its crease. */
const FORTUNE = (/** @type {number} */ k) => `<span class="pa-b-fortune" style="--k: ${k}"><i></i><i></i><i></i><i></i></span>`;

/** One pinwheel on its stick. */
const WHEEL = (/** @type {number} */ k) => `<span class="pa-b-wheel" style="--k: ${k}"><i></i></span>`;

const COUNT = /** @type {Record<string, Record<string, number>>} */ ({
    'b-clay': { plate: 3, day: 1, skel: 3, bar: 5 },
    'b-fortune': { plate: 4, day: 1, skel: 3, bar: 6 },
    'b-pinwheel': { plate: 3, day: 1, skel: 1, bar: 4 },
});

/** What each loading picture adds inside a strip, by carrier. */
const LOADING_EXTRA = /** @type {Record<string, (carrier: string) => string>} */ ({
    'b-bug': () => `<span class="pa-b-bug">${many(4, (k) => `<i style="--k: ${k}"></i>`)}<i class="pa-b-head" style="--k: 4"></i></span>`,
    'b-clay': (c) => many(COUNT['b-clay'][c], (k) => `<i class="pa-b-ball" style="--k: ${k}"></i>`),
    'b-fortune': (c) => many(COUNT['b-fortune'][c], FORTUNE),
    'b-knit': () => '<i class="pa-b-knit"></i>',
    'b-plane': () => `<span class="pa-b-flight">${PLANE}</span>`,
    'b-pinwheel': (c) => many(COUNT['b-pinwheel'][c], WHEEL),
});

/** What each spinner adds inside the `.kp-spinner`. */
const SPINNER_EXTRA = /** @type {Record<string, () => string>} */ ({
    'b-unfold': () => '<span class="pa-b-trio"><i></i><i></i><i></i></span>',
    'b-curl': () => `<span class="pa-b-ring">${many(8, (k) => `<i style="--k: ${k}"${k === 7 ? ' class="pa-b-head"' : ''}><b></b></i>`)}</span>`,
    'b-happer': () => FORTUNE(0),
    'b-loop': () => `<span class="pa-b-loop">${PLANE}</span>`,
});

/**
 * Called by demo.js after an option changes: removes what this file added
 * earlier and adds what the option `key` needs inside the existing carriers.
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
        for (const strip of scene.querySelectorAll('.pa-strip')) strip.insertAdjacentHTML('beforeend', wrap(make(carrierOf(strip))));
    } else if (aspectId === 'spinner') {
        const make = SPINNER_EXTRA[key];
        if (!make) return;
        for (const spinner of scene.querySelectorAll('.kp-spinner')) spinner.insertAdjacentHTML('beforeend', wrap(make()));
    }
}
