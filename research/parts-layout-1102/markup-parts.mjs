// research/parts-layout-1102: the markup of the four new parts, written once from the apps' own data: Kitchen's bar and Medicine
// Cabinet's bar, Homelab's Inbox with "Snooze until", Homelab's Overview cards, Kitchen's two wheels. Names are mock.

// ---------------------------------------------------------------- Kitchen: five daily places, six pages always behind More
const KITCHEN_DAILY = [
    ['today', 'Today', ''],
    ['week', 'Week', ''],
    ['shopping', 'Shopping list', '<span class="kp-badge">7</span>'],
    ['recipes', 'Recipes', ''],
    ['pantry', 'Pantry', ''],
];
const KITCHEN_MORE = [
    ['wheel', 'Wheel', 'More', 'Spin for tonight&rsquo;s dinner'],
    ['timers', 'Timers', 'More', 'Timers that ring on every screen'],
    ['stock', 'Freezer stock', 'More', 'What is frozen, and since when'],
    ['menus', 'Saved menus', 'More', 'Weeks you planned before'],
    ['members', 'Household', 'Settings', 'Who eats with you, and what they avoid'],
    ['settings', 'Settings', 'Settings', 'Units, language and the theme'],
];

const kitchenLink = ([key, words, badge]) =>
    `<li><a class="kp-nav__link" href="#kitchen-${key}" data-pg-page="${key}"${key === 'today' ? ' aria-current="page"' : ''}>${words}${badge ? ` ${badge}` : ''}</a></li>`;
const kitchenPinned = ([key, words, group, hint]) =>
    `<li data-kp-nav-more="${group}" data-kp-nav-hint="${hint}"><a class="kp-nav__link" href="#kitchen-${key}" data-pg-page="${key}">${words}</a></li>`;

/** Kitchen's bar: the daily five in the bar, six pages pinned behind More (four in no group, two under Settings). */
export const kitchenBar = `<div class="kp-nav-wrap">
                <nav class="kp-nav" id="pg-kitchen-nav" data-kp-nav-fold aria-label="Kitchen">
                    <span class="kp-nav__brand">Kitchen</span>
                    <button type="button" data-kp-nav-toggle class="kp-nav__toggle"></button>
                    <ul class="kp-nav__links">${KITCHEN_DAILY.map(kitchenLink).join('')}${KITCHEN_MORE.map(kitchenPinned).join('')}</ul>
                </nav>
            </div>`;

/** Medicine Cabinet's bar: three links and "Stock", a menu button that is one of the bar's links. */
export const cabinetBar = `<div class="kp-nav-wrap">
                <nav class="kp-nav" id="pg-cabinet-nav" aria-label="Medicine Cabinet">
                    <span class="kp-nav__brand">Medicine Cabinet</span>
                    <button type="button" data-kp-nav-toggle class="kp-nav__toggle"></button>
                    <ul class="kp-nav__links">
                        <li><a class="kp-nav__link" href="#cabinet-overview" data-pg-page="overview" aria-current="page">Overview</a></li>
                        <li><a class="kp-nav__link" href="#cabinet-schedule" data-pg-page="schedule">Schedule</a></li>
                        <li><div class="kp-menu-button" data-kp-menu-button id="pg-stock-menu"><button type="button" class="kp-nav__link kp-nav__disclosure">Stock</button><div class="kp-menu kp-menu--rich" role="menu" aria-label="Stock"></div></div></li>
                        <li><a class="kp-nav__link" href="#cabinet-history" data-pg-page="history">History</a></li>
                    </ul>
                </nav>
            </div>`;

// ---------------------------------------------------------------- Homelab: the Inbox, "Snooze until" a day and a time
const ALERTS = [
    ['nas', 'Backup of nas-01 failed', '02/11/2026 03:12'],
    ['cert', 'The certificate of media.home ends in 9 days', '01/11/2026 22:40'],
];

