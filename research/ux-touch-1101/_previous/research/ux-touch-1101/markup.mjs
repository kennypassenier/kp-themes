// research/ux-touch-1101: the controls and the components' markup, written once; sections.mjs places them. Every component is the
// package's own (kp- classes, attached by js/auto.js or by demo.js); the pg- classes are this page's frame. Names and values are mock.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]; `target` the component it drives. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: a phone's 390 px or the whole column. */
export const width = (target, phone = true) => group('Width', 'width', [['phone', 'Phone, 390 px', phone], ['full', 'Full width', !phone]], target);

/** A line under a component that says what the page heard or measured, one line high whether it says something or not. */
export const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

/** The approved look above the new one, each named (DEMO_RULES: a look that changes shows what it was). */
export const beforeAfter = (before, after) => `<div class="pg-pair">
            <div class="pg-frame" data-pg-frame="before"><p class="pg-frame__name"><b>Before</b>, as approved</p>${before}</div>
            <div class="pg-frame" data-pg-frame="new"><p class="pg-frame__name"><b>New</b></p>${after}</div>
        </div>`;

// ---------------------------------------------------------------- the board
/** The Boards page; demo.js fills the lanes from data.js. */
export const board = (id) => `<div class="kp-board" id="${id}" role="region" data-kp-board aria-label="Weekly review"></div>`;

// ---------------------------------------------------------------- the secret field (kyu's API token)
const TOKEN = 'kyu_live_4Fq9Zr7Lm2Xc8Vb1Nw6Tp3Hs';
/**
 * The field as it was approved, held still in its shown state: the package's own parts and paint, the countdown on the line under
 * the buttons. It is a picture of the old arrangement (no script drives it), so its words do not count down.
 */
export const secretBefore = () => `<div class="pg-secret-row">
                <div class="kp-secret" role="group" aria-label="API token, as it was" data-kp-secret-state="shown">
                    <code class="kp-secret__value">${TOKEN}</code>
                    <div class="kp-secret__actions"><button type="button" class="kp-button kp-secret__reveal" tabindex="-1">Hide</button><button type="button" class="kp-button kp-copyable__button kp-secret__copy" tabindex="-1">Copy</button></div>
                    <p class="kp-secret__line"><span class="kp-secret__drain pg-drain-still" aria-hidden="true"></span><span class="kp-secret__words">Hides in 10 s</span></p>
                </div>
                <p class="pg-under">Webhook URL · the next row of the form</p>
            </div>`;
/** The live field: Reveal shows the token for 10 s; the line under it says how far the row below moved. */
export const secretNow = (id) => `<div class="pg-secret-row">
                <div class="kp-secret" id="${id}" data-kp-secret data-kp-secret-ttl="10" data-kp-secret-label="API token" data-kp-secret-value="${TOKEN}"></div>
                <p class="pg-under" id="${id}-under">Webhook URL · the next row of the form</p>
            </div>`;

// ---------------------------------------------------------------- the touch stage: every small part on one form grid
const chip = ([value, label, count, on]) =>
    `<button type="button" class="kp-segmented__item" data-value="${value}" role="radio" aria-checked="${on ? 'true' : 'false'}"><span class="kp-segmented__label">${label}</span><span class="kp-segmented__count">${count}</span></button>`;
const row = (label, control, forId = '') =>
    `<div class="kp-formgrid__row">${forId ? `<label class="kp-formgrid__label" for="${forId}">${label}</label>` : `<p class="kp-formgrid__label">${label}</p>`}<div class="kp-formgrid__control">${control}</div></div>`;
const choices = (name, items) =>
    items.map(([value, words, on]) => `<label class="kp-field__option"><input class="kp-field__check" type="radio" name="${name}" value="${value}"${on ? ' checked' : ''} /><span>${words}</span></label>`).join('');

/** The form: chips, a switch, a check box, radios, a quantity, a text field, a select and a time field (Medicine Cabinet's words). */
export const touchForm = (p) => `<div class="kp-formgrid" aria-label="Touch targets">
                ${row('Show', `<div class="kp-segmented kp-segmented--chips" data-kp-segmented="single" aria-label="Show">${[['all', 'All', 14, true], ['due', 'Due today', 3], ['low', 'Low stock', 1]].map(chip).join('')}</div>`)}
                ${row('Night alarms', `<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked /><span class="kp-switch__state" aria-hidden="true"></span><span>Ring between 22:00 and 07:00</span></label>`)}
                ${row('Reminder', `<div class="kp-field kp-field--check"><input class="kp-field__check" type="checkbox" id="${p}-remind" checked /><label class="kp-field__label" for="${p}-remind">Remind me when stock is low</label></div>`)}
                ${row('Taken', `<fieldset class="kp-fieldset" aria-label="Taken">${choices(`${p}-taken`, [['meal', 'With a meal', true], ['empty', 'On an empty stomach']])}</fieldset>`)}
                ${row('Tablets', `<div class="kp-quantity" data-kp-quantity data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Tablets of Ibuprofen 400 mg"><input class="kp-quantity__input" value="14" /></div>`)}
                ${row('Name', `<input class="kp-field__input" id="${p}-name" value="Ibuprofen 400 mg" />`, `${p}-name`)}
                ${row('Shelf', `<select class="kp-field__input" id="${p}-shelf"><option>Bathroom cabinet</option><option>Kitchen drawer</option></select>`, `${p}-shelf`)}
                ${row('Take at', `<div class="kp-time" data-kp-time data-kp-time-id="${p}-at" data-kp-name="at" data-kp-value="08:00"></div>`, `${p}-at`)}
            </div>`;

/** Uptime (http-switchboard's profiles), a table with name links and a list with a name link (Medicine Cabinet), a still dialog's ✕. */
export const touchData = (p) => `<div class="kp-uptime" id="${p}-uptime" data-kp-uptime data-kp-uptime-label="jellyfin" data-kp-uptime-count="48"></div>
            <div class="kp-table-wrap"><table class="kp-table" aria-label="Medicines"><thead><tr><th scope="col">Name</th><th scope="col">Stock</th></tr></thead><tbody>
                <tr><td><a href="#${p}-ibu">Ibuprofen 400 mg</a></td><td>14 tablets</td></tr>
                <tr><td><a href="#${p}-para">Paracetamol 500 mg</a></td><td>32 tablets</td></tr>
                <tr><td><a href="#${p}-cet">Cetirizine 10 mg</a></td><td>0 tablets</td></tr>
            </tbody></table></div>
            <ul class="kp-list" aria-label="Cabinet"><li class="kp-listrow"><div class="kp-listrow__identity"><a class="kp-listrow__name" href="#${p}-ibu">Ibuprofen 400 mg</a><span class="kp-listrow__meta">Film-coated tablet · pain and fever</span></div></li></ul>
            <div class="kp-dialog pg-dialog-still" role="group" aria-label="Add stock, held open"><h3 class="kp-dialog__title">Add stock</h3><p class="kp-dialog__description">Ibuprofen 400 mg: how many tablets came in?</p><button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close">×</button></div>`;

// ---------------------------------------------------------------- the documentation site on a phone
/**
 * One documentation page in a phone-sized window of its own; demo.js loads it once this page has loaded (a window that loads with
 * the page holds the page's own load back, and the review dialog lays a step out on that load) and opens and closes its menu.
 */
export const docsPhone = (id) => `<div class="pg-phone"><iframe id="${id}" class="pg-phone__screen" title="The Badge page of the documentation, 390 px wide" data-pg-src="../../site/components/badge.html"></iframe></div>`;
