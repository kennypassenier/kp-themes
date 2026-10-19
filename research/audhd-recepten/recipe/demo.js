// research/audhd-recepten/recipe: what this page does that the package does not.
//   1. the sample recipe, its two languages and the arithmetic of scaling an amount;
//   2. the pretend server (a fetch that takes a moment, one that finds nothing, one that fails);
//   3. the buttons that drive an option or a state, each wired by its own section's elements.
// Everything drawn is drawn by the package's own parts: the card and its states, the lede, the quantity, the hover card,
// the flash button, the QR code, the print words, the calm switch, the theme picker, the segmented control, the heat grid.
import { setCardState } from '../../../js/card-state.js';
import { attachLedes } from '../../../js/lede.js';
import { attachQuantities } from '../../../js/quantity.js';
import { attachHoverCards } from '../../../js/hovercard.js';
import { attachFlashButtons, runFlashButton } from '../../../js/flash.js';
import { setQr } from '../../../js/qr.js';
import { setHeat } from '../../../js/heat.js';
import { attachSegmented, layout as layoutSegmented } from '../../../js/segmented.js';
import { themeMenuMarkup, themeOptionsMarkup, THEMES } from '../../../js/theme-picker.js';
import { setCalm } from '../../../js/calm.js';
import { setChecklistItems } from '../../../js/checklist.js';
import { preparePrint } from '../../../js/print.js';

/** Resolves once js/auto.js has attached everything the page carries. */
await new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
/** @param {string} id */
const byId = (id) => document.getElementById(id);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Press one button of a group (aria-pressed), the others off. @param {HTMLElement} button */
function pressOnly(button) {
    const group = button.closest('[role="group"]');
    for (const other of all('button[aria-pressed]', group ?? document)) other.setAttribute('aria-pressed', String(other === button));
}

/** Every button carrying `attr` runs `run(value, button)`; a button in a group of pressed buttons is pressed first. @param {string} attr @param {(value: string, button: HTMLElement) => void} run */
function onButtons(attr, run) {
    for (const button of all(`[${attr}]`)) {
        button.addEventListener('click', () => {
            if (button.hasAttribute('aria-pressed')) pressOnly(button);
            run(button.getAttribute(attr) ?? '', button);
        });
    }
}

/**
 * A small element builder: text is text, never markup.
 * @param {string} tag @param {Record<string, string | boolean | null | undefined>} [attrs] @param {...(Node | string | (Node | string)[])} kids
 */
function h(tag, attrs = {}, ...kids) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
        if (value === false || value == null) continue;
        if (name === 'class') node.className = String(value);
        else node.setAttribute(name, value === true ? '' : String(value));
    }
    for (const kid of kids.flat()) node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    return node;
}

// ---- 1 · the sample recipe and its two languages ---------------------------------------------------------------
const LANG_KEY = 'kp-audhd-lang';
/** The language the person chose in the settings, kept for the next visit (a convenience: the page works without it). @returns {'en' | 'nl'} */
const language = () => {
    try {
        return localStorage.getItem(LANG_KEY) === 'nl' ? 'nl' : 'en';
    } catch {
        return 'en';
    }
};

/** Amounts are for four portions. kind: g and ml round to a number a person weighs; pc to a quarter; fixed never changes. */
const INGREDIENTS = [
    { id: 'chicory', kind: 'pc', base: 8, unit: 'pc', group: 'veg' },
    { id: 'potatoes', kind: 'g', base: 800, unit: 'g', group: 'veg' },
    { id: 'onion', kind: 'pc', base: 1, unit: 'pc', group: 'veg' },
    { id: 'ham', kind: 'pc', base: 8, unit: 'slice', group: 'meat' },
    { id: 'cheese', kind: 'g', base: 200, unit: 'g', group: 'meat' },
    { id: 'milk', kind: 'ml', base: 500, unit: 'ml', group: 'meat' },
    { id: 'butter', kind: 'g', base: 40, unit: 'g', group: 'pantry' },
    { id: 'flour', kind: 'g', base: 40, unit: 'g', group: 'pantry' },
    { id: 'nutmeg', kind: 'fixed', base: 1, unit: 'pinch', group: 'pantry' },
];

