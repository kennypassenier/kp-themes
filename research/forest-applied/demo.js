// research/forest-applied: the page's own wiring, and only where the package
// leaves a step to the app. Every component is attached by js/auto.js, as an
// app gets it; this file writes the theme menu with the package's own
// themeMenuMarkup(), starts the tour, sets the table and the month busy and
// back through their handles, and stamps the arrivals again for a replay.
import { attachThemePickers, themeMenuMarkup } from '../../js/theme-picker.js';
import { THEMES } from '../../js/theme-registry.js';
import { startTour } from '../../js/tour.js';
import { playClose } from '../../js/motion.js';
import { dataTable } from '../../js/datatable.js';
import { setCalendarDays, setCalendarLegend, setCalendarState } from '../../js/calendar.js';
import { attachEffects, MEMO_PREFIX, REVEALS } from '../../js/effects.js';

const root = document.documentElement;

/* ------------------------------------------------------------ motion note */

const still = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-fa-motion]');
const sayMotion = () => {
    if (motionNote) motionNote.hidden = !still.matches;
};
sayMotion();
still.addEventListener('change', sayMotion);

/** Resolves once js/auto.js has attached every module the page needs. */
const attached = new Promise((resolve) => {
    if (root.hasAttribute('data-kp-auto-ready')) return resolve(undefined);
    const watch = new MutationObserver(() => {
        if (!root.hasAttribute('data-kp-auto-ready')) return;
        watch.disconnect();
        resolve(undefined);
    });
    watch.observe(root, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/** Mark one button of a group pressed. @param {Element} group @param {Element} on */
const press = (group, on) => {
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === on));
};

/* ------------------------------------------------------------ theme menu */

// The menu as a consumer writes it (themeMenuMarkup()) and attached as one is
// (attachThemePickers()), without storing a choice. A choice is caught before
// the picker hears it: this page judges forest and stays forest.
const themeSaid = document.querySelector('[data-fa-theme-said]');
/** @param {string} name */
const sayTheme = (name) => {
    const label = THEMES.find((t) => t.name === name)?.label ?? name;
    if (themeSaid) themeSaid.textContent = `${label} chosen; this page stays in forest.`;
};
const themeHost = document.querySelector('[data-fa-theme-menu]');
if (themeHost) {
    themeHost.innerHTML = themeMenuMarkup({ id: 'fa-theme-menu' });
    attachThemePickers(themeHost, { persist: false });
    themeHost.addEventListener(
        'click',
        (event) => {
            const option = event.target instanceof Element ? event.target.closest('[data-kp-theme]') : null;
            if (!option) return;
            event.stopPropagation();
            sayTheme(option.getAttribute('data-kp-theme') ?? '');
            const popover = /** @type {HTMLElement | null} */ (option.closest('[popover]'));
            if (popover?.matches(':popover-open')) popover.hidePopover();
        },
        true,
    );
}

// The React shape (components/theme-switcher.jsx): the list is rendered while
// open and unmounted when closed, as React does.
const react = document.querySelector('[data-fa-react]');
if (react) {
    const button = /** @type {HTMLButtonElement} */ (react.querySelector('button'));
    const check =
        '<svg class="kp-theme-option__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
    /** @param {import('../../js/theme-registry.js').ThemeRecord} t */
    const option = (t) => {
        const on = t.name === 'forest';
        return (
            `<li role="option" data-kp-theme="${t.name}" data-selected="${on}" aria-selected="${on}" tabindex="${on ? 0 : -1}">` +
            `<span class="kp-swatch" data-theme="${t.name}"></span><span class="kp-theme-option__label">${t.label}</span>${on ? check : ''}</li>`
        );
    };
    /** @param {string} kind @param {string} heading @param {boolean} dark */
    const group = (kind, heading, dark) =>
        `<li role="presentation" class="kp-theme-group" data-kp-theme-group="${kind}">` +
        `<span class="kp-theme-group__label" aria-hidden="true">${heading}</span>` +
        `<ul role="group" class="kp-theme-group__list" aria-label="${heading}">${THEMES.filter((t) => t.dark === dark)
            .map(option)
            .join('')}</ul></li>`;
    /** @type {HTMLElement | null} */
    let list = null;
    const close = () => {
        if (!list) return;
        const target = list;
        list = null;
        button.setAttribute('aria-expanded', 'false');
        void playClose(target).then(() => {
            target.remove();
        });
    };
    const open = () => {
        list = document.createElement('div');
        list.className = 'kp-popover kp-theme-menu__list';
        list.innerHTML = `<ul role="listbox" aria-label="Choose a theme" class="kp-menu">${group('light', 'Light', false)}${group('dark', 'Dark', true)}</ul>`;
        react.append(list);
        button.setAttribute('aria-expanded', 'true');
        /** @type {HTMLElement | null} */ (list.querySelector('[aria-selected="true"]'))?.focus({ preventScroll: true });
    };
    button.addEventListener('click', () => (list ? close() : open()));
    react.addEventListener('click', (event) => {
        const picked = event.target instanceof Element ? event.target.closest('[role="option"]') : null;
        if (!picked) return;
        sayTheme(picked.getAttribute('data-kp-theme') ?? '');
        close();
        button.focus();
    });
    react.addEventListener('keydown', (event) => {
        if (!list) return;
        if (event.key === 'Escape') {
            close();
            button.focus();
            return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        const options = /** @type {HTMLElement[]} */ ([...list.querySelectorAll('[role="option"]')]);
        const at = options.indexOf(/** @type {HTMLElement} */ (document.activeElement));
        const next = options[Math.min(options.length - 1, Math.max(0, at + (event.key === 'ArrowDown' ? 1 : -1)))];
        next?.focus();
        event.preventDefault();
    });
    document.addEventListener('click', (event) => {
        if (list && event.target instanceof Node && !react.contains(event.target)) close();
    });
}

/* ------------------------------------------------------------------ tour */

document.querySelector('[data-fa-tour-start]')?.addEventListener('click', (event) => {
    startTour(
        [
            { target: '[data-fa-tour="actions"]', title: 'What you can do', text: 'Export the readings or plan a visit from here.' },
            { target: '[data-fa-tour="search"]', title: 'Find a pump house', text: 'By its name or its number.' },
            { target: '[data-fa-tour="note"]', title: 'Open incidents', text: 'What needs someone, and who is on it.' },
        ],
        { returnFocus: /** @type {HTMLElement} */ (event.currentTarget) },
    );
});

/* ----------------------------------------------------------------- table */

const tableGroup = document.querySelector('[data-fa-table]')?.closest('[role="group"]');
tableGroup?.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-fa-table]') : null;
    if (!button) return;
    await attached;
    const element = document.querySelector('[data-fa-dt]');
    const handle = element ? dataTable(element) : null;
    if (!handle) return;
    press(tableGroup, button);
    if (button.getAttribute('data-fa-table') === 'busy') {
        handle.busy({ text: 'Asking the pump houses…', overlay: true });
        handle.state('loading');
    } else {
        handle.state('ready');
        handle.busy(null);
    }
});

