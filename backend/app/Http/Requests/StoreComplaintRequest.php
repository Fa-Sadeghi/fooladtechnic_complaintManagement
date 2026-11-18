<?php

namespace App\Http\Requests;

use App\Http\Resources\ComplaintAttachmentResource;
use App\Http\Resources\DissatisfactionReasonResource;
use App\Http\Resources\ServiceTypeResource;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:150'],

            'organization_name' => ['required', 'string', 'max:200'],

            'email' => ['nullable', 'email', 'max:150'],

            'mobile' => ['required', 'string', 'max:20'],

            'landline' => ['nullable', 'string', 'max:20'],

            'project_title' => ['required', 'string', 'max:200'],

            'service_type_id' => [
                'required',
                'integer',
                'exists:service_types,id',
            ],

            'dissatisfaction_reason_id' => [
                'required',
                'integer',
                'exists:dissatisfaction_reasons,id',
            ],

            'description' => ['required', 'string'],

            'proposed_solution' => ['nullable', 'string'],

            'attachments' => ['nullable', 'array', 'max:10'],

            'attachments.*' => [
                'file',
                'mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
                'max:10240',
            ],
        ];
    }
}
