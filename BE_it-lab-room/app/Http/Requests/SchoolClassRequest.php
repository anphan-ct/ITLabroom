<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class SchoolClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'ma_lop' => is_string($this->ma_lop) ? strtoupper(trim($this->ma_lop)) : $this->ma_lop,
            'nien_khoa' => is_string($this->nien_khoa) ? trim($this->nien_khoa) : $this->nien_khoa,
            'chuyen_nganh' => is_string($this->chuyen_nganh) ? trim($this->chuyen_nganh) : $this->chuyen_nganh,
        ]);
    }

    public function rules(): array
    {
        $class = $this->route('class');

        return [
            'ma_lop' => [
                'required',
                'string',
                'max:50',
                Rule::unique('lop_hoc', 'ma_lop')->ignore($class?->id),
            ],
            'nien_khoa' => ['required', 'string', 'max:50'],
            'chuyen_nganh' => ['required', 'string', 'max:255'],
            'ma_giang_vien' => ['nullable', 'integer', 'exists:giang_vien,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'ma_lop.required' => 'Vui lòng nhập mã lớp.',
            'ma_lop.string' => 'Mã lớp không hợp lệ.',
            'ma_lop.max' => 'Mã lớp không được vượt quá 50 ký tự.',
            'ma_lop.unique' => 'Mã lớp đã tồn tại.',
            'nien_khoa.required' => 'Vui lòng nhập niên khóa.',
            'nien_khoa.string' => 'Niên khóa không hợp lệ.',
            'nien_khoa.max' => 'Niên khóa không được vượt quá 50 ký tự.',
            'chuyen_nganh.required' => 'Vui lòng nhập chuyên ngành.',
            'chuyen_nganh.string' => 'Chuyên ngành không hợp lệ.',
            'chuyen_nganh.max' => 'Chuyên ngành không được vượt quá 255 ký tự.',
            'ma_giang_vien.integer' => 'Giảng viên chủ nhiệm không hợp lệ.',
            'ma_giang_vien.exists' => 'Giảng viên chủ nhiệm không tồn tại.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu lớp học không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
