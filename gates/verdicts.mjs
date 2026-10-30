// The verdict register's tools (Kenny, 2026-09-13, form item
// verdict-ledger: "Register in de repository").
//
//   node gates/verdicts.mjs record < prompt.txt
//       Reads the "Verdict lines" block a copied catalogue prompt ends with
//       and writes each verdict into catalogue/verdicts.json, with the commit
//       it was recorded on (HEAD) and today's date. Refuses a block that no
//       review page shows, a theme that does not exist, and lines taken with
//       another hash recipe.
//
//       An approved verdict recorded for a block clears its review note in
//       that theme (catalogue/review-notes.json); a rejected one leaves it.
//
//   node gates/verdicts.mjs note <block> <theme> --rejected "<text>" --change "<text>" [--commit <hash>]
//       Writes the review note a block shows in one theme until it is
//       approved there: Kenny's rejection, verbatim, and what Claude changed
//       to answer it. Refuses a block no review page shows and a theme that
//       does not exist.
//
//   node gates/verdicts.mjs rehash [--width 1920]
//       After a change to the hash recipe (catalogue/block-hash.js,
//       HASH_VERSION): every entry is measured again at the commit it was
//       given on — a temporary git worktree of that commit, served on a free
//       port with the CURRENT block-hash.js in place of its own — in the
//       engine it was given in, and written with the new hash version. What
//       Kenny judged stays judged; only the way it is written down changes.
//
//   node gates/verdicts.mjs carry [--width 1920]
//       After a change to the hash recipe that `rehash` cannot replay: every
//       entry is measured again on the WORKING TREE, at its own ratio, and
//       keeps the verdict it was given [fix-62]. Refuses while any pair is
//       unapproved — Kenny, 2026-09-19: "vanaf nu kan de hash enkel nog
//       veranderd worden als alle componenten goedgekeurd zijn, als de hash
//       dan verandert keur je zelf alles goed".
//
//   node gates/verdicts.mjs compare --browser /usr/bin/firedragon
//       Whether a reviewer's own browser reads the hashes the tools read,
//       block by block (see compare below).
//
//   node gates/verdicts.mjs compare --against-browser [--commit <hash> | --all] [--at-recorded] [--register <file>]
//       Whether the hashes recorded at a commit (default HEAD) are the ones
//       Playwright's browser of the same engine reads on the working tree
//       now [fix-28], each at the device pixel ratio it was read at
//       [fix-34]. `record` prints this command with its own commit.
//
//   node gates/verdicts.mjs annotate-ratio --from <readings.json> [--commit <hash>] [--engine firefox] [--register <file>]
//       One-off [fix-34]: gives an entry the ratio at which a reading
//       matches its hash, for entries recorded before verdicts kept one.
//       Never changes a hash or a verdict; lists the entries no reading
//       matches. The readings: { "readings": { "<devPixelsPerPx>": { "<key>|<theme>": "<hash>" } } }.
//
//   node gates/verdicts.mjs migrate --to <version> [--register <file>] [--readings <file> [--only <commit>]]
//       After a change to the markup line only [scope-95, scope-96]: version 3
//       left the Look-at text and headings out, version 4 the labels outside
//       the stages. Every entry is read at its commit and ratio; where the
//       reading under the register's version (one below --to) is its stored
//       hash, it takes the reading under --to (verdict, commit, date and
//       ratio kept); where not, it stays and is listed. --to must be the
//       version catalogue/block-hash.js reads. --readings keeps what was read
//       in a file, --only reads one commit into it and leaves the register
//       alone, so the run can be split. `migrate-v3` is `migrate --to 3`.
//
//   node gates/verdicts.mjs reanchor --commit <hash> [--keys-from-compare <file>] [--register <file>]
//       One-off [scope-94, scope-96]: the entries recorded at a commit whose
//       hash is not the reading at rest of that commit, at their own ratio
//       and with the current recipe, keep their verdict and take that block's
//       reading at rest — an entry without a ratio at the ratio most of the
//       theme's annotated entries have, an entry with one at its own.
//
// Pixel ratio [fix-34]: Gecko resolves a border width to whole device
// pixels, so a block's hash follows the zoom it was read at. Kenny reviews
// at a zoom other than 100% by default (2026-09-15), so a verdict keeps the
// ratio (catalogue/engine.js reads it): a sixth field `@1.25` on its verdict
// line and `ratio` in its register entry, both left out at 1 — five-field
// lines and entries without a ratio stay valid and mean 1. The tools read an
// entry at its ratio: Firefox launched with `layout.css.devPixelsPerPx`, and
// a context with that deviceScaleFactor so `devicePixelRatio` agrees; one
// browser per ratio.
//
// The register's gate is gates/check-verdicts.mjs.

