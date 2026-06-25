<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class AdminRoomBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return [
                'status' => ['nullable', 'string', Rule::in(['pending', 'approved', 'rejected'])],
                'keyword' => ['nullable', 'string', 'max:255'],
                'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            ];
        }

        return [
            'approval_status' => ['required', 'string', Rule::in(['approved', 'rejected'])],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Trạng thái duyệt không hợp lệ.',
            'keyword.string' => 'Từ khóa tìm kiếm không hợp lệ.',
            'keyword.max' => 'Từ khóa tìm kiếm không được vượt quá 255 ký tự.',
            'per_page.integer' => 'Số dòng mỗi trang phải là số nguyên.',
            'per_page.min' => 'Số dòng mỗi trang phải từ 1 trở lên.',
            'per_page.max' => 'Số dòng mỗi trang không được vượt quá 100.',

            'approval_status.required' => 'Vui lòng chọn trạng thái duyệt.',
            'approval_status.in' => 'Trạng thái duyệt không hợp lệ.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => $this->isMethod('GET')
                ? 'Dữ liệu lọc đăng ký phòng không hợp lệ'
                : 'Dữ liệu duyệt đăng ký phòng không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}