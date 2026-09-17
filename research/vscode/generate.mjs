// A VS Code colour theme, generated from a kp-themes theme [research/vscode].
//
// Research, not a shipped artefact: nothing under gates/ calls this yet.
// It follows the pattern of gates/generate-ha-themes.mjs — a fixed
// vocabulary on the far side, our token names on the near side, and no
// colour typed twice. Every value in the output is one of:
//
//   token          a token from themes/<name>/tokens.json
//   token/0.14     that token at an alpha (a relative colour, DI9)
//   token~10       that token with its lightness moved 10 points towards
//                  the foreground (only the bright ANSI colours use this)
//   derived        a state from the generated css/themes.css
//                  (primary-hover, secondary-active, link, …)
//
// The code roles are not chosen here: keyword, string and comment are
// imported from gates/site/highlight.mjs, so a snippet on the
// documentation site and the same code in VS Code agree. VS Code needs
// more roles than a documentation snippet (types, functions); those are
// added below, each with a fallback when a theme's token cannot carry it.
//
// Usage:
//   node research/vscode/generate.mjs                 cyberpunk → extension/themes/
//   node research/vscode/generate.mjs --all           all 22 → all/, plus cyberpunk → extension/
//   node research/vscode/generate.mjs --report        also print the contrast table (cyberpunk)
//   node research/vscode/generate.mjs --all --report  a one-line contrast summary per theme

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { TOKEN_TOKENS, highlight } from '../../gates/site/highlight.mjs';
import { contrast, distance, hslToRgb, parseHsl, rgbToHsl } from '../../gates/colour.mjs';

const ROOT = new URL('../../', import.meta.url);
const HERE = new URL('./', import.meta.url);
const ORDER = JSON.parse(readFileSync(new URL('themes/order.json', ROOT), 'utf8'));
const THEMES_CSS = readFileSync(new URL('css/themes.css', ROOT), 'utf8');

/** Two colours "tell apart" at 10 on the OKLab scale gates/config.json uses. */
const DISTINCT = 10;

// ── Reading a theme ─────────────────────────────────────────────────────

/** @param {string} name */
function readTheme(name) {
    const raw = JSON.parse(readFileSync(new URL(`themes/${name}/tokens.json`, ROOT), 'utf8'));
    /** @type {Record<string, string>} */
    const tokens = Object.fromEntries(raw.entries.filter((e) => e.token !== undefined).map((e) => [e.token, e.value]));
    // The derived states exist only in the generated stylesheet.
    const block = new RegExp(`^\\[data-theme='${name}'\\] \\{\\n([\\s\\S]*?)^\\}`, 'm').exec(THEMES_CSS);
    if (!block) throw new Error(`css/themes.css has no block for ${name}`);
    /** @type {Record<string, string>} */
    const derived = {};
    const after = block[1].split('Derived interaction states')[1] ?? '';
    for (const m of after.matchAll(/--([\w-]+):\s*([^;]+);/g)) derived[m[1]] = m[2].trim();
    return { name, label: raw.label, tokens, derived, dark: tokens['color-scheme'] === 'dark' };
}

// ── Colour arithmetic ───────────────────────────────────────────────────

/** @param {[number, number, number]} rgb @param {number} [alpha] */
function hex(rgb, alpha = 1) {
    const h = (/** @type {number} */ u) =>
        Math.round(Math.min(1, Math.max(0, u)) * 255)
            .toString(16)
            .padStart(2, '0');
    return `#${rgb.map(h).join('')}${alpha < 1 ? h(alpha) : ''}`.toUpperCase();
}

/** @param {string} value #RRGGBB or #RRGGBBAA @returns {{rgb: [number, number, number], alpha: number}} */
export function parseHex(value) {
    const n = (/** @type {number} */ i) => parseInt(value.slice(i, i + 2), 16) / 255;
    return { rgb: [n(1), n(3), n(5)], alpha: value.length === 9 ? n(7) : 1 };
}

/** What the eye sees: `top` (maybe translucent) over an opaque `ground`. */
export function over(/** @type {string} */ top, /** @type {string} */ ground) {
    const t = parseHex(top);
    const g = parseHex(ground);
    return /** @type {[number, number, number]} */ (t.rgb.map((u, i) => t.alpha * u + (1 - t.alpha) * g.rgb[i]));
}

/**
 * Resolve one expression against a theme.
 * @param {ReturnType<typeof readTheme>} theme
 * @param {string} expr
 */
function resolve(theme, expr) {
    const m = /^([\w-]+)(?:\/([\d.]+))?(?:~(-?\d+))?$/.exec(expr);
    if (!m) throw new Error(`bad expression ${expr}`);
    const [, name, alpha, shift] = m;
    const value = theme.tokens[name] ?? theme.derived[name];
    if (value === undefined || !value.startsWith('hsl')) return null;
    const hsl = parseHsl(value);
    if (shift) {
        // Towards the foreground: lighter on a dark theme, darker on a light one.
        const d = Number(shift) * (theme.dark ? 1 : -1);
        hsl.l = Math.min(96, Math.max(4, hsl.l + d));
    }
    return hex(hslToRgb(hsl), alpha ? Number(alpha) : 1);
}

// ── The workbench: VS Code key → kp expression ──────────────────────────
// A list, not an exhaustive one. VS Code 1.137 registers about 980 colour
// ids (952 in the workbench, 16 ANSI, 11 from the git extension); the ones
// below are the ones a reader sees in an ordinary session.
// A key left out takes the default VS Code registered for the theme's type
// (dark or light). Many of those defaults are references to keys set here
// (charts.red and its siblings are registered as references, not hex), so
// they follow; the ones registered as fixed hex values (for example
// debugTokenExpression.name, #c586c0 on dark) stay VS Code's own.
// An array value is a fallback chain: the first token the theme has wins.

