// The twenty-two themes as a Windows desktop: Windows Terminal, YASB,
// FireDragon (Firefox), Mica For Everyone, the accent colour, a wallpaper,
// and the shell inside WSL (Starship and fish).
//
// The pattern is the one ha/, vscode/ and tui/ already follow: a fixed
// vocabulary on the far side, our token names on the near side, no colour
// typed twice, and a `--check` that refuses a copy that has drifted from
// the tokens. Two sources are read, never re-derived:
//
//   css/themes.css           every token and derived state, via derivedBlock()
//   vscode/kp-*.json         the sixteen ANSI colours, so a terminal in VS
//                            Code and Windows Terminal show the same palette
//
// What is NOT generated lives beside the output and is hand-written:
// windows/apply.ps1 (puts a theme's files where each program reads them),
// windows/templates/ (the YASB layout the colours are poured into) and
// windows/wsl/ (the Arch-in-WSL bootstrap).
//
// Usage:
//   node gates/generate-windows.mjs           write windows/<theme>/
//   node gates/generate-windows.mjs --check   exit 1 if anything would change

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { themes } from './check-invariants.mjs';
import { derivedBlock, rgbOf } from './generate-tui-palette.mjs';

const ROOT = new URL('../', import.meta.url);
const OUT = new URL('../windows/', import.meta.url);
const VERSION = JSON.parse(readFileSync(new URL('package.json', ROOT), 'utf8')).version;
const YASB_TEMPLATE = readFileSync(new URL('windows/templates/yasb.css', ROOT), 'utf8');

/* ------------------------------------------------------------------ */
/* Colour helpers                                                      */
/* ------------------------------------------------------------------ */

/** @typedef {[number, number, number]} Rgb */

/** @param {Rgb} rgb */
const hex = ([r, g, b]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`.toUpperCase();

/** @param {string} value  #RRGGBB or #RRGGBBAA @returns {{rgb: Rgb, alpha: number}} */
function parseHex(value) {
    const m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(value);
    if (m === null) throw new Error(`not a hex colour: ${value}`);
    const n = Number.parseInt(m[1], 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: m[2] ? Number.parseInt(m[2], 16) / 255 : 1 };
}

/** A translucent colour laid over an opaque ground, as the eye sees it. @param {string} top @param {Rgb} ground @returns {Rgb} */
function over(top, ground) {
    const { rgb, alpha } = parseHex(top);
    return /** @type {Rgb} */ (rgb.map((c, i) => Math.round(c * alpha + ground[i] * (1 - alpha))));
}

/** @param {Rgb} rgb @param {number} a */
const rgba = ([r, g, b], a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/** Move towards white (amount > 0) or black (amount < 0), 0..1. @param {Rgb} rgb @param {number} amount @returns {Rgb} */
function shade(rgb, amount) {
    const target = amount > 0 ? 255 : 0;
    const t = Math.abs(amount);
    return /** @type {Rgb} */ (rgb.map((c) => Math.round(c + (target - c) * t)));
}

/* ------------------------------------------------------------------ */
/* The theme as the desktop sees it                                    */
/* ------------------------------------------------------------------ */

/**
 * The roles a desktop paints, each one token. The left side is ours to
 * name; the right side is the package's vocabulary.
 */
const ROLES = {
    ground: 'background', // the desktop, the terminal, the bar's glass
    deep: 'sidebar-background', // one step below the ground: tab rows, title bars
    ink: 'foreground',
    muted: 'muted-foreground',
    surface: 'card',
    raised: 'popover',
    hover: 'secondary-hover',
    line: 'border',
    lineStrong: 'border-strong',
    signal: 'primary', // Garuda's pink: the one colour that says "this is the theme"
    signalInk: 'primary-foreground',
    signalHover: 'primary-hover',
    accent: 'accent', // Garuda's cyan
    violet: 'chart-4', // the third meter colour
    ok: 'success-foreground',
    warn: 'warning-foreground',
    danger: 'destructive',
    heroInk: 'surface-hero-fg-2',
};

/**
 * @param {{name: string, tokens: Record<string, string>}} theme
 */
function load(theme) {
    const values = { ...theme.tokens, ...derivedBlock(theme.name) };
    /** @type {Record<keyof typeof ROLES, Rgb>} */
    const c = /** @type {any} */ ({});
    for (const [role, token] of Object.entries(ROLES)) {
        const value = values[token];
        if (value === undefined) throw new Error(`${theme.name}: --${token} is missing (role ${role})`);
        c[/** @type {keyof typeof ROLES} */ (role)] = rgbOf(value);
    }
    const raw = JSON.parse(readFileSync(new URL(`themes/${theme.name}/tokens.json`, ROOT), 'utf8'));
    const vscodePath = new URL(`vscode/kp-${theme.name}-color-theme.json`, ROOT);
    let vscode;
    try {
        vscode = JSON.parse(readFileSync(vscodePath, 'utf8')).colors;
    } catch {
        throw new Error(`${theme.name}: vscode/kp-${theme.name}-color-theme.json is missing. Run \`npm run generate:vscode\` first.`);
    }
    return {
        name: theme.name,
        label: raw.label ?? theme.name,
        dark: values['color-scheme'] === 'dark',
        shape: shapeOf(values),
        c,
        vscode,
    };
}

/**
 * The theme's geometry, read from the same tokens the web register reads:
 * the corner radius, the notch cut into buttons and plates (0 when the theme
 * has none), and the first family of each font stack, which is the one the
 * theme is drawn in (windows/fonts/ carries it as TrueType).
 * @param {Record<string, string>} values
 */
