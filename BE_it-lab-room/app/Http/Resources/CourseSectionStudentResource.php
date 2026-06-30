<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSectionStudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $student = $this->whenLoaded('student', fn () => $this->student);

        return [
            'id' => $this->id,
            'detail_id' => $this->id,
            'source_type' => 'manual',
            'ma_lop_hoc_phan' => $this->ma_lop_hoc_phan,
            'ma_sinh_vien' => $this->ma_sinh_vien,
            'trang_thai' => $this->trang_thai,
            'ghi_chu' => $this->ghi_chu,
            'sinh_vien' => $this->whenLoaded('student', fn () => [
                'id' => $student?->id,
                'ma_sinh_vien' => $student?->ma_sinh_vien,
                'nien_khoa' => $student?->nien_khoa,
                'ho_ten' => $student?->user?->ho_ten,
                'email' => $student?->user?->email,
                'lop' => $student?->class ? [
                    'id' => $student->class->id,
                    'ma_lop' => $student->class->ma_lop,
                ] : null,
            ]),
        ];
    }
}
