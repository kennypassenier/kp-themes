# Design research for 5.0.0 — consolidated, 2026-09-07

**Purpose.** S48 (docs/SCOPE.md): 5.0.0 lifts every theme, research first, synthwave next. Before any theme is
lifted, a deep dive across dribbble.com, behance.net, webflow.com and sites like them, noting per reference which of
the twenty-four themes it fits. This document merges the four sweeps that ran on 2026-09-07 into one record so the
theme rounds (each gated by its concept demo, S46) can start from it.

**The four sweeps** (the raw reports are listed under "Sources kept"):

| Tag | Sweep                                   | Count as the report gives it                                                    |
| --- | --------------------------------------- | ------------------------------------------------------------------------------- |
| A   | Dribbble / Behance (plus Awwwards fill) | R1–R40, many bundling several shots; live sites reached through the shot links  |
| B   | Webflow, Awwwards, Codrops              | "Rough count: 46 references, 31 with measured CSS"; 20 Webflow tags, ~35 sites |
| C   | Synthwave (pens, sites, palette guides) | R1–R26; pens read through the `cdpn.io` fullpage DOM, gists through GitHub API   |
| D   | Per theme, 18 themes with an anatomy    | 43 numbered entries (my count); every theme's `anatomy.md` read first          |

**Labels.** Every claim carries the label its report gave it: **measured** = CSS/JS/JSON read from a live source by
the research agent, with the selector or value quoted; **observed** = taken from a description, image, screenshot,
tag list or article summary. The reports wrote these as MEASURED/OBSERVED, [M]/[O], M/O and Measured/Observed; they are
unified here without changing any label, and no observation is upgraded to a measurement. A site that one sweep
measured and another only observed is one entry labelled measured, citing both. "Next level" keeps each report's
own bar: a mechanism specific to the idiom, measured from a live source, that a consumer would notice on first use.

Themes light, dark, cyberpunk, high-contrast, shade-light and shade-dark were not in sweep D (it covered the
eighteen themes with an anatomy); sweep C covered synthwave only.

---

## Per theme

### 1. formal

- **anthropic.com** <https://www.anthropic.com/> — Anthropic brand team (Webflow) — **measured** [D formal R1]
  - Ivory triplet `--swatch--ivory-light:#faf9f5; --swatch--ivory-medium:#f0eee6; --swatch--ivory-dark:#e8e6dc`; slate
    `#141413 / #3d3d3a / #5e5d59`; clay `#d97757`, accent `#c6613f`, kraft `#d4a27f`, oat `#e3dacc`, olive `#788c5d`. CSS-only.
  - The body is the serif (`"Anthropic Serif",Georgia`), the display `"Anthropic Sans"` — the inverse of our Fraunces-on-headings rule.
  - Links `.u-rich-text p{text-underline-offset:.2em;text-decoration-thickness:.07em;text-wrap:pretty}`, nav hover
    `text-underline-offset:.2em`; `--radius--main:.5rem; --border-width--main:.0625rem; --focus--width:.125rem; --focus--offset-outer:.25rem`. CSS-only.
  - D flags it: Kenny's own vendor — the choice must be conscious.
- **Amsterdam Vintage Watches** <https://amsterdamvintagewatches.com> — Arvin Leeuwis, via Awwwards vintage — **measured** [A R32]
  - `font-family: Roslindale Display Condensed, serif` + `Graphik`; gold `#9b8959` (7 uses), paper `#f0eee7`, `#cecece`; no keyframes.
    A: "the condensed display serif + neutral grotesk + one gold is the measured formula". CSS-only.
