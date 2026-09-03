# Handoff — kp-themes

Startprompt voor een nieuwe Claude-sessie, geopend in `/home/kenny/Projects/kp-themes`:

---

**Eerst lezen (2026-09-03):** `docs/REQUESTS_FROM_CONSUMERS.md`. Drie
consumenten gebruiken deze thema's nu, en twee ervan (📅 Almanac en 📬 kyu)
bouwen op dit moment onafhankelijk dezelfde theme picker na in vanilla JS,
omdat de meegeleverde switcher React is en hun dashboards server-rendered
HTML zijn. Daar staat ook waarom de contrast-gate de consumenten niet
bereikt terwijl T17 dat wel beloofde. Kenny wil dat vanuit dít project
gecoördineerd worden.

---

Dit is **kp-themes** (🎨), het npm-package `@kp-soft/themes` met de huisthema's.

**Wat er al staat (v0.1.0, 2026-09-02):** een pure extractie uit kp-soft
(commit `2983abb`): de zeven thema's (formal, light, dark, cyberpunk,
pastel, terminal, topo) als CSS custom properties in `css/themes.css`, de
Tailwind v4 bridge in `css/tailwind-bridge.css`, het cyberpunk-register
in `css/cyberpunk-register.css`, de React-hook `useTheme` + `ThemeSwitcher`
(zonder Inertia, met `onChange`-callback), de vier cyberpunk fx-componenten
in `fx/`, en `scripts/check-contrast.mjs` als contrast-gate. Nieuw t.o.v.
kp-soft: zeven `--status-*`-tokenparen per thema voor JobTracker.
`npm run gates` (contrast + prettier) moet groen zijn vóór elke commit.

**Waarom dit bestaat:** in JobTracker is in Fase 3 (T17) en Fase 5 (P0)
beslist dat het themasysteem van kp-soft een gedeeld package wordt in
plaats van een kopie. Twee consumers: JobTracker (vanaf milestone L0,
via `github:kennypassenier/kp-themes#v0.1.0`) en kp-soft zelf (queue-item
#21, adoptie later).

**Onderzoek:** het themaonderzoek uit kp-soft staat letterlijk in `docs/`
(`THEMING.md`, `CYBERPUNK_THEME_RESEARCH.md`); vanaf nu is kp-themes de
thuisbasis van de huisthema's.

**Volgende stap:** dit project heeft nog GEEN eigen procedure doorlopen.
Start met `/project-flow start`. Fase 0-scope: thema's voor web, TUI en
GUI; wat een thema tot een thema maakt (anatomie: palet, register,
typografie, motion, gates); welke consumers welke oppervlakken nodig
hebben. v0.1.0 blijft ongewijzigd tot die scope vastligt.

Lees eerst `CLAUDE.md` en `README.md` in deze map.
