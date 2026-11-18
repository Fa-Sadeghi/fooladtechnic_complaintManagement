<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'organization_name' => $this->organization_name,
            'email' => $this->email,
            'mobile' => $this->mobile,
            'landline' => $this->landline,
            'project_title' => $this->project_title,

            'service_type_id' => $this->service_type_id,
            'service_type' => new ServiceTypeResource(
                $this->whenLoaded('serviceType')
            ),

            'dissatisfaction_reason_id' => $this->dissatisfaction_reason_id,
            'dissatisfaction_reason' => new DissatisfactionReasonResource(
                $this->whenLoaded('dissatisfactionReason')
            ),

            'description' => $this->description,
            'proposed_solution' => $this->proposed_solution,

            'attachments' => ComplaintAttachmentResource::collection(
                $this->whenLoaded('attachments')
            ),

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
