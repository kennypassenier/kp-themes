// git's text view of the review database (`diff=kp-sqlite` in .gitattributes, `npm run db:git-setup` wires it): one
// line per row, `table<TAB>[values]`, sorted, so `git diff` and `git log -p` show which rows a commit changed.
//
//   node gates/db/git-dump.mjs <file.sqlite>

import process from 'node:process';
import { openDatabase } from './connection.mjs';
import { rowsOf, tables } from './rows.mjs';

const [file] = process.argv.slice(2);
if (!file) {
    console.error('usage: node gates/db/git-dump.mjs <file.sqlite>');
    process.exit(2);
}
try {
    const db = openDatabase({ path: file, write: false, check: false });
    const lines = [];
    for (const table of tables(db)) for (const row of rowsOf(db, table).values()) lines.push(`${table}\t${row}`);
    db.close();
    process.stdout.write(`${lines.sort().join('\n')}\n`);
} catch (error) {
    console.error(`git-dump: ${file}: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
}