/* -------------------------------------------------------------- calendar */

/** @type {{ tone: import('../../js/calendar.js').CalendarTone, label: string }[]} */
const LEGEND = [
    { tone: 'ok', label: 'Every service backed up' },
    { tone: 'warn', label: 'Some missing' },
    { tone: 'bad', label: 'None backed up' },
    { tone: 'future', label: 'Still to come' },
    { tone: 'before', label: 'Before the first backup' },
];

/** Nine services, backed up each night since 1 August; the same answer on every load. */
const nights = () => {
    /** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
    const days = {};
    for (let t = Date.UTC(2026, 6, 20, 12); t <= Date.UTC(2026, 9, 9, 12); t += 86_400_000) {
        const iso = new Date(t).toISOString().slice(0, 10);
        if (iso < '2026-08-01') {
            days[iso] = { tone: 'before', label: 'before the first backup was kept' };
            continue;
        }
        const day = Number(iso.slice(8));
        const done = iso === '2026-09-17' ? 0 : day % 11 === 3 ? 7 : 9;
        days[iso] = {
            tone: done === 9 ? 'ok' : done === 0 ? 'bad' : 'warn',
            count: `${done}/9`,
            label: `${done} of 9 services backed up`,
        };
    }
    return days;
};

const calendars = [...document.querySelectorAll('#calendar [data-kp-calendar]')];
attached.then(() => {
    for (const calendar of calendars) {
        setCalendarLegend(calendar, LEGEND);
        setCalendarDays(calendar, nights());
    }
});
const calendarGroup = document.querySelector('[data-fa-calendar]')?.closest('[role="group"]');
calendarGroup?.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-fa-calendar]') : null;
    if (!button) return;
    await attached;
    press(calendarGroup, button);
    const loading = button.getAttribute('data-fa-calendar') === 'loading';
    for (const calendar of calendars) {
        if (loading) setCalendarState(calendar, 'loading', 'Reading the backups of 9 services: 4 of 9 read.');
        else {
            setCalendarState(calendar, 'ready');
            setCalendarDays(calendar, nights());
        }
    }
});

const calShapeGroup = document.querySelector('[data-fa-cal-shapes]');
const calStage = document.querySelector('[data-fa-calendar-stage]');
const setCalShape = (shape) => {
    if (!calStage || !shape) return;
    calStage.setAttribute('data-cal-shape', shape);
    if (calShapeGroup) {
        for (const btn of calShapeGroup.querySelectorAll('[data-fa-shape]')) {
            btn.setAttribute('aria-pressed', String(btn.getAttribute('data-fa-shape') === shape));
        }
    }
};

calShapeGroup?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-fa-shape]') : null;
    if (!button) return;
    const shape = button.getAttribute('data-fa-shape');
    if (shape) setCalShape(shape);
});

document.querySelector('#calendar')?.addEventListener('review:choice', (/** @type {any} */ event) => {
    if (event.detail?.id === 'shape' && event.detail?.value) {
        setCalShape(event.detail.value);
    }
});

