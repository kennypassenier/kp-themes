// What makes pastel pastel: the nineteen questions, as data. demo.js wires each
// aspect's scene and options.css draws each option by `data-pa-<id>="<key>"`
// on the scene. The grammar is themes/pastel/CHARACTER.md (G1-G20); the anchor
// is proposed there (§0a) and asked here as question 1, because pastel never
// had an anchor round of its own. The text Kenny reads is Dutch (his rule for
// everything user-facing); identifiers stay English.
//
// Update 1 (round 2026-10-14-r1, Kenny's verdict of 2026-10-14): fourteen
// questions are decided and locked in update.json "picks" (focus = the dashed
// line alone, not the recommendation); five are asked again: loading and the
// spinner (redone), the leave (option 1 is now said to be the anchor itself, and
// two new options fix the part to the page after it landed: the tape stuck on,
// a thumbtack pushed in), pointing (the key figure's fold fixed) and the motifs
// (the empty state's lip redrawn). Kenny's words and the replies are in update.json.
//
// An option's `rec` marks the recommendation where it is not the first;
// without one the first is, and a question marked `noRec` has none.
//
// Round 3 (Kenny 2026-10-14): leave = tack, hover = peel, motifs = sheet are
// decided; loading and the spinner keep four families (doodle, tag, caterpillar,
// plane), each its original plus five variants, in pairs-a.js and pairs-b.js.
// Loading option N and spinner option N are one variant (same family, same
// number; each file's PAIRS lists the keys side by side). Neither question
// recommends: variant 1 of each family is Kenny's own pick of round 2, the
// others are alternatives (`noRec`).

import { LOADING_OPTIONS as PAIRS_A_LOADING, SPINNER_OPTIONS as PAIRS_A_SPINNER, PAIRS as PAIRS_A } from './pairs-a.js';
import { LOADING_OPTIONS as PAIRS_B_LOADING, SPINNER_OPTIONS as PAIRS_B_SPINNER, PAIRS as PAIRS_B } from './pairs-b.js';

export const THEME = 'pastel';
export const LABEL = 'Pastel';
export const TITLE = 'Wat pastel pastel maakt';
export const STORY = {
    what: 'Pastel is risodruk: een lavendelwitte pagina met een zweem van rasterpuntjes, pruimkleurige inkt, en een tweede inkt (hemelsblauw) die nooit precies op zijn plaats valt. Wat op de pagina staat is een sticker of een ingeplakt briefje uit een planner: met een platte schaduw ernaast, met een stukje washi tape vastgezet. Dat heb je zelf al gekozen: de sticker (scope-24), de washi tape als vorm en als laden, de sticker als toon, het briefje dat erop geplakt wordt als aankomst, het afpellen van de tape als aanwijzen.',
    so: 'Het voorstel voor het anker, de ene beweging waar alles van afstamt: alles wordt twee keer gedrukt en erop geplakt. Eerst landt de tweede inkt, een platte blauwe vorm van het onderdeel, net naast zijn plaats; daarna wordt het onderdeel zelf erop geplakt, vanuit zijn hoek bovenaan links, met één zachte doorschot. Die blauwe vorm blijft liggen als de platte schaduw van de sticker. Sluiten is exact hetzelfde achterstevoren: het onderdeel wordt van zijn hoek gepeld, daarna schuift de blauwe vorm weg.',
    decided:
        'Al door jou beslist en hier niet opnieuw gevraagd: de risodruk met de tweede inkt naast de kop (het concept van 08/09), de sticker (scope-24), de parels als scheiding (scope-93), het eigen alarm zonder glitch, je familiekeuzes van 07/10 (laden = de washi tape wappert, aankomst = erop geplakt, live = de wiebel van de netwerkkaart, aanwijzen = de tape pelt, toon = de sticker, vorm = de washi tape), en de netwerkkaart verandert in geen enkel thema. Waar een keuze van jou botst met de regel, staat ze hieronder als optie met “jouw keuze” of “vandaag” in de naam. De volledige analyse staat in themes/pastel/CHARACTER.md.',
};

/**
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still' | 'live', scene: string, noRec?: boolean,
 *   options: { key: string, name: string, see: string, verdict: string, rec?: boolean }[] }[]}
 */
