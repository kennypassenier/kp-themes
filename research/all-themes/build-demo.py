# Builds research/all-themes-applied/demo.html from research/cyberpunk-applied/demo.html: the same real
# components, only the sections that changed in some theme, each asked only in the themes where it changed
# (data-review-themes on the section), with what to look at per theme. Run from the repository root.
import re, pathlib, json

SRC = pathlib.Path('research/cyberpunk-applied')
TO_TOP = '''// The block's own back-to-top takes the reader back as well (Kenny, 2026-10-13: "the back to top didn't seem to work"): to
// the top of whatever scrolls it, the page or the review dialog's stage.
document.querySelector('[data-fa-to-top]')?.addEventListener('click', (event) => {
    let box = /** @type {Element | null} */ (event.currentTarget instanceof Element ? event.currentTarget.parentElement : null);
    while (box && box !== document.body) {
        if (/auto|scroll/.test(getComputedStyle(box).overflowY) && box.scrollHeight > box.clientHeight + 1) break;
        box = box.parentElement;
    }
    (box && box !== document.body ? box : window).scrollTo({ top: 0 });
});

'''
OUT = pathlib.Path('research/all-themes-applied')
html = (SRC / 'demo.html').read_text()
# Kenny, 2026-10-13: the side navigation only shows and hides itself; no second layer over the rest of the screen.
html = html.replace('                        data-kp-sidenav-backdrop\n', '                        data-kp-sidenav-backdrop="false"\n', 1)

ALL = ['formal', 'light', 'dark', 'synthwave', 'pastel', 'terminal', 'blueprint', 'solstice', 'brutalism', 'deco', 'phantom', 'grotesk', 'nostromo', 'titanium']