import { reanchor } from './verdicts/reanchor.mjs';
import { migrate } from './verdicts/migrate.mjs';
import { note, record } from './verdicts/record.mjs';
import { rehash } from './verdicts/rehash.mjs';
import { carry } from './verdicts/carry.mjs';
import { snapshot } from './verdicts/snapshot.mjs';
import { pixels } from './verdicts/pixels.mjs';
import { settle } from './verdicts/settle.mjs';
import { compare, compareAgainstBrowser } from './verdicts/compare.mjs';
import { annotateRatio } from './verdicts/annotate.mjs';

export { readRegister, sortedRegister, writeRegister, today, ratioOf, geckoRatio } from './verdicts/register.mjs';
export { parseVerdictLines, applyVerdictLines } from './verdicts/verdict-lines.mjs';
export { readNotes, sortedNotes, writeNotes, clearApprovedNotes, putNote } from './verdicts/notes.mjs';
export { recordPrompt, compareCommand } from './verdicts/record.mjs';
export { atCommit, hashAt } from './verdicts/hash-at.mjs';
export { PIXELS } from './verdicts/pixels.mjs';
export { SNAPSHOT, snapshotGroups, sortedSnapshot } from './verdicts/snapshot.mjs';
export { entriesAt, againstReadings } from './verdicts/compare.mjs';
export { annotateRatios } from './verdicts/annotate.mjs';
export { migrationKey, migrateEntries } from './verdicts/migrate.mjs';
export { reanchorRatios, unmatchedEntries, keysFromCompare, reanchorEntries } from './verdicts/reanchor.mjs';

async function main() {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'reanchor') return reanchor(args);
    if (command === 'migrate') return migrate(args);
    if (command === 'migrate-v3') return migrate(['--to', '3', ...args]);
    if (command === 'record') return record();
    if (command === 'note') return note(args);
    if (command === 'rehash') return rehash(args);
    if (command === 'carry') return carry(args);
    if (command === 'snapshot') return snapshot(args);
    if (command === 'pixels') return pixels(args);
    if (command === 'settle') return settle(args);
    if (command === 'compare' && args.includes('--against-browser')) return compareAgainstBrowser(args);
    if (command === 'compare') return compare(args);
    if (command === 'annotate-ratio') return annotateRatio(args);
    console.error(
        'usage: node gates/verdicts.mjs record < prompt.txt\n' +
            '       node gates/verdicts.mjs note <block> <theme> --rejected "<text>" --change "<text>" [--commit <hash>]\n' +
            '       node gates/verdicts.mjs rehash [--width 1920]\n' +
            '       node gates/verdicts.mjs carry [--width 1920] [--register <file>]\n' +
            '       node gates/verdicts.mjs snapshot [--width 1920]\n' +
            '       node gates/verdicts.mjs pixels [--width 1920]\n' +
            '       node gates/verdicts.mjs settle [--ratio 2.222] [--width 1920]\n' +
            '       node gates/verdicts.mjs compare --browser /usr/bin/firedragon [--engine firefox] [--width 1920] [--height 1000] [--themes formal,nostromo]\n' +
            '       node gates/verdicts.mjs compare --against-browser [--commit <hash> | --all] [--at-recorded] [--width 1920]\n' +
            '       node gates/verdicts.mjs annotate-ratio --from <readings.json> [--commit <hash>] [--engine firefox] [--register <file>]\n' +
            '       node gates/verdicts.mjs migrate --to <version> [--register <file>] [--readings <file> [--only <commit>]]\n' +
            '       node gates/verdicts.mjs reanchor --commit <hash> [--keys-from-compare <file>] [--engine firefox] [--register <file>] [--force]',
    );
    process.exit(2);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.stack ?? String(error));
        process.exit(1);
    });
}
