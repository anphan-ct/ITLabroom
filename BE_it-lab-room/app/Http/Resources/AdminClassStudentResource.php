<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminClassStudentResource extends JsonResource
{
    /**
     * Chuyển dữ liệu sinh viên trong lớp sang payload gọn cho màn quản trị.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->ma_nguoi_dung,
            'student_code' => $this->ma_sinh_vien,
            'full_name' => $this->whenLoaded('user', fn () => $this->user?->ho_ten),
            'email' => $this->whenLoaded('user', fn () => $this->user?->email),
            'class_id' => $this->ma_lop,
            'class_code' => $this->whenLoaded('class', fn () => $this->class?->ma_lop),
            'course_year' => $this->nien_khoa,
            'status' => $this->whenLoaded('user', fn () => $this->user?->trang_thai),
        ];
    }
}