SECTIONS = {
    'bar': ('The bar: dropdown, mega menu and phone panel open with the theme\'s own effect and close as it backwards', {
        'formal': 'Hover <b>Equipment</b>, open the mega menu and the phone bar: the panel is ruled in line by line like formal\'s menus and the rules come off bottom first. Borrowed from the menu (G3); the bar had no decided motion.',
        'light': 'Hover <b>Equipment</b>, the mega menu and the phone bar: the panel comes into focus out of the glare as light\'s menus do (700 ms) and goes back into it. Borrowed from the menu (G3).',
        'dark': 'The dropdown and mega menu keep their pass and now also close by the pass back; the phone panel is swept in under the bar with the line and taken off the same way. Borrowed from the menu (G3).',
        'synthwave': 'The dropdown, mega menu and phone panel climb behind the beam and set back behind it. The phone panel no longer replays the bar\'s page-load slide. Borrowed from the header menu and the popover\'s climb.',
        'terminal': 'The dropdown, mega menu and phone panel are printed in the menu\'s four lines and cleared backwards. Borrowed from the menu\'s print (G3).',
        'blueprint': 'The dropdown and mega menu are traced; the phone panel\'s links are traced as a panel and drawn backwards on close. Borrowed from the header\'s menu (G3).',
        'solstice': 'Round 2: the decided kindled dome (G3) is now built: the dropdown, mega menu and phone list open as a warm dome rising from the middle of the foot, overbright and cooling (480 ms), and sink back into it. The phone list counts as the header\'s menu.',
        'brutalism': 'The dropdown and mega menu take the popover\'s drop; the phone list is set down and lifted off as a part. Borrowed from G3/G12.',
        'deco': 'Round 2: the dropdown, mega menu and phone panel are now deco plates and open by the opening you approved (G3, the inlay): the gold frame draws from the middle of the top edge down both sides (320 ms), then the lacquer, wallpaper and words come up (160 ms); closing is that backwards.',
        'phantom': 'The dropdown and mega menu now close by the dissolve and snatch (their throw backwards); the phone panel is thrown from the menu\'s origin and lands level. Borrowed from G3 and G13.',
        'grotesk': 'The dropdown, mega menu and phone panel take the plate\'s fall (960 ms) and fall back. Round 2: on the phone the links stand in one column from the start edge under the brand (they fell into the grid\'s columns under the toggle).',
        'nostromo': 'The dropdown, mega menu and phone panel are drawn by the raster with the beam and erased with the same frames backwards. Borrowed from the popover\'s raster.',
        'titanium': 'The dropdown, mega menu and phone panel open by the dialog\'s cut from the top (240 ms) with the cutter line; the dropdown no longer fades. Borrowed from G3.',
    }),
    'sidenav': ('The side navigation: it shows and hides itself, with no layer over the rest of the screen', {
        'titanium': 'Open the panel: it slides in 240 ms (the cut band) instead of 60 ms, its backdrop with it. Round 2: no more colour splash beside it (the backdrop played the leave\'s anodising heat backwards as if it arrived).',
        'grotesk': 'Open the panel: one-unit slide from the start edge while its plate falls over 960 ms; closing is that backwards; shut it is hidden.',
        'nostromo': 'Open the panel: it no longer slides in (G2 forbids it); it is switched on where it stands by the raster (4 frames) and erased when it closes.',
    }),
    'palette': ('The command palette opens with the theme\'s dialog entrance, not a bare fade', {
        t: f'Press <b>Open the commands</b> and close it with Escape: it {v} and closes as that backwards. Borrowed from the dialog; the palette was not decided.'
        for t, v in {
            'formal': 'is ruled in as the dialog is (frame rule, input, list, status line)',
            'light': 'is exposed out of the glare as the dialog is',
            'synthwave': 'climbs as the dialog does (three beats)',
            'terminal': 'is printed in the dialog\'s six lines',
            'titanium': 'is cut from the top at the dialog\'s time',
            'blueprint': 'is traced like the dialog (5 units, inked at 75 %)',
            'solstice': 'opens as the decided kindled dome (round 2; G3), 480 ms, as the dialog now does too,',
            'brutalism': 'drops as the dialog\'s big slab (1500 ms from 2.5 rem); if it should be a plate (300 ms), that is one value',
            'phantom': 'is thrown from the board\'s start edge (-22 deg) and lands askew as the dialog does',
            'grotesk': 'falls into register as the red plate (960 ms)',
            'nostromo': 'is drawn by the raster from the top with the beam (4 frames)',
        }.items()
    },),
    'datepicker': ('The date picker panel opens with the theme\'s menu entrance', {
        'light': 'Open the picker: the panel is exposed as a menu under its button. And the picker\'s button: its focus ring and lift now come and go at once instead of over 200 ms, so they leave with the open\'s first frame and return after the close\'s last.',
        'synthwave': 'Open the picker: the panel climbs as the popover (two beats).',
        'terminal': 'Open the picker: the panel is printed in the menu\'s four lines.',
        'titanium': 'Open the picker: the panel is cut from the top at 240 ms with the cutter line ahead of it (square, no chamfer).',
        'solstice': 'Open the picker: the panel opens as the kindled dome (round 2), as every part that opens in solstice now does.',
        'brutalism': 'Open the picker: the panel takes the popover\'s drop.',
        'phantom': 'Open the picker: it takes the menu\'s throw and resolve but lands level, not askew; its 25 % screen shows from the first instant because it must take the focus (G3 says a closed part is never drawn).',
        'grotesk': 'Open the picker: the plate falls in and falls back.',
        'nostromo': 'Open the picker: the panel is drawn by the raster with the beam.',
    }),
    'combobox': ('The combobox list opens with the theme\'s menu entrance', {
        'light': 'Type in the field: the list is exposed as a menu.',
        'synthwave': 'Type in the field: the list climbs as the popover.',
        'terminal': 'Type in the field: the list is printed in four lines.',
        'titanium': 'Type in the field: the list is cut from the top with the cutter line.',
        'solstice': 'Type in the field: the list opens as the kindled dome (round 2).',
        'brutalism': 'Type in the field: the list takes the popover\'s drop.',
        'phantom': 'Type in the field: the list is thrown and resolves, landing level.',
        'grotesk': 'Type in the field: the plate falls in and back.',
        'nostromo': 'Type in the field: the list is drawn by the raster.',
    }),
    'tour': ('The tour: card, page dim and ring come and go together, the close the open backwards', {
        'formal': 'Start the tour and end it: the dim and the ring now take the card\'s 740 ms at the even pace (they were 350/250 ms in and 1000 ms out).',
        'light': 'The dim and ring take the card\'s 700 ms on the settle and go back on its inverse.',
        'dark': 'The card is now swept in where it stands as the dialog is (it had the package\'s 160 ms fade); dim and ring take its 880 ms.',
        'synthwave': 'The card climbs as the dialog with the beam; dim and ring on the same two beats.',
        'pastel': 'Only the timing: dim and ring come in the card\'s 160 ms and go in 160 ms (were 350/250 in, 1000 out). No new effect.',
        'terminal': 'The card is printed as a menu (four lines, 544 ms); dim and ring in the same four steps.',
        'blueprint': 'Round 2: the card no longer appears at once and jumps (it was also treated as an arriving part) and no longer vanishes on close: one trace in where it stands, the same trace back. The dim grows out of the target and the ring is drawn in, both on 800 ms.',
        'solstice': 'The card opens as the kindled dome; dim and ring take its 480 ms.',
        'brutalism': 'Round 2: the veil is no longer solid black: one flat ink weight at 62 %, so the page reads through it (your earlier pick r2-br-highlight-1, made lighter; brutalism\'s G7 says no transparency). It grows out of the target and shrinks back into it, never fades.',
        'deco': 'Dim and ring now come and go with the card\'s own time.',
        'phantom': 'Dim and ring move with the card\'s throw (400 ms) and go with its throw back.',
        'grotesk': 'The card falls in and back; the dim and ring are printed at once with the card and taken off at once at the end of its close (G1: nothing fades).',
        'nostromo': 'Dim and ring come and go in the card\'s 4 equal frames.',
        'titanium': 'The card is cut with the cutter; dim and ring on the same 240 ms, back on the curve turned round.',
    }),
    'dialogs': ('Dialog, drawer and their backdrops', {
        'grotesk': 'Open and close the dialog and the drawer: every backdrop is printed at once and held for the 960 ms, so it leaves with the window (it faded out over 960 ms while it appeared at once).',
        'nostromo': 'Not changed, for you to judge: every backdrop still fades by the package\'s mirrored fallback. A screen does not fade; 4 equal frames would match the tour\'s dim. Not approved = give the backdrop the 4 frames.',
        'phantom': 'Not changed, for you to judge: the side navigation\'s and dialogs\' backdrops still fade, while G1 says nothing fades. Not approved = replace the fade with phantom\'s cuts.',
    }),
    'alarm': ('The alarm', {
        'formal': 'Raise the alarm: its motion is unchanged, but it now lasts the dialog\'s 740 ms, so its close starts with 160 ms in which nothing moves.',
        'grotesk': 'Raise the alarm: the red ground at once, the panel\'s ink plate falls; title and reason come with the panel (they were 120 and 360 ms late).',
        'nostromo': 'Raise the alarm: the whole screen is drawn by the raster from the top with the beam (it was the package\'s fade, rise and scale).',
        'deco': 'Not changed, for you to judge: the alarm opens and closes by the package\'s opacity, scale and rise, mirrored, with no inlay. Not approved = give it deco\'s own entrance.',
        'phantom': 'Not changed, for you to judge: the alarm opens and closes by the package\'s opacity, scale and rise, not by the throw. Not approved = give it the throw.',
    }),
    'table': ('The busy table: its layer, the dimmed rows and the status line', {
        'formal': 'Press Loading and back: the rows\' dim now comes and goes over the layer\'s 560 ms.',
        'light': 'The rows\' dim comes and goes over the layer\'s 700 ms; the status line\'s small spinner stands down while the layer shows (one loading picture).',
        'dark': 'The rows\' dim comes and goes over the layer\'s 880 ms.',
        'synthwave': 'The status line\'s small spinner is hidden while the busy layer stands (one loading picture, as forest and cyberpunk).',
        'terminal': 'The status line\'s small spinner is hidden while the busy layer stands.',
        'titanium': 'The status line\'s small spinner is hidden while the busy layer stands.',
        'blueprint': 'The rows\' dim is read out and in with the layer on its feed.',
        'solstice': 'The rows\' dim comes and goes with the morning mist.',
        'deco': 'The rows dim with the busy layer in its 360 ms.',
        'phantom': 'The rows\' dim comes in the resolve\'s three hard cuts after the throw.',
        'grotesk': 'For you to judge: the layer now leaves instead of vanishing, and its leave draws the red plate over the whole translucent veil, so the table reads pink for most of 960 ms. Not approved = draw it on the busy panel only.',
        'nostromo': 'The rows\' dim switches on at the first frame of the layer\'s draw and off after its erase.',
    }),
    'calendar': ('The calendar: the busy month, and the colours of the day tones', {
        **{t: 'Press Loading and Read: the busy layers arrive and leave by the theme\'s own leave and its reverse (they faded).' for t in ['formal', 'light', 'dark', 'brutalism', 'grotesk', 'nostromo']},
        **{t: 'Press Loading and Read: the busy layers arrive and leave by the theme\'s own leave and its reverse (they faded). And the colours: the day tones use the package\'s generic green and ochre plates, as cyberpunk did before you asked for its neon. Approve = keep them; not approved = design a variant of the theme\'s own.' for t in ['synthwave', 'terminal', 'titanium', 'blueprint', 'solstice', 'deco', 'phantom']},
    }),
    'prose': ('The alerts: their tone colours', {
        t: 'Look at the four alerts (success, warning, info, error): they use the package\'s generic tone plates, as cyberpunk did before you asked for its neon variant. They read fine (every label and body 4.5:1 or more). Approve = keep them; not approved = design a variant of the theme\'s own.'
        for t in ['synthwave', 'terminal', 'titanium', 'blueprint', 'solstice', 'deco', 'phantom']
    }),
}