const WORDS = {
    en: {
        loc: 'en-GB',
        recipe: 'Recipe',
        title: 'Chicory in the oven with ham and cheese',
        summary:
            'Chicory rolled in ham, covered in a cheese sauce and baked until the top is gold. The potatoes boil while it bakes. Almost everything happens in the oven, so there are only about twenty minutes of real work. Last time the sauce was a little salty: use unsalted butter. You can freeze the filled dishes before baking, for up to three months.',
        effortLabel: 'Effort',
        effort: 'Low',
        effortBadge: 'Effort: Low',
        total: 'Total time',
        totalValue: '55 min',
        hands: 'Hands-on',
        handsValue: '20 min',
        lastTime: 'Last time',
        lastWhen: '04/10/2026 18:40',
        lastText: 'The sauce was a little salty and the dish needed ten more minutes in the oven.',
        begin: 'Begin cooking',
        beginDone: 'Opening',
        beginHint: (/** @type {number} */ n) => `The first step is small: get these ${n} things out. Nothing is timed yet.`,
        portions: 'Portions',
        portionsOne: 'portion',
        portionsMany: 'portions',
        ingredients: (/** @type {number} */ n) => `Ingredients for ${n} ${n === 1 ? 'portion' : 'portions'}`,
        loading: 'Fetching the recipe',
        notFoundTitle: 'We cannot find this recipe',
        notFoundText: 'It may have been renamed or removed. Nothing you saved is lost.',
        back: 'Back to my recipes',
        wheel: 'Pick something with the wheel',
        failedTitle: 'The recipe could not be loaded',
        failedText: 'The connection to your kitchen server dropped. Your recipes are all still there.',
        retry: 'Try again',
        units: { pc: ['piece', 'pieces'], slice: ['slice', 'slices'], g: ['g', 'g'], kg: ['kg', 'kg'], ml: ['ml', 'ml'], l: ['l', 'l'], pinch: ['pinch', 'pinch'] },
        names: {
            chicory: 'Chicory',
            potatoes: 'Floury potatoes',
            onion: 'Onion',
            ham: 'Cooked ham, thin slices',
            cheese: 'Gruyère or old Gouda, grated',
            milk: 'Milk',
            butter: 'Butter',
            flour: 'Flour',
            nutmeg: 'Nutmeg',
        },
        notes: {
            chicory: 'Cut the bitter core out with a small knife, about 2 cm deep: that is what makes it less bitter.',
            potatoes: 'Peel them first so they boil while you do the rest: they take the longest.',
            onion: 'Chopped fine and softened in the butter before the flour goes in.',
            ham: 'One slice per chicory; thin slices roll more easily.',
            cheese: 'Half in the sauce, the other half over the top.',
            milk: 'Warm it for a minute in the microwave and the sauce will not go lumpy.',
            butter: 'Unsalted if you have it: last time the sauce was a bit salty.',
            flour: 'Cook it in the butter for a minute, until it smells like biscuits.',
            nutmeg: 'A pinch is what you hold between two fingers.',
        },
    },
    nl: {
        loc: 'nl-BE',
        recipe: 'Recept',
        title: 'Witloof in de oven met hesp en kaas',
        summary:
            'Witloof gerold in hesp, onder een kaassaus in de oven gebakken tot de bovenkant goudbruin is. De aardappelen koken terwijl het gerecht bakt. Bijna alles gebeurt in de oven, dus er is maar ongeveer twintig minuten echt werk. De vorige keer was de saus wat zout: neem ongezouten boter. De gevulde schotels kun je tot drie maanden invriezen vóór het bakken.',
        effortLabel: 'Inspanning',
        effort: 'Laag',
        effortBadge: 'Inspanning: laag',
        total: 'Totale tijd',
        totalValue: '55 min',
        hands: 'Zelf bezig',
        handsValue: '20 min',
        lastTime: 'Vorige keer',
        lastWhen: '04/10/2026 18:40',
        lastText: 'De saus was wat zout en de schotel had tien minuten extra in de oven nodig.',
        begin: 'Begin met koken',
        beginDone: 'Openen',
        beginHint: (/** @type {number} */ n) => `De eerste stap is klein: haal deze ${n} dingen tevoorschijn. Er loopt nog geen timer.`,
        portions: 'Porties',
        portionsOne: 'portie',
        portionsMany: 'porties',
        ingredients: (/** @type {number} */ n) => `Ingrediënten voor ${n} ${n === 1 ? 'portie' : 'porties'}`,
        loading: 'Recept ophalen',
        notFoundTitle: 'We vinden dit recept niet',
        notFoundText: 'Het is misschien hernoemd of verwijderd. Niets van wat je bewaarde is weg.',
        back: 'Terug naar mijn recepten',
        wheel: 'Kies iets met het rad',
        failedTitle: 'Het recept kon niet geladen worden',
        failedText: 'De verbinding met je keukenserver viel weg. Je recepten zijn er allemaal nog.',
        retry: 'Probeer opnieuw',
        units: { pc: ['stuk', 'stuks'], slice: ['plak', 'plakken'], g: ['g', 'g'], kg: ['kg', 'kg'], ml: ['ml', 'ml'], l: ['l', 'l'], pinch: ['snuifje', 'snuifje'] },
        names: {
            chicory: 'Witloof',
            potatoes: 'Kruimige aardappelen',
            onion: 'Ui',
            ham: 'Gekookte hesp, dunne plakken',
            cheese: 'Gruyère of oude gouda, geraspt',
            milk: 'Melk',
            butter: 'Boter',
            flour: 'Bloem',
            nutmeg: 'Nootmuskaat',
        },
        notes: {
            chicory: 'Snij het bittere hart er met een klein mesje uit, ongeveer 2 cm diep: daardoor is het minder bitter.',
            potatoes: 'Schil ze eerst, dan koken ze terwijl jij de rest doet: ze duren het langst.',
            onion: 'Fijn gesneden en zacht gesmoord in de boter voor de bloem erbij gaat.',
            ham: 'Eén plak per witloof; dunne plakken rollen makkelijker.',
            cheese: 'De helft in de saus, de andere helft over de bovenkant.',
            milk: 'Warm ze een minuut in de microgolf en de saus wordt niet klonterig.',
            butter: 'Ongezouten als je het hebt: de vorige keer was de saus wat zout.',
            flour: 'Een minuut meebakken in de boter, tot het naar koekjes ruikt.',
            nutmeg: 'Een snuifje is wat je tussen twee vingers houdt.',
        },
    },
};
const w = () => WORDS[language()];

/** The group names of the printed sheet. */
const GROUPS = {
    en: { veg: 'Vegetables', meat: 'Meat and dairy', pantry: 'Pantry' },
    nl: { veg: 'Groenten', meat: 'Vlees en zuivel', pantry: 'Voorraadkast' },
};

const FRACTIONS = /** @type {Record<number, string>} */ ({ 0.25: '¼', 0.5: '½', 0.75: '¾' });

