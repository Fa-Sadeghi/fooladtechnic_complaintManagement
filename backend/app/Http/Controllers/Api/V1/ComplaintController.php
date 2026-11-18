<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use App\Services\ComplaintService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;


class ComplaintController extends Controller
{
    public function __construct(
        private ComplaintService $complaintService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $complaints = $this->complaintService->getComplaints(
            $request->only(['search', 'per_page'])
        );

        return ComplaintResource::collection($complaints);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreComplaintRequest $request): JsonResponse
    {
        $complaint = $this->complaintService->createComplaint(
            $request->validated()
        );

        return (new ComplaintResource($complaint))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Complaint $complaint): ComplaintResource
    {
        $complaint = $this->complaintService->getComplaint($complaint);

        return new ComplaintResource($complaint);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        StoreComplaintRequest $request,
        Complaint $complaint
    ): ComplaintResource {
        $updatedComplaint = $this->complaintService->updateComplaint(
            $complaint,
            $request->validated()
        );

        return new ComplaintResource($updatedComplaint);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Complaint $complaint): JsonResponse
    {
        $this->complaintService->deleteComplaint($complaint);

        return response()->json(null, 204);
    }

    public function downloadAttachment(
        int $complaintId,
        int $attachmentId
    ) {
        $attachment = $this->complaintService->getAttachment(
            $complaintId,
            $attachmentId
        );

        $disk = \Illuminate\Support\Facades\Storage::disk('local');

        abort_unless(
            $disk->exists($attachment->file_path),
            404,
            ''
        );

        return $disk->download(
            $attachment->file_path,
            $attachment->file_name
        );
    }
}
