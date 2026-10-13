# Brief, review round 1 of research/all-themes-applied: Kenny's rejections (2026-10-13 18:19)

Same rules as research/all-themes/BRIEF.md (read it; its "Never" list holds, js/* and research/_review/* included: the
coordinating session fixes shared code itself). Only the registers of the themes you are given, plus the theme's
CHARACTER.md note and its report (append a "Review round 1" section to research/all-themes/reports/<theme>.md).
Firefox only. Judge the way Kenny judges (lesson 28): in the review dialog's stage
(`research/all-themes-applied/demo.html?review=open`), real mouse clicks at coordinates, every frame, then screenshots you
look at yourself. A measurement that passes while Kenny sees a fault is a wrong measurement.

Kenny's words are quoted verbatim per item. For each: reproduce it, find the cause, fix it in the register, show it is
gone (frames or screenshots), and re-run `KP_THEME=<t> node research/all-themes/_audit/pairs-meter.mjs --theme <t>
--engine firefox` for the pairs you touched. If the fix needs shared code, stop on that item and describe the cause and
the change you would make in your final message.

Final message: per item, the cause in one sentence, what changed, and the evidence.