ROUND = '2026-10-13-r5'
DEMO_THEMES = ['formal', 'light', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'terminal', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'phantom', 'grotesk', 'nostromo', 'titanium']
TOUR_ALL = ' Round 2, every theme: on a step the card no longer drops into the page for a moment (that was the flash and the jump), the page stays dimmed on a card with cut corners, and the part the tour points at is shown uncut while it is pointed at.'
GENERIC = 'Not changed for this theme in particular: judge it as it is (round 2 shows every block in every theme).'
SECTIONS['tour'][1]['forest'] = 'Only the shared tour fixes.'
SECTIONS['tour'][1]['cyberpunk'] = 'Only the shared tour fixes.'
for t in list(SECTIONS['tour'][1]):
    SECTIONS['tour'][1][t] += TOUR_ALL
SECTIONS['calendar'][1]['blueprint'] = 'Round 2: Loading shows the whole month\'s compass and words again and every loading day\'s compass, drawn in by the pen (they were masked away). ' + SECTIONS['calendar'][1]['blueprint']
for t in list(SECTIONS['sidenav'][1]) + ALL:
    SECTIONS['sidenav'][1][t] = SECTIONS['sidenav'][1].get(t, '').rstrip() + (' ' if SECTIONS['sidenav'][1].get(t) else '') + 'Round 2: the panel no longer lays a backdrop over the rest of the screen; only the panel itself comes and goes (the package keeps the backdrop as an option, data-kp-sidenav-backdrop).'