export const ASPECTS = [
    {
        id: 'anchor',
        label: 'Het anker: hoe iets opent en sluit',
        rule: '§0a',
        question: 'Een dialoog, een menu, een toast, een zijpaneel, het alarm, een tooltip, de rondleiding en een datumkiezer gaan open en weer dicht. Welke beweging is van pastel?',
        why: 'Dit is de belangrijkste vraag: alle andere vragen hieronder gebruiken het antwoord. Elk onderdeel in elke optie opent en sluit zichtbaar; sluiten is telkens exact het openen achterstevoren.',
        kind: 'cycle',
        scene: 'anchor',
        options: [
            {
                key: 'twice',
                name: 'Twee keer gedrukt, erop geplakt',
                see: 'Eerst springt de tweede inkt (een platte hemelsblauwe vorm van het onderdeel, zonder tekst) van ver naast zijn plaats naar zijn rustplek, 6 px rechtsonder: dat wordt de platte schaduw. 120 ms later zwaait het onderdeel zelf vanuit zijn hoek linksboven naar beneden en wordt erop geplakt, met één zachte doorschot. Sluiten: het onderdeel pelt los van zijn hoek, daarna schuift de blauwe vorm weg.',
                verdict:
                    'Aanbevolen: dit, omdat het twee van jouw keuzes en het oudste kenmerk van pastel samenbrengt (de tweede inkt die nooit helemaal goed ligt, het briefje dat erop geplakt wordt, de sticker met zijn platte schaduw). Geen ander thema tekent twee lagen in twee inkten op twee momenten.',
            },
            {
                key: 'meet',
                name: 'Naar zijn plek naast de plek',
                see: 'De blauwe vorm en het onderdeel komen van weerszijden van de verschuivingslijn en springen samen naar hun rustplek, 6 px uit elkaar; niets draait.',
                verdict: 'Niet aanbevolen, omdat twee platen die naar elkaar toe schuiven dicht bij grotesk ligt (de rode plaat die in register valt); alleen de doorschot en de blijvende verschuiving maken het anders.',
            },
            {
                key: 'popped',
                name: 'Gepopt (jouw keuzes)',
                see: 'Het onderdeel groeit vanuit een kwart van zijn grootte met de doorschot, de blauwe vorm een tel later (de bezige tabel, de trend en het menu in de paginakop).',
                verdict: 'Niet aanbevolen, omdat schalen de tekst plet terwijl het speelt, en een pop uit een punt is het bubbeltje van light en van de tooltip.',
            },
            {
                key: 'sheet',
                name: 'Het vel (vandaag)',
                see: 'Wat het register nu doet: het onderdeel en zijn tweede vel (vandaag munt op de dialoog) komen samen 18 px van onder, 2,5° gedraaid, uit het niets, in 427 ms op de veercurve van het register.',
                verdict: 'Niet aanbevolen, omdat het alleen beweegt en draait (les 52 noemt het PLAIN): opstijgen van onder doen light, solstice, synthwave en forest ook.',
            },
        ],
    },
    {
        id: 'curve',
        label: 'De bewegingscurve',
        rule: 'G1',
        question: 'Een dialoog, een menu en een tegel worden erop geplakt. Op welke curve landen ze?',
        why: 'In elke optie landt alles even lang (de blauwe vorm 440 ms, het onderdeel 440 ms vanaf 120 ms), alleen de curve verschilt. Bovenaan landt een klein stickertje naast een stickertje dat op een gelijkmatig tempo komt, zodat je de curve alleen ziet.',
        kind: 'cycle',
        scene: 'curve',
        options: [
            {
                key: 'landing',
                name: 'De zachte landing',
                see: 'Een rustige aanloop, dan schiet het 8 % voorbij zijn plek en zakt één keer terug (de helft op 36 % van de tijd, 90 % op 56 %, de top op 75 %). Sluiten is dezelfde curve achterstevoren: eerst een klein duwtje naar zijn plek, dan los.',
                verdict:
                    'Aanbevolen: dit, omdat je de landing ziet gebeuren en de doorschot één keer zakt: “eerder een landing dan een stuit”, zoals je in scope-4 vroeg. Geen ander thema heeft een doorschot.',
            },
            {
                key: 'register',
                name: 'De veer van het register (vandaag)',
                see: 'cubic-bezier(0.34, 1.56, 0.64, 1): na 30 % van de tijd al 90 % ver, daarna 10 % voorbij en terug.',
                verdict: 'Niet aanbevolen, omdat de landing voorbij is voor je ze ziet; wat overblijft leest als een stuit.',
            },
            {
                key: 'jelly',
                name: 'De gelatinepudding',
                see: 'Een veer met een terugslag: 18 % voorbij, dan 3 % eronder, dan rust (de wiebel en de boing uit jouw keuzes).',
                verdict: 'Niet aanbevolen, omdat elke opening dan stuitert; de wiebel blijft wel voor een live wijziging (vraag 10).',
            },
        ],
    },
    {
        id: 'direction',
        label: 'De richting',
        rule: 'G2',
        question: 'Vanwaar komt een onderdeel, en in welke volgorde komt een groep?',
        why: 'Een week dagen, een tegel, een kerncijfer en een trendlijn komen aan. Elke optie duurt even lang en landt op dezelfde curve; alleen waar het vandaan komt en de volgorde verschillen.',
        kind: 'cycle',
        scene: 'direction',
        options: [
            {
                key: 'corner',
                name: 'Uit zijn hoek, in leesvolgorde',
                see: 'De blauwe vorm komt langs de schuine verschuivingslijn (van rechtsonder), het onderdeel zwaait uit zijn hoek linksboven; een groep komt in leesvolgorde, 60 ms na elkaar; de trendlijn wordt van begin naar eind getekend.',
                verdict: 'Aanbevolen: dit, omdat een briefje vastzit aan de hoek waar de tape zit, en je in een planner van links naar rechts plakt. Een zwaai rond een hoek met een tweede laag langs de schuine lijn heeft geen ander thema.',
            },
            {
                key: 'rise',
                name: 'Van onder omhoog (vandaag)',
                see: 'Alles stijgt 18 px van onder op zijn plek, zoals het vel van vandaag; een groep in leesvolgorde.',
                verdict: 'Niet aanbevolen, omdat opstijgen de richting is van light, solstice, synthwave en forest.',
            },
            {
                key: 'bubbles',
                name: 'Bubbels uit de hoek (jouw keuze)',
                see: 'Alles borrelt op uit de hoek rechtsonder, de laatste dag eerst (de aankomst van de maandkalender).',
                verdict: 'Niet aanbevolen, omdat achterstevoren lezen botst met de volgorde van een planner, en het één kalender is tegenover de familie “erop geplakt”.',
            },
        ],
    },
    {
        id: 'opening',
        label: 'Openen vanuit een knop',
        rule: 'G3',
        question: 'Een menu onder zijn knop, een datumkiezer onder zijn veld, een keuzelijst en een tooltip gaan open en dicht. Hoe?',
        why: 'Alles wat aan een knop of veld hangt. Elke optie duurt even lang; sluiten is telkens het openen achterstevoren.',
        kind: 'cycle',
        scene: 'opening',
        options: [
            {
                key: 'stuck',
                name: 'Naast zijn knop erop geplakt',
                see: 'Eerst landt de blauwe vorm onder de knop, dan zwaait het paneel uit de hoek die het dichtst bij de knop zit naar beneden: de bovenrand verlaat de knop nooit.',
                verdict: 'Aanbevolen: dit, omdat het het anker is op elke opening, en de knop het punt blijft waar het paneel aan vastzit; niets wordt geschaald.',
            },
            {
                key: 'bounced',
                name: 'Binnengestuiterd (jouw keuze)',
                see: 'Het menu stuitert in twee zachte stapjes naar beneden op zijn plek (het menu van de menuknop); de blauwe vorm reist mee.',
                verdict: 'Niet aanbevolen, omdat een val van boven met twee stuiten de richting is van brutalism, en scope-4 een landing vroeg in plaats van een stuit.',
            },
            {
                key: 'popped',
                name: 'Gepopt uit de knop (jouw keuze)',
                see: 'Het paneel groeit vanuit een klein formaat aan de kant van de knop, met de doorschot (het menu van de paginakop).',
                verdict: 'Niet aanbevolen, omdat de woorden geplet worden terwijl het groeit.',
            },
        ],
    },
    {
        id: 'durations',
        label: 'Hoe lang dingen duren',
        rule: 'G4',
        question: 'Hoe snel is pastel?',
        why: 'Een druk op een knop, een dialoog die opent, vijf dagen na elkaar en de wapperende tape. Onder elk onderdeel staan de getallen die de optie speelt.',
        kind: 'cycle',
        scene: 'durations',
        options: [
            {
                key: 'landing',
                name: 'Eén landing van 560 ms',
                see: 'Contact 220 ms; de blauwe vorm 440 ms, het onderdeel 440 ms vanaf 120 ms (560 ms samen); een groep 60 ms na elkaar; een lus 2400 ms.',
                verdict: 'Aanbevolen: dit, omdat je de twee lagen apart ziet landen zonder te wachten, en de dialoog en het menu even lang duren.',
            },
            {
                key: 'brisk',
                name: 'Vlot',
                see: 'Contact 160 ms; 320 ms per laag, het onderdeel vanaf 80 ms (400 ms); 40 ms na elkaar; een lus 1600 ms.',
                verdict: 'Niet aanbevolen, omdat de twee lagen bijna samen vallen en je de tweede druk niet meer ziet.',
            },
            {
                key: 'unhurried',
                name: 'Rustig',
                see: 'Contact 280 ms; 600 ms per laag, het onderdeel vanaf 180 ms (780 ms); 90 ms na elkaar; een lus 3200 ms.',
                verdict: 'Niet aanbevolen, omdat een menu van bijna een seconde traag aanvoelt bij dagelijks gebruik.',
            },
        ],
    },
    {
        id: 'colour',
        label: 'Waar de kleur gaat',
        rule: 'G5',
        question: 'Welke kleur doet wat?',
        why: 'Een kaart met een gemarkeerd woord, knoppen, een schakelaar en een link, een kerncijfer met zijn sticker, en een mislukte export. Alleen de rol van de kleuren verschilt.',
        kind: 'still',
        scene: 'colour',
        options: [
            {
                key: 'three',
                name: 'Drie inkten',
                see: 'Pruim doet iets (knoppen, de schakelaar, de link) en is de tekst; hemelsblauw is alleen de tweede inkt (de platte vorm naast elk vlak); munt is de tape, de markering achter een woord en een aangewezen regel. Violet alleen nog voor de status “info”.',
                verdict: 'Aanbevolen: dit, omdat een risoprinter met drie trommels een risoprint blijft (de anatomie: “nooit meer dan drie inkten”), en elke kleur één taak heeft.',
            },
            {
                key: 'today',
                name: 'Zoals vandaag',
                see: 'Het tweede vel van de dialoog in munt, de kop en de balk in hemelsblauw, de tweede markering in violet: vier inkten, de tweede inkt in twee kleuren.',
                verdict: 'Niet aanbevolen, omdat één tweede inkt in twee kleuren niet leest als één druk.',
            },
            {
                key: 'candy',
                name: 'Snoep (jouw keuzes)',
                see: 'Elke snoepkleur als vulling: roze, perzik, munt, hemelsblauw en lila naast elkaar, zoals de regenboog van het skelet en de hagelslag.',
                verdict: 'Niet aanbevolen, omdat vijf tinten de risodruk een snoepwinkel maken; dat is een tweede wereld naast de planner.',
            },
        ],
    },
    {
        id: 'corners',
        label: 'De hoeken',
        rule: 'G6',
        question: 'Hoe rond is pastel, en is elke hoek even rond?',
        why: 'Een kaart klein, lang en breed, een menu, een knop met label en chip, een tooltip en de balk. Alleen de hoeken verschillen.',
        kind: 'still',
        scene: 'corners',
        options: [
            {
                key: 'two',
                name: 'Twee rondingen en de pil',
                see: 'Vlakken (kaarten, panelen, dialogen, menu’s) 1,2 rem, bedieningen (knoppen, velden, de sticker van een wijziging) 0,85 rem, chips, labels, de tooltip en de balk als pil.',
                verdict: 'Aanbevolen: dit, omdat de grootste rondingen van het pakket pastel dragen, en twee maten plus de pil een duidelijke familie vormen.',
            },
            {
                key: 'pills',
                name: 'Alles een pil',
                see: 'Knoppen en velden als pil, vlakken 1,8 rem.',
                verdict: 'Niet aanbevolen, omdat een pil overal light is; een kaart met zo’n ronding verliest zijn hoek voor de tape.',
            },
            {
                key: 'picks',
                name: 'Jouw keuzes door elkaar',
                see: 'De wolk met kartelrand, de blob (60 % 40 % 55 % 45 %), de golvende lijn van de macaron en de vierkante hoekjes van de grafiek.',
                verdict: 'Niet aanbevolen, omdat een planner geen wolken en blobs heeft, en een vierkante hoek in pastel niet mag.',
            },
        ],
    },
    {
        id: 'surface',
        label: 'Het oppervlak',
        rule: 'G7',
        question: 'Waarop staat alles, en wat ligt eronder?',
        why: 'Een dialoog, een kerncijfer, een trendtegel, een menu en een knop. Alleen het oppervlak verschilt.',
        kind: 'still',
        scene: 'surface',
        options: [
            {
                key: 'taped',
                name: 'Papier met zijn tweede inkt, vastgetapet',
                see: 'Wit papier op de lavendel pagina, de blauwe tweede inkt plat 6 px ernaast; een knop met zijn platte pruimschaduw 3 px eronder; een strookje washi tape over de hoek linksboven van elk vlak dat op de pagina vastzit (kaart, tegel, dialoog); geen tape op wat je in de hand hebt (menu, tooltip, toast, knop). Nergens een zachte schaduw.',
                verdict: 'Aanbevolen: dit, omdat het jouw vormfamilie (de washi tape over een hoek) en de sticker samenbrengt, en de tape precies zit waar het onderdeel bij het openen om draait.',
            },
            {
                key: 'pass',
                name: 'Papier met zijn tweede inkt, zonder tape',
                see: 'Hetzelfde, zonder de strookjes tape.',
                verdict: 'Niet aanbevolen, omdat de vormfamilie die je koos dan nergens meer te zien is buiten het laden.',
            },
            {
                key: 'today',
                name: 'Zoals vandaag',
                see: 'Zachte schaduwen onder de toast, het alarm en een aangewezen knop, het tweede vel van de dialoog in munt.',
                verdict: 'Niet aanbevolen, omdat de anatomie zegt dat een zachte schaduw net is wat pastel niet is.',
            },
        ],
    },
    {
        id: 'tone',
        label: 'Een waarschuwing',
        rule: 'G8',
        question: 'Hoe zegt pastel dat iets goed, slecht of mislukt is?',
        why: 'Een kerncijfer dat aandacht vraagt, een mislukte trendtegel, een menuregel om te wissen en een toestandswoord. Alleen de toon verschilt.',
        kind: 'still',
        scene: 'tone',
        options: [
            {
                key: 'sticker',
                name: 'De sticker (jouw familiekeuze)',
                see: 'De wijziging staat op een kleine ronde sticker in de plaat en inkt van de toon, met zijn eigen platte schaduw; een waarschuwing zet de noot in het label op de plaat van de toon.',
                verdict: 'Aanbevolen: dit, omdat het jouw toonfamilie is (het kerncijfer), overal dezelfde sticker.',
            },
            {
                key: 'heart',
                name: 'De hartjessticker scheef (jouw keuzes)',
                see: 'Een ronde sticker een beetje scheef gedraaid, een snoepband in de toonkleur langs de bovenkant (de trend en het toestandswoord).',
                verdict: 'Niet aanbevolen, omdat een scheve sticker naast een rechte op dezelfde pagina leest als een fout, niet als een toon.',
            },
            {
                key: 'taped',
                name: 'Het tapelabel (jouw keuzes)',
                see: 'De noot op een strookje gekleurde tape (de tegels en het menu).',
                verdict: 'Niet aanbevolen, omdat de tape al het laden is; een toon op tape leest als “nog bezig”.',
            },
        ],
    },
    {
        id: 'live',
        label: 'Een live wijziging',
        rule: 'G9',
        question: 'Een getal, een woord, een lijn en een tegel krijgen een nieuwe waarde. Wat zie je?',
        why: 'Elke twee seconden verandert de waarde in elke optie tegelijk.',
        kind: 'live',
        scene: 'live',
        options: [
            {
                key: 'wobble',
                name: 'De wiebel (jouw familiekeuze)',
                see: 'Wat veranderde wiebelt één keer als pudding rond zijn voet: 10°, -7°, 3°, rust, in 800 ms; zijn blauwe vorm blijft liggen, zodat je de wiebel ertegen ziet.',
                verdict: 'Aanbevolen: dit, omdat het jouw livefamilie is (de netwerkkaart), op elke drager hetzelfde. Geen ander thema draait zijn waarde.',
            },
            {
                key: 'reprint',
                name: 'Opnieuw gedrukt',
                see: 'De tweede inkt van het getal springt even ver naast zijn plaats en veert terug: het getal wordt opnieuw gedrukt.',
                verdict: 'Niet aanbevolen, omdat het dichter bij het anker zit maar een dubbele rand op een getal moeilijk leest voor wie astigmatisme heeft (de anatomie).',
            },
            {
                key: 'squish',
                name: 'Geplet (jouw keuzes)',
                see: 'Het getal zwelt op tot 112 % en zakt terug (het kerncijfer, de tegels, de trend).',
                verdict: 'Niet aanbevolen, omdat het bijna de zachte zwelling van light is.',
            },
        ],
    },
    {
        id: 'loading',
        label: 'Laden',
        rule: 'G10',
        question: 'Een tegel, een paneel, een menuregel, dagen, een grafiek, skeletregels en de bezige balk wachten op gegevens. Wat zie je?',
        why: 'Vier families die jij goed vond (14/10: de krabbel, het labeltje, de pomponrups, het vouwvliegtuigje), elk met zijn origineel en vijf nieuwe varianten: optie 1 tot 6 de krabbel, 7 tot 12 het labeltje, 13 tot 18 de pomponrups, 19 tot 24 het vouwvliegtuigje. Optie N hier en optie N bij de spinner (vraag 12) horen bij elkaar: dezelfde familie en hetzelfde nummer, de spinner is die variant in het klein. Er is geen aanbeveling: variant 1 van elke familie is jouw keuze uit ronde 2, de andere zijn alternatieven. Elke variant behandelt elke drager apart, vooral de dagen van de maand: eromheen, niet erdoor.',
        kind: 'loop',
        scene: 'loading',
        noRec: true,
        options: [
            ...PAIRS_A_LOADING,
            ...PAIRS_B_LOADING,
        ],
    },
    {
        id: 'spinner',
        label: 'De spinner',
        rule: 'G11',
        question: 'Waar geen plaats is voor een strook tape: wat draait er?',
        why: 'Optie N hier en optie N bij laden (vraag 11) horen bij elkaar: dezelfde familie en hetzelfde nummer, de spinner is die laadvariant in het klein (1 tot 6 de krabbel, 7 tot 12 het labeltje, 13 tot 18 de pomponrups, 19 tot 24 het vouwvliegtuigje). Er is geen aanbeveling: variant 1 van elke familie is jouw keuze uit ronde 2, de andere zijn alternatieven. Elke spinner in drie maten, in een bezige knop en in een bezig paneel.',
        kind: 'loop',
        scene: 'spinner',
        noRec: true,
        options: [
            ...PAIRS_A_SPINNER,
            ...PAIRS_B_SPINNER,
        ],
    },
    {
        id: 'leave',
        label: 'Weggaan en aankomen',
        rule: 'G12',
        question: 'Een melding, een kaart, een kerncijfer en een toast gaan weg en komen terug. Hoe?',
        why: 'Aankomen is in elke optie precies het weggaan achterstevoren. Opties 2 en 3 zijn nieuw (je vroeg ze op 14/10): het anker, en daarna wordt wat op de pagina vastzit (de kaart en het kerncijfer) nog vastgemaakt.',
        kind: 'cycle',
        scene: 'leave',
        options: [
            {
                key: 'peel',
                name: 'Het anker zelf',
                see: 'Dit is precies het anker dat je koos, niets anders: aankomen is “twee keer gedrukt, erop geplakt” (dezelfde beweging, dezelfde 560 ms, dezelfde zachte landing als de dialoog en het menu), weggaan is datzelfde anker exact achterstevoren: het onderdeel pelt los van zijn hoek linksboven, daarna schuift de blauwe vorm weg. Gemeten: elke beweging hier is tot op de milliseconde die van het anker.',
                verdict: 'Aanbevolen: dit, omdat weggaan en aankomen dan geen eigen beweging hebben maar het anker zijn, zoals een opening en een aankomst uit dezelfde richting horen te komen.',
            },
            {
                key: 'taped',
                name: 'Het anker, dan vastgetapet',
                see: 'Het anker, en meteen nadat de kaart en het kerncijfer neergelegd zijn, komt hun strookje washi tape van boven, schuin en wat groter, en wordt over de hoek linksboven op de pagina geplakt met één klein plat drukje (360 ms). Weggaan is dat exact achterstevoren: eerst gaat de tape eraf, dan pelt het onderdeel los. De melding en de toast heb je in de hand en krijgen geen tape.',
                verdict: 'Niet aanbevolen, omdat het een derde stap aan elke aankomst toevoegt (920 ms in plaats van 560 ms); wel het mooiste verhaal: de tape die je bij het oppervlak koos, wordt echt vastgeplakt.',
            },
            {
                key: 'tack',
                name: 'Het anker, dan een punaise',
                see: 'Het anker, en meteen nadat de kaart en het kerncijfer neergelegd zijn, wordt bovenaan in het midden een ronde pruimkleurige punaise erin geprikt: hij komt van boven, groter, en veert bij het indrukken één keer zacht terug, zijn platte blauwe schaduw ernaast (360 ms). Hij komt in de plaats van de tape. Weggaan is dat exact achterstevoren: eerst gaat de punaise eruit, dan pelt het onderdeel los.',
                verdict: 'Niet aanbevolen, omdat een punaise van het prikbord is en niet van de planner met zijn stickers en tape, en de tape bij het oppervlak al gekozen is; wel lief, en hij leest meteen als “vastgezet”.',
            },
            {
                key: 'balloon',
                name: 'De ballon (jouw keuze van 04/10)',
                see: 'Het onderdeel zweeft 28 px omhoog met een draaitje van 5° en verdwijnt; aankomen komt dus van boven naar beneden.',
                verdict: 'Niet aanbevolen, omdat een opening dan uit zijn hoek komt en een aankomst van boven: twee richtingen voor één gebaar. Opstijgend weggaan doen light, solstice en phantom ook.',
            },
            {
                key: 'pop',
                name: 'Weggepopt',
                see: 'Het onderdeel krimpt met de doorschot tot niets, zijn blauwe vorm een tel later.',
                verdict: 'Niet aanbevolen, omdat de tekst geplet wordt en een pop geen sticker is.',
            },
        ],
    },
    {
        id: 'composites',
        label: 'Knoppen in samengestelde onderdelen',
        rule: 'G13',
        question: 'Een knop in een paginakop, een menuregel, de Open-link van een tegel, de knoppen van een rondleiding en een kerncijfer als link: gedragen ze zich als de gewone pastelknop?',
        why: 'Bovenaan de gewone knop als referentie. Met Toestand (boven) zie je alles tegelijk in rust, aangewezen, met focus of ingedrukt.',
        kind: 'still',
        scene: 'composites',
        options: [
            {
                key: 'own',
                name: 'Precies pastels eigen knop',
                see: 'Elke knop, regel en link in een onderdeel doet exact wat de gewone knop doet: dezelfde hoek, schaduw, aanwijzing, focusring en druk.',
                verdict: 'Aanbevolen: dit, omdat een knop overal dezelfde knop moet zijn; een onderdeel mag iets rond de knop toevoegen, nooit de knop zelf veranderen.',
            },
            {
                key: 'register',
                name: 'Zoals het register vandaag',
                see: 'De gewone knop van vandaag overal: 2 px omhoog, 1,2° gedraaid, met een zachte schaduw.',
                verdict: 'Niet aanbevolen, omdat de woorden draaien en de zachte schaduw niet van pastel is.',
            },
            {
                key: 'picks',
                name: 'Zoals jouw keuzes',
                see: 'De paginakop draait zijn knoppen 1,5° met een gestreepte enkele ring, menuregels kantelen, de Open-link wordt een gevulde pil, het kerncijfer een gestreepte omlijning.',
                verdict: 'Niet aanbevolen, omdat elk onderdeel dan een eigen knop heeft.',
            },
        ],
    },
    {
        id: 'hover',
        label: 'Iets aanwijzen',
        rule: 'G14',
        question: 'Wat doet een knop, een menuregel, een link, een kerncijfer of een dag als je ernaar wijst?',
        why: 'De aanwijzer komt en gaat vanzelf; elke optie toont hetzelfde.',
        kind: 'still',
        scene: 'hover',
        options: [
            {
                key: 'peel',
                name: 'De hoek pelt los',
                see: 'De sticker komt 2 px los op zijn schaduw (de schaduw van 3 naar 5 px, nog altijd plat) en zijn hoek rechtsboven krult op tot een vouwtje; de woorden blijven recht, de buren bewegen niet.',
                verdict: 'Aanbevolen: dit, omdat het jouw aanwijsfamilie (de tape pelt) echt een pel geeft, en de sticker van scope-24 houdt zonder de woorden te draaien.',
            },
            {
                key: 'tilt',
                name: 'Scheef opgetild (vandaag)',
                see: '2 px omhoog, 1,2° gedraaid, de schaduw 5 px met een zachte schaduw eronder.',
                verdict: 'Niet aanbevolen, omdat gedraaide woorden slechter lezen en de zachte schaduw niet van pastel is.',
            },
            {
                key: 'tape',
                name: 'Het tapelipje',
                see: 'Een lipje washi tape aan de hoek van het onderdeel komt los.',
                verdict: 'Niet aanbevolen, omdat de tape het laden is en op elke knop te druk wordt.',
            },
        ],
    },
    {
        id: 'focus',
        label: 'De focusring',
        rule: 'G15',
        question: 'Wat ziet iemand die met het toetsenbord door de pagina gaat?',
        why: 'Een knop, een knop in de paginakop, een kerncijferlink, een menuregel, een dag en een tegellink, elk met focus.',
        kind: 'still',
        scene: 'focus',
        options: [
            {
                key: 'dashed',
                name: 'De twee ringen, de buitenste gestreept',
                see: 'De twee kanalen van het pakket (een ring in de focuskleur, samen met de schaduw) en daarbuiten een gestreepte pruimlijn op 3 px.',
                verdict: 'Aanbevolen: dit, omdat de twee ringen overal moeten werken (DI2) en de gestreepte lijn jouw familiekeuze is.',
            },
            {
                key: 'di2',
                name: 'De twee ringen (vandaag)',
                see: 'De twee ringen van het pakket, zonder streepjes.',
                verdict: 'Niet aanbevolen, omdat het correct is maar niets van pastel heeft.',
            },
            {
                key: 'single',
                name: 'Alleen de gestreepte lijn (jouw keuzes)',
                see: 'Alleen een gestreepte lijn rond het onderdeel, zoals in de paginakop en het kerncijfer.',
                verdict: 'Niet aanbevolen, omdat één kanaal op sommige ondergronden onzichtbaar wordt.',
            },
        ],
    },
    {
        id: 'press',
        label: 'Indrukken',
        rule: 'G16',
        question: 'Wat doet een knop, een menuregel, een dag of een kerncijfer als je erop drukt?',
        why: 'Elk onderdeel wordt in een lus ingedrukt en losgelaten.',
        kind: 'loop',
        scene: 'press',
        options: [
            {
                key: 'flat',
                name: 'Plat vastgedrukt',
                see: 'Het onderdeel zakt 3 px op zijn schaduw tot die weg is, het vouwtje ligt plat; niets krimpt of draait.',
                verdict: 'Aanbevolen: dit, omdat het jouw sticker is (scope-24: “volledig plat gedrukt”), op elk onderdeel dat je kan indrukken.',
            },
            {
                key: 'squash',
                name: 'Geplet',
                see: 'Het onderdeel wordt even breder en lager, als een snoepje dat je indrukt.',
                verdict: 'Niet aanbevolen, omdat de woorden geplet worden.',
            },
            {
                key: 'bubble',
                name: 'Het bubbeltje krimpt (jouw keuze)',
                see: 'Het vlak achter de regel krimpt een haartje (het menu).',
                verdict: 'Niet aanbevolen, omdat het bijna niet te zien is en geen sticker is.',
            },
        ],
    },
    {
        id: 'type',
        label: 'De stem',
        rule: 'G17',
        question: 'Hoe staan woorden en cijfers er?',
        why: 'Een tegel met een label, een kop, gewone tekst, een cijfer, een tabelletje, een id en een knop met een label.',
        kind: 'still',
        scene: 'type',
        options: [
            {
                key: 'one',
                name: 'Eén letter, het gewicht spreekt',
                see: 'Instrument Sans voor alles: koppen en cijfers 700, labels 600 in gewone zinsvorm, cijfers even breed; het microlabel in gespatieerde hoofdletters blijft de ene uitzondering; mono alleen voor id’s en tijden.',
                verdict: 'Aanbevolen: dit, omdat pastel zich onderscheidt in zijn materiaal, niet in zijn stem, en één letter het rustig houdt.',
            },
            {
                key: 'caps',
                name: 'Labels in gespatieerde hoofdletters',
                see: 'Elk label zoals het microlabel van vandaag: hoofdletters met veel ruimte.',
                verdict: 'Niet aanbevolen, omdat het luider en formeler is dan een planner.',
            },
            {
                key: 'mono',
                name: 'Cijfers en labels in mono',
                see: 'Cijfers en labels in de monoletter.',
                verdict: 'Niet aanbevolen, omdat dat de stem van titanium en terminal is.',
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motieven',
        rule: 'G18',
        question: 'Welke tekentjes mag pastel gebruiken?',
        why: 'Een kaart, een meter met zijn merkteken, de gebeurtenissen van een grafiek, een lijstje, een lege toestand en een scheiding.',
        kind: 'still',
        scene: 'motifs',
        options: [
            {
                key: 'sheet',
                name: 'Van het stickervel en de pers',
                see: 'De tweede inkt, de sticker en zijn vouwtje, de washi tape, de parels aan een draad, de rasterpuntjes. Verder niets.',
                verdict: 'Aanbevolen: dit, omdat vijf tekens die samen één planner zijn genoeg zijn.',
            },
            {
                key: 'candy',
                name: 'Plus het snoep (jouw keuzes)',
                see: 'Hetzelfde, en hagelslag, hartjes, sterretjes en wolkjes.',
                verdict: 'Niet aanbevolen, omdat de snoepwinkel een tweede wereld naast de planner is.',
            },
            {
                key: 'bare',
                name: 'Geen motieven',
                see: 'Alleen rond papier op lavendel, zonder tekentjes.',
                verdict: 'Niet aanbevolen, omdat pastel dan een licht thema met ronde hoeken wordt.',
            },
        ],
    },
];

// Loading option N and spinner option N must be the same variant: the keys in
// both lists follow PAIRS one to one, and the two names are the same words.
{
    const byId = (/** @type {string} */ id) => ASPECTS.find((a) => a.id === id)?.options ?? [];
    const loading = byId('loading');
    const spinner = byId('spinner');
    [...PAIRS_A, ...PAIRS_B].forEach(([l, sp], n) => {
        if (loading[n]?.key !== l || spinner[n]?.key !== sp || loading[n]?.name !== spinner[n]?.name) {
            throw new Error(`loading/spinner option ${n + 1} is not one pair: ${loading[n]?.key} / ${spinner[n]?.key}, expected ${l} / ${sp}`);
        }
    });
    if (loading.length !== spinner.length) throw new Error('loading and spinner differ in length');
}
