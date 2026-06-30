<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    /**
     * Chuyển dữ liệu phòng ban sang payload API cho dropdown.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'department_code' => $this->ma_phong_ban,
            'department_name' => $this->ten_phong_ban,
            'status' => $this->trang_thai,
        ];
    }
}