SECTIONS['calendar'][1]['deco'] = 'Round 2: both lift doors close over every loading day (the left one was hidden by the press ring). ' + SECTIONS['calendar'][1]['deco']

PHANTOM_R2 = ' Round 2: what you saw below the phone bar (nothing visible, a red line streaking) did not happen here on the published site in Firefox at 1280 to 1920 px, after approving up to phantom and opening the phone bar; a screenshot would let me find it.'
for sid in ['palette', 'datepicker', 'combobox', 'tour', 'dialogs', 'alarm', 'table', 'calendar', 'prose']:
    if 'phantom' in SECTIONS[sid][1]:
        SECTIONS[sid][1]['phantom'] += PHANTOM_R2

R3 = {
 ("bar","pastel"): "Round 3: the dropdown, mega menu and phone panel open with pastel's own dialog entrance (the sheet rises 18 px, turned, and springs flat, 427 ms) and close as it backwards.",
 ("palette","pastel"): "Round 3: the palette opens with pastel's dialog sheet and closes as it backwards.",
 ("datepicker","pastel"): "Round 3: the panel opens with pastel's sheet.",
 ("combobox","pastel"): "Round 3: the list opens with pastel's sheet.",
 ("alarm","pastel"): "Round 3: the plate fades in and the panel drops and turns as pastel's dialog does; the close is that backwards.",
 ("alarm","dark"): "Round 3: the alarm opens with dark's pass: the line crosses left to right laying the red plate behind it, and crosses back to close.",
 ("bar","grotesk"): "Round 3: hovering Equipment draws the same straight red rule as the other links (the caret had bent it into a small slanted line).",
 ("tour","forest"): "Round 3: no more green flash on the step to the last card (the dim grew out of the card's green rim; it now grows from nothing).",
 ("combobox","phantom"): "Round 3: the list lands askew, as phantom's menus do.",
 ("calendar","phantom"): "Round 3: the loading picture stays inside the calendar (its block and slash had no box of their own and covered the screen; the same fault covered the table on a phone).",
 ("table","phantom"): "Round 3: the loading picture stays inside the busy panel (it covered the whole table, and on a phone the page below the bar).",
}
SN = {
 "formal":"is ruled in like the dialog (740 ms) and ruled off backwards", "light":"comes into focus out of the glare like the dialog (700 ms)", "synthwave":"climbs behind the beam like the dialog (450 ms)", "terminal":"is printed in the dialog's six lines (816 ms) and cleared upward", "blueprint":"is traced by the pen and inked like the dialog (800 ms)", "solstice":"opens as the kindled dome (480 ms)", "brutalism":"is dropped onto its footprint (300 ms) and lifted off", "deco":"is a deco plate: the gold inlay draws, then the lacquer comes up (480 ms)", "phantom":"is thrown off its edge as dots and resolves in three cuts (700 ms)", "titanium":"is cut open from the top with the cutter line (240 ms)", "pastel":"is laid on with pastel's sheet (427 ms)",
}
AL = {
 "synthwave":"climbs like the dialog with the beam","terminal":"is printed like the dialog","blueprint":"is traced, frame first, then inked","solstice":"opens as the kindled dome","brutalism":"drops the red stamp like the dialog's slab (1500 ms)","deco":"opens with the gold double frame drawn like the inlay","phantom":"is thrown like the drawer and resolves","titanium":"is cut open like the palette","light":"comes out of the glare like the dialog",
}
for (sid, t), line in R3.items():
    SECTIONS[sid][1][t] = (SECTIONS[sid][1].get(t, "") + " " + line).strip()
