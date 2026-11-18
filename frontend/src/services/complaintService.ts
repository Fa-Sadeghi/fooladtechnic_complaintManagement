
import api from './api';

import type {
    Complaint,
    PaginatedResponse,
    ComplaintFormOptions,
} from '../types/complaint';

interface ComplaintFilters {
    search?: string;
    page?: number;
    per_page?: number;
}

const complaintService = {
    getAll: async (filters: ComplaintFilters = {}) => {
        const response = await api.get<PaginatedResponse<Complaint>>(
            '/complaints',
            {
                params: filters,
            }
        );

        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<{ data: Complaint }>(
            `/complaints/${id}`
        );

        return response.data.data;
    },

    getFormOptions: async (): Promise<ComplaintFormOptions> => {
        const [serviceTypesResponse, reasonsResponse] = await Promise.all([
            api.get('/service-types'),
            api.get('/dissatisfaction-reasons'),
        ]);

        return {
            service_types: serviceTypesResponse.data.data,
            dissatisfaction_reasons: reasonsResponse.data.data,
        };
    },

    create: async (formData: FormData) => {
        const response = await api.post<{ data: Complaint }>(
            '/complaints',
            formData
        );

        return response.data.data;
    },

    delete: async (id: number) => {
        await api.delete(`/complaints/${id}`);
    },

    downloadAttachment: async (
        complaintId: number,
        attachmentId: number,
        fileName: string
    ) => {
        const response = await api.get(
            `/complaints/${complaintId}/attachments/${attachmentId}/download`,
            {
                responseType: 'blob',
            }
        );

        const blobUrl = window.URL.createObjectURL(response.data);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
    },
};

export default complaintService;