/**
 * One amount, for a number of portions: what to write, and the unit after it.
 * @param {(typeof INGREDIENTS)[number]} ing @param {number} portions @param {'fractions' | 'decimals'} mode
 */
function amountOf(ing, portions, mode) {
    const words = w();
    const numbers = new Intl.NumberFormat(words.loc, { maximumFractionDigits: 2 });
    if (ing.kind === 'fixed') return { text: numbers.format(ing.base), unit: words.units.pinch[0] };
    let value = (ing.base * portions) / 4;
    if (ing.kind === 'pc') {
        value = Math.max(0.25, Math.round(value * 4) / 4);
        const whole = Math.floor(value);
        const part = Math.round((value - whole) * 100) / 100;
        const text = mode === 'fractions' && part > 0 ? `${whole > 0 ? whole : ''}${FRACTIONS[part]}` : numbers.format(value);
        const unit = words.units[/** @type {'pc' | 'slice'} */ (ing.unit)];
        return { text, unit: value === 1 ? unit[0] : unit[1] };
    }
    value = value < 250 ? Math.round(value / 5) * 5 : Math.round(value / 10) * 10;
    if (value >= 1000) return { text: numbers.format(value / 1000), unit: words.units[ing.kind === 'g' ? 'kg' : 'l'][0] };
    return { text: numbers.format(value), unit: words.units[/** @type {'g' | 'ml'} */ (ing.kind)][0] };
}

/** What the page has been told to do. */
const options = { summary: 'fold', notes: 'hover', amounts: 'fractions' };
/** The portions the person chose, kept across a redraw. */
let portions = 4;

/** The recipe, drawn into a card's data area. @param {HTMLElement} data @param {string} titleId */
function drawRecipe(data, titleId) {
    const words = w();
    const summary = h('p', { class: 'kp-lede', id: `${titleId}-lede` }, words.summary);
    if (options.summary === 'fold') summary.setAttribute('data-kp-lede-collapsible', '100');

    const list = h('ul', { class: 'rc-ings', 'aria-label': words.ingredients(portions) });
    for (const ing of INGREDIENTS) {
        const word = h('span', { class: 'rc-ing__word', id: `${titleId}-${ing.id}` }, words.names[/** @type {keyof typeof words.names} */ (ing.id)]);
        const note = words.notes[/** @type {keyof typeof words.notes} */ (ing.id)];
        const name = h('span', { class: 'rc-ing__name' }, word);
        if (options.notes === 'hover') {
            word.setAttribute('data-kp-hovercard', note);
            word.tabIndex = 0;
        } else name.append(h('span', { class: 'rc-ing__note' }, note));
        list.append(
            h(
                'li',
                { class: 'rc-ing', 'data-ing': ing.id },
                h('span', { class: 'rc-ing__amount' }),
                h('span', { class: 'rc-ing__unit' }),
                name,
            ),
        );
    }

    const quantity = h(
        'div',
        {
            class: 'kp-quantity',
            'data-kp-quantity': true,
            'data-kp-quantity-min': '1',
            'data-kp-quantity-max': '12',
            'data-kp-quantity-unit': words.portionsMany,
            'data-kp-quantity-unit-one': words.portionsOne,
            'data-kp-quantity-label': words.portions,
        },
        h('input', { class: 'kp-quantity__input', value: String(portions) }),
    );

    const begin = h(
        'button',
        { type: 'button', class: 'kp-button kp-button--primary kp-button--lg', 'data-kp-flash-button': true, 'data-kp-flash-words': words.beginDone, 'data-rc-begin': true },
        words.begin,
    );

    data.replaceChildren(
        h(
            'div',
            { class: 'rc-recipe' },
            h(
                'div',
                { class: 'rc-recipe__main' },
                h('div', { class: 'rc-recipe__head' }, h('h2', { id: titleId }, words.title), h('span', { class: 'kp-badge' }, words.effortBadge)),
                summary,
                h(
                    'dl',
                    { class: 'rc-facts' },
                    h('div', {}, h('dt', {}, words.total), h('dd', {}, words.totalValue)),
                    h('div', {}, h('dt', {}, words.hands), h('dd', {}, words.handsValue)),
                    h('div', {}, h('dt', {}, words.effortLabel), h('dd', {}, words.effort)),
                ),
                h('div', { class: 'rc-begin' }, begin, h('p', { class: 'rc-begin__hint' }, words.beginHint(INGREDIENTS.length))),
                h('div', { class: 'kp-alert kp-alert--info' }, h('div', { class: 'kp-alert__body' }, h('b', {}, `${words.lastTime} · ${words.lastWhen}`), ` ${words.lastText}`)),
            ),
            h(
                'div',
                { class: 'rc-recipe__side' },
                h('div', { class: 'rc-portions' }, h('h3', { class: 'kp-fw-semibold' }, words.portions), quantity),
                list,
            ),
        ),
    );
    paintAmounts(data, false);
    attachLedes(data);
    attachQuantities(data);
    attachFlashButtons(data);
    attachHoverCards(document);
    quantity.addEventListener('kp-quantity-change', (event) => {
        portions = Number(/** @type {CustomEvent} */ (event).detail.value);
        paintAmounts(data, true);
    });
    begin.addEventListener('click', () => {
        void runFlashButton(begin, async () => {
            await sleep(700);
            return words.beginDone;
        });
    });
}

