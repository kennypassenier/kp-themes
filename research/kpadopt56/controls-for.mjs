// Declares, for every container of a section's own controls, the component it drives
// (`data-review-controls-for="<id>"`, Kenny, 2026-10-18 07:09: only the fitting control per component, standing at the
// component): the stage that follows the controls in the section, that is the next block (div, form, figure, list,
// table) beside the container, skipping a readout or a label line. The review dialog (research/_review/review.js,
// placeControls) shows the container directly above that block and nowhere else; check-kit.mjs fails a container that
// names none. Shared by research/kpadopt56/build-parts.mjs and research/kpadopt56-formal/build.mjs.

const VOID = new Set(['br', 'img', 'input', 'hr', 'meta', 'link', 'source', 'path', 'circle', 'rect', 'line', 'use', 'stop', 'col']);
const STAGE_TAGS = new Set(['div', 'section', 'form', 'figure', 'ul', 'ol', 'table', 'article', 'dl']);
const TAG = /<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

/**
 * @param {string} text one section's markup @param {string} sectionId
 * @returns {string} the markup with `data-review-controls-for` on every controls container
 */
export function declareControls(text, sectionId) {
    let out = text;
    let from = 0;
    let n = 0;
    for (;;) {
        TAG.lastIndex = from;
        /** @type {RegExpExecArray | null} */
        let open = null;
        for (let t; (t = TAG.exec(out)); ) if (!t[1] && /\sdata-review-controls(\s|=|$)/.test(t[3])) { open = t; break; }
        if (!open) return out;
        n += 1;
        // Walk to the end of the container, then to the next sibling stage.
        let depth = 1;
        let after = open.index + open[0].length;
        TAG.lastIndex = after;
        for (let t; depth > 0 && (t = TAG.exec(out)); ) {
            if (VOID.has(t[2].toLowerCase()) || t[0].endsWith('/>')) continue;
            depth += t[1] ? -1 : 1;
            after = t.index + t[0].length;
        }
        let stage = null;
        depth = 0;
        TAG.lastIndex = after;
        for (let t; (t = TAG.exec(out)); ) {
            const name = t[2].toLowerCase();
            if (VOID.has(name) || t[0].endsWith('/>')) continue;
            if (t[1]) {
                depth -= 1;
                if (depth < 0) break; // the section ended
                continue;
            }
            if (depth === 0 && STAGE_TAGS.has(name) && !/\sdata-review-look\b/.test(t[3]) && !/(readout|label|note|log|-expect(?:ed)?)\b/.test(/\sclass="([^"]*)"/.exec(t[3])?.[1] ?? '')) {
                stage = t;
                break;
            }
            depth += 1;
        }
        if (!stage) throw new Error(`${sectionId}: controls with no component after them`);
        let target = /\sid="([^"]+)"/.exec(stage[3])?.[1] ?? null;
        let tagText = stage[0];
        let stageAt = stage.index;
        if (!target) {
            target = `${sectionId}-component${n > 1 ? `-${n}` : ''}`;
            const marked = tagText.replace(/^<([\w-]+)/, `<$1 id="${target}"`);
            out = out.slice(0, stageAt) + marked + out.slice(stageAt + tagText.length);
        }
        // The controls' own open tag (before the stage, so its index stands).
        const tagged = open[0].replace(/\sdata-review-controls-for="[^"]*"/, '').replace(/\bdata-review-controls\b/, `data-review-controls data-review-controls-for="${target}"`);
        out = out.slice(0, open.index) + tagged + out.slice(open.index + open[0].length);
        from = open.index + tagged.length;
    }
}
