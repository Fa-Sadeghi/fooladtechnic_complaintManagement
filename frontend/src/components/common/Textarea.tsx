
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    requiredField?: boolean;
}

export default function Textarea({
                                     label,
                                     error,
                                     hint,
                                     requiredField = false,
                                     className = "",
                                     id,
                                     ...props
                                 }: TextareaProps) {
    const textareaId = id || props.name;

    return (
        <div className="form-field">
            {label && (
                <label className="form-label" htmlFor={textareaId}>
                    {label}
                    {requiredField && <span className="required-mark">*</span>}
                </label>
            )}

            <textarea
                id={textareaId}
                className={`form-input form-textarea ${error ? "is-invalid" : ""} ${className}`}
                aria-invalid={Boolean(error)}
                {...props}
            />

            {error && <span className="form-error">{error}</span>}
            {!error && hint && <span className="form-hint">{hint}</span>}
        </div>
    );
}
