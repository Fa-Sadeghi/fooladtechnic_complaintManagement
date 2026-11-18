
export interface ServiceType {
    id: number;
    title: string;
}

export interface DissatisfactionReason {
    id: number;
    title: string;
}

export interface ComplaintAttachment {
    id: number;
    original_name: string;
    mime_type: string | null;
    file_size: number;
}

export interface Complaint {
    id: number;
    full_name: string;
    organization_name: string;
    email: string | null;
    mobile: string;
    landline: string | null;
    project_title: string;

    service_type_id: number;
    service_type: ServiceType;

    dissatisfaction_reason_id: number;
    dissatisfaction_reason: DissatisfactionReason;

    description: string;
    proposed_solution: string | null;

    attachments: ComplaintAttachment[];
    created_at: string;
}

export interface ComplaintFormData {
    full_name: string;
    organization_name: string;
    email: string;
    mobile: string;
    landline: string;
    project_title: string;
    service_type_id: number;
    dissatisfaction_reason_id: number;
    description: string;
    proposed_solution: string;
    attachments: File[];
}


export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface ComplaintFormOptions {
    service_types: ServiceType[];
    dissatisfaction_reasons: DissatisfactionReason[];
}


