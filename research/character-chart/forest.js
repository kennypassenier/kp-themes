// research/character-chart, forest: the chart's update (decided: "none, it
// appears") becomes forest's growth ring (themes/forest/CHARACTER.md G8): a
// thin ring is drawn once round the newest point of every series, clockwise
// from the top, then fades; the line itself never moves. CSS cannot place a
// ring on a point of an SVG path, so this reads the path's end and appends one
// circle beside it (forest.css animates it). Nothing happens in any other
// theme or for any other update pick.

const SVG_NS = 'http://www.w3.org/2000/svg';

const ring = (/** @type {Element} */ wrapper) => {
    if (document.documentElement.getAttribute('data-theme') !== 'forest') return;
    if (wrapper.closest('[data-cc-update]')?.getAttribute('data-cc-update') !== 'none') return;
    for (const line of wrapper.querySelectorAll('.kp-chart__plot:not(.kp-chart__spark-plot) path.kp-chart__line')) {
        const path = /** @type {SVGPathElement} */ (line);
        const end = path.getPointAtLength(path.getTotalLength());
        const circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttribute('class', 'fog-ring');
        circle.setAttribute('cx', String(end.x));
        circle.setAttribute('cy', String(end.y));
        circle.setAttribute('r', '9');
        circle.setAttribute('pathLength', '1');
        circle.addEventListener('animationend', () => circle.remove());
        path.parentElement?.append(circle);
    }
};

new MutationObserver((records) => {
    for (const record of records) {
        const target = /** @type {Element} */ (record.target);
        if (target.hasAttribute('data-cc-updating')) ring(target);
        else for (const old of target.querySelectorAll('.fog-ring')) old.remove();
    }
}).observe(document.body, { attributes: true, attributeFilter: ['data-cc-updating'], subtree: true });