- **The Public Domain Review** — **measured** [D formal R2]: the navy `#0b3c5d` + gold `#d9b310` rule pair is the closer match to our navy/bronze; details under sepia.
- Also seen: Accrual Empire <http://accrualempire.com/> (Kneadle, Dribbble 3353218) — **measured** [A R29]: `'Futura LT W01 Bold' / Medium / Light / Book / Light Oblique`
  via fonts.net, Bootstrap 3, `.text-uppercase` — ordinary, but Futura in four weights paid for. NexBank (Oui Will, SOTD 2021-01-29) and 21 Capital
  (Immersive Garden), Awwwards Black & White collection — **observed** [B]. Robinhood rebrand (custom sans "Robinhood Phonic" + serif "Martina
  Plantijn", monochrome + single accent; awwwards page 404) — **observed** [B].
- Hazards: none flagged.
- Verdict: **next level found** by D (anthropic.com, "as a corporate site done with restraint"); A and B: ordinary only.

### 2. light

- No light-specific reference in any sweep. A: "none found (Behance/Dribbble 'light' is generic SaaS)". B names **Aardvark Book Club**
  (**measured**, filed under pastel) for its rounded inset clips and soft colour pairs.
- Verdict: **next level found** only by proxy (B, Aardvark); A: nothing found.

### 3. dark

- **NOCTRA — Observatory Website** — Behance 248063485, Maria Knyazeva, 2026-04-22, 514 appreciations — **observed** [A R35]: "the cosmos as a
  space of constructed meaning", dark UI, 20+ modules, After Effects motion. Ordinary-plus.
- B names **Phantom.Land** (**measured**) and A names **Dead North**'s dark palette (**measured**) — both filed under phantom.
- Verdict: **next level found** by proxy (Phantom.Land, Dead North); no dark-only reference.

### 4. cyberpunk (built — calibration only)

- **cyberpunk2077.webflow.io** — Valdis Zhvaginsh, 2020-12-30 — **measured** [B §3]: fonts `Jetbrainsmono`, `Lack`; the Codrops glitch verbatim with
  `--gap-horizontal:10px;--gap-vertical:5px;--time-anim:4s;--delay-anim:2s;--blend-mode-4:overlay;--blend-mode-5:overlay;--blend-color-4:#fb909a;--blend-color-5:#1c1cc9`;
  `radial-gradient(circle farthest-corner at 50% 50%,#fe00fe,#da04e9 25%,#b804d3 50%,#9703bd 75%,#7700a6)`; `.cursor-wrapper{mix-blend-mode:difference}`.
- **Codrops CSS Glitch Effect** — github codrops/CSSGlitchEffect/css/demo1.css, Manoela Ilic 2017 — **measured** [B §3, §7; C R21 partial]: five stacked
  `.glitch__img` layers; `@keyframes glitch-anim-1` stepping `clip-path:polygon(0 2%,100% 2%,100% 5%,0 5%)` → `(0 15%…)` → `(0 10%,…20%)` → … `(0 70%,100% 70%,100% 80%,0 80%)`
  with `transform:translate3d(var(--gap-horizontal),0,0)`; layers delayed `calc(var(--delay-anim) + var(--time-anim)*0.2)` and `*0.25`; guarded by `@supports(clip-path:polygon(…))`;
  flash `0.5s steps(1,end)`.
- Also seen: cyberpunk2077-gangs.webflow.io (2021) — **measured** [B]: `Krona One` + `Space Grotesk`, #fcee0a on #52bedc, `.horizontal-trigger{height:calc(100% - 100vh)}`.
  Preload cyberpunk portfolio (Michael Tovmach, 2023) — **measured** [B]: `Audiowide` + `Libre Barcode 128 Text`, noise GIF under `linear-gradient(rgba(0,0,0,.88),rgba(0,0,0,.88)),url(…noise.gif)`,
  `filter:saturate(200%) blur(10px)`. VACUUM (Behance 123536355, Alla Lopatkova, 2021, 452 appreciations), «Cyberpunk. Dark Matter» (137102835, Aliona Cucerenko, 2022),
  Meichu Hackathon buttons (101395581, Yeong Jason, 2020, four pixel-art GIF buttons), Devolio (Dribbble 26606991, Vizualogy, Framer) — all **observed** [A].
- Hazards: none flagged.
- Verdict: **ordinary only** — B: "our cyberpunk already exceeds these (the 2017 Codrops recipe re-skinned)"; A: "none reaches the cyberpunk.net bar".

### 5. pastel

- **chrislemke "Risograph" example page** <https://chrislemke.github.io/website_designs/examples/Risograph.html> — Chris Lemke — **measured** [D pastel R1]
  - Drum palette `--riso-bright-red:#f15060; --riso-blue:#0078bf; --riso-yellow:#ffe800; --riso-fluo-pink:#ff48b0; --riso-teal:#00838a; --riso-purple:#765ba7; --riso-flat-gold:#bb8b41; --riso-paper:#f5f0e8`;
    overprint mixes `--riso-red-blue-mix:#6a3060; --riso-red-yellow-mix:#e87830; --riso-blue-yellow-mix:#3a8855`.
  - Misregistration `.hero__title::before{content:attr(data-text);position:absolute;top:3px;left:-3px;color:var(--riso-blue);z-index:-1;mix-blend-mode:multiply;opacity:.6}` — CSS-only;
    `multiply` is the missing half of our overprint (ours is a plain offset shadow).
  - Halftone `.halftone-bg::before{background-image:radial-gradient(circle,var(--riso-text-primary) 1px,transparent 1px);background-size:6px 6px;mix-blend-mode:multiply}`; fixed
    `body::after` grain `feTurbulence baseFrequency='0.7'`; nav underline `height:2px;background:var(--riso-bright-red);transition:width .2s`; cards `border:2px solid; transition:transform .2s`. CSS-only.
- **Aardvark Book Club** — aardvarkbookclub.com, FUTURE THREE, SOTD 2026-08-30 — **measured** [B §6]
  - Webflow + barba + lenis 1.3.17 + GSAP; fonts `Champ`, `Degular`, `Hello Organichand Webfont`.
  - Rounded inset clips `.is--outer-clip{clip-path:inset(0 round 10em)}`, `.is--inner-clip{clip-path:inset(var(--grid-margin) round 2em)}`; hard offset `filter:drop-shadow(.3125em .625em 0px var(--violet))`. CSS-only.
  - Colour pairs `--faq-color-pink:#FEB6FA/--pink-soft:#FFDBFD, --yellow:#FFD24A, --cyan:#A4F6F8/#DDFCFC, --green:#8dec7e/#CAF7C8, --periwinkle:#C2B4EB/#D7CDF1, --orange:#FBBE63/#FDDAA6`;
    overshoot easings `cubic-bezier(.34,2.27,.64,1)`, `(.45,.422,.269,1.702)`; torn tab `clip-path:polygon(5.4375em 0,100% 0,100% calc(100% - 3.4375em),5em 72%,0 42%,0% calc(100% - 13em))`. CSS-only.
- Also seen: Osman "Risograph.css" <https://osmanyy.com/projects/risograph-css/> — **observed** [D]: "a tiny CSS layer that fakes the misregistered, ink-trapped look of real Riso printing —
  with zero images", 2025-07-03; repo and demo did not resolve. Lemon Squeezy <https://www.lemonsqueezy.com/> — **measured** [D]: `--purple-600:#5423e7; --yellow-500:#ffc233; --pink-400:#f87ce4; --grey-50:#f7f7f8`,
  Circular Pro, cards `border-radius:12px;box-shadow:4px 0 6px #11112e0d,0 10px 15px #11112e14` — not next level. Pastel X template pasteltemplate.webflow.io (BRIX) — **measured** [B]: `Onest`,
  radii 24/18/16/12px, shadows `0 10px 28px 0 var(--button-shadow--color-03)`, `0 14px 42px` — ordinary. Helloplayful helloplayful.com (Pablo Alfieri) — **measured** [B]: `Adieu`, `Antiga`,
  `Founders Grotesk`; yellow #fffd13 ×27; marquee pair `@keyframes marquee{0%{translateX(-100%)}to{translateX(100%)}}` 30s with `animation-delay:-15s`; `@keyframes blink{0%,20%{color:#fffd13}}`;
  `.fancy-cursor .circle{border-radius:50%;background:#000;transition:border .4s,transform .4s}` — ordinary-plus. Pastel collection 2026 — **observed** [B]: House of Honey (Edoardo Lunardi,
  SOTD 2026-07-14; awwwards.com/sites/house-of-honey resolves to the 2023 Réplica site, #003933/#FFF8EF), Cleo AI (OddCommon, SOTD 2026-05-23), iyO (SOTD 2026-04-02), Slow Down Creative (HM 2026-06-01).
  A: none found ("pastel website" generic; Dribbble "Soft Brutalism" is neo-brutalism).
- Hazards: none flagged.
- Verdict: **next level found** (D: Lemke Riso "as a kit"; B: Aardvark "the base/soft colour pairs and the springy easings are a system").

### 6. terminal

- **PX PUSH** <https://pxpush.com> — Lewis Webber, Awwwards SOTD 2026-08-15 + Dev award — **measured** [A R10; B observed]
  - `:root{--bgcolor:#1a1a1a; --primarycolor:#bababa; --red:#ff001a; --lightblue:#9fe4f3; --blue:#03049c; --cream:#bab5a6; --green:#0f0; --columns:20; --border:1px solid hsla(0,0%,100%,.7)}`; fonts `Mono`, `SemiSqueezed` (42 px nav), `Graphik`.
  - Four separately tuned CRT layers, CSS-only: `.scanlines{opacity:.25; z-index:22}` with `::before{animation:scanline 8s linear infinite; background:#000000b3; height:clamp(2px,.1vw,3px)}` (one bar `110vh → -200vh`)
    and `::after{animation:scanlines 1s steps(60) infinite; background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.3) 51%); background-size:100% .4vw}`; `.gloom::before{backdrop-filter:blur(10px); opacity:.15}`;
    `.vignette::before{background-image:url(../img/crt.png); opacity:.7; transform:scale(1.02)}`; `.wrapper::after{animation:foreground .5s steps(1) infinite; background-image:url(../img/noise.png); mix-blend-mode:overlay; opacity:.3; width:calc(100% + 20rem)}`.
    All overlays dropped under 600 px.
  - REC indicator `header .nav .rec{--rec-glow:rgba(60,255,123,.25); color:var(--green); filter:drop-shadow(0 0 .18em var(--rec-glow)); text-shadow:0 0 .15em …, 0 0 .5em …, 0 0 .25em …}`; mobile nav wipe `clip-path: rect(0 100% 0 0)`, backdrop `#000c`, .2 s.
  - B observed: #03049C/#1a1a1a, tags Retro/WebGL/GSAP/Nuxt, "footer logo trails", "rotating founders".
- **Hover Terminal Text Effect** — hover-terminal-effect.webflow.io, Andrew Measham, 2024-06-20 (86 likes) — **measured** [B §2.1]
  - `body{background:#252a33;font-family:"JetBrains Mono";font-weight:300;text-transform:uppercase}`; scanlines `body::after{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(transparent,transparent 2px,#0000003d 3px);background-size:auto 100%;pointer-events:none}` — CSS-only.
  - Block cursor per glyph `.hover-effect--cursor-square .char{--opa:0}` / `.char::after{content:'';width:1ch;height:100%;background:currentColor;position:absolute;top:0;left:0;opacity:var(--opa)}` — the sweep of `--opa` is GSAP (observed) — needs-JS. `:root{--blendmode-effect:difference;--bg-blur:0px}`.
- **ekeijl, "Retro CRT terminal screen in CSS + JS"** <https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh> — **measured** [D terminal R2; C R20]
  - `#crt:before{…background-size:100% 8px}`; sweep band `.scanline{height:100px;background:linear-gradient(0deg,rgba(0,0,0,0) 0%,rgba(255,255,255,.2) 10%,rgba(0,0,0,.1) 100%);opacity:.1;animation:scanline 10s linear infinite}`
    with `@keyframes scanline{0%,80%{bottom:100%}100%{bottom:0}}` — once every 10 s, resting 8 s; transform-only, clears DI5. CSS-only.
  - Bezel `border:30px solid transparent;border-image-source:url(./bezel.png);border-image-slice:30 fill`; VT323 uppercase; boot `await typer("Hello world")` then `login()`; TypeIt `cursorChar:"■"`, `lifeLike:true` — needs-JS for the boot.
- Also seen: Alec Lownes CRT (the canonical recipe, three sweeps) — see "Texture" and "Hazards". `. txt` dottxt.ai (Antecâmara Studio, via Awwwards retro) — **measured** [A R11]: `@font-face{font-family:neueBitBold}` bitmap display at
  `.h1--big{line-height:.75;font-size:clamp(3.5rem,.8625rem + 13.1875vw,16.6875rem);text-transform:uppercase}`, body `PPNeueMontrealMonoBook` (28 uses); block cursor `span:last-child:after{content:"";position:absolute;left:100%;width:1ch;height:100%;background-color:currentColor;animation:HeroSection_blink .8s infinite}`;
  `anim-fade-to .2s` via `--x/--y` (`.anim-fade-to-l{--x:1rem}`); `:target` flash `rgb(251 191 36/.5)` — next level for typography. Neo Tokyo neo-tokyo.webflow.io (Ocrism Studio, 2022-07-18) — **measured** [B §2.4]: `Mega Man 10`, accent #24f29c;
  CSS floor grid `.grid-lines{background-image:linear-gradient(to right,rgba(111,207,151,.4) 1px,transparent 0),linear-gradient(to bottom,rgba(111,207,151,.4) 1px,transparent 0);background-size:4vh 3vh;transform-origin:100% 0 0;animation:play 30s linear infinite}`;
  CRT `.crt::before{…background-size:100% 4px,6px 100%}` and `.crt::after{background:rgba(18,16,16,.3);opacity:0;animation:flicker .15s infinite}`; vignette `radial-gradient(circle farthest-corner at 50% 0%,transparent 50%,#111 90%)` — next level for the grid (also synthwave).
  Typing Terminal typing-terminal.webflow.io (Webflowtips, 2022-07-21) — **measured** [B]: Typed.js, IBM Plex Mono, `.typed-cursor{font-weight:100;animation:blink .7s infinite;color:#00FD34}`, Mac chrome `box-shadow:inset 0 1px #fff9,0 1px #a8a7a7` — ordinary.
  CSS-Tricks "Old timey terminal" — **measured** [B §2.8]: `background:radial-gradient(rgba(0,150,0,.75),black 120%);font:1.3rem Inconsolata;text-shadow:0 0 5px #C8C8C8`, scanlines `repeating-linear-gradient(0deg,rgba(0,0,0,.15),rgba(0,0,0,.15) 1px,transparent 1px,transparent 2px)`,
  `::selection{background:#0080FF;text-shadow:none}`. HairyDuck/terminal — **measured** [D]: `--terminal-green:#4af626; --terminal-bg:#0a0a0a`, `text-shadow:0 0 10px rgba(74,246,38,.8)`, `.crt{animation:flicker .15s infinite}`, glitch `::before{left:2px;text-shadow:-2px 0 #ff0000}` / `::after{left:-2px;… #00ff00}` — template.
  MUTHUR-TERMINAL <https://github.com/The-weyland-yutani-corporation/MUTHUR-TERMINAL> — **measured** [D nostromo R3, "the screen — terminal's"]: `--phosphor:#33ff33; --phosphor-dim:#1a8c1a; --phosphor-bright:#66ff66; --crt-bg:#0d1a0d; --border:#1a4d1a`;
  `.crt-screen::before{repeating-linear-gradient(0deg,rgba(0,0,0,.15) 0 1px,transparent 1px 3px);animation:scanlines .1s linear}`; `@keyframes bootLine{from{opacity:0;transform:translateY(2px)}}`; `textShadowPulse` 4 s. Vault-Tec (see nostromo).
  Lumon Industries Terminal System UI (Dribbble 25845913, Jon Sabutis; codepen.io/jsabutis/pen/xbxQWqJ not fetchable), Retro Terminal UI Components (Dribbble 23160044, Pablo Sellarés), Fallout Terminal (Pixelated) (27138334, Aleksandr Shchilkin),
  Terminal 404 template (Behance 77945731, Martin Gardner, 2019) — all **observed** [A].
- Hazards: `flicker .15s infinite` (Neo Tokyo, HairyDuck, Lownes) — over DI5; PX PUSH raster jitter `steps(60)` per second and noise `steps(1)` at .5 s (A reports the figures without a DI5 verdict); MUTHUR `scanlines .1s` (see oscillating patterns).
- Verdict: **next level found** (A: PX PUSH; B: block-cursor sweep, Neo Tokyo; D: ekeijl's sweep band and bezel; D adds that the references are libraries and articles — "the site is ours to make").

### 7. topo

- **Adam Culpepper, "How I built this site's hero animation with GSAP"** <https://adamculpepper.net/blog/gsap-hero-animation> — **measured** (the article's own code) [D topo R1]
  - Contours are procedural SVG paths: a circle perturbed by `sin(angle*3+seed)*r*0.055 + sin(angle*7+seed*2.7)*r*0.028 + sin(angle*13+seed*4.1)*r*0.012`, 180 segments, `stroke: currentColor`.
  - Draw-in `gsap.to('.contour',{drawSVG:'100%',duration:1.8,ease:'power2.inOut',stagger:{each:0.12,from:'start'}})` — DOM order = elevation order; author: 0.3 s felt like waiting, 0 was a wipe, 0.12 is the feel. Needs-JS.
  - Ambient drift `x: ±9px, y: 6px, duration 14, ease sine.inOut, yoyo`, paused off-viewport and on `visibilitychange`; scroll parallax `yPercent: -7 * (index+1)`, `scrub: true`. Needs-JS.
  - Reduced motion: the stylesheet shows the finished map; `drawSVG:'0%'` is set by JS only — no-JS and reduced-motion both get the complete drawing. CSS-only static field via `stroke-dasharray`.
- **cssShowcase "Topographic Lines"** <https://www.cssshowcase.com/snippets/color/topographic-lines> — **measured** [D topo R2]: `repeating-radial-gradient(circle at 50% 50%, oklch(0.98 0 0) 0 10%, oklch(0.5 0.1 140) 10% 11%)` — rings, not terrain; a zero-asset fallback. CSS-only.
- Also seen: Topo Designs <https://www.topodesigns.com/> — **measured** [D]: IBM Plex Sans, `--animation-order: 1..12`, radius 0, no contour motif — "noted so nobody looks again". Codrops "Building Ridgeline: real-time terrain in Webflow" (2026-07-22, R3F) and
  scroll-driven SVG map path drawing (05-21) — **observed** [B]. A: none found (Behance "topographic website" returns generic sites); B: Webflow `topographic` tag empty, nothing on Awwwards.
- Hazards: none flagged.
- Verdict: **next level found** by D (Culpepper — "the reduced-motion path is the default, not a fallback"); A and B: nothing found.

### 8. high-contrast

- **Lando Norris** — landonorris.com, OFF+BRAND, Awwwards SOTY 2025 (observed) — **measured** [B §6]
  - Webflow + Lenis + Rive; `Brier` (display) + `Mona Sans Variable`; tokens `--color--lime:#d2ff00 --lime-off:#b2c73a --dark-green:#282c20 --black:#111112 --cream:#efefe5 --grey-on-track:#b9bbad`;
    `--cubic-default:cubic-bezier(.65,.05,0,1);--duration-default:.75s`; fluid rem `--fluid-font:calc(clamp(992px,100vw,1920px)/1728*16)` on `html{font-size:var(--fluid-font)}`.
  - Ghost-text button `[split-text].btn-text{text-shadow:0 var(--text-offset) currentColor}` (the second copy sits one line below and slides up); split lines clipped `[split-text] .line{clip-path:polygon(0 -2%,0 94%,100% 94%,100% -2%)}`. CSS-only (trigger JS).
  - `::selection{background:var(--color--lime);color:var(--color--black)}`, inverted under `[data-theme="lime"]`; `[data-nav-theme="light|dark"]` recolours nav on scroll; helmet reveal `clip-path:ellipse(100% 120% at 50% 0%)` from `ellipse(100% 0% at 50% 0)`; `mix-blend-mode:plus-lighter`.
- A: none found. Not in D.
- Hazards: none flagged.
- Verdict: **next level found** by B (shared with ticker); A: nothing found.

### 9. sepia

- **craigmod.com** <https://craigmod.com/> — Craig Mod — **measured** [D sepia R1]
  - `:root{--paper:#fff;--paper-2:#f7f7f7;--paper-3:#efefef;--rule:#ddd;--ink:#333;--ink-deep:#222;--ink-mute:#666;--link:#007AFC;--sel:#ffff66}` with the comment "every color on the site, named. Grays consolidated from ~40 near-duplicate hex values (2004-2026) down to this dozen";
    `--font-serif:"ff-meta-serif-web-pro-1"`, `--font-sans:"ff-meta-web-pro-1"`.
  - `a{text-decoration:underline;text-decoration-color:var(--link);text-decoration-thickness:.1em;text-underline-offset:.2em;transition:color .2s ease,text-decoration-color .2s ease}`; `.sc{font-variant:small-caps;text-transform:lowercase;font-size:1.1em}`;
    `.topblock{border-bottom:1px solid var(--paper-3);padding-bottom:5em;margin-bottom:5em}`; `h1 a.ref{margin-left:-30px}` hanging anchors. CSS-only. The paper is white — only the mechanisms transfer.
- **Miranda paper portfolio** — miranda-paper-portfolio.webflow.io, Niccolò Miranda, 2020, tag vintage — **measured** [B §5]
  - Fonts `Canopee`, `Editorial New`, `Domaine Display`; ink #1d1d1b on paper #cdc6be, accent #c03f13; `.paper-background{mix-blend-mode:multiply}` texture layer. CSS-only.
  - Drop cap `.has-dropcap:first-letter{font-family:Canopee;font-feature-settings:"ss03";float:left;font-size:7vw;line-height:5vw;background:#1D1D1B}`; hand-drawn underline `stroke-dasharray:1100;stroke-dashoffset:1100;transition:stroke-dashoffset 600ms cubic-bezier(.785,.135,.15,.86)` → `0` on hover;
    photos `filter:contrast(122%) grayscale()`; paper edge `-4px 4px 6px rgba(29,29,27,.2)`; hairlines `border-top:1px solid #1d1d1b`; WebGL images (`[data-gl-image] canvas`). B: "the best academia/sepia reference found".
- **Dead North** light palette — **measured** [A R34]: `--color-paper:#ece4d0; --color-ink:#171310; --color-signal:#b32408; --color-acid:#4d6300; --halftone:#13131638; --grain-opacity:.3; --scan-opacity:0`; the site is under phantom.
- Also seen: The Public Domain Review <https://publicdomainreview.org/> — **measured** [D sepia R2]: Alegreya + Open Sans; `#0b3c5d` navy, `#1d2731` ink, gold rules `.sitewide-banner{border-top:2px solid #d9b310;border-bottom:2px solid #d9b310}`, `#328cc1` link underline via `text-decoration-color`,
  `transition:all .3s ease` with `border-left:2px solid transparent` colouring on hover — not next level, the double gold rule is a usable divider. HEP Vintage Club <https://hepvintageclub.it> (Particolare Studio, HM 2025-12-10) — **measured** [A R31]: `PP Agrandir`; `--background:#a11e21; --card:#e9e3d8; --accent:#fcd25f; --foreground:#0a0a0a; --muted-foreground:#737373`;
  25 entrance keyframes (`heroTitleEnter, heroImageEnter, characterBounce, lampFloat, chairFloat, airplaneFloat, carPass, cardStagger, eventStagger …`) — ordinary-plus. flow-dot-matrix.webflow.io (2023) — **measured** [B]: `Dotmatrix`; tractor-feed `.paper-print{opacity:.7;background-size:20px 20px;background-image:repeating-linear-gradient(0deg,#dbfadb,#dbfadb 1px,#fff 1px,#fff)}`;
  roller shadows `inset -18px 0 20px -20px rgba(0,0,0,.56),inset 17px 0 16px -13px rgba(0,0,0,.6)`; #c0c0a0 — next level for retro/sepia printouts. Craigslist New York redesign (Behance 234359193, Goga Goginava, 2025-09-10), Nostalgique (229259183, Nakada Design, 2025),
  Old Newspaper Theme (19441167, Jayaprasad Mohanan) — **observed** [A]. Awwwards newspaper collection — **observed** [B].
- Hazards: none flagged.
- Verdict: **next level found** (D: craigmod "by discipline"; B: Miranda; A: Dead North's paper mode).

### 10. blueprint

- **vercel.com grid system** <https://vercel.com/> — Vercel design team — **measured** [D blueprint R1]
  - `.AMTIxG_gridSystem{--light-dashed-png:url(data:image/png;base64,…)}` — guide lines are a 15×15 px dashed PNG tile in `--guide-color` (dark: `var(--ds-gray-200)`). CSS-only.
  - Crosshair `.AMTIxG_cross{--cross-size:21px; --cross-half-size:calc((var(--cross-size)/2) + var(--guide-width) - .5px); inset:calc(var(--cross-half-size) * -1); position:absolute}` with `.AMTIxG_crossLine{border:var(--guide-width) solid var(--cross-color)}` — a "+" at chosen intersections, 11 px at xs. CSS-only.
  - `--ds-focus-ring: 0 0 0 2px var(--ds-background-100), 0 0 0 4px var(--form-focus-color)`; `--ds-shadow-border-base: 0 0 0 1px #00000014` — borders as box-shadows; debug `.AMTIxG_systemDebug{--debug-color-rgb:255,204,109}` paints hidden guides `1px dashed` in amber.
- **SUTÉRA — Blueprint Reality** <https://www.sutera.ch/> — Clarisse Michard, Dribbble 27158121 / 27158101 / 27158112 (2026) — **measured** [A R24]
  - `:root{--font-main:"PPNeueMontreal"; --font-lab:"NeueHaas"; --font-blueprint:"Bitter"; --font-cyber:"BrunoAce"; --color-grey:#9e9e9e; --color-dark-grey:#cbcbcb; --color-blue:#344dbb; --color-green:#59e7ca; --color-dark:#121212; --text-xxl:11.19svw; --text-xxl--line-height:.92; --text-xl:9.66svw}`.
  - Blueprint reality: `.blueprint * { cursor:url(../inner-img/Blueprint-Cursor-2.webp), default }`, `.blueprint a { cursor:url(../inner-img/Blueprint-Cursor-pointer.png) 4 0, pointer }`; `.blueprint-filter:before { background-color:var(--color-blue); inset:0; mix-blend-mode:color; z-index:2 }` (every photo tinted cyanotype);
    grid `url(../inner-img/Blueprint-Projects-Grid.svg)`; slab face Bitter. CSS-only.
  - Chamfer `.project-clip-path { clip-path: polygon(calc(var(--grid-margin)*1.41) 0, 100% 0, 100% 100%, 0 100%, 0 calc(var(--grid-margin)*1.91)) }`; the cyber reality re-tokens `.cyber { --text-xxl:8.65svw … }`. A: "the closest thing found to a themed kp-themes page".
- **teenage.engineering** <https://teenage.engineering/> — **measured** [D blueprint R3, nostromo R2]: `--header-height: calc(.0816327 * var(--client-width))`, `--footer-height: calc(.0663265 * var(--client-width))`, `--base-design-width: 980` — the page as fractions of a 980-unit sheet;
  `--te-black:#0f0e12; --te-white:#f5f5f5; --te-orange:#f05a24; --te-blue:#0071bb; --te-yellow:#fab413`; `UniversTE20T`, `UniversTE40L`; no hover rules, no keyframes. Next level as a layout idea, CSS-only.
- Also seen: Setproduct blueprint-grid guide <https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design> — **observed** [D]: line grid `linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, …)` at `24px 24px`; dot grid `radial-gradient(circle, rgba(0,0,0,.1) 1px, transparent 1px)` at 16 px; 5–10 % opacity; Geist Sans/Mono, Inter.
  Terminal Industries — **measured** [B, its best for blueprint]: 12-col grid `--grid-gutter:min(1.042vw,26.67px);--grid-margin:min(3.646vw,93.33px)`, mono tracked buttons — under nostromo. "Tech Spec" trend, studio2am.co (2026) and kittl.com — **observed** [B]: dimension lines, call-out numbers, approval stamps, mono type, cold blue + warning orange;
  "1–2 px stroke", "45° connectors", "anchor circles at endpoints", "dotted secondary connectors", Roboto Mono / Space Mono; Awwwards nominee "Containers Web Wireframe Kit" — **observed** [B]. blueprint-architecture.webflow.io — **measured** [B]: `DM Sans`, uppercase ×24, pill `border-radius:100vw`, no grid or annotation motif — name only.
- Hazards: none flagged.
- Verdict: **next level found** (D: Vercel crosshair; A: SUTÉRA; B: "no live blueprint site with readable CSS found").

### 11. solstice

- **Isabel Moranta portfolio** <https://isabelmoranta.com/> — Isabel Moranta with newkid®, Awwwards SOTD 2024 — **measured** [D solstice R1]
  - Ground `#080808`, `--white:#efefee; --grey:#848484; --black-alt:#121212`; `Ogg` (display serif) + `CentSchbook Mono BT`; `.display--1{font-size:10.5rem;letter-spacing:-.04em;line-height:.91}`, `.hero-title em{font-variant:all-small-caps;letter-spacing:-.03em}`. CSS-only.
  - `.gallery-header{position:sticky;top:100px;mix-blend-mode:difference}`, `.project-footer{position:fixed;…;mix-blend-mode:difference}` — chrome inverts over passing imagery; `.showreel-layer{backdrop-filter:blur(15px)}`. CSS-only. Observed (Awwwards): GSAP scroll reveals, WebGL konami egg.
  - D: the palette is neutral — only the mechanisms transfer.
- **Firewatch** <https://www.firewatchgame.com/> — Campo Santo (Olly Moss key art) — **measured** [D solstice R2]: `#ffaf00` amber, `#ffaf1b`, `#973700` rust, `#210002` near-black, `#ec8200`; `'Verlag A','Verlag B'`; six PNG layers `parallax0.png`…`parallax5.png` moved by `js/firewizard.js` (jQuery) — needs-JS, image-based; the triad is the useful part.
- Also seen: Retro Racer sky `linear-gradient(#181330,#761b76 30%,#c1228b 59%,#ff7f54 90%)` — **measured** [B, under synthwave]. Santioni Spirits (Active Theory + plan8, nominee 2026-08-30, comic-book, illustrated, sound) — **observed** [B]. A: none found (only HEP's warm red/cream/mustard is adjacent).
- Hazards: none flagged.
- Verdict: **next level found** by D (Moranta, typography and difference-blend chrome); A: nothing found; B: adjacent only.

### 12. brutalism

- **Gumroad** <https://gumroad.com/> — Gumroad design team — **measured** [D brutalism R1]
  - `--box-shadow-1: .25rem .25rem 0rem var(--color); --box-shadow-2: .5rem .5rem 0rem var(--color)`; `--body-bg:#f4f4f0; --pink:#ff90e8; --yellow:#f1f333; --border-width:.0625rem`; `ABC Favorit`; `font-feature-settings:"ss11","ss04"`.
  - The press gesture: `.not-active\:hover\:-translate-1:not(:active):hover{translate:-1 -1}` with `...:hover\:shadow:not(:active):hover{--tw-shadow:.25rem .25rem 0 currentColor}` and `...:hover\:shadow-none` — hover lifts the box away from its shadow, active drops it back. Ours moves onto the shadow on press only. CSS-only.
  - `--color-accent-with-text`, `--contrast-accent:0 0 0` — every plate carries its own ink token (the DI4 answer).
- **BEIGE FORCE!!** <https://beigeforce.com> — brandondurham, via Awwwards pixel-art — **measured** [A R17]
  - `@font-face{font-family:Kongtext}` (pixel) + `Monaspace Neon`; seven runtime palettes `:root,:root[data-theme=ember]{--color-bg:#ff643d} [data-theme=gold]{#f6aa28} [yellow]{#edb612} [verdant]{#31c451} [glacier]{#aedae2} [terracotta]{#e0765c} [sky]{#4da1e6}`, `--color-fg: var(--color-dark)` (`#000c`).
  - Pixel outline without a border `.play-button-text { box-shadow: -3px 0 #000, 3px 0 #000, 0 -3px #000, 0 3px #000; text-shadow: 1px 1px #fff6; letter-spacing:-.15em; word-spacing:-.6em; font: 900 21px Kongtext }`; press `.play-button:active { transform: scale(.96) translateY(3px) }`;
    relative-colour hover `.fullscreen-toggle:hover { background: oklch(from var(--color-bg) calc(l - .06) calc(c + .1) h) }`. CSS-only.
  - Loader `.loader-percent { text-shadow:-3px 3px #000; font:36px Kongtext }`, `@keyframes loading-screen-dots { 0%{width:0} to{width:3.2ch} }`; grain `body:after { mix-blend-mode:multiply; opacity:var(--grain) /* .1 */; background-image:url("data:image/svg+xml,…feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'…") }`;
    parametric bevel `--bevel-size:11px; --bevel-depth: calc(var(--bevel-size)*.54); --bevel-light-x:-.45; --bevel-light-y:-.75; --bevel-light-z:.55`.
- **Future Pharmaceutical** — future-pharmaceutical.webflow.io, Timothy Ricks, 2021 (273 clones) — **measured** [B §4]: `Morganite`; `::selection{background:#000;color:#FFF}`; marquee `.banner-move{animation:marquee-horizontal 40s linear infinite}@keyframes marquee-horizontal{from{transform:translateX(0)}to{transform:translateX(-50%)}}`;
  `.link-text{-webkit-text-stroke:.005em white}`; `.logo:hover .logo-face{transform:scale(.9)}`; `backdrop-filter:blur(1.3em)`; `radial-gradient(… rgba(56,255,247,0) 84%,rgba(56,255,247,.55))`, `linear-gradient(90deg,#4e00ff 33%,#07ecff)`. CSS-only. Next level for the 50 % marquee and text-stroke links.
- Also seen (measured, [B] unless noted): brutalist.webflow.io "2018 Trends — Brutalism" (Ryan Miyoshi, 2018, 119 likes): `VT323` + `Rubik Mono One`, `.text-shadow{text-shadow:-2px 0 blue,0 2px blue,2px 0 blue,0 -2px blue}` — ordinary, period-correct heading. brutalist-hover-effect.webflow.io (Dhruv Sachdev, 2022): `GT America Extended`, #302dd7 on #f2f2f2, `*{cursor:url(…png),auto !important}`.
  brutalist-agency-site.webflow.io: `IBM Plex Mono` + `Public Sans` + `Texgyreheros`, `letter-spacing:-.03em`, `filter:invert(59%)`, ring `box-shadow:0 0 0 8px var(--background-color--background-primary)`. brutalist-garden.webflow.io (Brook Hayfield, 2026): Arial/Helvetica, #0020f4 on #f7f7f7, `border:1px solid #ccc`, no effects — an archive of brutalist sites (source list, observed).
  Heller Studios heller.tv (Adoratorio, SOTD+DEV 2019-01-15): `NeueHaasDisplay-Roman` + `HelveticaNowText-Regular`, `backdrop-filter:blur(50px)`, `mix-blend-mode:difference`, 14 transitions on `cubic-bezier(.4,0,0,1)`, `--bg` #e2e2ca. Story of Brutalism <https://storyofbrutalism.com> (MAGWAI, HM 2024-01-15; #000000/#EB504E observed) — **measured** [A R22; B]: Tilda, `'Inter-Kharkiv'` (88 uses), fixed 70 px header with `clip-path:inset(0 0 0 0)`.
  brutalistwebsites.com <https://brutalistwebsites.com/> (Pascal Deville) — **measured** [D brutalism R2; A R23 observed the index]: the entire stylesheet is `body{font-family:monospace;background-color:#eee;margin:40px}` plus `.box`/`.screenshot`, images inline `style="width:400px"` — "the idiom's no-mechanism statement"; index of ~20 sites (diss-list.com, nelsonheinemann.com, middleplane.com, utrecht.jp, arrangementstudio.com …), none fetched.
  Studio K95 k95.it (SOTD 2026-08-11): font `adaptive`, `--color-bg:#1500e1` (Klein blue), `@keyframes mobileCharIn{0%{transform:translateY(1em)}}` in `.gsap-char-reveal-wrap{overflow:hidden}`, `.cursor.is-hovering{border-color:var(--color-white);height:45px;width:45px}`, vignette `radial-gradient(138% 138% at 50% 50%,transparent 40%,rgba(0,0,0,.32) 66%,rgba(0,0,0,.82) 88%,#000)`, `box-shadow:0 0 0 200vmax #fff` — ordinary-plus.
  CIPHER cipher.tv (Magnetism, SOTD 2026-08-20): `Arizona` + `Favorit`, `--color-dark:#060403 --color-light:#e9eae4`, `.cursor_label{mix-blend-mode:difference;text-transform:uppercase;transition:opacity .3s}` — ordinary. Observed: Monolith (Dribbble 27514720, LAIN, 2026: "distressed, compressed lettering", "a single pink against deep black") [A];
  SL24 (Behance 247026671, Kseniya Artman, 2026-04-05, 410 appreciations: "strict 12-column Swiss grid", "technical micro-typography, scanning matrices, and inventory codes", graphite / concrete / steel / safety orange) [A]; Patrick David Creative Studio (Behance 101997827, 2020, 6.3 K), Brutalist Website (180965847, Valeryia Pastushenko, 2023), Brutalist website exploration (Dribbble 19056626, Algirdas Jasaitis) [A];
  USSR Futurism (Maria Kulakova, HM 2023-07-14, #393939/#A53636) [B]; Houkago Calpis calpis.info/houkago (2020; text marquee, emoji, "echo/trail effect"; site now returns 379 bytes) [B].
- Hazards: none flagged.
- Verdict: **next level found** (D: Gumroad's lift/drop pair; A: BEIGE FORCE; B: Future Pharmaceutical).

### 13. deco

- **Le Bathyscaphe** — bathyscaphe.webflow.io, Vincent Bidaux, 2016-11-25 (54 likes, tag artdeco) — **measured** [B §5]
  - Typekit `old-standard` (12 rules), `birch-std` (8), Google `Limelight`, `Poiret One`, `Righteous`; palette #202020 #db6a2f #060714 #ece9e8 #ab8b5c.
  - Stacked inset frames `box-shadow:inset 0 0 0 3px #db6a2f,inset 0 0 0 6px #000,inset 0 0 0 8px #fff,inset 0 0 0 15px #db6a2f` and the b/w variant `inset 0 0 0 3px #fff,inset 0 0 0 6px #000,inset 0 0 0 8px #fff,inset 0 0 0 15px #000`; card lift `inset 0 0 0 3px #202020,0 0 33px 1px rgba(32,32,32,.61)`;
    `.double{border-style:double}`; sepia photos `filter:saturate(0%) sepia(11%)`; oval `clip-path:ellipse(50% 50% at 50% 50%)`. CSS-only — "four concentric inset shadows give a true deco frame with zero markup".
- **Empire State Building** <https://www.esbnyc.com/> — ESRT digital team (Tailwind 4) — **measured** [D deco R1]
  - Gold ramp `--brand-50:#faf8f2 … --brand-400:#c1a976; --brand-500:#b4945b; --brand-600:#a7814f; --brand-700:#8b6943 … --brand-1000:#312419`; `esbTitling` (custom Deco titling) + `proximaNova`.
  - Notched cartouche `clip-path:polygon(0 0,100% 0,100% calc(50% - 10px),calc(100% - 10px) 50%,100% calc(50% + 10px),100% 100%,0 100%,0 calc(50% + 10px),10px 50%,0 calc(50% - 10px))` — a 10 px chevron bite mid-edge; wedge `.before\:\[clip-path\:polygon\(0_72\%\,100\%_0\,100\%_100\%\,0_100\%\)\]`;
    `hover:border-[#c1a976]`, `hover:decoration-[#ad9a5c]`. CSS-only.
- Also seen: DESIGN.md "Gatsby Art Deco Noir" <https://designmd.app/library/gatsby-art-deco-noir/> — **observed** [D]: `#050507` ground, `#F2E6CF` cream, `#D4AF37` gold, `#C5A059` foil; Playfair Display; `border: 2px solid #D4AF37`; entry "fade + translateY 16px→0 over 540 ms ease-out", stagger 120 ms; hover `scale 1.03`, active `translateY(-1px)`; recommends metallic gradients (anatomy forbids).
  Nick Herasimenka nickhh.webflow.io (2022) — **measured** [B]: `Trovas` + `zeitung-mono`; `letter-spacing:1em` uppercase eyebrows; card entrance `transform:translate3d(0,70%,-90px) rotateX(-92deg) skew(3deg,-12deg)`; `.mbm-ex{mix-blend-mode:exclusion}`; `font-variant-ligatures:common-ligatures`; body `1.111vw` capped at 20px — ordinary-plus.
  BAR167 bar167-staging.webflow.io (Holy Moly, 2024) — **measured** [B]: `Tenor Sans` + `Nexa`; `linear-gradient(180deg,var(--transparent) 80%,var(--white) 80%),url(…Sand texture.png)`; `mix-blend-mode:darken`; `letter-spacing:-4px`; `::selection{background:#F1D3D3;color:#2A3140}`; `text-underline-position:under;text-decoration-thickness:.1em` — ordinary.
  Artdeco template artdeco-template.webflow.io — **measured** [B]: Montserrat/PT Sans/Oswald, uppercase ×35, `letter-spacing:1px` ×24, `border-radius:0` ×44, `filter:hue-rotate(236deg)`, #6a4ee1 #0057ff #003497 #ffa332 — not deco. Accrual Empire (under formal, Futura ×4). CINEMA REX (Behance 244296399, Gaelle Neaymeh, 2026-02-17: red–gold–black, seating map),
  Great Gatsby (151537641, Daria Chalkova, 2022), Art Deco / Old Time Radio (Behance 34930999, Samuel Jackson, 2016; samueljackson.co now Divi/WordPress with Luckiest Guy + Livvic; the "on the air" lamp idea) — **observed** [A]. Vander Hotel (.RAW, nominee 2026-08-29; not deco per tags) — **observed** [B].
- Hazards: none flagged.
- Verdict: **next level found** (B: concentric inset frames; D: chevron cartouche and eleven-step ramp); A: ordinary only.

### 14. academia

- **chrislemke "Dark Editorial" example page** <https://chrislemke.github.io/website_designs/examples/Dark_Editorial.html> — Chris Lemke — **measured** [D academia R1]
  - `--de-obsidian:#0C0C0E; --de-charcoal:#1C1B1F; --de-parchment:#E8E4DF; --de-ivory:#F5F2ED; --de-gold:#C9A84C; --de-brass:#A8872A; --de-burgundy:#6B1D2A; --de-wine:#8C2F3E; --de-sage:#4A5D4A; --de-border-gold: rgba(201,168,76,0.2)`; Cormorant Garamond, Playfair Display, Source Sans 3.
  - Ribbon underline `.nav-links a::after{width:0;height:1px;background:var(--de-gold);transition:width .3s ease}` → hover `width:40px`; `.nav-links a{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}`. CSS-only.
  - Grain `.hero-bg::before`, `.effect-grain::before` inline `feTurbulence type='fractalNoise'`; duotone `.effect-duotone::before{linear-gradient(135deg, rgba(107,29,42,.3) 0%, transparent 40%, rgba(201,168,76,.15) 80%…)}` with `mix-blend-mode` over images — the mechanism our theme lacks, CSS-only; reveals via one `IntersectionObserver`.
- **Mosby's Files** — mosbyfiles.com, Tubik, Awwwards SOTD 2026-08-13 (the awwwards page 404s) — **measured** [B §2.8]
  - `Signifier` (serif), `Founders Grotesk`, `IBM Plex Mono` nav `.the-nav__item{font-family:IBM Plex Mono;opacity:.8;transition:opacity .65s}`; header `backdrop-filter:blur(100px);background:#191919cc`; easing `cubic-bezier(.33,1,.68,1)`.
  - Folder stack in CSS 3D: `:root{--stack-perspective:3000px;--stack-rotation-angle:-3deg;--stack-rotation-offset:1rem;--stack-shadow:0 -1px 8px rgba(0,0,0,.15);--folder-shadow:1px 0 8px rgba(0,0,0,.15);--tag-height:2.75rem;--tag-aspect-ratio:1.409}`;
    `.stack-group.is-rotated{transform:rotateX(var(--stack-rotation-angle)) translateZ(calc(2px*var(--v…)))}`; tabs `.tag{font-family:Signifier;font-size:1.625rem;height:var(--tag-height)}` with mirrored caps `.tag__start{transform:scale(-1,1.01)}`. CSS-only. Fits academia/sepia as much as nostromo.
- Also seen: Miranda paper portfolio (under sepia; B's "best academia/sepia"). Digital Heroes "Dark Academia Web Design" <https://digitalheroesco.com/styles/dark-academia/> (Aanya B., 2026-05-11) — **observed** [D]: oxblood `#6c1818`, forest `#1f3a2e`, parchment `#f0e6d2`, candle gold `#c9a86a`, ink `#14110e`, mahogany `#4a2c1d`; EB Garamond / Lora / Source Sans;
  gold drop caps, hairline rules, "one candle-gold accent moment per viewport", line-height ≥ 1.7. Elden Books (Behance 185721589, Gabrielė Rukuižaitė, 2023-11-30), Dark Academia Interactive Website (171679703, Yohana Molina, 2023, Figma/PowerPoint) — **observed** [A].
- Hazards: none flagged.
- Verdict: **next level found** (D: Lemke "as a kit"; B: Mosby's folder stack); A: ordinary only.

### 15. phantom

- **Omicron69 "persona5-style-portfolio"** <https://github.com/Omicron69/persona5-style-portfolio> (`css/style.css`) — **measured** [D phantom R1]
  - `#e60012` red, `#c4000f`, `#a3000c`, `#0b0b0d` ground, `#f6f4ef` paper, `#d8d5cf`; `'Archivo Black'`, `'Barlow Condensed'` (the Barlow our theme chose).
  - Menu highlight `.menu-item::before{left:-4%;top:18%;height:70%;width:0;background:var(--black);transform:skewX(-16deg);transition:width .18s cubic-bezier(.7,0,.3,1)}` — a skewed bar grows behind the item. CSS-only.
  - The tear `#slash{position:fixed;inset:0;background:var(--black);clip-path:polygon(58% 0,100% 0,100% 100%,40% 100%,52% 62%,45% 60%,60% 24%,51% 22%);transition:clip-path …}`, collapsing to a rectangle off-home — needs-JS (trigger only).
  - `.card::before{clip-path:polygon(0 6%,3% 0,100% 0,100% 88%,97% 100%,0 100%)}`; `.hud-tag{transform:rotate(-2deg);box-shadow:4px 4px 0 rgba(0,0,0,.35)}`; key caps `skewX(-8deg)`; headings `text-shadow:2px 2px 0 var(--black)`; `.screen-head::after{…skewX(-24deg)}` red slab. Every gesture is a transform or clip-path — clears DI5.
- **Dead North** <https://deadnorth.io> — dane-petersen, via Awwwards retro — **measured** [A R34], "the best-measured site in this sweep"
  - Font roles `--font-shout:"Anton", Impact…; --font-tele:"Courier Prime", "Courier New"…; --font-noir:"Bodoni Moda", "Bodoni 72", Didot…; --font-body:"Avenir Next", Futura…`; dark palette `--color-paper:#0d0b08; --color-ink:#ece4d0; --color-signal:#ff3b12; --color-acid:#c6ff3d; --color-amber:#ffb347; --halftone:#e9e5da29; --grain-opacity:.1; --scan-opacity:.025` (light palette under sepia).
  - Three fixed texture layers: `.dn-ground { background-image: radial-gradient(circle at center, var(--halftone) .9px, transparent 1px); background-size:7px 7px; opacity:.55 }`; `.dn-grain { opacity:var(--grain-opacity); mix-blend-mode:soft-light; background-image:url("data:image/svg+xml,…feTurbulence baseFrequency='.82' numOctaves='3'…feColorMatrix type='saturate' values='0'…") }`;
    `.dn-scan { opacity:var(--scan-opacity); background: repeating-linear-gradient(#fff 0 1px, #0000 1px 3px) }`. CSS-only.
  - Scroll-driven without JS: `animation: linear both dn-ignite-color view(); animation-range: entry 30% entry 80%` with `@keyframes dn-ignite-color { to { color: var(--color-signal) } }`; `background-size:220% 100%; animation: linear both dn-rail-sweep view(); animation-range: entry 10% entry 85%`. CSS-only.
  - Film cuts `animation: .18s steps(3,end) both dn-cut-in` with `0% { opacity:0; filter: contrast(1.9) saturate(0) brightness(1.15); transform: translateY(2px) } 60% { filter: contrast(1.3) saturate(.6) }`, `.1s steps(2,end) both dn-cut-out { to { opacity:0; filter: contrast(1.6) brightness(1.3) } }`;
    headline `animation: .75s cubic-bezier(.22,1,.36,1) forwards dn-shout-in; animation-delay: calc(var(--i) * 28ms)`; `dn-smoke-drift 7s ease-in-out infinite alternate`; reduced motion `.dn-ground,.dn-scan,.dn-grain,canvas,[data-snd],[data-motion-toggle] { display:none!important } * { transition:none!important; animation:none!important }`.
- **Phantom.Land** — Phantom, Awwwards SOTD 2025-06-02 (#202020 observed) — **measured** [B §4]: Next.js; `Helvetica Now` + `ballinger-mono`; loader `Loader_skew-left{50%{transform:skew(-20deg)}}`, `Loader_move-out-left{to{transform:translateX(-10vw)}}`; `mask:linear-gradient(#000,rgba(0,0,0,.6) 75%,transparent)`;
  easings `cubic-bezier(.81,-.01,0,1)`, `(.16,1,.3,1)`, `(.93,-.24,.4,1.17)` (overshoot); accents #ff6b00 #1eff66 #a1f4e2. Next level for the skew-split loader; a literal name match.
- Also seen: ant-8 "persona-menu" <https://github.com/ant-8/persona-menu> — **measured** [D]: `.LoadCard{transform:rotate(-20deg)}`, keyframe `clip-path:polygon(10% 10%,89% 6%,94% 91%,10% 90%)`→`(1% 5%,93% 29%,88% 87%,6% 60%)`, outlines by four-way `text-shadow ±3px 0 #000` — fixed pixel layout, the outline text is the cheap letterform.
  The Obsidian Assembly (Fiddle.Digital, SOTD 2026-04-14, #151415/#F1EADE, particle gallery, text-on-path) — **observed** [B]. NOCTRA (under dark) — **observed** [A].
- Hazards: none flagged (D notes Omicron69 clears DI5 by construction).
- Verdict: **next level found** in all three sweeps that covered it.

### 16. ticker

- **Lando Norris** marquee — **measured** [B]: `[data-css-marquee-list="left"]{animation:translateXLeft 30s linear infinite;animation-play-state:paused}` edge-faded by `mask-image:linear-gradient(90deg,transparent,white 7.5%,white 92.5%,transparent)` — paused until visible. CSS-only (play state by JS). The site is under high-contrast.
- **Curio, "Bloomberg Terminal (CRT Green)" style guide** <https://designbycurio.com/learn/bloomberg-terminal-green> — **observed** [D ticker R1]: dividers "single pixel-width line in a dim colour, not a border"; "rigid panels — typically four quadrants"; transitions "cuts, not dissolves"; hierarchy by brightness; navigation by typed codes; no hex given. Confirms anatomy.
- Also seen: Bloomberg UX "Designing the Terminal for color accessibility" — 403/robot wall to both fetchers, not read [D]. Fortress dashboard <https://fortress-shadcn.dashboardpack.com/docs> — **observed** [D]: IBM Plex Sans/Mono, three table densities, six OKLCh presets, Framer Motion, a $69 template. `feremabraz/bloomberg-terminal` (GitHub) — **measured** [D]: stock shadcn tokens, `--font-mono: "Courier New"`.
  Edge Hound (Dribbble 27299323, Ivo Ivanov), Stock ticker dashboard (15985106, Caboodle Studio), Fintech Dashboard dark theme (15120400 / 22938817, Ronas IT: "navy shades in the background and vibrant blue and green colors for highlighted elements"), Bloomberg redesign (Behance 164032149, Kirill Komarov, 2023), T7 Trading Terminal (154678121, Ilya Borisuk, 2022), FoxStock (252683765) — **observed** [A R40].
  Boot Sequence's "scrolling marquee ticker on every page" is the only described ticker mechanism [A R14, under retro]. Sharplink (Studio Freight, SOTD 2026-08-27, #0E76FF/#F3F3F3, Vue/Three/GSAP, "institutional-grade Ethereum treasury") — **observed** [B], not fetched.
- Hazards: none flagged (D: anatomy already refuses the flash on update).
- Verdict: **nothing found** for the idiom — D: "the idiom's canonical instance is proprietary"; A: mockups only; B supplies a generic marquee primitive.

### 17. nishiki

- **The World of Yokai** <https://yokaiworld.tilda.ws/en> — Behance 199884395, Anastasia Liechtenstein, 2024-05-30 (Tilda) — **measured** from the page HTML (2.2 MB) [A R37]: `'DelaGothicOne'` (32 uses) + `'Manrope'`; `#1f1c1d` (143), `#d52a17` (86, vermilion), `#7f7368`, `#fff705` (61), `#c8b6a4` (paper), `#e9840a`;
  125 `data-animate-sbs-event="scroll"`, 34 `="hover"`, 27 `="blockintoview"`, 35 looped — most illustration parts move on scroll (builder JS). Next-level choreography, ordinary CSS.
- **HIFUMIKAN** — hifumikan.webflow.io (2022, tag japanese) — **measured** [B §5]: `Alegreya`/`Alegreya Sans` + `source-han-sans-japanese`/`Noto Sans JP`; `mix-blend-mode:multiply`; hairline rhythm `border-top:1px solid var(--grey)` ×10; #041b20 #3f3e46 #dab77f #ffa26c #83aecb #ccb283. Ordinary-plus, CSS-only.
- **css-pattern.com "Waves"** <https://css-pattern.com/> — Temani Afif — **measured** [D nishiki R3]: a seigaiha-class scallop from eight `radial-gradient(37.5% 12.5% at 62.5% …)` tiles over `repeating-linear-gradient`, `background-size: calc(4*30px) calc(12*30px)`, two colours, zero assets. CSS-only — the one transferable item.
- Also seen: Adachi Institute of Woodcut Prints <https://www.adachi-hanga.com/en/> — **measured** [D]: `'Noto Serif JP'`, `'Noto Sans JP'`, `'Playfair Display'`; `a, a img{transition:all .7s ease}`; hamburger `#000` 26×2 px; `hr{border-top:1px solid #ccc}`; no pattern, no keyframes. Ukiyoe Immersive Art Exhibition <https://www.ukiyoeimmersiveart.com/tokyo/en> — **measured** [D]: Montserrat + Noto Sans JP, gold `#b6a66d` on `#010101`, decorative images at `opacity:.3–.6` — builder template.
  Experience Japan experience-japan.webflow.io (2020) — **measured** [B]: `Bison`, `Droid Serif`; `linear-gradient(#0000,#a7abaf),url(…Fuji.png)`; vermilion #bf3030/#992e2e on #fffdf8; `text-shadow:0 1px 1px var(--brown)` — ordinary. IZANAMI (baqemono, SOTD+DEV 2026-07-18, #0A0801/#D9D7D4, WebGL/GSAP, "spirit of Wa") and Treasures of Japan (Mirror, SOTD 2024-10-05, #EBAFBE, game mechanics) — **observed** [B]; nothing on brocade or pattern in the listings.
- Hazards: none flagged.
- Verdict: **ordinary only** — D says plainly "nothing next level found for the print idiom itself"; A's choreography is builder-driven; B: ordinary-plus.

### 18. shade-light

- **NOTHIN'** — noth.in, Thomas Carré, Awwwards SOTD 2026-08-10 (#FFF/#000 observed) — **measured** [B §4]: Webflow; `Ppneuemontreal` + `IBM Plex Mono`; `.glitch{background:var(--black);overflow:clip}`; section seam `.section-separator-blur{background-image:linear-gradient(0deg,black,var(--transparent));height:10rem;inset:-10rem 0% auto}`;
  cursor label `.cursor-work{font:12px IBM Plex Mono;letter-spacing:.03em;text-transform:uppercase;border-radius:100px;padding:.125rem .75rem}`; scattered "n-cursor" glyphs rotated `34deg`; `mix-blend-mode:difference`; blurs 10/20/80px. CSS-only. Next level for the mono cursor-label and the blurred seam.
- A: none found. Not in D.
- Verdict: **next level found** by B; A: nothing found.

### 19. shade-dark

- **The Obsidian Assembly** — Fiddle.Digital, SOTD 2026-04-14, #151415/#F1EADE, particle gallery, text-on-path — **observed** [B]; not fetched. A: none found. Not in D.
- Verdict: **nothing found** beyond one observed candidate.

### 20. mono

- **rauno.me** <https://rauno.me/> — Rauno Freiberg (Vercel) — **measured** [D mono R1]
  - Radix-style `--colors-gray1…12` light and dark (`--colors-bg:#FFF` / `#000`); `JetBrains Mono`; `.index_cross{mix-blend-mode:difference}`.
  - Overhanging hairline `.gridLine{--color:var(--colors-gray9);--offset:-100px;--height:1px;--width:5px;--fade-stop:90%;width:calc(100% + var(--offset));left:calc(var(--offset) / 2 * -1);background:linear-gradient(to right,var(--color),var(--color) 50%,…)}` — runs 50 px past the box each side, fades at 90 %. CSS-only.
  - `.verticalFade[data-side=top]{mask-image:linear-gradient(to bottom,var(--colors-gray1) 25%,transparent)}` — content fades under chrome by mask; `.switchboard .light{width:1px;height:1px;border-radius:9999px;transition:transform var(--transition-duration) ease}`; cursors as state `cursor:copy`, `.cursor-none *`, `.cursor-resizing-ew *`. CSS-only.
- **Maximilian Kaspar** — maximilian-kaspar-portfolio.webflow.io, 2025-11-13 — **measured** [B §2.7]: `Neue Montreal Mono`, all `text-transform:lowercase`; GSAP ScrambleTextPlugin + barba + lenis; `a:hover{background-color:black;color:white}` (the right mono link); page transition four columns `.transition_column{width:calc(25% ± 2.5px)}`; `mix-blend-mode:difference` cursor. Ordinary-plus.
- **Monospace** — monospace.be, maneuver, Awwwards HM 2025-02-04 (tags scramble text, custom cursor, loader, 404 game-over — observed) — **measured** [B §2.6]: `Ibmplexmono`, `Spacegrotesk`, `Helveticanowdisplay`; `--brand-primary:#2b2b2b --brand-secondary:#f1f1f1 --brand-tertiary:#fb7d64`;
  `@keyframes moveMarquee{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}` 50s desktop / 60s mobile, second row `reverse`; `mask-image:linear-gradient(#0000,#000 70%,#000)`; easings `cubic-bezier(.645,.045,.355,1)`, `(.625,.05,0,1)`. Ordinary CSS; the value is the observed pattern list.
- Also seen: vercel.com Geist tokens — **measured** [D mono R2]: `--ds-gray-100:#f2f2f2 … --ds-gray-1000:#171717` with `--ds-gray-*-value: 0,0%,95% … 9%`; `--ds-background-200:#fafafa`; alpha greys `--ds-gray-alpha-100:#0000000d … -1000:#000000e8`; `--ds-shadow-menu`, `--ds-shadow-modal` as `border-base + 1px/8px/24px` stacks; `GeistSans`, `Geist Mono`; underline only on `:hover`. Our 9 %/14 % ink split matches `--ds-gray-1000` at 9 %.
  Neutomni <https://neutomni.com> (Webflow, via Awwwards) — **measured** [A R26]: `Firacode` (4); `.slide_mask { cursor:none; clip-path: polygon(0 0,100% 0,100% 101%,0 101%) }`; `.cta_link { text-transform:uppercase; font-size:14px; transition: text-shadow .6s cubic-bezier(.175,.885,.32,1.275) }`; `.file_name { text-shadow: 0 0 10px #00000026 }`; accent `#cf1830` — ordinary-plus.
  Gionatan Nese '26 <https://gionatannese.com> (SOTD 2026-09-05) — **measured** [A R25]: `var(--font-lay-grotesk)` + `Teodor`, `.mix-blend-difference`/`.mix-blend-exclusion` utilities (Tailwind), `#EDEDED` — motion is JS, CSS ordinary. dottxt.ai (under terminal).
- Hazards: none flagged.
- Verdict: **next level found** by D (rauno.me); A and B: ordinary-plus.

### 21. retro

- **98.css v0.1.20** <https://jdan.github.io/98.css/> — Jordan Scales — **measured** [D retro R1]
  - Raised `box-shadow:inset -1px -1px #0a0a0a,inset 1px 1px #fff,inset -2px -2px grey,inset 2px 2px #dfdfdf`; pressed `:active{box-shadow:inset -1px -1px #fff,inset 1px 1px #0a0a0a,inset -2px -2px #dfdfdf,inset 2px 2px grey;text-shadow:1px 1px #222}` — the label shifts 1 px with the bevel; sunken `inset -1px -1px #fff,inset 1px 1px grey,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a`. CSS-only.
  - Title bar `linear-gradient(90deg,navy,#1084d0)`, inactive `linear-gradient(90deg,grey,#b5b5b5)`; window `padding:3px`; `fieldset{border-image:url("data:image/svg+xml…") 2}` (5×5 SVG groove); tabs `menu[role=tablist]>li[aria-selected=true]{margin-top:-2px;margin-left:-3px}`; scrollbar track a 2×2 checkerboard SVG (dither);
    `font-family:"Pixelated MS Sans Serif"` at 11 px with `-webkit-font-smoothing:none`. CSS-only.
- **Win95 Best of Sofia Game Jam** — best-of-sgj.webflow.io, Alex Tokmakchiev, 2018 (1.1k clones) — **measured** [B §6]: `'MS Sans Serif'` ×14, `Inconsolata`, `Oswald`; `.start-button{border:1px solid;border-color:#fff #000 #000 #fff;background:silver}`, pressed `.start-button-pressed{border-color:#000 #fff #fff #000}`;
  sunken field `border-color:#000 silver silver #000`; taskbar `border-top:1px solid #fff;box-shadow:0 0 0 1px silver`; `.game-screen{box-shadow:3px 3px 0 1px #000}`. CSS-only — "the two-line bevel is the whole OS look".
- **2bit.chat** — dot_matrix_apps, via Awwwards retro — **measured** [A R12]: `--gb-darkest:#0f380f; --gb-dark:#306230; --gb-light:#8bac0f; --gb-lightest:#9bbc0f`, `--gb-plastic:silver; --gb-plastic-shadow:gray; --gb-plastic-highlight:#e0e0e0; --gb-button-a:#8b1a4a; --font-pixel:"Press Start 2P"`; `body { image-rendering: pixelated }`;
  `.pixel-inset { border-top/left: 3px solid var(--gb-plastic-shadow); border-right/bottom: 3px solid var(--gb-plastic-highlight) }` and `.pixel-outset` reversed; buttons `box-shadow: 2px 3px 0 var(--gb-ab-shadow-dark), -1px -1px 0 var(--gb-ab-shadow-light), inset 0 -2px 4px #0000004d`;
  `@keyframes scanline { 0%{top:-4px} to{top:100%} }` on a 4-px `linear-gradient(#fff0,#ffffff2e,#fff0)` bar, 8 s; `blink { 0%,49%{opacity:1} 50%,to{opacity:0} }` at `1s step-end infinite`; `receipt-print`; `case-shimmer-sweep` (20°, `-150%→250%`); `.shell-groove { height:2px; background: linear-gradient(to bottom, #999, #b8b8b8, #d0d0d0); box-shadow: 0 1px #fff9, inset 0 1px 1px #0000002e }`. CSS-only.
- Also seen: Portfolio 95 <https://portifolio95.vercel.app> (Behance 205263707, Artur Medeiros, 2024-08-10; React95) — **measured** from the JS bundle [A R16]: raised `box-shadow: inset 1px 1px 0px 1px ${borderLightest}, 1px 1px 0 1px ${borderDarkest}`; sunken `inset 0px 0px 0px 2px ${borderDark}`; frame `-1px -1px 0 1px ${borderDark}, inset -1px -1px 0 1px ${borderDark}`;
  theme `material:#0180ff, materialDark:#9a9e9c, borderDark:#05427f, borderLight:#2b8fff, borderLightest:#7ebfff, borderDarkest:#000000, headerBackground:#171123, hoverBackground:#F46036, desktopBackground:#ff7d01, tooltip:#fefbcc, progress:#F46036`. Y2K buttons y2k-buttons.webflow.io (2022) — **measured** [B]: aqua `linear-gradient(180deg,#5cd0ff,#214acd 50%,#5cd0ff)`, brushed `linear-gradient(180deg,#d6d6d6,#afafaf)`,
  pink `linear-gradient(180deg,rgba(250,201,236,.95),rgba(183,97,184,.7)),url(…pattern.svg),linear-gradient(135deg,#fac9ec,#c76993)`; gel `box-shadow:1px 1px 4px -1px rgba(0,0,0,.2),inset -4px -4px 3px 0 hsla(0,0%,100%,.4)`; focus `border:1px dashed #000` — next level for a y2k register. NW pixelated page transition nw-pixelated-page-transition.webflow.io (2024-12-22) — **measured** [B]: `Pixelify Sans` + `Rubik Pixels`; `.transition{display:grid}rect{stroke:currentColor;stroke-width:1px}` filled by GSAP (observed) — next level, needs-JS.
  Polaroids polaroids.webflow.io (2022) — **measured** [B]: `'Speedymarker k4ol'`; `cursor:url(…cursor.svg) 16 0,auto`; frame `inset 0 0 1px -1px rgba(0,19,97,.1),0 0 4px 2px rgba(0,19,97,.1)` — ordinary. Decathlon Yestalgia (index, SOTD+DEV 2026-08-28, #000/#F3AFCC, "celebrating the 90's") — **measured** + observed [B]: WordPress; Roboto Flex with 10 axes `opsz,wdth,wght,XOPQ,XTRA,YOPQ,YTDE,YTFI,YTLC,YTUC@8..144,25..151,100..1000,96,468,79,-203,738,514,712`; #d7dd44; 7.54 creativity (observed).
  Gateway Galaxy <https://gatewaygalaxy.com> (Powster, Awwwards HM 2026-08-04) — **measured** [A R6; B observed]: `proxima-nova`; loader `radial-gradient(circle at center, #0024c4, #140a53)` with `@keyframes boltApp__loadingBreathe { 50% { opacity:1; transform:scale(1.2) } }`, `header__pop { from scale(0) }`, `autoExpandingBar { width:0→100% }`, forced-landscape overlay; B: "Hello Visitor" terminal greeting — ordinary, the game is canvas. flow-dot-matrix (under sepia); BEIGE FORCE (under brutalism).
  Boot Sequence — Retro OS Portfolio (Dribbble 27228473, Ammar Zafar, 2026) — **observed** [A R14]: "#C0C0C0 Win95 gray, #000080 navy title bars, #008080 teal, and Amiga orange accents", "CRT scanline overlays, beveled borders, chunky pixel typography, and a scrolling marquee ticker on every page". Windows 95 Inspired Portfolio (Dribbble 11444365, Hannah Blair), Design System | Windows 95 (Behance 193543611, Patricia Pascual Romero, 2024),
  Windows 95 UI Kit (Dribbble 7037433, Themesberg; demo.themesberg.com/windows-95-ui-kit 429 on first fetch, later Bootstrap 4 with no theme CSS captured) — **observed** [A R18]. Awwwards Retro collection (101 items): Block Rage, Chocapic Nutri-Game (8-bit), Shelter In Space space.airkhruang.com (HM 2020), Stereo stereo.ca ("crazy retro brutalist"), Sing Sing, Jean Dawson (MOUTHWASH); PouyaOS (HM 2026-08-07); "Hidden interactions inspired in 90s interfaces" — **observed** [B].
- Hazards: 98.css focus `outline:1px dotted #000; outline-offset:-4px` — DI2 forbids this (anatomy already says so).
- Verdict: **next level found** (D: 98.css; B: SGJ bevel, Y2K, pixel dissolve; A: 2bit.chat, the React95 formula).

### 22. grotesk

- **Grilli Type** <https://www.grillitype.com/> — **measured** [D grotesk R1]: `header{display:grid;grid-template-columns:repeat(14,1fr);padding:10px 0}`, `#main-container.with-sidebar{grid-template-columns:2fr 12fr}`; `a{color:#8c8c8c;transition-duration:.1s;ease-out}` → `a:hover{color:#000;transition-duration:.15s}` (faster in than out);
  `.highlight-freeformhtml .content-column{font-size:8vw;line-height:1.05;color:#a8a8a8}` → hover `#8c8c8c`; buttons `border:1px solid #a0a0a0;border-radius:5px;height:40px`; `Alp-Con-*`, `Alp-Ext-*` (GT Alpina); no keyframes; greys `#f9f9f9…#323232` plus `#30ff00`. CSS-only.
- **Hiroto Sato** — hirotos.com, Awwwards SOTD+DEV 2026-07-17 — **measured** [B §4]: Typekit `helvetica-neue-lt-pro` (+cond), `gazzetta-variable`; #0b0b0a on #e9e6df; marquee gallery `@keyframes projectsGalleryLoop{to{transform:translate(-50%)}}` with `:nth-child(8n+2)…` sizes; sticker cursor `.sticker-cursor-preview{width:102px;filter:drop-shadow(0 5px 8px #0000001f)}`;
  page transition `filter:blur(var(--transition-content-blur)) brightness(var(--transition-content-brightness))` — next level, two custom properties. CSS-only (values driven by JS).
- **SUTÉRA** main reality (`PPNeueMontreal` / `NeueHaas`, the `svw` scale) — **measured** [A R24], under blueprint.
- Also seen: Swiss Typefaces <https://www.swisstypefaces.com/> — **measured** [D]: `.text-00{font-size:13.75rem;line-height:1.2em;font-weight:300;font-family:Euclid Triangle}`, `h1{font-size:4.375rem}`; print `a[href^="http"]:after{content:" (" attr(href) ")"}`; `--focus-shadow: 0 0 .1875rem .125rem hsla(200,56%,49%,1), inset 0 0 .125rem .0625rem …`; accents `#0086FF`, `#FFFF00`, `#00FFA7`.
  macaspac.webflow.io (Leanne Macaspac, 2022, tags y2k/pixel) — **measured** [B]: `Neue pixel grotesk`, `FK Raster Roman Compact`; `border:2px solid #000`, pills `border-radius:100px`, `li:before{content:"✧"}`; #ff9500 #0144f5 #e8c500 on #1e1e1e — a pixel-grotesk register. Janis Oppliger janisoppliger.webflow.io (2019, tag swiss) — **measured** [B]: `Wask new webfont` + `nimbus-sans`, uppercase `letter-spacing:1px`, no effects.
  Gionatan Nese (under mono). Swiss-style portfolio (Behance 201610823, Дизайн Студия Мох, 2024), Dark Redesign Concept Swiss Style (199048287, Gelios Studio, 2024, tag "helvetica"), Editorial webdesign — Armin Hofmann (66936415, Arno De Coninck, 2018) — **observed** [A R27]. Impermanence, White Square (Adoratorio), Stone and Style (Garden Eight), Peter Lindbergh (Obys) — Awwwards Black & White, **observed** [B].
- Hazards: none flagged.
- Verdict: **next level found** (D: Grilli grid and two-speed link; B: Hiroto Sato's blur+brightness transition).

### 23. tazhib

- **Curio, "Islamic Girih Tiles"** <https://designbycurio.com/islamic-girih-tile-geometry> — **observed** (WebFetch) [D tazhib R1]: lapis `#0E3A5C`/`#0A2540`, gold `#C9A227`, turquoise `rgba(43,183,176,.22)`, cream `rgba(242,239,230,.6)`; the ruling `border:2px solid #C9A227; box-shadow: inset 0 0 0 1px #0E3A5C, inset 0 0 0 3px rgba(242,239,230,.6), inset 0 0 0 4px #C9A227` — four rings in one declaration;
  a 96 px star tile from `repeating-conic-gradient`; sheen `linear-gradient(135deg, rgba(242,239,230,.10), transparent)`; durations 120/250/400/600 ms; Reem Kufi, Noto Naskh Arabic. "Next level as a recipe", CSS-only — better than our single inset hairline.
- **IGPA (Islamic Geometric Patterns Archive)** — Behance 222189509, Arash Hosseini, 2025-03-24 — **observed** [A R38]: "morphing geometric patterns that transition between content categories", a central "spin wheel" per category and region, "only black and two shades of gray", logo from chalipa and shamseh motifs. Next-level concept, no code. Behance `tazhib` (90+ results) is illumination artwork; Siraa Crafts' frames (178882963) are ornament reference only.
- Also seen: Girih Tiles Explorer <https://girih.app/> — Cormorant Garamond + Inter **measured**, the pattern is canvas (observed) [D]. Fitzwilliam Shahnameh <https://shahnameh.fitzmuseum.cam.ac.uk/> — **measured** [D]: Bootstrap 4, Crimson Text, `#bc1a3a`, `#731200`, `#0f7290`; nothing idiomatic. B: no Awwwards match — the UAE listing (30 sites) is tech/real-estate; Dubai Always (#ff6e00, game) and Tamannaah (quiet luxury, #F7F7F7) carry no ornament (observed).
- Hazards: none flagged.
- Verdict: **nothing found** at the bar (D: "recipes and a canvas toy, no site"; B: "none found"; A: an observed concept). The four-ring ruling is the one take.

### 24. nostromo

- **Terminal Industries** — terminal-industries.com, REJOUICE + PROPAGANDE, Awwwards SOTD 2025-09-03 (animations 8.80/10 observed) — **measured** [B §2.5]
  - Nuxt + Tailwind 3.4.19; `--font-mono` on 38 rules; `.inline-subscribe-form__submit{font-family:var(--font-mono);font-size:.8125rem;font-weight:600;letter-spacing:2.34px;text-transform:uppercase;height:3rem;border-radius:.25rem;background:var(--c-dark-green);transition:background .2s ease,color .2s ease}`; lime CTA `.drawer-cta-button{background:var(--c-lime);letter-spacing:1.5px;font-size:.6875rem}`. CSS-only.
  - Popdown by clip `@keyframes popdown-in{0%{clip-path:inset(0 0 100% 0);opacity:0}to{clip-path:inset(0 0 0 0);opacity:1}}.popdown-enter-active{animation:popdown-in .25s cubic-bezier(.16,1,.3,1)}`; scroll cue `@keyframes color-transition{0%{color:var(--c-light-light-gray)}30%{color:var(--c-lime)}to{color:var(--c-dark-green)}}`. CSS-only.
  - The "Notch section" clip is a runtime variable `.slot.use-clip{clip-path:var(--d27fb6da)}` / `mask-image:var(--b18bdda2)` — computed in JS, not readable; `.path-background.gradient-mask{mask-image:linear-gradient(180deg,transparent 0,#fff 15%,#fff 85%,transparent)}`; glass `.phone-panel{backdrop-filter:blur(30px);background:#454742fa;border:1px solid hsla(0,0%,100%,.12);box-shadow:0 8px 32px #00000080}`; canvas video sequence on scroll.
- **Fallout terminal (Vault-Tec)** — vaultec.webflow.io, Dopamine Studio, 2024-04-17 — **measured** [B §2.3]: `Monofonto Rg`, `Fixedsys Excelsior 3`, `Bogart`; #18580b #0d2209 #7aff60 #ddf941 #3a4038 #e30614; `.typed-words::after{content:" ■";animation:blink 1s infinite}`; `text-shadow:5px 5px #e30614`; `html,body{cursor:none}` with a custom cursor.
  `@keyframes flickerAnimation{0%{opacity:1}50%{opacity:0}100%{opacity:1}}.animate-flicker{animation:flickerAnimation .1s infinite}` — opacity 1→0 at 10 Hz, **fails DI5** (B). Next level in intent; the palette and fonts are the value.
- **Typeset in the Future, "Alien"** <https://typesetinthefuture.com/2014/12/01/alien/> — Dave Addey — **observed** [D nostromo R1]: crew nameplates and NOSTROMO in Pump Demi; helmet labels Helvetica; title crawl Helvetica Black; MU/TH/UR screen "an optically stretched City Light"; Ron Cobb's Semiotic Standard icons are rounded-rectangle pictograms.
- Also seen: teenage.engineering (under blueprint; `--te-orange:#f05a24; --te-grey-500:#a1a7af; --product-background-color:#f5f5f5`) — the closest live thing to a hardware panel with a label-tape register. MUTHUR-TERMINAL (under terminal — a screen, which terminal owns). Semiotic Standard (Behance 78297841, Boris Tovmasyan, 2019-04-07; Behance 35584247, Guillermo Díaz del Río, 2016-04-21) — **observed** [A R39]:
  Cobb's semantics — red = vital/alert, white and grey = life support, black = vacuum/hazard, yellow = harmful active process, blue = reduced thermal, green = non-human biological; Díaz del Río's video uses "CRT monitor texture and graphics of that time (1978)". P1 Terminal (Behance 254986515, Shaun Wellens, 2026-09-01; Shuttle middeck computer, 3D render) — **observed** [A]. Dribbble "alien nostromo ui" returns nothing relevant [A].
- Hazards: Vault-Tec flicker `.1s infinite` (10 Hz).
- Verdict: **nothing found** for the case (D: "no live 'case' interface at the bar"; A: only the colour-semantics table); B's Terminal Industries is next level for the adjacent mono/terminal controls.

### 25. synthwave (the next theme — not yet in the 24)

C's first finding: synthwave has no cyberpunk.net — the artists sit on Wix, Squarespace and Bandcamp; the vocabulary lives in one VS Code theme, one radio app and CodePen work. A and B disagree in part: A's r4ms3s.cz and B's Retro Racer are hand-made live sites, both measured.

- **Synthwave '84** — robb0wen, `github.com/robb0wen/synthwave-vscode` (`themes/synthwave-color-theme.json`, `synthwave84.css`, `src/css/editor_chrome.css`, `src/js/theme_template.js`) — **measured** [C R1]
  - Grounds: editor `#262335`, `linear-gradient(to bottom, #2a2139 75%, #34294f)`, bars `#241b2f`, activity bar `#171520`. Accents: pink `#ff7edb` / `#f92aad` (glow core), cyan `#36f9f6` / `#03edf9`, yellow `#fede5d` / `#fff951`, orange `#ff8b39`, coral `#f97e72`, red `#fe4450`, green `#72f1b8`, muted `#848bbd`.
  - The glow, verbatim from `theme_template.js` (`[NEON_BRIGHTNESS]` = brightness × 255 in hex, default `0.45`): `'ff7edb': color:#f92aad; text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3`; `'36f9f6': color:#fdfdfd; text-shadow: 0 0 2px #001716, 0 0 3px #03edf9[B], 0 0 5px #03edf9[B], 0 0 8px #03edf9[B]`;
    `'fe4450': color:#fff5f6; text-shadow: 0 0 2px #000, 0 0 10px #fc1f2c[B], 0 0 5px #fc1f2c[B], 0 0 25px #fc1f2c[B]` — the core is near-white, the colour is in the shadow. CSS-only.
  - Chrome: active tab stripe `height:4px; background: linear-gradient(to right, #fc28a8, #03edf9)`; underglow `box-shadow: inset 0 -5px 25px #fc28a825`; badge `linear-gradient(to bottom, #fff951 25%, #fc28a8)`; icons `filter: drop-shadow(0 0 5px #03edf9)`. README: the glow "isn't intended for extended use".
- **"CSS 3D Grid OutRun Design"** — Ion Emil Negoita (inegoita), pen `BgdXMw`, read from gist `codingdudecom/1f9c416339fb7dcb7cef12170d411be6` — **measured** [C R9], the most complete CSS-only scene
  - Sky `linear-gradient(to bottom, #010310 0, #0c1142 24%, #45125e 45%, #d53567 60%, #f0c3d9 65%, #0c1142 65%)` — a hard stop at 65% reads as the horizon.
  - Grid: two `repeating-linear-gradient(90deg / 180deg, var(--grid-color) 0%, transparent calc(1px + var(--grid-blur)), transparent var(--grid-size), …)` with `--grid-color: rgba(115,59,139,0.7); --grid-size: 30px; --grid-blur: 1px`; `transform: perspective(50vh) rotateX(60deg) translateZ(10px)`; `@keyframes moving-grid` translateY(−grid-size → +grid-size) `0.5s infinite linear` (too fast, C).
  - Sun: `200px` circle, `linear-gradient(red, yellow)`, `clip-path: polygon(…)` with seven slits at 55–62%, 70–75%, 80–82%, 85–87%, 90–92%, 95–96%; `box-shadow: rgba(255,128,0,0.7) 0 0 20px`. Mountains border-triangles `skewX(var(--mountain-tilt))`, `#a684cb` over `#b533b3 / #681e6b / #2a025d / #150030`; clouds `feTurbulence` + `feDisplacementMap scale 50↔180` over 3s.
  - Chrome text (Montserrat 900): `linear-gradient(#2989cc 0%, #d3e5ec 50%, #592451 51%, #b3628d 55%, #592451 59%, #b3628d 65%, #ac86a6 75%, #b3628d 100%)`, `-webkit-background-clip: text; -webkit-text-fill-color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.4)`; extrusion on `::before` `text-shadow: -1px -1px 1px #2989cc, -2px -2px 1px #2989cc, -3px -3px 1px #2989cc, 1px 1px 1px #000, …`;
    shine `::after` `linear-gradient(225deg, transparent 53%, white 55%, transparent 58%)`, `background-size: 400% 400%`, `@keyframes shine` 0→100→0 over 10s; spark `blur(0.5px)`, `@keyframes blip` scale 0→1.2→1 + rotate 180° in the first 8% of 5s. Neon (Road Rage) `@keyframes glow` 1s alternate `0 0 10px #fff … 0 0 70px #e60073` ↔ `0 0 20px #fff … 0 0 80px #ff4da6`; stars 25 `box-shadow` points, `glitter` .5→.9→.5 over 2s. All CSS-only.
- **r4ms3s.cz** <https://www.r4ms3s.cz/> — Dribbble 6790085, Jaromir Kavan (design) for Petr Urbánek (code), 2019 — **measured** from `/css/style.css?v=1337` [A R1]
  - `font-family: trumpgothicpro, 'Oswald'`; `#020716` (12 uses), `#4ff7b2` mint (hover `border-color:#4ff7b2`), `#8178b9`, `#231872`, `#443a9a`, `#ef00d8` (1 use), `#6488dc`; header `background: linear-gradient(to bottom, #04010b 0%, #231872 100%)`, `position:fixed; height:100vh` — the sky is a fixed layer.
  - RGB-split by layered clones: `header h1 .logo-2 { filter: hue-rotate(60deg) saturate(4); animation: glitch-logo 8s cubic-bezier(0,.82,1,.42) reverse both infinite }`, `.logo-3 { filter: hue-rotate(270deg) saturate(4); animation: glitch-logo 10s … infinite }` — `translate(-10px,10px) skew(-10deg,0)` at 20–26 %, `opacity:0` for the first 18–19 % — rare by construction. Thumbnails `.img-2 { hue-rotate(60deg) saturate(4) }`, `.img-3 { hue-rotate(180deg) }`, `glitch-work` (`translate(-2%,2%) scale(1.04)` at 20 %). CSS-only.
  - Shooting star `.star { height:2px; border-radius:999px; background: linear-gradient(-45deg,#fff,rgba(0,0,255,0)); filter: drop-shadow(0 0 6px #fff); animation: star-tail 10s ease-in-out infinite, star-shooting 10s … }` — width 0→100px at 10–20 %, `translateX(300px)`; one per 10 s. Keyframes `glitch-logo, glitch-typo, glitch-typo-scale, glitch-work, socialimg, socialoverlay, star-shooting, star-tail`.
  - Sound: `.sound-btn` + wavesurfer.js in `/js/app.js` (147 KB, jQuery 2.2.4); the distance→volume mapping is observed only. Needs-JS.
- **Retro Racer** — retro-racer.webflow.io, Alex Hartan, 2023-05-07 — **measured** [B §1.1]: `Upheavtt` (pixel, self-hosted); body `#1a0633`, `font-size: 1vw`; sky `.sky{height:68%;background-image:linear-gradient(#181330,#761b76 30%,#c1228b 59%,#ff7f54 90%)}`;
  sun `.sun{width:9em;height:9em;background-image:linear-gradient(#ff00d5,#ffbf7f 40%,#ffa940);border-radius:50%;margin-bottom:-4em;box-shadow:inset 0 0 50px rgba(255,255,255,.5),0 0 25px #ff80aa}`; haze `.mist{height:45%;background-image:linear-gradient(to bottom,rgba(229,166,103,0),var(--sandy-brown) 50%,rgba(229,166,103,0));bottom:-25%}`;
  a real plane `.foreground{perspective:1em;transform-style:preserve-3d}` + `.street{transform-origin:50% 100%;background-image:radial-gradient(circle at 50% 0,#ff4cc3 33%,#150040);top:-50%;left:-30%;right:-30%;transform:rotateX(158deg)}` with `.street-grid{mix-blend-mode:overlay;background-image:url(…tile.png);background-size:10%}`;
  `.pixel-grid{opacity:.5;mix-blend-mode:overlay;…background-size:1px}`; text through a pixel mask `.loading-text{-webkit-text-fill-color:transparent;background-image:linear-gradient(rgba(185,255,158,.75),rgba(185,255,158,.75)),url(…pixel-grid.png);background-size:auto,2px;background-clip:text}`; `.logo-cyan,.text-cyan{mix-blend-mode:screen}`; palette #181330 #761b76 #c1228b #ff7f54 #ff00d5 #ffbf7f #ffa940 #ff80aa #ff4cc3 #150040 #1a0633. Next level, CSS-only.
- The sun, measured three ways (all CSS-only):
  - Konstantin Denerz, "Animated Retrowave (CSS)", pen `WNgEqbG` — **measured** [C R10]: `--labs-sys-color-grid: #fac4ff; --grid-glow: #df7373; --sun-1: #fdb428; --sun-2: #f672ca; --sun-glow: #b9f; --star: #f6c0c0; --triangle: #6eccee; --base-speed: 4s`; sun `width: min(40vmin, 40%)`, `filter: drop-shadow(0 0 4rem var(--sun-glow))`;
    cuts as a mask `@property --shift { syntax: "<number>"; initial-value: 0 }`, `mask: linear-gradient(to top, #000 calc(1% + 3.5% * var(--shift)), 0%, #0000 calc(8% + 2.8% * var(--shift)), 0%, #000 calc(10% + 3.5% * var(--shift)), …)`, `mask-size: 100% 120%`, `@keyframes sun { from { --shift: 1 } to { --shift: 3.8 } }` at `calc(var(--base-speed) / 4)` = 1s linear infinite;
    reflection `::before` `translateY(100%) rotateX(40deg) scaleY(1.2); filter: blur(20px)`; grid `background-size: 2rem 125rem, 125rem 2rem; transform: rotateX(53deg) scale(1.8) translateZ(43px)` in `perspective: 14.5rem`, `border-top: 1px solid var(--grid)`, `drop-shadow(0 0 2px var(--grid-glow))`, `@keyframes grid { from { background-position-y: -30rem } to { 0% } }` 4s;
    mountains `clip-path: polygon(0% 38%, 2.6% 40%, 5.4% 24%, 8.7% 59%, 13.6% 72%, …)` on `#222` plus `backdrop-filter: blur(20px)` + `mix-blend-mode: soft-light`; sky scanlines `top-lines` at `opacity: 0.06`. "The cleanest sun on the web"; the 1s loop is a DI5 question.
  - Fabrizio Calderan, "Retrowave Sunset", pens `XWPyKNz` / `vYzQbEm`, fabrizio.dev — **measured** [C R11]: `#sun { --under: #f9124f; inline-size: min(35vh, 80%); aspect-ratio: 1; filter: drop-shadow(0 0 1.5rem var(--under)); background: radial-gradient(circle, var(--under) 0 53%, transparent 60%) }`; `::before { background: linear-gradient(#fcc22f, #f945e5); mask: linear-gradient(to top, #000 1.5%, #0000 2%, #0000 5%, #000 5.5%, #000 7.5%, #0000 8%, … #000 53.5%, #0000 54%, #0000 54.2%, #000 0) }` —
    17 cuts, every gap a constant 0.5%, bands widening ~2.5% to ~6%, stopping at 54%. Floor `conic-gradient(from 90deg at 1px 1px, #0000 90deg, #cdf 0) 0 0 / 10vw 7vw` on `#2f2222`, `rotateX(78deg)`, `transform-origin: 50% 0%`, horizon glow `box-shadow: 0 -70px 80px #cdf, -70px -70px 80px #cdf, 70px -70px 80px #cdf`, `@keyframes bg { to { background-position: 0 7vw } }` at `.8s linear infinite` — one cell per cycle, seamless.
  - Adam Argyle, "Retro Wave Gradient", nerdy.dev/retro-wave-sun (2023-02-25) — **measured** [C R12]: `mask: linear-gradient(to top, #000 1%, 0%, #0000 8%, 0%, #000 10%, 0%, #0000 16%, 0%, #000 19%, 0%, #0000 24%, 0%, #000 28%, 0%, #0000 32%, 0%, #000 37%, 0%, #0000 40%, 0%, #000 46%, 0%, #0000 48%, 0%, #000 55%, 0%, #0000 56%, 0%, #000 57%)` — band n = n %, gap n = (8 − n) %; static. The rule to generate our cuts from a token.
- The grid, further measurements (CSS-only): synthwave-mix.webflow.io (Aaron Rudyk, 2019-09-19) — **measured** [B §1.2]: `Road rage` + Montserrat; `.heading-large{color:#df0edb;letter-spacing:.14em;text-transform:uppercase;text-shadow:0 0 .6vw #8d008a;font-size:5vw}`, `.heading-small{color:#fff;letter-spacing:.4em;text-shadow:0 0 .6vw #830080;font-size:2vw}` (glow scaled in `vw`);
  `.background-moving{perspective:686px}`, `.background-img{transform:perspective(8000px)rotateX(78deg)}`, tile `.bg--inner-2{height:300vh;…background-size:21vh;top:-180vh}`, edge glow `box-shadow:1px 1px 24px #08c1c2`; `.nav__text{letter-spacing:.2em;text-transform:uppercase;font:14px "Road rage"}`; `.nav__transition-block{background-color:#df0edb}`; palette #df0edb #8d008a #830080 #08c1c2 #20193a #0a0a0a.
  Neo Tokyo (under terminal, the cheapest correct CSS grid, 30s). Pierre Darrieutort, "Synthwave road", pen `Vwaoqqe` — **measured** [C R13]: sky in 12 stops `linear-gradient(to top, #0f0209, #23061d, #330531, #3e024b, #41056a, #520578, #640385, #770092, #9b0089, #b8007e, #ce1173, #e03168)`; grid `40px` of `rgba(255,255,255,.2) 1px`, `rotateX(50deg); transform-origin: top center` in `perspective: 800px`, `crawlingWall` 5s.
  Arden de Raaij, "Retro 80's style grid and logo", pen `amqoVJ` — **measured** [C R14]: body `linear-gradient(to bottom, #6A0275 10%, #040C4A 60%)`; h1 `"Press Start 2P"` with `-webkit-linear-gradient(top, #3fa8c6 0%, #ff9ab2 100%)` clipped; subtitle `"Mr Dafoe"` in `#ec008c`; double lines (`rgba(236,0,140,.5) 25%, rgba(236,0,140,.9) 26%`) at `50px`, `perspective(300px) rotateX(80deg)`, `fly` 1s; scanlines `3px 3px`; wrapper `filter: blur(1px)`.
  Jane (propjockey), "to the future", pen `VwKQENg` — **measured** [C R16]: `@property --outrun` 0→1 over `0.6s linear infinite`, rows `--l{n}: var(--hor) + n² × var(--distance) + ((n+1)² − n²) × var(--distance) × var(--pos)` (`--hor: 60%; --distance: 0.5%`), verticals one SVG data-URI of 26 lines; `hsl(219,79%,66%)` lines, `hsl(319,100%,60%)`, `hsl(266,49%,25%)`, `hsl(60,82%,58%)` — the only computed perspective.
  Magic UI "Retro Grid", `magicuidesign/magicui` `apps/www/registry/magicui/retro-grid.tsx` — **measured** [C R22]: WebGL shader (`ANIMATION_DURATION_SECONDS 15, PERSPECTIVE_PX 200, angle 65°, cellSize 60, opacity 0.5, GRID_LINE_WIDTH_PX 0.92`), `IntersectionObserver` pauses off-screen; CSS fallback `perspective: 200px; rotateX(65deg)`, `h-[300vh] w-[600vw] ml-[-200%]`, 1px lines at `60px`, `@keyframes retro-grid-fallback-scroll { from { translateY(-50%) } to { 0 } }` 15s, reduced motion `animation: none; transform: translateY(-50%)` — needs-JS for the pause.
  Maxime Heckel, Three.js vaporwave scene (blog) — **measured** [C R23]: `camera (0, 0.06, 1.1)`, plane 1×2, 24×24 grid texture, `displacementScale 0.4`, `plane.position.z = (t × 0.15) % 2`, `RGBShiftShader amount 0.0015`, `Fog('#000000', 1, 2.5)` — calibration only (S44).
- Chrome and neon (CSS-only unless noted): inegoita's SVG-filter gists (Kabel Black & Streamster `8c30ba…`, Hauser `1b219d…`, Neon 80s `d425ca…`, Stranger Things `b90e3b…`; coding-dude.com) — **measured** [C R17]: `feImage` of the repeating gradient composited `in` the glyphs; bevel `feMorphology dilate r=5 → feGaussianBlur σ=10 → feSpecularLighting surfaceScale=2 specularConstant=1 specularExponent=10 lighting-color=white, fePointLight (400,0,500)`;
  `#reflection` (`circle r=25% fill=#ff11ff`, blur σ=15); outer glow `feMorphology dilate 2 → blur 5 → feFlood #ff11ff`; neon `filter: url(#stroke) url(#inner-glow) url(#outer-glow) url(#outer-glow1)` with floods `#e10b8d`, `#db0273`, `#530139` (σ 0.5 / 5 / 25); grain `feTurbulence fractalNoise baseFrequency 0.8 numOctaves 10` — hero-only (ten-octave turbulence is costly).
  Patrice Poliquin, "CSS Chrome text effect", pen `mdyZdQj` — **measured** [C R18]: `background: linear-gradient(180deg, #fff 0, #fff 50%, #9e9e9e 80%, #6e6e6e 90%); background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 1px 0 rgba(255,255,255,0.7))`. Tono Nogueras, "Neon Ghost Unit", pen `bGVjpNb` — **measured** [C R15]: `Righteous` + `Mr Dafoe`; chrome `-webkit-linear-gradient(#C3BFB4 0%, #FDFCFA 50%, #E8E7E5 51%, #757172 52%, #E8E9DB 100%)` with `-webkit-text-stroke: 0.1px rgba(240,8,183,0.37)`;
  title `text-shadow: 0 0 9px #c0a832, 0 0 15px #c0a832, 0 0 5px #c0a832`; grid `#f6007b` / `#FF7FBF` at 12px, `perspective(170px) rotateX(65deg)`, 15s; inset two-colour vignette `box-shadow: inset 0 0 25px 1px #000, inset 0 0 50px 1px #0ff, inset 0 0 100px 1px #f50abe` — "a mechanism nobody else has"; travelling scanline `height:1px; rgba(255,255,102,.3)` over 7s; `pulse` 1.7s.
  George Park neon flicker, pen `MrjbEr` (and Silvia O'Dwyer on CSS-Tricks) — **measured** [C R19]: `Exo 2` 200 italic, `--neon-text-color: #f40; --neon-border-color: #08f`; `animation: flicker 1.5s infinite alternate`; on `text-shadow: -0.2rem -0.2rem 1rem #fff, 0.2rem 0.2rem 1rem #fff, 0 0 2rem/4rem/6rem/8rem/10rem var(--neon-text-color)`; off at `20%, 24%, 55%`;
  CSS-Tricks stack `0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa`. Neon cloneables — **measured** [B §1.6]: neon-button.webflow.io (2021) `box-shadow:inset 0 0 .5em 0 #ff00b7,0 0 .5em 0 #ff00b7` → hover `…0 0 2em 0 #ff00b7`, `text-shadow:0 0 .125em rgba(255,255,255,.5),0 0 .5em #ff00b7`, `.bottom-shadow` with `filter:blur(1em)`;
  neon-text-web.webflow.io (2021) `Klaxons`, `text-shadow:0 0 40px #000,0 0 40px #9646fd`; card-neon-glow-effect-on-hover.webflow.io (2025-10-03) `border:color-mix(in oklch,var(--neon--base)85%,white 15%)`, six-layer `box-shadow:0 0 300px 20px var(--neon--soft),0 0 30px 4px var(--neon--mid),0 0 6px 1px var(--neon--strong),inset 0 0 120px 10px var(--neon--soft),inset 0 0 30px 4px var(--neon--mid),inset 0 0 4px 1px var(--neon--strong)`, bases #ffc42e #ff3131 #39ff14 #1f51ff — next level as a glow system.
- CRT, glitch, VHS: Lucas Bebber pen `XJRdrV` / Alec Lownes / ekeijl — **measured** [C R20] (under "Texture" and "Hazards"; turn-on 4s `scale(1,0.8)` → `brightness(30)` → `contrast(0) brightness(0)` → `contrast(1) brightness(1.2) saturate(1.3)`, turn-off 0.55s to `scale(0, 0.0001) brightness(50)`, font `VT323`). effect-labs.com blog — **measured** [C R21]: glitch `::before/::after { content: attr(data-text) }`, `#ff00ff` / `#00ffff`, `clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%)` + lower half, `glitchTop 2s` / `glitchBottom 3s` translateX ±3px;
  RGB split `text-shadow: 2px 0 #ff0000` / `-2px 0 #00ffff`, `rgbShift 0.5s alternate`; VHS `repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,.3) 2px 4px)` with `scanlines 0.1s` translateY 4px, `vhsFlicker 0.15s` opacity 1↔0.98; noise `feTurbulence baseFrequency 0.9 numOctaves 3`, `opacity .15`, `noiseAnim 0.2s` ±1%; reduced-motion block `animation: none`. C: the cyberpunk register's `fx-glitch-a/b`, `fx-rgb-split` already carry a one-shot version.
- Sites and registers: nightride.fm — **measured** [A R2 from `static/css/main.css?v=21`; C R2 computed styles]: `@font-face{font-family:"unscii16"}`, `pre { font-family: unscii16, Inconsolata, monospace; line-height:1 }`, `* { font-smooth:never; -webkit-font-smoothing:none }`; `body` tokens `--background-1:#111111; --background-2:#181818; --text-primary:#aaaaaa; --gradient-stop-0:#CC00FF; --gradient-stop-1:#7F00FF; --gradient: linear-gradient(to top, var(--gradient-stop-1), var(--gradient-stop-0)); --border-size: max(0.1vmin,1px); --font-size: min(max(12px,3vw),26px)`
  (C: body `#181818`, text `#aaaaaa`, active `#FFFFFF`, `--gradient-radial: rgba(204,0,255,0.1)`); station re-tokens `.chillsynth { --background-1:#26303c; --gradient: linear-gradient(to top,#375c77,#6f5b76,#c76c7f,#ff747b,#ffd6ae) }`, `.rekt { --gradient-stop-0:#FD0000; --gradient-stop-1:#980000 }`; four fixed overlays `.overlay.noise { z-index:800; animation: grain 8s steps(10) infinite; background-image:url(/static/img/noise.png); height:400%; width:300%; opacity:.2 }`,
  `.overlay.scanlines { z-index:900; background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,.25) 50%), linear-gradient(90deg, rgba(255,0,0,.06), rgba(0,255,0,.03), rgba(0,0,255,.06)); background-size: 100% 2px, 3px 100% }`, `.overlay.flicker { z-index:950; background: rgba(9,8,8,.05); animation: flicker .05s infinite linear }` (A; C: "duration not read"), `.overlay.scanline { z-index:1010; animation: scanline 7.77s linear infinite }`;
  neon `text-shadow: 1px 1px 2px #3dcd9a, 0 0 25px #3dcd9a, 0 0 5px #3dcd9a` and `text-shadow: 1px 1px 2px var(--gradient-stop-0), 0 0 1vmin var(--gradient-stop-0), 0 0 5px var(--gradient-stop-0)`; `body.has-not-pressed-play #playerPlay svg … { animation: glow 2s linear infinite }`, `@keyframes glow { 50% { filter: drop-shadow(0 0 10px var(--gradient-stop-1)); opacity:1 } }`; menu `nav.menu a { box-shadow: inset 0 calc(-1*var(--border-size)) var(--text-primary) }`; `scrollbar-color: var(--gradient-stop-1) var(--background-2)`;
  site settings expose Scanlines / Noise / Flicker toggles (observed) — the model for our opt-in. hotlinemiami.com (`/gate`, Devolver) — **measured** [C R3]: headings `noto-serif-bold, Georgia, serif` italic, body `noto-sans-regular`; yellow `#eebb16`, magenta `#dc005d`, cyan `#5beadc`, white on `#000`; labels `letter-spacing: 2px–4px; text-transform: uppercase` — the Miami register, one display role.
  retronovaworld.webflow.io (Nicola Romei, SOTD 2024-09-08) — **measured** [C R4]: `--background: #070707; --creamy-white: #f3edd8; --golden-bell: #fd8a46; --color-2: #008aa1; --color: #a24eb5`; WT Skrappa, PP Supply Mono, PP Neue Montreal, OffBit; `scan-overlay` (`background-position 0 0 → 0 -100%`), marquee `scroll`; boot text "VER. 2.1::24.005 · STATUS CHECK......OK · CALIBRATING NEURAL UPLINK · PROGRESS 0% <UNABLE TO CANCEL> · SKIP LOADING" — retrofuturism; the loading sequence is the thing to borrow.
  radicalicons.com / radicaldesigncourse.com / jackmcdade.com (Jack McDade) — **measured** [C R5]: `Bobby Jones Soft` (+ Outline), `VCR_OSD_MONO`, `Brandon Text`; `#212121`; `wiggle`, `shake`; personal site `rgb(0,255,255)` with `#f7f474` h1. PixelFleek pixelfleek.com (Matt McCarson, 2025) — **measured** [B §1.4]: `degular`; `--base-color-brand--dark-purple:#18001e; --purple:#310050; --pink:#ab22fb; --teal:#6bc9c9; --gold:#ffbf0b; --light-violet:#f6e8ff; --focus-state:#2d62ff`;
  glass pill `.sticky-nav{border:1px solid var(--border-color--border-primary);backdrop-filter:blur(12px);background-color:#18001ee8;border-radius:900px;position:fixed;inset:auto 0% 0}`; `.button:hover{border-color:var(--base-color-brand--teal);backdrop-filter:blur(5px);color:var(--base-color-brand--teal);background-color:#31005000}` (the fill disappears); `.button-line-15{background-image:linear-gradient(351deg,transparent 20%,var(--base-color-brand--teal)52%,transparent 85%);width:0%;height:1px;…}` (width by IX, observed); every transition `.325s`.
  90's Retro Style / Cubic portfolio cubic-portfolio.webflow.io (Dhruv Sachdev, 2022-03-24) — **measured** [B §1.3]: `.body{background:#000;color:#b6fff5}`; `.floating-block{border:2px solid #b6fff5}`; `.block-content:hover{background-color:#b6fff5;box-shadow:0 0 10rem .1px #b6fff5;color:#000}`; `.preview-wrapper{…box-shadow:0 0 10rem 2.25rem rgba(182,255,245,.33)}`; `.cursor-dot{width:1rem;height:1rem;border:2px solid #b6fff5;border-radius:50%}`.
  Lars Olson (vaporwave) lars-olson-designs-stuff.webflow.io (2020-08-07) — **measured** [B §1.5]: `GRIFTER`, `Roboto Mono`, `Quakelove`; #0b0e17; `linear-gradient(135deg,#4df8ce,#84a1fd 33%,#e3a5ee 66%,#ede6bc)`, `linear-gradient(225deg,#0831d1,#f83aa2)`, `linear-gradient(270deg,#4869eb,#ee74b7)`. RetroWave Cars <https://jmcdrift.neocities.org> (Behance 127770305, Jose Muñoz, 2021-09-20) — **measured** [A R4]: `@font-face{font-family:vcr; src:url(FONT/vcr.ttf)}`, `html{background-image:url(IMG/fondo.gif); background-attachment:fixed}`, `.h1{border:dashed; font-size:90px}`, `.driftlogo{animation-name:heartBeat; 1.5s infinite}`, footer `#863FE8` — ordinary, "VCR OSD Mono + dashed border" the cheapest signature.
  X-ONE Helmets <https://x-onehelmets.com> (Behance 180409227, Hernán Del Río, 2023-09-20) — **measured** [A R7]: WordPress, `Eurostile_medium` + Roboto 400 — ordinary. Gateway Galaxy (under retro).
- Observed only: DIS30 (Behance 92179059, Leonel Loureyro, 2020-02-12; outergate.ar/clients/DIS30/ timed out twice): "3D splash screen", "VHS noise overlays triggered by scroll events" [A R3]. 3615 Future (Behance 206156129, Vladyslava Hnatchenko / Vladyslav Cherniuk, todor3d.com, 2023): Three.js, "absence of vertical scrolling", a scene that changes on scroll [A R5]. Music Retro Website (Dribbble 25322927, Stylin Framer, 2025) [A R8];
  Neon food delivery (Behance 111934343, Maria Shmal, 2021), NEON DRIVE festival (255163733, Yunona Lukianchuk); the Behance search is dominated by "80s chrome" text effects (Roberto Perrino, Hyperpix) [A R9]. signalnoise.com (James White) — plain CSS, the synthwave is in the artwork [C R6]. gunshipmusic.com (Wix), themidnightofficial.com (Squarespace), Carpenter Brut / Dance With The Dead / Kavinsky (Bandcamp); retrowave.ru Cloudflare 522 three times; newretrowave.com WordPress [C R7].
  Awwwards / OnePageLove: no synthwave SOTD (Sidewave `#000/#fff` WebGL; Neon Rated a film distributor); *We are the Innovation* (NuWeb, 2018, archived: IBM Plex, Space Invaders, page tear), *Starborn Wanderers* (2013) [C R8]. Webflow blog "Going cyberpunk and riding the vaporware": Chrome (chrometattooparis.com, "glitchy sparks, retro computing typography"), Discover Local Music ("neon-like tubes of purple and pink"), Nifty Portal, Ribbon Finance [B §1.7].
  Palette guides: styleshift.design/styles/synthwave — **measured** for the values [C R24]: `#ff2a6d`, `#05d9e8`, `#9d0aff`, `#0d0221` "near-black, deep purple, never pure black", `#e0d0ff` "never pure white", `#9d72ff`; pairings Orbitron / Rajdhani ("the definitive Synthwave pairing"), Audiowide / Exo 2, Bungee / Share Tech Mono, Monoton / Rajdhani; uppercase with generous tracking, dual glow pink + cyan, glow reserved for primary elements, 2px sharp corners.
  retrowave.com outrun palette — **observed** [C R25]: `#191970`, `#000000`, `#0c0c1e`, `#FF00FF`, `#00FFFF`, `#9400D3`, `#FEF65B`, `#FD8A26`, `#FF5ACD`, `#C600FF`, `#580e91`. Fonts (indieground.net, graphicpie.com, hyperpix) — **observed** [C R26]: see "Hazards" for the licences; Google Fonts availability checked by HTTP 200 on 2026-09-07: Monoton, Audiowide, Orbitron, Righteous, Mr Dafoe, Press Start 2P, VT323, Exo 2, Rajdhani, Share Tech Mono, Bungee, Michroma, Bebas Neue, Major Mono Display, Syncopate, Wallpoet, Faster One, Zen Dots, Turret Road, Tourney.
- The canonical palette as used (C §2.1): void `#0d0221` (styleshift; inegoita `#010310`; '84 `#171520`) — never `#000`; surface `#262335 → #2a2139`; sky ramp `#0c1142 → #45125e → #d53567 → #f0c3d9`; hot pink `#f92aad` / `#ff2a6d` (`#ff7edb` lighter text form); magenta `#ec008c` / `#f6007b` / `#fc28a8`; cyan `#36f9f6` / `#03edf9` / `#05d9e8`; sun `#fcc22f → #f945e5` (Denerz `#fdb428 → #f672ca`; '84 badge `#fff951 → #fc28a8`);
  laser yellow `#fede5d` / `#fff951`; orange `#ff8b39` / `#f97e72`; red `#fe4450`; green `#72f1b8`; violet `#733b8b` / `#45125e` / `#7F00FF`; chrome `#2989cc → #d3e5ec │ #592451 → #b3628d` or `#fff → #9e9e9e → #6e6e6e`; body `#e0d0ff`; muted `#848bbd` / `#9d72ff`.
- Typography (C §2.4): display Audiowide or Orbitron 900 (uppercase, tracked 0.12–0.16em — the wide twin of cyberpunk's condensed Big Shoulders), body Rajdhani (shared with cyberpunk), mono Share Tech Mono (shared) with VT323 for OSD text only, Mr Dafoe for at most one script word per surface; Monoton display only, one word. A adds `trumpgothicpro`/Oswald (r4ms3s) and the "80s chrome" horizon-line title as the genre's recurring motif.
- The eight mechanisms C says the theme must carry (all CSS-only unless noted): the striped sun by mask (Argyle's rule or Calderan's 0.5% gap, disc `#fcc22f → #f945e5`, `drop-shadow(0 0 1.5rem #f9124f)`, a blurred `rotateX(40deg)` reflection; static, drift opt-in); the perspective grid with a horizon (Calderan's conic-gradient or Magic UI's 60px/15s fallback, `border-top: 1px` + `drop-shadow(0 0 2px)`, three `box-shadow` horizon glows, a near-edge fade; drift ≥ 4s, seamless; pause needs-JS);
  chrome type with a one-shot shine (50/51% break, `-webkit-text-stroke: 1px rgba(255,255,255,.4)`, `::before` extrusion, `::after` shine band swept once on scroll-in — trigger needs-JS; SVG bevel hero-only); the neon tube that switches on (the '84 rest stack, the CSS-Tricks stack once with at most two dips, no `infinite alternate`; the class add needs-JS);
  the 4px pink→cyan stripe `linear-gradient(to right, #fc28a8, #03edf9)` on the active item with `inset 0 -5px 25px #fc28a825`; static VHS/CRT texture (screen-door `100% 2px` + `3px 100%` at 6/2/6%, or 6% sky scanlines; one-shot tracking wipe reusing `fx-glitch-a/b` with the `2px 0 rgba(0,30,255,.5) / -2px 0 rgba(255,0,80,.3)` fringe; OSD in VT323 "▶ PLAY · SP 0:00:00");
  the two-colour inset vignette `box-shadow: inset 0 0 50px 1px #0ff, inset 0 0 100px 1px #f50abe`; the boot sequence (one-shot turn-on 0.55–4s or a diegetic "CALIBRATING… PROGRESS" line with a skip; skip, text and reduced-motion short-circuit need JS). Audio-reactive backgrounds: out of scope (S44).
- The family with cyberpunk (C §2.6): cyberpunk is diagonal and day (45° notch, yellow ground, condensed type); synthwave is horizontal and night (every cut a horizontal slit, the ground a horizon, wide type). Shared: three type roles, every effect a one-shot event, static texture, reduced motion resolving to the rest state, the same `fx-*` names and `--fx-duration` tokens, one generated SVG divider, the hero / app / card contract.
  Proposed answers (not measured — assembled from measured parts, tested in the concept demo S46): hero = sky ramp + sun + grid, lavender text; app = `#0d0221` with `#262335` cards and the stripe; `<mark>` = the tube switching on; reveal = one tracking wipe then one shine; divider "tear" = a 2px magenta horizon with the three-shadow glow and a short grid ramp (seeded SVG); heading accent = a laser line drawing from the centre outward; buttons = square, 2px neon frame, a "sun cut" of two slits on hover (no precedent); navbar = flat bar, stripe under the active item, `▶` dropdown prefix; microlabel `▶ ` or `● REC` in VT323, pink; arrival = the turn-on with a skip.
- Not settled (C §3): no live synthwave navbar or button exists to read from; retrowave.ru's player chrome is the one synthwave UI still unmeasured; the Denerz sun loop and the Nightride flicker need `gates/check-motion.mjs` on the fixture before either drift is offered.
- Hazards: see "Hazards" — CRT flicker, neon flicker budget, the 1s sun snap, scanline scroll, grid speeds, glow contrast (`#f92aad` on `#262335` 4.34), personal-use fonts.
- Verdict: **next level found** — A: r4ms3s.cz and nightride.fm; B: Retro Racer, Neo Tokyo's grid, synthwave-mix's `vw` glow; C: the pens and Synthwave '84 (no live site at cyberpunk.net's level).

---

## Cross-cutting mechanisms

Grouped under the five semantic hooks (S45) plus buttons, navbars, texture, typography and loading sequences. Every example is measured unless marked observed.

**Surface.**
- Borders as box-shadows, never layout: Vercel `--ds-shadow-border-base: 0 0 0 1px #00000014` [D]; Linear `box-shadow:inset 0 0 0 1px` [D]; nightride `nav.menu a { box-shadow: inset 0 calc(-1*var(--border-size)) var(--text-primary) }` [A]. CSS-only.
- The hard offset shadow as a knob: Gumroad `--box-shadow-1: .25rem .25rem 0rem var(--color)` [D]; Persona `4px 4px 0 rgba(0,0,0,.35)` [D]; Aardvark `filter:drop-shadow(.3125em .625em 0px var(--violet))` [B]; SGJ `box-shadow:3px 3px 0 1px #000` [B]. CSS-only.
- Glass + blur with a hairline: `backdrop-filter:blur(10–100px)` on 12 of B's sites, always with `1px solid hsla(0,0%,100%,.1–.15)` and a hex-alpha ground — PixelFleek `blur(12px)` / `#18001ee8`, Terminal Industries `blur(30px)` / `#454742fa`, Mosby `blur(100px)` / `#191919cc` [B]. CSS-only.
- Per-plate ink tokens: Gumroad `--color-accent-with-text`, `--contrast-accent:0 0 0` [D]; BEIGE FORCE `--color-fg: var(--color-dark)` across seven `[data-theme]` palettes [A]. CSS-only.

**Emphasis (hover / press).**
- The offset underline that recolours: craigmod `text-decoration-thickness:.1em;text-underline-offset:.2em` [D]; anthropic `.07em` / `.2em` [D]; ESB `hover:decoration-[#ad9a5c]` [D]; PDR `text-decoration-color` [D]. CSS-only.
- The drawn underline `width 0→N`: Lemke Dark Editorial `width:40px` in `.3s` [D]; Lemke Riso `height:2px … transition:width .2s` [D]; Miranda's stroke-draw `stroke-dashoffset:1100 → 0` over `600ms` [B]. CSS-only.
- Lift-off / press-onto shadow: Gumroad `translate:-1 -1` on hover, `shadow-none` on active [D]; 98.css label shift `text-shadow:1px 1px #222` on `:active` [D]; BEIGE FORCE `.play-button:active { transform: scale(.96) translateY(3px) }` [A]. CSS-only.
- Asymmetric timing and inversion: Grilli `.1s` in / `.15s` out [D]; Maximilian Kaspar `a:hover{background-color:black;color:white}` [B]; cubic-portfolio single-hue glow-on-fill `box-shadow:0 0 10rem .1px #b6fff5` [B]. CSS-only.
- Relative-colour hover: BEIGE FORCE `oklch(from var(--color-bg) calc(l - .06) calc(c + .1) h)` [A]. CSS-only.

**Reveal.**
- Scroll-driven without JS: Dead North `animation: linear both dn-ignite-color view(); animation-range: entry 30% entry 80%` and `dn-rail-sweep` `entry 10% entry 85%` [A]; Codrops `@supports(animation-timeline:scroll()){… animation-timeline:view();animation-range:contain}`, `@property --hue{syntax:'<angle>';initial-value:0turn}` by `scroll(x)`, under `prefers-reduced-motion:no-preference` [B]. CSS-only — B: "our hairline-draw-on-scroll could drop its JS".
- Staggered entrances by custom property: Dead North `animation-delay: calc(var(--i) * 28ms)` [A]; Topo Designs `--animation-order: 1..12` [D]; HEP's 25 named per-element keyframes [A]. CSS-only (index set by markup).
- Clip-path as the transition idiom: Terminal Industries `popdown-in` `inset(0 0 100% 0)→inset(0 0 0 0)` `.25s cubic-bezier(.16,1,.3,1)` [B]; Lando `ellipse(100% 0% at 50% 0)→ellipse(100% 120% at 50% 0%)` [B]; PX PUSH `clip-path: rect(0 100% 0 0)` wipe [A]; Persona `#slash` polygon morph [D]; NW pixel-grid dissolve (needs-JS) [B]. CSS-only except the pixel dissolve.
- Stepped cuts instead of eases: Dead North `.18s steps(3,end) dn-cut-in` with a contrast/saturation spike, `.1s steps(2,end) dn-cut-out` [A]; PX PUSH `foreground .5s steps(1)` [A]; nightride `grain 8s steps(10)` [A]. CSS-only.
- Draw-in by stroke: Culpepper `drawSVG` stagger `0.12` (needs-JS) [D]; Miranda underline (CSS-only) [B]; char reveals from `translateY(1em)` inside `overflow:hidden` (k95, Lando; JS-triggered) [B].

**Divider.**
- The overhanging hairline: rauno `.gridLine{--offset:-100px;--fade-stop:90%;width:calc(100% + var(--offset))…}` [D]. CSS-only.
- The double rule: PDR `border-top:2px solid #d9b310;border-bottom:2px solid #d9b310` [D]; Curio's four-ring inset (observed) [D]; Le Bathyscaphe's concentric `inset 0 0 0 3px/6px/8px/15px` [B]. CSS-only.
- Seams that are not lines: NOTHIN' `.section-separator-blur{…linear-gradient(0deg,black,var(--transparent));height:10rem}` [B]; Terminal Industries `mask-image:linear-gradient(180deg,transparent 0,#fff 15%,#fff 85%,transparent)` [B]; Aardvark's torn polygon [B]; rauno's `mask-image` fade under chrome [D]. CSS-only.
- The sweep band: ekeijl `scanline 10s`, resting 8 s [D]; 2bit.chat 4-px bar over 8 s [A]; nightride `scanline 7.77s` [A]. CSS-only.

**Heading accent.**
- A skewed or rotated slab: Persona `.screen-head::after{…skewX(-24deg)}`, `.hud-tag{transform:rotate(-2deg)}` [D]; Phantom.Land `Loader_skew-left{50%{transform:skew(-20deg)}}` [B]. CSS-only.
- The second-pass overprint: Lemke Riso `::before{content:attr(data-text);top:3px;left:-3px;mix-blend-mode:multiply;opacity:.6}` [D]; r4ms3s hue-rotated clones on 8s/10s timers [A]; Retro Racer `.logo-cyan{mix-blend-mode:screen}` [B]. CSS-only.
- Outline from four shadows: brutalist.webflow.io `-2px 0 blue,0 2px blue,2px 0 blue,0 -2px blue` [B]; BEIGE FORCE `-3px 0 #000, 3px 0 #000, 0 -3px #000, 0 3px #000` [A]; ant-8 `±3px 0 #000` [D]. CSS-only.
- The cartouche and the eyebrow: ESB's 10 px chevron `clip-path` [D]; nickhh `letter-spacing:1em` uppercase eyebrows [B]; Lemke's 40 px ribbon [D]. CSS-only.

**Buttons.**
- Bevels: 98.css four inset shadows and the 1 px label shift [D]; SGJ `border-color:#fff #000 #000 #fff` / pressed `#000 #fff #fff #000` [B]; React95 `inset 1px 1px 0px 1px ${borderLightest}, 1px 1px 0 1px ${borderDarkest}` [A]; 2bit.chat 3-px four-border `.pixel-inset/.pixel-outset` [A]. CSS-only.
- Neon frames: neon-button `inset 0 0 .5em 0 #ff00b7,0 0 .5em 0 #ff00b7` → `0 0 2em` on hover [B]; card-neon-glow's three intensities from one base via `color-mix(in oklch,…)` [B]. CSS-only.
- Mono tracked buttons: Terminal Industries `letter-spacing:2.34px;text-transform:uppercase;height:3rem;border-radius:.25rem` [B]. The fill that disappears on hover: PixelFleek `background-color:#31005000` [B]. Ghost text: Lando `text-shadow:0 var(--text-offset) currentColor` [B]. Gel: Y2K `inset -4px -4px 3px 0 hsla(0,0%,100%,.4)` [B]. CSS-only.
- Blob morph: Codrops "Janus" `::before` between two `clip-path:path("M154.5,88.5 …")` → `path("M143,77 …")` over `.5s cubic-bezier(.585,2.5,.645,.55)`, label `mix-blend-mode:difference` [B]. CSS-only.

**Navbars.**
- Custom cursor with a mono label: 10 of B's ~35 measured sites — `position:fixed;pointer-events:none;mix-blend-mode:difference` plus a 12 px uppercase pill (NOTHIN' `.cursor-work`, CIPHER `.cursor_label`, k95 `.cursor.is-hovering` 45px) [B]; SUTÉRA's per-reality cursor images [A]; rauno's `cursor:copy` as state [D]. Needs-JS for the follower; CSS-only for the image cursors.
- Chrome that inverts over imagery: Moranta `position:sticky … mix-blend-mode:difference` [D]; rauno `.index_cross{mix-blend-mode:difference}` [D]; Heller `mix-blend-mode:difference` [B]. CSS-only; D: "a candidate for the dark themes only".
- Bottom-anchored glass pill: PixelFleek `.sticky-nav{…border-radius:900px;position:fixed;inset:auto 0% 0}` [B]. Nav recolour on scroll: Lando `[data-nav-theme="light|dark"]` [B]. The active stripe: Synthwave '84 `height:4px; linear-gradient(to right, #fc28a8, #03edf9)` [C]. CSS-only (attribute set by JS).
- Marquee: Future Pharmaceutical `translateX(0→-50%)` 40s [B]; monospace.be 50s/60s reverse pair [B]; Lando 30s `animation-play-state:paused` with an edge `mask-image` [B]; Hiroto Sato gallery `translate(-50%)` [B]. CSS-only. B: "our ticker theme has no marquee primitive".

**Texture.**
- The fixed stack with an opacity budget (A's first mechanism): grain (inline `feTurbulence` — BEIGE FORCE `baseFrequency='0.9' numOctaves='2'` at `.1`, Dead North `.82`/`3` at `--grain-opacity`, Lemke `0.7`; or a noise PNG jittered with `steps()` — nightride, PX PUSH), a raster (`repeating-linear-gradient` 1–2 px), a sweep bar, a vignette, a 10–15 % `backdrop-filter` bloom (PX PUSH `.gloom`), each `position:fixed; pointer-events:none` with its own z-index and opacity, tokenised per palette (Dead North `--grain-opacity`, `--scan-opacity`) [A]. CSS-only.
- The CRT screen-door, one pseudo-element (Alec Lownes, "Using CSS to create a CRT" <https://aleclownes.com/2017/02/01/crt-display.html>, 2017 — measured by B, C and D; reused by Neo Tokyo, nightride, C's pens): `linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,.25) 50%), linear-gradient(90deg, rgba(255,0,0,.06), rgba(0,255,0,.02), rgba(0,0,255,.06)); background-size:100% 2px, 3px 100%` [B, C, D]; nightride's green stop is `.03` and Neo Tokyo's sizes `100% 4px,6px 100%` [A, B]. CSS-only, static.
- Halftone and paper: Dead North `radial-gradient(circle at center, var(--halftone) .9px, transparent 1px); background-size:7px 7px` [A]; Lemke Riso 6 px multiply dots [D]; Miranda `.paper-background{mix-blend-mode:multiply}` [B]; dot-matrix tractor feed `repeating-linear-gradient(0deg,#dbfadb,#dbfadb 1px,#fff 1px,#fff)` at 20 px [B]; css-pattern seigaiha [D]; cssShowcase rings [D]. CSS-only.
- Blend-mode photo filters: SUTÉRA `mix-blend-mode:color` cyanotype tint [A]; Lemke duotone gradient over images [D]; Le Bathyscaphe `filter:saturate(0%) sepia(11%)` [B]; Miranda `contrast(122%) grayscale()` [B]. CSS-only.
- Pixel rendering: 2bit.chat `image-rendering: pixelated` [A]; nightride `font-smooth:never; -webkit-font-smoothing:none` [A]; 98.css `-webkit-font-smoothing:none` at 11 px [D]. CSS-only.

**Typography.**
- Font roles as tokens: Dead North `--font-shout/--font-tele/--font-noir/--font-body` [A]; SUTÉRA `--font-main/--font-lab/--font-blueprint/--font-cyber` [A]; Terminal Industries `--font-mono` (38 rules) / `--font-primary` [B]. CSS-only.
- Viewport-locked scales: SUTÉRA `--text-xxl:11.19svw` [A]; Lando `--fluid-font:calc(clamp(992px,100vw,1920px)/1728*16)` [B]; teenage.engineering fractions of `--base-design-width: 980` [D]; nickhh `1.111vw` capped at 20px [B]; Moranta `10.5rem / -.04em / .91` [D]; Swiss Typefaces `13.75rem` [D]. CSS-only.
- Bitmap display done properly: dottxt `neueBitBold` at `line-height:.75` [A]; BEIGE FORCE Kongtext with `letter-spacing:-.15em; word-spacing:-.6em` [A]; Decathlon's Roboto Flex 10-axis string [B]. CSS-only.
- Chrome by `background-clip:text` with the 50/51% break (inegoita, Poliquin, Nogueras) [C]; Retro Racer's pixel mask through `background-clip:text` [B]. CSS-only.
- Pairings measured: Roslindale Display Condensed + Graphik [A]; Signifier + Founders Grotesk + IBM Plex Mono [B]; Alegreya + Noto Sans JP [B]; DelaGothicOne + Manrope [A]; Ogg + CentSchbook Mono BT [D]; Cormorant Garamond + Playfair Display + Source Sans 3 [D]; Archivo Black + Barlow Condensed [D]; Anthropic Serif body + Anthropic Sans display [D]; Orbitron / Rajdhani (styleshift, values measured) [C].

**Loading sequences.**
- In the theme's own voice: BEIGE FORCE `.loader-percent { text-shadow:-3px 3px #000; font:36px Kongtext }`, dots by `width: 0→3.2ch` [A]; Gateway Galaxy `boltApp__loadingBreathe { 50% { opacity:1; transform:scale(1.2) } }` on a radial occluder [A]; Phantom.Land `Loader_skew-left` / `Loader_move-out-left` [B]; retronovaworld's diegetic boot text with SKIP LOADING [C]; the CRT turn-on 4s / turn-off 0.55s [C]; MUTHUR `bootLine` from `translateY(2px)` [D]; 2bit.chat `receipt-print` [A]. CSS-only; skip controls and typed text need JS.
- Codrops 2026 tutorial stream (tympanus.net/codrops/category/tutorials) — **observed** [B §7]: shape-aware ASCII renderer (09-04), real-time datamosh (09-02), square lens with RGB shift (08-25), depth-map relighting (08-19), GSAP testimonial hero from Webflow CMS (08-18), infinite GSAP gallery with Flip (07-30), Ridgeline terrain (07-22), wave-propagation cube grid (07-09), persistent WebGPU page transitions (06-30), MotionPath thumbnail flow (06-04), infinite scroll GSAP+Lenis (05-28), scroll-driven SVG map path drawing (05-21) — almost all Three.js/WebGPU, outside a CSS package except the SVG map draw (topo) and the Flip gallery. On-scroll sliced text (github SlicedTextEffect/js/index.js) — **measured** [B]: `ScrollTrigger{start:'top bottom',end:'top top+=10%',scrub:true}`, `ease:'power1'`, reunite `ease:'power2.inOut'` with `stagger`; needs-JS.
- Page transitions: Hiroto Sato `filter:blur(var(--transition-content-blur)) brightness(var(--transition-content-brightness))` [B]; Maximilian Kaspar four columns `calc(25% ± 2.5px)` [B]; NW pixel-grid dissolve (needs-JS) [B]; synthwave-mix `.nav__transition-block{background-color:#df0edb}` [B].

---

## Hazards

**Flicker over DI5's 3/s (numbers as the sweeps give them).**
- Lownes CRT `.crt::after{animation: flicker .15s infinite}` — C: "20 opacity keyframes (0.239, 0.022, 0.789, …) over 0.15s = 133 luminance changes/s", overlay `rgba(18,16,16,0.1)`, each change at the 10 % threshold — "the archetype of what DI5 forbids. Do not port." D reads the same rule as "21 keyframes of opacity `.08–.96`" and "luminance every 150 ms"; B: "again over DI5". The keyframe count (20 vs 21) is a disagreement between C and D.
- Neo Tokyo `.crt::after{…animation:flicker .15s infinite}` [B]; HairyDuck `.crt{animation:flicker .15s infinite}` [D] — the same recipe.
- Vault-Tec `.animate-flicker{animation:flickerAnimation .1s infinite}`, opacity 1→0 — 10 Hz, "fails DI5's flash threshold, do not copy as is" [B].
- nightride `.overlay.flicker { animation: flicker .05s infinite linear }` (A, measured) with a keyframe alternating opacity 0/.9/.99; C read the same keyframe as "four full dips per cycle", did not read the duration, and set the bar: "under 1.33s per cycle it fails". At A's measured `.05s` the cycle is far under that bar.
- George Park / CSS-Tricks neon `flicker 1.5s infinite alternate` with off-states at `20%, 24%, 55%` — 2 flashes/s, passes but "spends two-thirds of the budget on one element" in a 341×256 px area; the cyberpunk `fx-flicker` (1.8/s, third dip under 10%) is the pattern to reuse [C].
- Below the 10 % luminance threshold, not flashes (C): effect-labs `vhsFlicker 0.15s` opacity 1↔0.98 and `noiseAnim 0.2s` ±1%. Not flagged by any sweep: cursor blinks at .7s–1s (typing-terminal, dottxt .8s, 2bit.chat, Vault-Tec) and nightride's `grain 8s steps(10)`.

**Oscillating patterns and motion.**
- Denerz sun `--shift` 1→3.8 over 1s then a snap — a discontinuity once per second across a 40vmin disc; MDN's pattern rule (≤5 light/dark pairs if oscillating, ≤8 if steady) against a disc holding 7–17 pairs: the cuts must not oscillate; period-lock the loop or keep the sun static [C].
- effect-labs `scanlines 0.1s` translateY 4px on a 2px stripe field — an oscillating high-contrast pattern over the whole screen; keep scanlines static [C]. MUTHUR `.crt-screen::before{…animation:scanlines .1s linear}` carries the same figure [D]. PX PUSH `::after{animation:scanlines 1s steps(60) infinite}` (raster jittered 60 steps/s) and `foreground .5s steps(1)` noise — A reports the figures without a DI5 verdict.
- Grid speeds: inegoita `0.5s` and aderaaij `1s` loops are seamless but "motion-sick"; Magic UI 15s, Denerz 4s, Calderan 0.8s-per-cell are the measured range; every grid must freeze under `prefers-reduced-motion` (Magic UI freezes at `translateY(-50%)`, `u_time = 0`) [C]. Culpepper's drift (14 s yoyo) pauses off-viewport [D].
- Reduced motion, the good models: Dead North hides the texture layers and kills all animation [A]; Culpepper's finished map is the CSS default [D]; Magic UI and the Signal demo resolve to the rest state (S41) [C]; effect-labs and CSS-Tricks ship `animation: none` [C].

**Contrast (WCAG 2.x, computed by C with `contrast.mjs`).**
- On `#0d0221`: `#f92aad` 5.69, `#ff2a6d` 5.54, `#ff7edb` 8.84, `#36f9f6` 15.31, `#fede5d` 15.10, `#e0d0ff` 13.97, `#848bbd` 6.12; **`#9d0aff` 3.74 (fails AA text)**, `#9400d3` 3.05, `#733b8b` 2.60 (decoration only).
- On `#262335`: **`#f92aad` 4.34 (fails AA normal text, passes large)**, `#ff2a6d` 4.22, `#ff7edb` 6.74, `#36f9f6` 11.67.
- Neon on neon: `#f92aad` vs `#36f9f6` 2.69, `#ff2a6d` vs `#9d0aff` 1.48 — never text. White on `#f92aad` 3.52 — a pink button needs void ink (`#0d0221` on `#ff2a6d` = 5.54). The '84 rule (near-white core, colour in the shadow) is the fix, and the core must pass without its glow (T3).
- Eye strain: the Synthwave '84 README says the glow is not for extended use — rest-state stack on `app`, full stack on `hero` only [C].
- Other invariants: 98.css focus `outline:1px dotted #000; outline-offset:-4px` — DI2 forbids [D]. Gumroad's per-plate ink tokens are the DI4 answer [D].

**Font licences.**
- Personal-use only, stay out of a shipped package [C R26]: Streamster (Youssef Habchi), Lazer 84 (Sunrise Digital), Outrun Future (PressGang), Road Rage, Hauser, Rocket Rinder, VCR OSD Mono (Riciery Leal), Neon 80s, Alien Encounters, Vermin Vibes — "none on Google Fonts". Seen in the wild: `Road rage` self-hosted on synthwave-mix [B] and in inegoita's neon [C]; VCR OSD Mono on jmcdrift (`FONT/vcr.ttf`) [A] and McDade [C].
- Paid or proprietary faces the sites use (not licence-flagged by the sweeps, noted so nobody assumes them free): Typekit `trumpgothicpro`, `proxima-nova`, `degular`, `old-standard`, `birch-std`, `helvetica-neue-lt-pro`; fonts.net Futura LT W01; Hoefler Verlag; ABC Favorit; GT Alpina; PP Neue Montreal; Anthropic Serif/Sans.

**Sites that could not be measured.**
- A: Dribbble pages return empty to WebFetch (read in the Chrome pane); Behance project pages expose no CSS; codepen returns a shell page (Lumon `codepen.io/jsabutis/pen/xbxQWqJ`); DIS30 `outergate.ar/clients/DIS30/` timed out twice; Themesberg demo 429 then no theme CSS; brutalistwebsites.com's ~20 listed sites not fetched.
- B: Gateway Galaxy, the Awwwards Retro collection items, NexBank, 21 Capital, Impermanence, White Square, Stone and Style, Peter Lindbergh, IZANAMI, Treasures of Japan, Santioni Spirits, The Obsidian Assembly, Vander Hotel, Sharplink, USSR Futurism, PouyaOS — observed, not fetched; Houkago Calpis now 379 bytes; Robinhood and Mosby's Files pages 404 on awwwards.com; awwwards.com/sites/house-of-honey resolves to the 2023 Réplica site; Terminal Industries' notch clip is a runtime variable; Decathlon's CSS is WP inline; Magnetic Buttons / HoverGrid are JS, not quoted.
- C: codepen.io direct 403 (`.css` endpoint "Not Available as a Resource"); warrendavies.net 500; codefronts.com and pro.radio 403; observablehq 429; retrowave.ru 522 three times; artist sites on Wix / Squarespace / Bandcamp carry the look in imagery.
- D: Bloomberg UX "Designing the Terminal for color accessibility" 403/robot wall; Osman's Risograph.css repo and demo did not resolve; girih.app's pattern is canvas.

---

## Ideas outside the 24

1. **Pixel / 8-bit console** (distinct from Win95 retro): 2bit.chat, BEIGE FORCE, Neo Tokyo's Mega Man 10, Retro Racer's Upheavtt, Pixelify Sans / Rubik Pixels, Behance *8-BIT SHOP* (254582079, 2026), Dribbble *Milady Pixel Art Website* (22320422), Block Rage, Chocapic — recurs in every retro search [A, B].
2. **Neo-brutalism** (pastel fills + hard black offset shadows + thick outlines): Behance *Neo Brutalism: Modernist Aesthetics Reimagined* (191973845, 4 K appreciations), Dribbble *Riddle UI*, *Mentorix* (27538236), "Soft Brutalism" landing pages — the most-searched "brutalism" and not what our `brutalism` is [A].
3. **Vaporwave / Y2K gel** (pastel-chrome 4-stop gradients, aqua gel buttons, marble, Win95 chrome, Japanese text, pixel-grotesk): Lars Olson, y2k-buttons, macaspac, X-ONE, Behance *VAPORWAVE website* (46379565), *Vaporwave Art Gallery* (205257885) — distinct from synthwave, which is dark and neon [A, B].
4. **Noir / pulp paper and the paper–dossier–archive register** (halftone, Bodoni, typewriter, signal red; multiply textures, folder tabs, drop caps): Dead North, Miranda, Mosby's Files, dot-matrix, polaroids, the Awwwards newspaper collection — between sepia and phantom, or academia's second register [A, B].
5. **Corporate-retro terminal (Severance / Lumon)**: Lumon Industries Terminal (Dribbble 25845913) and *severance-countdown-concept* (25676996) — a cream-and-teal terminal, distinct from green phosphor [A].
6. **Win95 / desktop OS** (bevels, title bars, taskbar, boot sequence): best-of-sgj (1.1k clones), Portfolio 95, Boot Sequence, PouyaOS, "Hidden interactions inspired in 90s interfaces" [A, B].
7. **Tech-spec / annotated schematic** (dimension lines, call-out numbers, stamps, mono type): studio2am, kittl, Containers wireframe kit — adjacent to blueprint and lighter; could be blueprint's second register rather than a theme [B].
8. **Klein-blue / single-colour brutalism**: k95 `#1500e1`, brutalist-hover `#302dd7`, PX PUSH `#03049C`, brutalist-garden `#0020f4` — a saturated blue on white as the 2026 brutalist palette [B].

---

## Sources kept

All paths are relative to this session's scratchpad, `/tmp/claude-1000/-home-kenny-Projects-kp-themes/0f370a8a-aa0a-4f17-8db1-4774735a6a56/scratchpad/`.

- The four reports: `research-dribbble-behance.md` (A), `research-webflow-awwwards.md` (B), `research-synthwave.md` (C), `research-per-theme.md` (D).
- A: downloaded HTML/CSS/JS in `scratchpad/live/`.
- B: fetched copies in `scratchpad/{css,css2,css3,codrops,aw,sites}/`.
- C: pens read through the `cdpn.io` fullpage DOM in the browser pane, gists and raw files through the GitHub API, live sites through `getComputedStyle` / `document.styleSheets` — no saved copies are named; the contrast figures come from `contrast.mjs` in the scratchpad.
- D: `scratchpad/src/` — 98.css, gumroad.css, anthropic.css, firewatch.css, rauno-all.css, vercel-all.css, grilli.css, swty.css, esb-all.css, moranta.css, p5-omicron.css, p5-ant8.css, muthur.css, hairyduck.css, craigmod.css, lemon.css, te-*.css, linear-all.css, adachi-all.css, Dark_Editorial.html, Risograph.html, aleclownes.html, ekeijl.html, culpepper.html, csspattern.html, pdr.html.
