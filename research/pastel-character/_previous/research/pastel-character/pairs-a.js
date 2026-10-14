// research/pastel-character: pairs 2-11 of the loading and spinner questions
// (Kenny, 2026-10-14: 21 options for each, matched in pairs, the spinner the
// same idea in small as the loading picture beside it). These pairs stay
// inside pastel's own world (themes/pastel/CHARACTER.md): the risograph's
// second pass, the planner's paper things (stickers, highlighter, stamps,
// clips, tabs, elastic, tags, doodles, a habit tracker) and its pearls. Every
// picture keeps the grammar: three inks (plum acts, sky is the second pass,
// mint fills), round corners, a flat sky pass beside what is drawn, one soft
// overshoot (the landing curve) where something lands, no blur, no flicker,
// calm loops (1200 ms or longer). pairs-a.css draws them, scoped by
// `.pa-scene[data-pa-loading='a-…']` and `.pa-scene[data-pa-spinner='a-…']`.
//
// Pair 2 is the loading picture for the spinner `dots` (today's candy dots);
// pairs 3-11 are new in both questions, in the same order.

/** @typedef {{ key: string, name: string, see: string, verdict: string }} Option */

/** @type {Option[]} */
export const LOADING_OPTIONS = [
    {
        key: 'a-pearls',
        name: 'Parels rijgen (bij de drie snoepbolletjes)',
        see: 'Over de bovenrand van wat wacht ligt een dun draadje met pruimkleurige parels, steeds groot, middel, klein. Ze schuiven in drie sprongetjes per 1500 ms één plaats op van begin naar eind, elk sprongetje landt zacht; hun hemelsblauwe tweede inkt springt 120 ms eerder en ligt 2 px ernaast. Een skeletregel en de bezige balk zijn zelf het draadje, een dag draagt een kort kettinkje.',
        verdict:
            'Alternatief: de drie bolletjes van de spinner, uitgerold tot het parelsnoer dat pastel al als scheiding gebruikt; dezelfde maten, hetzelfde ritme.',
    },
    {
        key: 'a-highlight',
        name: 'De markeerstift',
        see: 'Een brede muntgroene markeerstreep veegt van begin naar eind over de eerste regel van wat wacht, met een schuin afgeknipt puntje en een donkerder vlekje waar de stift even bleef staan; de tekst blijft leesbaar door de streep heen. De streep staat even, verbleekt en wordt opnieuw gezet (2400 ms). Skeletregels worden een voor een gemarkeerd, een dag krijgt een schuine veeg.',
        verdict:
            'Alternatief: wat je in een planner doet terwijl je wacht, in pastels muntinkt; het enige beeld dat over de inhoud ligt in plaats van ernaast.',
    },
    {
        key: 'a-tracker',
        name: 'Het gewoontespoor',
        see: 'Rechtsboven in wat wacht staat een rijtje van vijf afgeronde hokjes uit een gewoontetracker; ze worden een voor een ingekleurd in munt, elk met een zachte landing, en daarna weer leeg (2400 ms). De dagen van de maand zijn zelf de hokjes en kleuren om de beurt in, een skeletregel is een rij hokjes, de bezige balk een lange rij.',
        verdict:
            'Alternatief: het bullet journal-ritueel van afvinken; het risico is dat een rij die volloopt eruitziet als voortgang, terwijl niemand weet hoe ver het is.',
    },
    {
        key: 'a-flick',
        name: 'Bladeren',
        see: 'De hoek rechtsonder van wat wacht staat een beetje omgekruld als een ezelsoor; drie keer kort na elkaar klapt er een bladzijde om en valt terug, alsof iemand met de duim door de planner bladert, daarna rust de hoek even (2400 ms). Bovenaan blijft alles stil, dus het is niet de vouw van het aanwijzen.',
        verdict:
            'Alternatief: de vouw die pastel al kent, op de plek waar je een planner echt doorbladert; het is wel een klein beeld in een hoek van een groot paneel.',
    },
    {
        key: 'a-doodle',
        name: 'De krabbel',
        see: 'Onderaan wat wacht tekent een pruimkleurige pen een lusjeslijn (eeeee) van begin naar eind, de hemelsblauwe tweede inkt 120 ms erachter; is de lijn af, dan wordt ze vanaf het begin weer weggegumd en begint de pen opnieuw (2400 ms). Een dag wordt omcirkeld, een skeletregel en de bezige balk worden lusjes.',
        verdict:
            'Alternatief: de verveelde krabbel in de kantlijn, het speelste beeld van de reeks; een lijn die tekent zonder te sturen, dus niet de liniaal van formal of de arcering van blueprint.',
    },
    {
        key: 'a-sticker',
        name: 'De sticker laat los',
        see: 'Aan de eindkant van wat wacht zit een ronde muntsticker met zijn pruimen schaduwrandje; zijn bovenhoek krult langzaam op (je ziet de witte achterkant) en wordt daarna met een zachte landing weer aangedrukt (2400 ms). Bij een dag krult de dag zelf op, zoals een stippensticker.',
        verdict:
            'Alternatief: pastels eigen sticker die je weer vastduwt terwijl je wacht; het laat het opkrullen van de aanwijsvouw terugkomen, maar dan rond en traag.',
    },
    {
        key: 'a-stamp',
        name: 'De stempel',
        see: 'Midden op wat wacht wordt een rond bloemetjesstempel gezet zoals pastel drukt: eerst landt de hemelsblauwe afdruk vanuit een grote verschuiving 6 px naast zijn plaats, 120 ms later de pruimkleurige erop; de inkt droogt weg en de volgende stempel staat iets anders gedraaid (2400 ms per afdruk). De tekst eronder blijft leesbaar; op de bezige balk stapt de stempel van begin naar eind.',
        verdict: 'Alternatief: het anker zelf (twee keer gedrukt) als laadbeeld, met de stempel die pastel al op elke kaart met een label zet.',
    },
    {
        key: 'a-clip',
        name: 'De paperclip',
        see: 'Op de bovenhoek aan de beginkant wordt een pruimkleurige paperclip over de rand geschoven, in drie duwtjes die elk zacht landen, met zijn hemelsblauwe tweede inkt ernaast; even later wordt hij eraf getrokken en begint het opnieuw (2400 ms). Elke skeletregel krijgt zijn eigen clip, kort na elkaar.',
        verdict:
            'Alternatief: een clip die een briefje vastzet is planner ten voeten uit; de beweging is wel bijna alleen een verschuiving, dus het beeld moet het doen.',
    },
    {
        key: 'a-elastic',
        name: 'Het elastiek',
        see: 'Aan de eindkant loopt een pruimkleurig sluitelastiek van boven naar onder over wat wacht, zoals om een notitieboek; het wordt langzaam opzij getrokken tot een boog en schiet terug met één klein doorzwiepen, de hemelsblauwe tweede inkt een tel later (2400 ms). Skeletregels en de bezige balk tokkelen zelf als een elastiek, de regels na elkaar.',
        verdict: 'Alternatief: het elastiek van de planner, het enige beeld dat spanning opbouwt en loslaat; geen ander thema rekt of tokkelt.',
    },
    {
        key: 'a-tag',
        name: 'Het labeltje',
        see: 'Aan de bovenrand hangt aan een pruimkleurig touwtje een klein papieren labeltje met een verstevigd gaatje; het schommelt rustig heen en weer (±9°, 2400 ms) en zijn hemelsblauwe tweede inkt schommelt 120 ms achter hem aan, zodat de twee drukgangen even uit elkaar gaan. Elke skeletregel en de bezige balk dragen een eigen labeltje.',
        verdict:
            'Alternatief: het knutsellabeltje uit het scrapbook; het schommelen is groter en trager dan het wapperen van de tape en de achterblijvende tweede inkt maakt het risodruk.',
    },
];