const snoozeForm = (key, title) => `<div class="kp-popover-form" data-kp-popover-form id="pg-snooze-${key}" data-pg-name="${title}">
                        <button type="button" class="kp-button kp-button--sm">Snooze until&hellip;</button>
                        <form class="kp-menu kp-popover-form__panel" aria-label="Snooze ${title}">
                            <p class="kp-popover-form__label">Snooze until</p>
                            <div class="kp-popover-form__pair">
                                <div class="kp-popover-form__field">
                                    <label class="kp-popover-form__label" for="pg-snooze-${key}-day">Day</label>
                                    <div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-11-02" data-kp-max="2026-11-30">
                                        <input class="kp-field__input" id="pg-snooze-${key}-day" name="day" type="text" inputmode="numeric" value="03/11/2026" data-kp-date-input required />
                                        <button type="button" class="kp-icon-button" data-kp-date-open aria-label="Open the calendar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg></button>
                                        <div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
                                    </div>
                                </div>
                                <div class="kp-popover-form__field">
                                    <label class="kp-popover-form__label" id="pg-snooze-${key}-time-l" for="pg-snooze-${key}-time">Time</label>
                                    <div data-kp-time data-kp-name="time" data-kp-value="09:00" data-kp-time-step="15" data-kp-time-id="pg-snooze-${key}-time" data-kp-time-required aria-labelledby="pg-snooze-${key}-time-l"></div>
                                </div>
                            </div>
                            <p class="kp-popover-form__hint">Brussels time. The alert comes back to the Inbox then.</p>
                            <p class="kp-popover-form__problem" role="alert"></p>
                            <button type="submit" class="kp-button kp-button--primary kp-popover-form__accept">Snooze</button>
                        </form>
                    </div>`;

const alertRow = ([key, title, when]) => `<div class="kp-formgrid__row">
                    <p class="kp-formgrid__label">${title}</p>
                    <div class="kp-formgrid__control kp-formgrid__fill"><span class="kp-badge" id="pg-alert-${key}">Needs you</span></div>
                    <p class="kp-formgrid__value">${when}</p>
                    <div class="kp-formgrid__actions">${snoozeForm(key, title)}</div>
                </div>`;

/** Homelab's Inbox: two alerts, each with "Snooze until…". */
export const inbox = `<div class="kp-formgrid" data-kp-formgrid-lines="lines" id="pg-inbox">${ALERTS.map(alertRow).join('')}</div>`;

// ---------------------------------------------------------------- Homelab: the Overview's small cards
const CARDS = [
    ['alerts', 'Open alerts', 'No open alerts', ['Backup of nas-01 failed', 'Disk of media-02 at 91 %']],
    ['updates', 'Pending updates', 'Everything is up to date', ['jellyfin 10.11.12', 'traefik 3.6.2', 'grafana 12.3.1']],
    ['restarts', 'Restarts today', 'Nothing restarted today', ['kyu at 04:10']],
];

const card = (look) => ([key, title, empty, items]) => `<article class="kp-card pg-small-card" aria-labelledby="pg-card-${look}-${key}">
                    <header class="kp-card__header"><h4 class="kp-card__title" id="pg-card-${look}-${key}">${title}</h4></header>
                    <div class="kp-card__body">
                        <p class="kp-empty" data-kp-empty="${look}" data-pg-attr="data-kp-empty" data-pg-empty><span class="kp-empty__icon" aria-hidden="true">&check;</span><span class="kp-empty__title">${empty}</span></p>
                        <ul class="pg-card-list" data-pg-items hidden>${items.map((i) => `<li>${i}</li>`).join('')}</ul>
                    </div>
                </article>`;

/** Three Overview cards; `look` is the value of data-kp-empty. @param {string} look */
export const overviewCards = (look) => `<div class="pg-cards">${CARDS.map(card(look)).join('')}</div>`;

// ---------------------------------------------------------------- Kitchen: the main course and the side dish
/** Kitchen's two wheels, the side dish following the main course. */
export const kitchenWheels = `<div class="pg-wheels">
                <figure class="pg-wheel"><figcaption>Main course</figcaption><div class="kp-wheel" id="pg-wheel-main" data-kp-wheel data-kp-wheel-answer aria-label="Tonight&rsquo;s main course"></div></figure>
                <figure class="pg-wheel"><figcaption>Side dish, follows the main course</figcaption><div class="kp-wheel" id="pg-wheel-side" data-kp-wheel data-kp-wheel-answer data-kp-wheel-follows="pg-wheel-main" aria-label="Tonight&rsquo;s side dish"></div></figure>
            </div>`;
