// A page shown as a PREVIEW inside another page (research/review-kit-v2 shows the real dialog and the real Agenda in frames,
// address `?rv-preview=1`) must leave everything of the viewer alone, and must show a known state. In that mode the kit's own
// keys of the page's storage (verdicts, journal, answers, options, pace, resume) read from and write to memory only: nothing the
// frame does is kept, and nothing the viewer has kept is shown in it, so every preview opens at the same first step with the
// same defaults. `?rvopt=` seeds that memory, a JSON object of storage key to value, which is how a preview shows an option
// switched on or off, or a part half judged.
//
// Imported first by review.js and loaded first on the Agenda. Without `rv-preview` in the address it does nothing at all.
const params = new URLSearchParams(location.search);
if (params.has('rv-preview')) {
    /** @type {Map<string, string>} */
    const memory = new Map();
    try {
        for (const [key, value] of Object.entries(JSON.parse(params.get('rvopt') || '{}'))) memory.set(key, String(value));
    } catch {
        /* an unreadable seed is an empty memory */
    }
    const KEPT = /^(kp-demo-review:|kp-review-|kp-flow-)/;
    const { getItem, setItem, removeItem } = Storage.prototype;
    const own = (/** @type {Storage} */ area, /** @type {string} */ key) => area === localStorage && KEPT.test(String(key));
    Storage.prototype.getItem = function (key) {
        return own(this, key) ? (memory.get(String(key)) ?? null) : getItem.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
        if (own(this, key)) memory.set(String(key), String(value));
        else setItem.call(this, key, value);
    };
    Storage.prototype.removeItem = function (key) {
        if (own(this, key)) memory.delete(String(key));
        else removeItem.call(this, key);
    };
}