/** @type {Option[]} */
export const SPINNER_OPTIONS = [
    {
        key: 'a-circle',
        name: 'Omcirkeld met markeerstift',
        see: 'Een brede muntgroene markeerstreep trekt een cirkel, een tikje scheef zoals met de hand, en schiet bij het sluiten net over zijn begin zodat er een donkerder stukje overlapt; de cirkel staat even, verbleekt en wordt opnieuw getrokken (1800 ms), zijn hemelsblauwe tweede inkt ernaast.',
        verdict:
            'Alternatief: hoe je in een planner een datum omcirkelt, met dezelfde stift als het laadbeeld; de cirkel is een diepere munt dan de strook, zodat hij overal goed te zien is (gemeten contrast met zijn ondergrond minstens 3,5:1).',
    },
    {
        key: 'a-wheel',
        name: 'Het ronde gewoontespoor',
        see: 'Een rond spoor van zes taartpunten met papieren naden ertussen; de punten worden een voor een met de klok mee ingekleurd in munt, elk met een zachte landing, en daarna allemaal weer leeg (2400 ms).',
        verdict: 'Alternatief: de ronde tracker die bullet journals tekenen, het laadbeeld in het klein; vult in plaats van te draaien.',
    },
    {
        key: 'a-flip',
        name: 'Het plannertje wordt doorgebladerd',
        see: 'Een klein plannertje met een pruimen kopje en twee regels; zijn hoek rechtsonder klapt drie keer kort na elkaar om (je ziet de achterkant van het blad) en valt terug, daarna rust het ezelsoor even (2400 ms).',
        verdict: 'Alternatief: het laadbeeld in het klein, op een boekje in plaats van een paneel; het enige dat niet draait maar omslaat.',
    },
    {
        key: 'a-spiral',
        name: 'Het krulletje',
        see: 'Een pruimkleurige pen tekent een spiraaltje van buiten naar binnen, het staat even en wordt daarna van buiten naar binnen weggegumd (1800 ms); de hemelsblauwe tweede inkt ligt ernaast.',
        verdict: 'Alternatief: de krabbel van het laadbeeld opgerold tot het krulletje dat iedereen in een kantlijn tekent.',
    },
    {
        key: 'a-peel',
        name: 'De sticker wordt rondom aangedrukt',
        see: 'Een ronde muntsticker waarvan steeds een ander stukje rand opkrult (je ziet de witte achterkant) en weer wordt aangedrukt: drie keer per ronde, telkens een derde verder (2400 ms).',
        verdict:
            'Alternatief: dezelfde sticker als het laadbeeld; de rand die rondgaat is de draaiing, zonder dat er iets draait. De munt zelf is licht op wit, het pruimen stipje en randje dragen hem.',
    },
    {
        key: 'a-stamper',
        name: 'Het stempeltje',
        see: 'Een stempeltje van opzij met een knopje bovenop gaat omhoog, komt met een zachte landing neer en laat een streepje inkt achter, eerst hemelsblauw en dan pruim; bij het optillen droogt de afdruk weg (1500 ms).',
        verdict: 'Alternatief: de stempel van het laadbeeld zelf in de hand; het enige dat op en neer gaat in plaats van rond.',
    },
    {
        key: 'a-clipnote',
        name: 'Het briefje met de clip',
        see: 'Een klein papieren briefje met twee lijntjes; een pruimkleurige paperclip wordt er in drie duwtjes over de bovenrand geschoven en daarna weer afgetrokken (2400 ms).',
        verdict: 'Alternatief: het laadbeeld in het klein, herkenbaar zodra de clip beweegt; op 1,25 rem is de clip wel maar een paar pixels.',
    },
    {
        key: 'a-band',
        name: 'Het elastiekje',
        see: 'Een rond pruimkleurig elastiekje wordt uitgerekt tot een ovaal en schiet terug met één klein doorzwiepen; elke keer staat de rek een zesde slag gedraaid, drie keer per ronde (2400 ms).',
        verdict:
            'Alternatief: hetzelfde rekken en loslaten als het laadbeeld; een vorm die vervormt is ongewoon voor een spinner en zegt toch bezig.',
    },
    {
        key: 'a-tagswing',
        name: 'Het schommelende labeltje',
        see: 'Een papieren labeltje met een verstevigd gaatje hangt aan een speldje en schommelt rustig heen en weer (±20°, 2400 ms per heen en terug), zijn hemelsblauwe tweede inkt ernaast.',
        verdict: 'Alternatief: het labeltje van het laadbeeld aan zijn speld; een slinger in plaats van een draaiing, rustig genoeg voor een knop.',
    },
];

