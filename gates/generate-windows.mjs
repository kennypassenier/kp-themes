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
    heroGround: 'surface-hero-bg',
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
        c,
        vscode,
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
        '    --system-font: "JetBrainsMono NFP", "JetBrainsMono Nerd Font Propo", "Segoe UI Variable", "Segoe UI";',
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
    return YASB_TEMPLATE.replace('{{root}}', lines.join('\n'))
        .replace('{{label}}', d.label)
        .replace('{{name}}', d.name)
        .replace('{{version}}', VERSION);
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
`;
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
/* Mica For Everyone, accent colour                                    */
/* ------------------------------------------------------------------ */

/** @param {Desk} d */
function mica(d) {
    const bar = d.dark ? 'Dark' : 'Light';
    return {
        rules: [
            { type: 'global', titleBarColor: bar, backdropPreference: 'Acrylic', cornerPreference: 'Round', extendFrameIntoClientArea: false },
            {
                type: 'process',
                processName: 'explorer',
                titleBarColor: bar,
                backdropPreference: 'Acrylic',
                cornerPreference: 'Round',
                extendFrameIntoClientArea: true,
            },
            {
                type: 'process',
                processName: 'notepad',
                titleBarColor: bar,
                backdropPreference: 'Acrylic',
                cornerPreference: 'Round',
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

/** A horizon, a striped sun and a floor grid in the theme's own hero colours. @param {Desk} d */
function wallpaper(d) {
    const { c } = d;
    const W = 3840;
    const H = 2160;
    const horizon = 1300;
    const cx = W / 2;
    const r = 560;
    let stripes = '';
    for (let i = 0; i < 7; i++) {
        const y = horizon - 60 - i * 58;
        const h = 22 - i * 3;
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
      <stop offset="1" stop-color="${hex(c.heroGround)}"/>
    </linearGradient>
    <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hex(c.warn)}"/>
      <stop offset="1" stop-color="${hex(c.signal)}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hex(c.heroGround)}"/>
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
  <g stroke="${hex(c.lineStrong)}" stroke-width="3" stroke-opacity="0.55">
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
        const count = readdirSync(OUT, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== 'templates' && e.name !== 'wsl').length;
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
