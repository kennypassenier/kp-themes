export { default as ThemeSwitcher } from './components/theme-switcher.jsx';
export {
    DEFAULT_THEME,
    STORAGE_KEY,
    THEME_LABELS,
    THEME_RECORDS,
    THEMES,
    applyTheme,
    initializeTheme,
    isTheme,
    useAppearance,
    useTheme,
} from './hooks/use-theme.js';
/** @typedef {import('./hooks/use-theme.js').Theme} Theme */
/** @typedef {import('./hooks/use-theme.js').UseThemeOptions} UseThemeOptions */