/** Loading key and spinner key per pair, pairs 2-11, in the questions' order. */
export const PAIRS = [['a-pearls', 'dots'], ...LOADING_OPTIONS.slice(1).map((option, at) => [option.key, SPINNER_OPTIONS[at].key])];

/* ----------------------------------------------------------- the extra DOM */

const EXTRA = 'data-pa-extra="a"';

/** The points of a polyline as an SVG attribute (rounded to a tenth). */
const points = (/** @type {[number, number][]} */ list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

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

/** An SVG of one pen line: its sky pass first, the plum ink on top. */
const pen = (/** @type {string} */ viewBox, /** @type {string} */ pts, cls = '') =>
    `<svg class="pa-a-pen ${cls}" ${EXTRA} viewBox="${viewBox}" preserveAspectRatio="none" aria-hidden="true" focusable="false">` +
    `<polyline class="pa-a-pen__pass" points="${pts}" pathLength="100" vector-effect="non-scaling-stroke"/>` +
    `<polyline class="pa-a-pen__ink" points="${pts}" pathLength="100" vector-effect="non-scaling-stroke"/></svg>`;

/**
 * Adds what an option needs beyond pairs-a.css inside the scene's own
 * carriers, after removing what it added before. Only three options need it:
 * the habit tracker's boxes, the doodle's line and the spinner's spiral.
 * @param {Element} scene the `.pa-scene` element
 * @param {string} aspectId 'loading' or 'spinner'
 * @param {string} key the option's key
 */
export function decorate(scene, aspectId, key) {
    for (const old of scene.querySelectorAll('[data-pa-extra="a"]')) old.remove();
    if (aspectId === 'loading' && key === 'a-tracker') {
        for (const strip of scene.querySelectorAll('.pa-strip')) {
            if (strip.closest('.pa-day')) continue;
            const count = strip.closest('.pa-bar--busy') ? 8 : 5;
            strip.insertAdjacentHTML(
                'beforeend',
                Array.from({ length: count }, (_, k) => `<span class="pa-a-box" ${EXTRA} style="--k: ${k}"></span>`).join(''),
            );
        }
    }
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
    }
    if (aspectId === 'spinner' && key === 'a-spiral') {
        for (const spinner of scene.querySelectorAll('.kp-spinner')) {
            spinner.insertAdjacentHTML('beforeend', pen('0 0 100 100', spiral(), 'pa-a-pen--spiral'));
        }
    }
}
