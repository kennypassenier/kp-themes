// Shapes shared by the comparison generator's parts.

/**
 * @typedef {{ token: string, old: string | null, now: string | null }} TokenChange
 * @typedef {{
 *   name: string, label: string,
 *   changed: TokenChange[], added: TokenChange[], removed: TokenChange[],
 *   fonts: { family: string, shipped: boolean }[],
 *   register: 'new' | 'rewritten' | 'changed' | 'unchanged' | 'none',
 *   texture: { old: number | null, now: number | null, proposal: number | null },
 *   lines: string[], show: string[],
 * }} ThemeDiff
 */
