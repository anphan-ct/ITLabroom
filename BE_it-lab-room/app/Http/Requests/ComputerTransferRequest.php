<?php

namespace App\Http\Requests;

use App\Models\Computer;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ComputerTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ma_may_tinh'  => 'required|integer|exists:may_tinh,id',
            'ma_phong_moi' => 'required|integer|exists:phong_may,id',
            'ly_do'        => 'required|string|max:255',
            'ghi_chu'      => 'nullable|string',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $computer = Computer::find($this->input('ma_may_tinh'));

            if (!$computer) {
                return;
            }

            // Phòng mới không được trùng phòng hiện tại của máy
            if ((int) $this->input('ma_phong_moi') === (int) $computer->ma_phong) {
                $validator->errors()->add(
                    'ma_phong_moi',
                    'Phòng mới phải khác phòng hiện tại của máy tính.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'ma_may_tinh.required'  => 'Vui lòng chọn máy tính cần điều chuyển.',
            'ma_may_tinh.integer'   => 'Mã máy tính không hợp lệ.',
            'ma_may_tinh.exists'    => 'Máy tính không tồn tại trong hệ thống.',

            'ma_phong_moi.required' => 'Vui lòng chọn phòng mới.',
            'ma_phong_moi.integer'  => 'Phòng mới không hợp lệ.',
            'ma_phong_moi.exists'   => 'Phòng mới không tồn tại trong hệ thống.',

            'ly_do.required'        => 'Vui lòng nhập lý do điều chuyển.',
            'ly_do.string'          => 'Lý do điều chuyển không hợp lệ.',
            'ly_do.max'             => 'Lý do điều chuyển không được vượt quá 255 ký tự.',

            'ghi_chu.string'        => 'Ghi chú không hợp lệ.',
        ];
    }

    /**
     * Khi validate thất bại, trả response JSON theo chuẩn project.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status'     => false,
            'message'    => 'Dữ liệu điều chuyển không hợp lệ',
            'error_code' => 422,
            'data'       => $validator->errors(),
        ], 422));
    }
}
