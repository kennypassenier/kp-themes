// Card [TH6]. The --card pair is already gated; this is the shape.

/**
 * @param {{ title?: string, className?: string, children?: import('react').ReactNode }} props
 */
export default function Card({ title, className = '', children, ...rest }) {
    return (
        <div className={`kp-card ${className}`.trim()} data-slot="card" {...rest}>
            {title && <h3 className="kp-card__title">{title}</h3>}
            <div className="kp-card__body">{children}</div>
        </div>
    );
}
