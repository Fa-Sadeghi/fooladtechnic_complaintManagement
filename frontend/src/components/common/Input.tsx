
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    requiredField?: boolean;
    numbersOnly?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            requiredField = false,
            numbersOnly = false,
            className = "",
            id,
            onChange,
            ...props
        },
        ref
    ) => {
        const inputId = id || props.name;

        const handleChange = (
            event: React.ChangeEvent<HTMLInputElement>
        ) => {
            if (numbersOnly) {
                event.target.value = event.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, props.maxLength ?? 12);
            }

            onChange?.(event);
        };

        return (
            <div className="form-field">
                {label && (
                    <label className="form-label" htmlFor={inputId}>
                        {label}
                        {requiredField && (
                            <span className="required-mark">*</span>
                        )}
                    </label>
                )}

                <input
                    {...props}
                    ref={ref}
                    id={inputId}
                    type={numbersOnly ? "tel" : props.type}
                    inputMode={numbersOnly ? "numeric" : props.inputMode}
                    maxLength={numbersOnly ? (props.maxLength ?? 12) : props.maxLength}
                    onChange={handleChange}
                    className={`form-input ${error ? "is-invalid" : ""} ${className}`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : hint
                                ? `${inputId}-hint`
                                : undefined
                    }
                />

                {error && (
                    <span className="form-error" id={`${inputId}-error`}>
                        {error}
                    </span>
                )}

                {!error && hint && (
                    <span className="form-hint" id={`${inputId}-hint`}>
                        {hint}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
