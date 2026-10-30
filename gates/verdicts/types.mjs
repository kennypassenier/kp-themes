// The register's entry and file shapes, shared by every verdicts part.

/**
 * @typedef {{ verdict: string, hash: string, commit: string, given: string, ratio?: number }} Entry
 * @typedef {{ hashVersion: number, verdicts: Record<string, Record<string, Record<string, Entry>>> }} Register
 */

/**
 * @typedef {{ rejected: string, change: string, commit?: string, given: string }} Note
 * @typedef {Record<string, Record<string, Note>>} Notes
 */
