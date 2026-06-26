<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomBookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'teacher' => $this->whenLoaded('teacher', fn () => [
                'id' => $this->teacher?->id,
                'code' => $this->teacher?->ma_giang_vien,
                'name' => $this->teacher?->relationLoaded('user')
                    ? $this->teacher?->user?->ho_ten
                    : null,
            ]),
            'room' => $this->whenLoaded('room', fn () => [
                'id' => $this->room?->id,
                'code' => $this->room?->ma_phong,
                'name' => $this->room?->ten_phong,
            ]),
            'date' => $this->ngay_dat?->format('Y-m-d'),
            'lesson_start' => $this->tiet_bat_dau,
            'lesson_end' => $this->tiet_ket_thuc,
            'purpose' => $this->muc_dich,
            'approval_status' => $this->trang_thai_duyet,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
