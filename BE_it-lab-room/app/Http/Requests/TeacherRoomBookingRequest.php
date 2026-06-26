<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class TeacherRoomBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Nếu request dùng cho danh sách, chỉ validate query params.
        if ($this->isMethod('GET')) {
            return [
                'status' => ['nullable', 'string', 'in:pending,approved,rejected'],
            ];
        }

        // Nếu request dùng để gửi đăng ký, validate dữ liệu đặt phòng.
        return [
            'ma_phong' => ['required', 'integer', 'exists:phong_may,id'],
            'ngay_dat' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'so_tiet_bat_dau' => ['required', 'integer', 'min:1', 'max:12'],
            'so_tiet_ket_thuc' => [
                'required',
                'integer',
                'min:1',
                'max:12',
                'gte:so_tiet_bat_dau',
            ],
            'muc_dich' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'ma_phong.required' => 'Vui lòng chọn phòng máy.',
            'ma_phong.exists' => 'Phòng máy không tồn tại.',
            'ngay_dat.required' => 'Vui lòng chọn ngày đăng ký.',
            'ngay_dat.date_format' => 'Ngày đăng ký phải có định dạng Y-m-d.',
            'ngay_dat.after_or_equal' => 'Ngày đăng ký không được nhỏ hơn ngày hiện tại.',
            'so_tiet_bat_dau.required' => 'Vui lòng chọn tiết bắt đầu.',
            'so_tiet_bat_dau.integer' => 'Tiết bắt đầu không hợp lệ.',
            'so_tiet_bat_dau.min' => 'Tiết bắt đầu phải từ 1 trở lên.',
            'so_tiet_bat_dau.max' => 'Tiết bắt đầu không được lớn hơn 12.',
            'so_tiet_ket_thuc.required' => 'Vui lòng chọn tiết kết thúc.',
            'so_tiet_ket_thuc.integer' => 'Tiết kết thúc không hợp lệ.',
            'so_tiet_ket_thuc.min' => 'Tiết kết thúc phải từ 1 trở lên.',
            'so_tiet_ket_thuc.max' => 'Tiết kết thúc không được lớn hơn 12.',
            'so_tiet_ket_thuc.gte' => 'Tiết kết thúc phải lớn hơn hoặc bằng tiết bắt đầu.',
            'muc_dich.required' => 'Vui lòng nhập mục đích sử dụng phòng.',
            'muc_dich.max' => 'Mục đích không được quá 1000 ký tự.',
            'status.in' => 'Giá trị trạng thái không hợp lệ.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Dữ liệu yêu cầu đặt phòng không hợp lệ',
            'error_code' => 422,
            'data' => $validator->errors(),
        ], 422));
    }
}
