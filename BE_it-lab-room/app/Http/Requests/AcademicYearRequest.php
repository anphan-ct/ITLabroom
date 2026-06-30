<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class AcademicYearRequest extends FormRequest
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
            'ten_nam_hoc' => is_string($this->ten_nam_hoc)
                ? trim($this->ten_nam_hoc)
                : $this->ten_nam_hoc,
        ]);
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return [
                'status' => ['nullable', Rule::in(['active', 'completed', 'upcoming'])],
                'search' => ['nullable', 'string', 'max:100'],
            ];
        }

        $academicYear = $this->route('academicYear');

        return [
            'ten_nam_hoc' => [
                'required',
                'string',
                'max:20',
                Rule::unique('nam_hoc', 'ten_nam_hoc')->ignore($academicYear?->id),
            ],
            'ngay_bat_dau' => ['required', 'date'],
            'ngay_ket_thuc' => ['required', 'date', 'after_or_equal:ngay_bat_dau'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái năm học không hợp lệ.',
            'search.string' => 'Từ khóa tìm kiếm không hợp lệ.',
            'search.max' => 'Từ khóa tìm kiếm không được vượt quá 100 ký tự.',
            'ten_nam_hoc.required' => 'Vui lòng nhập tên năm học.',
            'ten_nam_hoc.max' => 'Tên năm học không được vượt quá 20 ký tự.',
            'ten_nam_hoc.unique' => 'Tên năm học đã tồn tại.',
            'ngay_bat_dau.required' => 'Vui lòng chọn ngày bắt đầu.',
            'ngay_bat_dau.date' => 'Ngày bắt đầu không hợp lệ.',
            'ngay_ket_thuc.required' => 'Vui lòng chọn ngày kết thúc.',
            'ngay_ket_thuc.date' => 'Ngày kết thúc không hợp lệ.',
            'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => $this->isMethod('GET')
                ? 'Dữ liệu tìm kiếm năm học không hợp lệ'
                : 'Dữ liệu năm học không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
