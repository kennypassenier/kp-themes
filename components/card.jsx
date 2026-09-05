import { forwardRef } from 'react';

// Card [TH6]. The --card pair is already gated; this is the shape.
//
// Since 3.0.0 [KT6]: the heading level is a prop (a card under an <h4>
// broke the outline with its fixed <h3>), the title is a node, there are
// header, actions and footer slots, the body wrapper is optional, and a
// ref is forwarded.

/**
 * @typedef {object} CardProps
 * @property {import('react').ReactNode} [title]
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel]  Default 3.
 * @property {import('react').ReactNode} [header]    Replaces the title row entirely.
 * @property {import('react').ReactNode} [actions]   Rendered beside the title.
 * @property {import('react').ReactNode} [footer]
 * @property {boolean} [padded]   Wrap the children in the body element. Default true.
 * @property {import('react').ElementType} [as]  Default 'div'.
 * @property {{ title?: string, header?: string, body?: string, footer?: string, actions?: string }} [classNames]
 * @property {string} [className]
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {CardProps & import('react').HTMLAttributes<HTMLElement>} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function CardInner(
    { title, headingLevel = 3, header, actions, footer, padded = true, as: As = 'div', classNames = {}, className = '', children, ...rest },
    ref,
) {
    const Heading = /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (`h${headingLevel}`);
    return (
        <As ref={ref} className={`kp-card ${className}`.trim()} data-slot="card" {...rest}>
            {header ??
                ((title || actions) && (
                    <div className={`kp-card__header ${classNames.header ?? ''}`.trim()}>
                        {title && <Heading className={`kp-card__title ${classNames.title ?? ''}`.trim()}>{title}</Heading>}
                        {actions && <div className={`kp-card__actions ${classNames.actions ?? ''}`.trim()}>{actions}</div>}
                    </div>
                ))}
            {padded ? <div className={`kp-card__body ${classNames.body ?? ''}`.trim()}>{children}</div> : children}
            {footer && <div className={`kp-card__footer ${classNames.footer ?? ''}`.trim()}>{footer}</div>}
        </As>
    );
}

const Card = forwardRef(CardInner);
export default Card;
