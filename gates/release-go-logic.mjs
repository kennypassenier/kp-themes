// When is a release go active? A go recorded for version V is active while V is greater than the latest release tag
// and V is not tagged yet. Once `v<V>` exists the go is spent; nothing is removed by hand. The tags are read through
// an injectable reader, so the tests use fake tags and the CLI uses git.


/** @typedef {import('./db/release-go-store.mjs').Go} Go */
/** @typedef {{ latest: () => string | null, has: (version: string) => boolean }} TagReader */

const VERSION = /^(\d+)\.(\d+)\.(\d+)$/;

/** @param {string} text @returns {number[]} */
export function parseVersion(text) {
    const m = VERSION.exec(text);
    if (!m) throw new Error(`"${text}" is not a version of the form X.Y.Z`);
    return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Negative, zero or positive like a sort comparator. @param {string} a @param {string} b */
export function compareVersions(a, b) {
    const [x, y] = [parseVersion(a), parseVersion(b)];
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

/** The goes still usable, newest version first. @param {Go[]} gos @param {TagReader} tags */
export function activeGos(gos, tags) {
    const latest = tags.latest();
    return gos
        .filter((g) => (latest === null || compareVersions(g.version, latest) > 0) && !tags.has(g.version))
        .sort((a, b) => compareVersions(b.version, a.version));
}

/** Why a go for `version` cannot be recorded, or null when it can. @param {string} version @param {TagReader} tags */
export function refusal(version, tags) {
    parseVersion(version);
    if (tags.has(version)) return `v${version} is already tagged: that release is out, a go for it would be spent at once`;
    const latest = tags.latest();
    if (latest !== null && compareVersions(version, latest) <= 0) return `${version} is not greater than the latest release tag v${latest}`;
    return null;
}
