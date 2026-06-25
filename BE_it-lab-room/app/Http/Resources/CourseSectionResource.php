<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $assignment = $this->relationLoaded('assignments')
            ? $this->assignments->first()
            : null;

        return [
            'id' => $this->id,
            'ma_lop_hoc_phan' => $this->ma_lop_hoc_phan,
            'ma_mon' => $this->ma_mon,
            'ma_nam_hoc' => $this->ma_nam_hoc,
            'ma_phong' => $this->ma_phong,
            'ma_giang_vien' => $assignment?->ma_giang_vien,
            'si_so_toi_da' => $this->si_so_toi_da,
            'trang_thai' => $this->trang_thai,
            'ghi_chu' => $this->ghi_chu,
            'mon_hoc' => $this->whenLoaded('subject', fn () => [
                'id' => $this->subject?->id,
                'ma_mon_hoc' => $this->subject?->ma_mon_hoc,
                'ten_mon' => $this->subject?->ten_mon,
            ]),
            'nam_hoc' => $this->whenLoaded('academicYear', fn () => [
                'id' => $this->academicYear?->id,
                'ten_nam_hoc' => $this->academicYear?->ten_nam_hoc,
            ]),
            'phong' => $this->whenLoaded('room', fn () => [
                'id' => $this->room?->id,
                'ma_phong' => $this->room?->ma_phong,
                'ten_phong' => $this->room?->ten_phong,
            ]),
            'giang_vien' => $this->whenLoaded('assignments', fn () => $assignment ? [
                'id' => $assignment->teacher?->id,
                'ma_giang_vien' => $assignment->teacher?->ma_giang_vien,
                'ho_ten' => $assignment->teacher?->user?->ho_ten,
            ] : null),
            'so_sinh_vien' => $this->whenCounted('studentDetails'),
        ];
    }
}
