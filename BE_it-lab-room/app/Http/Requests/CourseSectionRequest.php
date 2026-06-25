<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class CourseSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->isMethod('GET')) {
            return;
        }

        $this->merge([
            'ma_lop_hoc_phan' => is_string($this->ma_lop_hoc_phan)
                ? strtoupper(trim($this->ma_lop_hoc_phan))
                : $this->ma_lop_hoc_phan,
            'ghi_chu' => is_string($this->ghi_chu)
                ? trim($this->ghi_chu)
                : $this->ghi_chu,
        ]);
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return [
                'search' => ['nullable', 'string', 'max:100'],
            ];
        }

        $courseSection = $this->route('courseSection');

        return [
            'ma_lop_hoc_phan' => [
                'required',
                'string',
                'max:255',
                Rule::unique('lop_hoc_phan', 'ma_lop_hoc_phan')->ignore($courseSection?->id),
            ],
            'ma_mon' => ['required', 'integer', 'exists:mon_hoc,id'],
            'ma_nam_hoc' => ['required', 'integer', 'exists:nam_hoc,id'],
            'ma_phong' => ['nullable', 'integer', 'exists:phong_may,id'],
            'ma_giang_vien' => ['nullable', 'integer', 'exists:giang_vien,id'],
            'si_so_toi_da' => ['required', 'integer', 'min:1', 'max:10000'],
            'trang_thai' => ['required', Rule::in(['active', 'paused', 'completed'])],
            'ghi_chu' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'search.string' => 'Từ khóa tìm kiếm không hợp lệ.',
            'search.max' => 'Từ khóa tìm kiếm không được vượt quá 100 ký tự.',

            'ma_lop_hoc_phan.required' => 'Vui lòng nhập mã lớp học phần.',
            'ma_lop_hoc_phan.string' => 'Mã lớp học phần không hợp lệ.',
            'ma_lop_hoc_phan.max' => 'Mã lớp học phần không được vượt quá 255 ký tự.',
            'ma_lop_hoc_phan.unique' => 'Mã lớp học phần đã tồn tại.',
            'ma_mon.required' => 'Vui lòng chọn môn học.',
            'ma_mon.integer' => 'Môn học không hợp lệ.',
            'ma_mon.exists' => 'Môn học không tồn tại.',
            'ma_nam_hoc.required' => 'Vui lòng chọn năm học.',
            'ma_nam_hoc.integer' => 'Năm học không hợp lệ.',
            'ma_nam_hoc.exists' => 'Năm học không tồn tại.',
            'ma_phong.integer' => 'Phòng máy không hợp lệ.',
            'ma_phong.exists' => 'Phòng máy không tồn tại.',
            'ma_giang_vien.integer' => 'Giảng viên không hợp lệ.',
            'ma_giang_vien.exists' => 'Giảng viên không tồn tại.',
            'si_so_toi_da.required' => 'Vui lòng nhập sĩ số tối đa.',
            'si_so_toi_da.integer' => 'Sĩ số tối đa phải là số nguyên.',
            'si_so_toi_da.min' => 'Sĩ số tối đa phải lớn hơn 0.',
            'si_so_toi_da.max' => 'Sĩ số tối đa không được vượt quá 10000.',
            'trang_thai.required' => 'Vui lòng chọn trạng thái.',
            'trang_thai.in' => 'Trạng thái lớp học phần không hợp lệ.',
            'ghi_chu.string' => 'Ghi chú không hợp lệ.',
            'ghi_chu.max' => 'Ghi chú không được vượt quá 2000 ký tự.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => $this->isMethod('GET')
                ? 'Dữ liệu tìm kiếm lớp học phần không hợp lệ'
                : 'Dữ liệu lớp học phần không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}