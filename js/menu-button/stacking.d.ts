/**
 * A positioned box with a z-index, a sticky or fixed box, a flex or grid item with a z-index (positioned or not), and a box
 * with a transform, filter, backdrop-filter, perspective, clip-path, mask, an opacity under 1, isolation, a blend mode,
 * containment of paint or layout, or a `will-change` naming one of those. A later box on the same layer paints over what
 * is inside any of them, whatever the inner z-index.
 * @param {CSSStyleDeclaration} style the box
 * @param {CSSStyleDeclaration | null} parent its parent, for the flex or grid item test
 */
export declare function formsStackingContext(style: CSSStyleDeclaration, parent: CSSStyleDeclaration | null): boolean;
