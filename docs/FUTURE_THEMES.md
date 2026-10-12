# Future themes

Ideas for themes the package may take up again, in case we want more. Each
entry is what was decided before the theme was stopped, why it was stopped,
and what to do differently. Nothing here ships; the package has sixteen
themes (`themes/order.json`).

## Retro (a Windows 95 desktop)

**Stopped 2026-10-09** (Kenny: "I am so disappointed in retro that we simply
scrap the whole theme for now; put it as an idea for future themes, in case
we want more"). The theme, its register, its font (Pixelify Sans), its tests
and its research demos were removed from the package the same day.

**The essentials.** Grey chrome, a navy-to-blue title bar, raised and sunken
bevels drawn around a gated boundary (the `--border-strong` stays at 3:1 under
the bevel, DI1), the 16-colour VGA palette, a teal desktop. Nothing eases:
1995 did not, so every motion is whole frames. Three voices: Pixelify Sans for
the chrome, Instrument Sans for words, VT323 for the DOS screen.

**The anchor, decided** (2026-10-08, attempt 1 of 3): **Copying…: the sheet
flies between the folders.** The Copying dialog of 1995: a sheet of paper
flies out of one folder, over, and down into the other in eight whole frames
while the segmented bar underneath gains a block each time a sheet lands; the
press is the bevel pressed in one step with the label a pixel over. Kenny: "I
like the windows environment with the task bar and desktop that you created
around it", so the teal desktop with its icons, the taskbar with Start and the
clock, and the window with its title-bar ramp, menu bar and status bar are the
world every part lives in.

**The eighteen character picks, decided** (research/retro-character, before
loading was judged):

| Question                     | Pick                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| The motion curve             | `frames`: whole frames, eight a flight                            |
| The direction                | `folder`: copied in from the folder, top-left                     |
| Opening what drops           | `dealt`: dealt from its edge, the dialog zooms in outline         |
| How long things take         | `flight`: 90 ms a frame, 8 frames, a loop of 2520 ms              |
| Where the colour goes        | `palette`: the 16-colour palette                                  |
| The corners                  | `bevel`: square, bevelled                                         |
| The surface                  | `desktop`: the desktop behind, every surface a window part        |
| A warning                    | `messagebox`: the message box                                     |
| A live update                | `copied`: a sheet copied over                                     |
| The busy progress bar        | `hops`: the sheet hops ahead                                      |
| The spinner                  | `hourglass`: the hourglass                                        |
| Leaving and arriving         | `copied`: copied in, copied back out                              |
| Buttons inside composites    | `own`: exactly retro's own                                        |
| Pointing at something        | `nothing`: nothing, as in 1995                                    |
| The focus ring               | `dotted`: the two-channel ring with the dotted rectangle inside   |
| The press                    | `bevel`: the bevel pressed in one frame                           |
| The voice                    | `three`: Pixelify for chrome, Instrument Sans words, VT323 for DOS |
| Motifs                       | `desktop`: bevel, ramp, selection bar, dither, blocks, the desktop |

**Why it was stopped: loading.** The nineteenth question, what a part shows
while it loads, was rejected in every round:

1. The Copying dialog fitted to every waiting part: "it doesn't fit skeleton,
   month days and chart plot".
2. Invented pictures from the dialog: "still don't like it, what does the
   actual Windows 95 animations look like?"
3. The real Windows 95 waiting pictures (the Find flashlight, the splash's
   band, the hourglass, Defrag's grid): "so bad that I am about to delete
   this whole theme" (his Dutch, translated).
4. Eight pictures of the nineties: "not even close … much too loud, it has to
   be much more subtle".
5. Eight quiet greys (the dither shimmer recommended): the theme was scrapped.

**The lesson for a next attempt.** Loading must be derived from the anchor,
not invented beside it, and it must be subtle: the part stays as it is and
readable, and only something small about it changes. Settle loading together
with the anchor, before the rest of the grammar, because every waiting part
(a tile, a menu entry, a month, a chart plot, skeleton lines) has to carry it.

**Where the material is.** Only in git history: the last tree with the theme
is the parent of the commit that removed it (`git log -- themes/retro`), with
`themes/retro/` (tokens, anatomy, CHARACTER.md with the grammar G1 to G21),
`css/retro-register.css`, `research/retro-anchor` (decided.json, the anchor
scenes in options.css with their pixel maps) and `research/retro-character`
(aspects.js, grammar.css, options.css, update.json with the eighteen picks and
the loading rounds).
