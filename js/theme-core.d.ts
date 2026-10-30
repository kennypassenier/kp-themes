import { THEMES, DEFAULT_THEME, STORAGE_KEY } from './theme-registry.js';
export type ThemeName = import('./theme-registry.js').ThemeName;
export type ThemeConfig = import('./theme-core/values.js').ThemeConfig;
/** @typedef {import('./theme-registry.js').ThemeName} ThemeName */
/** @typedef {import('./theme-core/values.js').ThemeConfig} ThemeConfig */
export { THEME_EVENT, BEFORE_THEME_EVENT, UNKNOWN_THEME_EVENT, PENDING_THEME_ATTRIBUTE, PREVIEW_THEME_ATTRIBUTE, configureTheme, isTheme, } from './theme-core/values.js';
export { currentTheme, pendingTheme } from './theme-core/read.js';
export { applyTheme, initializeTheme } from './theme-core/apply.js';
export { previewTheme, endPreview, previewedTheme } from './theme-core/preview.js';
export { storeTheme, storedTheme } from './theme-core/store.js';
export { onThemeChange } from './theme-core/subscribe.js';
export { THEMES, DEFAULT_THEME, STORAGE_KEY };
