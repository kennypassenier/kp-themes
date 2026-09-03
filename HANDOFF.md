# Handoff — kp-themes

Startprompt voor een nieuwe Claude-sessie, geopend in `/home/kenny/Projects/kp-themes`:

---

Dit is **kp-themes** (🎨), het npm-package `@kp-soft/themes` met de huisthema's.

**Waar het staat (2026-09-03):** Fase 0 van de dev-procedure LOOPT. Het
scope-concept is geschreven en gecommit; de goedkeuringsgate is nog niet
beantwoord. Lees in deze volgorde:

1. `docs/SCOPE.md` — tien stellingen S1 t/m S10, gemarkeerd als DRAFT.
   Dit is wat er goedgekeurd moet worden. Niet opnieuw afleiden, het
   staat er al.
2. `docs/REQUESTS_FROM_CONSUMERS.md` — geschreven door de
   JobTracker-sessie (💼) op 2026-09-03, elke bewering gemeten. Dit is de
   aanleiding voor het hele gesprek.
3. `CLAUDE.md` en `README.md` in deze map.

**De eerstvolgende stap is de Fase 0-gate**: één goedkeuringsformulier
over die tien stellingen, per stelling `Klopt · Aanpassen · Schrappen ·
Eigen antwoord`, plus een "mist er iets?"-item en een opmerkingenveld —
volgens `~/Projects/dev-procedure/FORM_PROTOCOL.md`, dat je vers van
schijf herleest vóór je het formulier bouwt.

**Waarom deze sessie in Claude Desktop hoort en niet in de Claude Code
CLI:** de CLI heeft geen visualize-MCP, dus daar degraderen formulieren
tot platte tekst. Gemeten: `~/.claude.json` bevat alleen `obsidian` en
`home-assistant`, en `claude_desktop_config.json` heeft helemaal geen
`mcpServers`-blok, dus visualize is een Desktop-connector en geen lokaal
geconfigureerde server. Werkt het elicitation-widget hier ook niet, zeg
dat dan expliciet en val terug op één gestructureerd tekstbericht
(FORM_PROTOCOL §7) — niet op een zelfgebouwde widget.

**Waar het over gaat.** Drie consumenten gebruiken deze thema's nu. Twee
ervan (📅 Almanac en 📬 kyu) hebben op 2026-09-03 binnen hetzelfde uur
onafhankelijk dezelfde theme picker in vanilla JS nagebouwd, omdat de
meegeleverde `ThemeSwitcher` React is en hun dashboards server-rendered
HTML met Bootstrap 5 zijn. kyu heeft zijn versie uitgebracht in 2.2.0.
Daarnaast bereikt de contrast-gate de consumenten niet, terwijl T17 dat
wel beloofde.
↳ _T17 = de beslissing in JobTracker Fase 3 (2026-09-02) die dit package
liet ontstaan, met "elke consumer draait de contrast-gate op een
versiebump" erin._

**Wat er al staat (v0.1.1):** een extractie uit kp-soft (commit
`2983abb`): de zeven thema's (formal, light, dark, cyberpunk, pastel,
terminal, topo) als CSS custom properties in `css/themes.css`, de
Tailwind v4 bridge in `css/tailwind-bridge.css`, het cyberpunk-register
in `css/cyberpunk-register.css`, de React-hook `useTheme` +
`ThemeSwitcher` (zonder Inertia, met `onChange`-callback en een
`labels`-prop), de vier cyberpunk fx-componenten in `fx/`, en
`scripts/check-contrast.mjs` als contrast-gate. Nieuw t.o.v. kp-soft:
zeven `--status-*`-tokenparen per thema voor JobTracker. `npm run gates`
(contrast + prettier) moet groen zijn vóór elke commit.

**Onderzoek:** het themaonderzoek uit kp-soft staat letterlijk in `docs/`
(`THEMING.md`, `CYBERPUNK_THEME_RESEARCH.md`); vanaf nu is kp-themes de
thuisbasis van de huisthema's.

---

Lees `~/Projects/dev-procedure/` (skill `/project-flow`) vóór je iets
doet, en hernoem de sessie naar `🎨 kp-themes - Fase 0 - Idea & scope`.