function shapeOf(values) {
    /** A length in px; rem is 16px, the browser default the themes assume. @param {string | undefined} v */
    const px = (v) => {
        const m = /^(-?[\d.]+)(px|rem)?$/.exec(String(v ?? '0').trim());
        if (m === null) return 0;
        return Math.round(Number(m[1]) * (m[2] === 'rem' ? 16 : 1));
    };
    /** The first family of a CSS font stack. @param {string | undefined} stack */
    const first = (stack) =>
        String(stack ?? '')
            .split(',')[0]
            .trim()
            .replace(/^['"]|['"]$/g, '');
    return {
        radius: px(values.radius),
        notch: px(values['fx-notch']),
        body: first(values['theme-font-body']),
        display: first(values['theme-font-display']),
        mono: first(values['theme-font-mono']),
    };
}

/** @typedef {ReturnType<typeof load>} Desk */

/* ------------------------------------------------------------------ */
/* Windows Terminal                                                    */
/* ------------------------------------------------------------------ */

const ANSI = [
    ['black', 'Black'],
    ['red', 'Red'],
    ['green', 'Green'],
    ['yellow', 'Yellow'],
    ['blue', 'Blue'],
    ['purple', 'Magenta'],
    ['cyan', 'Cyan'],
    ['white', 'White'],
];

/** @param {Desk} d */
function terminal(d) {
    const v = d.vscode;
    const ground = parseHex(v['terminal.background']).rgb;
    /** @type {Record<string, string>} */
    const scheme = {
        name: `KP ${d.label}`,
        background: hex(ground),
        foreground: hex(parseHex(v['terminal.foreground']).rgb),
        cursorColor: hex(parseHex(v['terminalCursor.foreground']).rgb),
        // Windows Terminal takes no alpha here: lay it over the ground.
        selectionBackground: hex(over(v['terminal.selectionBackground'], ground)),
    };
    for (const [wt, code] of ANSI) {
        scheme[wt] = hex(parseHex(v[`terminal.ansi${code}`]).rgb);
        scheme[`bright${wt[0].toUpperCase()}${wt.slice(1)}`] = hex(parseHex(v[`terminal.ansiBright${code}`]).rgb);
    }
    const { c } = d;
    // The window around the scheme: tab row one step below the ground,
    // the selected tab on the ground itself, so the tab reads as a
    // continuation of the terminal under it.
    const theme = {
        name: `KP ${d.label}`,
        tab: {
            background: `${hex(c.ground)}FF`,
            unfocusedBackground: `${hex(c.deep)}FF`,
            showCloseButton: 'hover',
            iconStyle: 'default',
        },
        tabRow: { background: `${hex(c.deep)}FF`, unfocusedBackground: `${hex(c.deep)}FF` },
        window: {
            applicationTheme: d.dark ? 'dark' : 'light',
            useMica: false,
            rainbowFrame: false,
            frame: `${hex(c.signal)}FF`,
            unfocusedFrame: `${hex(c.line)}FF`,
        },
    };
    return { $generated: `kp-themes ${VERSION} (gates/generate-windows.mjs). Do not edit.`, scheme, theme };
}

/* ------------------------------------------------------------------ */
/* YASB                                                                */
/* ------------------------------------------------------------------ */

/** @param {Desk} d */
function yasb(d) {
    const { c } = d;
    // Ink at an alpha is how the wizard's "white-alpha" steps were meant:
    // on a dark theme it is white, on a light theme the dark ink, so the
    // same layout reads on both.
    const alphas = [3, 4, 5, 6, 7, 8, 10, 15, 20, 30, 40, 70, 80, 85];
    const lines = [
        ':root {',
        `    --yasb-bar-bg: ${rgba(c.ground, 0.8)};`,
        `    --yasb-surface-alt: ${rgba(c.hover, 1)};`,
        `    --yasb-bar-border: ${hex(c.line)};`,
        `    --yasb-popup-bg: ${rgba(c.raised, 0.92)};`,
        `    --yasb-dialog-bg: ${rgba(c.surface, 1)};`,
        `    --yasb-dialog-surface: ${rgba(c.ground, 1)};`,
        ...alphas.map((a) => `    --yasb-white-alpha-${String(a).padStart(2, '0')}: ${rgba(c.ink, a / 100)};`),
        `    --yasb-fg: ${hex(c.ink)};`,
        `    --yasb-fg-muted: ${hex(c.muted)};`,
        `    --yasb-icon-fg: ${hex(c.signal)};`,
        `    --yasb-tooltip-bg: ${rgba(c.raised, 0.96)};`,
        `    --yasb-tooltip-border: ${hex(c.lineStrong)};`,
        `    --yasb-accent: ${hex(c.signal)};`,
        `    --yasb-accent-hover: ${hex(c.signalHover)};`,
        `    --yasb-accent-fg: ${hex(c.signalInk)};`,
        '    --icons-font: "Segoe Fluent Icons";',
        '    --icons-font-fallback: "JetBrainsMono NFP", "JetBrainsMono Nerd Font Propo";',
        `    --system-font: "${d.shape.body}", "JetBrainsMono NFP", "JetBrainsMono Nerd Font Propo", "Segoe UI Variable", "Segoe UI";`,
        `    --kp-font-mono: "${d.shape.mono}", "JetBrainsMono NFP", "Consolas";`,
        `    --kp-font-display: "${d.shape.display}", "${d.shape.body}", "Segoe UI";`,
        '    --nerd-font: "JetBrainsMono NFP", "JetBrainsMono Nerd Font Propo";',
        `    --kp-signal: ${hex(c.signal)};`,
        `    --kp-signal-wash: ${rgba(c.signal, 0.18)};`,
        `    --kp-signal-edge: ${rgba(c.signal, 0.35)};`,
        `    --kp-accent: ${hex(c.accent)};`,
        `    --kp-violet: ${hex(c.violet)};`,
        `    --kp-ok: ${hex(c.ok)};`,
        `    --kp-warn: ${hex(c.warn)};`,
        `    --kp-strong: ${hex(shade(c.ink, d.dark ? 0.6 : -0.6))};`,
        '}',
    ];
    return (
        YASB_TEMPLATE.replace('{{root}}', lines.join('\n'))
            .replace('{{label}}', d.label)
            .replace('{{name}}', d.name)
            .replace('{{version}}', VERSION) + yasbShape(d)
    );
}

/**
 * The theme's shape in Qt's stylesheet dialect, appended after the colours.
 * Qt has no clip-path, so a notch is drawn the way Qt can: a diagonal
 * gradient that stops short of the corner. It has no text-transform or
 * letter-spacing either, so the shouting capitals stay in the web register.
 * @param {Desk} d
 */
function yasbShape(d) {
    const { c, shape } = d;
    const notched = shape.notch > 0 && shape.radius === 0;
    // A notch as a gradient: solid to 84 % of the diagonal, then nothing.
    const plate = (/** @type {Rgb} */ rgb) =>
        notched ? `qlineargradient(x1:0, y1:0, x2:1, y2:1, stop:0 ${hex(rgb)}, stop:0.84 ${hex(rgb)}, stop:0.841 transparent)` : hex(rgb);
    const edge = (/** @type {Rgb} */ rgb) => (notched ? `border-left: 3px solid ${hex(rgb)};` : '');
    const r = `${shape.radius}px`;
    return `
/* ------------------------------------------------------------------ */
/* Shape: KP ${d.label}                                                  */
/* radius ${shape.radius}px, notch ${shape.notch}px, ${shape.body} / ${shape.mono} / ${shape.display}      */
/* ------------------------------------------------------------------ */

.widget {
    border-radius: ${r};
    background-color: ${rgba(c.surface, 0.9)};
    border: 1px solid ${rgba(c.signal, 0.22)};
    margin: 5px 2px;
}
.widget .label {
    font-family: var(--kp-font-mono);
    font-size: 13px;
}
.active-window-widget .label {
    font-family: var(--system-font);
    font-size: 13px;
    font-weight: 600;
}
.clock-widget .label {
    font-family: var(--kp-font-display);
    font-size: 15px;
    font-weight: 800;
    color: ${hex(c.ink)};
}

/* Every meter a plate with its own ink on the left edge. */
.cpu-widget { ${edge(c.ok)} }
.memory-widget { ${edge(c.warn)} }
.clock-widget { ${edge(c.accent)} }
.volume-widget { ${edge(c.accent)} }
.notifications-widget { ${edge(c.violet)} }

/* The one primary action: the signal as a plate, ink on it${notched ? ', the corner cut' : ''}. */
.home-widget {
    background: ${plate(c.signal)};
    border: none;
    border-radius: ${r};
    padding: 0 16px 0 10px;
}
.home-widget .icon {
    color: ${hex(c.signalInk)};
}
.home-widget:hover {
    background: ${plate(c.signalHover)};
}
.home-widget:hover .icon {
    color: ${hex(c.signalInk)};
}

/* The rest are void faces framed in the signal. */
.power-menu-widget {
    background-color: ${hex(c.ground)};
    border: 1px solid ${hex(c.signal)};
    border-radius: ${r};
}

.widget:hover,
.quick-launch-widget:hover,
.volume-widget:hover,
.power-menu-widget:hover {
    background-color: ${rgba(c.signal, 0.12)};
}

.home-menu,
.systray-popup,
.audio-menu,
.context-menu,
.clock-popup.calendar,
.power-menu-compact,
.quick-launch-popup .container {
    border-radius: ${r};
}
.context-menu::item,
.home-menu .menu-item,
.clock-popup.calendar .calendar-table::item:selected {
    border-radius: ${r};
}
.tooltip {
    border-radius: ${r};
    border: 1px solid ${hex(c.accent)};
    font-family: var(--kp-font-mono);
}
`;
}

/* ------------------------------------------------------------------ */
/* FireDragon / Firefox                                                */
/* ------------------------------------------------------------------ */

/** @param {Desk} d */
function userChrome(d) {
    const { c } = d;
    return `/* GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) — KP ${d.label}. Do not edit.
   Needs toolkit.legacyUserProfileCustomizations.stylesheets = true (windows/firedragon-user.js). */

:root {
    --kp-ground: ${hex(c.ground)};
    --kp-deep: ${hex(c.deep)};
    --kp-surface: ${hex(c.surface)};
    --kp-raised: ${hex(c.raised)};
    --kp-hover: ${hex(c.hover)};
    --kp-ink: ${hex(c.ink)};
    --kp-muted: ${hex(c.muted)};
    --kp-line: ${hex(c.line)};
    --kp-signal: ${hex(c.signal)};
    --kp-signal-ink: ${hex(c.signalInk)};
    --kp-accent: ${hex(c.accent)};

    --lwt-accent-color: var(--kp-deep) !important;
    --lwt-inactive-accent-color: var(--kp-deep) !important;
    --lwt-text-color: var(--kp-ink) !important;
    --toolbar-bgcolor: var(--kp-ground) !important;
    --toolbar-color: var(--kp-ink) !important;
    --toolbar-field-background-color: var(--kp-surface) !important;
    --toolbar-field-color: var(--kp-ink) !important;
    --toolbar-field-border-color: var(--kp-line) !important;
    --toolbar-field-focus-background-color: var(--kp-raised) !important;
    --toolbar-field-focus-color: var(--kp-ink) !important;
    --toolbar-field-focus-border-color: var(--kp-accent) !important;
    --tab-selected-bgcolor: var(--kp-ground) !important;
    --tab-selected-textcolor: var(--kp-ink) !important;
    --tab-hover-background-color: var(--kp-hover) !important;
    --tab-loading-fill: var(--kp-signal) !important;
    --arrowpanel-background: var(--kp-raised) !important;
    --arrowpanel-color: var(--kp-ink) !important;
    --arrowpanel-border-color: var(--kp-line) !important;
    --panel-separator-color: var(--kp-line) !important;
    --urlbarView-highlight-background: var(--kp-signal) !important;
    --urlbarView-highlight-color: var(--kp-signal-ink) !important;
    --focus-outline-color: var(--kp-accent) !important;
    --button-primary-bgcolor: var(--kp-signal) !important;
    --button-primary-color: var(--kp-signal-ink) !important;
    --sidebar-background-color: var(--kp-deep) !important;
    --sidebar-text-color: var(--kp-ink) !important;
    --chrome-content-separator-color: var(--kp-line) !important;
}

#navigator-toolbox {
    background-color: var(--kp-deep) !important;
    border-bottom: 1px solid var(--kp-line) !important;
}

/* The selected tab carries the signal colour as a hairline, the way the bar does. */
.tab-background[selected] {
    background: var(--kp-ground) !important;
    box-shadow: inset 0 -2px 0 var(--kp-signal) !important;
}

#urlbar[focused] > #urlbar-background {
    outline: 1px solid var(--kp-accent) !important;
}

menupopup,
panel {
    --panel-background: var(--kp-raised) !important;
    --panel-color: var(--kp-ink) !important;
    --panel-border-color: var(--kp-line) !important;
}

/* Shape: radius ${d.shape.radius}px, notch ${d.shape.notch}px, ${d.shape.body} and ${d.shape.mono}. */
:root {
    --tab-border-radius: ${d.shape.radius}px !important;
    --toolbarbutton-border-radius: ${d.shape.radius}px !important;
    --arrowpanel-border-radius: ${d.shape.radius}px !important;
    --panel-border-radius: ${d.shape.radius}px !important;
    --urlbar-icon-border-radius: ${d.shape.radius}px !important;
    --toolbar-field-border-radius: ${d.shape.radius}px !important;
}
.tab-label {
    font-family: "${d.shape.body}", system-ui !important;
    font-weight: 600 !important;
${d.shape.notch > 0 ? '    text-transform: uppercase !important;\n    letter-spacing: 0.08em !important;\n' : ''}}
#urlbar-input,
.urlbarView-row {
    font-family: "${d.shape.mono}", ui-monospace, monospace !important;
}
.tab-background,
#urlbar-background,
toolbarbutton .toolbarbutton-icon,
toolbarbutton .toolbarbutton-badge-stack,
menupopup,
panel {
    border-radius: ${d.shape.radius}px !important;
}
${
    d.shape.notch > 0
        ? `/* The notch: the selected tab and the address bar lose their bottom-right corner. */
.tab-background[selected],
#urlbar-background {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - ${Math.min(d.shape.notch, 10)}px), calc(100% - ${Math.min(d.shape.notch, 10)}px) 100%, 0 100%) !important;
}
`
        : ''
}`;
}

/** @param {Desk} d */
function userContent(d) {
    const { c } = d;
    return `/* GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) — KP ${d.label}. Do not edit. */

@-moz-document url("about:newtab"), url("about:home"), url("about:blank"), url("about:privatebrowsing") {
    :root, body {
        --newtab-background-color: ${hex(c.ground)} !important;
        --newtab-background-color-secondary: ${hex(c.surface)} !important;
        --newtab-text-primary-color: ${hex(c.ink)} !important;
        --newtab-primary-action-background: ${hex(c.signal)} !important;
        --in-content-page-background: ${hex(c.ground)} !important;
        background-color: ${hex(c.ground)} !important;
    }
}

@-moz-document url-prefix("about:") {
    :root {
        --in-content-page-background: ${hex(c.ground)} !important;
        --in-content-page-color: ${hex(c.ink)} !important;
        --in-content-box-background: ${hex(c.surface)} !important;
        --in-content-border-color: ${hex(c.line)} !important;
        --in-content-primary-button-background: ${hex(c.signal)} !important;
        --in-content-primary-button-text-color: ${hex(c.signalInk)} !important;
        --in-content-accent-color: ${hex(c.signal)} !important;
        --in-content-focus-outline-color: ${hex(c.accent)} !important;
    }
}
`;
}

/* ------------------------------------------------------------------ */
/* Windhawk: the shell's WinUI surfaces                                */
/* ------------------------------------------------------------------ */

/**
 * Windhawk's styler mods take a list of XAML targets and property
 * assignments. Every target below is one the styling guides document
 * (ramensoftware/windows-11-{file-explorer,taskbar,start-menu}-styling-guide);
 * nothing here hides or moves a control, so a theme changes colour only and
 * a Windows update that renames a control loses a colour, never a button.
 *
 * `Prop=value` sets a value, `Prop:=<Xaml/>` sets an object. Colours are
 * #RRGGBB or #AARRGGBB.
 *
 * @param {{target: string, styles: string[]}[]} rules
 * @param {string} title
 */
function yaml(title, rules) {
    let out = `# GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs). Do not edit.\n`;
    out += `# ${title}\n`;
    out += '# Paste into the mod\'s Settings tab in Windhawk, in "Textual mode", and save.\n';
    out += 'controlStyles:\n';
    for (const rule of rules) {
        out += `  - target: ${rule.target}\n    styles:\n`;
        for (const style of rule.styles) out += `      - ${JSON.stringify(style)}\n`;
    }
    return out;
}

/** #AARRGGBB, which is the order XAML reads. @param {Rgb} rgb @param {number} alpha 0..1 */
const argb = (rgb, alpha) =>
    `#${Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0')}${hex(rgb).slice(1)}`.toUpperCase();

/**
 * The two ways to name a colour in a style: the theme's own hex, or the
 * Windows accent colour, which accent.reg has already set from the same
 * token. The accent flavour makes one set of styles follow every theme,
 * so a theme switch is one command and no pasting.
 * @param {Desk | null} d
 */
function palette(d) {
    if (d === null) {
        return {
            ground: '{ThemeResource SystemAccentColorDark3}',
            deep: '{ThemeResource SystemAccentColorDark3}',
            raised: '{ThemeResource SystemAccentColorDark2}',
            hover: '{ThemeResource SystemAccentColorDark1}',
            signal: '{ThemeResource SystemAccentColor}',
            ink: '{ThemeResource SystemAccentColorLight3}',
            solid: (/** @type {string} */ role, /** @type {number} */ alpha) => `<SolidColorBrush Color="${role}" Opacity="${alpha}" />`,
        };
    }
    return {
        ground: hex(d.c.ground),
        deep: hex(d.c.deep),
        raised: hex(d.c.raised),
        hover: hex(d.c.hover),
        signal: hex(d.c.signal),
        ink: hex(d.c.ink),
        solid: (/** @type {string} */ role, /** @type {number} */ alpha) => `<SolidColorBrush Color="${role}" Opacity="${alpha}" />`,
    };
}

/** @param {Desk | null} d */
function windhawkExplorer(d) {
    const p = palette(d);
    const blur = (/** @type {string} */ colour, /** @type {number} */ opacity) =>
        `<WindhawkBlur BlurAmount="30" TintColor="${colour}" TintOpacity="${opacity}" />`;
    return yaml('Windows 11 File Explorer Styler — https://windhawk.net/mods/windows-11-file-explorer-styler', [
        { target: 'Grid#NavigationBarControlGrid', styles: [`Background:=${blur(p.deep, 0.75)}`] },
        {
            target: 'TabViewItem > Grid#LayoutRoot > Canvas > Microsoft.UI.Xaml.Shapes.Path#SelectedBackgroundPath',
            styles: [`Fill:=${p.solid(p.ground, 0.9)}`],
        },
        { target: 'Grid#TabContainer > ContentPresenter > StackPanel > TextBlock', styles: [`Foreground:=${p.solid(p.ink, 1)}`] },
        { target: 'Grid#DetailsViewControlRootGrid', styles: [`Background:=${blur(p.ground, 0.82)}`] },
        { target: 'StackPanel#DetailsViewThumbnail', styles: [`Background:=${p.solid(p.ground, 0)}`] },
        { target: 'Grid#HomeViewRootGrid', styles: [`Background:=${blur(p.ground, 0.82)}`] },
        {
            target: 'CommandBarOverflowPresenter#SecondaryItemsControl > Grid#LayoutRoot > Border',
            styles: [`BorderBrush:=${p.solid(p.signal, 0.55)}`, 'BorderThickness=1'],
        },
    ]);
}

/** @param {Desk | null} d */
function windhawkTaskbar(d) {
    const p = palette(d);
    return yaml('Windows 11 Taskbar Styler — https://windhawk.net/mods/windows-11-taskbar-styler', [
        {
            target: 'Taskbar.TaskbarFrame > Grid#RootGrid > Taskbar.TaskbarBackground > Grid > Rectangle#BackgroundFill',
            styles: [`Fill:=<WindhawkBlur BlurAmount="30" TintColor="${p.deep}" TintOpacity="0.72" />`],
        },
        { target: 'Taskbar.TaskListButton', styles: [`CornerRadius=${d === null ? 6 : d.shape.radius}`] },
        {
            target: 'Grid#IconPanel > Border#BackgroundElement, Taskbar.TaskListLabeledButtonPanel > Border#BackgroundElement',
            styles: [`Background:=${p.solid(p.hover, 0.85)}`, `CornerRadius=${d === null ? 6 : d.shape.radius}`],
        },
        {
            target: 'Taskbar.TaskbarBackground#HoverFlyoutBackgroundControl > Grid > Rectangle#BackgroundFill',
            styles: [`Fill:=${p.solid(p.raised, 0.95)}`],
        },
        { target: 'Border#OverflowFlyoutBackgroundBorder', styles: [`Background:=${p.solid(p.raised, 0.95)}`] },
        { target: 'Windows.UI.Xaml.Controls.Border#BackgroundDimmingLayer', styles: [`Background:=${p.solid(p.ground, 0.8)}`] },
    ]);
}

/** @param {Desk | null} d */
function windhawkStart(d) {
    const p = palette(d);
    const acrylic = (/** @type {string} */ colour, /** @type {number} */ opacity) =>
        `<AcrylicBrush BackgroundSource="Backdrop" TintColor="${colour}" TintOpacity="${opacity}" />`;
    return yaml('Windows 11 Start Menu Styler — https://windhawk.net/mods/windows-11-start-menu-styler', [
        {
            target: 'Border#AcrylicBorder',
            styles: [
                `Background:=${acrylic(p.ground, 0.85)}`,
                // The theme's corner, and its signal as a hairline frame.
                ...(d === null ? [] : [`CornerRadius=${d.shape.radius}`, `BorderBrush:=${p.solid(p.signal, 0.55)}`, 'BorderThickness=1']),
            ],
        },
        { target: 'Border#AppBorder', styles: [`Background:=${acrylic(p.ground, 0.85)}`] },
        {
            target: 'StartDocked.SearchBoxToggleButton',
            styles: [`Background:=${p.solid(p.raised, 0.9)}`, `CornerRadius=${d === null ? 8 : d.shape.radius}`],
        },
    ]);
}

/** @param {Desk | null} d */
function windhawkNotificationCentre(d) {
    const p = palette(d);
    const blur = (/** @type {string} */ colour, /** @type {number} */ opacity) =>
        `<WindhawkBlur BlurAmount="30" TintColor="${colour}" TintOpacity="${opacity}" />`;
    // The guide documents these three grids by name; it documents no colours
    // for them, so the styles here are colour only and a rename costs a tint.
    return yaml('Windows 11 Notification Center Styler — https://windhawk.net/mods/windows-11-notification-center-styler', [
        { target: 'Grid#NotificationCenterGrid', styles: [`Background:=${blur(p.ground, 0.8)}`] },
        { target: 'Grid#CalendarCenterGrid', styles: [`Background:=${blur(p.ground, 0.8)}`] },
        { target: 'Grid#ControlCenterRegion', styles: [`Background:=${blur(p.ground, 0.8)}`] },
    ]);
}

/**
 * Translucent Windows is not a styler: it takes one settings document, and
 * it is what gives ordinary windows, menus and tooltips their backdrop. The
 * keys follow the mod's own settings block as of 1.8.2 (read from
 * ProgramData\\Windhawk\\ModsSource on a real install); 1.8 dropped the
 * border and title bar colours older theme write-ups still carry.
 *
 * AccentBlurBehind is the tint laid over the blur, as AARRGGBB. The theme
 * flavour uses the theme's ground; the accent flavour cannot name the accent
 * here (the mod takes a hex, not a ThemeResource), so it uses a neutral dark.
 * @param {Desk | null} d
 */
function windhawkTranslucent(d) {
    const tint = d === null ? '66101010' : `${d.dark ? '80' : '66'}${hex(d.c.ground).slice(1)}`;
    return `# GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs). Do not edit.
# Translucent Windows 1.8 — https://windhawk.net/mods/translucent-windows
# Paste into the mod's Settings tab in Windhawk, in "Textual mode", and save.
# Menus, tooltips and ordinary windows: blurred backdrop, tinted ${d === null ? 'neutral dark' : `with KP ${d.label}'s ground`}.
RenderingMod:
  ThemeBackground: 1
  SysColors: 0
  AccentColorControls: 1
BackgroundEffects:
  type: acrylicblur
  AccentBlurBehind: '${tint}'
FlyoutsEffects: 1
RuledPrograms: []
`;
}

/* ------------------------------------------------------------------ */
/* Mica For Everyone, accent colour                                    */
/* ------------------------------------------------------------------ */

/** @param {Desk} d */
function mica(d) {
    const bar = d.dark ? 'Dark' : 'Light';
    // A theme with no radius asks Windows for square window corners too.
    // Names from Mica For Everyone 2's CornerPreference enum (Default, Square,
    // Rounded, RoundedSmall); it reads them as strings and refuses the file otherwise.
    const corner = d.shape.radius === 0 ? 'Square' : d.shape.radius <= 4 ? 'RoundedSmall' : 'Rounded';
    return {
        rules: [
            { type: 'global', titleBarColor: bar, backdropPreference: 'Acrylic', cornerPreference: corner, extendFrameIntoClientArea: false },
            {
                type: 'process',
                processName: 'explorer',
                titleBarColor: bar,
                backdropPreference: 'Acrylic',
                cornerPreference: corner,
                extendFrameIntoClientArea: true,
            },
            {
                type: 'process',
                processName: 'notepad',
                titleBarColor: bar,
                backdropPreference: 'Acrylic',
                cornerPreference: corner,
                extendFrameIntoClientArea: true,
            },
        ],
    };
}

/** A DWORD in the byte order the registry value wants. @param {number[]} bytes most significant first */
const dword = (bytes) => `dword:${bytes.map((b) => b.toString(16).padStart(2, '0')).join('')}`;

/** @param {Desk} d */
function accentReg(d) {
    const { c } = d;
    const [r, g, b] = c.signal;
    const abgr = (/** @type {Rgb} */ [rr, gg, bb]) => dword([0xff, bb, gg, rr]);
    // Windows keeps eight shades of the accent, lightest first; the fourth
    // is the accent itself and the Start menu uses the sixth.
    const steps = [0.45, 0.3, 0.15, 0, -0.2, -0.4, -0.6, -0.75];
    const palette = steps.map((s) => shade(c.signal, s));
    const bytes = palette.flatMap(([pr, pg, pb]) => [pr, pg, pb, 0]).map((n) => n.toString(16).padStart(2, '0'));
    const light = d.dark ? 0 : 1;
    return [
        'Windows Registry Editor Version 5.00',
        '',
        // regedit reads a version-5 file as UTF-16 or plain ASCII: keep it ASCII.
        `; GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) - KP ${d.label}. Do not edit.`,
        `; Accent ${hex(c.signal)}, ${d.dark ? 'dark' : 'light'} mode, transparency on. Current user only, no admin needed.`,
        '',
        '[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize]',
        `"AppsUseLightTheme"=${dword([0, 0, 0, light])}`,
        `"SystemUsesLightTheme"=${dword([0, 0, 0, light])}`,
        '"EnableTransparency"=dword:00000001',
        '"ColorPrevalence"=dword:00000000',
        '',
        '[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Accent]',
        `"AccentPalette"=hex:${bytes.join(',')}`,
        `"AccentColorMenu"=${abgr(c.signal)}`,
        `"StartColorMenu"=${abgr(palette[5])}`,
        '',
        '[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\DWM]',
        `"AccentColor"=${abgr(c.signal)}`,
        `"ColorizationColor"=${dword([0xc4, r, g, b])}`,
        `"ColorizationAfterglow"=${dword([0xc4, r, g, b])}`,
        '"ColorPrevalence"=dword:00000000',
        '"EnableWindowColorization"=dword:00000000',
        '',
    ].join('\r\n');
}

/**
 * The desktop and lock screen pictures, through PersonalizationCSP: the one
 * place that works on every edition of Windows 11 and that the sign-in screen
 * reads too, because the sign-in screen shows the lock screen picture.
 *
 * It needs administrator rights and the pictures must live where SYSTEM can
 * read them, which is why apply.ps1 copies them to Public\Pictures first.
 * While these keys exist, Settings cannot change the two pictures; deleting
 * the key gives Windows its own choice back.
 * @param {Desk} d
 */
function personalizationReg(d) {
    const dir = 'C:\\\\Users\\\\Public\\\\Pictures\\\\kp-themes';
    return [
        'Windows Registry Editor Version 5.00',
        '',
        `; GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) - KP ${d.label}. Do not edit.`,
        `; Desktop and lock screen pictures. Needs administrator rights. apply.ps1 -Skip lockscreen leaves them alone.`,
        '',
        '[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PersonalizationCSP]',
        `"DesktopImagePath"="${dir}\\\\${d.name}.png"`,
        `"DesktopImageUrl"="${dir}\\\\${d.name}.png"`,
        '"DesktopImageStatus"=dword:00000001',
        `"LockScreenImagePath"="${dir}\\\\${d.name}-lock.png"`,
        `"LockScreenImageUrl"="${dir}\\\\${d.name}-lock.png"`,
        '"LockScreenImageStatus"=dword:00000001',
        '',
        '; The sign-in screen blurs the picture by default; 1 shows it as it is.',
        '[HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\System]',
        '"DisableAcrylicBackgroundOnLogon"=dword:00000001',
        '',
    ].join('\r\n');
}

/* ------------------------------------------------------------------ */
/* The shell in WSL: Starship and fish                                 */
/* ------------------------------------------------------------------ */

/** @param {Desk} d */
function starship(d) {
    const { c } = d;
    return `# GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) — KP ${d.label}. Do not edit.
