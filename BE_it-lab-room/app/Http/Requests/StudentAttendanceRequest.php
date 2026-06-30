<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StudentAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return [];
        }

        return [
            'ma_may_tinh' => ['nullable', 'integer', 'exists:may_tinh,id', 'required_without:ma_qr'],
            'ma_qr' => ['nullable', 'string', 'max:255', 'required_without:ma_may_tinh'],
        ];
    }

    public function messages(): array
    {
        return [
            'ma_may_tinh.required_without' => 'Vui lòng chọn máy tính hoặc nhập mã QR.',
            'ma_may_tinh.integer' => 'Máy tính không hợp lệ.',
            'ma_may_tinh.exists' => 'Máy tính không tồn tại.',
            'ma_qr.required_without' => 'Vui lòng nhập mã QR hoặc chọn máy tính.',
            'ma_qr.string' => 'Mã QR không hợp lệ.',
            'ma_qr.max' => 'Mã QR không được vượt quá 255 ký tự.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu điểm danh không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
