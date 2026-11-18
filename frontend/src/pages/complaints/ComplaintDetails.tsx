
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Button from '../../components/common/Button';
import complaintService from '../../services/complaintService';
import type { Complaint } from '../../types/complaint';
import fa from '../../locales/fa';

export default function ComplaintDetails() {
    const { id } = useParams<{ id: string }>();

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [downloadError, setDownloadError] = useState('');

    const t = fa.complaint.details;

    const fetchComplaint = useCallback(async () => {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            setError(t.invalidId);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await complaintService.getById(Number(id));
            setComplaint(response);
        } catch {
            setError(t.fetchError);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchComplaint();
    }, [fetchComplaint]);

    const handleDownload = async (
        attachmentId: number,
        fileName: string
    ) => {
        if (!complaint || downloadingId !== null || downloadingAll) return;

        try {
            setDownloadError('');
            setDownloadingId(attachmentId);

            await complaintService.downloadAttachment(
                complaint.id,
                attachmentId,
                fileName
            );
        } catch {
            setDownloadError(t.downloadError);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDownloadAll = async () => {
        if (!complaint || downloadingAll || downloadingId !== null) return;

        setDownloadingAll(true);
        setDownloadError('');

        const failedFiles: string[] = [];

        try {
            for (const attachment of complaint.attachments) {
                try {
                    await complaintService.downloadAttachment(
                        complaint.id,
                        attachment.id,
                        attachment.original_name
                    );

                    await new Promise(resolve =>
                        window.setTimeout(resolve, 700)
                    );
                } catch {
                    failedFiles.push(attachment.original_name);
                }
            }

            if (failedFiles.length > 0) {
                setDownloadError(
                    `${t.downloadSomeFailed} ${failedFiles.join(', ')}`
                );
            }
        } finally {
            setDownloadingAll(false);
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('fa-IR');

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} ${t.kilobyte}`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} ${t.megabyte}`;
    };

    if (loading) {
        return <div className="page-loading">{fa.common.loading}</div>;
    }

    if (error || !complaint) {
        return (
            <div className="page-error">
                <p>{error || t.notFound}</p>
                <Link to="/complaints">{t.backToList}</Link>
            </div>
        );
    }

    return (
        <div className="complaint-details-page">
            <div className="page-header">
                <div>
                    <h1>{t.title}</h1>
                    <p>
                        {t.complaintNumber}: {complaint.id}
                    </p>
                </div>

                <Link to="/complaints">{t.backToList}</Link>
            </div>

            <section className="details-section">
                <h2>{t.complainantInformation}</h2>

                <div className="details-grid">
                    <InfoItem
                        label={fa.complaint.fields.fullName}
                        value={complaint.full_name}
                    />

                    <InfoItem
                        label={fa.complaint.fields.organizationName}
                        value={complaint.organization_name}
                    />

                    <InfoItem
                        label={fa.complaint.fields.mobile}
                        value={complaint.mobile}
                    />

                    <InfoItem
                        label={fa.complaint.fields.landline}
                        value={complaint.landline}
                    />

                    <InfoItem
                        label={t.email}
                        value={complaint.email}
                    />
                </div>
            </section>

            <section className="details-section">
                <h2>{t.complaintInformation}</h2>

                <div className="details-grid">
                    <InfoItem
                        label={fa.complaint.fields.projectTitle}
                        value={complaint.project_title}
                    />

                    <InfoItem
                        label={fa.complaint.fields.serviceType}
                        value={complaint.service_type?.title}
                    />

                    <InfoItem
                        label={fa.complaint.fields.dissatisfactionReason}
                        value={complaint.dissatisfaction_reason?.title}
                    />

                    <InfoItem
                        label={t.createdAt}
                        value={formatDate(complaint.created_at)}
                    />
                </div>

                <InfoItem
                    label={fa.complaint.fields.description}
                    value={complaint.description}
                    fullWidth
                />

                <InfoItem
                    label={fa.complaint.fields.proposedSolution}
                    value={complaint.proposed_solution}
                    fullWidth
                />
            </section>

            <section className="details-section">
                <div className="details-section-header">
                    <div>
                        <h2>{fa.complaint.fields.attachments}</h2>
                        <span>
                            {t.attachmentCount}: {complaint.attachments.length}
                        </span>
                    </div>

                    {complaint.attachments.length > 1 && (
                        <Button
                            onClick={handleDownloadAll}
                            disabled={downloadingAll || downloadingId !== null}
                        >
                            {downloadingAll ? t.downloadingAll : t.downloadAll}
                        </Button>
                    )}
                </div>

                {downloadError && (
                    <div className="form-error">{downloadError}</div>
                )}

                {complaint.attachments.length === 0 ? (
                    <p className="empty-state">{t.noAttachments}</p>
                ) : (
                    <div className="attachments-list">
                        {complaint.attachments.map(attachment => (
                            <div
                                key={attachment.id}
                                className="attachment-item"
                            >
                                <div className="attachment-info">
                                    <span className="attachment-name">
                                        {attachment.original_name}
                                    </span>

                                    <span className="attachment-size">
                                        {formatFileSize(attachment.file_size)}
                                    </span>
                                </div>

                                <Button
                                    onClick={() =>
                                        handleDownload(
                                            attachment.id,
                                            attachment.original_name
                                        )
                                    }
                                    disabled={
                                        downloadingId !== null || downloadingAll
                                    }
                                >
                                    {downloadingId === attachment.id
                                        ? t.downloading
                                        : t.downloadFile}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

interface InfoItemProps {
    label: string;
    value?: string | null;
    fullWidth?: boolean;
}

function InfoItem({
                      label,
                      value,
                      fullWidth = false,
                  }: InfoItemProps) {
    return (
        <div className={`details-item ${fullWidth ? 'details-item-full' : ''}`}>
            <span className="details-label">{label}</span>
            <p className="details-value">{value || '-'}</p>
        </div>
    );
}
