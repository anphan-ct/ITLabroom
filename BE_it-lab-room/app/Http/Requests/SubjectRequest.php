<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class SubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $subject = $this->route('subject');

        return [
            'ma_mon_hoc' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('mon_hoc', 'ma_mon_hoc')->ignore($subject?->id),
            ],
            'ten_mon' => [
                'required',
                'string',
                'max:255',
                Rule::unique('mon_hoc', 'ten_mon')->ignore($subject?->id),
            ],
            'loai_mon' => ['required', 'string', Rule::in(['LT', 'TH'])],
            'so_tin_chi' => ['required', 'integer', 'min:1', 'max:10'],
            'mo_ta' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'ma_mon_hoc.string' => 'Mã môn học không hợp lệ.',
            'ma_mon_hoc.max' => 'Mã môn học không được vượt quá 255 ký tự.',
            'ma_mon_hoc.unique' => 'Mã môn học đã tồn tại.',
            'ten_mon.required' => 'Vui lòng nhập tên môn học.',
            'ten_mon.string' => 'Tên môn học không hợp lệ.',
            'ten_mon.max' => 'Tên môn học không được vượt quá 255 ký tự.',
            'ten_mon.unique' => 'Tên môn học đã tồn tại.',
            'loai_mon.required' => 'Vui lòng chọn loại môn học.',
            'loai_mon.in' => 'Loại môn học chỉ nhận giá trị LT hoặc TH.',
            'so_tin_chi.required' => 'Vui lòng nhập số tín chỉ.',
            'so_tin_chi.integer' => 'Số tín chỉ phải là số nguyên.',
            'so_tin_chi.min' => 'Số tín chỉ phải từ 1 trở lên.',
            'so_tin_chi.max' => 'Số tín chỉ không được vượt quá 10.',
            'mo_ta.string' => 'Mô tả môn học không hợp lệ.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu môn học không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
