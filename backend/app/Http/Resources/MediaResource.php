<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'role' => $this->pivot->role ?? null,
            'is_primary' => (bool) ($this->pivot->is_primary ?? false),
            'sort_order' => $this->pivot->sort_order ?? $this->sort_order,
            'url' => $this->publicUrl(),
            'alt_text' => $this->alt_text,
        ];
    }
}
