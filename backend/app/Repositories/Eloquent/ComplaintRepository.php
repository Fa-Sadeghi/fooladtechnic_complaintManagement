<?php

namespace App\Repositories\Eloquent;

use App\Models\Complaint;
use App\Repositories\Contracts\ComplaintRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ComplaintRepository implements ComplaintRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = Complaint::query()
            ->with([
                'serviceType',
                'dissatisfactionReason',
                'attachments',
            ]);

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($query) use ($search) {
                $query->where('full_name', 'like', "%{$search}%")
                    ->orWhere('organization_name', 'like', "%{$search}%")
                    ->orWhere('project_title', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return $query
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data, array $attachments = []): Complaint
    {
        $complaint = Complaint::create($data);

        if (!empty($attachments)) {
            $complaint->attachments()->createMany($attachments);
        }

        return $complaint->load([
            'serviceType',
            'dissatisfactionReason',
            'attachments',
        ]);
    }

    public function find(Complaint $complaint): Complaint
    {
        return $complaint->load([
            'serviceType',
            'dissatisfactionReason',
            'attachments',
        ]);
    }

    public function update(
        Complaint $complaint,
        array $data,
        array $attachments = []
    ): Complaint {
        $complaint->update($data);

        if (!empty($attachments)) {
            $complaint->attachments()->createMany($attachments);
        }

        return $complaint->load([
            'serviceType',
            'dissatisfactionReason',
            'attachments',
        ]);
    }

    public function delete(Complaint $complaint): bool
    {
        return (bool) $complaint->delete();
    }

    public function findAttachment(int $complaintId, int $attachmentId)
    {
        return \App\Models\ComplaintAttachment::query()
            ->where('complaint_id', $complaintId)
            ->whereKey($attachmentId)
            ->firstOrFail();
    }
}