/** Write every amount for the current portions; a number that changed lights up for a moment. @param {HTMLElement} data @param {boolean} lit */
function paintAmounts(data, lit) {
    const words = w();
    for (const row of all('.rc-ing', data)) {
        const ing = INGREDIENTS.find((i) => i.id === row.dataset.ing);
        if (!ing) continue;
        const { text, unit } = amountOf(ing, portions, /** @type {'fractions' | 'decimals'} */ (options.amounts));
        const cell = /** @type {HTMLElement} */ (row.querySelector('.rc-ing__amount'));
        if (cell.textContent !== text && lit) {
            cell.removeAttribute('data-changed');
            void cell.offsetWidth;
            cell.setAttribute('data-changed', '');
        }
        cell.textContent = text;
        /** @type {HTMLElement} */ (row.querySelector('.rc-ing__unit')).textContent = unit;
    }
    data.querySelector('.rc-ings')?.setAttribute('aria-label', words.ingredients(portions));
}

/** The pretend server: the recipe takes a moment to arrive. */
const FETCH_MS = 900;

/** @param {HTMLElement} card @param {string} titleId */
async function loadRecipe(card, titleId) {
    const data = /** @type {HTMLElement} */ (card.querySelector('.kp-card__data'));
    setCardState(card, 'loading', { words: w().loading });
    await sleep(FETCH_MS);
    drawRecipe(data, titleId);
    setCardState(card, 'ready');
}

// ---- 1 · the recipe page -----------------------------------------------------------------------------------------
const main = byId('rc-card');
if (main) {
    void loadRecipe(main, 'rc-title-main');
    const redraw = () => {
        const data = /** @type {HTMLElement} */ (main.querySelector('.kp-card__data'));
        if (data.childElementCount > 0) drawRecipe(data, 'rc-title-main');
    };
    onButtons('data-rc-opt', (value, button) => {
        const name = button.getAttribute('data-rc-opt') ?? '';
        if (name === 'summary' || name === 'notes' || name === 'amounts') {
            /** @type {Record<string, string>} */ (options)[name] = value;
            redraw();
            redrawStates();
        }
    });
}

// ---- 2 · the states of the recipe page ---------------------------------------------------------------------------
const states = byId('rs-card');
let missing = 'back';
let current = 'ready';
/** Draw the states card again after an option of the first section changed (the cards share the options). */
function redrawStates() {
    if (!states) return;
    const data = /** @type {HTMLElement} */ (states.querySelector('.kp-card__data'));
    if (data.childElementCount > 0) drawRecipe(data, 'rc-title-states');
}
/** @param {string} state */
async function showState(state) {
    if (!states) return;
    current = state;
    const words = w();
    const data = /** @type {HTMLElement} */ (states.querySelector('.kp-card__data'));
    if (state === 'ready') {
        if (data.childElementCount === 0) drawRecipe(data, 'rc-title-states');
        setCardState(states, 'ready');
    } else if (state === 'loading') setCardState(states, 'loading', { words: words.loading });
    else if (state === 'empty') {
        const action = h(
            'button',
            { type: 'button', class: missing === 'back' ? 'kp-button kp-button--primary' : 'kp-button', 'data-rc-missing': missing },
            missing === 'back' ? words.back : words.wheel,
        );
        setCardState(states, 'empty', { title: words.notFoundTitle, text: words.notFoundText, action });
    } else setCardState(states, 'error', { title: words.failedTitle, text: words.failedText });
}
if (states) {
    void (async () => {
        const data = /** @type {HTMLElement} */ (states.querySelector('.kp-card__data'));
        setCardState(states, 'loading', { words: w().loading });
        await sleep(FETCH_MS);
        drawRecipe(data, 'rc-title-states');
        setCardState(states, 'ready');
    })();
    states.addEventListener('kp-card-retry', () => {
        void (async () => {
            setCardState(states, 'loading', { words: w().loading });
            await sleep(1000);
            await showState('ready');
            for (const button of all('[data-rc-state]')) button.setAttribute('aria-pressed', String(button.dataset.rcState === 'ready'));
        })();
    });
    onButtons('data-rc-state', (value) => void showState(value));
    onButtons('data-rc-opt', (value, button) => {
        if (button.getAttribute('data-rc-opt') !== 'missing') return;
        missing = value;
        if (current === 'empty') void showState('empty');
    });
}

// ---- 3 · the QR code ---------------------------------------------------------------------------------------------
const LINK = 'https://recepten.home.arpa/cook/witloof-hesp-kaas?portions=4&from=qr';
const code = byId('rq-code');
if (code) {
    setQr(code, { value: LINK });
    onButtons('data-rc-qr', (value, button) => {
        const name = button.getAttribute('data-rc-qr') ?? '';
        // Every option is a real attribute of the component: changing one draws the code again.
        if (name === 'size') {
            if (value === 'standard') code.removeAttribute('data-kp-qr-size');
            else code.setAttribute('data-kp-qr-size', value);
        } else code.setAttribute(`data-kp-qr-${name}`, value);
    });
}

// ---- 4 · the states of the QR code ------------------------------------------------------------------------------
const states4 = byId('rqs-code');
if (states4) {
    const PAST = '2026-01-01T00:00:00Z';
    setQr(states4, { value: LINK });
    /** @param {string} value */
    const showQr = (value) => {
        states4.removeAttribute('data-kp-qr-expires');
        if (value === 'ready') setQr(states4, { value: LINK, state: undefined });
        else if (value === 'loading') setQr(states4, { value: LINK, state: 'loading' });
        else if (value === 'empty') setQr(states4, { value: '', state: undefined });
        else if (value === 'error') setQr(states4, { value: LINK, state: 'error', message: 'This link is too long to be a code. Copy the link below instead.' });
        else {
            setQr(states4, { value: LINK, state: undefined });
            states4.setAttribute('data-kp-qr-expires', PAST);
        }
    };
    onButtons('data-rc-qrstate', showQr);
    states4.addEventListener('kp-qr-retry', () => {
        void (async () => {
            showQr('loading');
            await sleep(1000);
            showQr('ready');
            for (const button of all('[data-rc-qrstate]')) button.setAttribute('aria-pressed', String(button.dataset.rcQrstate === 'ready'));
        })();
    });
    onButtons('data-rc-qrretry', (value) => {
        // A real option of the component, read when the code is drawn: the plate is drawn again with it.
        if (value === 'on') states4.setAttribute('data-kp-qr-retry', '');
        else states4.removeAttribute('data-kp-qr-retry');
        setQr(states4, {});
    });
}

