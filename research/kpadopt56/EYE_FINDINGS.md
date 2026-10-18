# FINDINGS (by eye, Firefox, 1280 pages; 390 judged from the phone frames inside each section)

Screenshots of all 11 parts x 11 themes were taken in loaded/loading/empty/failed where the section has state buttons. Each theme was read in full for the dark baseline; for later themes the states and repeated patterns were read (not every loaded frame of every section). Format: part | section | width | state | what is wrong | severity.


## dark (15)
- [low] schedule | weekdays | 1280 | loaded | quick picks Weekdays/Weekend/Every day render as bare bold text, no plate, read as labels not buttons (.kp-weekdays presets)
- [medium] schedule | snooze | 1280 | loaded | snooze tiles: row 3 Monday tile shorter and offset vs taller neighbour, rows not on one grid (.kp-snooze__item), same in all themes
- [low] schedule | snooze-states | 1280 | paused sentence | Save schedule looks fully active under a paused/disabled sentence
- [medium] choose | usual-states | 1280 | loading | busy overlay (black block) is taller than its combobox case and covers the caption of the next case ("Shown opened: a long label..." cut in half)
- [low] choose | usual, usual-states | 1280 | loaded | closed comboboxes are empty boxes with a broken chamfer border (top line stops short, right edge starts lower) and no placeholder/value; very large empty area under them
- [medium] fields | time-field | 1280 | loading | in the sentence "Back up every day at [03:00]." the time text runs into the right edge of its box (clipped last digit)
- [medium] updates | auto-refresh | 1280 | loaded | "A menu button" and "Segments" cases render identically as a segmented bar (menu look is not visibly a menu button), so the pair shows no difference
- [low] lists | request-inspector | 1280 | failed | failed state fills the frame but the chamfer film frame draws a stray offset notch at the corners (outer plate and inner red plate misaligned, bottom-left black triangle)
- [medium] status | notices | 1280 | failed | a darker 200 px-wide block stays at the left of the failed plate (leftover busy/skeleton layer) and the chamfer frame corners do not meet; Sources switches render as unreadable grey squares
- [low] status | notices | 1280 | failed | (see above) Sources switch glyphs render as grey squares/checkerboard
- [medium] calm | quote-states | 1280 | empty | a dark 100x145 px block sits at the left inside the empty plate, a leftover busy/skeleton layer (same fault as status notices failed)
- [medium] calm | calm-tones-states | 1280 | loading | the comet is drawn once per calendar cell (every day has its own vertical streak) and a small "Loading..." card sits mid-grid with the streak across its text; not one centred card over the whole grid
- [medium] charts | availability-grid | 390 list-per-column | loading | the "a list per column" 390 px frame shows nothing but an empty box during loading (no busy card, no skeleton), 400 px of blank; only the wide and scrolling frames get the card
- [medium] charts | uses-states | 1280 | empty | with Empty pressed the map shows the loading comet skeleton rows, not an empty plate (may be a lag in the state switch, recheck by hand)
- [medium] all parts | busy card | 1280 | loading | the comet sweep (vertical rainbow bar) passes through the busy card's own text ("Reading your ways to sign in...", "Loading...", "Reading the dependencies...") so the words are crossed by the bar; the card text should sit above the sweep (.kp-busy plate, dark register)

## cyberpunk (7)
- [medium] schedule | weekdays-states | 1280 | disabled | disabled picker: quick picks drawn as solid yellow plates, more prominent than the dimmed chips and than enabled picks elsewhere
- [low] schedule | weekdays | 1280 | loaded | quick picks bare text, no plate
- [low] schedule | sentence-states | 1280 | disabled | Save schedule solid yellow and active under a disabled sentence
- [medium] choose | usual-states | 1280 | loading | busy overlay taller than its combobox case and covers the next caption (same as dark)
- [low] fields | time-field | 1280 | loading | inline loading strip is a tiny "LOADING" caption in a very small box under the label; barely reads as the glitch anchor
- [medium] updates | auto-refresh | 1280 | loaded | "A menu button" and "Segments" cases render identically (same as dark)
- [low] status | notices | 1280 | failed | failed plate is the right colour language (cut corners, red wash) but its bottom-right edge is missing a corner cut that the top-left has; Sources switches are tiny parallelogram stubs with unclear on/off