/* ------------------------------------------------- arrivals, played again */

/** A copy of the host's template, in place of the last one. @param {Element | null} host */
const stamp = (host) => {
    const template = host?.querySelector(':scope > template');
    if (!host || !(template instanceof HTMLTemplateElement)) return null;
    host.querySelector(':scope > [data-fa-copy]')?.remove();
    const copy = document.createElement('div');
    copy.setAttribute('data-fa-copy', '');
    copy.className = host.matches('[data-fa-replay-host]') ? 'fa-stack fa-stack--tight' : 'fa-stack';
    copy.append(template.content.cloneNode(true));
    template.after(copy);
    return copy;
};

/** A reveal plays every time it is stamped, not once per session (as the catalogue's live copies do). */
const forgetReveals = () => {
    try {
        const reveal = new RegExp(`^${MEMO_PREFIX}.*?:(${REVEALS.join('|')}):`);
        for (const key of Object.keys(sessionStorage)) if (reveal.test(key)) sessionStorage.removeItem(key);
    } catch {
        /* no storage: nothing is remembered, so everything plays */
    }
};

/** @type {{ detach: () => void } | null} */
let reveals = null;
const playProse = () => {
    reveals?.detach();
    forgetReveals();
    const copy = stamp(document.querySelector('[data-fa-reveal-host]'));
    if (copy) reveals = attachEffects(copy, { manageRoot: false });
    stamp(document.querySelector('[data-fa-replay-host]'));
};
playProse();

const proseGroup = document.querySelector('[data-fa-prose]')?.closest('[role="group"]');
proseGroup?.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-fa-prose]') : null;
    if (!button) return;
    const what = button.getAttribute('data-fa-prose');
    if (what === 'replay') playProse();
    else if (what === 'dir') {
        const host = document.querySelector('[data-fa-dir]');
        const rtl = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(rtl));
        if (rtl) host?.setAttribute('dir', 'rtl');
        else host?.removeAttribute('dir');
        playProse();
    } else if (what === 'top') {
        const top = document.querySelector('[data-fa-to-top]');
        const shown = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(shown));
        top?.toggleAttribute('data-kp-to-top-shown', shown);
    }
});

/* --------------------------------------------------------------- loading */

const loadingHost = document.querySelector('[data-fa-loading-host]');
stamp(loadingHost);
document.querySelector('[data-fa-loading="restart"]')?.addEventListener('click', () => stamp(loadingHost));

/* ------------------------------------------------- anchor positioning fallback */

const faMenuBtn = document.querySelector('[popovertarget="fa-menu"]');
const faMenuPop = document.querySelector('#fa-menu');
if (faMenuBtn && faMenuPop) {
    const positionFaMenu = () => {
        if (CSS.supports && CSS.supports('position-anchor: --fa-menu')) return;
        const rect = faMenuBtn.getBoundingClientRect();
        faMenuPop.style.position = 'fixed';
        faMenuPop.style.left = `${Math.round(rect.left)}px`;
        faMenuPop.style.top = `${Math.round(rect.bottom + 4)}px`;
        faMenuPop.style.margin = '0';
    };
    faMenuPop.addEventListener('toggle', (event) => {
        if (/** @type {ToggleEvent} */ (event).newState === 'open') {
            positionFaMenu();
        }
    });
    window.addEventListener('resize', () => {
        if (faMenuPop.matches(':popover-open')) positionFaMenu();
    });
    window.addEventListener('scroll', () => {
        if (faMenuPop.matches(':popover-open')) positionFaMenu();
    }, { capture: true, passive: true });
}
