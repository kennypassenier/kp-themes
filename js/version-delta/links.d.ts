/**
 * `owner/repo` of an upstream as the fleet check names it (`github.com/owner/repo`, with a scheme, `www.` or `.git`
 * allowed); null for anything that is not a GitHub repository.
 * @param {string} upstream
 * @returns {{ owner: string, repo: string } | null}
 */
export declare function githubRepo(upstream: string): {
    owner: string;
    repo: string;
} | null;
/**
 * The newer version's release page, absolute; null when the upstream is not a GitHub repository or there is no tag.
 * @param {string} upstream
 * @param {string} latest
 * @returns {string | null}
 */
export declare function releaseUrl(upstream: string, latest: string): string | null;
