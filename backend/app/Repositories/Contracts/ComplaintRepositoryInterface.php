<?php

namespace App\Repositories\Contracts;

use App\Models\Complaint;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ComplaintRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator;

    public function create(array $data, array $attachments = []): Complaint;

    public function find(Complaint $complaint): Complaint;

    public function update(
        Complaint $complaint,
        array $data,
        array $attachments = []
    ): Complaint;

    public function delete(Complaint $complaint): bool;

    public function findAttachment(int $complaintId, int $attachmentId);
}
