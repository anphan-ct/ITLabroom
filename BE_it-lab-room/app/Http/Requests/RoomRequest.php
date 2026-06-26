<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class RoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $room = $this->route('room');
        $roomId = $room?->id;

        return [
            'ma_phong' => ['required', 'string', 'max:255', Rule::unique('phong_may', 'ma_phong')->ignore($roomId)],
            'ten_phong' => ['required', 'string', 'max:255'],
            'suc_chua' => ['required', 'integer', 'min:0'],
            'trang_thai' => ['nullable', 'string', 'in:active,maintenance,inactive'],
            'mo_ta' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'ma_phong.required' => 'Vui lòng nhập mã phòng.',
            'ma_phong.string' => 'Mã phòng không hợp lệ.',
            'ma_phong.max' => 'Mã phòng không được vượt quá 255 ký tự.',
            'ma_phong.unique' => 'Mã phòng đã tồn tại.',

            'ten_phong.required' => 'Vui lòng nhập tên phòng.',
            'ten_phong.string' => 'Tên phòng không hợp lệ.',
            'ten_phong.max' => 'Tên phòng không được vượt quá 255 ký tự.',

            'suc_chua.required' => 'Vui lòng nhập sức chứa.',
            'suc_chua.integer' => 'Sức chứa phải là số nguyên.',
            'suc_chua.min' => 'Sức chứa không được nhỏ hơn 0.',

            'trang_thai.string' => 'Trạng thái không hợp lệ.',
            'trang_thai.in' => 'Trạng thái phòng máy không hợp lệ.',

            'mo_ta.string' => 'Mô tả không hợp lệ.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu phòng máy không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
