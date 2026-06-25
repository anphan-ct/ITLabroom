<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ma_mon_hoc' => $this->ma_mon_hoc,
            'ten_mon' => $this->ten_mon,
            'loai_mon' => $this->loai_mon,
            'so_tin_chi' => $this->so_tin_chi,
            'mo_ta' => $this->mo_ta,
        ];
    }
}
