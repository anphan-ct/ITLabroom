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
            'student_code' => $this->student_code,
            'full_name' => $this->whenLoaded('user', fn () => $this->user?->full_name),
            'email' => $this->whenLoaded('user', fn () => $this->user?->email),
            'role' => $this->role,
            'class_id' => $this->class_id,
            'course_year' => $this->course_year,
            'status' => $this->whenLoaded('user', fn () => $this->user?->status),
        ];
    }
}
