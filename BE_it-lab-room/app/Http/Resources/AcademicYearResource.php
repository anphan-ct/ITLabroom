<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ten_nam_hoc' => $this->ten_nam_hoc,
            'ngay_bat_dau' => $this->ngay_bat_dau?->format('Y-m-d'),
            'ngay_ket_thuc' => $this->ngay_ket_thuc?->format('Y-m-d'),
            'trang_thai' => $this->resolveStatus(),
            'so_tuan' => $this->whenCounted('weeks'),
            'tuan' => WeekResource::collection($this->whenLoaded('weeks')),
        ];
    }

    private function resolveStatus(): string
    {
        $today = Carbon::today();

        if ($this->ngay_bat_dau && $today->lt($this->ngay_bat_dau)) {
            return 'upcoming';
        }

        if ($this->ngay_ket_thuc && $today->gt($this->ngay_ket_thuc)) {
            return 'completed';
        }

        return 'active';
    }
}
