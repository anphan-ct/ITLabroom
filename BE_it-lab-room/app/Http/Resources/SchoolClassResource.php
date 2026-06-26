<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolClassResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_lop' => $this->ma_lop,
            'nien_khoa' => $this->nien_khoa,
            'chuyen_nganh' => $this->chuyen_nganh,
            'ma_giang_vien' => $this->ma_giang_vien,
            'giang_vien' => $this->whenLoaded('teacher', fn () => [
                'id' => $this->teacher?->id,
                'ma_giang_vien' => $this->teacher?->ma_giang_vien,
                'ho_ten' => $this->teacher?->user?->ho_ten,
            ]),
            'so_sinh_vien' => $this->whenCounted('students'),
        ];
    }
}
