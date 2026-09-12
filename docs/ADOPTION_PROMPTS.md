# Adoptieprompts — kp-themes 5.0.0

Twee startprompts, één per consumer, die Kenny in een sessie van dat
project plakt. Dit document is Nederlands om dezelfde reden als
`HANDOFF.md`: het is tekst die Kenny voorleest of doorgeeft, geen
artefact van dit package. Alles waar de prompt naar verwijst — code,
bestandsnamen, tokens — blijft Engels.

Geschreven op 2026-09-09, direct na de publicatie van v5.0.0, op Kenny's
verzoek. De vorige versie van dit verzoek (2026-09-08) zei nog dat de
consumers de bestanden zelf uit de directory moesten kopiëren omdat de
repository privé zou worden. Die repository is publiek gebleven, dus die
zin is eruit: er is een release met assets en er is een git remote.

De regel die in beide prompts staat en die het belangrijkst is: **gebruik
wat past.** Een feature die niet past blijft ongebruikt, en het rapport
zegt waarom. Een dashboard heeft geen boot-scherm nodig en een
sollicitatie-app geen razor tear.

---

## Prompt voor JobTracker

```
kp-themes 5.0.0 is uit en publiek:
https://github.com/kennypassenier/kp-themes/releases/tag/v5.0.0
Repository: https://github.com/kennypassenier/kp-themes
Documentatie: https://kennypassenier.github.io/kp-themes/

Werk JobTracker bij naar @kp-soft/themes v5.0.0 en gebruik daarvan alles
wat in dit project past. Wat niet past laat je staan, en je schrijft in
je rapport één regel waarom niet — een feature ongebruikt laten is een
beslissing, geen omissie.

BREKENDE WIJZIGINGEN die je eerst afhandelt:
- Drie thema's zijn hernoemd: topo → forest, tazhib → lapis, nishiki →
  woodblock. Vier thema's zijn in 6.0.0 verdwenen — academia, mono,
  ticker en woodblock. Elke verwijzing verandert: tokens, register, export-pad, de
  `Theme` union, opgeslagen voorkeuren van gebruikers. MIGRATION.md
  bevat de map.
- `cyberpunk` is onder dezelfde naam een ander thema geworden: signaal-
  geel in plaats van neon-op-violet. Wie het oude wil, pint de tag
  v4.0.0.
- `STRINGS_NL` is sinds 4.0.0 weg uit js/strings.js en index.js. Kom je
  van 3.x, dan lever je je eigen Nederlandse woorden aan via de
  `strings` prop, `StringsProvider` of `setStrings()`.

WAT ER NIEUW IS OM UIT TE KIEZEN — neem wat past:
- Vijfentwintig thema's, elk met een eigen opt-in register
  (`css/<naam>-register.css`) dat de uitdrukking van dat thema draagt.
  Zonder register krijg je de palet-laag; met register krijg je het
  karakter.
- Het hook-vocabulaire: betekenis staat in de HTML, uitdrukking in het
  thema. `data-kp-surface="hero|app"` zegt op welke grond een sectie
  staat; `<mark>` is een nadruk die het thema mag onthullen (in
  cyberpunk een redaction die oplicht, in synthwave een neonbuis die
  aangaat); `data-kp-reveal="headline|emphasis|rule"` is iets dat
  aankomt; `data-kp-divider` is een sectie-overgang; `--kp-arrival` op
  de root zegt hoe de pagina aankomt (`boot` of `card`).
- Een ticker: `data-kp-marquee` op een rij items, `--kp-marquee` voor de
  duur van één passage, `--kp-marquee-pause: offscreen|never`. De module
  verdubbelt de rij zelf en verbergt de kopie voor een screenreader.
- Een caption boven een nav-dropdown: `menuLabel` op een NavBar-link, of
  `data-kp-menu-label` op de `.kp-nav__menu`. Zonder caption tekent hij
  niets.
- De lettertypes komen mee (`css/fonts.css` plus `fonts/`), zeven ervan
  hernoemd onder de OFL.
- Een geminificeerde build onder `dist/css/` met source maps, 45%
  kleiner, en de per-bestand groottes in docs/MINIFIED.md.
- De layout-laag (negentien klassen) en de utility-laag (118 klassen).

WAAR JE OP LET:
- De toegankelijkheidsvloeren van kp-themes zijn sinds 2026-09-09
  advies, geen gates: contrast, de design invariants, de flitsdrempel,
  de reduced-motion guards en het textuurplafond worden gemeten en
  geprint, niet geweigerd. Wil JobTracker een harde ondergrond, dan is
  dat JobTrackers eigen keuze en JobTrackers eigen check. `npm run
  advice` in de kp-themes repository print de lezing.
- kp-themes bouwt geen tooling voor consumers (S20): geen sync-commando,
  geen adapter, geen fixture per project. Mis je iets — een component,
  een token, een type — dan vraag je het aan, dat is de ondersteunde
  weg. Bouw geen laag ertussen.
- Een uitgebrachte versie van een thema verandert nooit (S20). Wil je
  zekerheid, pin de tag.

Rapporteer wat je hebt overgenomen, wat je bewust hebt laten liggen en
waarom, en wat je bij kp-themes wilt aanvragen.
```