## synthwave (18)
- [medium] schedule | runs-states | 1280 | failed | failed plate is a flat solid coral slab with a tiny black square glyph above the heading that reads as a missing icon; no neon tube, not the theme's tube/bloom language
- [medium] schedule | runs-states | 1280 | empty | empty state is a sun on a horizon line with small mono caption, no plate and caption far smaller than the failed heading (rule: heading size, in the theme's plate)
- [medium] schedule | snooze | 1280 | loaded | snooze tile rows misaligned like dark (row 3 shorter tile offset)
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next case caption; driven loading shows a solid hot-pink bar across the top of the overlay
- [medium] choose | dated-states | 1280 | failed | failed state is a huge flat coral square slab with a tiny black square glyph, loud and off the neon-tube language
- [medium] fields | time-field | 1280 | loading | in the sentence "Back up every day at [03]." the time box shows only "03" (":00" cut off), value unreadable
- [medium] fields | autosize-states | 1280 | loading | loading is three thick hot-pink bars cutting across the reply text, no centred busy card; text hidden/overlapped
- [low] fields | slider-states | 1280 | loading | loading slider is just dimmed (thumb and box faded) with no visible marquee/busy cue
- [medium] updates | deplist-states | 1280 | failed | failed plate flat coral with a stray black square glyph again; loading shows a solid hot-pink band across the first rows
- [medium] confirm | question | 1280 | urgent and refused | urgent/refused cards are flat coral slabs with a black square glyph; Allow/Stop become near-black plates, loud and off the neon-tube look
- [medium] lists | request-inspector | 1280 | failed | failed plate is a flat coral slab with a stray black square glyph above the heading
- [high] status | notices | 1280 | failed | flat coral plate stops 70 px short of the frame and an orange-yellow gradient band shows underneath it (the plate does not fill the full footprint); stray black square glyph above heading
- [medium] status | today-states | 1280 | loading | a solid hot-pink ticker band slices across the first rows while the busy card sits low; band covers row text, Morning pills row undimmed, reads as a rendering glitch rather than a marquee chase
- [medium] calm | quote-states | 1280 | empty | solid orange sun-bar sits directly under the caption "Words you write come back here" inside the empty plate, touching the text; the plate is not the normal empty plate
- [medium] calm | calm-tones-states | 1280 | loading | three hot-pink stripes cross the card and the card is squashed so the sun glyph is cut off at its bottom; not a centred full-footprint busy card
- [medium] calm | focus-states | 1280 | loading | a solid pink band hides the first answer (Rough) completely while the rest is dimmed; loading cue covers content
- [medium] media | gallery-states | 1280 | failed | failed plate is a flat coral slab with a stray black square glyph, loud next to the neon tube language (same across parts)
- [medium] people | entity-states | 1280 | failed | failed plate is a flat coral slab filling the whole grid with a stray black square glyph, no neon tube or grid-floor language

## pastel (10)
- [low] schedule | weekdays-states | 1280 | disabled | disabled picker: quick picks Weekdays/Weekend/Every day stay fully enabled-looking while the chips are dimmed
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next case caption (same box-height bug)
- [medium] fields | time-field | 1280 | loading | in the sentence "Back up every day at [03:0" the time text is clipped at the right edge of its pill
- [low] updates | version-states | 1280 | loaded | the multi-line sha256 version tag becomes a huge blob pill (full-pill radius on a 5-line box), shape reads wrong next to the one-line tag above
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments (see all-themes note)
- [low] confirm | question | 1280 | urgent and refused | Stop button on the red card is only a dark underline, plate lost against the red card
- [medium] lists | request-inspector | 1280 | failed | pressed state button "Failed" label is overlapped/clipped by the dog-ear corner ("Faile"); same on pressed Loading elsewhere in pastel
- [high] calm | calm-tones-states | 390 | loading (phone frame next to it) | a column of five worm heads sits over the Sun column of the loaded 390 px calendar, overlapping the day numbers (27, 04, 11, 18, 25); the worm busy art escapes its own box
- [medium] charts | chart-annotations | 1280 | loaded (third chart) | the "3 of 7 days needed" sticker card overlaps the x-axis date labels at the bottom of the plot (13/10 .. 15/10 hidden under its foot)
- [medium] people | passkey-list | 1280 | failed | the state button "Failed" (pressed) is overpainted by the dog-ear fold, label reads "Failec"; same for pressed Loading/Empty buttons across pastel parts

## forest (13)
- [low] schedule | weekdays-states, snooze-states, runs | 1280 | loaded | ghost buttons (quick picks, End snooze, Show 3 more) show only a faint stray corner arc of the leaf border and no plate; look clipped/half-drawn, weak affordance
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next case caption; card is small, trees only at its foot and the area behind it is empty
- [medium] fields | autosize-states | 1280 | loading | loading Reply box shows its plain text with only a faint pale strip below; no busy card or trees visible over the component
- [low] fields | slider-states | 1280 | loading | slider loading is a grey plate with a faint hill line; the tree-bar anchor is not used
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments
- [medium] confirm | question | 1280 | urgent and refused | Stop button vanishes on the red card (plain text "Stop" on red, no plate) in Urgent and Refused
- [high] status | notices | 1280 | failed | the red failed plate ends ~85 px above the frame bottom; a pale pink strip (leftover tint layer) fills the rest, so the plate does not fill the footprint; Sources switch knobs show tiny glyphs unclear
- [medium] status | today-states | 1280 | loading | first row "Morning pills" stays undimmed and a visible seam cuts under it while the other rows are washed out; busy card text cut at its left edge by the card
- [high] calm | quote-states | 1280 | empty | a pale yellow tint band covers the lower third of the empty plate and washes out the caption "Words you write come back here" to near invisible
- [low] calm | calm-tones-states | 1280 | loading | busy card is a flat white box with the trees bar squeezed to its foot edge; leaf tiles behind faint; card text "Loading..." tiny and top-aligned, not the tree-bar anchor at proportion
- [medium] charts | chart-annotations | 1280 | loaded (third chart) | the "3 of 7 days" leaf card overlaps the x-axis date labels at the bottom of the plot
- [low] media | gallery-states | 1280 | failed | failed plate is a flat rust slab with one leaf corner; no trail-blaze or growth language
- [medium] people | entity-states | 1280 | loading | three tiny tree-bar skeleton lines per card and an unlabelled pale ghost footer; busy card is a small sticky note not centred over the whole grid (sits at the left third of the third card)

## blueprint (13)
- [medium] schedule | runs-states | 1280 | failed | failed state is a flat salmon slab with a generic button: no pen line, brackets, dimension marks or amber flag (look text promises amber/red flag, not just colour change)
- [low] schedule | runs-states | 1280 | loading | busy card is a plain card with a crosshair circle; no hatched section and the skeleton behind is almost invisible
- [low] schedule | weekdays-states | 1280 | disabled | disabled picker quick picks undimmed
- [medium] schedule | snooze-states | 1280 | loaded | snooze tile rows misaligned (row 3 shorter tile)
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next case caption (same box-height bug); plain crosshair card, no hatching
- [medium] choose | dated-states | 1280 | failed | large flat salmon square, no pen/bracket/dimension language, plain button
- [low] choose | toggle-states | 1280 | loaded | count badge on "Error" is an empty bordered box with a stray vertical line (spinner glyph unreadable)
- [medium] fields | time-field | 1280 | loading | inline skeleton under "Backup time" is two thin vertical tick lines on empty space, the loading cue is almost invisible (no hatch/pen)
- [medium] updates | deplist-states | 1280 | failed | failed plate is a flat salmon rectangle (same as other parts), no amber/red flag with pen/bracket language
- [low] updates | ack-states | 1280 | loaded | major-version gate is a flat brown/amber block with no theme marks (no brackets, hatching or dimension line)
- [medium] status | notices | 1280 | failed | flat salmon plate again, no brackets or pen line (see schedule/choose); Sources switches use a window-pane glyph that reads as a checkbox
- [low] calm | calm-tones-states | 1280 | loading | loading calendar gives no hatching or pen; card is a plain dark box with a crosshair circle and tiny "Loading..." above it
- [medium] people | passkey-list | 1280 | failed | failed sentence is set in italic monospace capitals on one 860 px line, unlike every other blueprint failed (sans heading); crosshair icon above reads as a loading mark

## solstice (10)
- [medium] schedule | runs-states | 1280 | failed | failed plate is a flat salmon slab: no warm light/sky reddening, no serif, reads as generic alert
- [low] schedule | weekdays-states | 1280 | disabled | quick picks stay undimmed under a disabled picker
- [high] choose | toggle-states | 1280 | loaded | pressed "All 138" chip in the phone box is a pale cream plate with near-invisible cream text, unreadable at a glance
- [medium] choose | dated-states | 1280 | failed | failed state is a large flat coral square: no kindled/eclipsed sky, no serif heading
- [medium] choose | usual-states | 1280 | loading | busy overlay covers the next case caption; sun-arc glyph tiny inside a small card
- [high] updates | deplist-states | 1280 | failed | failed plate here is the red-sky gradient with a bordered rim, but schedule runs-states and choose dated-states draw failed as a flat coral slab: same component, two looks in one theme
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments
- [high] confirm | question | 1280 | urgent and refused | Stop button is completely invisible on the red card (no plate, no label), a gap between the description and its caption
- [high] status | notices | 1280 | failed | here failed is the red-sky gradient with a rim, in schedule/choose it is a flat coral slab: inconsistent inside one theme
- [low] people | entity-states | 1280 | loading | busy card is a plain dark card with a tiny sun glyph at one third left; the sun-arc anchor is a 30 px line, almost invisible; skeleton cards show only faint dots

## brutalism (8)
- [low] schedule | weekdays | 1280 | loaded | quick picks WEEKDAYS/WEEKEND/EVERY DAY are bare uppercase text with no slab, read as labels in a theme where controls name what they are
- [medium] schedule | snooze-states | 1280 | loaded | snooze tile rows misaligned (row 3 Monday tile shorter, offset)
- [medium] choose | usual-states | 1280 | loading | busy overlay area covers the caption of the next case (same overlay height bug)
- [medium] fields | time-field | 1280 | loading | sentence time box clips its value to "03:(" and the full stop touches the slab edge
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments (both a segmented slab)
- [medium] calm | calm-tones-states | 1280 | loading | every calendar day cell carries a black slab bar striking through its number (04, 05, 11, 12 ...), numbers partly unreadable; the lintel hoist is repeated per cell instead of one over the grid
- [medium] charts | chart-annotations | 1280 | loaded (third chart) | the slab card "3 of 7 days needed" with its coin glyph covers the x-axis date labels (12/10 and 15/10 hidden), its foot overlaps the axis
- [low] people | entity-states | 1280 | loading | gateway card shows tag "+3" as bare text while other themes show a chip; overflow chip lost its slab (brutalism)

## deco (10)
- [low] schedule | weekdays-states | 1280 | disabled | quick picks drawn with plates only when disabled; the enabled ones are bare text (inverted); End snooze also bare text
- [medium] schedule | snooze-states | 1280 | loaded | snooze tile rows misaligned: uppercase Pick tile wraps to 3 lines, Monday tile shorter and centred instead of stretched
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next case caption; the gold door seams run through the "Reading the list" text
- [medium] fields | time-field | 1280 | loading | sentence time box clips its value to "03:0"
- [medium] fields | autosize-states | 1280 | loading | lift-door card is tiny and its gold seams and diamond jewels run through the "Loading the text..." words
- [medium] updates | deplist-states | 1280 | loading | busy card text "Reading the dependencies..." sits across the gold door seams and the dial; same card pattern in schedule/choose/fields (text crossed by seams)
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments
- [medium] calm | calm-tones-states | 1280 | loading | gold door seams and diamonds drawn inside every day cell run through the day numbers; one lift-door card sits mid-grid, so doors appear 36 times
- [low] calm | focus-states | 1280 | loaded | long-answer case: answer plates have 3-line labels in tight caps at 12px padding, the text nearly touches the gold inlay top and bottom
- [medium] people | entity-states | 1280 | loading | the lift-door seam lines run through the card skeleton and the "Reading the stacks..." text

## nostromo (11)
- [low] schedule | runs-states | 1280 | loading | busy card CRT strip shows the word COMPUTING cut off at the bottom of the screen
- [medium] schedule | snooze-states | 1280 | loaded | snooze tile rows misaligned (Monday tile shorter, centred) 
- [medium] choose | dated-states | 1280 | failed | failed state is a flat dark-red square slab: no raster, no lamp, plain case button; the look text says the lamps tell the state
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next caption; CRT strip word COMPUTING half-cut again
- [low] fields | time-field | 1280 | loading | sentence time box "03:00" fills the box with ~2px side margin, text almost touches the case edge
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments
- [low] updates | deplist-states | 1280 | failed | failed plate flat dark red with case button, no lamp or raster (see choose)
- [low] confirm | question | 1280 | urgent and refused | Stop button loses its plate on the red card, only a hairline and lamp dot remain
- [medium] lists | master-detail | 1280 | loading | the whole component (list pane and History included, also the 390 phone list) is dimmed to dark brown; formal lays the busy card over the detail pane only; COMPUTING strip cut off again
- [low] status | notices | 1280 | failed | flat dark-red plate with a case button, no raster/lamp (consistent weak spot of nostromo failed states across parts); Sources toggles OK
- [low] people | entity-states | 1280 | loading | COMPUTING strip clipped at the bottom of the busy card again

## titanium (10)
- [medium] schedule | snooze-states | 1280 | loaded | snooze tile rows misaligned (Monday tile shorter, centred); End snooze bare text
- [low] schedule | runs-states | 1280 | failed | failed plate is a flat orange slab with chamfers, no machined/anodised film language; empty plate hatched twill with gradient edge is fine
- [low] choose | dated-states | 1280 | failed | failed state is a huge flat orange chamfered square with no film/stamp language
- [medium] choose | usual-states | 1280 | loading | busy overlay covers next case caption
- [low] choose | shortcut-engine | 1280 | loaded | empty sheet body copy switches to monospace while the heading and every other sheet text is sans
- [medium] updates | auto-refresh | 1280 | loaded | menu button case identical to segments
- [high] confirm | question | 1280 | urgent and refused | Stop button is completely invisible on the orange card (no plate, no label)
- [medium] status | notices | 1280 | failed | flat orange chamfered plate, no film/stamp; Sources switch glyphs render as checkerboard blocks that read as broken
- [low] charts | chart-annotations | 1280 | loaded (third chart) | the "3 of 7 days" text is left-aligned inside a plate that is otherwise centred; hatch fills text area behind the words (busy)
- [low] people | entity-states | 1280 | loading | busy card is a rainbow-gradient box (anodised film) fully covering the card but the film is used as a flat tile, not "only where it carries meaning"

## ALL THEMES (cross-theme) (3)
- [low] lists | request-inspector | 1280 | failed | the toolbar row ("0 requests" and the filter segments) floats in a tall empty band above and below instead of sitting at the top of the frame, wasting ~100 px each side in every theme (cyberpunk, synthwave, pastel, forest, dark seen)
- [medium] calm | focus-states | 1280 | loaded | in the "long question, long answers, an answer that cannot be picked" case the third answer (the disabled "Hard to say", the point of the case) is cut off by the Back/Done footer; only solstice (serif, tighter) shows it (.kp-focus long-answer frame, dark/cyberpunk/synthwave/pastel/forest/blueprint seen)
- [medium] charts | chart-annotations | 1280 and 390 | failed | the failed state is the same tinted rectangle with a red dot left of the first heading line in every theme (dot sits beside the text, not above/with it, text centred while dot is at the margin); theme-own failed plates (hazard tape, gold inlay, tube) are not used here, so the chart failed state is generic (dark, cyberpunk, synthwave, pastel, forest, blueprint, solstice seen)

## Counts per theme (total, high)
- dark: 15 total, 0 high
- cyberpunk: 7 total, 0 high
- synthwave: 18 total, 1 high
- pastel: 10 total, 1 high
- forest: 13 total, 2 high
- blueprint: 13 total, 0 high
- solstice: 10 total, 4 high
- brutalism: 8 total, 0 high
- deco: 10 total, 0 high
- nostromo: 11 total, 0 high
- titanium: 10 total, 1 high
- all: 3 total, 0 high

## High severity
- synthwave: status/notices 1280 failed: flat coral plate stops 70 px short of the frame and an orange-yellow gradient band shows underneath it (the plate does not fill the full footprint); stray black square glyph above heading
- pastel: calm/calm-tones-states 390 loading (phone frame next to it): a column of five worm heads sits over the Sun column of the loaded 390 px calendar, overlapping the day numbers (27, 04, 11, 18, 25); the worm busy art escapes its own box
- forest: status/notices 1280 failed: the red failed plate ends ~85 px above the frame bottom; a pale pink strip (leftover tint layer) fills the rest, so the plate does not fill the footprint; Sources switch knobs show tiny glyphs unclear
- forest: calm/quote-states 1280 empty: a pale yellow tint band covers the lower third of the empty plate and washes out the caption "Words you write come back here" to near invisible
- solstice: choose/toggle-states 1280 loaded: pressed "All 138" chip in the phone box is a pale cream plate with near-invisible cream text, unreadable at a glance
- solstice: updates/deplist-states 1280 failed: failed plate here is the red-sky gradient with a bordered rim, but schedule runs-states and choose dated-states draw failed as a flat coral slab: same component, two looks in one theme
- solstice: confirm/question 1280 urgent and refused: Stop button is completely invisible on the red card (no plate, no label), a gap between the description and its caption
- solstice: status/notices 1280 failed: here failed is the red-sky gradient with a rim, in schedule/choose it is a flat coral slab: inconsistent inside one theme
- titanium: confirm/question 1280 urgent and refused: Stop button is completely invisible on the orange card (no plate, no label)

## Method notes
- Cross-theme recurring pattern: busy-card overlay in "usual-states" (choose) is taller than its case and covers the next caption in dark, cyberpunk, synthwave, pastel, forest, blueprint, solstice, brutalism, deco, nostromo, titanium.
- Failed/empty plates in synthwave, blueprint, solstice(choose/schedule), nostromo, titanium are flat slabs without the theme anchor (synthwave also a stray black square glyph).
- Not reviewed by eye in every theme: loaded frames of media (anchors, print-checklist, qr), most of people/avatar and fields rating, only spot-checked.