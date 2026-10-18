# research/almanac-try-source: Almanac "Try a source" and the source profile view, in formal

Two new Almanac pages (feat-ui-2 Try a source, feat-ui-7 Source profile view in `~/Projects/almanac/docs/KP_THEMES_11_ADOPTION.md`),
built only from kp-themes 11.0.0 parts, formal only (`data-review-themes="formal"`): 4 sections, 4 pairs, one topic each.

| Section | What it judges | Parts |
| --- | --- | --- |
| `source-profile` | the source picker, the profile as readable facts and as the TOML file | `.kp-segmented`, `.kp-card[data-kp-state]`, `.kp-kv` (columns, lines, stack), `.kp-code` (TOML, line numbers, wrap), `.kp-copyable` |
| `event-editor` | writing an event call: JSON field with the schema check, format, gutter; Try; loading and failed | `.kp-jsonfield` (`data-kp-json`, `-schema`, `-indent`, `-format`, `-check`, `-gutter`), `.kp-card` states, `.kp-alert`, `.kp-button` |
| `path-trace` | where a call stops: call, profile, event, calendar; the refusal lit; running, empty, failed | `.kp-trace` (stop, verdict, rule, layout, copy), `.kp-alert`, `.kp-code` |
| `try-result` | the event in plain words, the diff against the event in the calendar (create vs update), Copy as curl | `.kp-kv`, `.kp-diff` (lines and `@@` hunks), `.kp-command` (bash), `.kp-card` states, `.kp-badge`, state plates |

The sections do not share state: in the review dialog each one is its own frame, so each has its own source and case buttons.

## What is mock

- **No server is called.** `engine.js` is a JavaScript port of Almanac's dry-run (`src/shell/admin.rs` `dry_run`, `src/core/request.rs`,
  `colors.rs`, `profile.rs`). Checked on 19/10/2026 against both pinned files: the Home Assistant and the Everything sample payloads in
  `fixtures/payloads` map to exactly the JSON in `fixtures/expected` (the Everything one with a profile named `everything`). The refusal wording is
  serde's and Almanac's own; chrono's timestamp wording ("premature end of input") is approximated.
- Only `home-assistant` is a real profile name. `homelab`, `kyu` and `claude-sessions` are sample names, every calendar id is made up
  (`*.calendar.example`), and so is the event "already in the calendar" (sample data, labelled on the page).
- **Almanac's dry-run does not return the existing event or a create/update verdict** (it only maps; `would_write_to_calendar` and `event`). The
  diff and the "would update" badge show what the page would show once the dry-run also looks up the marker
  (`extendedProperties.private.almanac_source_id`) in the target calendar. Also: dry-run skips the ingest layer's rule that a call needs an
  `external_id` or an `Idempotency-Key` header, so the Event step can say accepted for a call ingest would still refuse.
- `.kp-spec` in the adoption map is the theme-palette block, not an event spec; the event spec here is `.kp-kv`.

## Choices (dialog defaults; every option is real and switches live)

| Section | Set | Options (default first) |
| --- | --- | --- |
| source-profile | summary layout | columns, lines, stack |
| source-profile | line numbers in the file | on, off |
| event-editor | indent of Format | 2, 4, tab |
| event-editor | when it is laid out | button, on-blur, off |
| event-editor | when it is checked | input, blur |
| event-editor | line numbers | on, off |
| path-trace | after a refusal | first-refusal, all |
| path-trace | verdict shown | both, mark, word |
| path-trace | deciding rule | chip, inline, off |
| path-trace | direction | auto, row, column |
| try-result | lines of the comparison | all, hunks |
| try-result | curl command | just the call, piped through jq |

Hand-written files, no generator: `demo.html`, `demo.js`, `engine.js`, `page.css`.
