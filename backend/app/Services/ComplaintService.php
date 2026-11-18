<?php

namespace App\Services;

use App\Repositories\Contracts\ComplaintRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Complaint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class ComplaintService
{
    public function __construct(
        private ComplaintRepositoryInterface $complaintRepository
    ) {}

    public function getComplaints(array $filters = []): LengthAwarePaginator
    {
        return $this->complaintRepository->paginate($filters);
    }

    public function createComplaint(array $data): Complaint
    {
        $files = $data['attachments'] ?? [];

        unset($data['attachments']);

        $storedPaths = [];

        try {
            return DB::transaction(function () use (
                $data,
                $files,
                &$storedPaths
            ) {
                $attachments = $this->storeAttachments(
                    $files,
                    $storedPaths
                );

                return $this->complaintRepository->create(
                    $data,
                    $attachments
                );
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);

            throw $exception;
        }
    }

    public function getComplaint(Complaint $complaint): Complaint
    {
        return $this->complaintRepository->find($complaint);
    }

    public function updateComplaint(
        Complaint $complaint,
        array $data
    ): Complaint {
        $files = $data['attachments'] ?? [];

        unset($data['attachments']);

        $storedPaths = [];

        try {
            return DB::transaction(function () use (
                $complaint,
                $data,
                $files,
                &$storedPaths
            ) {
                $attachments = $this->storeAttachments(
                    $files,
                    $storedPaths
                );

                return $this->complaintRepository->update(
                    $complaint,
                    $data,
                    $attachments
                );
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);

            throw $exception;
        }
    }

    public function deleteComplaint(Complaint $complaint): bool
    {
        return $this->complaintRepository->delete($complaint);
    }

    private function storeAttachments(
        array $files,
        array &$storedPaths
    ): array {
        $attachments = [];

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store('complaints', 'local');

            if (!$path) {
                throw new RuntimeException(
                    'Unable to store complaint attachment.'
                );
            }

            $storedPaths[] = $path;

            $attachments[] = [
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
            ];
        }

        return $attachments;
    }

    public function getAttachment(int $complaintId, int $attachmentId)
    {
        return $this->complaintRepository->findAttachment(
            $complaintId,
            $attachmentId
        );
    }
}