# Two lines, Garuda-style: who and where on the first, the prompt on the second.
"$schema" = 'https://starship.rs/config-schema.json'

palette = "kp"
add_newline = true
command_timeout = 800

format = """
[╭─](signal)$os$username[@](muted)$hostname $directory$git_branch$git_status$python$nodejs$rust$cmd_duration
[╰─](signal)$character"""

[palettes.kp]
signal = "${hex(c.signal)}"
accent = "${hex(c.accent)}"
violet = "${hex(c.violet)}"
ok = "${hex(c.ok)}"
warn = "${hex(c.warn)}"
danger = "${hex(c.danger)}"
ink = "${hex(c.ink)}"
muted = "${hex(c.muted)}"

[os]
disabled = false
style = "bold signal"
format = "[$symbol]($style)"

[os.symbols]
Arch = "\\uf303 "
Linux = "\\uf17c "
Windows = "\\ue70f "

[username]
show_always = true
style_user = "bold accent"
style_root = "bold danger"
format = "[$user]($style)"

[hostname]
ssh_only = false
style = "bold violet"
format = "[$hostname]($style)"

[directory]
style = "bold warn"
read_only = " \\uf023"
truncation_length = 4
truncate_to_repo = true
format = "[\\uf07c $path]($style)[$read_only]($read_only_style) "

