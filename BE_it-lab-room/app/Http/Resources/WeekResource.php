<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeekResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_nam_hoc' => $this->ma_nam_hoc,
            'so_tuan' => $this->so_tuan,
            'ngay_bat_dau' => $this->ngay_bat_dau?->format('Y-m-d'),
            'ngay_ket_thuc' => $this->ngay_ket_thuc?->format('Y-m-d'),
        ];
    }
}
