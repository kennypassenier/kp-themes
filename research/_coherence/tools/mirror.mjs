// Every close is its open played backwards: for each scene of an anchor
// demo, the pose of every animated part at t into `in` is compared with its
// pose at (T - t) into `out`, in Chromium, with the demo's clock stopped.
//   node mirror.mjs research/<theme>-anchor [port]
import { chromium } from 'playwright';

const demo = process.argv[2];
const port = process.argv[3] || '8743';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
await page.goto(`http://127.0.0.1:${port}/${demo}/demo.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const result = await page.evaluate(async () => {
    const pause = document.createElement('span');
    pause.id = 'rv-flip-pause';
    pause.textContent = 'paused';
    pause.hidden = true;
    document.body.append(pause);
    const settle = () => new Promise((r) => setTimeout(r, 0));
    const PROPS = [
        'scale',
        'translate',
        'rotate',
        'opacity',
        'clip-path',
        'background-color',
        'box-shadow',
        'filter',
        'inset-inline-start',
        'color',
        'transform',
        'stroke-dashoffset',
        'background-position',
        'width',
        'border-color',
        'outline-color',
        'text-shadow',
    ];
    const unit = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--an-unit')) || 110;
    const T = 8 * unit;
    const out = [];
    for (const scene of document.querySelectorAll('.an-scene[data-an-kind="cycle"]')) {
        const key = scene.dataset.anAnchor;
        const mine = () => document.getAnimations().filter((a) => a.effect && a.effect.target && scene.contains(a.effect.target));
        const targets = () => [...new Set(mine().map((a) => a.effect.target))];
        // inset() shorthands are expanded, so "inset(a b)" and "inset(a b a b)" compare equal.
        const norm = (v) =>
            v.replace(/inset\(([^)]*)\)/g, (_, inner) => {
                const parts = inner.split(/\s+round\s+/);
                const sides = parts[0].trim().split(/\s+/);
                const four =
                    sides.length === 1
                        ? [sides[0], sides[0], sides[0], sides[0]]
                        : sides.length === 2
                          ? [sides[0], sides[1], sides[0], sides[1]]
                          : sides.length === 3
                            ? [sides[0], sides[1], sides[2], sides[1]]
                            : sides;
                return `inset(${four.join(' ')}${parts[1] ? ` round ${parts[1]}` : ''})`;
            });
        const pose = (el) => {
            const cs = getComputedStyle(el);
            return Object.fromEntries(PROPS.map((p) => [p, norm(cs.getPropertyValue(p))]));
        };
        const sample = async (from, to, steps) => {
            scene.setAttribute('data-an-phase', from);
            await settle();
            // An animation touched by the API outlives its phase in Chromium and keeps painting; cancel what is left.
            for (const a of mine()) a.cancel();
            await settle();
            scene.setAttribute('data-an-phase', to);
            await settle();
            // The finished animations of the phase before still list; only the fresh ones are this phase's.
            const anims = mine().filter((a) => a.playState !== 'finished');
            for (const a of anims) a.pause();
            const els = [...new Set(anims.map((a) => a.effect.target))];
            const frames = [];
            for (const t of steps) {
                for (const a of anims) a.currentTime = t;
                await settle();
                frames.push(els.map((el) => pose(el)));
            }
            const ends = anims.map((a) => a.effect.getComputedTiming().endTime);
            for (const a of anims) a.cancel();
            await settle();
            return { els, frames, end: Math.max(0, ...ends) };
        };
        const steps = [];
        for (let t = 0; t <= T; t += unit / 4) steps.push(t);
        const arrive = await sample('gap', 'in', steps);
        const leave = await sample(
            'hold',
            'out',
            steps.map((t) => T - t),
        );
        // Compare per element present in both.
        const faults = [];
        const name = (el) => (el.className && typeof el.className === 'string' ? el.className.replace(/\s+/g, '.') : el.tagName);
        for (const el of arrive.els) {
            const j = leave.els.indexOf(el);
            if (j < 0) {
                faults.push(`${name(el)}: animated on in, not on out`);
                continue;
            }
            const i = arrive.els.indexOf(el);
            let worst = 0;
            let where = '';
            for (let k = 0; k < steps.length; k++) {
                const a = arrive.frames[k][i];
                const l = leave.frames[k][j];
                for (const p of PROPS) {
                    if (a[p] === l[p]) continue;
                    const na = (a[p].match(/-?\d*\.?\d+/g) || []).map(Number);
                    const nl = (l[p].match(/-?\d*\.?\d+/g) || []).map(Number);
                    if (na.length !== nl.length) {
                        if (worst < 1) {
                            worst = 1;
                            where = `${p} at ${steps[k]}ms: "${a[p]}" vs "${l[p]}"`;
                        }
                        continue;
                    }
                    for (let m = 0; m < na.length; m++) {
                        const d = Math.abs(na[m] - nl[m]);
                        const scale = Math.max(1, Math.abs(na[m]), Math.abs(nl[m]));
                        const rel = d / scale;
                        if (rel > worst) {
                            worst = rel;
                            where = `${p} at ${steps[k]}ms: "${a[p]}" vs "${l[p]}"`;
                        }
                    }
                }
            }
            if (worst > 0.08) faults.push(`${name(el)}: off by ${(worst * 100).toFixed(0)} % (${where})`);
        }
        for (const el of leave.els) if (!arrive.els.includes(el)) faults.push(`${name(el)}: animated on out, not on in`);
        out.push({ key, parts: arrive.els.length, inEnd: arrive.end, outEnd: leave.end, faults });
    }
    return { unit, out };
});
console.log(`${demo} · unit ${result.unit} ms`);
for (const s of result.out) {
    console.log(`  ${s.key}: ${s.parts} part(s), in ends ${s.inEnd} ms, out ends ${s.outEnd} ms${s.faults.length ? '' : ' · mirrored'}`);
    for (const f of s.faults) console.log(`    ! ${f}`);
}
await browser.close();
