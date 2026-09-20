// kp-themes: begin (appended by windows/apply.ps1; delete this block to undo)
// Read userChrome.css and userContent.css from the profile's chrome/ folder.
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// Browser and pages follow the Windows mode, which accent.reg sets per theme (2 = follow the system).
user_pref("browser.theme.toolbar-theme", 2);
user_pref("browser.theme.content-theme", 2);
user_pref("layout.css.prefers-color-scheme.content-override", 2);
// Let the Windows backdrop (Mica For Everyone) show through the tab strip.
user_pref("widget.windows.mica", true);
// kp-themes: end
