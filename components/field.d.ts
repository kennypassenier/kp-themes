/**
 * @param {{ label: string, help?: string, error?: string, className?: string }} props
 */
export default function Field({ label, help, error, className, ...rest }: {
    label: string;
    help?: string;
    error?: string;
    className?: string;
}): import("react").JSX.Element;
