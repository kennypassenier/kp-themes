# Handoff — kp-themes

Startprompt voor een nieuwe Claude-sessie, geopend in
`/home/kenny/Projects/kp-themes`:

---

Dit is **kp-themes** (🎨), het npm-package `@kp-soft/themes`: de
thuisbasis van de huisthema's en de referentie waar al Kenny's projecten
naar wijzen zodat zijn apps er als één familie uitzien. Web vandaag, GUI
(Avalonia) en TUI (Ratatui) later.

**Waar het staat (2026-09-03):** Fase 0 is AF. De scope-gate is in vijf
rondes beantwoord — achttien stellingen plus B1 — en het resultaat staat
in `docs/SCOPE.md`. Er liep in diezelfde sessie ook één correctieronde
(KT1), die is goedgekeurd. Lees in deze volgorde:

1. `CLAUDE.md` — het statusblok, de projectregel uit KT1, en wat Fase 1
   en 2 erven.
2. `docs/SCOPE.md` — de goedgekeurde scope. Niet heropenen buiten een
   mini-ronde om.
3. `docs/MINI_ROUNDS.md` — één openstaande meting (KT1-M1), die afgaat
   bij het beslissingsformulier van Fase 2.
4. `docs/REQUESTS_FROM_CONSUMERS.md` — waar dit alles mee begon.

**De eerstvolgende stap is Fase 1: inventarisatie.** Dat is een
brownfield-fase, dus de `inventory-scout`-subagent veegt de codebase door
en levert de volledige lijst van wat er is. Fase 1 heeft géén eigen gate;
die lijst is het ruwe materiaal voor het beslissingsformulier van Fase 2.
Let bij die inventarisatie op wat S17 al vastlegt: de zeven thema's, de
cyberpunk-fx, het register, de contrastcontrole en de Tailwind-koppeling
zijn goedgekeurd voor gebruik; de picker is dat niet.

**Wat er in Fase 2 hoe dan ook op tafel ligt:** de ontbrekende tokens uit
S6b (`--success`, `--warning`, `--info`, en hover/active/disabled), de
herstructurering uit S18, de componentenset v1 uit S14, en de zeven
anatomie-docs uit S12.

**Over formulieren:** het elicitation-widget wérkt in de Claude Code CLI —
dat is in de Fase 0-sessie gemeten, in tegenstelling tot wat hier eerder
stond. Deze sessie hoeft dus niet naar Claude Desktop te verhuizen.
Herlees `~/Projects/dev-procedure/FORM_PROTOCOL.md` vers van schijf vóór
je een formulier bouwt, en houd je aan de projectregel uit KT1: elke
controleerbare bewering in de uitleg van een formulier wordt in dezelfde
beurt nagekeken, met bestand en regelnummer erbij.

**Wat er technisch staat (v0.1.1):** een extractie uit kp-soft (commit
`2983abb`): de zeven thema's als CSS custom properties in
`css/themes.css`, de Tailwind-koppeling in `css/tailwind-bridge.css`, het
cyberpunk-register in `css/cyberpunk-register.css`, de React-hook
`useTheme` plus `ThemeSwitcher`, de vier cyberpunk fx-componenten in
`fx/`, en `scripts/check-contrast.mjs` als contrastcontrole. `npm run
gates` moet groen zijn vóór elke commit.

---

Lees `~/Projects/dev-procedure/` (skill `/project-flow`) vóór je iets
doet, en hernoem de sessie naar `🎨 kp-themes - Fase 1 - Inventory en
exploration`.
