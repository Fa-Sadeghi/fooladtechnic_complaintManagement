
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import FileUpload from "../../components/common/FileUpload";
import Button from "../../components/common/Button";

import complaintService from "../../services/complaintService";
import type {
    ComplaintFormOptions,
    ComplaintFormData,
} from "../../types/complaint";

import fa from "../../locales/fa";

export default function ComplaintCreate() {
    const navigate = useNavigate();

    const [options, setOptions] = useState<ComplaintFormOptions>({
        service_types: [],
        dissatisfaction_reasons: [],
    });

    const [form, setForm] = useState<ComplaintFormData>({
        full_name: "",
        organization_name: "",
        email: "",
        mobile: "",
        landline: "",
        project_title: "",
        service_type_id: 0,
        dissatisfaction_reason_id: 0,
        description: "",
        proposed_solution: "",
        attachments: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        let active = true;

        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                setLoadError("");

                const result = await complaintService.getFormOptions();

                if (active) {
                    setOptions(result);
                }
            } catch {
                if (active) {
                    setLoadError(fa.messages.loadError);
                }
            } finally {
                if (active) {
                    setLoadingOptions(false);
                }
            }
        };

        loadOptions();

        return () => {
            active = false;
        };
    }, []);

    const updateField = (
        field: keyof ComplaintFormData,
        value: string | number
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: "",
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.full_name.trim()) {
            newErrors.full_name = fa.validation.fullNameRequired;
        }

        if (!form.organization_name.trim()) {
            newErrors.organization_name = fa.validation.organizationRequired;
        }

        if (!form.mobile.trim()) {
            newErrors.mobile = fa.validation.mobileRequired;
        }

        if (!form.project_title.trim()) {
            newErrors.project_title = fa.validation.projectRequired;
        }

        if (!form.service_type_id) {
            newErrors.service_type_id = fa.validation.serviceTypeRequired;
        }

        if (!form.dissatisfaction_reason_id) {
            newErrors.dissatisfaction_reason_id =
                fa.validation.reasonRequired;
        }

        if (!form.description.trim()) {
            newErrors.description = fa.validation.descriptionRequired;
        }

        if (
            form.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ) {
            newErrors.email = fa.validation.invalidEmail;
        }

        if (form.attachments.length > 10) {
            newErrors.attachments = fa.validation.maxFiles;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();

        formData.append("full_name", form.full_name.trim());
        formData.append("organization_name", form.organization_name.trim());
        formData.append("email", form.email.trim());
        formData.append("mobile", form.mobile.trim());
        formData.append("landline", form.landline.trim());
        formData.append("project_title", form.project_title.trim());
        formData.append("service_type_id", String(form.service_type_id));
        formData.append(
            "dissatisfaction_reason_id",
            String(form.dissatisfaction_reason_id)
        );
        formData.append("description", form.description.trim());
        formData.append(
            "proposed_solution",
            form.proposed_solution.trim()
        );

        form.attachments.forEach((file) => {
            formData.append("attachments[]", file);
        });

        try {
            setSubmitting(true);

            await complaintService.create(formData);

            window.alert(fa.messages.createSuccess);
            navigate("/complaints");
        } catch (error) {
            console.error("Complaint submission failed:", error);
            window.alert(fa.messages.createError);
        } finally {
            setSubmitting(false);
        }
    };

    const serviceTypeOptions = options.service_types.map((item) => ({
        value: item.id,
        label: item.title,
    }));

    const reasonOptions = options.dissatisfaction_reasons.map((item) => ({
        value: item.id,
        label: item.title,
    }));

    return (
        <div className="complaint-create-page">
            <div className="page-heading">
                <div>
                    <h1 className="page-title">
                        {fa.complaint.createTitle}
                    </h1>
                    <p className="page-description">
                        {fa.complaint.form.submitDescription}
                    </p>
                </div>
            </div>

            {loadError && (
                <div className="form-alert form-alert-error">
                    {loadError}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <section className="form-card">
                    <div className="form-card-heading">
                        <span className="form-section-number">01</span>
                        <div>
                            <h2>{fa.complaint.form.customerInformation}</h2>
                        </div>
                    </div>

                    <div className="form-grid">
                        <Input
                            label={fa.complaint.fields.fullName}
                            placeholder={fa.complaint.placeholders.fullName}
                            value={form.full_name}
                            onChange={(event) =>
                                updateField("full_name", event.target.value)
                            }
                            error={errors.full_name}
                            maxLength={150}
                            requiredField
                        />

                        <Input
                            label={fa.complaint.fields.organizationName}
                            placeholder={fa.complaint.placeholders.organizationName}
                            value={form.organization_name}
                            onChange={(event) =>
                                updateField(
                                    "organization_name",
                                    event.target.value
                                )
                            }
                            error={errors.organization_name}
                            maxLength={150}
                            requiredField
                        />

                        <Input
                            label={fa.complaint.fields.mobile}
                            placeholder={fa.complaint.placeholders.mobile}
                            value={form.mobile}
                            onChange={(event) =>
                                updateField("mobile", event.target.value)
                            }
                            error={errors.mobile}
                            maxLength={20}
                            numbersOnly
                            requiredField
                        />

                        <Input
                            label={fa.complaint.fields.email}
                            placeholder={fa.complaint.placeholders.email}
                            value={form.email}
                            onChange={(event) =>
                                updateField("email", event.target.value)
                            }
                            error={errors.email}
                            maxLength={150}
                        />

                        <Input
                            label={fa.complaint.fields.landline}
                            placeholder={fa.complaint.placeholders.landline}
                            value={form.landline}
                            onChange={(event) =>
                                updateField("landline", event.target.value)
                            }
                            maxLength={20}
                            numbersOnly
                        />
                    </div>
                </section>

                <section className="form-card">
                    <div className="form-card-heading">
                        <span className="form-section-number">02</span>
                        <div>
                            <h2>{fa.complaint.form.projectInformation}</h2>
                        </div>
                    </div>

                    <div className="form-grid">
                        <Input
                            label={fa.complaint.fields.projectTitle}
                            placeholder={fa.complaint.placeholders.projectTitle}
                            value={form.project_title}
                            onChange={(event) =>
                                updateField("project_title", event.target.value)
                            }
                            error={errors.project_title}
                            maxLength={200}
                            requiredField
                        />

                        <Select
                            label={fa.complaint.fields.serviceType}
                            placeholder={fa.complaint.placeholders.serviceType}
                            options={serviceTypeOptions}
                            value={String(form.service_type_id || "")}
                            onChange={(event) =>
                                updateField(
                                    "service_type_id",
                                    Number(event.target.value)
                                )
                            }
                            error={errors.service_type_id}
                            disabled={loadingOptions}
                            requiredField
                        />
                    </div>
                </section>

                <section className="form-card">
                    <div className="form-card-heading">
                        <span className="form-section-number">03</span>
                        <div>
                            <h2>{fa.complaint.form.complaintInformation}</h2>
                        </div>
                    </div>

                    <div className="form-grid">
                        <Select
                            label={fa.complaint.fields.dissatisfactionReason}
                            placeholder={
                                fa.complaint.placeholders.dissatisfactionReason
                            }
                            options={reasonOptions}
                            value={String(
                                form.dissatisfaction_reason_id || ""
                            )}
                            onChange={(event) =>
                                updateField(
                                    "dissatisfaction_reason_id",
                                    Number(event.target.value)
                                )
                            }
                            error={errors.dissatisfaction_reason_id}
                            disabled={loadingOptions}
                            requiredField
                        />

                        <div />

                        <Textarea
                            label={fa.complaint.fields.description}
                            placeholder={fa.complaint.placeholders.description}
                            value={form.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            error={errors.description}
                            rows={5}
                            requiredField
                        />

                        <Textarea
                            label={fa.complaint.fields.proposedSolution}
                            placeholder={
                                fa.complaint.placeholders.proposedSolution
                            }
                            value={form.proposed_solution}
                            onChange={(event) =>
                                updateField(
                                    "proposed_solution",
                                    event.target.value
                                )
                            }
                            rows={4}
                        />
                    </div>
                </section>

                <section className="form-card">
                    <div className="form-card-heading">
                        <span className="form-section-number">04</span>
                        <div>
                            <h2>{fa.complaint.form.attachmentInformation}</h2>
                        </div>
                    </div>

                    <FileUpload
                        files={form.attachments}
                        onChange={(files) =>
                            setForm((previous) => ({
                                ...previous,
                                attachments: files,
                            }))
                        }
                        error={errors.attachments}
                        maxFiles={10}
                        maxSize={10 * 1024 * 1024}
                        disabled={submitting}
                    />
                </section>

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/complaints")}
                        disabled={submitting}
                    >
                        {fa.common.cancel}
                    </Button>

                    <Button
                        type="submit"
                        loading={submitting}
                    >
                        {fa.common.submit}
                    </Button>
                </div>
            </form>
        </div>
    );
}
