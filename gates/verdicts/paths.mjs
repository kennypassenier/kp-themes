// Repository root and the files the verdict tools read and write, plus the git helper.

import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { NOTES, REGISTER } from '../check-verdicts.mjs';
import { execFileSync } from 'node:child_process';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export const registerPath = join(ROOT, REGISTER);

export const notesPath = join(ROOT, NOTES);

/** @param {string[]} args */
export const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