// ---- 5 · the printed recipe --------------------------------------------------------------------------------------
const sheet = /** @type {HTMLIFrameElement | null} */ (byId('rp-sheet'));
if (sheet) {
    const NOW = Date.parse('2026-10-16T14:05:00+02:00');
    const STEPS = {
        en: [
            'Peel the potatoes, cut them in pieces and put them on to boil with salt.',
            'Cut the core out of each chicory, wrap a slice of ham round it and lay them in a buttered dish.',
            'Soften the onion in the butter, stir in the flour for a minute, then add the warm milk a little at a time until smooth. Add the nutmeg and half the cheese.',
            'Pour the sauce over the chicory, scatter the rest of the cheese on top and bake for 35 minutes at 200 °C.',
            'Drain and mash the potatoes with a little butter and serve them beside the gold-topped chicory.',
        ],
        nl: [
            'Schil de aardappelen, snij ze in stukken en zet ze op met zout.',
            'Snij het hart uit elk witloof, rol er een plak hesp rond en leg ze in een beboterde schotel.',
            'Smoor de ui in de boter, roer er een minuut de bloem door en voeg beetje bij beetje de warme melk toe tot de saus glad is. Voeg de nootmuskaat en de helft van de kaas toe.',
            'Giet de saus over het witloof, strooi de rest van de kaas erover en bak 35 minuten op 200 °C.',
            'Giet de aardappelen af, stamp ze met wat boter en serveer ze naast het goudbruine witloof.',
        ],
    };
    /** @type {string[]} */
    let sheetCss = [];
    try {
        sheetCss = await Promise.all(['../../../css/themes.css', '../../../css/components.css', '../../../css/formal-register.css'].map((u) => fetch(u).then((r) => r.text())));
    } catch {
        // The page is being left: nothing to draw.
    }
    // The page's real print rules, with the at-rule that limits them to paper turned into "all": the sheet shows what the printer gets.
    const url = URL.createObjectURL(new Blob([sheetCss.map((css) => css.replaceAll('@media print', '@media all')).join('\n')], { type: 'text/css' }));
    const printOptions = { notes: 'show', box: 'square', groups: 'keep', lines: 'off' };
    function drawSheet() {
        const words = w();
        const lang = language();
        const doc = sheet?.contentDocument;
        if (!doc) return;
        doc.open();
        doc.write(
            `<!doctype html><html lang="${lang}" data-theme="formal"><head><meta charset="utf-8"><link rel="stylesheet" href="${url}"><style>body{margin:0;padding:7% 8% 14%;font-size:0.8rem}h1{margin:0 0 .25rem;font-size:1.35rem}.meta{margin:0 0 1rem;color:#444}ol{margin:1rem 0 0;padding-inline-start:1.25rem;display:grid;gap:.4rem}h2{margin:1.25rem 0 0;font-size:1rem}</style></head><body><h1></h1><p class="meta"></p><div class="kp-checklist" data-kp-checklist></div><h2></h2><ol></ol></body></html>`,
        );
        doc.close();
        /** @type {HTMLElement} */ (doc.querySelector('h1')).textContent = words.title;
        /** @type {HTMLElement} */ (doc.querySelector('.meta')).textContent = `${words.ingredients(4)} · ${words.total} ${words.totalValue}`;
        /** @type {HTMLElement} */ (doc.querySelector('h2')).textContent = lang === 'nl' ? 'Zo maak je het' : 'How to make it';
        const list = /** @type {HTMLElement} */ (doc.querySelector('.kp-checklist'));
        for (const [name, value] of Object.entries({
            'data-kp-print-notes': printOptions.notes,
            'data-kp-print-box': printOptions.box,
            'data-kp-print-groups': printOptions.groups,
        }))
            list.setAttribute(name, value);
        if (printOptions.lines === 'on') list.setAttribute('data-kp-print-notes-lines', '');
        for (const text of STEPS[lang]) doc.querySelector('ol')?.append(h('li', {}, text));
        /** @type {import('../../../js/checklist.js').ChecklistItem[]} */
        const items = INGREDIENTS.map((ing) => {
            const { text, unit } = amountOf(ing, 4, 'fractions');
            return {
                id: ing.id,
                label: words.names[/** @type {keyof typeof words.names} */ (ing.id)],
                detail: `${text} ${unit}. ${words.notes[/** @type {keyof typeof words.notes} */ (ing.id)]}`,
                group: GROUPS[lang][/** @type {'veg' | 'meat' | 'pantry'} */ (ing.group)],
            };
        });
        setChecklistItems(list, items);
        preparePrint(doc, { now: () => NOW, timeZone: 'Europe/Brussels' });
    }
    drawSheet();
    onButtons('data-rc-print', (value, button) => {
        const name = button.getAttribute('data-rc-print') ?? '';
        /** @type {Record<string, string>} */ (printOptions)[name] = value;
        const list = sheet.contentDocument?.querySelector('.kp-checklist');
        if (!list) return;
        if (name === 'lines') list.toggleAttribute('data-kp-print-notes-lines', value === 'on');
        else list.setAttribute(`data-kp-print-${name}`, value);
    });
}

