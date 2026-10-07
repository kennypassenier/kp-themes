// research/character-trend, forest: the live update (decided: "growth ring")
// is a thin ring drawn once round the end of the line, the newest reading
// (themes/forest/CHARACTER.md G8); the stroke no longer swells. CSS cannot
// place a ring on a point of an SVG path, so this reads the path's end after
// the demo's own redraw and appends one circle beside it (forest.css animates
// it). Nothing happens in any other theme or for any other live pick.

const SVG_NS = 'http://www.w3.org/2000/svg';

const ring = () => {
    if (document.documentElement.getAttribute('data-theme') !== 'forest') return;
    for (const tile of document.querySelectorAll('[data-ct-live="3"] .kp-kpi--trend:not([aria-busy="true"])')) {
        for (const old of tile.querySelectorAll('.fog-ring')) old.remove();
        for (const line of tile.querySelectorAll('.kp-kpi__spark path.kp-kpi__spark-line')) {
            const path = /** @type {SVGPathElement} */ (line);
            const end = path.getPointAtLength(path.getTotalLength());
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('class', 'fog-ring');
            circle.setAttribute('cx', String(end.x));
            circle.setAttribute('cy', String(end.y));
            circle.setAttribute('r', '8');
            circle.setAttribute('pathLength', '1');
            circle.addEventListener('animationend', () => circle.remove());
            path.parentElement?.append(circle);
        }
    }
};

document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-tr-live]')) setTimeout(ring, 60);
});
