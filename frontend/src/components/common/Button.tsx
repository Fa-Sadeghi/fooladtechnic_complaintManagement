
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
}

export default function Button({
                                   children,
                                   variant = "primary",
                                   size = "md",
                                   loading = false,
                                   fullWidth = false,
                                   disabled,
                                   className = "",
                                   type = "button",
                                   ...props
                               }: ButtonProps) {
    const classes = [
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
        loading ? "btn-loading" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            <span>{children}</span>
        </button>
    );
}