// ---- 6 · calm settings -------------------------------------------------------------------------------------------
const settings = byId('rs-settings');
if (settings) {
    const root = document.documentElement;
    const switchInput = /** @type {HTMLInputElement | null} */ (settings.querySelector('[data-kp-calm-switch]'));
    const calmState = { scope: 'effects', loading: 'slow' };
    const readout = /** @type {HTMLElement} */ (byId('rs-readout'));
    const paintReadout = () => {
        const on = root.hasAttribute('data-kp-calm');
        readout.toggleAttribute('data-on', on);
        settings.setAttribute('data-rc-calm', on ? `${calmState.scope} ${calmState.loading}` : 'off');
        if (!on) {
            readout.textContent = 'Calm mode is off. Everything moves the way the theme draws it.';
            return;
        }
        const what = { motion: 'transitions are off; entrances, glow and flicker still play', effects: 'transitions, entrances, glow and flicker are off', all: 'everything is off' }[
            /** @type {'motion' | 'effects' | 'all'} */ (calmState.scope)
        ];
        readout.textContent = `Calm mode is on: ${what}. ${calmState.loading === 'slow' ? 'Loading breathes as one slow pulse.' : 'Loading holds still.'}`;
    };
    setCalm(false, { scope: 'effects', loading: 'slow', remember: false, announce: false });
    root.addEventListener('kp-calm-change', paintReadout);
    paintReadout();
    onButtons('data-rc-calm', (value, button) => {
        const name = /** @type {'scope' | 'loading'} */ (button.getAttribute('data-rc-calm'));
        calmState[name] = value;
        // The scope and the loading are only seen while calm mode is on, so choosing one turns it on: said in the line.
        setCalm(true, { scope: /** @type {any} */ (calmState.scope), loading: /** @type {any} */ (calmState.loading), remember: false });
        if (switchInput) switchInput.checked = true;
        paintReadout();
    });

    // The theme: a menu or twelve swatches. A choice is caught before the picker stores it: this page judges formal and stays formal.
    const pickerHost = /** @type {HTMLElement} */ (byId('rs-picker'));
    const themeSaid = /** @type {HTMLElement} */ (byId('rs-theme-said'));
    let chosen = 'formal';
    const labelOf = (/** @type {string} */ name) => THEMES.find((t) => t.name === name)?.label ?? name;
    const drawPicker = (/** @type {string} */ look) => {
        pickerHost.replaceChildren();
        pickerHost.setAttribute('data-rc-picker', look);
        if (look === 'menu') pickerHost.innerHTML = themeMenuMarkup({ id: 'rs-theme-menu' });
        else pickerHost.innerHTML = `<ul class="rc-swatches" data-kp-theme-picker aria-label="Theme">${themeOptionsMarkup({ grouped: false })}</ul>`;
        for (const option of all('[data-kp-theme]', pickerHost)) option.setAttribute('aria-pressed', String(option.dataset.kpTheme === chosen));
    };
    pickerHost.addEventListener(
        'click',
        (event) => {
            const option = event.target instanceof Element ? event.target.closest('[data-kp-theme]') : null;
            if (!option) return;
            event.stopPropagation();
            chosen = option.getAttribute('data-kp-theme') ?? 'formal';
            for (const other of all('[data-kp-theme]', pickerHost)) other.setAttribute('aria-pressed', String(other.dataset.kpTheme === chosen));
            const popover = /** @type {HTMLElement | null} */ (option.closest('[popover]'));
            if (popover?.matches(':popover-open')) popover.hidePopover();
            themeSaid.textContent =
                chosen === 'formal'
                    ? 'Formal is on.'
                    : `${labelOf(chosen)} chosen. In the app it applies at once and is kept for next time; this page stays in formal so you can judge it.`;
        },
        true,
    );
    drawPicker('menu');
    onButtons('data-rc-set', (value, button) => {
        if (button.getAttribute('data-rc-set') === 'picker') drawPicker(value);
    });

    // The language: NL and EN, as one switch or two chips; the preview line is in the chosen language.
    const langHost = /** @type {HTMLElement} */ (byId('rs-lang'));
    langHost.append(
        h(
            'div',
            { class: 'kp-segmented', 'data-kp-segmented': 'single', role: 'radiogroup', 'aria-label': 'Language', 'data-rc-lang': 'segmented' },
            ...['nl', 'en'].map((code2) =>
                h(
                    'button',
                    { type: 'button', class: 'kp-segmented__item', 'data-value': code2, role: 'radio', 'aria-checked': String(code2 === language()) },
                    h('span', { class: 'kp-segmented__label' }, code2.toUpperCase()),
                ),
            ),
        ),
    );
    const group = /** @type {HTMLElement} */ (langHost.firstElementChild);
    attachSegmented(langHost);
    const paintPreview = () => {
        const words = w();
        document.documentElement.setAttribute('lang', language());
        const set = (/** @type {string} */ key, /** @type {string} */ text) => {
            const target = settings.querySelector(`[data-rc-pv="${key}"]`);
            if (target) target.textContent = text;
        };
        set('title', words.title);
        set('meta', `${words.portions}: 4 · ${words.begin}`);
        set('badge', words.effortBadge);
    };
    group.addEventListener('kp-segmented-change', (event) => {
        const value = /** @type {CustomEvent} */ (event).detail.value;
        if (value !== 'nl' && value !== 'en') return;
        try {
            localStorage.setItem(LANG_KEY, value);
        } catch {
            // The choice lasts for this page only.
        }
        paintPreview();
    });
    paintPreview();
    onButtons('data-rc-set', (value, button) => {
        if (button.getAttribute('data-rc-set') !== 'lang') return;
        group.classList.toggle('kp-segmented--chips', value === 'chips');
        group.setAttribute('data-rc-lang', value);
        layoutSegmented(group);
    });

    // Save settings: the first press works, the second is refused with its reason, then it goes round again.
    const save = /** @type {HTMLElement} */ (byId('rs-save'));
    attachFlashButtons(settings);
    save.setAttribute('data-kp-flash-line', '#rs-save-line');
    let presses = 0;
    save.addEventListener('click', () => {
        const refuse = presses++ % 2 === 1;
        void runFlashButton(save, async () => {
            await sleep(900);
            return refuse ? { error: 'Not saved', remedy: 'The kitchen server did not answer. Your choices are still set on this screen: try again in a minute.' } : 'Saved';
        });
    });
}