for t in DEMO_THEMES:
    v = SN.get(t)
    SECTIONS["sidenav"][1][t] = ("Round 3: the panel " + v + ", the theme's own opening; the close is that backwards. " if v else "Round 3: unchanged, it already used the theme's own opening (measured). ") + "Compare with the reference block at the top."
    a = AL.get(t)
    if a:
        SECTIONS["alarm"][1][t] = "Round 3: the alarm " + a + "; the close is that backwards. Compare with the reference block."
    elif t not in ("pastel", "dark"):
        SECTIONS["alarm"][1][t] = "Round 3: unchanged, it already used the theme's own opening (measured). Compare with the reference block."

def section_block(sid):
    m = re.search(r'\n( *)<!-- [^\n]*-->\n\s*<section\n(?:(?!</section>).)*?data-review-item="%s"(?:(?!</section>)[\s\S])*?</section>\n' % re.escape(sid), html, re.S)
    if not m:
        m = re.search(r'\n\s*<section\n(?:(?!</section>)[\s\S])*?data-review-item="%s"(?:(?!</section>)[\s\S])*?</section>\n' % re.escape(sid), html)
    return m.group(0)

def esc(s):
    return s.replace('"', '&quot;')

out_sections = []
for n, (sid, (title, looks)) in enumerate(SECTIONS.items(), start=1):
    block = section_block(sid)
    themes = [t for t in DEMO_THEMES if t in looks or (sid not in ('tour', 'sidenav', 'alarm') and t in ALL) or sid in ('tour', 'sidenav', 'alarm')]
    looks = {**{t: GENERIC for t in themes}, **looks}
    block = re.sub(r'data-review-title="[^"]*"', f'data-review-title="{n} · {esc(title)}" data-review-themes="{",".join(themes)}"', block, count=1)
    block = re.sub(r'<p class="fa-num">[^<]*</p>', f'<p class="fa-num">{n} · {title.split(":")[0]}</p>', block, count=1)
    block = re.sub(r'(<h2 id="h-[^"]*">)[\s\S]*?(</h2>)', lambda m: f'{m.group(1)}\n                        {title}.\n                    {m.group(2)}', block, count=1)
    look = '\n'.join(f'                    <p data-for="{t}"><b>{t}</b>: {looks[t]}</p>' for t in themes)
    block = re.sub(r'(<div class="fa-look" data-review-look>)[\s\S]*?(\n\s*</div>)', lambda m: f'{m.group(1)}\n{look}{m.group(2)}', block, count=1)
    block = re.sub(r'<!-- [^\n]*-->', f'<!-- {n} · {sid} -->', block, count=1)
    out_sections.append(block)

