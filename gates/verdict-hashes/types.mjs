// Shapes of a hash reading shared by the verdict-hash parts.

/**
 * @typedef {{ base: string, href: string, themes: string[], width: number, height?: number, withLines?: boolean, only?: string[] | null }} Measure
 * @typedef {{ key: string, title: string, hash: string, lines?: string[] }} Reading
 * @typedef {{ page: string, hashVersion: number | null, engine: string, width: number, results: Record<string, Reading[]> }} PageReading
 */
