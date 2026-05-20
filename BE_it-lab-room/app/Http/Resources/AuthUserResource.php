<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserResource extends JsonResource
{
    /**
     * Chuyển dữ liệu user đăng nhập sang payload API, chỉ expose field cần thiết.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'address' => $this->address,
            'status' => $this->status,
            'role' => $this->whenLoaded('role', function () {
                return [
                    'id' => $this->role->id,
                    'role_name' => $this->role->role_name,
                    'description' => $this->role->description,
                ];
            }),
            'student' => $this->whenLoaded('student', function () {
                return $this->student ? [
                    'id' => $this->student->id,
                    'student_code' => $this->student->student_code,
                    'role' => $this->student->role,
                    'class_id' => $this->student->class_id,
                    'course_year' => $this->student->course_year,
                ] : null;
            }),
            'teacher' => $this->whenLoaded('teacher', function () {
                return $this->teacher ? [
                    'id' => $this->teacher->id,
                    'teacher_code' => $this->teacher->teacher_code,
                    'department' => $this->teacher->department,
                ] : null;
            }),
        ];
    }
}
