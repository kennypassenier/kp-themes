// Repository root of the verdict tools, plus the git helper. The stores they read and write are in the review
// database (gates/db/).

import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** @param {string[]} args */
export const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
