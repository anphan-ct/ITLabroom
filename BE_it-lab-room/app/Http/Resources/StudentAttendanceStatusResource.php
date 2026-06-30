<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentAttendanceStatusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $attendance = $this->resource['attendance'] ?? null;
        $computer = $attendance?->computer;

        return [
            'id' => $attendance?->id,
            'attendance_status' => $attendance?->trang_thai ?? 'absent',
            'attendance_status_label' => $attendance ? 'Đã điểm danh' : 'Chưa điểm danh',
            'checked_in_at' => $attendance?->thoi_gian_check_in?->format('Y-m-d H:i:s'),
            'checked_in_time' => $attendance?->thoi_gian_check_in?->format('H:i'),
            'computer' => $computer ? [
                'id' => $computer->id,
                'code' => $computer->ma_may,
                'name' => $computer->ten_may,
                'position' => $computer->vi_tri,
                'qr_code' => $computer->ma_qr,
            ] : null,
            'note' => $attendance?->ghi_chu,
        ];
    }
}
