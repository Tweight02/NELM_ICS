<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ParticularItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'par_item_id'        => $this->par_item_id,
            'particular_name'    => $this->whenLoaded('particular', fn () => $this->particular->particular_name),
            'program_name'       => $this->whenLoaded('particular', fn () => $this->particular->program?->program_name),
            'department_name'    => $this->whenLoaded('particular', fn () => $this->particular->program?->department?->department_name),
            'church_name'        => $this->whenLoaded('church', fn () => $this->church->name),
            'quarter'            => $this->quarter,
            'year'               => $this->year,
            'particulars_value'  => $this->particulars_value,
            'status'             => $this->status,
            'date_submitted'     => $this->date_submitted,
            'date_approved'      => $this->date_approved,
            'submitted_by'       => $this->whenLoaded('submitter', fn () => $this->submitter->first_name . ' ' . $this->submitter->last_name),
            'endorsed_by'        => $this->whenLoaded('endorser', fn () => $this->endorser->first_name . ' ' . $this->endorser->last_name),
            'approved_by'        => $this->whenLoaded('approver', fn () => $this->approver->first_name . ' ' . $this->approver->last_name),
            'can_edit'           => $request->user()->can('update', $this->resource),
        ];
    }
}