---

## Prompt voor chassis-rs

```
kp-themes 5.0.0 is uit en publiek:
https://github.com/kennypassenier/kp-themes/releases/tag/v5.0.0
Repository: https://github.com/kennypassenier/kp-themes
Documentatie: https://kennypassenier.github.io/kp-themes/

Werk chassis-rs bij naar kp-themes 5.0.0 en gebruik daarvan alles wat in
dit project past. Wat niet past laat je staan, en je schrijft in je
rapport één regel waarom niet.

WAT JE VANDAAG BAKT, en dus vervangt. chassis-rs consumeert dit package
niet over npm: het bakt acht bestanden met `include_bytes!` in de binary
en serveert ze onder een content hash. Dat zijn `css/themes.css`,
`css/components.css` en zes JavaScript-modules — `js/no-flash.js`,
`js/theme-registry.js`, `js/theme-core.js`, `js/theme-picker.js`,
`js/strings.js` en `js/components.js`. Haal die acht uit de release en
controleer ze tegen `SHA256SUMS` van v5.0.0, zoals je eigen gate al doet.

BREKENDE WIJZIGINGEN:
- Drie thema's zijn hernoemd: topo → forest, tazhib → lapis, nishiki →
  woodblock, en die vier zijn er in 6.0.0 niet meer.
  Opgeslagen voorkeuren met een oude naam worden door de
  picker gecorrigeerd naar de fallback, dus een gebruiker die `topo` had
  belandt op `formal` tenzij je migreert.
- `cyberpunk` is onder dezelfde naam een ander thema: signaalgeel in
  plaats van neon-op-violet.
- Er zijn nu vijfentwintig thema's in plaats van elf. Als je ergens een
  lijst met namen hebt hardgecodeerd in plaats van
  `js/theme-registry.js` te lezen, is dat de plek die stukgaat.

WAT ER TE HALEN VALT, EN WAT HET KOST:
- Elk thema heeft nu een eigen register, `css/<naam>-register.css`. Dat
  is één extra bestand per thema dat je wilt aanbieden. Zonder register
  krijg je de palet-laag zonder het karakter.
- De hook-features — de ticker (`data-kp-marquee`), de reveals
  (`data-kp-reveal`), de `<mark>`-nadruk die in cyberpunk een redaction
  is die oplicht, de dividers, de arrival — draaien via `js/effects.js`,
  en dat bestand bak jij vandaag NIET in. Zonder die module staan die
  elementen stil: ze renderen, ze bewegen niet. Wil je ze wel, dan is
  het één bestand erbij: de import-closure van `js/effects.js` is
  `js/effects.js` plus `js/strings.js`, en `js/strings.js` bak je al in.
  Meer is het niet.
- De lettertypes: `css/fonts.css` declareert 73 faces onder `fonts/`.
  Bak je die niet in, dan valt elk thema terug op zijn fallback-stack —
  dat werkt, maar de thema's die een echt gezicht hebben (titanium,
  lapis, deco, cyberpunk) verliezen precies dat gezicht.
- Er is een geminificeerde twin van elke stylesheet onder `dist/css/`,
  45% kleiner, met source map. Voor een binary die de bestanden zelf
  serveert is dat pure winst — let op dat de twin `url(../../fonts/)`
  gebruikt in plaats van `url(../fonts/)`, omdat hij een map dieper
  staat.
- `dist/kp-themes.css` en `dist/kp-themes.js` zijn alles in één, als je
  liever twee bestanden bakt dan acht.

WAAR JE OP LET:
- De import-closure is de reden dat je vandaag met zes JS-modules
  toekomt. Voeg je er een toe, controleer dan dat de closure klopt: één
  import naar een bestand dat je niet bakt is een 404 en dan valt de
  hele module-graph om, met de picker, de contract-enforcer, de
  confirmations en de skip links erbij. kp-themes heeft daar een eigen
  gate voor (`gates/check-closure.mjs`), maar die kent alleen de zes van
  vandaag.
- De toegankelijkheidsvloeren van kp-themes zijn sinds 2026-09-09
  advies, geen gates. Wil chassis-rs een harde ondergrond, dan is dat de
  eigen keuze en de eigen check.
- kp-themes bouwt geen tooling voor consumers (S20). Mis je iets, vraag
  het aan — bouw geen adapter.

Rapporteer wat je hebt overgenomen, wat je bewust hebt laten liggen en
waarom, en wat je bij kp-themes wilt aanvragen.
```
