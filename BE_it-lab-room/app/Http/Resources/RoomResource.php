<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_phong' => $this->ma_phong,
            'ten_phong' => $this->ten_phong,
            'vi_tri' => $this->vi_tri,
            'suc_chua' => $this->suc_chua,
            'trang_thai' => $this->trang_thai,
            'mo_ta' => $this->mo_ta,
        ];
    }
}
