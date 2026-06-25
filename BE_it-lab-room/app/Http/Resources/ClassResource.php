<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassResource extends JsonResource
{
    /**
     * Chuyển dữ liệu lớp học sang payload API cho dropdown.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'class_code' => $this->ma_lop,
            'course_year' => $this->nien_khoa,
            'major' => $this->chuyen_nganh,
        ];
    }
}
