<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'full_name',
        'organization_name',
        'email',
        'mobile',
        'landline',
        'project_title',
        'service_type_id',
        'dissatisfaction_reason_id',
        'description',
        'proposed_solution',
    ];

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function dissatisfactionReason(): BelongsTo
    {
        return $this->belongsTo(DissatisfactionReason::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ComplaintAttachment::class);
    }
}
