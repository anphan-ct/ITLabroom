<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ClassStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if (! $this->isMethod('get')) {
            return [
                'ma_sinh_vien' => ['required', 'integer', 'exists:sinh_vien,id'],
                'nien_khoa' => ['nullable', 'string', 'max:50'],
            ];
        }

        return [
            'keyword' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'keyword.string' => 'Từ khóa tìm kiếm không hợp lệ.',
            'keyword.max' => 'Từ khóa tìm kiếm không được vượt quá 255 ký tự.',
            'per_page.integer' => 'Số bản ghi mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số bản ghi mỗi trang phải từ 1 trở lên.',
            'per_page.max' => 'Số bản ghi mỗi trang không được vượt quá 100.',
            'ma_sinh_vien.required' => 'Vui lòng chọn sinh viên.',
            'ma_sinh_vien.integer' => 'Sinh viên không hợp lệ.',
            'ma_sinh_vien.exists' => 'Sinh viên không tồn tại.',
            'nien_khoa.string' => 'Niên khóa không hợp lệ.',
            'nien_khoa.max' => 'Niên khóa không được vượt quá 50 ký tự.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu lọc sinh viên không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
