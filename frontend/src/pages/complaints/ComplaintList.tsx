import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import DataTable from "../../components/common/DataTable";

import complaintService from "../../services/complaintService";

import type {
    Complaint,
    PaginatedResponse,
} from "../../types/complaint";

import fa from "../../locales/fa";

export default function ComplaintList() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    const loadComplaints = useCallback(async () => {
        try {
            setLoading(true);

            const response: PaginatedResponse<Complaint> =
                await complaintService.getAll({
                    search: search.trim(),
                    page,
                    per_page: 10,
                });

            setComplaints(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to load complaints:", error);
            window.alert(fa.messages.loadError);
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        loadComplaints();
    }, [loadComplaints]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            fa.messages.deleteConfirmation
        );

        if (!confirmed) return;

        try {
            await complaintService.delete(id);

            window.alert(fa.messages.deleteSuccess);

            if (complaints.length === 1 && page > 1) {
                setPage((previous) => previous - 1);
            } else {
                loadComplaints();
            }
        } catch (error) {
            console.error("Failed to delete complaint:", error);
            window.alert(fa.messages.deleteError);
        }
    };

    const columns = [
        {
            key: "id",
            title: fa.complaint.table.trackingCode,
            width: "90px",
            render: (item: Complaint) => (
                <span className="complaint-code">
                    #{item.id}
                </span>
            ),
        },
        {
            key: "full_name",
            title: fa.complaint.table.customer,
            render: (item: Complaint) => (
                <span className="table-primary-text">
                    {item.full_name}
                </span>
            ),
        },
        {
            key: "organization_name",
            title: fa.complaint.table.organization,
        },
        {
            key: "project_title",
            title: fa.complaint.table.project,
        },
        {
            key: "service_type",
            title: fa.complaint.table.serviceType,
            render: (item: Complaint) => (
                <span className="service-type-badge">
                    {item.service_type?.title ?? "—"}
                </span>
            ),
        },
        {
            key: "created_at",
            title: fa.complaint.table.registrationDate,
            render: (item: Complaint) => (
                <span dir="ltr">
                    {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("fa-IR")
                        : "—"}
                </span>
            ),
        },
        {
            key: "actions",
            title: fa.complaint.table.actions,
            width: "150px",
            render: (item: Complaint) => (
                <div className="table-actions">
                    <button
                        type="button"
                        className="table-action-btn view"
                        title={fa.common.view}
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/complaints/${item.id}`);
                        }}
                    >
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="table-action-btn delete"
                        title={fa.common.delete}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(item.id);
                        }}
                    >
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="m19 6-1 14H6L5 6" />
                            <path d="M10 11v5M14 11v5" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="complaint-list-page">
            <div className="page-heading">
                <div>
                    <h1 className="page-title">
                        {fa.complaint.listTitle}
                    </h1>
                    <p className="page-description">
                        {fa.complaint.listDescription}
                    </p>
                </div>

                <Button onClick={() => navigate("/complaints/create")}>
                    {fa.complaint.createTitle}
                </Button>
            </div>

            <div className="list-toolbar">
                <div className="list-search">
                    <Input
                        placeholder={fa.complaint.placeholders.search}
                        value={search}
                        onChange={(event) =>
                            handleSearch(event.target.value)
                        }
                    />
                </div>
            </div>

            <div className="complaint-table-card">
                <DataTable
                    columns={columns}
                    data={complaints}
                    rowKey="id"
                    loading={loading}
                    emptyMessage={fa.messages.noComplaints}
                />
            </div>

            {meta.last_page > 1 && (
                <div className="pagination">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((previous) => previous - 1)}
                    >
                        {fa.common.back}
                    </Button>

                    <span className="pagination-info">
                        {meta.current_page} / {meta.last_page}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= meta.last_page || loading}
                        onClick={() => setPage((previous) => previous + 1)}
                    >
                        {fa.common.view}
                    </Button>
                </div>
            )}
        </div>
    );
}
