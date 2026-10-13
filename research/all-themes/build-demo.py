# Builds research/all-themes-applied/demo.html from research/cyberpunk-applied/demo.html: the same real
# components, only the sections that changed in some theme, each asked only in the themes where it changed
# (data-review-themes on the section), with what to look at per theme. Run from the repository root.
import re, pathlib

SRC = pathlib.Path('research/cyberpunk-applied')
OUT = pathlib.Path('research/all-themes-applied')
html = (SRC / 'demo.html').read_text()

ALL = ['formal', 'light', 'dark', 'synthwave', 'pastel', 'terminal', 'blueprint', 'solstice', 'brutalism', 'deco', 'phantom', 'grotesk', 'nostromo', 'titanium']

SECTIONS = {
    'bar': ('The bar: dropdown, mega menu and phone panel open with the theme\'s own effect and close as it backwards', {
        'formal': 'Hover <b>Equipment</b>, open the mega menu and the phone bar: the panel is ruled in line by line like formal\'s menus and the rules come off bottom first. Borrowed from the menu (G3); the bar had no decided motion.',
        'light': 'Hover <b>Equipment</b>, the mega menu and the phone bar: the panel comes into focus out of the glare as light\'s menus do (700 ms) and goes back into it. Borrowed from the menu (G3).',
        'dark': 'The dropdown and mega menu keep their pass and now also close by the pass back; the phone panel is swept in under the bar with the line and taken off the same way. Borrowed from the menu (G3).',
        'synthwave': 'The dropdown, mega menu and phone panel climb behind the beam and set back behind it. The phone panel no longer replays the bar\'s page-load slide. Borrowed from the header menu and the popover\'s climb.',
        'terminal': 'The dropdown, mega menu and phone panel are printed in the menu\'s four lines and cleared backwards. Borrowed from the menu\'s print (G3).',
        'blueprint': 'The dropdown and mega menu are traced; the phone panel\'s links are traced as a panel and drawn backwards on close. Borrowed from the header\'s menu (G3).',
        'solstice': 'The dropdown, mega menu and phone list rise into the light as the popovers do (640 ms). Note: the decided "kindled" dome (G3) is built nowhere yet; this keeps the register\'s rise. Not approved = build the dome everywhere.',
        'brutalism': 'The dropdown and mega menu take the popover\'s drop; the phone list is set down and lifted off as a part. Borrowed from G3/G12.',
        'deco': 'The panel is uncovered round from the middle of its top edge (320 ms), then its words come up; closing is that backwards. Borrowed from the menu (G3).',
        'phantom': 'The dropdown and mega menu now close by the dissolve and snatch (their throw backwards); the phone panel is thrown from the menu\'s origin and lands level. Borrowed from G3 and G13.',
        'grotesk': 'The dropdown, mega menu and phone panel take the plate\'s fall (960 ms) and fall back; the phone toggle\'s ink plate comes with the first frame and goes with the last. Borrowed from the popover\'s fall.',
        'nostromo': 'The dropdown, mega menu and phone panel are drawn by the raster with the beam and erased with the same frames backwards. Borrowed from the popover\'s raster.',
        'titanium': 'The dropdown, mega menu and phone panel open by the dialog\'s cut from the top (240 ms) with the cutter line; the dropdown no longer fades. Borrowed from G3.',
    }),
    'sidenav': ('The side navigation', {
        'titanium': 'Open the panel: it now slides in 240 ms (the cut band) instead of 60 ms, its backdrop with it; the push mode and the group fold follow.',
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
            'solstice': 'dawns as the dialog does (560 ms)',
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
        'solstice': 'Open the picker: the panel rises into the light as the popovers do.',
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
        'solstice': 'Type in the field: the list rises into the light.',
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
        'blueprint': 'The card is traced like the dialog; the dim grows out of the target and the ring is drawn in, both on 800 ms, and go back the same way.',
        'solstice': 'The card dawns as the dialog; dim and ring take the dawn\'s time and curve.',
        'brutalism': 'The veil grows out of the target in solid ink and shrinks back into it; the ring\'s colour comes and goes over the same 300 ms.',
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
    themes = [t for t in ALL if t in looks]
    block = re.sub(r'data-review-title="[^"]*"', f'data-review-title="{n} · {esc(title)}" data-review-themes="{",".join(themes)}"', block, count=1)
    block = re.sub(r'<p class="fa-num">[^<]*</p>', f'<p class="fa-num">{n} · {title.split(":")[0]}</p>', block, count=1)
    block = re.sub(r'(<h2 id="h-[^"]*">)[\s\S]*?(</h2>)', lambda m: f'{m.group(1)}\n                        {title}.\n                    {m.group(2)}', block, count=1)
    look = '\n'.join(f'                    <p data-for="{t}"><b>{t}</b>: {looks[t]}</p>' for t in themes)
    block = re.sub(r'(<div class="fa-look" data-review-look>)[\s\S]*?(\n\s*</div>)', lambda m: f'{m.group(1)}\n{look}{m.group(2)}', block, count=1)
    block = re.sub(r'<!-- [^\n]*-->', f'<!-- {n} · {sid} -->', block, count=1)
    out_sections.append(block)

head_end = html.index('<main')
head = html[:head_end]
head = head.replace('data-theme="cyberpunk" data-cat-theme="cyberpunk" data-cat-theme-fixed data-review="cyberpunk-applied" data-review-themes="cyberpunk"',
                    f'data-theme="formal" data-cat-theme="formal" data-review="all-themes-applied" data-review-themes="{",".join(ALL)}"')
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
tail = tail.replace('<!-- Round one: every block is new. -->', '<!-- Round one. -->').replace('"round": "2026-10-12-r1"', '"round": "2026-10-13-r1"')
OUT.mkdir(exist_ok=True)
(OUT / 'demo.html').write_text(head + intro + '\n'.join(out_sections) + '\n' + tail)
js = (SRC / 'demo.js').read_text()
js = js.replace('research/cyberpunk-applied', 'research/all-themes-applied')
js = js.replace("this page judges cyberpunk and stays cyberpunk", "the page keeps the theme the review dialog shows")
js = js.replace("`${label} chosen; this page stays in cyberpunk.`", "`${label} chosen; this page keeps its theme.`")
js = js.replace("const on = t.name === 'cyberpunk';", "const on = t.name === root.dataset.theme;")
(OUT / 'demo.js').write_text(js)
(OUT / 'demo.css').write_text((SRC / 'demo.css').read_text().replace('research/cyberpunk-applied', 'research/all-themes-applied'))
print('sections', len(out_sections))
