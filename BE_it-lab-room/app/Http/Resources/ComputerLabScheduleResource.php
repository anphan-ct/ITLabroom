<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComputerLabScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_phong' => $this->ma_phong,
            'ma_lop' => $this->ma_lop,
            'ma_lop_hoc_phan' => $this->ma_lop_hoc_phan,
            'ma_giang_vien' => $this->ma_giang_vien,
            'ma_tuan' => $this->ma_tuan,
            'ngay_hoc_cu_the' => $this->ngay_hoc_cu_the?->format('Y-m-d'),
            'thu_trong_tuan' => $this->thu_trong_tuan,
            'so_tiet_bat_dau' => $this->so_tiet_bat_dau,
            'so_tiet_ket_thuc' => $this->so_tiet_ket_thuc,
            'loai_lich' => $this->loai_lich,
            'ma_dat_phong_may' => $this->ma_dat_phong_may,
            'trang_thai' => $this->trang_thai,
            'ghi_chu' => $this->ghi_chu,
            'phong' => $this->whenLoaded('room', fn () => [
                'id' => $this->room?->id,
                'ma_phong' => $this->room?->ma_phong,
                'ten_phong' => $this->room?->ten_phong,
            ]),
            'lop' => $this->whenLoaded('class', fn () => $this->class ? [
                'id' => $this->class->id,
                'ma_lop' => $this->class->ma_lop,
            ] : null),
            'lop_hoc_phan' => $this->whenLoaded('courseSection', fn () => [
                'id' => $this->courseSection?->id,
                'ma_lop_hoc_phan' => $this->courseSection?->ma_lop_hoc_phan,
                'mon_hoc' => $this->courseSection?->relationLoaded('subject')
                    ? $this->courseSection?->subject?->ten_mon
                    : null,
            ]),
            'giang_vien' => $this->whenLoaded('teacher', fn () => [
                'id' => $this->teacher?->id,
                'ma_giang_vien' => $this->teacher?->ma_giang_vien,
                'ho_ten' => $this->teacher?->relationLoaded('user')
                    ? $this->teacher?->user?->ho_ten
                    : null,
            ]),
            'tuan' => $this->whenLoaded('week', fn () => [
                'id' => $this->week?->id,
                'so_tuan' => $this->week?->so_tuan,
                'ngay_bat_dau' => $this->week?->ngay_bat_dau?->format('Y-m-d'),
                'ngay_ket_thuc' => $this->week?->ngay_ket_thuc?->format('Y-m-d'),
            ]),
        ];
    }
}