// ---- 7 · the cooking log -----------------------------------------------------------------------------------------
const logCard = byId('rl-card');
if (logCard) {
    const logData = /** @type {HTMLElement} */ (byId('rl-data'));
    const TODAY = '2026-10-16';
    /** The first Monday of each week shown, oldest first. */
    const WEEKS = ['2026-09-21', '2026-09-28', '2026-10-05', '2026-10-12'];
    const DAYS = { en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], nl: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'] };
    /** What was logged: date → { dish, felt }. */
    /** @type {Record<string, { dish: string, felt: string }>} */
    const entries = {
        '2026-09-29': { dish: 'Spaghetti with tomato sauce', felt: 'easy' },
        '2026-10-01': { dish: 'Soup and bread', felt: 'easy' },
        '2026-10-03': { dish: 'Stoofvlees with fries', felt: 'heavy' },
        '2026-10-08': { dish: 'Omelette', felt: 'easy' },
        '2026-10-10': { dish: 'Vol-au-vent', felt: 'fine' },
        '2026-10-13': { dish: 'Omelette', felt: 'easy' },
        '2026-10-15': { dish: 'Chicory in the oven with ham and cheese', felt: 'easy' },
    };
    const PAUSED = ['2026-10-05', '2026-10-06', '2026-10-07'];
    const view = { quiet: false, weeks: 4, rows: 'words', fill: 'accent', day: TODAY, felt: 'none' };
    const FEELS = /** @type {Record<string, string>} */ ({ easy: 'felt easy', fine: 'felt fine', heavy: 'felt heavy', none: '' });
    const ROW_WORDS = ['3 weeks ago', '2 weeks ago', 'Last week', 'This week'];
    /** @param {string} iso @param {number} by */
    const plus = (iso, by) => new Date(Date.parse(`${iso}T12:00:00Z`) + by * 86400000).toISOString().slice(0, 10);
    /** @param {string} iso */
    const dmy = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

    const grid = h('div', { class: 'kp-heat rc-log__grid', 'data-kp-heat': true, 'data-kp-tones': 'calm', 'aria-label': 'Cooking log' });
    const note = h('p', { class: 'rc-log__note' });
    const heading = h('h3', { class: 'kp-fw-semibold' });
    const sub = h('p', {}, 'Optional. Nothing is expected, and a day without an entry is fine.');
    const feelGroup = h(
        'div',
        { class: 'kp-segmented kp-segmented--chips', 'data-kp-segmented': 'single', role: 'radiogroup', 'aria-label': 'How did it feel?' },
        ...[
            ['none', 'No answer'],
            ['easy', 'Easy'],
            ['fine', 'Fine'],
            ['heavy', 'Heavy'],
        ].map(([value, label]) =>
            h(
                'button',
                { type: 'button', class: 'kp-segmented__item', 'data-value': value, role: 'radio', 'aria-checked': String(value === 'none') },
                h('span', { class: 'kp-segmented__label' }, label),
            ),
        ),
    );
    const add = h(
        'button',
        { type: 'button', class: 'kp-button kp-button--primary', 'data-kp-flash-button': true, 'data-kp-flash-words': 'Added' },
        'Add to the log',
    );
    const remove = h('button', { type: 'button', class: 'kp-button kp-button--ghost' }, 'Remove entry');
    logData.replaceChildren(
        h(
            'div',
            { class: 'rc-log' },
            h('div', { class: 'rc-log__add' }, h('div', {}, heading, sub), feelGroup, h('div', { class: 'rc-log__buttons' }, add, remove)),
            grid,
            note,
        ),
    );
    attachSegmented(logData);
    attachFlashButtons(logData);

    const draw = () => {
        const shown = WEEKS.slice(-view.weeks);
        const offset = WEEKS.length - shown.length;
        grid.setAttribute('data-kp-logged-fill', view.fill);
        if (view.fill === 'accent') grid.removeAttribute('data-kp-logged-fill');
        setHeat(grid, {
            columns: DAYS.en.map((label, i) => ({ key: String(i), label })),
            every: 1,
            rows: shown.map((monday, r) => ({
                key: monday,
                label: view.rows === 'words' ? ROW_WORDS[r + offset] : dmy(monday),
                cells: DAYS.en.map((_, i) => {
                    const iso = plus(monday, i);
                    const entry = entries[iso];
                    if (iso > TODAY) return { tone: /** @type {const} */ ('future'), label: 'not yet' };
                    if (!view.quiet && entry)
                        return {
                            tone: /** @type {const} */ ('logged'),
                            label: `${entry.dish}${FEELS[entry.felt] ? `, ${FEELS[entry.felt]}` : ''}`,
                            tip: `${dmy(iso)}: ${entry.dish}${FEELS[entry.felt] ? ` · ${FEELS[entry.felt]}` : ''}`,
                        };
                    if (!view.quiet && PAUSED.includes(iso)) return { tone: /** @type {const} */ ('paused'), label: 'paused', tip: `${dmy(iso)}, paused` };
                    return { tone: /** @type {const} */ ('quiet'), label: 'nothing logged', tip: `${dmy(iso)}, nothing logged` };
                }),
            })),
        });
        note.textContent = view.quiet
            ? 'Nothing logged. That is fine.'
            : 'Filled: you cooked. Pale: nothing logged, and that is fine. Hatched: paused. Dashed: not here yet.';
        const long = new Date(`${view.day}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
        heading.textContent = view.day === TODAY ? `Log today's dinner · ${long}` : `Log dinner for ${long}`;
        remove.hidden = !entries[view.day] || view.quiet;
        add.hidden = false;
    };
    draw();

    grid.addEventListener('kp-heat-pick', (event) => {
        const { rowKey, colKey, picked } = /** @type {CustomEvent} */ (event).detail;
        const day = plus(String(rowKey), Number(colKey));
        view.day = picked && day <= TODAY ? day : TODAY;
        draw();
    });
    feelGroup.addEventListener('kp-segmented-change', (event) => {
        view.felt = /** @type {CustomEvent} */ (event).detail.value ?? 'none';
    });
    add.addEventListener('click', () => {
        void runFlashButton(add, async () => {
            await sleep(500);
            entries[view.day] = { dish: 'Chicory in the oven with ham and cheese', felt: view.felt };
            view.quiet = false;
            draw();
            return 'Added';
        });
    });
    remove.addEventListener('click', () => {
        delete entries[view.day];
        draw();
    });

    /** @param {string} state */
    const showLog = (state) => {
        if (state === 'ready' || state === 'quiet') {
            view.quiet = state === 'quiet';
            draw();
            setCardState(logCard, 'ready');
        } else if (state === 'loading') setCardState(logCard, 'loading', { words: 'Reading your log' });
        else if (state === 'empty')
            setCardState(logCard, 'empty', { title: 'Nothing logged yet', text: 'That is fine: the log starts whenever you do.' });
        else setCardState(logCard, 'error', { title: 'Could not read the log', text: 'The connection dropped. Your entries are safe on this device.' });
    };
    setCardState(logCard, 'loading', { words: 'Reading your log' });
    void sleep(FETCH_MS).then(() => setCardState(logCard, 'ready'));
    logCard.addEventListener('kp-card-retry', () => {
        setCardState(logCard, 'loading', { words: 'Reading your log' });
        void sleep(1000).then(() => {
            showLog('ready');
            for (const button of all('[data-rc-log]')) button.setAttribute('aria-pressed', String(button.dataset.rcLog === 'ready'));
        });
    });
    onButtons('data-rc-log', showLog);
    onButtons('data-rc-logopt', (value, button) => {
        const name = button.getAttribute('data-rc-logopt') ?? '';
        if (name === 'weeks') view.weeks = Number(value);
        else if (name === 'rows') view.rows = value;
        else if (name === 'fill') view.fill = value;
        draw();
    });
}

// ---- the review dialog's default sets ----------------------------------------------------------------------------
// A choice set only asks for the default (defaults-1017); every option in it is a real option of the component, so
// pressing one in the dialog presses the demo's own button for it.
{
    /** choice id → the selector of the demo's button for a value. @type {Record<string, (v: string) => string>} */
    const buttonFor = {
        'recipe-summary': (v) => `[data-rc-opt="summary"][data-value="${v}"]`,
        'recipe-notes': (v) => `[data-rc-opt="notes"][data-value="${v}"]`,
        'recipe-amounts': (v) => `[data-rc-opt="amounts"][data-value="${v}"]`,
        'missing-action': (v) => `[data-rc-opt="missing"][data-value="${v}"]`,
        'qr-size': (v) => `[data-rc-qr="size"][data-value="${v}"]`,
        'qr-caption': (v) => `[data-rc-qr="caption"][data-value="${v}"]`,
        'qr-modules': (v) => `[data-rc-qr="modules"][data-value="${v}"]`,
        'qr-reveal': (v) => `[data-rc-qr="reveal"][data-value="${v}"]`,
        'qr-retry': (v) => `[data-rc-qrretry="${v}"]`,
        'print-notes': (v) => `[data-rc-print="notes"][data-value="${v}"]`,
        'print-box': (v) => `[data-rc-print="box"][data-value="${v}"]`,
        'print-groups': (v) => `[data-rc-print="groups"][data-value="${v}"]`,
        'print-lines': (v) => `[data-rc-print="lines"][data-value="${v}"]`,
        'calm-scope': (v) => `[data-rc-calm="scope"][data-value="${v}"]`,
        'calm-loading': (v) => `[data-rc-calm="loading"][data-value="${v}"]`,
        'settings-picker': (v) => `[data-rc-set="picker"][data-value="${v}"]`,
        'settings-lang': (v) => `[data-rc-set="lang"][data-value="${v}"]`,
        'log-fill': (v) => `[data-rc-logopt="fill"][data-value="${v}"]`,
        'log-rows': (v) => `[data-rc-logopt="rows"][data-value="${v}"]`,
        'log-weeks': (v) => `[data-rc-logopt="weeks"][data-value="${v}"]`,
    };
    document.addEventListener('review:choice', (event) => {
        const { id, value } = /** @type {CustomEvent} */ (event).detail;
        document.querySelector(buttonFor[id]?.(String(value)) ?? '')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
}