[git_branch]
symbol = "\\ue725 "
style = "bold violet"
format = "on [$symbol$branch]($style) "

[git_status]
style = "bold danger"

[python]
style = "ok"
format = "[\${symbol}\${pyenv_prefix}(\${version} )(\\\\($virtualenv\\\\) )]($style)"

[nodejs]
style = "ok"

[rust]
style = "signal"

[cmd_duration]
min_time = 2000
style = "muted"
format = "took [$duration]($style) "

[character]
success_symbol = "[❯](bold ok)"
error_symbol = "[❯](bold danger)"
vimcmd_symbol = "[❮](bold accent)"
`;
}

/** @param {Desk} d */
function fish(d) {
    const { c } = d;
    const h = (/** @type {Rgb} */ rgb) => hex(rgb).slice(1);
    return `# GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) — KP ${d.label}. Do not edit.
# fish syntax colours; lives in ~/.config/fish/conf.d/, read at every start.
set -g fish_color_normal ${h(c.ink)}
set -g fish_color_command ${h(c.accent)}
set -g fish_color_keyword ${h(c.signal)}
set -g fish_color_quote ${h(c.warn)}
set -g fish_color_redirection ${h(c.violet)}
set -g fish_color_end ${h(c.violet)}
set -g fish_color_error ${h(c.danger)}
set -g fish_color_param ${h(c.ink)}
set -g fish_color_option ${h(c.muted)}
set -g fish_color_comment ${h(c.muted)}
set -g fish_color_operator ${h(c.signal)}
set -g fish_color_escape ${h(c.accent)}
set -g fish_color_autosuggestion ${h(c.muted)}
set -g fish_color_valid_path --underline
set -g fish_color_selection --background=${h(c.hover)}
set -g fish_color_search_match --background=${h(c.hover)}
set -g fish_pager_color_prefix ${h(c.signal)} --bold
set -g fish_pager_color_completion ${h(c.ink)}
set -g fish_pager_color_description ${h(c.muted)}
set -g fish_pager_color_progress ${h(c.accent)}
`;
}

/* ------------------------------------------------------------------ */
/* Wallpaper                                                           */
/* ------------------------------------------------------------------ */

/** A horizon, a striped sun and a floor grid in the theme's own hero colours. @param {Desk} d @param {boolean} [lock] */
function wallpaper(d, lock = false) {
    const { c } = d;
    const W = 3840;
    const H = 2160;
    // The lock screen carries a clock and a date across its upper half, so
    // its horizon sits lower and its sun is smaller: the same picture, with
    // room left for the text Windows draws on top.
    const horizon = lock ? 1560 : 1300;
    const cx = W / 2;
    const r = lock ? 380 : 560;
    let stripes = '';
    for (let i = 0; i < 7; i++) {
        const y = horizon - (lock ? 40 : 60) - i * (lock ? 40 : 58);
        const h = (lock ? 16 : 22) - i * (lock ? 2 : 3);
        if (h > 0) stripes += `        <rect x="0" y="${y}" width="${W}" height="${h}" fill="black"/>\n`;
    }
    let grid = '';
    for (let i = 1; i <= 12; i++) {
        const y = horizon + Math.round(((H - horizon) * (i * i)) / 144);
        grid += `    <line x1="0" y1="${y}" x2="${W}" y2="${y}"/>\n`;
    }
    for (let i = -16; i <= 16; i++) {
        grid += `    <line x1="${cx + i * 40}" y1="${horizon}" x2="${cx + i * 520}" y2="${H}"/>\n`;
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- GENERATED by kp-themes ${VERSION} (gates/generate-windows.mjs) — KP ${d.label}. Do not edit. -->
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hex(c.deep)}"/>
      <stop offset="1" stop-color="${hex(c.ground)}"/>
    </linearGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hex(c.warn)}"/>
      <stop offset="1" stop-color="${hex(c.signal)}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hex(c.ground)}"/>
      <stop offset="1" stop-color="${hex(c.deep)}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="${(horizon / H).toFixed(3)}" r="0.45">
      <stop offset="0" stop-color="${hex(c.signal)}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${hex(c.signal)}" stop-opacity="0"/>
    </radialGradient>
    <mask id="cut">
      <rect width="${W}" height="${H}" fill="white"/>
${stripes}    </mask>
    <clipPath id="above"><rect width="${W}" height="${horizon}"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <circle cx="${cx}" cy="${horizon - 80}" r="${r}" fill="url(#sun)" mask="url(#cut)" clip-path="url(#above)"/>
  <rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#floor)"/>
  <g stroke="${hex(c.lineStrong)}" stroke-width="3" stroke-opacity="${lock ? 0.3 : 0.55}">
${grid}  </g>
  <line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="${hex(c.accent)}" stroke-width="4"/>
</svg>
`;
}

