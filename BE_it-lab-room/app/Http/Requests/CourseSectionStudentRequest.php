<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class CourseSectionStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('get')) {
            return [
                'keyword' => ['nullable', 'string', 'max:255'],
                'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            ];
        }

        $courseSectionId = (int) $this->route('courseSection')?->id;
        $detailId = $this->route('courseSectionStudent')?->id;

        return [
            'ma_sinh_vien' => [
                'required',
                'integer',
                'exists:sinh_vien,id',
                Rule::unique('chi_tiet_lop_hoc_phan', 'ma_sinh_vien')
                    ->where('ma_lop_hoc_phan', $courseSectionId)
                    ->ignore($detailId),
            ],
            'trang_thai' => ['required', 'string', Rule::in(['active', 'inactive'])],
            'ghi_chu' => ['nullable', 'string', 'max:1000'],
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
            'ma_sinh_vien.unique' => 'Sinh viên đã có trong lớp học phần này.',
            'trang_thai.required' => 'Vui lòng chọn trạng thái.',
            'trang_thai.in' => 'Trạng thái sinh viên trong lớp học phần không hợp lệ.',
            'ghi_chu.string' => 'Ghi chú không hợp lệ.',
            'ghi_chu.max' => 'Ghi chú không được vượt quá 1000 ký tự.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu sinh viên lớp học phần không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
