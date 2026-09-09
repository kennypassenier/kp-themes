<!-- id-translations: enforced -->

# Identifier translations — kp-themes

One row per identifier that has moved from the old shape to the house
scheme (standing rule 4, policy set 2026-09-09). The rule is
self-dosing: nothing is renamed in bulk, and an old identifier is
translated only when it surfaces by itself — when a commit rewrites the
line that defines it.

The old name may not survive anywhere else in the tracked files once it
is listed here. `~/Projects/dev-procedure/hooks/check-ids.sh` refuses the
commit otherwise, because half a rename leaves two names for one thing
and no document saying which is real.

This file is the one place the old names are supposed to live.

| Old | New | Moved | Why it surfaced |
| --- | --- | ----- | --------------- |
| HA3 | feat-ha-1 | 2026-09-10 | Kenny approved the two Home Assistant card-mod registers, so the row that defines the item was rewritten from open to closed |
