# AuDHD recipe app: screen demos (shared brief for every helper)

The app: a recipe app for someone with AuDHD (autism + ADHD) who forgets how dishes go, freezes on
"what do we eat", loses track while cooking and has days with no energy. Full concept, decisions and
the screen-to-component map: /mnt/project-files/audhd-recepten/CONCEPT.md (read it first).
Release 0.1 holds: the wheel, guided cooking, backward timing, bad days, calm. Usability and
"cool factor" decide everything (Kenny, 18/10/2026). Use kp-themes 11 components AND their options to
the full; nearly every component was made to be used.

## Where you work
- Worktree /home/claude/kp-wt/audhd (kp-themes, branch audhd-recepten-demos). Write ONLY inside
  research/audhd-recepten/<your-screen>/ (demo.html, demo.js, page.css, README.md). Touch no other
  file: no catalogue/pages.js, no css/, no js/. Do not commit or push; the thread does that.
- If a component lacks something you need, do NOT build home-made UI: write it under
  "Component gaps" in your README.md (what, which component, which option is missing).

## Binding rules (read both fully before building)
- research/_review/DEMO_RULES.md (every chapter; confirm each chapter in your report: kept, or why not).
- /home/claude/dev-procedure/UI_PRINCIPLES.md (§5: no balloon tests).
- Start from research/findings-1019/demo.html for the page skeleton (head, theme boot, review kit
  script). data-review="audhd-<screen>", data-review-themes="formal" (new demos are formal only).
- Every component's options are in its header comment: js/<component>.js. Read the header of every
  component you use and use its options; every useful variant becomes a runtime option with a
  default, shown switchable in the dialog (data-review-choices with a default; DEMO_RULES §7).
- Each section: heading + one sentence saying what it does, a look-at line for formal, the
  component dominant, at most four control groups AT the component (data-review-controls-for),
  working state buttons (loading via the busy card over data areas, empty and failed full size and
  centred). Real sample content in English (Belgian dishes are welcome), dates dd/mm/yyyy HH:mm.
- Build from package parts only (kp-button etc.), no plain <button> without a kp class, no CDNs.
- Your own improvement ideas are wanted (Kenny: "denk niet alleen aan wat ik gezegd heb"): add them as
  extra options or a section, each saying why it helps someone with AuDHD.

## Checking
- NO test suites: never run npm test, test:tags, test:browser, playwright test or verify.
- Allowed: node research/_review/check-kit.mjs and measure-gaps.mjs on your page (read their header
  for usage), and a Playwright screenshot script of your own in Chromium
  (executablePath /opt/pw-browsers/chromium if needed) at 1920x965, 1280x800 and 390x844, opening the
  review dialog. Look at the screenshots yourself; fix what is wrong. Delete scratch scripts after.
- Report back in at most 25 lines: files written, sections (count), components and options used,
  component gaps, DEMO_RULES chapter confirmations, check-kit result, what you could not do.
