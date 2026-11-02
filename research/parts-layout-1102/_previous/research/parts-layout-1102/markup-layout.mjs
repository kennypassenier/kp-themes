// research/parts-layout-1102: the markup of the four layout options, written once from the apps' own data: Almanac's Calendars
// table and its deliveries month, Medicine Cabinet's Medicines header, Almanac's Settings with its attention band. Names are mock.

// ---------------------------------------------------------------- Almanac: the Calendars table (cards on a phone)
const CALENDARS = [
    ['Family', 'Google Calendar', '02/11/2026 06:00', '214'],
    ['School', 'ICS feed', '02/11/2026 07:30', '38'],
    ['Football club', 'ICS feed', '01/11/2026 18:00', '12'],
    ['Bin collection', 'City of Ghent feed', '28/10/2026 06:00', '52'],
];

const calendarRow = ([name, source, last, events]) => `<tr>
                    <td data-label="Calendar"><strong>${name}</strong></td>
                    <td data-label="Source">${source}</td>
                    <td data-label="Last sync">${last}</td>
                    <td data-label="Events" class="kp-text-end">${events}</td>
                    <td data-kp-col="actions"><button type="button" class="kp-button kp-button--sm">Sync now</button></td>
                </tr>`;

/** The Calendars table; `cards` is the value of data-kp-cards. @param {string} id @param {string} cards */
export const calendarsTable = (id, cards) => `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-cards="${cards}" data-pg-attr="data-kp-cards" data-kp-page-size="25" data-kp-page-sizes="none">
                <div class="kp-table-wrap"><table class="kp-table"><caption>Calendars</caption>
                <thead><tr><th scope="col" data-kp-sort="text">Calendar</th><th scope="col" data-kp-sort="text">Source</th><th scope="col" data-kp-sort="text">Last sync</th><th scope="col" data-kp-sort="number" class="kp-text-end">Events</th><th scope="col" data-kp-col="actions"><span class="kp-sr-only">Actions</span></th></tr></thead>
                <tbody>${CALENDARS.map(calendarRow).join('')}</tbody></table></div>
                <div class="kp-empty" data-kp-datatable-empty hidden><p class="kp-empty__title">No calendars yet</p><p class="kp-empty__body">Add a calendar to start the deliveries.</p></div>
            </div>`;

// ---------------------------------------------------------------- Almanac: the deliveries month
/** The month of deliveries; `nav` is the value of data-kp-calendar-nav. @param {string} id @param {string} nav */
export const deliveriesMonth = (id, nav) =>
    `<section class="kp-calendar" id="${id}" data-kp-calendar data-kp-week-starts-on="1" data-kp-calendar-month="2026-10" data-kp-calendar-nav="${nav}" data-pg-attr="data-kp-calendar-nav" aria-label="Deliveries per day"></section>`;

// ---------------------------------------------------------------- Medicine Cabinet: the Medicines header
/** The Medicines page header; `actions` is the value of data-kp-header-actions. @param {string} actions */
export const medicinesHeader = (actions) => `<header class="kp-page-header" data-kp-header-actions="${actions}" data-pg-attr="data-kp-header-actions">
                <div class="kp-page-header__inner">
                    <div><h3 class="kp-page-header__title">Medicines</h3><p class="kp-page-header__description">Fourteen medicines in the cabinet: what is due today and what runs low.</p></div>
                    <div class="kp-page-header__actions"><button type="button" class="kp-button kp-button--primary">Add medicine</button><button type="button" class="kp-button">Import a list</button></div>
                </div>
            </header>`;

// ---------------------------------------------------------------- Almanac: Settings with its attention band
const ATTENTION = [
    ['critical', '!', 'Critical', 'The Google sign-in has expired', 'Family has not synced since 31/10/2026 06:00.', 'Sign in again'],
    ['warning', '!', 'Warning', 'The school feed answers slowly', 'Its last three syncs took more than 40 s.', 'Test the feed'],
];

const attentionItem = ([severity, icon, said, title, line, fix]) => `<div class="kp-alert kp-attention__item" role="alert" data-kp-severity="${severity}">
                        <span class="kp-attention__icon" aria-hidden="true">${icon}</span>
                        <div class="kp-attention__text"><strong><span class="kp-sr-only">${said}: </span>${title}</strong><span>${line}</span></div>
                        <div class="kp-attention__actions"><button type="button" class="kp-button kp-button--sm">${fix}</button></div>
                    </div>`;

/** Almanac's Settings rows with the band between them; `subgrid` adds data-kp-subgrid. @param {string} id @param {boolean} subgrid */
export const settingsWithBand = (id, subgrid) => `<div class="kp-formgrid" id="${id}">
                <div class="kp-formgrid__row">
                    <label class="kp-formgrid__label" for="${id}-account">Google account</label>
                    <div class="kp-formgrid__control"><input class="kp-field__input" id="${id}-account" value="family.calendar@example.org" readonly /></div>
                    <p class="kp-formgrid__value">Signed out</p>
                    <div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm">Sign out</button></div>
                </div>
                <div class="kp-attention" data-pg-band data-pg-attr="data-kp-subgrid"${subgrid ? ' data-kp-subgrid' : ''} aria-label="Needs you">
                    ${ATTENTION.map(attentionItem).join('')}
                </div>
                <div class="kp-formgrid__row">
                    <label class="kp-formgrid__label" for="${id}-feed">School feed</label>
                    <div class="kp-formgrid__control"><input class="kp-field__input" id="${id}-feed" value="https://school.example.org/calendar.ics" /></div>
                    <p class="kp-formgrid__value">every hour</p>
                    <div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm">Test</button></div>
                </div>
            </div>`;

