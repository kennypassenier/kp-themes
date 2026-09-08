# Handoff — kp-themes

Startprompt voor een nieuwe Claude-sessie, geopend in
`/home/kenny/Projects/kp-themes`:

---

Dit is **kp-themes** (🎨), het npm-package `@kp-soft/themes`: de
thuisbasis van de huisthema's en de referentie waar al Kenny's projecten
naar wijzen zodat zijn apps er als één familie uitzien. Web vandaag, GUI
(Avalonia) en TUI (Ratatui) later.

**Waar het staat (2026-09-09):** ronde zes, Fase 6 is af. Alle
vijfentwintig thema's dragen een eigen register; 4.0.0 is uitgebracht en
`v5.0.0-alpha.1` staat getagd met een draft release die op Kenny's eigen
publish wacht. Wat nog open staat vóór 5.0.0: de field test, en daarna de
release zelf. Lees in deze volgorde:

1. `CLAUDE.md` — het statusblok, de projectregels uit de correcties, en
   wat elke fase erft.
2. `docs/SCOPE.md` — de goedgekeurde scope (S1–S49). Niet heropenen
   buiten een mini-ronde om.
3. `docs/MINI_ROUNDS.md` — de openstaande metingen en mini-rondes.
4. `docs/CORRECTIONS.md` — de live gevonden fouten en hun maatregelen;
   de projectregels in `CLAUDE.md` komen hiervandaan.

**Testen doet Kenny zelf** [beslissing van 2026-09-09]. Er is géén CI —
`.github/workflows/ci.yml` is verwijderd en `main` vereist geen status
check. Vijf commando's vervangen het:

| Commando                | Wat                                     | Wanneer                         |
| ----------------------- | --------------------------------------- | ------------------------------- |
| `npm run gates`         | de dertig blokkerende checks, seconden  | elke commit, door de hook       |
| `npm run test:affected` | alleen de specs die een wijziging raakt | tijdens het werk                |
| `npm run test:browser`  | de hele suite, Chromium én Firefox      | als Kenny erom vraagt           |
| `npm run advice`        | contrast, invarianten, motion, textuur  | als Kenny de lezing wil         |
| `npm run verify`        | alle drie op volgorde                   | vóór een release, op zijn woord |

De toegankelijkheidsvloeren zijn advies, geen gates: ze worden gemeten en
geprint, nooit geweigerd, en er wordt geen lijst met uitzonderingen meer
bijgehouden. README.md en `docs/DESIGN_INVARIANTS.md` zeggen met zoveel
woorden wat dat kost.

**Over formulieren:** het elicitation-widget wérkt in de Claude Code CLI.
Herlees `~/Projects/dev-procedure/FORM_PROTOCOL.md` vers van schijf vóór
je een formulier bouwt, en houd je aan de projectregel uit KT1: elke
controleerbare bewering in de uitleg van een formulier wordt in dezelfde
beurt nagekeken, met bestand en regelnummer erbij. Elke keuze die Kenny
maakt is één formulier, hoe klein ook.

**Wat er technisch staat (`5.0.0-alpha.1`):** vijfentwintig thema's als
CSS custom properties in `css/themes.css`, gegenereerd uit
`themes/<naam>/tokens.json`; een register per thema in
`css/<naam>-register.css`; de layout- en utility-laag; de lettertypes die
het package zelf meelevert (`css/fonts.css`, `fonts/`); achttien
componenten in twee kanalen (React en framework-vrij); een
geminificeerde build onder `dist/`; en de documentatiesite op
<https://kennypassenier.github.io/kp-themes/>. `npm run gates` moet groen
zijn vóór elke commit.

---

Lees `~/Projects/dev-procedure/` (skill `/project-flow`) vóór je iets
doet, en hernoem de sessie naar `🎨 kp-themes - Fase <N> - <fasenaam>`.