REFERENCE = '''
            <!-- 0 · reference -->
            <section class="fa-sec" id="reference" data-review-item="reference" data-review-title="0 · Reference: how this theme opens and closes" aria-labelledby="h-reference">
                <div class="fa-sec__head">
                    <p class="fa-num">0 · Reference</p>
                    <h2 id="h-reference">Reference: how this theme opens and closes a dialog. Every block below should open and close the same way.</h2>
                </div>
                <div class="fa-look" data-review-look>
REFLOOK
                </div>
                <div class="fa-stage">
                    <button type="button" class="fa-ref-open" data-kp-dialog="fa-ref-dialog">Open the reference dialog</button>
                    <dialog class="kp-dialog" id="fa-ref-dialog" aria-labelledby="fa-ref-title">
                        <h2 class="kp-dialog__title" id="fa-ref-title">The theme's opening</h2>
                        <p>This dialog opens with the theme's signature effect and closes as that effect played backwards.</p>
                        <div class="kp-dialog__actions">
                            <button type="button" class="fa-ref-open" data-kp-dialog-close="keep">Close</button>
                        </div>
                    </dialog>
                </div>
            </section>
'''
REFERENCE = REFERENCE.replace('REFLOOK', '\n'.join(f'                    <p data-for="{t}"><b>{t}</b>: an example first, to compare every other block with (Kenny, 2026-10-13). Open the dialog and close it: this is the theme\'s own opening, and its close is that opening backwards. Approve it when this is the effect you approved for the theme.</p>' for t in DEMO_THEMES))
head_end = html.index('<main')
head = html[:head_end]
head = head.replace('data-theme="cyberpunk" data-cat-theme="cyberpunk" data-cat-theme-fixed data-review="cyberpunk-applied" data-review-themes="cyberpunk"',
                    f'data-theme="formal" data-cat-theme="formal" data-review="all-themes-applied" data-review-themes="{",".join(DEMO_THEMES)}"')
head = head.replace('cyberpunk-register.css" data-kp-register="cyberpunk"', 'formal-register.css" data-kp-register="formal"')
head = re.sub(r'<title>[^<]*</title>', '<title>kp-themes: what changed in every theme</title>', head)
intro = '''<main class="fa-page">
            <header class="fa-intro">
                <h1>Every theme: what changed so that a close is its open backwards</h1>
                <p>
                    Kenny, 2026-10-12: "Cyberpunk lijkt af, zie dat dezelfde fouten nu niet terugkomen in andere thema's". Every theme but forest
                    and cyberpunk was measured in Firefox and mended: each part that opens or arrives now uses the theme's own effect, and each
                    close is its open played backwards. This page shows only what is new to look at: a part that borrowed an effect the theme
                    had not decided for it, a timing that moved, or a question. Each block is asked only in the themes where it changed.
                </p>
                <p>
                    Judge it in the review dialog ("Review in a dialog" at the top). Measurements and reasons per theme are in
                    <code>research/all-themes/reports/</code> and <code>research/all-themes/README.md</code>.
                </p>
                <p class="fa-motion" data-fa-motion hidden>
                    <b>Your system asks for reduced motion</b>, so nothing on this page moves. Turn it off to judge the openings and closes.
                </p>
            </header>
'''
tail = html[html.index('        </main>'):]
tail = tail.replace('<!-- Round one: every block is new. -->', '<!-- Round one. -->').replace('"round": "2026-10-12-r1"', f'"round": "{ROUND}"')
OUT.mkdir(exist_ok=True)
# Round 4 (Kenny, 2026-10-13 22:24): only the side navigation is asked again where it was not approved in round 3 (dark);
# the rejected pairs (dark|sidenav, phantom|combobox) reopen by themselves.
# Round 5 (Kenny, 2026-10-13 23:18): every pair approved; brutalism's panel over the page took a ground of its own
# after the edge demo's round 1, and this demo's side navigation is that panel, so it is asked again.
reopen = ['brutalism|sidenav']
tail = tail.replace('"reopen": []', '"reopen": ' + json.dumps(reopen))
(OUT / 'demo.html').write_text(head + intro + REFERENCE + '\n'.join(out_sections) + '\n' + tail)
js = (SRC / 'demo.js').read_text()
js = js.replace('research/cyberpunk-applied', 'research/all-themes-applied')
js = js.replace("this page judges cyberpunk and stays cyberpunk", "the page keeps the theme the review dialog shows")
js = js.replace("`${label} chosen; this page stays in cyberpunk.`", "`${label} chosen; this page keeps its theme.`")
js = js.replace("const on = t.name === 'cyberpunk';", "const on = t.name === root.dataset.theme;")
js = js.replace('/* --------------------------------------------------------------- loading */', TO_TOP + '/* --------------------------------------------------------------- loading */', 1)
(OUT / 'demo.js').write_text(js)
(OUT / 'demo.css').write_text((SRC / 'demo.css').read_text().replace('research/cyberpunk-applied', 'research/all-themes-applied'))
print('sections', len(out_sections))