/* ------------------------------------------------------------------ */
/* Output                                                              */
/* ------------------------------------------------------------------ */

/** @param {Desk} d @returns {Record<string, string>} */
export function files(d) {
    const json = (/** @type {unknown} */ v) => `${JSON.stringify(v, null, 4)}\n`;
    return {
        'terminal.json': json(terminal(d)),
        'yasb-styles.css': yasb(d),
        'firedragon/userChrome.css': userChrome(d),
        'firedragon/userContent.css': userContent(d),
        'mica-settings.json': json(mica(d)),
        'accent.reg': accentReg(d),
        'personalization.reg': personalizationReg(d),
        'windhawk/file-explorer-styler.yaml': windhawkExplorer(d),
        'windhawk/taskbar-styler.yaml': windhawkTaskbar(d),
        'windhawk/start-menu-styler.yaml': windhawkStart(d),
        'windhawk/notification-center-styler.yaml': windhawkNotificationCentre(d),
        'windhawk/translucent-windows.yaml': windhawkTranslucent(d),
        'wallpaper-lock.svg': wallpaper(d, true),
        'starship.toml': starship(d),
        'kp-colors.fish': fish(d),
        'wallpaper.svg': wallpaper(d),
    };
}

/** @returns {Map<string, string>} path under windows/ → content */
export function render() {
    /** @type {Map<string, string>} */
    const out = new Map();
    const all = themes().map(load);
    for (const d of all) for (const [path, text] of Object.entries(files(d))) out.set(`${d.name}/${path}`, text);
    // One set of styles for every theme: they read the Windows accent colour,
    // which accent.reg sets per theme, so a theme switch needs no pasting.
    out.set('windhawk-accent/file-explorer-styler.yaml', windhawkExplorer(null));
    out.set('windhawk-accent/taskbar-styler.yaml', windhawkTaskbar(null));
    out.set('windhawk-accent/start-menu-styler.yaml', windhawkStart(null));
    out.set('windhawk-accent/notification-center-styler.yaml', windhawkNotificationCentre(null));
    out.set('windhawk-accent/translucent-windows.yaml', windhawkTranslucent(null));
    out.set(
        'themes.json',
        `${JSON.stringify(
            all.map((d) => ({ name: d.name, label: d.label, dark: d.dark })),
            null,
            4,
        )}\n`,
    );
    return out;
}

function main() {
    const out = render();
    if (process.argv.includes('--check')) {
        const drift = [];
        for (const [path, text] of out) {
            let current = null;
            try {
                current = readFileSync(new URL(path, OUT), 'utf8');
            } catch {
                current = null;
            }
            if (current !== text) drift.push(path);
        }
        if (drift.length > 0) {
            console.error(`windows/: ${drift.length} file(s) do not match their source, first: ${drift.slice(0, 3).join(', ')}`);
            console.error('Run `npm run generate:windows` and commit the result.');
            process.exit(1);
        }
        const shared = new Set(['templates', 'wsl', 'windhawk-accent', 'fonts']);
        const count = readdirSync(OUT, { withFileTypes: true }).filter((e) => e.isDirectory() && !shared.has(e.name)).length;
        console.log(`Windows: ${out.size} files for ${count} themes match their source.`);
        process.exit(0);
    }
    for (const [path, text] of out) {
        const url = new URL(path, OUT);
        mkdirSync(new URL('.', url), { recursive: true });
        writeFileSync(url, text);
    }
    console.log(`wrote ${out.size} files under windows/ from ${themes().length} themes.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
