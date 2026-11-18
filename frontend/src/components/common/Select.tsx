
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
    requiredField?: boolean;
}

export default function Select({
                                   label,
                                   error,
                                   hint,
                                   options,
                                   placeholder,
                                   requiredField = false,
                                   className = "",
                                   id,
                                   ...props
                               }: SelectProps) {
    const selectId = id || props.name;

    return (
        <div className="form-field">
            {label && (
                <label className="form-label" htmlFor={selectId}>
                    {label}
                    {requiredField && <span className="required-mark">*</span>}
                </label>
            )}

            <select
                id={selectId}
                className={`form-input form-select ${error ? "is-invalid" : ""} ${className}`}
                aria-invalid={Boolean(error)}
                {...props}
            >
                <option value="">{placeholder || "انتخاب کنید"}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <span className="form-error">{error}</span>}
            {!error && hint && <span className="form-hint">{hint}</span>}
        </div>
    );
}
