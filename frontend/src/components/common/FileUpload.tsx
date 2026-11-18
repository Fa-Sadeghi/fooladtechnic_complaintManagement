
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import fa from "../../locales/fa";

interface FileUploadProps {
    files: File[];
    onChange: (files: File[]) => void;
    error?: string;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
}

const ACCEPTED_TYPES = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function FileUpload({
                                       files,
                                       onChange,
                                       error,
                                       maxFiles = 10,
                                       maxSize = MAX_FILE_SIZE,
                                       disabled = false,
                                   }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [validationMessage, setValidationMessage] = useState("");

    const formatFileSize = (size: number) => {
        return size >= 1024 * 1024
            ? `${(size / (1024 * 1024)).toFixed(2)} MB`
            : `${(size / 1024).toFixed(0)} KB`;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        const validFiles: File[] = [];
        const messages: string[] = [];

        selectedFiles.forEach((file) => {
            const alreadyExists = files.some(
                (existingFile) =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
            );

            if (alreadyExists) {
                messages.push(`${file.name}: ${fa.messages.duplicateFile}`);
                return;
            }

            if (file.size > maxSize) {
                messages.push(`${file.name}: ${fa.messages.fileTooLarge}`);
                return;
            }

            validFiles.push(file);
        });

        const remainingSlots = maxFiles - files.length;
        const acceptedFiles = validFiles.slice(0, Math.max(0, remainingSlots));

        if (validFiles.length > remainingSlots) {
            messages.push(fa.messages.maxFilesReached);
        }

        onChange([...files, ...acceptedFiles]);
        setValidationMessage(messages.join(" "));

        // امکان انتخاب مجدد همان فایل در دفعات بعد
        event.target.value = "";
    };

    const removeFile = (index: number) => {
        onChange(files.filter((_, fileIndex) => fileIndex !== index));
        setValidationMessage("");
    };

    return (
        <div className="form-field">
            <div
                className={`file-upload ${error ? "is-invalid" : ""} ${
                    disabled ? "is-disabled" : ""
                }`}
                onClick={() => {
                    if (!disabled) inputRef.current?.click();
                }}
                onKeyDown={(event) => {
                    if (
                        !disabled &&
                        (event.key === "Enter" || event.key === " ")
                    ) {
                        event.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
            >
                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    multiple
                    disabled={disabled}
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={handleFileChange}
                />

                <div className="file-upload-icon">
                    <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="m17 8-5-5-5 5" />
                        <path d="M12 3v12" />
                    </svg>
                </div>

                <p className="file-upload-title">
                    {fa.complaint.attachment.dragDrop}
                </p>

                <p className="file-upload-description">
                    {fa.complaint.attachment.formats}
                </p>

                <span className="file-upload-button">
          {fa.complaint.attachment.select}
        </span>

                <p className="file-upload-limit">
                    {fa.complaint.attachment.maxFiles} ·{" "}
                    {fa.complaint.attachment.maxSize}
                </p>
            </div>

            {(error || validationMessage) && (
                <span className="form-error">
          {error || validationMessage}
        </span>
            )}

            {files.length > 0 && (
                <div className="selected-files">
                    <div className="selected-files-header">
                        <span>{fa.complaint.attachment.selectedFiles}</span>
                        <span className="selected-files-count">
              {files.length} / {maxFiles}
            </span>
                    </div>

                    <div className="selected-files-list">
                        {files.map((file, index) => (
                            <div className="selected-file" key={`${file.name}-${file.lastModified}-${index}`}>
                                <div className="selected-file-icon">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <path d="M14 2v6h6" />
                                    </svg>
                                </div>

                                <div className="selected-file-info">
                  <span className="selected-file-name" title={file.name}>
                    {file.name}
                  </span>
                                    <span className="selected-file-size">
                    {formatFileSize(file.size)}
                  </span>
                                </div>

                                <button
                                    type="button"
                                    className="remove-file-button"
                                    title={fa.complaint.attachment.remove}
                                    aria-label={`${fa.complaint.attachment.remove} ${file.name}`}
                                    disabled={disabled}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        removeFile(index);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