/** @type {Record<string, string | string[] | {pick: string[], on: string}>} */
const WORKBENCH = {
    // Base
    foreground: 'foreground',
    descriptionForeground: 'muted-foreground',
    disabledForeground: 'border-strong', // the HA generator's choice for disabled text
    errorForeground: 'destructive',
    focusBorder: 'ring',
    'icon.foreground': 'foreground',
    'selection.background': 'primary/0.35',
    'widget.border': 'border',
    'widget.shadow': 'sidebar-background/0.6',
    'sash.hoverBorder': 'primary',
    'textLink.foreground': 'link',
    'textLink.activeForeground': 'primary-hover',
    'textPreformat.foreground': TOKEN_TOKENS.string.slice(2),
    'textPreformat.background': 'muted',
    'textCodeBlock.background': 'muted',
    'textBlockQuote.background': 'card',
    'textBlockQuote.border': 'border-strong',
    'textSeparator.foreground': 'border',
    'scrollbar.shadow': 'sidebar-background',
    'scrollbarSlider.background': 'border-strong/0.4',
    'scrollbarSlider.hoverBackground': 'border-strong/0.6',
    'scrollbarSlider.activeBackground': 'primary/0.5',
    'progressBar.background': 'primary',

    // Title bar, menus, command centre
    'titleBar.activeBackground': 'sidebar-background',
    'titleBar.activeForeground': 'sidebar-foreground',
    'titleBar.inactiveBackground': 'sidebar-background',
    'titleBar.inactiveForeground': { pick: ['muted-foreground', 'sidebar-foreground/0.7', 'sidebar-foreground'], on: 'titleBar.inactiveBackground' },
    'titleBar.border': 'sidebar-border',
    'menubar.selectionBackground': 'secondary-hover',
    'menubar.selectionForeground': 'foreground',
    'menu.background': 'popover',
    'menu.foreground': 'popover-foreground',
    'menu.border': 'border-strong',
    'menu.selectionBackground': 'foreground/0.08', // .kp-menu__item:hover
    'menu.selectionForeground': 'popover-foreground',
    'menu.separatorBackground': 'border',
    'commandCenter.background': 'muted',
    'commandCenter.foreground': 'foreground',
    'commandCenter.border': 'border',
    'commandCenter.activeBackground': 'secondary-hover',

    // Activity bar
    'activityBar.background': 'sidebar-background',
    'activityBar.foreground': { pick: ['sidebar-primary', 'sidebar-foreground'], on: 'activityBar.background' },
    'activityBar.inactiveForeground': { pick: ['muted-foreground', 'sidebar-foreground/0.7', 'sidebar-foreground'], on: 'activityBar.background' },
    'activityBar.border': 'sidebar-border',
    'activityBar.activeBorder': 'sidebar-primary',
    'activityBar.activeBackground': 'sidebar-accent',
    'activityBarBadge.background': 'primary',
    'activityBarBadge.foreground': 'primary-foreground',
    'activityBarTop.foreground': 'sidebar-primary',
    'activityBarTop.inactiveForeground': { pick: ['muted-foreground', 'sidebar-foreground/0.7', 'sidebar-foreground'], on: 'activityBar.background' },
    'activityBarTop.activeBorder': 'sidebar-primary',

    // Side bar and lists (the tree in the explorer is .kp-tree)
    'sideBar.background': 'sidebar-background',
    'sideBar.foreground': 'sidebar-foreground',
    'sideBar.border': 'sidebar-border',
    'sideBar.dropBackground': 'primary/0.12',
    'sideBarTitle.foreground': { pick: ['muted-foreground', 'sidebar-foreground/0.7', 'sidebar-foreground'], on: 'sideBar.background' },
    'sideBarSectionHeader.background': 'sidebar-background',
    'sideBarSectionHeader.foreground': 'sidebar-foreground',
    'sideBarSectionHeader.border': 'sidebar-border',
    // The explorer sits on the sidebar, which is a dark band in some light
    // themes (formal, forest), so every ink here is read on that ground.
    'list.activeSelectionBackground': 'sidebar-primary/0.14', // .kp-tree aria-selected wash
    'list.activeSelectionForeground': { pick: ['sidebar-foreground', 'foreground'], on: 'sideBar.background' },
    'list.activeSelectionIconForeground': { pick: ['sidebar-primary', 'primary', 'sidebar-foreground'], on: 'sideBar.background' },
    'list.inactiveSelectionBackground': 'sidebar-primary/0.08',
    'list.inactiveSelectionForeground': { pick: ['sidebar-foreground', 'foreground'], on: 'sideBar.background' },
    'list.focusBackground': 'sidebar-primary/0.14',
    'list.focusForeground': { pick: ['sidebar-foreground', 'foreground'], on: 'sideBar.background' },
    'list.focusOutline': 'sidebar-ring',
    'list.focusAndSelectionOutline': 'sidebar-ring',
    'list.hoverBackground': 'sidebar-accent',
    'list.hoverForeground': { pick: ['sidebar-accent-foreground', 'sidebar-foreground'], on: 'list.hoverBackground' },
    'list.highlightForeground': { pick: ['sidebar-primary', 'primary', 'sidebar-foreground'], on: 'sideBar.background' },
    'list.focusHighlightForeground': { pick: ['sidebar-primary', 'primary', 'sidebar-foreground'], on: 'sideBar.background' },
    'list.errorForeground': { pick: ['destructive', 'destructive-foreground', 'sidebar-foreground'], on: 'sideBar.background' },
    'list.warningForeground': { pick: ['warning-foreground', 'warning', 'sidebar-foreground'], on: 'sideBar.background' },
    'list.invalidItemForeground': { pick: ['destructive', 'destructive-foreground', 'sidebar-foreground'], on: 'sideBar.background' },
    'list.dropBackground': 'sidebar-primary/0.12',
    'tree.indentGuidesStroke': 'border',
    'listFilterWidget.background': 'popover',
    'listFilterWidget.outline': 'ring',
    'listFilterWidget.noMatchesOutline': 'destructive',

    // Badges (.kp-badge is muted on muted-foreground)
    'badge.background': 'muted',
    'badge.foreground': 'muted-foreground',

    // Editor groups and tabs
    'editorGroup.border': 'border',
    'editorGroup.dropBackground': 'primary/0.12',
    'editorGroupHeader.tabsBackground': 'card',
    'editorGroupHeader.tabsBorder': 'border',
    'tab.activeBackground': 'background',
    'tab.activeForeground': 'foreground',
    'tab.activeBorderTop': 'primary',
    'tab.unfocusedActiveBorderTop': 'border-strong',
    'tab.inactiveBackground': 'card',
    'tab.inactiveForeground': { pick: ['muted-foreground', 'card-foreground'], on: 'tab.inactiveBackground' },
    'tab.unfocusedActiveForeground': 'muted-foreground',
    'tab.hoverBackground': 'secondary-hover',
    'tab.hoverForeground': 'foreground',
    'tab.border': 'border',
    'tab.lastPinnedBorder': 'border-strong',
    'tab.activeModifiedBorder': 'warning-foreground',
    'breadcrumb.foreground': 'muted-foreground',
    'breadcrumb.focusForeground': 'foreground',
    'breadcrumb.activeSelectionForeground': 'primary',
    'breadcrumbPicker.background': 'popover',

    // Editor
    'editor.background': 'background',
    'editor.foreground': 'foreground',
    'editorLineNumber.foreground': 'muted-foreground',
    'editorLineNumber.activeForeground': 'primary',
    'editorCursor.foreground': 'primary',
    'editor.selectionBackground': 'primary/0.3',
    'editor.inactiveSelectionBackground': 'primary/0.15',
    'editor.selectionHighlightBackground': 'accent/0.16',
    'editor.wordHighlightBackground': 'foreground/0.1',
    'editor.wordHighlightStrongBackground': 'accent/0.22',
    'editor.findMatchBackground': 'accent/0.4',
    'editor.findMatchBorder': 'accent',
    'editor.findMatchHighlightBackground': 'accent/0.18',
    'editor.findRangeHighlightBackground': 'muted',
    'editor.hoverHighlightBackground': 'accent/0.15',
    'editor.lineHighlightBackground': 'muted',
    'editor.rangeHighlightBackground': 'primary/0.08',
    'editorLink.activeForeground': 'link',
    'editorWhitespace.foreground': 'border',
    'editorIndentGuide.background1': 'border',
    'editorIndentGuide.activeBackground1': 'border-strong',
    'editorRuler.foreground': 'border',
    'editorCodeLens.foreground': 'muted-foreground',
    'editorInlayHint.foreground': 'muted-foreground',
    'editorInlayHint.background': 'muted',
    'editorGhostText.foreground': 'muted-foreground',
    'editorBracketMatch.background': 'accent/0.15',
    'editorBracketMatch.border': 'accent',
    'editorBracketHighlight.foreground1': TOKEN_TOKENS.keyword.slice(2),
    'editorBracketHighlight.foreground2': 'chart-4',
    'editorBracketHighlight.foreground3': TOKEN_TOKENS.string.slice(2),
    'editorBracketHighlight.unexpectedBracket.foreground': 'destructive',
    'editorError.foreground': 'destructive',
    'editorWarning.foreground': 'warning-foreground',
    'editorInfo.foreground': 'info-foreground',
    'editorHint.foreground': 'muted-foreground',
    'editorGutter.background': 'background',
    'editorGutter.addedBackground': 'success-foreground',
    'editorGutter.modifiedBackground': 'warning-foreground',
    'editorGutter.deletedBackground': 'destructive',
    'editorOverviewRuler.border': 'border',
    'editorOverviewRuler.errorForeground': 'destructive',
    'editorOverviewRuler.warningForeground': 'warning-foreground',
    'editorOverviewRuler.infoForeground': 'info-foreground',
    'editorOverviewRuler.addedForeground': 'success-foreground',
    'editorOverviewRuler.modifiedForeground': 'warning-foreground',
    'editorOverviewRuler.deletedForeground': 'destructive',
    'editorOverviewRuler.findMatchForeground': 'accent',
    'editorOverviewRuler.selectionHighlightForeground': 'primary/0.6',
    'editorStickyScroll.background': 'background',
    'editorStickyScrollHover.background': 'muted',
    'minimap.selectionHighlight': 'primary/0.5',
    'minimap.findMatchHighlight': 'accent',
    'minimap.errorHighlight': 'destructive',
    'minimap.warningHighlight': 'warning-foreground',
    'minimapGutter.addedBackground': 'success-foreground',
    'minimapGutter.modifiedBackground': 'warning-foreground',
    'minimapGutter.deletedBackground': 'destructive',

    // Widgets: suggest, hover, find, peek
    'editorWidget.background': 'popover',
    'editorWidget.foreground': 'popover-foreground',
    'editorWidget.border': 'border-strong',
    'editorSuggestWidget.background': 'popover',
    'editorSuggestWidget.foreground': 'popover-foreground',
    'editorSuggestWidget.border': 'border-strong',
    'editorSuggestWidget.selectedBackground': 'primary/0.14',
    'editorSuggestWidget.selectedForeground': 'popover-foreground',
    'editorSuggestWidget.highlightForeground': 'primary',
    'editorSuggestWidget.focusHighlightForeground': 'primary',
    'editorHoverWidget.background': 'popover',
    'editorHoverWidget.foreground': 'popover-foreground',
    'editorHoverWidget.border': 'border-strong',
    'editorMarkerNavigation.background': 'popover',
    'editorMarkerNavigationError.background': 'destructive',
    'editorMarkerNavigationWarning.background': 'warning-foreground',
    'peekView.border': 'primary',
    'peekViewEditor.background': 'card',
    'peekViewEditor.matchHighlightBackground': 'accent/0.3',
    'peekViewResult.background': 'popover',
    'peekViewResult.fileForeground': 'foreground',
    'peekViewResult.lineForeground': 'muted-foreground',
    'peekViewResult.matchHighlightBackground': 'accent/0.3',
    'peekViewResult.selectionBackground': 'primary/0.14',
    'peekViewResult.selectionForeground': 'foreground',
    'peekViewTitle.background': 'secondary',
    'peekViewTitleLabel.foreground': 'foreground',
    'peekViewTitleDescription.foreground': 'muted-foreground',

    // Quick input (the command palette)
    'quickInput.background': 'popover',
    'quickInput.foreground': 'popover-foreground',
    'quickInputTitle.background': 'secondary',
    'quickInputList.focusBackground': 'primary/0.14',
    'quickInputList.focusForeground': 'popover-foreground',
    'quickInputList.focusIconForeground': 'primary',
    'pickerGroup.foreground': 'accent',
    'pickerGroup.border': 'border',
    'keybindingLabel.background': 'muted',
    'keybindingLabel.foreground': 'foreground',
    'keybindingLabel.border': 'border-strong',
    'keybindingLabel.bottomBorder': 'border-strong',

    // Inputs and controls (.kp-field__input: background ground, --input border)
    'input.background': 'background',
    'input.foreground': 'foreground',
    'input.border': 'input',
    'input.placeholderForeground': 'muted-foreground',
    'inputOption.activeBackground': 'primary/0.2',
    'inputOption.activeBorder': 'ring',
    'inputOption.activeForeground': 'foreground',
    'inputOption.hoverBackground': 'secondary-hover',
    'inputValidation.errorBackground': 'popover',
    'inputValidation.errorForeground': 'popover-foreground',
    'inputValidation.errorBorder': 'destructive',
    'inputValidation.warningBackground': 'popover',
    'inputValidation.warningForeground': 'popover-foreground',
    'inputValidation.warningBorder': 'warning-foreground',
    'inputValidation.infoBackground': 'popover',
    'inputValidation.infoForeground': 'popover-foreground',
    'inputValidation.infoBorder': 'info-foreground',
    'dropdown.background': 'popover',
    'dropdown.listBackground': 'popover',
    'dropdown.foreground': 'popover-foreground',
    'dropdown.border': 'input',
    'checkbox.background': 'background',
    'checkbox.foreground': 'primary',
    'checkbox.border': 'input',
    'checkbox.selectBackground': 'popover',
    'radio.activeBackground': 'primary/0.2',
    'radio.activeForeground': 'foreground',
    'radio.activeBorder': 'ring',
    'settings.headerForeground': 'primary',
    'settings.modifiedItemIndicator': 'warning-foreground',
    'settings.focusedRowBackground': 'muted',
    'settings.rowHoverBackground': 'foreground/0.04',

    // Buttons (hover and active are the derived states in css/themes.css)
    'button.background': 'primary',
    'button.foreground': 'primary-foreground',
    'button.hoverBackground': 'primary-hover',
    'button.separator': 'primary-foreground/0.4',
    'button.secondaryBackground': 'secondary',
    'button.secondaryForeground': 'secondary-foreground',
    'button.secondaryHoverBackground': 'secondary-hover',
    'toolbar.hoverBackground': 'secondary-hover',
    'toolbar.activeBackground': 'secondary-active',
    'extensionButton.background': 'primary',
    'extensionButton.foreground': 'primary-foreground',
    'extensionButton.hoverBackground': 'primary-hover',

    // Panel and terminal
    'panel.background': 'background',
    'panel.border': 'border',
    'panel.dropBorder': 'primary',
    'panelTitle.activeForeground': 'foreground',
    'panelTitle.activeBorder': 'primary',
    'panelTitle.inactiveForeground': 'muted-foreground',
    'panelInput.border': 'input',
    'panelSection.border': 'border',
    'panelSectionHeader.background': 'sidebar-background',
    'terminal.background': 'background',
    'terminal.foreground': 'foreground',
    'terminal.border': 'border',
    'terminal.selectionBackground': 'primary/0.3',
    'terminal.inactiveSelectionBackground': 'primary/0.15',
    'terminal.findMatchBackground': 'accent/0.4',
    'terminal.findMatchHighlightBackground': 'accent/0.18',
    'terminalCursor.foreground': 'primary',
    'terminalCommandDecoration.defaultBackground': 'muted-foreground',
    'terminalCommandDecoration.successBackground': 'success-foreground',
    'terminalCommandDecoration.errorBackground': 'destructive',
    'terminal.tab.activeBorder': 'primary',

    // Status bar: the theme's hero surface, where it has one
    'statusBar.background': ['surface-hero-bg', 'primary'],
    'statusBar.foreground': ['surface-hero-fg', 'primary-foreground'],
    'statusBar.border': ['surface-hero-border', 'border'],
    'statusBar.focusBorder': ['surface-hero-fg', 'primary-foreground'],
    'statusBarItem.hoverBackground': ['surface-hero-card', 'primary-hover'],
    'statusBarItem.hoverForeground': ['surface-hero-card-foreground', 'primary-foreground'],
    'statusBarItem.activeBackground': ['surface-hero-fg/0.2', 'primary-active'],
    'statusBarItem.focusBorder': ['surface-hero-fg', 'primary-foreground'],
    'statusBarItem.remoteBackground': ['surface-hero-primary', 'secondary'],
    'statusBarItem.remoteForeground': ['surface-hero-primary-foreground', 'secondary-foreground'],
    'statusBarItem.prominentBackground': ['surface-hero-primary', 'secondary'],
    'statusBarItem.prominentForeground': ['surface-hero-primary-foreground', 'secondary-foreground'],
    'statusBarItem.errorBackground': ['surface-hero-danger', 'destructive'],
    'statusBarItem.errorForeground': ['surface-hero-danger-foreground', 'destructive-foreground'],
    'statusBarItem.warningBackground': 'warning',
    'statusBarItem.warningForeground': 'warning-foreground',
    'statusBar.noFolderBackground': 'secondary',
    'statusBar.noFolderForeground': 'secondary-foreground',
    'statusBar.debuggingBackground': 'destructive',
    'statusBar.debuggingForeground': 'destructive-foreground',
    'banner.background': ['surface-hero-bg', 'primary'],
    'banner.foreground': ['surface-hero-fg', 'primary-foreground'],

    // Notifications
    'notifications.background': 'popover',
    'notifications.foreground': 'popover-foreground',
    'notifications.border': 'border-strong',
    'notificationToast.border': 'border-strong',
    'notificationCenterHeader.background': 'secondary',
    'notificationCenterHeader.foreground': 'secondary-foreground',
    'notificationLink.foreground': 'link',
    'notificationsErrorIcon.foreground': 'destructive',
    'notificationsWarningIcon.foreground': 'warning-foreground',
    'notificationsInfoIcon.foreground': 'info-foreground',

    // Diff (the line wash is .kp-diff's own: success/0.14, destructive/0.12)
    'diffEditor.insertedLineBackground': 'success/0.14',
    'diffEditor.removedLineBackground': 'destructive/0.12',
    'diffEditor.insertedTextBackground': 'success-foreground/0.2',
    'diffEditor.removedTextBackground': 'destructive/0.25',
    'diffEditor.border': 'border',
    'diffEditor.diagonalFill': 'border',
    'diffEditorGutter.insertedLineBackground': 'success/0.3',
    'diffEditorGutter.removedLineBackground': 'destructive/0.25',
    'merge.currentHeaderBackground': 'success-foreground/0.35',
    'merge.currentContentBackground': 'success-foreground/0.12',
    'merge.incomingHeaderBackground': 'info-foreground/0.35',
    'merge.incomingContentBackground': 'info-foreground/0.12',
    'merge.commonHeaderBackground': 'muted-foreground/0.35',
    'merge.commonContentBackground': 'muted-foreground/0.12',

    // Source control
    'gitDecoration.addedResourceForeground': { pick: ['success-foreground', 'success', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.untrackedResourceForeground': { pick: ['success-foreground', 'success', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.modifiedResourceForeground': { pick: ['warning-foreground', 'warning', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.stageModifiedResourceForeground': { pick: ['warning-foreground', 'warning', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.deletedResourceForeground': { pick: ['destructive', 'destructive-foreground', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.stageDeletedResourceForeground': {
        pick: ['destructive', 'destructive-foreground', 'sidebar-foreground'],
        on: 'sideBar.background',
    },
    'gitDecoration.renamedResourceForeground': { pick: ['info-foreground', 'info', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.conflictingResourceForeground': { pick: ['chart-4', 'chart-3', 'sidebar-foreground'], on: 'sideBar.background' },
    'gitDecoration.ignoredResourceForeground': { pick: ['muted-foreground', 'sidebar-foreground/0.6'], on: 'sideBar.background' },
    'gitDecoration.submoduleResourceForeground': { pick: ['accent', 'sidebar-accent-foreground', 'sidebar-foreground'], on: 'sideBar.background' },
    'scmGraph.foreground1': 'chart-1',
    'scmGraph.foreground2': 'chart-2',
    'scmGraph.foreground3': 'chart-3',
    'scmGraph.foreground4': 'chart-4',
    'scmGraph.foreground5': 'chart-5',
    'scmGraph.historyItemRefColor': 'accent',

    // Problems, testing, debugging
    'problemsErrorIcon.foreground': 'destructive',
    'problemsWarningIcon.foreground': 'warning-foreground',
    'problemsInfoIcon.foreground': 'info-foreground',
    'testing.iconPassed': 'success-foreground',
    'testing.iconFailed': 'destructive',
    'testing.iconErrored': 'destructive',
    'testing.iconQueued': 'warning-foreground',
    'testing.runAction': 'success-foreground',
    'debugToolBar.background': 'popover',
    'debugIcon.breakpointForeground': 'destructive',
    'editor.stackFrameHighlightBackground': 'warning-foreground/0.15',
    'editor.focusedStackFrameHighlightBackground': 'success-foreground/0.15',

    // Welcome and notebooks
    'welcomePage.tileBackground': 'card',
    'welcomePage.tileHoverBackground': 'muted',
    'welcomePage.tileBorder': 'border',
    'notebook.cellBorderColor': 'border',
    'notebook.focusedCellBorder': 'ring',
    'notebook.selectedCellBackground': 'muted',
};

// ── Code roles ──────────────────────────────────────────────────────────

/**
 * The roles, as fallback chains. The first three are the highlighter's and
 * take no fallback: agreement with the documentation site is the point.
 * The others take their first candidate that reads (4.5:1 on the editor)
 * and is told apart (OKLab distance >= 10) from the roles already chosen.
 */
const ROLE_CHAINS = {
    keyword: [TOKEN_TOKENS.keyword.slice(2)],
    string: [TOKEN_TOKENS.string.slice(2)],
    comment: [TOKEN_TOKENS.comment.slice(2)],
    type: ['chart-4', 'chart-3', 'accent', 'foreground'],
    function: ['sidebar-accent-foreground', 'info-foreground', 'chart-5', 'foreground'],
};

/** @param {ReturnType<typeof readTheme>} theme */
function codeRoles(theme) {
    const bg = resolve(theme, 'background');
    /** @type {Record<string, {expr: string, hex: string, fellBack: boolean}>} */
    const roles = { plain: { expr: 'foreground', hex: resolve(theme, 'foreground'), fellBack: false } };
    for (const [role, chain] of Object.entries(ROLE_CHAINS)) {
        const fixed = chain.length === 1;
        const pick = chain.find((expr) => {
            const h = resolve(theme, expr);
            if (!h) return false;
            if (fixed || expr === 'foreground') return true;
            const rgb = parseHex(h).rgb;
            const reads = contrast(rgb, parseHex(bg).rgb) >= 4.5;
            const apart = Object.values(roles).every((r) => distance(rgb, parseHex(r.hex).rgb) >= DISTINCT);
            return reads && apart;
        });
        roles[role] = { expr: pick, hex: resolve(theme, pick), fellBack: pick !== chain[0] };
    }
    roles.invalid = { expr: 'destructive', hex: resolve(theme, 'destructive'), fellBack: false };
    roles.link = { expr: 'link', hex: resolve(theme, 'link'), fellBack: false };
    return roles;
}

/** TextMate scopes per role. Order matters: a later, more specific scope wins. */
function tokenColors(/** @type {ReturnType<typeof codeRoles>} */ r) {
    const rule = (/** @type {string} */ name, /** @type {string[]} */ scope, /** @type {string} */ role, fontStyle = '') => ({
        name,
        scope,
        settings: { foreground: r[role].hex, ...(fontStyle ? { fontStyle } : {}) },
        kpRole: role,
    });
    return [
        rule(
            'Plain text, identifiers, punctuation, operators',
            [
                'source',
                'variable',
                'variable.other',
                'variable.parameter',
                'meta.definition.variable',
                'punctuation',
                'keyword.operator',
                'meta.brace',
                'entity.name.variable',
                'support.variable.property',
                'variable.other.property',
                'variable.other.object.property',
            ],
            'plain',
        ),
        rule('Comments (highlight.mjs: comment)', ['comment', 'punctuation.definition.comment', 'string.quoted.docstring'], 'comment', 'italic'),
        rule(
            'Keywords and storage (highlight.mjs: keyword)',
            [
                'keyword',
                'storage',
                'storage.type',
                'storage.modifier',
                'keyword.control',
                'keyword.operator.new',
                'keyword.operator.expression',
                'keyword.operator.logical.python',
                'variable.language',
                'variable.language.this',
                'variable.language.self',
                'constant.language',
                'constant.language.boolean',
            ],
            'keyword',
        ),
        rule(
            'Tag, attribute and property names (highlight.mjs: keyword)',
            ['entity.name.tag', 'entity.other.attribute-name', 'support.type.property-name', 'entity.name.tag.yaml', 'keyword.other.unit'],
            'keyword',
        ),
        rule(
            'Strings, numbers, constants (highlight.mjs: string)',
            [
                'string',
                'constant.numeric',
                'constant.other',
                'constant.other.color',
                'support.constant',
                'constant.other.caps',
                'variable.other.enummember',
                'entity.name.constant',
                'string.regexp',
                'markup.inline.raw',
                'support.constant.property-value',
            ],
            'string',
        ),
        rule(
            'Types, classes, traits, lifetimes, attributes',
            [
                'entity.name.type',
                'entity.name.class',
                'entity.name.struct',
                'entity.name.enum',
                'entity.name.trait',
                'entity.name.interface',
                'entity.other.inherited-class',
                'support.class',
                'support.type',
                'entity.name.namespace',
                'storage.modifier.lifetime',
                'entity.name.type.lifetime',
                'punctuation.definition.lifetime',
                'meta.attribute',
                'entity.name.function.decorator',
                'meta.decorator',
                'constant.character.escape',
            ],
            'type',
        ),
        rule(
            'Functions and methods',
            [
                'entity.name.function',
                'support.function',
                'meta.function-call entity.name.function',
                'entity.name.function.member',
                'variable.function',
            ],
            'function',
        ),
        rule(
            'Macros (a name the language gives meaning to)',
            ['entity.name.function.macro', 'support.function.macro', 'entity.name.function.preprocessor', 'keyword.control.directive'],
            'keyword',
        ),
        rule(
            'Primitive type names read as types',
            ['entity.name.type.primitive', 'entity.name.type.numeric', 'support.type.primitive', 'support.type.builtin'],
            'type',
        ),
        rule('Markdown headings', ['markup.heading', 'entity.name.section'], 'keyword', 'bold'),
        rule('Markdown emphasis', ['markup.italic'], 'plain', 'italic'),
        rule('Markdown strong', ['markup.bold'], 'plain', 'bold'),
        rule('Links', ['markup.underline.link', 'string.other.link'], 'link', 'underline'),
        rule('Quotes', ['markup.quote'], 'comment', 'italic'),
        rule('Inserted', ['markup.inserted'], 'plain'),
        rule('Invalid', ['invalid', 'invalid.illegal'], 'invalid', 'underline'),
        rule('Deprecated', ['invalid.deprecated'], 'comment', 'strikethrough'),
    ];
}

/** Semantic tokens: the same roles, so a language server does not repaint the code. */
function semanticTokenColors(/** @type {ReturnType<typeof codeRoles>} */ r) {
    const c = (/** @type {string} */ role, extra = {}) => ({ foreground: r[role].hex, ...extra });
    return {
        comment: c('comment', { italic: true }),
        keyword: r.keyword.hex,
        string: r.string.hex,
        number: r.string.hex,
        regexp: r.string.hex,
        enumMember: r.string.hex,
        'variable.constant': r.string.hex,
        'variable.readonly.defaultLibrary': r.string.hex,
        boolean: r.keyword.hex,
        selfKeyword: r.keyword.hex,
        builtinType: r.type.hex,
        type: r.type.hex,
        class: r.type.hex,
        struct: r.type.hex,
        enum: r.type.hex,
        interface: r.type.hex,
        typeAlias: r.type.hex,
        typeParameter: c('type', { italic: true }),
        lifetime: c('type', { italic: true }),
        namespace: r.plain.hex,
        decorator: r.type.hex,
        attribute: r.type.hex,
        function: r.function.hex,
        method: r.function.hex,
        macro: r.keyword.hex,
        variable: r.plain.hex,
        parameter: r.plain.hex,
        property: r.plain.hex,
        '*.mutable': { underline: true },
        '*.deprecated': { strikethrough: true },
    };
}

/** Symbol icons in the outline and the suggest list follow the code roles. */
function symbolIcons(/** @type {ReturnType<typeof codeRoles>} */ r, /** @type {string} */ muted) {
    /** @type {Record<string, string>} */
    const out = {};
    const put = (/** @type {string[]} */ names, /** @type {string} */ value) => names.forEach((n) => (out[`symbolIcon.${n}Foreground`] = value));
    put(['class', 'interface', 'struct', 'enumerator', 'typeParameter'], r.type.hex);
    put(['function', 'method', 'constructor'], r.function.hex);
    put(['keyword', 'boolean', 'null'], r.keyword.hex);
    put(['string', 'number', 'constant', 'enumeratorMember', 'color'], r.string.hex);
    put(
        [
            'variable',
            'field',
            'property',
            'module',
            'namespace',
            'package',
            'operator',
            'object',
            'array',
            'key',
            'reference',
            'text',
            'unit',
            'event',
        ],
        r.plain.hex,
    );
    put(['file', 'folder', 'snippet'], muted);
    return out;
}

// ── ANSI: nearest token by hue, each used once where the theme allows ──

const ANSI_HUES = { Red: 0, Green: 120, Yellow: 55, Blue: 225, Magenta: 300, Cyan: 185 };
const ANSI_POOL = [
    'primary',
    'accent',
    'destructive',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
    'success-foreground',
    'warning-foreground',
    'info-foreground',
    'link',
    'status-sent',
    'status-screening',
    'status-interview',
    'status-offer',
    'status-rejected',
    'sidebar-accent-foreground',
];

/** @param {ReturnType<typeof readTheme>} theme */
function ansi(theme) {
    const bg = parseHex(resolve(theme, 'background')).rgb;
    const hueGap = (/** @type {number} */ a, /** @type {number} */ b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    const pool = ANSI_POOL.map((expr) => {
        const h = resolve(theme, expr);
        if (!h) return null;
        const rgb = parseHex(h).rgb;
        const hsl = rgbToHsl(rgb);
        return { expr, rgb, hue: hsl.h, sat: hsl.s, ratio: contrast(rgb, bg) };
    }).filter((c) => c && c.sat >= 30 && c.ratio >= 4.5);
    /** @type {Record<string, {expr: string, note: string}>} */
    const chosen = {};
    const pairs = Object.entries(ANSI_HUES)
        .flatMap(([slot, hue]) => pool.map((c) => ({ slot, c, gap: hueGap(hue, c.hue) })))
        // Within 5° of each other, the more saturated token is the truer
        // ANSI colour (cyberpunk's accent, not its pale sidebar cyan).
        .sort((a, b) => Math.floor(a.gap / 5) - Math.floor(b.gap / 5) || b.c.sat - a.c.sat || a.gap - b.gap);
    for (const { slot, c, gap } of pairs) {
        if (chosen[slot] || gap > 60) continue;
        const taken = Object.values(chosen).some((x) => hueGap(pool.find((p) => p.expr === x.expr).hue, c.hue) < 20);
        if (taken) continue;
        chosen[slot] = { expr: c.expr, note: `hue ${Math.round(c.hue)}, ${gap.toFixed(0)}° from ${slot.toLowerCase()}` };
    }
    for (const [slot, hue] of Object.entries(ANSI_HUES)) {
        if (chosen[slot]) continue;
        // Fewer hues in the theme than ANSI has slots: share the nearest.
        const near = [...pool].sort((a, b) => hueGap(hue, a.hue) - hueGap(hue, b.hue))[0];
        chosen[slot] = near
            ? { expr: near.expr, note: `shared: no free token within 60° (nearest hue ${Math.round(near.hue)})` }
            : { expr: 'foreground', note: 'shared: no saturated token reads on the ground' };
    }
    /** @type {Record<string, string>} */
    const colors = {};
    /** @type {Record<string, string>} */
    const sources = {};
    const set = (/** @type {string} */ key, /** @type {string} */ expr, note = '') => {
        colors[`terminal.${key}`] = resolve(theme, expr);
        sources[`terminal.${key}`] = expr + (note ? ` (${note})` : '');
    };
    if (theme.dark) {
        set('ansiBlack', 'muted');
        set('ansiBrightBlack', 'muted-foreground');
        set('ansiWhite', 'foreground');
        set('ansiBrightWhite', 'foreground~10');
    } else {
        // As VS Code's own Light Modern does: "white" text must still read
        // on a light ground, so it is a grey, and only bright white is pale.
        set('ansiBlack', 'foreground');
        set('ansiBrightBlack', 'muted-foreground');
        set('ansiWhite', 'muted-foreground');
        set('ansiBrightWhite', 'border-strong');
    }
    for (const [slot, { expr, note }] of Object.entries(chosen)) {
        set(`ansi${slot}`, expr, note);
        set(`ansiBright${slot}`, `${expr}~10`);
    }
    return { colors, sources };
}

// ── Assembly ────────────────────────────────────────────────────────────

/** @param {ReturnType<typeof readTheme>} theme */
export function build(theme) {
    /** @type {Record<string, string>} */
    const colors = {};
    /** @type {Record<string, string>} */
    const sources = {};
    for (const [key, spec] of Object.entries(WORKBENCH)) {
        if (typeof spec === 'object' && !Array.isArray(spec)) {
            // A readable pick [the HA generator's readable()]: the first
            // candidate that reaches 4.5:1 on a ground already resolved,
            // else the best of them.
            const ground = colors[spec.on];
            if (!ground) throw new Error(`${key} reads on ${spec.on}, which is not resolved above it`);
            const scored = spec.pick
                .map((expr) => ({ expr, value: resolve(theme, expr) }))
                .filter((c) => c.value)
                .map((c) => ({ ...c, ratio: contrast(over(c.value, ground), parseHex(ground).rgb) }));
            const best = scored.find((c) => c.ratio >= 4.5) ?? [...scored].sort((a, b) => b.ratio - a.ratio)[0];
            colors[key] = best.value;
            sources[key] =
                best.expr === spec.pick[0] ? best.expr : `${best.expr} (${spec.pick[0]} read ${scored[0]?.ratio.toFixed(2)}:1 on ${spec.on})`;
            continue;
        }
        const chain = Array.isArray(spec) ? spec : [spec];
        const expr = chain.find((e) => resolve(theme, e));
        if (!expr) throw new Error(`${theme.name}: nothing resolves for ${key} (${chain.join(' | ')})`);
        colors[key] = resolve(theme, expr);
        sources[key] = expr;
    }
    const roles = codeRoles(theme);
    const icons = symbolIcons(roles, colors.descriptionForeground);
    for (const [k, v] of Object.entries(icons)) {
        colors[k] = v;
        sources[k] = 'code role';
    }
    const term = ansi(theme);
    Object.assign(colors, term.colors);
    Object.assign(sources, term.sources);
    const tc = tokenColors(roles);
    return {
        $schema: 'vscode://schemas/color-theme',
        name: `KP ${theme.label}`,
        type: theme.dark ? 'dark' : 'light',
        semanticHighlighting: true,
        colors,
        tokenColors: tc.map(({ kpRole, ...rest }) => rest),
        semanticTokenColors: semanticTokenColors(roles),
        // Ignored by VS Code; read by demo.html and the report. Says where
        // every colour came from, so nothing in the demo is typed twice.
        kpThemes: {
            theme: theme.name,
            generator: 'research/vscode/generate.mjs',
            roles: Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, { token: v.expr, hex: v.hex, fellBack: v.fellBack }])),
            ruleRoles: tc.map((t) => t.kpRole),
            sources,
            // The documentation site's half of the agreement, for demo.html.
            highlighter: { tokens: TOKEN_TOKENS, sample: AGREEMENT_SAMPLE, html: highlight(AGREEMENT_SAMPLE, 'js') },
        },
    };
}

/** One snippet, highlighted by gates/site/highlight.mjs, shown beside the mock. */
const AGREEMENT_SAMPLE = `// Pick the first theme whose ink reads on its ground.
export async function pickTheme(names, floor = 4.5) {
    for (const name of names) {
        const ratio = await measure(name, 'foreground');
        if (ratio >= floor) return { name, ratio };
    }
    return null;
}`;

// ── Contrast report ─────────────────────────────────────────────────────

/** @param {ReturnType<typeof build>} t */
export function measure(t) {
    const c = t.colors;
    const bg = c['editor.background'];
    const on = (/** @type {string} */ fg, /** @type {string} */ ground) => contrast(over(fg, ground), parseHex(ground).rgb);
    const onComposite = (/** @type {string} */ fg, /** @type {string} */ wash, /** @type {string} */ ground) =>
        contrast(parseHex(fg).rgb, over(wash, ground));
    const r = t.kpThemes.roles;
    /** @type {{what: string, ratio: number, floor: number}[]} */
    const rows = [
        { what: 'editor.foreground on editor.background', ratio: on(c['editor.foreground'], bg), floor: 4.5 },
        { what: `comment (${r.comment.token}) on editor.background`, ratio: on(r.comment.hex, bg), floor: 4.5 },
        { what: `keyword (${r.keyword.token}) on editor.background`, ratio: on(r.keyword.hex, bg), floor: 4.5 },
        { what: `string (${r.string.token}) on editor.background`, ratio: on(r.string.hex, bg), floor: 4.5 },
        { what: `type (${r.type.token}) on editor.background`, ratio: on(r.type.hex, bg), floor: 4.5 },
        { what: `function (${r.function.token}) on editor.background`, ratio: on(r.function.hex, bg), floor: 4.5 },
        { what: 'editor.foreground on selection', ratio: onComposite(c['editor.foreground'], c['editor.selectionBackground'], bg), floor: 4.5 },
        { what: 'comment on selection', ratio: onComposite(r.comment.hex, c['editor.selectionBackground'], bg), floor: 4.5 },
        {
            what: 'selection against editor.background (non-text)',
            ratio: contrast(over(c['editor.selectionBackground'], bg), parseHex(bg).rgb),
            floor: 3,
        },
        {
            what: 'editor.foreground on line highlight',
            ratio: onComposite(c['editor.foreground'], c['editor.lineHighlightBackground'], bg),
            floor: 4.5,
        },
        { what: 'comment on line highlight', ratio: onComposite(r.comment.hex, c['editor.lineHighlightBackground'], bg), floor: 4.5 },
        {
            what: 'line highlight against editor.background (non-text)',
            ratio: contrast(over(c['editor.lineHighlightBackground'], bg), parseHex(bg).rgb),
            floor: 3,
        },
        { what: 'editorLineNumber.foreground on editor', ratio: on(c['editorLineNumber.foreground'], bg), floor: 4.5 },
        { what: 'statusBar.foreground on statusBar.background', ratio: on(c['statusBar.foreground'], c['statusBar.background']), floor: 4.5 },
        { what: 'sideBar.foreground on sideBar.background', ratio: on(c['sideBar.foreground'], c['sideBar.background']), floor: 4.5 },
        {
            what: 'list selection ink on its sidebar-primary/0.14 wash',
            ratio: onComposite(c['list.activeSelectionForeground'], c['list.activeSelectionBackground'], c['sideBar.background']),
            floor: 4.5,
        },
        { what: 'tab.inactiveForeground on tab.inactiveBackground', ratio: on(c['tab.inactiveForeground'], c['tab.inactiveBackground']), floor: 4.5 },
        { what: 'button.foreground on button.background', ratio: on(c['button.foreground'], c['button.background']), floor: 4.5 },
        { what: 'badge.foreground on badge.background', ratio: on(c['badge.foreground'], c['badge.background']), floor: 4.5 },
        { what: 'input.border against input.background (non-text)', ratio: on(c['input.border'], c['input.background']), floor: 3 },
        { what: 'focusBorder against editor.background (non-text)', ratio: on(c.focusBorder, bg), floor: 3 },
        { what: 'gitDecoration modified on sideBar', ratio: on(c['gitDecoration.modifiedResourceForeground'], c['sideBar.background']), floor: 4.5 },
    ];
    for (const slot of ['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White', 'BrightBlack']) {
        const key = `terminal.ansi${slot}`;
        rows.push({ what: `${key} on terminal.background`, ratio: on(c[key], c['terminal.background']), floor: 4.5 });
    }
    return rows;
}

// ── Main ────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
    const all = process.argv.includes('--all');
    const report = process.argv.includes('--report');
    const names = all ? ORDER : ['cyberpunk'];
    mkdirSync(new URL('extension/themes/', HERE), { recursive: true });
    if (all) mkdirSync(new URL('all/', HERE), { recursive: true });
    for (const name of names) {
        const theme = build(readTheme(name));
        theme.kpThemes.contrast = measure(theme).map((row) => ({ ...row, ratio: Number(row.ratio.toFixed(2)) }));
        const text = `${JSON.stringify(theme, null, 4)}\n`;
        // all/ is what demo.html switches between: compact, it is read by a script.
        if (all) writeFileSync(new URL(`all/kp-${name}-color-theme.json`, HERE), `${JSON.stringify(theme)}\n`);
        if (name === 'cyberpunk') writeFileSync(new URL('extension/themes/kp-cyberpunk-color-theme.json', HERE), text);
        const rows = measure(theme);
        const under = rows.filter((row) => row.ratio < row.floor);
        const fell = Object.entries(theme.kpThemes.roles)
            .filter(([, v]) => v.fellBack)
            .map(([k, v]) => `${k}→${v.token}`);
        const shared = Object.entries(theme.kpThemes.sources)
            .filter(([, v]) => v.includes('shared'))
            .map(([k]) => k.replace('terminal.ansi', ''));
        if (report && !all) {
            for (const row of rows)
                console.log(`${row.ratio < row.floor ? 'UNDER' : 'ok   '} ${row.ratio.toFixed(2).padStart(5)}:1  (floor ${row.floor})  ${row.what}`);
        }
        console.log(
            `${name.padEnd(14)} ${Object.keys(theme.colors).length} colours, ${theme.tokenColors.length} token rules; ${under.length} of ${rows.length} pairs under their floor${under.length ? `: ${under.map((u) => `${u.what.replace(/ \(non-text\)| on editor.background| on terminal.background/g, '')} ${u.ratio.toFixed(2)}`).join('; ')}` : ''}${fell.length ? ` | fallback: ${fell.join(', ')}` : ''}${shared.length ? ` | ANSI shared: ${shared.join(', ')}` : ''}`,
        );
    }
}
